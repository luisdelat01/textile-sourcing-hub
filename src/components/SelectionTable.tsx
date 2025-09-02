import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Send, Trash2 } from "lucide-react";
import { SampleLogisticsCard } from "./SampleLogisticsCard";

export interface SelectionItem {
  id: string;
  product: string;
  unit: string;
  volumeTiers: { minQty: number; price: number }[];
  adjustments: string;
  quoteStatus: "pending" | "sent" | "approved" | "rejected";
  sampleStatus: "not_sent" | "sent" | "received" | "approved";
  buyerFeedback: string;
  dropped: boolean;
}

export interface Selection {
  id: string;
  name: string;
  version: number;
  items: SelectionItem[];
  createdAt: Date;
  notes?: string;
}

interface SelectionTableProps {
  selection: Selection;
  onDuplicateVersion: () => void;
  onSendSamples: (logistics: any) => void;
  onUpdateItem: (itemId: string, updates: Partial<SelectionItem>) => void;
  onRemoveItem: (itemId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "secondary";
    case "sent": return "outline";
    case "approved": return "default";
    case "rejected": return "destructive";
    case "not_sent": return "secondary";
    case "received": return "outline";
    default: return "secondary";
  }
};

export function SelectionTable({ 
  selection, 
  onDuplicateVersion, 
  onSendSamples,
  onUpdateItem,
  onRemoveItem 
}: SelectionTableProps) {
  const [sampleDialogOpen, setSampleDialogOpen] = useState(false);

  const handleSamplesSent = (logistics: any) => {
    onSendSamples(logistics);
    setSampleDialogOpen(false);
  };

  const activeItems = selection.items.filter(item => !item.dropped);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {selection.name} 
              <Badge variant="outline">v{selection.version}</Badge>
            </CardTitle>
            <CardDescription>
              {activeItems.length} active items • Created {selection.createdAt.toLocaleDateString()}
              {selection.notes && ` • ${selection.notes}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onDuplicateVersion}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Version
            </Button>
            <Dialog open={sampleDialogOpen} onOpenChange={setSampleDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Samples
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Samples</DialogTitle>
                  <DialogDescription>
                    Configure sample logistics for {selection.name} v{selection.version}
                  </DialogDescription>
                </DialogHeader>
                <SampleLogisticsCard onSubmit={handleSamplesSent} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Volume Tiers</TableHead>
                <TableHead>Adjustments</TableHead>
                <TableHead>Quote Status</TableHead>
                <TableHead>Sample Status</TableHead>
                <TableHead>Buyer Feedback</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selection.items.map((item) => (
                <TableRow key={item.id} className={item.dropped ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.volumeTiers.map((tier, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tier.minQty}+ @ ${tier.price}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.adjustments || "None"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.quoteStatus)}>
                      {item.quoteStatus.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.sampleStatus)}>
                      {item.sampleStatus.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {item.buyerFeedback || "No feedback"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!item.dropped}
                      onCheckedChange={(checked) => 
                        onUpdateItem(item.id, { dropped: !checked })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {selection.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No items in selection. Add products from the catalog above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}