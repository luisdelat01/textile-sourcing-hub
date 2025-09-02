import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Palette, Clock, CheckCircle, X, Camera, Upload } from "lucide-react";

export default function LabDips() {
  const labDipRequests = [
    {
      id: "LD-001",
      fabric: "Organic Cotton Blend",
      color: "Forest Green",
      pantone: "PANTONE 553 C",
      supplier: "Premium Textiles Ltd",
      status: "Pending Approval",
      requestDate: "2024-02-10",
      expectedDate: "2024-02-20",
      po: "PO-2024-001",
    },
    {
      id: "LD-002",
      fabric: "Silk Cotton Mix",
      color: "Navy Blue",
      pantone: "PANTONE 19-4052 TPX",
      supplier: "EcoFiber Solutions",
      status: "Approved",
      requestDate: "2024-02-08",
      approvedDate: "2024-02-15",
      po: "PO-2024-002",
    },
    {
      id: "LD-003",
      fabric: "Premium Linen",
      color: "Warm Beige",
      pantone: "PANTONE 14-1118 TPX",
      supplier: "Organic Cotton Co",
      status: "Revision Required",
      requestDate: "2024-02-05",
      notes: "Color too light, needs to be 20% darker",
      po: "PO-2024-001",
    },
  ];

  const colorMatches = [
    { id: 1, name: "Target Color", type: "pantone", color: "bg-emerald-600" },
    { id: 2, name: "Lab Dip Sample", type: "physical", color: "bg-emerald-500" },
    { id: 3, name: "Color Difference", type: "delta", value: "ΔE = 2.1" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Pending Approval":
        return <Clock className="h-4 w-4 text-warning" />;
      case "Revision Required":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending Approval":
        return "secondary";
      case "Revision Required":
        return "destructive";
      default:
        return "outline";
    }
  };

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

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Lab Dip Requests</TabsTrigger>
          <TabsTrigger value="approval">Color Approval</TabsTrigger>
          <TabsTrigger value="library">Color Library</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {labDipRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        {request.id}
                      </CardTitle>
                      <CardDescription className="mt-1">{request.supplier}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Color Preview */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-background shadow-sm" />
                      <div>
                        <p className="font-medium">{request.color}</p>
                        <p className="text-sm text-muted-foreground">{request.pantone}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fabric:</span>
                        <span className="font-medium">{request.fabric}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">PO:</span>
                        <span>{request.po}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Requested:</span>
                        <span>{request.requestDate}</span>
                      </div>
                      {request.expectedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expected:</span>
                          <span>{request.expectedDate}</span>
                        </div>
                      )}
                      {request.approvedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Approved:</span>
                          <span>{request.approvedDate}</span>
                        </div>
                      )}
                    </div>

                    {request.notes && (
                      <div className="p-2 bg-muted rounded-lg">
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          {/* Color Approval Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Matching - LD-001
              </CardTitle>
              <CardDescription>
                Forest Green for Organic Cotton Blend • PANTONE 553 C
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Color Comparison */}
                <div>
                  <h4 className="font-semibold mb-4">Color Comparison</h4>
                  <div className="space-y-4">
                    {colorMatches.map((match) => (
                      <div key={match.id} className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-lg ${match.color} border-2 border-background shadow-sm`} />
                        <div>
                          <p className="font-medium">{match.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.type === "pantone" && "Reference Standard"}
                            {match.type === "physical" && "Lab Dip Sample"}
                            {match.type === "delta" && match.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Images */}
                <div>
                  <h4 className="font-semibold mb-4">Sample Images</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Reference Photo</p>
                      </div>
                    </div>
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Upload Sample</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Analysis */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Color Analysis</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ΔE Value:</span>
                    <span className="ml-2 font-semibold">2.1</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lightness:</span>
                    <span className="ml-2 font-semibold">-1.2</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chroma:</span>
                    <span className="ml-2 font-semibold">+0.8</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Color difference is within acceptable range (ΔE &lt; 3.0). Minor adjustments recommended.
                </p>
              </div>

              {/* Approval Actions */}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1">
                  Request Revision
                </Button>
                <Button className="flex-1">
                  Approve Color
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          {/* Color Library */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Color Library</CardTitle>
              <CardDescription>
                Reference library of approved colors for future projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className={`w-full aspect-square rounded-lg border-2 border-background shadow-sm ${
                      i % 8 === 0 ? 'bg-red-500' :
                      i % 8 === 1 ? 'bg-blue-500' :
                      i % 8 === 2 ? 'bg-green-500' :
                      i % 8 === 3 ? 'bg-yellow-500' :
                      i % 8 === 4 ? 'bg-purple-500' :
                      i % 8 === 5 ? 'bg-pink-500' :
                      i % 8 === 6 ? 'bg-indigo-500' : 'bg-gray-500'
                    } group-hover:scale-105 transition-transform`} />
                    <p className="text-xs text-center mt-1 text-muted-foreground">
                      Color {i + 1}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}