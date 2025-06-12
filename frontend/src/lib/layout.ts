import BarChart from "@/components/dashboard/charts/BarChart";
import DoughnutChart from "@/components/dashboard/charts/DoughnutChart";
import LineChart from "@/components/dashboard/charts/LineChart";
import PolarAreaChart from "@/components/dashboard/charts/PolarAreaChart";
import LocationInfo from "@/components/dashboard/custom/LocationInfo";
import SimpleTextCard from "@/components/dashboard/custom/SimpleCard";
import type { Layout } from "react-grid-layout";
import type { DataStructure } from "../types/DataTypes";

type ChartProps = {
  data: DataStructure;
  title: string;
};

type TextProps = {
  title: string;
  data: {
    color: string;
    text: string;
  };
};

type ComponentType = {
  line: React.ComponentType<ChartProps>;
  bar: React.ComponentType<ChartProps>;
  doughnut: React.ComponentType<ChartProps>;
  polar: React.ComponentType<ChartProps>;
  satInfo: React.ComponentType<ChartProps>;
  simpleText: React.ComponentType<TextProps>;
};

export type ChartType = keyof ComponentType;

export type DashboardLayoutType = {
  [key: string]: {
    chartType: ChartType;
    component: ComponentType[ChartType];
    layout: Layout;
  }[];
};

export function getChartComponent(
  chartType: ChartType
): ComponentType[ChartType] {
  switch (chartType) {
    case "line":
      return LineChart;
    case "bar":
      return BarChart;
    case "doughnut":
      return DoughnutChart;
    case "polar":
      return PolarAreaChart;
    case "satInfo":
      return LocationInfo;
    case "simpleText":
      return SimpleTextCard;
  }
}

export function generateLayout(
  items: {
    chartType: ChartType;
    layout: Layout;
    component: ComponentType[ChartType];
  }[]
): Layout[] {
  return items.map((item) => item.layout);
}

export const dashboardLayout: DashboardLayoutType = {
  statistics: [
    {
      chartType: "satInfo",
      component: LocationInfo,
      layout: {
        w: 18,
        h: 10,
        x: 0,
        y: 0,
        i: "satellite_info",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "line",
      component: LineChart,
      layout: {
        w: 3,
        h: 8,
        x: 0,
        y: 10,
        i: "satellite_signal_strength",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "bar",
      component: BarChart,
      layout: {
        w: 5,
        h: 8,
        x: 3,
        y: 10,
        i: "satellite_signal_distribution",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "doughnut",
      component: DoughnutChart,
      layout: {
        w: 3,
        h: 8,
        x: 5,
        y: 18,
        i: "satellite_signal_coverage",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "simpleText",
      component: SimpleTextCard,
      layout: {
        w: 6,
        h: 10,
        x: 18,
        y: 0,
        i: "last_frame_received",
        moved: false,
        static: false,
      },
    },
  ],
};
