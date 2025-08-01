import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
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
import MissionsPage from "./routes/MissionsPage.tsx";
import MissionLayout from "./routes/MissionLayout.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<MissionsPage />} />
          <Route path=":mid" element={<MissionLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="commands" element={<Commands />} />
            <Route path="logs" element={<Logs />} />
            <Route path="packets" element={<Packets />} />
            <Route path="software-update" element={<SoftwareUpdate />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
