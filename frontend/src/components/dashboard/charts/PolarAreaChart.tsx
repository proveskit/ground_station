import { CardHeader, CardTitle, DarkCard } from "@/components/ui/card";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Title);

interface PolarAreaChartProps {
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

export default function PolarAreaChart({ title, data }: PolarAreaChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
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
      r: {
        grid: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle grid lines
        },
        ticks: {
          color: "#d1d5db", // Light gray for axis labels
          backdropColor: "transparent", // Remove tick backdrop
          font: {
            family: "'Inter', sans-serif",
          },
        },
        angleLines: {
          color: "rgba(75, 85, 99, 0.3)", // Subtle angle lines
        },
        pointLabels: {
          color: "#d1d5db", // Light gray for point labels
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
        <PolarArea options={options} data={data} />
      </div>
    </DarkCard>
  );
}
