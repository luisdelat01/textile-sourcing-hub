import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Calendar, User, Building, Flag } from "lucide-react";

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  brand: string;
  stage: string;
  priority: "High" | "Medium" | "Low";
  updated: string;
  nextStep: string;
  source: string;
  assignedRep: string;
  timeline: Array<{
    date: string;
    event: string;
    description: string;
  }>;
}

const mockOpportunities: Opportunity[] = [
  {
    id: "OPP-001",
    name: "Spring Collection Fabrics",
    company: "Fashion Forward Inc",
    contact: "Sarah Johnson",
    brand: "Trendy Wear",
    stage: "Proposal",
    priority: "High",
    updated: "2024-01-15",
    nextStep: "Send fabric samples and pricing breakdown",
    source: "Trade Show",
    assignedRep: "John Smith",
    timeline: [
      { date: "2024-01-10", event: "Initial Contact", description: "Met at textile trade show" },
      { date: "2024-01-12", event: "Requirements Gathered", description: "Discussed fabric specifications" },
      { date: "2024-01-15", event: "Proposal Sent", description: "Sent initial proposal with samples" }
    ]
  },
  {
    id: "OPP-002",
    name: "Organic Cotton Sourcing",
    company: "EcoWear Brand",
    contact: "Mike Chen",
    brand: "GreenFashion",
    stage: "Negotiation",
    priority: "Medium",
    updated: "2024-01-18",
    nextStep: "Finalize contract terms and delivery schedule",
    source: "Website Inquiry",
    assignedRep: "Lisa Wong",
    timeline: [
      { date: "2024-01-05", event: "Web Inquiry", description: "Organic cotton sourcing request" },
      { date: "2024-01-08", event: "Discovery Call", description: "Understanding sustainability requirements" },
      { date: "2024-01-18", event: "Negotiation Started", description: "Price and terms discussion" }
    ]
  },
  {
    id: "OPP-003",
    name: "Luxury Silk Import",
    company: "Premium Textiles Ltd",
    contact: "Emma Davis",
    brand: "Silken Dreams",
    stage: "Qualified",
    priority: "High",
    updated: "2024-01-20",
    nextStep: "Schedule factory visit and quality inspection",
    source: "Referral",
    assignedRep: "David Park",
    timeline: [
      { date: "2024-01-15", event: "Referral Received", description: "Referred by existing client" },
      { date: "2024-01-17", event: "Initial Meeting", description: "Luxury silk requirements discussion" },
      { date: "2024-01-20", event: "Qualified Lead", description: "Budget and timeline confirmed" }
    ]
  },
  {
    id: "OPP-004",
    name: "Sustainable Wool Blend",
    company: "Nordic Apparel",
    contact: "Lars Andersen",
    brand: "Arctic Wear",
    stage: "Discovery",
    priority: "Low",
    updated: "2024-01-22",
    nextStep: "Research sustainable wool suppliers in region",
    source: "Cold Outreach",
    assignedRep: "Maria Garcia",
    timeline: [
      { date: "2024-01-20", event: "Cold Email", description: "Initial outreach about wool blends" },
      { date: "2024-01-22", event: "Response Received", description: "Interest in sustainable options" }
    ]
  },
  {
    id: "OPP-005",
    name: "Performance Athletic Fabrics",
    company: "SportsTech Inc",
    contact: "Ryan Williams",
    brand: "ActiveGear",
    stage: "Proposal",
    priority: "Medium",
    updated: "2024-01-25",
    nextStep: "Demo moisture-wicking properties in lab test",
    source: "Trade Show",
    assignedRep: "John Smith",
    timeline: [
      { date: "2024-01-18", event: "Trade Show Meeting", description: "Athletic wear fabric requirements" },
      { date: "2024-01-21", event: "Technical Discussion", description: "Performance specifications review" },
      { date: "2024-01-25", event: "Proposal Drafted", description: "Technical proposal with test results" }
    ]
  }
];

