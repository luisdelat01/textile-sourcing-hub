import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Send, Save, Calculator, Eye } from "lucide-react";

export default function QuoteEditor() {
  const quotes = [
    {
      id: "QUO-001",
      title: "Spring Collection Quote",
      opportunity: "OPP-001",
      client: "Fashion Forward Inc",
      status: "Draft",
      totalValue: "$42,500",
      items: 8,
      lastModified: "2024-02-10",
    },
    {
      id: "QUO-002",
      title: "Organic Cotton Pricing",
      opportunity: "OPP-002",
      client: "EcoWear Brand",
      status: "Sent",
      totalValue: "$28,950",
      items: 5,
      lastModified: "2024-02-08",
    },
  ];

  const currentQuote = {
    id: "QUO-001",
    title: "Spring Collection Quote",
    client: "Fashion Forward Inc",
    items: [
      {
        id: 1,
        description: "Organic Cotton Blend - Natural White",
        fabric: "COT-001",
        quantity: 500,
        unit: "yards",
        unitPrice: 12.50,
        total: 6250,
      },
      {
        id: 2,
        description: "Silk Cotton Mix - Cream",
        fabric: "SIL-002",
        quantity: 300,
        unit: "yards",
        unitPrice: 18.75,
        total: 5625,
      },
      {
        id: 3,
        description: "Premium Linen - Off White",
        fabric: "LIN-003",
        quantity: 200,
        unit: "yards",
        unitPrice: 24.00,
        total: 4800,
      },
    ],
    subtotal: 16675,
    shipping: 850,
    tax: 1502.25,
    total: 19027.25,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quote Editor</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage quotes for your textile sourcing opportunities
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Quote
        </Button>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Quote Editor</TabsTrigger>
          <TabsTrigger value="library">Quote Library</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Editor Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {currentQuote.title}
                  </CardTitle>
                  <CardDescription>
                    Quote for {currentQuote.client} • ID: {currentQuote.id}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save Draft
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Send Quote
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quote Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Quote Items</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {/* Quote Items */}
                {currentQuote.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-muted/50">
                    <div className="col-span-4">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">Fabric: {item.fabric}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{item.quantity} {item.unit}</p>
                    </div>
                    <div className="col-span-2">
                      <p>${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold">${item.total.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quote Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${currentQuote.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${currentQuote.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${currentQuote.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${currentQuote.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quote Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Valid Until</label>
                    <input 
                      type="date" 
                      className="w-full mt-1 p-2 border rounded-lg bg-background"
                      defaultValue="2024-03-15"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Payment Terms</label>
                    <select className="w-full mt-1 p-2 border rounded-lg bg-background">
                      <option>Net 30</option>
                      <option>Net 60</option>
                      <option>COD</option>
                      <option>50% Advance, 50% on delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <textarea 
                      className="w-full mt-1 p-2 border rounded-lg bg-background h-20"
                      placeholder="Additional notes or terms..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          {/* Quote Library */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quote.title}</CardTitle>
                      <CardDescription className="mt-1">{quote.client}</CardDescription>
                    </div>
                    <Badge 
                      variant={
                        quote.status === "Sent" ? "default" : 
                        quote.status === "Approved" ? "secondary" : "outline"
                      }
                    >
                      {quote.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Value:</span>
                      <span className="font-semibold">{quote.totalValue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{quote.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Modified:</span>
                      <span>{quote.lastModified}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-xs">{quote.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}