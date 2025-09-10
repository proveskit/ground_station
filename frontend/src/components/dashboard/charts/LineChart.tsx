import { CardHeader, CardTitle, DarkCard } from "@/components/ui/card";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string | string[];
      backgroundColor?: string | string[];
      tension?: number;
    }[];
  };
}

export default function LineChart({ title, data }: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#f3f4f6", // Light gray text for dark theme
          font: {
            size: 10,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)", // Dark background for tooltips
        titleColor: "#f9fafb",
        bodyColor: "#f3f4f6",
        borderColor: "#374151",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle grid lines
        },
        ticks: {
          color: "#d1d5db", // Light gray for axis labels
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle grid lines
        },
        ticks: {
          color: "#d1d5db", // Light gray for axis labels
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  return (
    <DarkCard className="w-full h-full overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="w-full h-full pt-4 px-2 flex-1">
        <Line options={options} data={data} />
      </div>
    </DarkCard>
  );
}
