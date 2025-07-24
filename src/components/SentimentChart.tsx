"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SentimentChartProps {
  data: Array<{
    quarter: string;
    sentiment: number;
  }>;
  type: "management" | "qa";
}

export function SentimentChart({ data, type }: SentimentChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    sentimentPercent: Math.round(item.sentiment * 100),
  }));

  const getBarColor = (sentiment: number) => {
    if (sentiment >= 0.8) return "#10b981"; // green-500
    if (sentiment >= 0.7) return "#3b82f6"; // blue-500
    if (sentiment >= 0.6) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const chartConfig = {
    sentimentPercent: {
      label: "Sentiment %",
      color: type === "management" ? "#3b82f6" : "#10b981",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="quarter"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="sentimentPercent" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.sentiment)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
