import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  Palette,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const mainItems = [
  {
    title: "Opportunities",
    url: "/opportunities",
    icon: BarChart3,
  },
  {
    title: "Selection Builder",
    url: "/selection-builder",
    icon: Settings,
  },
  {
    title: "Quote Editor",
    url: "/quote-editor",
    icon: FileText,
  },
  {
    title: "PO Review",
    url: "/po-review",
    icon: ShoppingCart,
  },
  {
    title: "Lab Dips",
    url: "/lab-dips",
    icon: Palette,
  },
];

const clientItems = [
  {
    title: "Client Portal",
    url: "/client-portal",
    icon: Users,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [clientPortalOpen, setClientPortalOpen] = useState(false);
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/opportunities") {
      return location.pathname === path || location.pathname.startsWith("/opportunities/");
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="pt-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold tracking-wide">
            {!isCollapsed && "SOURCING"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls(isActive(item.url))}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Client Portal Section */}
        <SidebarGroup>
          <Collapsible open={clientPortalOpen} onOpenChange={setClientPortalOpen}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sidebar-foreground/70 font-semibold tracking-wide hover:text-sidebar-foreground">
                {!isCollapsed && (
                  <>
                    <span>CLIENT ACCESS</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                  </>
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {clientItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={getNavCls(isActive(item.url))}
                          title={isCollapsed ? item.title : undefined}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}