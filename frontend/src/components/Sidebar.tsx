import {
  FiDownload,
  FiFileText,
  FiHome,
  FiPackage,
  FiSettings,
  FiTerminal,
  FiLogIn,
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
import { SignedIn, SignedOut, UserButton } from "@clerk/react-router";
import type { MissionType } from "@/types/ApiTypes";

export default function AppSidebar({ mission }: { mission: MissionType }) {
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
            {mission.name}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const path = `/${mission.id}${item.url === "/" ? "" : item.url}`;
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
            const path = `/${mission.id}${item.url === "/" ? "" : item.url}`;
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
          <SidebarMenuItem key={"home"}>
            <SidebarMenuButton
              asChild
              tooltip={"Home"}
              className="!text-white hover:!text-white [&>svg]:!text-white data-[active=true]:!text-white"
            >
              <Link to={"/"}>
                <FiHome />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem key="loginButton">
            <>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SidebarMenuButton
                  asChild
                  tooltip="Login"
                  className="!text-white hover:!text-white [&>svg]:!text-white data-[active=true]:!text-white"
                >
                  <Link to={`/login?url=${location.pathname}`}>
                    <FiLogIn />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SignedOut>
            </>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
