import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, AlertTriangle, FileCheck, Truck, Package } from "lucide-react";

export default function POReview() {
  const purchaseOrders = [
    {
      id: "PO-2024-001",
      supplier: "Premium Textiles Ltd",
      quote: "QUO-001",
      value: "$42,500",
      status: "Pending Review",
      items: 8,
      deliveryDate: "2024-04-15",
      createdDate: "2024-02-10",
    },
    {
      id: "PO-2024-002",
      supplier: "EcoFiber Solutions",
      quote: "QUO-002",
      value: "$28,950",
      status: "Approved",
      items: 5,
      deliveryDate: "2024-03-30",
      createdDate: "2024-02-08",
    },
    {
      id: "PO-2024-003",
      supplier: "Organic Cotton Co",
      quote: "QUO-003",
      value: "$15,750",
      status: "In Transit",
      items: 3,
      deliveryDate: "2024-03-20",
      createdDate: "2024-01-25",
    },
  ];

  const reviewChecklist = [
    { item: "Supplier credentials verified", status: "completed" },
    { item: "Quality specifications confirmed", status: "completed" },
    { item: "Delivery terms agreed", status: "completed" },
    { item: "Payment terms finalized", status: "in-progress" },
    { item: "Compliance documentation", status: "pending" },
    { item: "Insurance coverage verified", status: "pending" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Review":
        return <Clock className="h-4 w-4" />;
      case "Approved":
        return <CheckCircle className="h-4 w-4" />;
      case "In Transit":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "In Transit":
        return "secondary";
      case "Pending Review":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">PO Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage purchase orders for approved quotes
          </p>
        </div>
      </div>

      <Tabs defaultValue="review" className="space-y-4">
        <TabsList>
          <TabsTrigger value="review">Current Review</TabsTrigger>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-6">
          {/* Current PO Being Reviewed */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    PO-2024-001 Review
                  </CardTitle>
                  <CardDescription>
                    Premium Textiles Ltd • Spring Collection Quote
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Request Changes</Button>
                  <Button>Approve PO</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Order Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Value:</span> $42,500</p>
                    <p><span className="text-muted-foreground">Items:</span> 8 fabric types</p>
                    <p><span className="text-muted-foreground">Delivery:</span> April 15, 2024</p>
                    <p><span className="text-muted-foreground">Payment:</span> Net 30</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Supplier Info</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Company:</span> Premium Textiles Ltd</p>
                    <p><span className="text-muted-foreground">Contact:</span> Sarah Johnson</p>
                    <p><span className="text-muted-foreground">Rating:</span> ⭐⭐⭐⭐⭐ (4.8/5)</p>
                    <p><span className="text-muted-foreground">Certification:</span> GOTS, OEKO-TEX</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quality Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">On-time delivery:</span> 94%</p>
                    <p><span className="text-muted-foreground">Quality score:</span> 4.7/5</p>
                    <p><span className="text-muted-foreground">Defect rate:</span> &lt;0.5%</p>
                    <p><span className="text-muted-foreground">Past orders:</span> 23 completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Review Checklist</CardTitle>
              <CardDescription>
                Complete all items before approving the purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviewChecklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'completed' ? 'bg-success' :
                      item.status === 'in-progress' ? 'bg-warning' : 'bg-muted'
                    }`} />
                    <span className={`flex-1 ${
                      item.status === 'completed' ? 'text-muted-foreground line-through' : ''
                    }`}>
                      {item.item}
                    </span>
                    {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-success" />}
                    {item.status === 'in-progress' && <Clock className="h-4 w-4 text-warning" />}
                    {item.status === 'pending' && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {purchaseOrders.map((po) => (
              <Card key={po.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(po.status)}
                        {po.id}
                      </CardTitle>
                      <CardDescription className="mt-1">{po.supplier}</CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(po.status)}>
                      {po.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-semibold">{po.value}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{po.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span>{po.deliveryDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{po.createdDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
              <CardDescription>
                Track the status of approved purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sample tracking for PO-2024-003 */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">PO-2024-003 - Organic Cotton Co</h4>
                    <Badge variant="secondary">In Transit</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">January 25, 2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">Production Started</p>
                        <p className="text-sm text-muted-foreground">February 1, 2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">Quality Check Passed</p>
                        <p className="text-sm text-muted-foreground">February 28, 2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-warning rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">Shipped</p>
                        <p className="text-sm text-muted-foreground">March 5, 2024 • Tracking: TRK123456789</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-muted rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">Expected Delivery</p>
                        <p className="text-sm text-muted-foreground">March 20, 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}