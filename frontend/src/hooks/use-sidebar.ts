import type { SidebarContextProps } from "@/components/ui/sidebar";
import React from "react";

export const SidebarContext = React.createContext<SidebarContextProps | null>(
  null
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}
