import { cn } from "@/lib/utils";

interface ParameterToggleProps {
  parameter: string;
  isSelected: boolean;
  onToggle: () => void;
}

const ParameterToggle = ({ parameter, isSelected, onToggle }: ParameterToggleProps) => {
  const getColorClass = () => {
    switch (parameter) {
      case "TEMPERATURA":
        return isSelected ? "bg-temperature text-white" : "bg-temperature-light text-temperature";
      case "HUMEDAD":
        return isSelected ? "bg-humidity text-white" : "bg-humidity-light text-humidity";
      case "PRECIPITACIONES":
        return isSelected ? "bg-precipitation text-white" : "bg-precipitation-light text-precipitation";
      case "VIENTO":
        return isSelected ? "bg-wind text-white" : "bg-wind-light text-wind";
      default:
        return "bg-secondary text-foreground";
    }
  };

  return (
    <button
      onClick={onToggle}
      className={cn(
        "py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95",
        getColorClass()
      )}
    >
      {parameter}
    </button>
  );
};

export default ParameterToggle;
