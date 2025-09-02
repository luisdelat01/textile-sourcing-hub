import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/opportunities": "Opportunities",
  "/selection-builder": "Selection Builder",
  "/quote-editor": "Quote Editor",
  "/po-review": "PO Review",
  "/lab-dips": "Lab Dips",
  "/client-portal": "Client Portal",
};

export function TopNavigation() {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];
    
    // Always start with "Justly"
    breadcrumbs.push({ label: "Justly", path: "/" });
    
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Handle dynamic routes
      if (segment.length > 20 || /^[a-f0-9-]{36}$/.test(segment)) {
        // This looks like an ID or token
        if (currentPath.includes("/opportunities/")) {
          breadcrumbs.push({ label: `Opportunity #${segment.slice(0, 8)}`, path: currentPath });
        } else if (currentPath.includes("/client-portal/")) {
          breadcrumbs.push({ label: "Portal Access", path: currentPath });
        } else {
          breadcrumbs.push({ label: segment.slice(0, 8), path: currentPath });
        }
      } else {
        const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ label, path: currentPath });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center gap-4 px-6">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="h-8 w-8" />
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="font-semibold text-foreground">
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={breadcrumb.path}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}