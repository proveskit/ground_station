import {
  FiDownload,
  FiFileText,
  FiHome,
  FiPackage,
  FiSettings,
  FiTerminal,
} from "react-icons/fi";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export default function AppSidebar({ mid }: { mid: string }) {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: FiHome,
    },
    {
      title: "Commands",
      url: "/commands",
      icon: FiTerminal,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: FiFileText,
    },
    {
      title: "Packets",
      url: "/packets",
      icon: FiPackage,
    },
    {
      title: "Software Update",
      url: "/software-update",
      icon: FiDownload,
    },
  ];

  const footerItems = [
    {
      title: "Settings",
      url: "/settings",
      icon: FiSettings,
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1 min-h-[2.5rem]">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 group-data-[collapsible=icon]:-ml-2 transition-all">
            <span className="text-primary-foreground font-bold text-sm select-none">
              GS
            </span>
          </div>
          <span className="font-semibold whitespace-nowrap overflow-hidden transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
            Ground Station
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const path = `/${mid}${item.url === "/" ? "" : item.url}`;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === path}
                      tooltip={item.title}
                      className="!text-white hover:!text-white [&>svg]:!text-white data-[active=true]:!text-white"
                    >
                      <Link to={path}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => {
            const path = `/${mid}${item.url === "/" ? "" : item.url}`;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === path}
                  tooltip={item.title}
                  className="!text-white hover:!text-white [&>svg]:!text-white data-[active=true]:!text-white"
                >
                  <Link to={path}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
