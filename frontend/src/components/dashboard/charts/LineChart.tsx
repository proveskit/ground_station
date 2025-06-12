import { DarkCard } from "@/components/ui/card";
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
  Legend
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
        position: "top" as const,
        labels: {
          color: "#f3f4f6", // Light gray text for dark theme
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: "#f9fafb", // Near white for title
        font: {
          size: 16,
          weight: "bold" as const,
        },
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
        },
      },
      y: {
        grid: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle grid lines
        },
        ticks: {
          color: "#d1d5db", // Light gray for axis labels
        },
      },
    },
  };

  return (
    <DarkCard className="p-6 w-full h-full overflow-hidden">
      <div className="w-full h-full max-h-80">
        <Line options={options} data={data} />
      </div>
    </DarkCard>
  );
}
