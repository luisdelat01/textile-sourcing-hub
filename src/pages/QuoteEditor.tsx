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
import { CalendarIcon, Send, TestTube, Calculator, FileText } from "lucide-react";
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

export default function QuoteEditor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>("");
  
  const opportunityId = searchParams.get("id");
  const mockSelection = opportunityId ? getMockSelection(opportunityId) : null;
  
  // If no opportunity ID, show empty state
  if (!opportunityId) {
    const opportunityOptions = [
      { id: "OPP-002", name: "FW26 Development — OPP-002" },
      { id: "OPP-003", name: "Luxury Silk Import — OPP-003" }
    ];

    const handleContinue = () => {
      if (selectedOpportunity) {
        navigate(`/quote-editor?id=${selectedOpportunity}`);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">No Quote Selected</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please select or create a quote to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Opportunity
              </label>
              <Select value={selectedOpportunity} onValueChange={setSelectedOpportunity}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Choose an opportunity" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {opportunityOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleContinue} 
              disabled={!selectedOpportunity}
              className="w-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quote Editor</h1>
        <p className="text-muted-foreground">
          Create and manage quotes from selections • {opportunityId} • {mockSelection.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quote Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Lines Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Quote Lines
              </CardTitle>
              <CardDescription>
                Edit quantities, pricing, and specifications for each product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Lab Dip</TableHead>
                      <TableHead className="text-right">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteLines.map((line, index) => (
                      <TableRow key={line.productId}>
                        <TableCell className="font-medium">
                          {line.name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={line.quantity}
                            onChange={(e) => updateQuoteLine(index, { 
                              quantity: parseInt(e.target.value) || 0 
                            })}
                            className="w-24"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={line.unit}
                            onValueChange={(value) => updateQuoteLine(index, { unit: value })}
                          >
                            <SelectTrigger className="w-24">
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
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={line.price}
                            onChange={(e) => updateQuoteLine(index, { 
                              price: parseFloat(e.target.value) || 0 
                            })}
                            className="w-24"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
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
                        <TableCell className="text-right font-medium">
                          ${(line.quantity * line.price).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Global Quote Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Settings</CardTitle>
              <CardDescription>
                Configure delivery terms and validity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Validity Date */}
                  <div className="space-y-2">
                    <FormLabel>Validity Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
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
                          className={cn("p-3 pointer-events-auto")}
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
                        <FormLabel>Incoterms</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
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

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="deliveryTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Terms</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter delivery terms and conditions"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add any additional notes or comments"
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
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
            <CardContent className="space-y-4">
              {/* Line Items Summary */}
              <div className="space-y-2">
                {quoteLines.map((line, index) => (
                  <div key={line.productId} className="flex justify-between text-sm">
                    <span className="truncate mr-2">{line.name}</span>
                    <span className="font-medium">
                      ${(line.quantity * line.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              {/* Lab Dips Summary */}
              {quoteLines.some(line => line.labDipRequired) && (
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TestTube className="h-4 w-4" />
                    Lab Dips Required
                  </div>
                  {quoteLines
                    .filter(line => line.labDipRequired)
                    .map(line => (
                      <div key={line.productId} className="ml-6 text-xs">
                        {line.name}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuotePDFButton
                quote={currentQuote}
                variant="outline"
                onGenerated={(url) => console.log("PDF generated:", url)}
              />
              
              <Button 
                className="w-full" 
                onClick={handleSendQuote}
                disabled={!canSendQuote || quoteStatus === "Sent"}
              >
                <Send className="h-4 w-4 mr-2" />
                {quoteStatus === "Sent" ? "Quote Sent" : "Send Quote"}
              </Button>

              {!canSendQuote && quoteStatus !== "Sent" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Complete all required fields to send quote
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}