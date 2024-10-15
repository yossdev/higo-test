"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { BoxContainer } from "./box-container";

const chartConfig = {
  mean: {
    label: "Mean",
    color: "hsl(var(--chart-1))",
  },
};

export function RadarChartAnnualIncomeByProfession({ data }) {
  return (
    <BoxContainer title="Avg Annual Income by Professions">
      <ChartContainer config={chartConfig} className="mx-auto max-h-[25rem]">
        <RadarChart data={data}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent className="w-36" />}
          />
          <PolarAngleAxis dataKey="profession" />
          <PolarGrid />
          <Radar dataKey="mean" fill="var(--color-mean)" fillOpacity={0.6} />
        </RadarChart>
      </ChartContainer>
    </BoxContainer>
  );
}
