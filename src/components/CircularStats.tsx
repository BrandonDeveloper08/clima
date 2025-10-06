import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface StatData {
  parameter: string;
  percentage: number;
}

interface CircularStatsProps {
  data: StatData[];
  location: string;
  date: string;
}

const CircularStats = ({ data, location, date }: CircularStatsProps) => {
  const getColor = (parameter: string) => {
    switch (parameter) {
      case "TEMPERATURA":
        return "hsl(var(--temperature))";
      case "HUMEDAD":
        return "hsl(var(--humidity))";
      case "PRECIPITACIONES":
        return "hsl(var(--precipitation))";
      case "VIENTO":
        return "hsl(var(--wind))";
      default:
        return "hsl(var(--muted))";
    }
  };

  const getLightColorClass = (parameter: string) => {
    switch (parameter) {
      case "TEMPERATURA":
        return "bg-temperature-light";
      case "HUMEDAD":
        return "bg-humidity-light";
      case "PRECIPITACIONES":
        return "bg-precipitation-light";
      case "VIENTO":
        return "bg-wind-light";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="bg-card/80 backdrop-blur-sm rounded-2xl p-8"
      style={{ boxShadow: "var(--shadow-relief)" }}
    >
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          ESTADÍSTICAS CIRCULARES
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {data.map((item) => {
            const chartData = [
              { value: item.percentage },
              { value: 100 - item.percentage },
            ];
            const color = getColor(item.parameter);
            const lightColorClass = getLightColorClass(item.parameter);

            return (
              <div
                key={item.parameter}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl",
                  lightColorClass
                )}
              >
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={color} />
                      <Cell fill="hsl(var(--muted) / 0.2)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: color }}
                  >
                    {item.percentage}%
                  </p>
                  <p
                    className="text-xs font-medium uppercase"
                    style={{ color: color }}
                  >
                    {item.parameter}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Probabilidades individuales para {location} el {date}
        </p>
      </div>
    </div>
  );
};

export default CircularStats;