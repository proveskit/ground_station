import BarChart from "@/components/dashboard/charts/BarChart";
import DoughnutChart from "@/components/dashboard/charts/DoughnutChart";
import LineChart from "@/components/dashboard/charts/LineChart";
import PolarAreaChart from "@/components/dashboard/charts/PolarAreaChart";
import LocationInfo from "@/components/dashboard/custom/LocationInfo";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { dashboardLayout, type DashboardLayoutType } from "@/lib/layout";
import {
  barChartData,
  doughnutChartData,
  lineChartData,
  polarChartData,
} from "@/lib/sampleData";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";

export default function Dashboard() {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  const [currentLayout, setCurrentLayout] =
    useState<DashboardLayoutType>(dashboardLayout);
    
  const onLayoutChange = (newLayout: Layout[]) => {
    setCurrentLayout(newLayout);
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
      <ResponsiveGridLayout
        className="layout rounded-md"
        layouts={{ lg: currentLayout || defaultLayout }}
        cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
        rowHeight={30}
        width={1600}
        onLayoutChange={onLayoutChange}
      >
        <div key="satInfo">
          <LocationInfo />
        </div>
        <div key="lineChart">
          <LineChart title="Signal Monitoring" data={lineChartData} />
        </div>
        <div key="barChart">
          <BarChart title="Satellite Types" data={barChartData} />
        </div>
        <div key="doughnutChart">
          <DoughnutChart
            title="Ground Station Status"
            data={doughnutChartData}
          />
        </div>
        <div key="polarChart">
          <PolarAreaChart title="Coverage Distribution" data={polarChartData} />
        </div>
      </ResponsiveGridLayout>
    </>
  );
}
