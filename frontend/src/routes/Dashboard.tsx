import LocationInfo from "@/components/dashboard/custom/LocationInfo";
import SimpleTextCard from "@/components/dashboard/custom/SimpleCard";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  chartComponents,
  dashboardLayout,
  generateLayout,
  type DashboardLayoutType,
} from "@/lib/layout";
import { sampleData } from "@/lib/sampleData";
import { underScoreToTitleCase } from "@/lib/utils";
import type { DataStructure } from "@/types/DataTypes";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";

export default function Dashboard() {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  const [currentLayout, setCurrentLayout] = useState<DashboardLayoutType>(
    () => {
      const savedLayout = localStorage.getItem("layout");
      return savedLayout ? JSON.parse(savedLayout) : dashboardLayout;
    }
  );

  const onLayoutChange = (layout: Layout[], category: string) => {
    const newLayout = currentLayout[category].map((item) => {
      const foundLayout = layout.find((l) => l.i === item.layout.i);
      if (!foundLayout) return item;
      return {
        chartType: item.chartType,
        layout: foundLayout,
      };
    });

    const updatedLayout = {
      ...currentLayout,
      [category]: newLayout,
    };

    localStorage.setItem("layout", JSON.stringify(updatedLayout));
    setCurrentLayout(updatedLayout);
  };

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
        <div key={key} className="flex flex-col gap-2 px-2">
          <h2 className="text-4xl font-bold">{underScoreToTitleCase(key)}</h2>
          <ResponsiveGridLayout
            className="layout rounded-md"
            layouts={{ lg: generateLayout(value) }}
            cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
            rowHeight={30}
            onLayoutChange={(layout) => onLayoutChange(layout, key)}
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
                return (
                  <div key={item.layout.i}>
                    <LocationInfo data={data as { lat: number; lng: number }} />
                  </div>
                );
              }

              if (item.chartType === "simpleText") {
                return (
                  <div key={item.layout.i}>
                    <SimpleTextCard
                      title={underScoreToTitleCase(item.layout.i)}
                      data={data as { color: string; text: string }}
                    />
                  </div>
                );
              }
              const ChartComponent = chartComponents[item.chartType];
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
