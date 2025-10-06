import { cn } from "@/lib/utils";
import { Thermometer, Droplets, CloudRain, Wind } from "lucide-react";

interface ParameterToggleProps {
  parameter: string;
  value?: string; // Valor actual del clima (opcional)
  isSelected: boolean;
  onToggle: () => void;
}

const ParameterToggle = ({ parameter, value, isSelected, onToggle }: ParameterToggleProps) => {
  const getIcon = () => {
    switch (parameter.toUpperCase()) {
      case "TEMPERATURA":
        return <Thermometer className="h-5 w-5" />;
      case "HUMEDAD":
        return <Droplets className="h-5 w-5" />;
      case "PRECIPITACIONES":
        return <CloudRain className="h-5 w-5" />;
      case "VIENTO":
        return <Wind className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (parameter.toUpperCase()) {
      case "TEMPERATURA":
        return {
          bg: "bg-temperature-light",
          text: "text-temperature",
          border: "border-temperature",
        };
      case "HUMEDAD":
        return {
          bg: "bg-humidity-light",
          text: "text-humidity",
          border: "border-humidity",
        };
      case "PRECIPITACIONES":
        return {
          bg: "bg-precipitation-light",
          text: "text-precipitation",
          border: "border-precipitation",
        };
      case "VIENTO":
        return {
          bg: "bg-wind-light",
          text: "text-wind",
          border: "border-wind",
        };
      default:
        return {
          bg: "bg-secondary",
          text: "text-secondary-foreground",
          border: "border-border",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-start justify-between h-28",
        isSelected
          ? `${colors.bg} ${colors.text} ${colors.border}`
          : "bg-secondary border-transparent hover:border-border"
      )}
    >
      <div className="flex justify-between items-center w-full">
        <span className="text-xs font-bold uppercase tracking-wider">
          {parameter}
        </span>
        <div className={cn(
          "p-1.5 rounded-full",
          isSelected ? 'bg-white/50' : colors.bg
        )}>
          {getIcon()}
        </div>
      </div>
      <span className={cn(
        "text-2xl font-bold mt-auto",
        isSelected ? colors.text : 'text-foreground'
      )}>
        {value || "..."}
      </span>
    </button>
  );
};

export default ParameterToggle;