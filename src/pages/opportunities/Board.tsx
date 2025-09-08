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
import { DebugBar } from "@/components/dev/DebugBar";
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
  onCardNavigate?: () => void;
}

function OpportunityCard({ opportunity, onCardNavigate }: OpportunityCardProps) {
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

  const getStageEmoji = (stage: StageEnum) => {
    switch (stage) {
      case "Inbound Request": return "📧";
      case "Clarify Buyer Intent": return "🔍";
      case "Samples Sent": return "📦";
      case "Quote Sent": return "💰";
      case "PO Received": return "📋";
      case "In Production": return "🏭";
      case "Ready to Ship": return "🚚";
      case "Closed – Delivered": return "✅";
      default: return "📋";
    }
  };

  const getStatusDisplay = (stage: StageEnum, nextStep: string) => {
    const emoji = getStageEmoji(stage);
    const shortStatus = stage === "Clarify Buyer Intent" ? "Clarifying Intent" :
                       stage === "Closed – Delivered" ? "Delivered" : stage;
    return `${emoji} ${shortStatus}`;
  };

  // Mock product count and quote value based on existing flags
  const getProductCount = () => {
    if (!opportunity.hasQuote && !opportunity.hasSamples) return 0;
    // Mock different counts based on opportunity ID
    const mockCounts = { "OPP-001": 5, "OPP-002": 3, "OPP-003": 8, "OPP-004": 2 };
    return mockCounts[opportunity.id] || 4;
  };

  const getQuoteValue = () => {
    if (!opportunity.hasQuote) return null;
    // Mock different values based on opportunity ID
    const mockValues = { "OPP-001": 24500, "OPP-002": 18750, "OPP-003": 42300, "OPP-004": 8900 };
    return mockValues[opportunity.id] || 15000;
  };

  const productCount = getProductCount();
  const quoteValue = getQuoteValue();

  const handleMouseUp = (e: React.MouseEvent) => {
    // If the initial press was on the drag handle, ignore navigation
    const pressedOnHandle = (downRef.current instanceof Element) && !!(downRef.current as Element).closest('[data-drag-handle]');
    if (!isDragging && !pressedOnHandle) {
      onCardNavigate?.();
      navigate(`/opportunities/${opportunity.id}`);
    }
    downRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onCardNavigate?.();
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
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium leading-tight group-hover:text-primary transition-colors truncate">
                {opportunity.name}
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {opportunity.brand}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Badge variant={getPriorityVariant(opportunity.priority)} className="text-xs">
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
              👤 {opportunity.assignedRep}
            </span>
          </div>

          {/* Status with Emoji */}
          <div className="text-xs text-foreground">
            {getStatusDisplay(opportunity.stage, opportunity.nextStep)}
          </div>

          {/* Product Count and Quote Value */}
          <div className="flex items-center gap-2 text-xs">
            {productCount > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>🧵</span>
                <span>{productCount} products</span>
              </div>
            )}
            {quoteValue && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>💰</span>
                <span>${quoteValue.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Visual Indicators for Samples and Lab Dips */}
          <div className="flex items-center gap-2">
            {opportunity.hasSamples && <span className="text-sm">📦</span>}
            {opportunity.hasLabDips && <span className="text-sm">🧪</span>}
            {opportunity.missingSpecs && <span className="text-sm" title="Missing Specs">⚠️</span>}
          </div>

          {/* Next Step - Condensed */}
          <div className="text-xs leading-relaxed">
            <span className="text-muted-foreground">Next: </span>
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
                className="text-foreground truncate cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded inline-block max-w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStepEdit();
                }}
                title={opportunity.nextStep}
              >
                {opportunity.nextStep}
              </span>
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

function KanbanColumn({ stage, opportunities, count, onCardNavigate }: KanbanColumnProps & { count: number; onCardNavigate?: () => void }) {
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
              <OpportunityCard key={opportunity.id} opportunity={opportunity} onCardNavigate={onCardNavigate} />
            ))
        )}
      </div>
    </div>
  );
}

export default function Board({ onSwitchToList }: { onSwitchToList?: () => void }) {
  console.log('🟢 Board component is rendering');
  
  const navigate = useNavigate();
  const { visible, countsByStage, moveOpportunityStage, filters, setFilters, opportunities, addOpportunity } = useOpportunities();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showNewOpportunityDialog, setShowNewOpportunityDialog] = useState(false);
  const [cardNavigationCount, setCardNavigationCount] = useState(0);
  const [lastDragStart, setLastDragStart] = useState<string>("");
  const [lastDragEnd, setLastDragEnd] = useState<string>("");
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
    setLastDragStart(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("DRAG_END", { active: event.active.id, over: event.over?.id });
    setLastDragEnd(`${event.active.id} → ${event.over?.id || "none"}`);
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

  // Debug data
  const debugSections = [
    {
      title: "Stage System",
      rows: [
        { label: "Stages Present", value: STAGES.length, pass: STAGES.length === 8 },
        { label: "Columns Rendered", value: STAGES.length, pass: STAGES.length === 8 },
      ]
    },
    {
      title: "Data Integrity", 
      rows: [
        { label: "Visible Count", value: filteredOpportunities.length },
        { label: "Counts Sum", value: Object.values(stageCounts).reduce((a, b) => a + b, 0), pass: Object.values(stageCounts).reduce((a, b) => a + b, 0) === filteredOpportunities.length },
      ]
    },
    {
      title: "User Interactions",
      rows: [
        { label: "Card Navigations", value: cardNavigationCount },
        { label: "Last Drag Start", value: lastDragStart || "none" },
        { label: "Last Drag End", value: lastDragEnd || "none" },
      ]
    }
  ];

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
              <h1 className="text-3xl font-bold text-foreground">Opportunities Board1</h1>
              <p className="text-muted-foreground mt-1">
                Kanban view of your textile sourcing opportunities
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  alert('Button clicked!'); // This should definitely show
                  console.log('Opening NewOpportunityDialog');
                  console.log('Current showNewOpportunityDialog state:', showNewOpportunityDialog);
                  setShowNewOpportunityDialog(true);
                  console.log('After setting state to true');
                  setTimeout(() => console.log('State after timeout:', showNewOpportunityDialog), 100);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Opportunity
              </Button>
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
              
              <Button variant="outline" size="sm" onClick={() => onSwitchToList ? onSwitchToList() : navigate('/opportunities')}>
                <List className="h-4 w-4 mr-1" />
                List View
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

          </div>
        </div>

        {/* Debug Bar */}
        <DebugBar 
          open={showDebug} 
          onToggle={() => setShowDebug(!showDebug)} 
          sections={debugSections} 
        />

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
                  onCardNavigate={() => setCardNavigationCount(prev => prev + 1)}
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
      
      {/* New Opportunity Dialog */}
      <NewOpportunityDialog 
        open={showNewOpportunityDialog}
        onOpenChange={(open) => {
          console.log('NewOpportunityDialog onOpenChange:', open);
          console.log('Current showNewOpportunityDialog state before change:', showNewOpportunityDialog);
          setShowNewOpportunityDialog(open);
        }}
        onCreate={(payload) => addOpportunity(payload)} 
      />
      {showNewOpportunityDialog && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: 'red', 
          color: 'white', 
          padding: '10px', 
          zIndex: 9999 
        }}>
          DEBUG: Dialog should be open! showNewOpportunityDialog = {String(showNewOpportunityDialog)}
        </div>
      )}
    </DndContext>
  );
}