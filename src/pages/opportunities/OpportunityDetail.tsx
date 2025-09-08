import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StagePill, type StageType } from "@/components/StagePill";
import { type Quote } from "@/types/quote";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Save, TrendingUp, Package, FileText, Clock, Mail, User, Upload, PlusSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useOpportunities } from "@/stores/useOpportunities";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useOpportunities();

  const isOPP002 = id === "OPP-002";
  const isOPP003 = id === "OPP-003";

  // Get opportunity from store or fallback to mock
  let opportunity = getById(id || "");
  
  // Replace or override opportunity if mock fallback is being used
  if (!opportunity || isOPP002 || isOPP003) {
    opportunity = {
      id: id || "OPP-002",
      name: isOPP003 ? "Luxury Silk Import" : "Organic Cotton Sourcing",
      company: isOPP003 ? "Premium Textiles Ltd" : "EcoWear Brand",
      contact: isOPP003 ? "emma@premiumtextiles.com" : "mike@ecowear.com",
      brand: isOPP003 ? "Silken Dreams" : "GreenFashion",
      stage: (isOPP003 ? "Clarify Buyer Intent" : "PO Received") as StageType,
      priority: isOPP003 ? "High" : "Medium",
      updated: "2024-09-14",
      nextStep: isOPP003 ? "Waiting on quote" : "Confirm production plan",
      source: "Referral",
      assignedRep: isOPP003 ? "David Park" : "Lisa Wong",
      timeline: [
        { date: "2024-09-10", event: "Initial Contact", description: "Contacted via referral." },
        { date: "2024-09-12", event: "Requirements Discussion", description: "Shared MOQ + specs" },
        { date: "2024-09-14", event: "Next Step Updated", description: isOPP003 ? "Waiting on quote" : "Confirm production" },
      ],
      missingSpecs: isOPP003,
      hasSamples: isOPP002,
      hasQuote: isOPP002,
      hasPO: isOPP002,
      hasLabDips: isOPP002
    };
  }

  // Mock quotes data
  const mockQuotes: Quote[] = isOPP002
    ? [
        {
          id: "Q-PO-002",
          selectionId: "S-PO-002",
          lines: [
            { productId: "P-COT-01", name: "Organic Cotton 150GSM", unit: "meters", quantity: 600, price: 5.20, labDipRequired: true },
            { productId: "P-COT-02", name: "Cotton Twill 180GSM", unit: "meters", quantity: 400, price: 4.90, labDipRequired: true }
          ],
          validityDate: "2024-10-01",
          deliveryTerms: "3-5 weeks",
          incoterms: "FOB",
          total: 5480,
          status: "Sent",
          createdAt: "2024-09-05T09:00:00Z",
          updatedAt: "2024-09-06T13:45:00Z"
        }
      ]
    : [];

  // Quote Status Badge Logic
  const quoteStatus = isOPP003
    ? "Waiting on Quote"
    : isOPP002
      ? "Sent"
      : "Draft";

  // Active Lab Dips count for Quick Stats
  const activeLabDipCount = isOPP002 ? 2 : 0;

  // Smart status based on opportunity 
  const opportunityStatus = isOPP003
    ? "Clarifying Buyer Intent"
    : isOPP002
      ? "Production Planning"
      : "Clarifying Buyer Intent";

  // Sort quotes with fallback logic
  const getSortKey = (quote: Quote) => {
    return quote.updatedAt || quote.createdAt || quote.validityDate || "1970-01-01T00:00:00Z";
  };

  const sortedQuotes = useMemo(() => 
    [...mockQuotes].sort((a, b) => {
      const keyA = getSortKey(a);
      const keyB = getSortKey(b);
      return new Date(keyB).getTime() - new Date(keyA).getTime();
    }), [mockQuotes]
  );

