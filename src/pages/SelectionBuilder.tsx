import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Grid3X3, List, Filter, Search } from "lucide-react";

export default function SelectionBuilder() {
  const fabricSelections = [
    {
      id: "SEL-001",
      name: "Spring Cotton Blend",
      opportunity: "OPP-001",
      fabrics: 12,
      status: "Draft",
      lastModified: "2024-02-10",
    },
    {
      id: "SEL-002",
      name: "Organic Denim Collection",
      opportunity: "OPP-002",
      fabrics: 8,
      status: "Under Review",
      lastModified: "2024-02-08",
    },
    {
      id: "SEL-003",
      name: "Luxury Silk Variants",
      opportunity: "OPP-003",
      fabrics: 15,
      status: "Approved",
      lastModified: "2024-02-05",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Selection Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage fabric selections for your sourcing opportunities
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Selection
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search selections..."
              className="w-64 pl-10 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selection Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fabricSelections.map((selection) => (
          <Card key={selection.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{selection.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Linked to {selection.opportunity}
                  </CardDescription>
                </div>
                <Badge 
                  variant={
                    selection.status === "Approved" ? "default" : 
                    selection.status === "Under Review" ? "secondary" : "outline"
                  }
                >
                  {selection.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock fabric preview */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: Math.min(selection.fabrics, 8) }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border bg-gradient-to-br from-primary/20 to-accent/20"
                    />
                  ))}
                  {selection.fabrics > 8 && (
                    <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        +{selection.fabrics - 8}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fabrics:</span>
                    <span className="font-semibold">{selection.fabrics}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Modified:</span>
                    <span>{selection.lastModified}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">{selection.id}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" className="flex-1">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for new users */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Grid3X3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start Building Your Selection</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Create curated fabric selections for your clients. Organize, compare, and present 
            your sourcing options in a professional format.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}