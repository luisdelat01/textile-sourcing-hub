import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Truck, FileText, TestTube } from "lucide-react";
import { Quote } from "@/types/quote";
import { formatCurrency, formatDate } from "@/lib/utils";

interface QuoteCardProps {
  quote: Quote;
  onClick?: () => void;
}

export function QuoteCard({ quote, onClick }: QuoteCardProps) {
  const hasLabDips = quote.lines.some(line => line.labDipRequired);
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open quote ${quote.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quote #{quote.id}
            </CardTitle>
            <CardDescription>
              {quote.lines.length} line{quote.lines.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Badge variant={quote.status === "Sent" ? "default" : "secondary"}>
            {quote.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Valid Until</div>
              <div className="font-medium">{formatDate(quote.validityDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-muted-foreground">Delivery</div>
              <div className="font-medium truncate">{quote.deliveryTerms}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {quote.incoterms || <span className="text-muted-foreground">—</span>}
            </Badge>
            {hasLabDips && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <TestTube className="h-3 w-3" />
                Lab Dips
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-lg font-bold">{formatCurrency(quote.total)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}