// Create unified timeline combining all activity types
  const timelineEntries = useMemo(() => {
    const entries = [];

    // Add stage changes from opportunity timeline
    if (opportunity.timeline) {
      opportunity.timeline.forEach(event => {
        entries.push({
          id: `timeline-${event.date}-${event.event}`,
          date: event.date,
          type: 'stage_change',
          title: event.event,
          description: event.description,
          icon: TrendingUp,
          sender: null
        });
      });
    }

    // Add mock emails
    const mockEmails = [
      {
        id: 'email-1',
        date: '2024-09-03',
        sender: 'Sophie Green',
        subject: 'Re: Lab Dip Colors for AW25',
        preview: 'The lab dip samples look great! Can we proceed with the bulk order? Looking forward to your confirmation on the delivery timeline.'
      },
      {
        id: 'email-2', 
        date: '2024-09-01',
        sender: 'Marcus Chen',
        subject: 'Quote Request Follow-up',
        preview: 'Following up on the fabric pricing we discussed at the meeting. Can you provide updated MOQ requirements?'
      },
      {
        id: 'email-3',
        date: '2024-08-28',
        sender: 'Alice Rivera', 
        subject: 'Initial Requirements',
        preview: 'Thank you for the detailed spec sheet. We\'re excited to move forward! The fabric samples you sent match our vision perfectly.'
      },
      {
        id: 'email-4',
        date: '2024-08-25',
        sender: 'David Kim',
        subject: 'Project Kickoff', 
        preview: 'Welcome to the FW26 development project! Attached are the initial brand guidelines and seasonal color palette.'
      }
    ];

    mockEmails.forEach(email => {
      entries.push({
        id: email.id,
        date: email.date,
        type: 'email',
        title: email.subject,
        description: email.preview,
        icon: Mail,
        sender: email.sender
      });
    });

    // Add quote events
    mockQuotes.forEach(quote => {
      if (quote.status === 'Sent') {
        entries.push({
          id: `quote-${quote.id}`,
          date: quote.updatedAt?.split('T')[0] || quote.createdAt?.split('T')[0] || '2024-09-01',
          type: 'quote_sent',
          title: `Quote ${quote.id} Sent`,
          description: `Pricing proposal sent - ${formatCurrency(quote.total)} total value`,
          icon: FileText,
          sender: null
        });
      }
    });

    // Add mock selection events
    entries.push({
      id: 'selection-1',
      date: '2024-08-30',
      type: 'selection_created',
      title: 'Selection S-001 Created',
      description: 'Initial fabric selection with 3 cotton options for client review',
      icon: Package,
      sender: null
    });

    // Sort by date (newest first)
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [opportunity.timeline, mockQuotes]);


  const handleCreateSelection = () => {
    console.log("Create Selection clicked");
  };

  const handleUploadPO = () => {
    console.log("Upload PO clicked");
  };

  const handleSendEmail = () => {
    console.log("Send Email clicked");
  };

  const TimelineEntry = ({ entry }: { entry: any }) => {
    const IconComponent = entry.icon;
    
    return (
      <div className="flex gap-4 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="w-px bg-border flex-1 mt-2"></div>
        </div>
        <div className="flex-1">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {entry.sender && (
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {entry.sender}
                      </span>
                    </div>
                  )}
                  <h4 className="font-medium text-sm">{entry.title}</h4>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(entry.date)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left Block */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                {opportunity.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {opportunity.company} • {opportunity.brand} • {opportunity.contact}
              </p>
            </div>

            {/* Center Block */}
            <div className="flex items-center gap-4">
              <StagePill stage={opportunity.stage as StageType} />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Opportunity Feed
                  </CardTitle>
                  <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {opportunityStatus}
                  </div>
                </div>
                <CardDescription>
                  Chronological view of all activity for this opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)] px-6">
                  <div className="space-y-0">
                    {timelineEntries.map((entry, index) => (
                      <div key={entry.id}>
                        <TimelineEntry entry={entry} />
                        {index === timelineEntries.length - 1 && (
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="text-sm text-muted-foreground italic">
                                Beginning of opportunity timeline
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Opportunity Summary */}
          <div className="space-y-6">
            
            {/* Stage & Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opportunity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <StagePill stage={opportunity.stage as StageType} />
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="text-sm">{opportunity.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Brand</label>
                    <p className="text-sm">{opportunity.brand}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact</label>
                    <p className="text-sm">{opportunity.contact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {/* Quote Status Row */}
                <div className="flex justify-between items-center gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Quote Status</span>
                  </div>
                  <Badge variant={quoteStatus === "Sent" ? "default" : quoteStatus === "Draft" ? "secondary" : "outline"} className="text-xs">
                    {quoteStatus}
                  </Badge>
                </div>
                
                <hr className="border-border" />
                
                {/* Active Lab Dips Row */}
                <div className="flex justify-between items-center gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Active Lab Dips</span>
                  </div>
                  <span className="text-sm font-medium">{activeLabDipCount}</span>
                </div>
                
                <hr className="border-border" />
                
                {/* Total Value Row */}
                <div className="flex justify-between items-center gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Total Value</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(mockQuotes.reduce((sum, q) => sum + q.total, 0))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleCreateSelection}
                  className="w-full"
                  variant="default"
                >
                  <PlusSquare className="h-4 w-4 mr-2" />
                  Create Selection
                </Button>
                <Button 
                  onClick={handleUploadPO}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PO
                </Button>
                <Button 
                  onClick={handleSendEmail}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}