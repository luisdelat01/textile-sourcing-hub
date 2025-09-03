import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useOpportunities, STAGES, type StageEnum, type Opportunity } from "@/stores/useOpportunities";
import { cn } from "@/lib/utils";
import { AlertCircle, Package, FileText, ShoppingCart, TestTube, Plus, GripVertical } from "lucide-react";
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent, 
  DragOverlay,
  useSensor, 
  useSensors, 
  MouseSensor, 
  TouchSensor, 
  KeyboardSensor,
  useDraggable, 
  useDroppable 
} from "@dnd-kit/core";
import { toast } from "@/hooks/use-toast";

const priorityRank = (p: "High" | "Medium" | "Low") => ({High: 3, Medium: 2, Low: 1}[p] ?? 0);
const dateVal = (d?: string) => d ? new Date(d).getTime() : 0;

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ 
    id: opportunity.id 
  });
  
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

  const handleClick = () => {
    if (!isDragging) {
      navigate(`/opportunities/${opportunity.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      navigate(`/opportunities/${opportunity.id}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-testid={`opp-card-${opportunity.id}`}
      role="button"
      tabIndex={0}
      className={cn(
        "outline-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 border border-dashed"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Card className="hover:shadow-md transition-shadow group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
              {opportunity.name}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Badge variant={getPriorityVariant(opportunity.priority)} className="text-xs shrink-0">
                {opportunity.priority}
              </Badge>
              <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab" />
            </div>
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
    </div>
  );
}

interface KanbanColumnProps {
  stage: StageEnum;
  opportunities: Opportunity[];
}

function KanbanColumn({ stage, opportunities, count }: KanbanColumnProps & { count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <h3 className="font-medium text-sm">{stage}</h3>
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      </div>

      {/* Column Content */}
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 p-4 space-y-3 overflow-y-auto transition-colors",
          isOver && "bg-muted/40"
        )}
      >
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
          [...opportunities]
            .sort((a, b) => {
              const pr = priorityRank(b.priority) - priorityRank(a.priority);
              if (pr !== 0) return pr;
              return dateVal(a.updated) - dateVal(b.updated);
            })
            .map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
        )}
      </div>
    </div>
  );
}

export default function Board() {
  const { visible, countsByStage, moveOpportunityStage } = useOpportunities();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Get filtered opportunities and counts from store selectors
  const filteredOpportunities = visible();
  const stageCounts = countsByStage();

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

  // Find active opportunity for drag overlay
  const activeOpportunity = activeId 
    ? filteredOpportunities.find(opp => opp.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const oppId = String(active.id);
    const newStage = over.id as StageEnum;
    
    // Find current opportunity
    const opportunity = filteredOpportunities.find(opp => opp.id === oppId);
    if (!opportunity || opportunity.stage === newStage) {
      setActiveId(null);
      return;
    }

    // Move opportunity to new stage
    moveOpportunityStage(oppId, newStage);
    
    // Show success toast
    toast({
      title: "Opportunity moved",
      description: `Moved to ${newStage} stage`,
    });

    setActiveId(null);
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
                  count={stageCounts[stage]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeOpportunity ? (
          <div className="w-80 opacity-90">
            <Card className="shadow-lg border-2 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium leading-tight">
                    {activeOpportunity.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {activeOpportunity.priority}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeOpportunity.brand}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-foreground">
                  <span className="font-medium">Next: </span>
                  <span className="truncate block">
                    {activeOpportunity.nextStep}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}