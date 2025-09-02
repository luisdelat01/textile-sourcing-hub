import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, MessageSquare, Clock, CheckCircle, Package } from "lucide-react";

export default function ClientPortal() {
  const { token } = useParams<{ token: string }>();

  // Mock client data - in real app this would be fetched based on token
  const clientData = {
    name: "Fashion Forward Inc",
    contact: "Emma Thompson",
    email: "emma@fashionforward.com",
    token: token || "demo-token-123",
    projects: [
      {
        id: "OPP-001",
        name: "Spring Collection Fabrics",
        status: "In Progress",
        timeline: "2024-03-15",
        value: "$45,000",
        progress: 75,
      },
      {
        id: "OPP-005", 
        name: "Summer Lightweight Materials",
        status: "Quote Pending",
        timeline: "2024-04-30",
        value: "$32,000",
        progress: 45,
      },
    ],
    quotes: [
      {
        id: "QUO-001",
        project: "OPP-001",
        title: "Spring Collection Quote",
        status: "Approved",
        value: "$42,500",
        date: "2024-02-15",
      },
      {
        id: "QUO-005",
        project: "OPP-005", 
        title: "Summer Materials Quote",
        status: "Pending Review",
        value: "$31,750",
        date: "2024-02-20",
      },
    ],
    orders: [
      {
        id: "PO-2024-001",
        project: "OPP-001",
        status: "In Production",
        value: "$42,500",
        expectedDelivery: "2024-04-15",
        items: [
          { name: "Organic Cotton Blend", quantity: "500 yards", status: "In Production" },
          { name: "Silk Cotton Mix", quantity: "300 yards", status: "Quality Check" },
          { name: "Premium Linen", quantity: "200 yards", status: "Ready" },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Client Portal</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {clientData.contact} from {clientData.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Portal Access</p>
              <p className="font-mono text-xs">{clientData.token}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{clientData.projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed Orders</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Quotes</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="orders">Order Status</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {clientData.projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Project ID: {project.id}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={project.status === "In Progress" ? "default" : "secondary"}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-semibold">{project.value}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Target Date:</span>
                          <span>{project.timeline}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clientData.quotes.map((quote) => (
                <Card key={quote.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quote.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {quote.id} • {quote.project}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={quote.status === "Approved" ? "default" : "secondary"}
                      >
                        {quote.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value:</span>
                        <span className="font-semibold">{quote.value}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{quote.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {clientData.orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {order.id}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Project: {order.project} • Value: {order.value}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Delivery:</span>
                      <span className="font-semibold">{order.expectedDelivery}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.quantity}</p>
                            </div>
                            <Badge 
                              variant={
                                item.status === "Ready" ? "default" :
                                item.status === "Quality Check" ? "secondary" : "outline"
                              }
                              className="text-xs"
                            >
                              {item.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                  Communication with your sourcing team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">Project Update - Spring Collection</p>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lab dip samples have been approved for the organic cotton blend. 
                      Production is scheduled to begin next week.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">Quote Ready for Review</p>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your quote for the Summer Lightweight Materials project is ready for review. 
                      Please check the quotes section for details.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">Delivery Schedule Confirmed</p>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your order PO-2024-001 is on track for delivery on April 15th. 
                      We'll send tracking information once shipped.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}