"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/card";

function ContainerChart({ container }) {
  const charData = useMemo(() => {
    if (!container || !container.weightHistory) return [];

    // Sort the history by date
    const sortedHistory = [...container.weightHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Add the current weight to the chart
    const data = [
      ...sortedHistory.map((item) => ({
        date: new Date(item.date),
        weight: item.weight,
      })),
    ];

    // Add the most recent weight if it's not in the history
    if (
      data.length === 0 ||
      data[data.length - 1].weight !== container.currentWeight
    ) {
      data.push({
        date: new Date(),
        weight: container.currentWeight,
      });
    }
    return data.map((item) => ({
      ...item,
      formattedDate: format(item.date, "MMM dd, yyyy"),
    }));
  }, [container]);

  if (charData.length < 1) {
    return (
      <Card className="p-6 text-center h-full flex items-center justify-center">
        <p className="text-muted-foreground">
          No history available for this container yet.
        </p>
      </Card>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="formattedDate"
          tick={{ fill: "hsl(var(--foreground))" }}
          tickMargin={10}
          angle={-30}
          textAnchor="end"
        />
        <YAxis
          tick={{ fill: "hsl(var(--foreground))" }}
          domain={[0, container.maxWeight * 1.1]}
          label={{
            value: `Weight (${container.unit})`,
            angle: -90,
            position: "insideLeft",
            fill: "hsl(var(--foreground))",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
          }}
          itemStyle={{ color: "hsl(var(--chart-1))" }}
          formatter={(value) => [`${value} ${container.unit}`, "Weight"]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
          activeDot={{ fill: "hsl(var(--chart-1))", r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ContainerChart;
