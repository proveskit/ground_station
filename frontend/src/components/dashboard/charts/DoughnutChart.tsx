import { DarkCard } from "@/components/ui/card";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DoughnutChartProps {
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

export default function DoughnutChart({ title, data }: DoughnutChartProps) {
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
  };

  return (
    <DarkCard className="p-6 w-full h-full overflow-hidden">
      <div className="w-full h-full max-h-80">
        <Doughnut options={options} data={data} />
      </div>
    </DarkCard>
  );
}
