import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Send, TestTube, Calculator, FileText, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Quote, QuoteLine } from "@/types/quote";
import { QuotePDFButton } from "@/components/QuotePDFButton";

// Mock selection data based on opportunity ID
const getMockSelection = (opportunityId: string) => {
  const selections = {
    "OPP-001": {
      id: "sel-001",
      name: "Premium Denim Collection",
      lines: [
        {
          productId: "prod-001",
          name: "Premium Stretch Denim",
          unit: "yard",
          quantity: 1500,
          price: 9.75,
          labDipRequired: true
        },
        {
          productId: "prod-002",
          name: "Organic Cotton Denim",
          unit: "yard", 
          quantity: 2000,
          price: 8.25,
          labDipRequired: true
        },
        {
          productId: "prod-003",
          name: "Lightweight Chambray",
          unit: "yard",
          quantity: 1000,
          price: 6.50,
          labDipRequired: false
        }
      ]
    },
    "OPP-002": {
      id: "sel-002",
      name: "Cotton Basics Collection",
      lines: [
        {
          productId: "prod-004",
          name: "Premium Cotton Poplin",
          unit: "yard",
          quantity: 1000,
          price: 8.50,
          labDipRequired: true
        },
        {
          productId: "prod-005",
          name: "Stretch Poly Blend",
          unit: "yard", 
          quantity: 2500,
          price: 6.25,
          labDipRequired: false
        },
        {
          productId: "prod-006",
          name: "Organic Cotton Jersey",
          unit: "yard",
          quantity: 1800,
          price: 7.75,
          labDipRequired: true
        }
      ]
    },
    "OPP-003": {
      id: "sel-003",
      name: "Luxury Silk Selection",
      lines: [
        {
          productId: "prod-007",
          name: "Pure Silk Charmeuse",
          unit: "yard",
          quantity: 500,
          price: 24.50,
          labDipRequired: true
        },
        {
          productId: "prod-008",
          name: "Silk Organza",
          unit: "yard", 
          quantity: 300,
          price: 18.75,
          labDipRequired: true
        },
        {
          productId: "prod-009",
          name: "Mulberry Silk Crepe",
          unit: "yard",
          quantity: 400,
          price: 22.00,
          labDipRequired: false
        }
      ]
    }
  };

  return selections[opportunityId as keyof typeof selections] || selections["OPP-002"];
};

const unitOptions = ["yard", "meter", "piece", "roll", "kg"];
const incotermsOptions = ["EXW", "FOB", "CIF", "DAP", "DDP", "FCA"];

const opportunityOptions = [
  { id: "OPP-001", name: "Premium Denim Collection" },
  { id: "OPP-002", name: "Cotton Basics Collection" },
  { id: "OPP-003", name: "Luxury Silk Selection" },
];

