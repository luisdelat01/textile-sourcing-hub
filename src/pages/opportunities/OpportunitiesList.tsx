import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, LayoutGrid, List } from "lucide-react";
import { NewOpportunityDialog } from "@/components/opportunities/NewOpportunityDialog";
import Board from "./Board";

const mockOpportunities = [
  { id: "1", name: "Spring Collection", company: "Fashion Co", brand: "Trendy", stage: "Quote Sent", priority: "High", nextStep: "Send samples" },
  { id: "2", name: "Organic Cotton", company: "EcoWear", brand: "Green", stage: "Samples Sent", priority: "Medium", nextStep: "Follow up" },
];

export default function OpportunitiesList() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [showNewOpportunityDialog, setShowNewOpportunityDialog] = useState(false);

  if (viewMode === "board") {
    return <Board onSwitchToList={() => setViewMode("list")} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">Manage your textile sourcing opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border rounded-md">
            <Button variant="default" size="sm" className="rounded-r-none">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setViewMode("board")} className="rounded-l-none">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => { console.log('New Opportunity button clicked (list view)'); setShowNewOpportunityDialog(true); }}><Plus className="h-4 w-4 mr-2" />New Opportunity</Button>
        </div>
      </div>

      <Card>
        {/* New Opportunity Dialog */}
        <NewOpportunityDialog 
          open={showNewOpportunityDialog}
          onOpenChange={setShowNewOpportunityDialog}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Next Step</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOpportunities.map((opp) => (
              <TableRow key={opp.id}>
                <TableCell className="font-medium">{opp.name}</TableCell>
                <TableCell>{opp.company}</TableCell>
                <TableCell>{opp.brand}</TableCell>
                <TableCell><Badge variant="outline">{opp.stage}</Badge></TableCell>
                <TableCell><Badge variant={opp.priority === "High" ? "destructive" : "secondary"}>{opp.priority}</Badge></TableCell>
                <TableCell className="truncate max-w-xs">{opp.nextStep}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}