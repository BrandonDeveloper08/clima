import { Thermometer, Droplets, CloudRain, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  parameter: string;
  value: string;
  description: string;
}

const WeatherCard = ({ parameter, value, description }: WeatherCardProps) => {
  const getIcon = () => {
    switch (parameter.toUpperCase()) {
      case "TEMPERATURA":
        return <img src="https://cdn-icons-png.flaticon.com/512/1684/1684375.png" alt="Temperatura" className="h-12 w-12" />;
      case "HUMEDAD":
        return <img src="https://cdn-icons-png.flaticon.com/512/728/728093.png" alt="Humedad" className="h-12 w-12" />;
      case "PRECIPITACIONES":
        return <img src="https://cdn-icons-png.flaticon.com/512/4150/4150897.png" alt="Lluvia" className="h-12 w-12" />;
      case "VIENTO":
        return <img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" alt="Viento" className="h-12 w-12" />;
      default:
        return null;
    }
  };

  const getColorClass = () => {
    switch (parameter.toUpperCase()) {
      case "TEMPERATURA":
        return "text-temperature bg-temperature-light";
      case "HUMEDAD":
        return "text-humidity bg-humidity-light";
      case "PRECIPITACIONES":
        return "text-precipitation bg-precipitation-light";
      case "VIENTO":
        return "text-wind bg-wind-light";
      default:
        return "text-foreground bg-secondary";
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
            {parameter}
          </h3>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={cn("p-3 rounded-xl", getColorClass())}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