// Empty State Component
function EmptyState({ navigate }: { navigate: (url: string) => void }) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>("");

  const handleOpportunitySelect = (opportunityId: string) => {
    navigate(`/quote-editor?id=${opportunityId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-6">
      <Card className="w-full max-w-md bg-background border shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Select an Opportunity</CardTitle>
          <CardDescription>
            To create a quote, start by selecting an opportunity from the list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Choose Opportunity</label>
            <Select value={selectedOpportunity} onValueChange={setSelectedOpportunity}>
              <SelectTrigger>
                <SelectValue placeholder="Select an opportunity..." />
              </SelectTrigger>
              <SelectContent>
                {opportunityOptions.map((opp) => (
                  <SelectItem key={opp.id} value={opp.id}>
                    {opp.id}: {opp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full" 
            onClick={() => selectedOpportunity && handleOpportunitySelect(selectedOpportunity)}
            disabled={!selectedOpportunity}
          >
            Create Quote
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuoteEditor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const opportunityId = searchParams.get("id");
  
  // If no opportunity ID, show empty state
  if (!opportunityId) {
    return <EmptyState navigate={navigate} />;
  }
  
  const mockSelection = getMockSelection(opportunityId);
  
  const [validityDate, setValidityDate] = useState<Date>();
  const [quoteLines, setQuoteLines] = useState<QuoteLine[]>(mockSelection.lines);
  
  const form = useForm({
    defaultValues: {
      deliveryTerms: "4-6 weeks from order confirmation",
      incoterms: "FOB",
      notes: ""
    }
  });

  // Calculate totals
  const { subtotal, total } = useMemo(() => {
    const subtotal = quoteLines.reduce((sum, line) => sum + (line.quantity * line.price), 0);
    return {
      subtotal,
      total: subtotal // Could add taxes, shipping, etc. here
    };
  }, [quoteLines]);

  // Check if quote is valid for sending
  const canSendQuote = useMemo(() => {
    return (
      validityDate &&
      quoteLines.length > 0 &&
      quoteLines.every(line => line.quantity > 0 && line.price > 0) &&
      form.getValues("deliveryTerms").trim() !== ""
    );
  }, [quoteLines, validityDate, form.watch()]);

  const [quoteStatus, setQuoteStatus] = useState<Quote["status"]>("Draft");

  // Current quote object for PDF generation
  const currentQuote: Quote = {
    id: "QUO-001",
    selectionId: mockSelection.id,
    lines: quoteLines,
    validityDate: validityDate ? format(validityDate, "yyyy-MM-dd") : "",
    deliveryTerms: form.getValues("deliveryTerms"),
    incoterms: form.getValues("incoterms") as "EXW" | "FOB" | "CIF" | "DAP" | "DDP" | undefined,
    total,
    status: quoteStatus,
    notes: form.getValues("notes"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updateQuoteLine = (index: number, updates: Partial<QuoteLine>) => {
    setQuoteLines(prev => prev.map((line, i) => 
      i === index ? { ...line, ...updates } : line
    ));
  };

  const handleSendQuote = () => {
    if (!canSendQuote) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before sending the quote.",
        variant: "destructive"
      });
      return;
    }

    setQuoteStatus("Sent");
    
    console.log("QUOTE_SENT:", {
      quoteId: currentQuote.id,
      selectionId: currentQuote.selectionId,
      total: currentQuote.total,
      lines: currentQuote.lines.length,
      timestamp: new Date().toISOString()
    });

    toast({
      title: "Quote Sent",
      description: `Quote #${currentQuote.id} has been sent successfully`,
    });

    // Navigate back to opportunity detail page after a short delay
    setTimeout(() => {
      navigate(`/opportunities/${opportunityId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Quote Editor</h1>
          <p className="text-muted-foreground">
            Create and manage quotes from selections • {opportunityId} • {mockSelection.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quote Editor */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quote Lines Table */}
            <Card className="bg-background border shadow-sm">
              <CardHeader className="border-b bg-muted/40">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-5 w-5 text-primary" />
                  Quote Lines
                </CardTitle>
                <CardDescription>
                  Edit quantities, pricing, and specifications for each product
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-lg border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Unit</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Lab Dip</TableHead>
                        <TableHead className="text-right font-semibold">Line Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quoteLines.map((line, index) => (
                        <TableRow key={line.productId} className="border-b hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium py-4">
                            {line.name}
                          </TableCell>
                          <TableCell className="py-4">
                            <Input
                              type="number"
                              value={line.quantity}
                              onChange={(e) => updateQuoteLine(index, { 
                                quantity: parseInt(e.target.value) || 0 
                              })}
                              className="w-24 h-9"
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="py-4">
                            <Select 
                              value={line.unit}
                              onValueChange={(value) => updateQuoteLine(index, { unit: value })}
                            >
                              <SelectTrigger className="w-24 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {unitOptions.map(unit => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-4">
                            <Input
                              type="number"
                              step="0.01"
                              value={line.price}
                              onChange={(e) => updateQuoteLine(index, { 
                                price: parseFloat(e.target.value) || 0 
                              })}
                              className="w-24 h-9"
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={line.labDipRequired || false}
                                onCheckedChange={(checked) => updateQuoteLine(index, { 
                                  labDipRequired: checked 
                                })}
                              />
                              {line.labDipRequired && (
                                <TestTube className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium py-4">
                            ${(line.quantity * line.price).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-8" />

            {/* Global Quote Settings */}
            <Card className="bg-background border shadow-sm">
              <CardHeader className="border-b bg-muted/40">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Settings className="h-5 w-5 text-primary" />
                  Quote Settings
                </CardTitle>
                <CardDescription>
                  Configure delivery terms and validity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Validity Date */}
                    <div className="space-y-2">
                      <FormLabel className="text-sm font-medium">Validity Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-10",
                              !validityDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {validityDate ? format(validityDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={validityDate}
                            onSelect={setValidityDate}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Incoterms */}
                    <FormField
                      control={form.control}
                      name="incoterms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Incoterms</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select incoterms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {incotermsOptions.map(term => (
                                <SelectItem key={term} value={term}>
                                  {term}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="deliveryTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Delivery Terms</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter delivery terms and conditions"
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any additional notes or comments"
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary Sidebar */}
          <div className="space-y-6">
            {/* Quote Summary */}
            <Card className="bg-background border shadow-sm sticky top-6">
              <CardHeader className="border-b bg-muted/40">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  Quote Summary
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={quoteStatus === "Sent" ? "default" : "secondary"}>
                    {quoteStatus}
                  </Badge>
                  <Badge variant="outline">
                    {quoteLines.length} line{quoteLines.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Line Items Summary */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Line Items</h4>
                  {quoteLines.map((line, index) => (
                    <div key={line.productId} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                      <span className="truncate mr-2 font-medium">{line.name}</span>
                      <span className="font-semibold">
                        ${(line.quantity * line.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />
                
                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                {/* Lab Dips Summary */}
                {quoteLines.some(line => line.labDipRequired) && (
                  <>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <TestTube className="h-4 w-4" />
                        <span className="font-medium">Lab Dips Required</span>
                      </div>
                      <div className="space-y-1">
                        {quoteLines
                          .filter(line => line.labDipRequired)
                          .map(line => (
                            <div key={line.productId} className="ml-6 text-xs text-muted-foreground bg-primary/5 p-1 rounded">
                              {line.name}
                            </div>
                          ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <QuotePDFButton
                    quote={currentQuote}
                    variant="outline"
                    onGenerated={(url) => console.log("PDF generated:", url)}
                  />
                  
                  <Button 
                    className="w-full h-11" 
                    onClick={handleSendQuote}
                    disabled={!canSendQuote || quoteStatus === "Sent"}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {quoteStatus === "Sent" ? "Quote Sent" : "Send Quote"}
                  </Button>

                  {!canSendQuote && quoteStatus !== "Sent" && (
                    <p className="text-xs text-muted-foreground text-center">
                      Complete all required fields to send quote
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}