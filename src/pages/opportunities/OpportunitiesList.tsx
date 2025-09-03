import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, LayoutGrid, List } from "lucide-react";

const mockOpportunities = [
  { id: "1", name: "Spring Collection", company: "Fashion Co", brand: "Trendy", stage: "Quote Sent", priority: "High", nextStep: "Send samples" },
  { id: "2", name: "Organic Cotton", company: "EcoWear", brand: "Green", stage: "Samples Sent", priority: "Medium", nextStep: "Follow up" },
];

export default function OpportunitiesList() {
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  if (viewMode === "board") {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Opportunities Board</h1>
          <div className="flex items-center gap-3">
            <div className="flex border rounded-md">
              <Button variant="ghost" size="sm" onClick={() => setViewMode("list")} className="rounded-r-none">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="rounded-l-none">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button><Plus className="h-4 w-4 mr-2" />New Opportunity</Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {["Inbound Request", "Samples Sent", "Quote Sent", "PO Received"].map(stage => (
            <div key={stage} className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{stage}</h3>
                <Badge variant="secondary">{stage === "Quote Sent" ? 1 : stage === "Samples Sent" ? 1 : 0}</Badge>
              </div>
              <div className="space-y-3">
                {mockOpportunities.filter(opp => opp.stage === stage).map(opp => (
                  <Card key={opp.id} className="p-3 hover:shadow-md cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{opp.name}</h4>
                        <Badge variant={opp.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                          {opp.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{opp.brand}</p>
                      <p className="text-xs">{opp.nextStep}</p>
                    </div>
                  </Card>
                ))}
                {mockOpportunities.filter(opp => opp.stage === stage).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No opportunities</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
          <Button><Plus className="h-4 w-4 mr-2" />New Opportunity</Button>
        </div>
      </div>

      <Card>
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