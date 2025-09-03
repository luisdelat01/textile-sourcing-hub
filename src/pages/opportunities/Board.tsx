import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useOpportunities, STAGES, type StageEnum, type Opportunity } from "@/stores/useOpportunities";
import { cn } from "@/lib/utils";
import { AlertCircle, Package, FileText, ShoppingCart, TestTube, Plus, GripVertical, Search, Filter, RotateCcw, List, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { NewOpportunityDialog } from "@/components/opportunities/NewOpportunityDialog";
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
  useDroppable,
  closestCenter
} from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";

const priorityRank = (p: "High" | "Medium" | "Low") => ({High: 3, Medium: 2, Low: 1}[p] ?? 0);
const dateVal = (d?: string) => d ? new Date(d).getTime() : 0;

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const navigate = useNavigate();
  const { updateOpportunity } = useOpportunities();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(opportunity.nextStep);
  const downRef = useRef<EventTarget | null>(null);
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

  const handleMouseUp = (e: React.MouseEvent) => {
    // If the initial press was on the drag handle, ignore navigation
    const pressedOnHandle = (downRef.current instanceof Element) && !!(downRef.current as Element).closest('[data-drag-handle]');
    if (!isDragging && !pressedOnHandle) {
      navigate(`/opportunities/${opportunity.id}`);
    }
    downRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      navigate(`/opportunities/${opportunity.id}`);
    }
  };

  const handleNextStepEdit = () => {
    setIsEditing(true);
    setEditValue(opportunity.nextStep);
  };

  const handleNextStepSave = () => {
    if (editValue.trim() !== opportunity.nextStep) {
      updateOpportunity(opportunity.id, { nextStep: editValue.trim() });
      toast({
        title: "Next step updated",
        description: "The next step has been saved",
      });
    }
    setIsEditing(false);
  };

  const handleNextStepCancel = () => {
    setEditValue(opportunity.nextStep);
    setIsEditing(false);
  };

  const handleNextStepKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNextStepSave();
    } else if (e.key === "Escape") {
      handleNextStepCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      data-testid={`opp-card-${opportunity.id}`}
      role="button"
      tabIndex={0}
      className={cn(
        "outline-none select-none cursor-pointer",
        isDragging && "opacity-50"
      )}
      onMouseDown={(e) => { downRef.current = e.target; }}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      aria-grabbed={isDragging}
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
              <div 
                {...listeners}
                {...attributes}
                data-drag-handle
                className="cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical 
                  className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors"
                />
              </div>
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
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleNextStepSave}
                onKeyDown={handleNextStepKeyDown}
                className="text-xs h-6 mt-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className="truncate block cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStepEdit();
                }}
              >
                {opportunity.nextStep}
              </span>
            )}
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
          isOver && "bg-muted/40 ring-1 ring-primary/20"
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
  const { visible, countsByStage, moveOpportunityStage, filters, setFilters, opportunities, addOpportunity } = useOpportunities();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 4 } }),
    useSensor(KeyboardSensor)
  );

  // Horizontal scroll function
  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

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
    console.log("DRAG_START", event.active.id);
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("DRAG_END", { active: event.active.id, over: event.over?.id });
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

  // Get unique values for filter options
  const uniqueReps = [...new Set(opportunities.map(o => o.assignedRep))];

  const resetFilters = () => {
    setFilters({
      search: "",
      stages: [],
      priority: "all",
      assignedRep: "all",
      brand: "all",
      source: "all",
      dateRange: "all"
    });
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b">
          <div className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Opportunities Board</h1>
              <p className="text-muted-foreground mt-1">
                Kanban view of your textile sourcing opportunities
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                DEBUG
              </Button>
              <NewOpportunityDialog onCreate={(payload) => addOpportunity(payload)} />
            </div>
          </div>
          
          {/* Filter Bar */}
          <div className="px-6 pb-4 space-y-3">
            <div className="flex gap-3 items-center flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="pl-9 w-64"
                />
              </div>

              {/* Priority Filter */}
              <Select 
                value={filters.priority} 
                onValueChange={(value) => setFilters({ priority: value as any })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Stage Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-between">
                    <span>
                      {filters.stages.length === 0 
                        ? "All Stages" 
                        : `${filters.stages.length} stages`}
                    </span>
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Select Stages</div>
                    {STAGES.map((stage) => (
                      <label key={stage} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.stages.includes(stage)}
                          onChange={(e) => {
                            const newStages = e.target.checked
                              ? [...filters.stages, stage]
                              : filters.stages.filter(s => s !== stage);
                            setFilters({ stages: newStages });
                          }}
                          className="rounded border-input"
                        />
                        <span>{stage}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Assigned Rep Filter */}
              <Select 
                value={filters.assignedRep} 
                onValueChange={(value) => setFilters({ assignedRep: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reps</SelectItem>
                  {uniqueReps.map((rep) => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              
              <Button variant="outline" size="sm" asChild>
                <a href="/opportunities">
                  <List className="h-4 w-4 mr-1" />
                  List View
                </a>
              </Button>

              {/* Horizontal scroll arrows */}
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollBy(-320)}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => scrollBy(320)}
                  className="px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Debug Panel */}
            {showDebug && (
              <div className="bg-muted p-3 rounded-lg text-xs font-mono">
                <div className="mb-2 font-semibold">Current Filters:</div>
                <pre>{JSON.stringify(filters, null, 2)}</pre>
                <div className="mt-2 mb-2 font-semibold">Counts by Stage:</div>
                <pre>{JSON.stringify(stageCounts, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <div 
            ref={scrollRef}
            className="h-full flex overflow-x-auto scroll-smooth"
            tabIndex={0}
          >
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