"use client";

import { LabelList, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { BoxContainer } from "./box-container";

const chartConfig = {
  Count: { label: "Count" },
  Male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  Female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
};

export function PieChartGender({ data }) {
  return (
    <BoxContainer title="Gender Distribution">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[25rem]"
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="Count" hideLabel />}
          />
          <Pie data={data} dataKey="count" scale={20}>
            <LabelList
              dataKey="_id"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value) => chartConfig[value]?.label}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </BoxContainer>
  );
}
