import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import WeatherCard from "@/components/WeatherCard";
import CircularStats from "@/components/CircularStats";

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const location = searchParams.get("location") || "";
  const date = searchParams.get("date") || "";
  const params = searchParams.get("params")?.split(",") || [];

  // Mock data - In a real app, this would come from an API
  const weatherData = {
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

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Pronóstico para {location}
            </h1>
            <p className="text-muted-foreground">{date}</p>
          </div>
        </div>

        {/* Weather Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {params.map((param) => {
            const data = weatherData[param as keyof typeof weatherData];
            return data ? (
              <WeatherCard
                key={param}
                parameter={param}
                value={data.value}
                description={data.description}
              />
            ) : null;
          })}
        </div>

        {/* Circular Statistics */}
        <CircularStats
          data={params.map((param) => ({
            parameter: param,
            percentage: weatherData[param as keyof typeof weatherData]?.percentage || 0,
          }))}
          location={location}
          date={date}
        />
      </div>
    </div>
  );
};

export default Results;
