import type { ChartType } from "@/types/CardTypes";
import { useQuery } from "@tanstack/react-query";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const COLORS = {
  red: "rgb(220, 50, 50)",
  green: "rgb(50, 220, 50)",
  blue: "rgb(50, 50, 220)",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function underScoreToTitleCase(str: string) {
  const splitStr = str.toLowerCase().replace(/_/g, " ").split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

// Just a simple wrapper for useQuery so there's less boilerplate needed
// for api calls
export function useMakeQuery<T>(
  url: string,
  queryFn: (...args: any[]) => Promise<T>,
) {
  const queryKey = url.split("/");

  const query = useQuery<T>({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch {
        throw new Error(`Failed to fetch for api request \"${url}\"`);
      }
    },
  });

  return query;
}

// Generate proper data structure for each chart type
export function generateChartData(
  type: ChartType,
  data: any[],
):
  | {
      color: string;
      text: string;
    }
  | {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        borderColor?: string | string[];
        backgroundColor?: string | string[];
        tension?: number;
      }[];
    } {
  if (data.length === 0) {
    return { color: "text-red-500", text: "Data is empty!" };
  }

  if (type === "text") {
    return { color: "text-white", text: data[data.length - 1] };
  } else {
    const labelArr = [];
    for (let i = 0; i < data.length; i++) {
      labelArr.push(String(i + 1));
    }

    // Check if data is vec3, only type that has arrays in arrays
    if (Array.isArray(data[0])) {
      const finalData: { [key: string]: number[] } = {
        x: [],
        y: [],
        z: [],
      };

      for (const d of data) {
        finalData["x"].push(d[0]);
        finalData["y"].push(d[1]);
        finalData["z"].push(d[2]);
      }

      const result = {
        labels: labelArr,
        datasets: [],
      };

      result.datasets.push({
        label: "x",
        data: finalData["x"],
        borderColor: COLORS.blue,
      });
      result.datasets.push({
        label: "y",
        data: finalData["y"],
        borderColor: COLORS.red,
      });
      result.datasets.push({
        label: "z",
        data: finalData["z"],
        borderColor: COLORS.green,
      });

      console.log(`The Result: ${JSON.stringify(result)}`);

      return result;
    } else {
      return {
        labels: labelArr,
        datasets: [
          {
            label: "Data",
            data: data,
            borderColor: COLORS.blue,
          },
        ],
      };
    }
  }
}
