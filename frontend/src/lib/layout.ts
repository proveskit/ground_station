import BarChart from "@/components/dashboard/charts/BarChart";
import DoughnutChart from "@/components/dashboard/charts/DoughnutChart";
import LineChart from "@/components/dashboard/charts/LineChart";
import PolarAreaChart from "@/components/dashboard/charts/PolarAreaChart";
import LocationInfo from "@/components/dashboard/custom/LocationInfo";
import type { Layout } from "react-grid-layout";
import type { DataStructure } from "../types/DataTypes";

export type ChartProps = {
  data: DataStructure;
  title: string;
};

export type TextProps = {
  title: string;
  data: {
    color: string;
    text: string;
  };
};

export type SatInfoProps = {
  data: {
    lat: number;
    lng: number;
  };
};

export type ChartType =
  | "line"
  | "bar"
  | "doughnut"
  | "polar"
  | "satInfo"
  | "simpleText";

export const chartComponents = {
  line: LineChart,
  bar: BarChart,
  doughnut: DoughnutChart,
  polar: PolarAreaChart,
  satInfo: LocationInfo,
};

export type DashboardLayoutType = {
  [key: string]: {
    chartType: ChartType;
    layout: Layout;
  }[];
};

export function generateLayout(
  items: {
    chartType: ChartType;
    layout: Layout;
  }[]
): Layout[] {
  return items.map((item) => item.layout);
}

export const dashboardLayout: DashboardLayoutType = {
  statistics: [
    {
      chartType: "satInfo",
      layout: {
        w: 8,
        h: 12,
        x: 0,
        y: 0,
        i: "satellite_info",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "line",
      layout: {
        w: 3,
        h: 8,
        x: 0,
        y: 12,
        i: "satellite_signal_strength",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "bar",
      layout: {
        w: 5,
        h: 8,
        x: 3,
        y: 12,
        i: "satellite_signal_distribution",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "doughnut",
      layout: {
        w: 4,
        h: 8,
        x: 8,
        y: 12,
        i: "satellite_signal_coverage",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "simpleText",
      layout: {
        w: 4,
        h: 4,
        x: 8,
        y: 0,
        i: "last_frame_received",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "simpleText",
      layout: {
        w: 4,
        h: 4,
        x: 8,
        y: 4,
        i: "total_frame_count",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "simpleText",
      layout: {
        w: 4,
        h: 4,
        x: 8,
        y: 8,
        i: "satellite_position",
        moved: false,
        static: false,
      },
    },
  ],
};
