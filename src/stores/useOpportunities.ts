import { create } from 'zustand';

export type StageEnum = 
  | "Inbound Request"
  | "Clarify Buyer Intent" 
  | "Samples Sent"
  | "Quote Sent"
  | "PO Received"
  | "In Production"
  | "Ready to Ship"
  | "Closed – Delivered";

export interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  brand: string;
  stage: StageEnum;
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
  // Mock status badges
  missingSpecs: boolean;
  hasSamples: boolean;
  hasQuote: boolean;
  hasPO: boolean;
  hasLabDips: boolean;
}

export interface OpportunityFilters {
  search: string;
  stages: StageEnum[];
  priority: string;
  assignedRep: string;
  brand: string;
  source: string;
  dateRange: string;
}

interface OpportunityStore {
  opportunities: Opportunity[];
  filters: OpportunityFilters;
  setFilters: (filters: Partial<OpportunityFilters>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  moveOpportunityStage: (id: string, newStage: StageEnum) => void;
}

// Mock data with the new stage enum
const mockOpportunities: Opportunity[] = [
  {
    id: "OPP-001",
    name: "Spring Collection Fabrics",
    company: "Fashion Forward Inc",
    contact: "Sarah Johnson",
    brand: "Trendy Wear",
    stage: "Quote Sent",
    priority: "High",
    updated: "2024-01-15",
    nextStep: "Send fabric samples and pricing breakdown",
    source: "Trade Show",
    assignedRep: "John Smith",
    timeline: [
      { date: "2024-01-10", event: "Initial Contact", description: "Met at textile trade show" },
      { date: "2024-01-12", event: "Requirements Gathered", description: "Discussed fabric specifications" },
      { date: "2024-01-15", event: "Proposal Sent", description: "Sent initial proposal with samples" }
    ],
    missingSpecs: false,
    hasSamples: true,
    hasQuote: true,
    hasPO: false,
    hasLabDips: true
  },
  {
    id: "OPP-002",
    name: "Organic Cotton Sourcing",
    company: "EcoWear Brand",
    contact: "Mike Chen",
    brand: "GreenFashion",
    stage: "PO Received",
    priority: "Medium",
    updated: "2024-01-18",
    nextStep: "Finalize contract terms and delivery schedule",
    source: "Website Inquiry",
    assignedRep: "Lisa Wong",
    timeline: [
      { date: "2024-01-05", event: "Web Inquiry", description: "Organic cotton sourcing request" },
      { date: "2024-01-08", event: "Discovery Call", description: "Understanding sustainability requirements" },
      { date: "2024-01-18", event: "Negotiation Started", description: "Price and terms discussion" }
    ],
    missingSpecs: false,
    hasSamples: true,
    hasQuote: true,
    hasPO: true,
    hasLabDips: false
  },
  {
    id: "OPP-003",
    name: "Luxury Silk Import",
    company: "Premium Textiles Ltd",
    contact: "Emma Davis",
    brand: "Silken Dreams",
    stage: "Clarify Buyer Intent",
    priority: "High",
    updated: "2024-01-20",
    nextStep: "Schedule factory visit and quality inspection",
    source: "Referral",
    assignedRep: "David Park",
    timeline: [
      { date: "2024-01-15", event: "Referral Received", description: "Referred by existing client" },
      { date: "2024-01-17", event: "Initial Meeting", description: "Luxury silk requirements discussion" },
      { date: "2024-01-20", event: "Qualified Lead", description: "Budget and timeline confirmed" }
    ],
    missingSpecs: true,
    hasSamples: false,
    hasQuote: false,
    hasPO: false,
    hasLabDips: false
  },
  {
    id: "OPP-004",
    name: "Sustainable Wool Blend",
    company: "Nordic Apparel",
    contact: "Lars Andersen",
    brand: "Arctic Wear",
    stage: "Inbound Request",
    priority: "Low",
    updated: "2024-01-22",
    nextStep: "Research sustainable wool suppliers in region",
    source: "Cold Outreach",
    assignedRep: "Maria Garcia",
    timeline: [
      { date: "2024-01-20", event: "Cold Email", description: "Initial outreach about wool blends" },
      { date: "2024-01-22", event: "Response Received", description: "Interest in sustainable options" }
    ],
    missingSpecs: true,
    hasSamples: false,
    hasQuote: false,
    hasPO: false,
    hasLabDips: false
  },
  {
    id: "OPP-005",
    name: "Performance Athletic Fabrics",
    company: "SportsTech Inc",
    contact: "Ryan Williams",
    brand: "ActiveGear",
    stage: "Samples Sent",
    priority: "Medium",
    updated: "2024-01-25",
    nextStep: "Demo moisture-wicking properties in lab test",
    source: "Trade Show",
    assignedRep: "John Smith",
    timeline: [
      { date: "2024-01-18", event: "Trade Show Meeting", description: "Athletic wear fabric requirements" },
      { date: "2024-01-21", event: "Technical Discussion", description: "Performance specifications review" },
      { date: "2024-01-25", event: "Proposal Drafted", description: "Technical proposal with test results" }
    ],
    missingSpecs: false,
    hasSamples: true,
    hasQuote: false,
    hasPO: false,
    hasLabDips: false
  },
  {
    id: "OPP-006",
    name: "Winter Collection Woolens",
    company: "Mountain Gear Co",
    contact: "Alex Thompson",
    brand: "Alpine Pro",
    stage: "In Production",
    priority: "High",
    updated: "2024-01-28",
    nextStep: "Monitor production timeline and quality checks",
    source: "Existing Client",
    assignedRep: "Lisa Wong",
    timeline: [
      { date: "2024-01-10", event: "Repeat Order", description: "Winter collection order placed" },
      { date: "2024-01-15", event: "Production Started", description: "Manufacturing commenced" }
    ],
    missingSpecs: false,
    hasSamples: true,
    hasQuote: true,
    hasPO: true,
    hasLabDips: true
  },
  {
    id: "OPP-007",
    name: "Hemp Canvas Prototype",
    company: "Eco Bags Inc",
    contact: "Sophie Green",
    brand: "Earth Friendly",
    stage: "Ready to Ship",
    priority: "Medium",
    updated: "2024-01-30",
    nextStep: "Coordinate shipping and delivery schedule",
    source: "Trade Show",
    assignedRep: "David Park",
    timeline: [
      { date: "2024-01-05", event: "Trade Show Contact", description: "Hemp canvas bag requirements" },
      { date: "2024-01-20", event: "Production Complete", description: "Quality approved and packed" }
    ],
    missingSpecs: false,
    hasSamples: true,
    hasQuote: true,
    hasPO: true,
    hasLabDips: false
  }
];

export const useOpportunities = create<OpportunityStore>((set) => ({
  opportunities: mockOpportunities,
  filters: {
    search: "",
    stages: [],
    priority: "all",
    assignedRep: "all",
    brand: "all",
    source: "all",
    dateRange: "all"
  },
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  updateOpportunity: (id, updates) => set((state) => ({
    opportunities: state.opportunities.map(opp => 
      opp.id === id ? { ...opp, ...updates } : opp
    )
  })),
  moveOpportunityStage: (id, newStage) => set((state) => ({
    opportunities: state.opportunities.map(opp => 
      opp.id === id ? { ...opp, stage: newStage, updated: new Date().toISOString().split('T')[0] } : opp
    )
  }))
}));