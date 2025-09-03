import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useLabDips } from "@/contexts/LabDipsContext";

export default function LabDips() {
  const { labDips, updateLabDipStatus } = useLabDips();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Requested":
        return "secondary";
      case "Sent":
        return "outline";
      case "Approved":
        return "default";
      default:
        return "outline";
    }
  };

  const columns = [
    { 
      title: "Requested", 
      status: "Requested" as const,
      bgClass: "bg-muted/30"
    },
    { 
      title: "Sent", 
      status: "Sent" as const,
      bgClass: "bg-accent/30"
    },
    { 
      title: "Approved", 
      status: "Approved" as const,
      bgClass: "bg-primary/10"
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lab Dips</h1>
          <p className="text-muted-foreground mt-1">
            Manage color matching and approval process for fabric samples
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Lab Dip Request
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnDips = labDips.filter(dip => dip.status === column.status);
          
          return (
            <Card key={column.status} className={`${column.bgClass} min-h-[500px]`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {column.title}
                  <Badge variant="outline" className="ml-2">
                    {columnDips.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {columnDips.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No lab dips in this stage.
                  </p>
                ) : (
                  columnDips.map((dip) => (
                    <Card key={dip.id} className="hover:shadow-md transition-shadow animate-in fade-in duration-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{dip.article}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{dip.colorRef}</p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(dip.status)} className="text-xs">
                              {dip.status}
                            </Badge>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {dip.status === "Requested" && (
                              <Button 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => updateLabDipStatus(dip.id, "Sent")}
                              >
                                Mark as Sent
                              </Button>
                            )}
                            {dip.status === "Sent" && (
                              <Button 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => updateLabDipStatus(dip.id, "Approved")}
                              >
                                Approve
                              </Button>
                            )}
                            {dip.status === "Approved" && (
                              <div className="w-full text-center py-2 text-xs text-muted-foreground">
                                Process Complete
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}