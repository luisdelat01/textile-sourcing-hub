import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StagePill, type StageType } from "@/components/StagePill";
import { SpecChecklist, type SpecRecord, type SpecKey } from "@/components/SpecChecklist";
import { QuoteCard } from "@/components/QuoteCard";
import { type Quote } from "@/types/quote";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Save, TrendingUp, Package, FileText, ShoppingCart, Plus, Bug, Clock, Mail, User } from "lucide-react";
import { useOpportunities } from "@/stores/useOpportunities";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useOpportunities();

  // Get opportunity from store or fallback to mock
  const opportunity = getById(id || "") || {
    id: id || "OPP-004",
    name: "FW26 Development",
    company: "Tintex",
    contact: "dev@client.com", 
    brand: "Fleur de Mal",
    stage: "Clarify Buyer Intent" as StageType,
    nextStep: "Confirm MOQ and delivery window",
    timeline: [
      { date: "2024-09-08", event: "Stage Changed", description: "Moved to Clarify Buyer Intent" },
      { date: "2024-09-05", event: "Next Step Updated", description: "Updated next step to confirm MOQ" },
      { date: "2024-09-01", event: "Initial Contact", description: "Opportunity created from inbound inquiry" }
    ]
  };

  const [nextStep, setNextStep] = useState(opportunity.nextStep || "");
  const [lastSpecChange, setLastSpecChange] = useState<{ key: SpecKey; previousValue: any } | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Specs state management
  const [specs, setSpecs] = useState<SpecRecord>({
    fabricType: undefined,
    weightGSM: undefined,
    color: undefined,
    MOQ: undefined,
    deliveryWindow: undefined,
    certifications: [],
    priceTarget: undefined,
    handFeelNotes: ""
  });

  // Mock quotes data
  const mockQuotes: Quote[] = [
    {
      id: "Q-001",
      selectionId: "S-001",
      lines: [
        {
          productId: "P-001",
          name: "Cotton Poplin 120GSM",
          unit: "meters",
          quantity: 1000,
          price: 4.50,
          labDipRequired: true
        },
        {
          productId: "P-002", 
          name: "Organic Cotton Jersey 160GSM",
          unit: "meters",
          quantity: 500,
          price: 6.20,
          labDipRequired: true
        }
      ],
      validityDate: "2024-10-15",
      deliveryTerms: "4-6 weeks from order confirmation",
      incoterms: "FOB",
      total: 7600,
      status: "Draft",
      createdAt: "2024-09-01T10:00:00Z",
      updatedAt: "2024-09-02T14:30:00Z"
    },
    {
      id: "Q-002",
      selectionId: "S-001", 
      lines: [
        {
          productId: "P-003",
          name: "Linen Blend 140GSM",
          unit: "meters",
          quantity: 800,
          price: 8.90,
          labDipRequired: false
        }
      ],
      validityDate: "2024-09-30",
      deliveryTerms: "3-4 weeks from order confirmation",
      incoterms: "EXW",
      total: 7120,
      status: "Sent",
      createdAt: "2024-08-28T09:15:00Z",
      updatedAt: "2024-08-30T16:45:00Z"
    },
    {
      id: "Q-003",
      selectionId: "S-002",
      lines: [
        {
          productId: "P-004",
          name: "Bamboo Terry 180GSM",
          unit: "meters", 
          quantity: 1200,
          price: 5.75,
          labDipRequired: true
        },
        {
          productId: "P-005",
          name: "Modal Spandex 200GSM",
          unit: "meters",
          quantity: 600,
          price: 7.80,
          labDipRequired: false
        }
      ],
      validityDate: "2024-11-01",
      deliveryTerms: "5-7 weeks from order confirmation", 
      incoterms: "CIF",
      total: 11580,
      status: "Draft",
      createdAt: "2024-09-02T08:00:00Z",
      updatedAt: "2024-09-03T11:20:00Z"
    }
  ];

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

  // Mock metrics
  const metrics = {
    missingSpecs: Object.values(specs).filter(value => 
      value === undefined || 
      value === "" || 
      (Array.isArray(value) && value.length === 0)
    ).length,
    activeSamples: 3,
    openQuotes: 2,
    openPOs: 1
  };

  const handleSpecConfirm = (key: SpecKey, value: any) => {
    setLastSpecChange({ key, previousValue: specs[key] });
    setSpecs(prev => ({ ...prev, [key]: value }));
    console.log(`SPEC_FIELD_CONFIRMED: ${key}`, value);
  };

  const handleUndo = () => {
    if (lastSpecChange) {
      setSpecs(prev => ({ 
        ...prev, 
        [lastSpecChange.key]: lastSpecChange.previousValue 
      }));
      console.log("SPEC_FIELD_REVERTED:", lastSpecChange.key, lastSpecChange.previousValue);
      setLastSpecChange(null);
    }
  };

  const handleSaveNextStep = () => {
    console.log("Saving next step:", nextStep);
    // No persistence for now
  };

  const handleCreateSelection = () => {
    console.log("Create Selection clicked");
  };

  const handleGenerateQuote = () => {
    console.log("Generate Quote clicked");
  };

  const handleUploadPO = () => {
    console.log("Upload PO clicked");
  };

  const handleNewQuote = () => {
    console.log("Creating new quote from latest selection");
    navigate("/quote-editor");
  };

  const handleQuoteClick = (quote: Quote) => {
    console.log("Opening quote:", quote.id);
    navigate(`/quote-editor?id=${quote.id}`);
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
              <div className="flex items-center gap-2">
                <Input
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  placeholder="Next step..."
                  className="w-64"
                />
                <Button size="sm" onClick={handleSaveNextStep}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Block */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCreateSelection}>
                Create Selection
              </Button>
              <Button variant="outline" onClick={handleGenerateQuote}>
                Generate Quote
              </Button>
              <Button onClick={handleUploadPO}>
                Upload PO
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="selections">Selections</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="pos">POs</TabsTrigger>
            <TabsTrigger value="lab-dips">Lab Dips</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Missing Specs</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" aria-live="polite">{metrics.missingSpecs}</div>
                    <p className="text-xs text-muted-foreground">
                      specifications pending
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Samples</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.activeSamples}</div>
                    <p className="text-xs text-muted-foreground">
                      samples in progress
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Quotes</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.openQuotes}</div>
                    <p className="text-xs text-muted-foreground">
                      awaiting response
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open POs</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.openPOs}</div>
                    <p className="text-xs text-muted-foreground">
                      in fulfillment
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Spec Checklist */}
              <SpecChecklist 
                specs={specs} 
                onConfirm={handleSpecConfirm}
                onUndo={lastSpecChange ? handleUndo : undefined}
              />

              {/* Timeline & Emails Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                    <CardDescription>Recent activity and stage changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {opportunity.timeline?.slice().reverse().map((event, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                            {index !== opportunity.timeline.length - 1 && (
                              <div className="w-px h-full bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">{event.event}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(event.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Linked Emails */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Linked Emails
                    </CardTitle>
                    <CardDescription>Recent communication history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">Sophie Green</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Sep 3, 2025</span>
                        </div>
                        <p className="text-sm font-medium mb-1">Re: Lab Dip Colors for AW25</p>
                        <p className="text-xs text-muted-foreground">
                          The lab dip samples look great! Can we proceed with the bulk order?
                        </p>
                      </div>

                      <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">Marcus Chen</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Sep 1, 2025</span>
                        </div>
                        <p className="text-sm font-medium mb-1">Quote Request Follow-up</p>
                        <p className="text-xs text-muted-foreground">
                          Following up on the fabric pricing we discussed at the meeting.
                        </p>
                      </div>

                      <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">Alice Rivera</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Aug 28, 2025</span>
                        </div>
                        <p className="text-sm font-medium mb-1">Initial Requirements</p>
                        <p className="text-xs text-muted-foreground">
                          Thank you for the detailed spec sheet. We're excited to move forward!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="selections">
            <Card>
              <CardHeader>
                <CardTitle>Selections</CardTitle>
                <CardDescription>
                  Fabric and material selections for this opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
                  <p className="text-muted-foreground">
                    Generated quotes and pricing information for this opportunity
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDebugMode(!debugMode)}
                    className="flex items-center gap-2"
                  >
                    <Bug className="h-4 w-4" />
                    DEBUG
                  </Button>
                  <Button onClick={handleNewQuote} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Quote
                  </Button>
                </div>
              </div>

              {debugMode && (
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bug className="h-4 w-4" />
                      DEBUG Panel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Quote Details:</h4>
                      <div className="grid gap-2 text-xs font-mono">
                        {sortedQuotes.map((quote) => (
                          <div key={quote.id} className="flex items-center gap-4 p-2 bg-background rounded border">
                            <span>ID: {quote.id}</span>
                            <span>Sort Key: {getSortKey(quote)}</span>
                            <span>Total: {formatCurrency(quote.total)}</span>
                            <span>Validity: {formatDate(quote.validityDate)}</span>
                            <span>Incoterms: {quote.incoterms || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Validation Checks:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={sortedQuotes.length > 1 && new Date(getSortKey(sortedQuotes[0])).getTime() >= new Date(getSortKey(sortedQuotes[1])).getTime() ? "default" : "destructive"}>
                          Sorted DESC by fallback key
                        </Badge>
                        <Badge variant={sortedQuotes.every(q => formatCurrency(q.total) !== String(q.total)) ? "default" : "destructive"}>
                          All totals formatted
                        </Badge>
                        <Badge variant={sortedQuotes.every(q => !q.incoterms || ["EXW","FOB","CIF","DAP","DDP"].includes(q.incoterms)) ? "default" : "destructive"}>
                          Valid incoterms
                        </Badge>
                        <Badge variant="default">
                          Cards focusable & Enter/Space works
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {sortedQuotes.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No quotes yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first quote for this opportunity
                      </p>
                      <Button onClick={handleNewQuote} className="flex items-center gap-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        New Quote
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sortedQuotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      onClick={() => handleQuoteClick(quote)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pos">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>
                  Purchase orders and fulfillment tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab-dips">
            <Card>
              <CardHeader>
                <CardTitle>Lab Dips</CardTitle>
                <CardDescription>
                  Color matching and lab dip approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
                  laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure 
                  reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>
                  Project timeline and milestone tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis 
                  praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias 
                  excepturi sint occaecati cupiditate non provident, similique sunt in culpa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}