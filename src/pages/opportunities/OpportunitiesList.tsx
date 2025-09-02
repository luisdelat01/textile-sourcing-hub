import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";

export default function OpportunitiesList() {
  const opportunities = [
    {
      id: "OPP-001",
      title: "Spring Collection Fabrics",
      client: "Fashion Forward Inc",
      status: "Active",
      deadline: "2024-03-15",
      value: "$45,000",
    },
    {
      id: "OPP-002", 
      title: "Organic Cotton Sourcing",
      client: "EcoWear Brand",
      status: "Pending",
      deadline: "2024-03-20",
      value: "$28,500",
    },
    {
      id: "OPP-003",
      title: "Luxury Silk Import",
      client: "Premium Textiles Ltd",
      status: "In Review",
      deadline: "2024-04-01",
      value: "$62,000",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Manage your textile sourcing opportunities and track progress
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            placeholder="Search opportunities..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Opportunities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription className="mt-1">{opportunity.client}</CardDescription>
                </div>
                <Badge 
                  variant={opportunity.status === "Active" ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {opportunity.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-semibold">{opportunity.value}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span>{opportunity.deadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{opportunity.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}