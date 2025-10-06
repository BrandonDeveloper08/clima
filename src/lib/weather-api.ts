// Weather API configuration and utilities
export const WEATHER_VARIABLES = {
  temperature: {
    param: 't_2m:C',
    unit: '°C',
    description: 'Temperatura a 2m'
  },
  humidity: {
    param: 'relative_humidity_2m:p',
    unit: '%',
    description: 'Humedad relativa a 2m'
  },
  wind_speed: {
    param: 'wind_speed_10m:ms',
    unit: 'm/s',
    description: 'Velocidad del viento a 10m'
  },
  precipitation: {
    param: 'precip_1h:mm',
    unit: 'mm/h',
    description: 'Precipitación por hora'
  }
};

export const MET_USER = process.env.MET_USER || "linogarcia_yenso";
export const MET_PASS = process.env.MET_PASS || "eBCQ7aI6MhpvMg9SCkno";

export const TARGET_FREQ = "1D";
export const MET_INTERVAL = "P1D";
export const LOOKBACK_DAYS = 30;
export const FORECAST_DAYS = 30;
export const START_DATE = "2019-10-01";
export const END_DATE = "2025-10-01";

export interface WeatherData {
  [key: string]: {
    values: number[];
    dates: string[];
    unit: string;
    description: string;
    metrics?: {
      MSE: number;
      RMSE: number;
      MAE: number;
      R2: number;
    };
    status: 'success' | 'error';
    error?: string;
  };
}

export interface ForecastResult {
  location: {
    lat: number;
    lon: number;
  };
  forecast_date: string;
  days_ahead: number;
  forecasts: WeatherData;
  status: 'success' | 'error';
  error?: string;
}

export interface MeteomaticsResponse {
  data: Array<{
    coordinates: Array<{
      dates: Array<{
        date: string;
        value: number;
      }>;
    }>;
  }>;
}
