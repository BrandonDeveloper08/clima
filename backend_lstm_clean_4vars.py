# -*- coding: utf-8 -*-

import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
import tensorflow as tf

tf.random.set_seed(42)
try:
    tf.config.experimental.enable_op_determinism()
except Exception:
    pass

import io
import math
import json
import time
import base64
import datetime as dt

import numpy as np
import pandas as pd
import xarray as xr
import requests

from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense
from keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint

# =========================
# ======= CONFIG ==========
# =========================

# --- Ruta NetCDF local (TU ARCHIVO) ---
NC_PATH = r"temperatura_2019.nc"

# --- Variable de temperatura dentro del NetCDF ---
NC_TEMPERATURE_VARNAME = None

# --- Frecuencia de trabajo (daily recomendado para proyección 1 mes) ---
TARGET_FREQ = "1D"

# --- Parámetros para Meteomatics ---
MET_USER = "linogarcia_yenso"
MET_PASS = "eBCQ7aI6MhpvMg9SCkno"

# Coordenadas objetivo - Perú
LAT = -12.04318  # Centro de Perú (promedio entre -0.0392818 y -20.1984472)
LON = -77.02824  # Centro de Perú (promedio entre -68.6519906 y -84.6356535)
MET_PARAM = "t_2m:C"
MET_INTERVAL = "P1D" if TARGET_FREQ.upper() == "1D" else "PT1H"

# --- Ventanas y horizonte ---
LOOKBACK_DAYS = 30
FORECAST_DAYS = 180  # 6 meses (aproximadamente 180 días)


START_DATE = "2019-10-01"
END_DATE   = "2025-10-01"


# --- Entrenamiento ---
EPOCHS = 200
BATCH_SIZE = 32
VALIDATION_SPLIT = 0.15
RANDOM_SEED = 42
MODEL_DIR = "./models"
OUTPUT_DIR = "./outputs"
MODEL_NAME = "lstm_temp_peru_2019_2025.h5"
RESULTS_CSV = "forecastt_6months_peru_2019_2025.csv"

np.random.seed(RANDOM_SEED)

def ensure_dirs():
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def detect_temp_var(ds: xr.Dataset):
    candidates = ["t2m", "t_2m", "temperature", "temp", "air_temperature", "t"]
    for c in candidates:
        if c in ds.data_vars:
            return c
    for v in ds.data_vars:
        if "temp" in v.lower():
            return v
    return list(ds.data_vars)[0] if len(ds.data_vars) else None

def load_nc_series(nc_path: str, varname: str | None, target_freq: str) -> pd.Series:
    ds = xr.open_dataset(nc_path)
    v = varname or detect_temp_var(ds)
    if v is None:
        raise ValueError("No se pudo detectar la variable de temperatura en el NetCDF.")
    
    da = ds[v]
    if "time" not in da.dims and "time" in ds.dims:
        da = da.swap_dims({list(ds.dims)[0]: "time"})
    
    spatial_dims = [d for d in da.dims if d.lower() in ("lat", "latitude", "lon", "longitude")]
    if spatial_dims:
        da = da.mean(dim=spatial_dims, keep_attrs=True)
    
    series = da.to_series().sort_index()
    series.index = pd.to_datetime(series.index)
    series = series.resample(target_freq).mean().dropna()
    series.name = "temperature_nc"
    return series

def fetch_meteomatics_historical(lat: float, lon: float, start_date: str, end_date: str, target_freq: str) -> pd.Series:
    """Descarga datos históricos de Meteomatics para el rango especificado"""
    start = pd.to_datetime(start_date).tz_localize("UTC")
    end = pd.to_datetime(end_date).tz_localize("UTC")
    
    start_str = start.isoformat().replace("+00:00", "Z")
    end_str = end.isoformat().replace("+00:00", "Z")

    base = "https://api.meteomatics.com"
    url = f"{base}/{start_str}--{end_str}:{MET_INTERVAL}/{MET_PARAM}/{lat},{lon}/json"
    print(url)
    


    auth = (MET_USER, MET_PASS)
    r = requests.get(url, auth=auth, timeout=60)

    if r.status_code != 200:
        raise RuntimeError(f"Error Meteomatics {r.status_code}: {r.text}")

    data = r.json()
    try:
        dates = data["data"][0]["coordinates"][0]["dates"]
        df = pd.DataFrame(dates)
        df["date"] = pd.to_datetime(df["date"])
        df = df.set_index("date").sort_index()
        s = df["value"].astype(float)
        s = s.resample(target_freq).mean().dropna()
        s.name = "temperature_met_historical"
        return s
    except Exception as e:
        raise RuntimeError(f"Formato inesperado de respuesta Meteomatics: {e}")

