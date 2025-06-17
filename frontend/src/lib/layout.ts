import ArcChart from "@/components/dashboard/charts/ArcChart";
import BarChart from "@/components/dashboard/charts/BarChart";
import DoughnutChart from "@/components/dashboard/charts/DoughnutChart";
import LineChart from "@/components/dashboard/charts/LineChart";
import PolarAreaChart from "@/components/dashboard/charts/PolarAreaChart";
import LocationInfo from "@/components/dashboard/custom/LocationInfo";
import SimpleCard from "@/components/dashboard/custom/SimpleCard";
import type { CardTypeToData, ChartType } from "@/types/CardTypes";
import type { Layout } from "react-grid-layout";

export const chartComponents: {
  [K in ChartType]: React.ComponentType<{
    title: string;
    data: CardTypeToData[K];
  }>;
} = {
  line: LineChart,
  bar: BarChart,
  doughnut: DoughnutChart,
  polar: PolarAreaChart,
  satInfo: LocationInfo,
  text: SimpleCard,
  arc: ArcChart,
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
  communication: [
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
        i: "RSSI",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "text",
      layout: {
        w: 5,
        h: 8,
        x: 3,
        y: 12,
        i: "last_contact_time",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "line",
      layout: {
        w: 4,
        h: 8,
        x: 8,
        y: 12,
        i: "data_rate",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "text",
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
      chartType: "text",
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
      chartType: "text",
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
  power_system: [],
  temperature: [],
  flight_software: [
    {
      chartType: "text",
      layout: {
        w: 12,
        h: 4,
        x: 0,
        y: 0,
        i: "flight_software_version",
      },
    },
    {
      chartType: "text",
      layout: {
        w: 12,
        h: 4,
        x: 0,
        y: 4,
        i: "boot_count",
      },
    },
    {
      chartType: "text",
      layout: {
        w: 12,
        h: 4,
        x: 0,
        y: 8,
        i: "uptime",
      },
    },
    {
      chartType: "text",
      layout: {
        w: 12,
        h: 4,
        x: 0,
        y: 12,
        i: "time_since_last_reboot",
      },
    },
    {
      chartType: "arc",
      layout: {
        w: 12,
        h: 4,
        x: 0,
        y: 16,
        i: "test_arc",
      },
    },
  ],
};
