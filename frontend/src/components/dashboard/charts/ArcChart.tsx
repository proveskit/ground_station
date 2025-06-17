import { DarkCard } from "@/components/ui/card";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface ArcChartProps {
  title: string;
  data: number;
}

export default function ArcChart({ title, data }: ArcChartProps) {
  const options = {
    responsive: true,
    circumference: 270,
    rotation: 225,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#f3f4f6", // Light gray text for dark theme
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: "#f9fafb", // Near white for title
        font: {
          size: 24,
          weight: "bold" as const,
          family: "'Inter', sans-serif",
        },
        padding: {
          top: 16,
          bottom: 16,
        },
      },
    },
  };

  return (
    <DarkCard className="p-6 w-full h-full overflow-hidden">
      <div className="w-full h-full max-h-80">
        <Doughnut
          options={options}
          data={{
            labels: ["Used", "Remaining"],
            datasets: [
              {
                data: [data, 100 - data],
                backgroundColor: ["rgb(59, 130, 246)", "rgb(31, 41, 55)"],
                borderWidth: 0,
              },
            ],
          }}
        />
      </div>
    </DarkCard>
  );
}
