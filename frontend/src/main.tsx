import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import AppSidebar from "./components/Sidebar.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import "./index.css";
import Commands from "./routes/Commands.tsx";
import Dashboard from "./routes/Dashboard.tsx";
import Logs from "./routes/Logs.tsx";
import Packets from "./routes/Packets.tsx";
import Settings from "./routes/Settings.tsx";
import SoftwareUpdate from "./routes/SoftwareUpdate.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <div className="flex h-full w-full max-w-[1600px] flex-col pr-2 mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/commands" element={<Commands />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/packets" element={<Packets />} />
              <Route path="/software-update" element={<SoftwareUpdate />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </SidebarProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
