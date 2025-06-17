import { CardHeader, CardTitle, DarkCard } from "@/components/ui/card";
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
        display: false,
      },
      title: {
        display: false,
      },
      centerText: {
        id: "centerText",
        beforeDraw(chart: ChartJS) {
          const { ctx, width, height } = chart;
          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "bold 32px Inter";
          ctx.fillStyle = "#f9fafb";
          ctx.fillText(`${data}%`, width / 2, height / 2);
          ctx.restore();
        },
      },
    },
  };

  return (
    <DarkCard className="w-full h-full overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="w-full h-full p-4 flex-1">
        <Doughnut
          options={options}
          data={{
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
