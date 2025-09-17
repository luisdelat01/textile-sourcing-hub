import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AISummaryCardProps {
  summary: string;
  suggestedNextStep: string;
  buyerIntent: string[];
}

export default function AISummaryCard({ summary, suggestedNextStep, buyerIntent }: AISummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">AI Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Suggested Next Step:</strong> {suggestedNextStep}
          </AlertDescription>
        </Alert>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Buyer Intent</h4>
          <div className="flex flex-wrap gap-2">
            {buyerIntent.map((intent, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {intent}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}