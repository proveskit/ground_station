import BarChart from "../components/charts/BarChart";
import DoughnutChart from "../components/charts/DoughnutChart";
import LineChart from "../components/charts/LineChart";
import PolarAreaChart from "../components/charts/PolarAreaChart";

export default function Charts() {
  const weatherData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [12, 19, 15, 17, 22, 25],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Humidity (%)",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales 2024",
        data: [30, 45, 35, 50, 49, 60],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const marketShareData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        label: "Market Share",
        data: [30, 25, 20, 25],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const performanceData = {
    labels: ["Speed", "Handling", "Safety", "Comfort", "Efficiency"],
    datasets: [
      {
        label: "Performance Metrics",
        data: [85, 75, 90, 80, 88],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Data Visualization Examples</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <BarChart title="Monthly Weather Statistics" data={weatherData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <LineChart title="Sales Trend 2024" data={salesData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <DoughnutChart
            title="Market Share Distribution"
            data={marketShareData}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <PolarAreaChart title="Performance Analysis" data={performanceData} />
        </div>
      </div>
    </div>
  );
}
