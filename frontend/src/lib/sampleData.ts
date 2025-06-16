import type { DataResponse } from "../types/DataTypes";

export const sampleData: DataResponse = {
  statistics: [
    {
      type: "satInfo",
      title: "satellite_info",
      data: {
        lat: 29.889483671702582,
        lng: -97.94701096250438,
      },
    },
    {
      type: "chart",
      title: "satellite_signal_strength",
      chartType: "line",
      data: {
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
      },
    },
    {
      type: "chart",
      title: "satellite_signal_distribution",
      chartType: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Satellite Signal Strength",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      type: "chart",
      title: "satellite_signal_coverage",
      chartType: "doughnut",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Satellite Signal Strength",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      type: "chart",
      title: "satellite_signal_polar_analysis",
      chartType: "polar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Satellite Signal Strength",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      type: "text",
      title: "last_frame_received",
      data: {
        color: "text-blue-500",
        text: "25 minutes ago",
      },
    },
    {
      type: "text",
      title: "total_frame_count",
      data: {
        color: "text-blue-500",
        text: "352",
      },
    },
    {
      type: "text",
      title: "satellite_position",
      data: {
        color: "text-blue-500",
        text: "29.889483671702582, -97.94701096250438",
      },
    },
  ],
};
