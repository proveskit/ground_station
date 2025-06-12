import SimpleTextCard from "@/components/dashboard/custom/SimpleCard";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  dashboardLayout,
  generateLayout,
  type ChartProps,
  type DashboardLayoutType,
  type SatInfoProps,
  type TextProps,
} from "@/lib/layout";
import { sampleData } from "@/lib/sampleData";
import { underScoreToTitleCase } from "@/lib/utils";
import type { DataStructure } from "@/types/DataTypes";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

export default function Dashboard() {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  const [currentLayout] = useState<DashboardLayoutType>(dashboardLayout);

  return (
    <>
      <PageHeader title="Dashboard" />
      <Button
        onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(currentLayout));
        }}
      >
        Copy Layout
      </Button>
      {Object.entries(currentLayout).map(([key, value]) => (
        <div key={key}>
          <h2>{key}</h2>
          <ResponsiveGridLayout
            className="layout rounded-md"
            layouts={{ lg: generateLayout(value) }}
            cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
            rowHeight={30}
          >
            {value.map((item) => {
              const data = sampleData[key].find(
                (data) => data.title === item.layout.i
              )?.data;

              if (!data)
                return (
                  <div key={item.layout.i}>
                    <SimpleTextCard
                      title={underScoreToTitleCase(item.layout.i)}
                      data={{
                        color: "text-red-500",
                        text: `No data found for ${underScoreToTitleCase(
                          item.layout.i
                        )}`,
                      }}
                    />
                  </div>
                );

              if (item.chartType === "satInfo") {
                const SatInfoComponent =
                  item.component as React.ComponentType<SatInfoProps>;
                return (
                  <div key={item.layout.i}>
                    <SatInfoComponent
                      data={data as { lat: number; lng: number }}
                    />
                  </div>
                );
              }

              if (item.chartType === "simpleText") {
                const TextComponent =
                  item.component as React.ComponentType<TextProps>;
                return (
                  <div key={item.layout.i}>
                    <TextComponent
                      title={underScoreToTitleCase(item.layout.i)}
                      data={data as { color: string; text: string }}
                    />
                  </div>
                );
              }
              const ChartComponent =
                item.component as React.ComponentType<ChartProps>;
              return (
                <div key={item.layout.i}>
                  <ChartComponent
                    title={underScoreToTitleCase(item.layout.i)}
                    data={data as DataStructure}
                  />
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </div>
      ))}
    </>
  );
}
