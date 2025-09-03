import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useOpportunities, type StageEnum, type Opportunity } from "@/stores/useOpportunities";
import { cn } from "@/lib/utils";
import { AlertCircle, Package, FileText, ShoppingCart, TestTube, Plus } from "lucide-react";

const STAGES: StageEnum[] = [
  "Inbound Request",
  "Clarify Buyer Intent", 
  "Samples Sent",
  "Quote Sent",
  "PO Received",
  "In Production",
  "Ready to Ship",
  "Closed – Delivered"
];

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Link to={`/opportunities/${opportunity.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
              {opportunity.name}
            </CardTitle>
            <Badge variant={getPriorityVariant(opportunity.priority)} className="text-xs shrink-0">
              {opportunity.priority}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {opportunity.brand}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* Assignee */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(opportunity.assignedRep)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {opportunity.assignedRep}
            </span>
          </div>

          {/* Next Step */}
          <div className="text-xs text-foreground leading-relaxed">
            <span className="font-medium">Next: </span>
            <span className="truncate block">
              {opportunity.nextStep}
            </span>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-1">
            {opportunity.missingSpecs && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 gap-1">
                <AlertCircle className="h-3 w-3" />
                Missing Specs
              </Badge>
            )}
            {opportunity.hasSamples && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 gap-1">
                <Package className="h-3 w-3" />
                Samples
              </Badge>
            )}
            {opportunity.hasQuote && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 gap-1">
                <FileText className="h-3 w-3" />
                Quote
              </Badge>
            )}
            {opportunity.hasPO && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 gap-1">
                <ShoppingCart className="h-3 w-3" />
                PO
              </Badge>
            )}
            {opportunity.hasLabDips && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 gap-1">
                <TestTube className="h-3 w-3" />
                Lab Dips
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface KanbanColumnProps {
  stage: StageEnum;
  opportunities: Opportunity[];
}

function KanbanColumn({ stage, opportunities }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <h3 className="font-medium text-sm">{stage}</h3>
        <Badge variant="secondary" className="text-xs">
          {opportunities.length}
        </Badge>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No opportunities</p>
            <p className="text-xs text-muted-foreground mt-1">
              Opportunities will appear here
            </p>
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))
        )}
      </div>
    </div>
  );
}

export default function Board() {
  const { opportunities, filters } = useOpportunities();

  // Apply filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = opp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           opp.company.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStage = filters.stages.length === 0 || filters.stages.includes(opp.stage);
      const matchesPriority = filters.priority === "all" || opp.priority === filters.priority;
      const matchesSource = filters.source === "all" || opp.source === filters.source;
      const matchesRep = filters.assignedRep === "all" || opp.assignedRep === filters.assignedRep;
      const matchesBrand = filters.brand === "all" || opp.brand === filters.brand;
      
      return matchesSearch && matchesStage && matchesPriority && matchesSource && matchesRep && matchesBrand;
    });
  }, [opportunities, filters]);

  // Group opportunities by stage
  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<StageEnum, Opportunity[]> = {} as Record<StageEnum, Opportunity[]>;
    
    // Initialize all stages with empty arrays
    STAGES.forEach(stage => {
      grouped[stage] = [];
    });
    
    // Group filtered opportunities
    filteredOpportunities.forEach(opp => {
      if (grouped[opp.stage]) {
        grouped[opp.stage].push(opp);
      }
    });
    
    return grouped;
  }, [filteredOpportunities]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunities Board</h1>
          <p className="text-muted-foreground mt-1">
            Kanban view of your textile sourcing opportunities
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex overflow-x-auto">
          {STAGES.map((stage) => (
            <div 
              key={stage} 
              className="flex-shrink-0 w-80 border-r last:border-r-0 h-full"
            >
              <KanbanColumn 
                stage={stage} 
                opportunities={opportunitiesByStage[stage] || []} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}