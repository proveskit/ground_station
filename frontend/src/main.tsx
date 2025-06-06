import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import AppSidebar from "./components/Sidebar.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import "./index.css";
import Charts from "./routes/charts.tsx";
import Commands from "./routes/Commands.tsx";
import Home from "./routes/Home.tsx";
import Logs from "./routes/Logs.tsx";
import Settings from "./routes/Settings.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>
);
