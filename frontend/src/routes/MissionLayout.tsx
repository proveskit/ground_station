import PageWrapper from "@/components/PageWrapper";
import AppSidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useParams } from "react-router";

export default function MissionLayout() {
  let { mid } = useParams();

  // check valid here eventually ig

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar mid={mid!} />
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </SidebarProvider>
  );
}
