"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
export function BarChartProfessionByGender({ data }) {
  return (
    <BoxContainer title="Professions by Gender">
      <ChartContainer
        config={chartConfig}
        className="mx-auto w-full max-h-[25rem] mt-5"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="profession"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="female" fill="var(--color-female)" radius={4} />
          <Bar dataKey="male" fill="var(--color-male)" radius={4} />
        </BarChart>
      </ChartContainer>
    </BoxContainer>
  );
}
