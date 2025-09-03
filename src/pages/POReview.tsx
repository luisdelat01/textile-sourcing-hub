import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, FileText, AlertTriangle, CheckCircle, Calendar as CalendarIcon, Send } from "lucide-react";
import { Quote } from "@/types/quote";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface POField {
  poNumber: string;
  date: Date | undefined;
  totalQuantity: number;
  totalPrice: number;
  deliveryTerms: string;
}

interface LabDipRecord {
  id: string;
  article: string;
  colorRef: string;
  status: "Requested" | "In Progress" | "Completed";
}

export default function POReview() {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState(2);
  const [clarificationOpen, setClarificationOpen] = useState(false);
  const [clarificationMessage, setClarificationMessage] = useState("");
  const [lineItemDiffs, setLineItemDiffs] = useState<Array<{
    product: string;
    quoteQty: number;
    quotePrice: number;
    poQty: number;
    poPrice: number;
  }>>([]);
  const [poFields, setPOFields] = useState<POField>({
    poNumber: "",
    date: undefined,
    totalQuantity: 0,
    totalPrice: 0,
    deliveryTerms: ""
  });

  // Mock latest sent quote
  const latestSentQuote: Quote | null = {
    id: "Q-002",
    selectionId: "S-001", 
    lines: [
      {
        productId: "P-003",
        name: "Linen Blend 140GSM",
        unit: "meters",
        quantity: 800,
        price: 8.90,
        labDipRequired: true
      },
      {
        productId: "P-004",
        name: "Cotton Poplin 120GSM",
        unit: "meters",
        quantity: 500,
        price: 4.50,
        labDipRequired: false
      }
    ],
    validityDate: "2024-09-30",
    deliveryTerms: "3-4 weeks from order confirmation",
    incoterms: "EXW",
    total: 9370,
    status: "Sent",
    createdAt: "2024-08-28T09:15:00Z",
    updatedAt: "2024-08-30T16:45:00Z"
  };

  // Persist line item comparisons to avoid flicker
  useEffect(() => {
    if (uploadedFile && latestSentQuote) {
      const diffs = latestSentQuote.lines.map(line => ({
        product: line.name,
        quoteQty: line.quantity,
        quotePrice: line.price,
        poQty: Math.floor(line.quantity * (1 + (Math.random() - 0.5) * 0.1)),
        poPrice: Number((line.price * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2))
      }));
      setLineItemDiffs(diffs);
    } else {
      setLineItemDiffs([]);
    }
  }, [uploadedFile, latestSentQuote]);

  // Check if PO is ready for confirmation
  const isPOReady = Boolean(
    uploadedFile && 
    poFields.poNumber && 
    poFields.date && 
    poFields.totalQuantity > 0 && 
    poFields.totalPrice > 0 && 
    poFields.deliveryTerms
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(`fake-url://${file.name}`);
      // Mock OCR extraction
      setPOFields({
        poNumber: "PO-2024-" + Math.floor(Math.random() * 1000),
        date: new Date(),
        totalQuantity: 1300,
        totalPrice: 9500,
        deliveryTerms: "4-5 weeks from order confirmation"
      });
      toast({
        title: "File uploaded",
        description: `${file.name} processed successfully`
      });
    }
  };

  const calculateDiff = (poValue: number, quoteValue: number) => {
    const absoluteDiff = poValue - quoteValue;
    const percentageDiff = quoteValue !== 0 ? Math.abs((absoluteDiff / quoteValue) * 100) : 0;
    return { absoluteDiff, percentageDiff };
  };

  const getComparisonData = () => {
    if (!latestSentQuote) return [];
    
    const quoteQuantity = latestSentQuote.lines.reduce((sum, line) => sum + line.quantity, 0);
    const quoteTotalPrice = latestSentQuote.total;

    return [
      {
        field: "Total Quantity",
        poValue: poFields.totalQuantity.toString(),
        quoteValue: quoteQuantity.toString(),
        diff: calculateDiff(poFields.totalQuantity, quoteQuantity)
      },
      {
        field: "Total Price",
        poValue: formatCurrency(poFields.totalPrice),
        quoteValue: formatCurrency(quoteTotalPrice),
        diff: calculateDiff(poFields.totalPrice, quoteTotalPrice)
      },
      {
        field: "Delivery Terms",
        poValue: poFields.deliveryTerms,
        quoteValue: latestSentQuote.deliveryTerms,
        diff: null
      }
    ];
  };

  const getLineItemComparison = () => {
    if (!latestSentQuote) return [];
    return latestSentQuote.lines.map(line => ({
      product: line.name,
      quoteQty: line.quantity,
      quotePrice: line.price,
      poQty: Math.floor(line.quantity * (1 + (Math.random() - 0.5) * 0.1)), // Mock variation
      poPrice: line.price * (1 + (Math.random() - 0.5) * 0.05) // Mock variation
    }));
  };

  const hasToleranceViolations = () => {
    const comparisonData = getComparisonData();
    const lineItems = getLineItemComparison();
    
    const fieldViolations = comparisonData.some(item => 
      item.diff && item.diff.percentageDiff > tolerance
    );
    
    const lineViolations = lineItems.some(item => {
      const qtyDiff = Math.abs(((item.poQty - item.quoteQty) / item.quoteQty) * 100);
      const priceDiff = Math.abs(((item.poPrice - item.quotePrice) / item.quotePrice) * 100);
      return qtyDiff > tolerance || priceDiff > tolerance;
    });

    return fieldViolations || lineViolations;
  };

  const getViolationItems = () => {
    const violations = [];
    const comparisonData = getComparisonData();
    const lineItems = getLineItemComparison();
    
    comparisonData.forEach(item => {
      if (item.diff && item.diff.percentageDiff > tolerance) {
        violations.push(`${item.field}: ${item.diff.percentageDiff.toFixed(1)}% difference`);
      }
    });
    
    lineItems.forEach(item => {
      const qtyDiff = Math.abs(((item.poQty - item.quoteQty) / item.quoteQty) * 100);
      const priceDiff = Math.abs(((item.poPrice - item.quotePrice) / item.quotePrice) * 100);
      
      if (qtyDiff > tolerance) {
        violations.push(`${item.product} quantity: ${qtyDiff.toFixed(1)}% difference`);
      }
      if (priceDiff > tolerance) {
        violations.push(`${item.product} price: ${priceDiff.toFixed(1)}% difference`);
      }
    });

    return violations;
  };

  const handleConfirmPO = () => {
    console.log("PO_CONFIRMED", poFields);
    toast({
      title: "PO Confirmed",
      description: `Purchase Order ${poFields.poNumber} has been confirmed successfully`
    });

    // Create lab dip records if needed
    if (latestSentQuote?.lines.some(line => line.labDipRequired)) {
      const labDips: LabDipRecord[] = latestSentQuote.lines
        .filter(line => line.labDipRequired)
        .map(line => ({
          id: `LD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          article: line.name,
          colorRef: "TBD",
          status: "Requested"
        }));
      
      console.log("LAB_DIP_SENT (stub)", labDips);
      toast({
        title: "Lab Dips Requested",
        description: `${labDips.length} lab dip requests have been sent`
      });
    }
  };

  const handleClarificationSubmit = () => {
    console.log("CLARIFICATION_REQUESTED:", clarificationMessage);
    toast({
      title: "Clarification Requested",
      description: "Your message has been sent to the client"
    });
    setClarificationMessage("");
    setClarificationOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">PO Review</h1>
        <p className="text-muted-foreground mt-1">
          Upload and review client purchase orders against sent quotes
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload Client PO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Client PO
            </CardTitle>
            <CardDescription>
              Upload the client's purchase order for processing and comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No file uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your PO file here, or click to browse
                </p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="pointer-events-none">
                    Choose File
                  </Button>
                </Label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{uploadedFile.split('//')[1]}</span>
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setUploadedFile(null)}
                  className="w-full"
                >
                  Upload Different File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Extracted Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Extracted Fields</CardTitle>
            <CardDescription>
              Review and edit the extracted information from the PO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!uploadedFile ? (
              <div className="text-center py-8 text-muted-foreground">
                Upload a PO file to see extracted fields
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="poNumber">PO Number</Label>
                  <Input
                    id="poNumber"
                    value={poFields.poNumber}
                    onChange={(e) => setPOFields(prev => ({ ...prev, poNumber: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !poFields.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {poFields.date ? format(poFields.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={poFields.date}
                        onSelect={(date) => setPOFields(prev => ({ ...prev, date }))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalQuantity">Total Quantity</Label>
                  <Input
                    id="totalQuantity"
                    type="number"
                    value={poFields.totalQuantity}
                    onChange={(e) => setPOFields(prev => ({ ...prev, totalQuantity: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Total Price</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    value={poFields.totalPrice}
                    onChange={(e) => setPOFields(prev => ({ ...prev, totalPrice: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                  <Input
                    id="deliveryTerms"
                    value={poFields.deliveryTerms}
                    onChange={(e) => setPOFields(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison vs Latest Quote */}
      {uploadedFile && latestSentQuote && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparison vs Latest Sent Quote</CardTitle>
              <CardDescription>
                Compare PO values against Quote {latestSentQuote.id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>PO Value</TableHead>
                    <TableHead>Quote Value</TableHead>
                    <TableHead>Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getComparisonData().map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.field}</TableCell>
                      <TableCell>{item.poValue}</TableCell>
                      <TableCell>{item.quoteValue}</TableCell>
                      <TableCell>
                        {item.diff ? (
                          <div className="flex items-center gap-2">
                            <span>{formatCurrency(item.diff.absoluteDiff)}</span>
                            <Badge variant={item.diff.percentageDiff > tolerance ? "destructive" : "secondary"}>
                              {item.diff.percentageDiff.toFixed(1)}%
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Items Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty (PO vs Quote)</TableHead>
                    <TableHead>Price (PO vs Quote)</TableHead>
                    <TableHead>Diff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLineItemComparison().map((item, index) => {
                    const qtyDiff = Math.abs(((item.poQty - item.quoteQty) / item.quoteQty) * 100);
                    const priceDiff = Math.abs(((item.poPrice - item.quotePrice) / item.quotePrice) * 100);
                    
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.poQty} vs {item.quoteQty}</TableCell>
                        <TableCell>{formatCurrency(item.poPrice)} vs {formatCurrency(item.quotePrice)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant={qtyDiff > tolerance ? "destructive" : "secondary"} className="text-xs">
                              Qty: {qtyDiff.toFixed(1)}%
                            </Badge>
                            <Badge variant={priceDiff > tolerance ? "destructive" : "secondary"} className="text-xs">
                              Price: {priceDiff.toFixed(1)}%
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tolerance Gate */}
      {uploadedFile && latestSentQuote && (
        <Card>
          <CardHeader>
            <CardTitle>Tolerance & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="tolerance">Tolerance (%)</Label>
              <Input
                id="tolerance"
                type="number"
                step="0.1"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-24"
              />
            </div>

            {hasToleranceViolations() && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The following items exceed the tolerance threshold:
                  <ul className="mt-2 ml-4 list-disc">
                    {getViolationItems().map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Dialog open={clarificationOpen} onOpenChange={setClarificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Request Clarification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Clarification</DialogTitle>
                    <DialogDescription>
                      Send a message to the client regarding the PO discrepancies
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Please provide clarification on the following items..."
                    value={clarificationMessage}
                    onChange={(e) => setClarificationMessage(e.target.value)}
                    rows={4}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setClarificationOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleClarificationSubmit}>
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleConfirmPO}
                disabled={hasToleranceViolations()}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm PO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Quote State */}
      {uploadedFile && !latestSentQuote && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sent Quote Found</h3>
            <p className="text-muted-foreground">
              No sent quotes available for comparison with this PO
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}