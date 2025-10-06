import axios from 'axios';
import { WEATHER_VARIABLES, MET_USER, MET_PASS, MET_INTERVAL, TARGET_FREQ } from './weather-api';

export class MeteomaticsClient {
  private baseUrl = 'https://api.meteomatics.com';
  private auth = {
    username: MET_USER,
    password: MET_PASS
  };

  async fetchHistoricalData(
    lat: number, 
    lon: number, 
    startDate: string, 
    endDate: string, 
    variable: string
  ): Promise<{ dates: string[]; values: number[] }> {
    const start = new Date(startDate).toISOString().replace('Z', 'Z');
    const end = new Date(endDate).toISOString().replace('Z', 'Z');
    
    const param = WEATHER_VARIABLES[variable as keyof typeof WEATHER_VARIABLES]?.param;
    if (!param) {
      throw new Error(`Variable ${variable} not supported`);
    }

    const url = `${this.baseUrl}/${start}--${end}:${MET_INTERVAL}/${param}/${lat},${lon}/json`;
    
    console.log(`Fetching ${variable}: ${url}`);

    try {
      const response = await axios.get(url, {
        auth: this.auth,
        timeout: 60000
      });

      if (response.status !== 200) {
        throw new Error(`Error Meteomatics ${response.status}: ${response.data}`);
      }

      const data = response.data;
      const dates = data.data[0].coordinates[0].dates;
      
      return {
        dates: dates.map((d: any) => d.date),
        values: dates.map((d: any) => parseFloat(d.value))
      };
    } catch (error) {
      console.error(`Error fetching ${variable}:`, error);
      throw new Error(`Error fetching ${variable}: ${error}`);
    }
  }

  async fetchAllWeatherData(
    lat: number, 
    lon: number, 
    startDate: string, 
    endDate: string
  ): Promise<Record<string, { dates: string[]; values: number[] }>> {
    const weatherData: Record<string, { dates: string[]; values: number[] }> = {};
    
    for (const variable of Object.keys(WEATHER_VARIABLES)) {
      try {
        console.log(`Descargando datos históricos para ${variable}...`);
        const data = await this.fetchHistoricalData(lat, lon, startDate, endDate, variable);
        weatherData[variable] = data;
        console.log(`OK - ${variable}: ${data.values.length} observaciones`);
      } catch (error) {
        console.error(`ERROR - Error descargando ${variable}:`, error);
        throw error;
      }
    }
    
    return weatherData;
  }
}

export const meteomaticsClient = new MeteomaticsClient();
