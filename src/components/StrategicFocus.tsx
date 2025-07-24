import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Zap, Cpu, Car, Cloud } from "lucide-react";

interface StrategicFocusChartProps {
  data: {
    quarters: string[];
    strategicFocuses: Record<string, string[]>;
  };
}

const getThemeIcon = (theme: string) => {
  if (theme.toLowerCase().includes("ai")) return <Zap className="w-3 h-3" />;
  if (
    theme.toLowerCase().includes("data center") ||
    theme.toLowerCase().includes("cloud")
  )
    return <Cloud className="w-3 h-3" />;
  if (
    theme.toLowerCase().includes("automotive") ||
    theme.toLowerCase().includes("autonomous")
  )
    return <Car className="w-3 h-3" />;
  if (
    theme.toLowerCase().includes("computing") ||
    theme.toLowerCase().includes("architecture")
  )
    return <Cpu className="w-3 h-3" />;
  return <Target className="w-3 h-3" />;
};

const getThemeColor = (theme: string, index: number) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-orange-100 text-orange-800",
    "bg-pink-100 text-pink-800",
  ];
  return colors[index % colors.length];
};

export function StrategicFocusChart({ data }: StrategicFocusChartProps) {
  return (
    <div className="space-y-6">
      {data.quarters.map((quarter) => (
        <Card key={quarter} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {quarter}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.strategicFocuses[quarter]?.map((focus, index) => (
                <Badge
                  key={focus}
                  variant="secondary"
                  className={`${getThemeColor(
                    focus,
                    index
                  )} flex items-center gap-1`}
                >
                  {getThemeIcon(focus)}
                  {focus}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