def merge_and_clean(s_hist: pd.Series, s_met: pd.Series, target_freq: str) -> pd.Series:
    # Asegurar que ambas series tengan la misma zona horaria
    if s_hist.index.tz is None and s_met.index.tz is not None:
        s_met = s_met.tz_localize(None)
    elif s_hist.index.tz is not None and s_met.index.tz is None:
        s_hist = s_hist.tz_localize(None)
    elif s_hist.index.tz is not None and s_met.index.tz is not None:
        s_met = s_met.tz_convert(s_hist.index.tz)
    
    df = pd.concat([s_hist.to_frame("nc"), s_met.to_frame("met")], axis=1)
    df["temp"] = df["met"].combine_first(df["nc"])
    df["temp"] = df["temp"].interpolate(limit_direction="both").ffill().bfill()
    s = df["temp"].resample(target_freq).mean().dropna()
    s.name = "temperature"
    return s

def make_supervised(series: np.ndarray, lookback: int, horizon: int):
    X, y = [], []
    for i in range(lookback, len(series)):
        X.append(series[i - lookback:i])
        y.append(series[i])
    X = np.array(X)
    y = np.array(y)
    X = X.reshape((X.shape[0], X.shape[1], 1))
    return X, y

def build_lstm(input_timesteps: int) -> Sequential:
    model = Sequential()
    model.add(LSTM(64, input_shape=(input_timesteps, 1), return_sequences=False))
    model.add(Dense(32, activation="relu"))
    model.add(Dense(1))
    model.compile(optimizer="adam", loss="mse")
    return model

def iterative_forecast(model, last_window_scaled: np.ndarray, scaler: MinMaxScaler, steps: int) -> pd.Series:
    preds = []
    window = last_window_scaled.copy().reshape(1, -1, 1)

    for _ in range(steps):
        yhat_scaled = model.predict(window, verbose=0).flatten()[0]
        yhat = scaler.inverse_transform(np.array([[yhat_scaled]]))[0, 0]
        preds.append(yhat)

        yhat_scaled_for_window = scaler.transform(np.array([[yhat]]))[0, 0]
        new_window = np.append(window.flatten()[1:], yhat_scaled_for_window)
        window = new_window.reshape(1, -1, 1)

    return pd.Series(preds)

