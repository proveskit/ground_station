import { DarkCard } from "@/components/ui/card";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
}

export default function BarChart({ title, data }: BarChartProps) {
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
        <Bar options={options} data={data} />
      </div>
    </DarkCard>
  );
}
