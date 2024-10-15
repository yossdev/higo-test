"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { BoxContainer } from "./box-container";

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
};
export function AreaChartMeanSpedingScoreByAgeAndGender({ data }) {
  return (
    <BoxContainer title="Avg Spending Score by Age">
      <ChartContainer
        config={chartConfig}
        className="max-auto max-h-[25rem] mt-5 w-full"
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="male"
            type="natural"
            fill="var(--color-male)"
            fillOpacity={0.4}
            stroke="var(--color-male)"
            stackId="a"
          />
          <Area
            dataKey="female"
            type="natural"
            fill="var(--color-female)"
            fillOpacity={0.4}
            stroke="var(--color-female)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </BoxContainer>
  );
}
