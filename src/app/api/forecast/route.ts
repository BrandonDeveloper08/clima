import { NextRequest, NextResponse } from 'next/server';
import { weatherForecast } from '@/lib/weather-forecast';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros
    const lat = parseFloat(searchParams.get('lat') || '-12.04318');
    const lon = parseFloat(searchParams.get('lon') || '-77.02824');
    const forecastDate = searchParams.get('forecast_date') || new Date().toISOString().split('T')[0];
    const daysAhead = parseInt(searchParams.get('days_ahead') || '1');
    
    // Validar parámetros
    if (!(-90 <= lat && lat <= 90)) {
      return NextResponse.json({
        error: 'Latitud debe estar entre -90 y 90',
        status: 'error'
      }, { status: 400 });
    }
    
    if (!(-180 <= lon && lon <= 180)) {
      return NextResponse.json({
        error: 'Longitud debe estar entre -180 y 180',
        status: 'error'
      }, { status: 400 });
    }
    
    if (!(1 <= daysAhead && daysAhead <= 30)) {
      return NextResponse.json({
        error: 'Días de pronóstico debe estar entre 1 y 30',
        status: 'error'
      }, { status: 400 });
    }
    
    // Generar pronóstico
    const result = await weatherForecast.generateForecast(lat, lon, forecastDate, daysAhead);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error en API forecast:', error);
    return NextResponse.json({
      error: `Error interno: ${error}`,
      status: 'error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lon, forecast_date, days_ahead = 1 } = body;
    
    // Validar parámetros
    if (!lat || !lon || !forecast_date) {
      return NextResponse.json({
        error: 'Faltan parámetros requeridos: lat, lon, forecast_date',
        status: 'error'
      }, { status: 400 });
    }
    
    if (!(-90 <= lat && lat <= 90)) {
      return NextResponse.json({
        error: 'Latitud debe estar entre -90 y 90',
        status: 'error'
      }, { status: 400 });
    }
    
    if (!(-180 <= lon && lon <= 180)) {
      return NextResponse.json({
        error: 'Longitud debe estar entre -180 y 180',
        status: 'error'
      }, { status: 400 });
    }
    
    if (!(1 <= days_ahead && days_ahead <= 30)) {
      return NextResponse.json({
        error: 'Días de pronóstico debe estar entre 1 y 30',
        status: 'error'
      }, { status: 400 });
    }
    
    // Generar pronóstico
    const result = await weatherForecast.generateForecast(lat, lon, forecast_date, days_ahead);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error en API forecast POST:', error);
    return NextResponse.json({
      error: `Error interno: ${error}`,
      status: 'error'
    }, { status: 500 });
  }
}
