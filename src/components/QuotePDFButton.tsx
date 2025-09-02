import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Loader2 } from "lucide-react";
import { Quote } from "@/types/quote";

interface QuotePDFButtonProps {
  quote: Quote;
  onGenerated?: (url: string) => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function QuotePDFButton({ 
  quote, 
  onGenerated, 
  variant = "outline",
  size = "default" 
}: QuotePDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock PDF content
      const pdfContent = {
        quote: {
          id: quote.id,
          selectionId: quote.selectionId,
          validityDate: quote.validityDate,
          deliveryTerms: quote.deliveryTerms,
          incoterms: quote.incoterms,
          total: quote.total,
          status: quote.status,
          createdAt: quote.createdAt.toISOString()
        },
        lines: quote.lines.map(line => ({
          productId: line.productId,
          name: line.name,
          unit: line.unit,
          quantity: line.quantity,
          price: line.price,
          labDipRequired: line.labDipRequired,
          lineTotal: line.quantity * line.price
        })),
        generatedAt: new Date().toISOString(),
        version: "1.0"
      };

      // Create blob from JSON (mock PDF generation)
      const blob = new Blob([JSON.stringify(pdfContent, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(url, '_blank');
      
      // Call onGenerated callback if provided
      if (onGenerated) {
        onGenerated(url);
      }
      
      toast({
        title: "PDF Generated",
        description: `Quote #${quote.id} PDF opened in new tab`,
      });
      
      console.log("PDF_GENERATED:", {
        quoteId: quote.id,
        url,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
      
      console.error("PDF_GENERATION_ERROR:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={generatePDF}
      disabled={isGenerating}
      aria-label={`Generate PDF for Quote #${quote.id}`}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileText className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? "Generating..." : "Preview PDF"}
    </Button>
  );
}