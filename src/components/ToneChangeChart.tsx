"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ToneChangeChartProps {
  data: {
    quarters: string[];
    managementSentiment: number[];
    qaSentiment: number[];
  };
}

export function ToneChangeChart({ data }: ToneChangeChartProps) {
  const chartData = data.quarters.map((quarter, index) => ({
    quarter,
    management: Math.round(data.managementSentiment[index] * 100),
    qa: Math.round(data.qaSentiment[index] * 100),
    change:
      index > 0
        ? Math.round(
            (data.managementSentiment[index] -
              data.managementSentiment[index - 1]) *
              100
          )
        : 0,
  }));

  const chartConfig = {
    management: {
      label: "Management Sentiment",
      color: "#3b82f6",
    },
    qa: {
      label: "Q&A Sentiment",
      color: "#10b981",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            domain={[50, 100]}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="management"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="qa"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
