import BarChart from "@/components/charts/BarChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import LineChart from "@/components/charts/LineChart";
import PolarAreaChart from "@/components/charts/PolarAreaChart";
import PageHeader from "@/components/PageHeader";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const layout = [
    { i: "lineChart", x: 0, y: 0, w: 3, h: 8, static: false },
    { i: "barChart", x: 3, y: 0, w: 6, h: 8, static: false },
    { i: "doughnutChart", x: 0, y: 8, w: 6, h: 8, static: false },
    { i: "polarChart", x: 6, y: 8, w: 6, h: 8, static: false },
  ];

  // Sample data for Line Chart
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Satellite Signal Strength",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
      },
      {
        label: "Ground Station Reception",
        data: [28, 48, 40, 19, 86, 27],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.1,
      },
    ],
  };

  // Sample data for Bar Chart
  const barChartData = {
    labels: [
      "Communications",
      "Navigation",
      "Weather",
      "Military",
      "Commercial",
    ],
    datasets: [
      {
        label: "Active Satellites",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Sample data for Doughnut Chart
  const doughnutChartData = {
    labels: ["Operational", "Maintenance", "Offline"],
    datasets: [
      {
        label: "Station Status",
        data: [75, 15, 10],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for Polar Area Chart
  const polarChartData = {
    labels: ["North", "South", "East", "West", "Central"],
    datasets: [
      {
        label: "Coverage Area",
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          "rgba(147, 51, 234, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgba(147, 51, 234, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <PageHeader title="Dashboard" />
      <ResponsiveGridLayout
        className="layout bg-neutral-800 rounded-md"
        layouts={{ lg: layout }}
        cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
        rowHeight={30}
        width={1600}
      >
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
