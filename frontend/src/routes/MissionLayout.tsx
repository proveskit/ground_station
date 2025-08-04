import PageWrapper from "@/components/PageWrapper";
import AppSidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { type MissionTypeApi, type MissionType } from "@/types/ApiTypes";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";

export default function MissionLayout() {
  let { mid } = useParams();

  const { data, isPending, isError, error } = useQuery<
    MissionTypeApi,
    Error,
    MissionType
  >({
    queryKey: ["api", "mission", mid],
    queryFn: async () => {
      const res = await fetch(`api/get/mission?id=${mid}`);
      if (!res.ok) {
        throw new Error("Failed to get mission");
      }

      const body = await res.json();
      console.log(body);
      return body;
    },
    select: (apiData): MissionType => {
      return {
        ...apiData,
        createdAt: new Date(apiData.createdAt),
      };
    },
  });

  if (isPending) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  } else if (isError) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p>An error occured while fetching: {error.message}</p>
      </div>
    );
  } else {
    return (
      <SidebarProvider defaultOpen={false}>
        <AppSidebar mission={data} />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </SidebarProvider>
    );
  }
}
