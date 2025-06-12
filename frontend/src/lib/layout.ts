import type { Layout } from "react-grid-layout";

export type DashboardLayoutType = {
  [key: string]: {
    chartType: "line" | "bar" | "doughnut" | "polar" | "satInfo";
    layout: Layout;
  }[];
};

export const dashboardLayout: DashboardLayoutType = {
  statistics: [
    {
      chartType: "satInfo",
      layout: {
        w: 8,
        h: 10,
        x: 0,
        y: 0,
        i: "satInfo",
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
        y: 10,
        i: "lineChart",
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
        y: 10,
        i: "barChart",
        moved: false,
        static: false,
      },
    },
    {
      chartType: "doughnut",
      layout: {
        w: 3,
        h: 8,
        x: 5,
        y: 18,
        i: "doughnutChart",
        moved: false,
        static: false,
      },
    },
  ],
};
