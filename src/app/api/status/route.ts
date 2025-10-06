import { NextResponse } from 'next/server';
import { WEATHER_VARIABLES } from '@/lib/weather-api';

export async function GET() {
  return NextResponse.json({
    status: 'active',
    version: '1.0',
    supported_variables: Object.keys(WEATHER_VARIABLES),
    message: 'SkyCast API funcionando correctamente'
  });
}
