import type { DataEntry } from "../types/CardTypes";

export const sampleData: Record<string, DataEntry[]> = {
  communication: [
    {
      title: "satellite_info",
      chartType: "satInfo",
      data: {
        lat: 29.889483671702582,
        lng: -97.94701096250438,
      },
    },
    {
      title: "RSSI",
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
      title: "last_contact_time",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "25 minutes ago",
      },
    },
    {
      title: "data_rate",
      chartType: "line",
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
      title: "last_frame_received",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "25 minutes ago",
      },
    },
    {
      title: "total_frame_count",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "352",
      },
    },
    {
      title: "satellite_position",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "29.889483671702582, -97.94701096250438",
      },
    },
  ],
  power_system: [],
  temperature: [],
  flight_software: [
    {
      title: "flight_software_version",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "1.0.0",
      },
    },
    {
      title: "boot_count",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "352",
      },
    },
    {
      title: "uptime",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "352",
      },
    },
    {
      title: "time_since_last_reboot",
      chartType: "text",
      data: {
        color: "text-blue-500",
        text: "352",
      },
    },
    {
      title: "test_arc",
      chartType: "arc",
      data: 75,
    },
  ],
};
