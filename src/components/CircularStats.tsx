import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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

  return (
    <div className="bg-card rounded-2xl shadow-card p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        ESTADÍSTICAS CIRCULARES
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {data.map((item) => {
          const chartData = [
            { value: item.percentage },
            { value: 100 - item.percentage },
          ];

          return (
            <div key={item.parameter} className="flex flex-col items-center">
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
                    <Cell fill={getColor(item.parameter)} />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-2xl font-bold text-foreground mb-1">
                  {item.percentage}%
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase">
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
  );
};

export default CircularStats;