export default function OpportunitiesList() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [nextStep, setNextStep] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    stages: [] as string[],
    priority: "all",
    source: "all",
    assignedRep: "all",
  });

  const stages = ["Discovery", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
  const priorities = ["High", "Medium", "Low"];
  const sources = ["Trade Show", "Website Inquiry", "Referral", "Cold Outreach"];
  const reps = ["John Smith", "Lisa Wong", "David Park", "Maria Garcia"];

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesSearch = opp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         opp.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStage = filters.stages.length === 0 || filters.stages.includes(opp.stage);
    const matchesPriority = filters.priority === "all" || opp.priority === filters.priority;
    const matchesSource = filters.source === "all" || opp.source === filters.source;
    const matchesRep = filters.assignedRep === "all" || opp.assignedRep === filters.assignedRep;
    
    return matchesSearch && matchesStage && matchesPriority && matchesSource && matchesRep;
  });

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const getStageVariant = (stage: string) => {
    switch (stage) {
      case "Discovery": return "outline";
      case "Qualified": return "secondary";
      case "Proposal": return "default";
      case "Negotiation": return "default";
      case "Closed Won": return "default";
      case "Closed Lost": return "destructive";
      default: return "secondary";
    }
  };

  const handleStageFilter = (stage: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      stages: checked 
        ? [...prev.stages, stage]
        : prev.stages.filter(s => s !== stage)
    }));
  };

  const openOpportunityDrawer = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setNextStep(opportunity.nextStep);
  };

  return (
    <div className="flex h-full">
      {/* Left Filter Panel */}
      <div className="w-80 border-r bg-muted/30 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          
          {/* Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {/* Stage Filter */}
          <div className="space-y-2">
            <Label>Stage</Label>
            <Card className="p-3">
              <div className="space-y-2">
                {stages.map(stage => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={stage}
                      checked={filters.stages.includes(stage)}
                      onCheckedChange={(checked) => handleStageFilter(stage, checked as boolean)}
                    />
                    <Label htmlFor={stage} className="text-sm font-normal">{stage}</Label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label>Priority</Label>
          <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map(priority => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>

          {/* Source Filter */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Rep Filter */}
          <div className="space-y-2">
            <Label>Assigned Rep</Label>
            <Select value={filters.assignedRep} onValueChange={(value) => setFilters(prev => ({ ...prev, assignedRep: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {reps.map(rep => (
                  <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
            <p className="text-muted-foreground mt-1">
              Manage your textile sourcing opportunities and track progress
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Opportunity
          </Button>
        </div>

        {/* Opportunities Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Next Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opportunity) => (
                <Drawer key={opportunity.id}>
                  <DrawerTrigger asChild>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openOpportunityDrawer(opportunity)}
                    >
                      <TableCell className="font-medium">{opportunity.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {opportunity.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {opportunity.contact}
                        </div>
                      </TableCell>
                      <TableCell>{opportunity.brand}</TableCell>
                      <TableCell>
                        <Badge variant={getStageVariant(opportunity.stage)}>
                          {opportunity.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <Badge variant={getPriorityVariant(opportunity.priority)}>
                            {opportunity.priority}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {opportunity.updated}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{opportunity.nextStep}</TableCell>
                    </TableRow>
                  </DrawerTrigger>
                  
                  <DrawerContent className="max-w-2xl mx-auto">
                    <DrawerHeader>
                      <DrawerTitle>{opportunity.name}</DrawerTitle>
                    </DrawerHeader>
                    
                    <div className="p-6 space-y-6">
                      {/* Opportunity Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Company</Label>
                          <p className="font-medium">{opportunity.company}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Contact</Label>
                          <p className="font-medium">{opportunity.contact}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Brand</Label>
                          <p className="font-medium">{opportunity.brand}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Assigned Rep</Label>
                          <p className="font-medium">{opportunity.assignedRep}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <Label className="text-base font-semibold">Timeline</Label>
                        <div className="mt-3 space-y-3">
                          {opportunity.timeline.map((event, index) => (
                            <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{event.event}</span>
                                  <span className="text-sm text-muted-foreground">{event.date}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Step */}
                      <div>
                        <Label htmlFor="next-step" className="text-base font-semibold">Next Step</Label>
                        <Textarea
                          id="next-step"
                          className="mt-2"
                          value={nextStep}
                          onChange={(e) => setNextStep(e.target.value)}
                          placeholder="Enter the next step for this opportunity..."
                        />
                        <Button className="mt-3">Update Next Step</Button>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}