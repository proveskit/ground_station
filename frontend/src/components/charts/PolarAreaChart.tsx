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
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <PolarArea options={options} data={data} />;
}
