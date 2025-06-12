export const lineChartData = {
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

export const barChartData = {
  labels: ["Communications", "Navigation", "Weather", "Military", "Commercial"],
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

export const doughnutChartData = {
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

export const polarChartData = {
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
