# SkyCast - Pronóstico Meteorológico con Next.js

Una aplicación de pronóstico meteorológico inteligente construida con Next.js, que incluye APIs backend y frontend React.

## 🚀 Características

- **API Backend**: Endpoints REST para pronósticos meteorológicos
- **Frontend React**: Interfaz moderna con mapas interactivos
- **Integración Meteomatics**: Datos meteorológicos en tiempo real
- **Modelos LSTM**: Predicciones inteligentes (simuladas)
- **Mapas Google**: Selección de ubicación interactiva
- **UI Moderna**: Componentes con Tailwind CSS y Radix UI

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Meteomatics API
- Google Maps API Key

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd skycast-nextjs
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local`:
```env
# Meteomatics API Credentials
MET_USER=tu_usuario_meteomatics
MET_PASS=tu_password_meteomatics

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── forecast/      # Endpoint de pronósticos
│   │   └── status/        # Estado de la API
│   ├── results/           # Página de resultados
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de búsqueda
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   ├── FancyWeatherCard.tsx
│   ├── ParameterToggle.tsx
│   ├── CircularStats.tsx
│   └── WeatherBackground.tsx
├── lib/                  # Utilidades y lógica
│   ├── weather-api.ts    # Configuración API
│   ├── meteomatics-client.ts
│   └── weather-forecast.ts
└── hooks/                # Custom hooks
    └── use-toast.ts
```

## 🔌 API Endpoints

### GET /api/forecast
Genera pronósticos meteorológicos

**Parámetros:**
- `lat` (number): Latitud (-90 a 90)
- `lon` (number): Longitud (-180 a 180)  
- `forecast_date` (string): Fecha en formato YYYY-MM-DD
- `days_ahead` (number): Días de pronóstico (1-30)

**Ejemplo:**
```
GET /api/forecast?lat=-12.04318&lon=-77.02824&forecast_date=2024-01-15&days_ahead=7
```

### POST /api/forecast
Mismo endpoint pero con datos en el body

**Body:**
```json
{
  "lat": -12.04318,
  "lon": -77.02824,
  "forecast_date": "2024-01-15",
  "days_ahead": 7
}
```

### GET /api/status
Estado de la API

## 🎨 Componentes Principales

### Search Page (`/`)
- Mapa interactivo con Google Maps
- Selección de ubicación por distrito
- Calendario para fecha de pronóstico
- Toggle de parámetros meteorológicos

### Results Page (`/results`)
- Tarjetas de pronóstico elegantes
- Estadísticas circulares
- Métricas de precisión del modelo

## 🔧 Configuración Avanzada

### Variables Meteorológicas
Editar `src/lib/weather-api.ts` para agregar nuevas variables:

```typescript
export const WEATHER_VARIABLES = {
  temperature: {
    param: 't_2m:C',
    unit: '°C',
    description: 'Temperatura a 2m'
  },
  // Agregar más variables...
};
```

### Personalización de Modelos
Modificar `src/lib/weather-forecast.ts` para implementar modelos reales de ML.

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `MET_USER` | Usuario Meteomatics | ✅ |
| `MET_PASS` | Password Meteomatics | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API Key | ✅ |

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte, crear un issue en GitHub o contactar al equipo de desarrollo.

---

**SkyCast** - Pronósticos meteorológicos inteligentes 🌤️