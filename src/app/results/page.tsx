'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ColourfulText from "@/components/ui/colourful-text";
import FancyWeatherCard from "@/components/FancyWeatherCard";
import { Button } from "@/components/ui/button";
import CircularStats from "@/components/CircularStats";
import { WeatherBackground } from "@/components/WeatherBackground";
import { useState, useEffect } from "react";

const Results = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  const location = searchParams.get("location") || "";
  const date = searchParams.get("date") || "";
  const params = searchParams.get("params")?.split(",") || [];

  useEffect(() => {
    // Simular llamada a la API
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // Aquí harías la llamada real a tu API
        // const response = await fetch('/api/forecast?lat=...&lon=...');
        // const data = await response.json();
        
        // Por ahora usamos datos mock
        const mockData = {
          TEMPERATURA: {
            value: "15°C",
            description: "Sensación térmica agradable",
            percentage: 68,
          },
          PRECIPITACIONES: {
            value: "Nieve",
            description: "Condiciones nevadas, abrigue bien",
            percentage: 52,
          },
          HUMEDAD: {
            value: "Baja",
            description: "Ambiente seco, ideal para actividades al aire libre",
            percentage: 73,
          },
          VIENTO: {
            value: "Muy fuerte",
            description: "Vientos fuertes, evitar actividades al aire libre",
            percentage: 34,
          },
        };
        
        setWeatherData(mockData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <>
        <WeatherBackground />
        <main className="relative min-h-screen">
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generando pronóstico...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <WeatherBackground />
      <main className="relative min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              <ColourfulText text={`Pronóstico para ${location}`} />
            </h1>
            <p className="text-muted-foreground">{date}</p>
          </div>
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {params.map((param) => {
            const data = weatherData?.[param as keyof typeof weatherData];
            if (!data) return null;
            const title = param;
            return (
              <div key={param} className="flex justify-center">
                <FancyWeatherCard
                  title={title}
                  value={data.value}
                />
              </div>
            );
          })}
        </div>

        {/* Circular Statistics */}
        <CircularStats
          data={params.map((param) => ({
            parameter: param,
            percentage: weatherData?.[param as keyof typeof weatherData]?.percentage || 0,
          }))}
          location={location}
          date={date}
        />
      </div>
      </main>
    </>
  );
};

export default Results;
