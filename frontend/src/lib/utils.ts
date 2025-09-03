import { useQuery } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
// for api commands
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