def main():
    try:
        print("=== INICIANDO SKYCAST LSTM ===")
        ensure_dirs()
        print("OK - Directorios creados")

        # 1) Cargar histórico NetCDF
        print("[FILE] Cargando NetCDF local...")
        try:
            s_nc = load_nc_series(NC_PATH, NC_TEMPERATURE_VARNAME, TARGET_FREQ)
            print(f"OK - NetCDF cargado: {len(s_nc)} observaciones")
            print(f"   Rango: {s_nc.index.min()} -> {s_nc.index.max()}")
        except Exception as e:
            print(f"ERROR - Error cargando NetCDF: {e}")
            raise

        # 2) Descargar datos históricos Meteomatics (01-01-2019 a 01-10-2025)
        print("[NET] Descargando datos históricos Meteomatics (01-01-2019 a 01-10-2025)...")
        try:
            s_met = fetch_meteomatics_historical(LAT, LON, "2019-01-01", "2025-10-01", TARGET_FREQ)
            print(f"OK - Meteomatics histórico descargado: {len(s_met)} observaciones")
            print(f"   Rango: {s_met.index.min()} -> {s_met.index.max()}")
        except Exception as e:
            print(f"ERROR - Error con Meteomatics histórico: {e}")
            raise

        # 3) Integrar
        print("[MERGE] Integrando series...")
        try:
            s = merge_and_clean(s_nc, s_met, TARGET_FREQ)
            print(f"OK - Series integradas: {len(s)} observaciones totales")
        except Exception as e:
            print(f"ERROR - Error integrando series: {e}")
            raise

        # 4) Preparar datos
        print("[DATA] Preparando datos...")
        try:
            values = s.values.astype("float32").reshape(-1, 1)
            print(f"OK - Datos preparados: {values.shape}")
        except Exception as e:
            print(f"ERROR - Error preparando datos: {e}")
            raise

        # 5) Escalado
        print("[SCALE] Aplicando escalado...")
        try:
            scaler = MinMaxScaler()
            values_scaled = scaler.fit_transform(values).flatten()
            print(f"OK - Escalado aplicado: min={values_scaled.min():.3f}, max={values_scaled.max():.3f}")
        except Exception as e:
            print(f"ERROR - Error en escalado: {e}")
            raise

        # 6) Supervised
        print("[WINDOW] Creando ventanas supervisadas...")
        try:
            if len(values_scaled) <= LOOKBACK_DAYS + FORECAST_DAYS + 10:
                print("[WARNING] Advertencia: muy pocos datos para una proyección robusta. Continúo igualmente.")

            X, y = make_supervised(values_scaled, LOOKBACK_DAYS, horizon=1)
            print(f"OK - Ventanas creadas: X={X.shape}, y={y.shape}")
        except Exception as e:
            print(f"ERROR - Error creando ventanas: {e}")
            raise

        # 7) Modelo
        print("[MODEL] Construyendo LSTM...")
        try:
            model = build_lstm(LOOKBACK_DAYS)
            print("OK - Modelo LSTM construido")
        except Exception as e:
            print(f"ERROR - Error construyendo modelo: {e}")
            raise

        # Callbacks
        print("[CONFIG] Configurando callbacks...")
        try:
            ckpt_path = os.path.join(MODEL_DIR, "best_" + MODEL_NAME)
            cbs = [
                EarlyStopping(patience=20, restore_best_weights=True, monitor="val_loss"),
                ReduceLROnPlateau(patience=10, factor=0.5, min_lr=1e-5),
                ModelCheckpoint(ckpt_path, save_best_only=True, monitor="val_loss")
            ]
            print("OK - Callbacks configurados")
        except Exception as e:
            print(f"ERROR - Error configurando callbacks: {e}")
            raise

        # 8) Entrenar
        print("[TRAIN] Entrenando modelo...")
        try:
            history = model.fit(
                X, y,
                epochs=EPOCHS,
                batch_size=BATCH_SIZE,
                validation_split=VALIDATION_SPLIT,
                shuffle=True,
                verbose=1,
                callbacks=cbs
            )
            print("OK - Entrenamiento completado")
        except Exception as e:
            print(f"ERROR - Error en entrenamiento: {e}")
            raise

        # 9) Forecast iterativo 6 meses desde hoy
        print("[FORECAST] Generando proyección 6 meses desde hoy (180 días)...")
        try:
            last_window_scaled = values_scaled[-LOOKBACK_DAYS:]
            preds = iterative_forecast(model, last_window_scaled, scaler, FORECAST_DAYS)
            print(f"OK - Proyección generada: {len(preds)} días")
        except Exception as e:
            print(f"ERROR - Error en proyección: {e}")
            raise

        # Índice de fechas futuras (desde hoy hacia adelante)
        print("[DATE] Creando fechas futuras desde hoy...")
        try:
            # Usar la fecha actual como punto de partida
            today = pd.Timestamp.now().normalize()  # Normalizar a medianoche
            if TARGET_FREQ.upper() == "1D":
                future_idx = pd.date_range(today, periods=FORECAST_DAYS, freq="D")
            else:
                future_idx = pd.date_range(today, periods=FORECAST_DAYS, freq="D")

            forecast = pd.DataFrame({
                "forecast_temperature": preds.values,
                "forecast_date": future_idx
            }, index=future_idx)
            print("OK - Fechas futuras creadas")
        except Exception as e:
            print(f"ERROR - Error creando fechas: {e}")
            raise

        # 10) Guardar outputs
        print("[SAVE] Guardando resultados...")
        try:
            out_csv = os.path.join(OUTPUT_DIR, RESULTS_CSV)
            forecast.to_csv(out_csv, index_label="date")

            model_path = os.path.join(MODEL_DIR, MODEL_NAME)
            model.save(model_path)
            print("OK - Resultados guardados")
        except Exception as e:
            print(f"ERROR - Error guardando resultados: {e}")
            raise

        # 11) Resumen
        print("\n[SUCCESS] === LISTO ===")
        print(f"[STATS] Histórico integrado: {s.index.min().date()} -> {s.index.max().date()} [{TARGET_FREQ}]")
        print(f"[STATS] Observaciones totales: {len(s)}")
        print(f"[WINDOW] Ventana (lookback): {LOOKBACK_DAYS}  |  Horizonte: {FORECAST_DAYS}")
        print(f"[FILE] Modelo guardado: {model_path}")
        print(f"[FILE] Resultados (CSV): {out_csv}")
        print("\n[FORECAST] Primeros valores proyectados:")
        print(forecast.head())
        
    except Exception as e:
        print(f"\n[CRITICAL] ERROR CRÍTICO: {e}")
        print(f"[INFO] Tipo de error: {type(e).__name__}")
        import traceback
        print(f"[TRACE] Traceback completo:")
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    print("Iniciando SkyCast LSTM...")
    success = main()
    if success:
        print("Proceso completado exitosamente!")
    else:
        print("Proceso falló. Revisa los errores arriba.")
        exit(1)
