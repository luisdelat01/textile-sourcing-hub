import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StagePill } from "@/components/StagePill";
import { SpecChecklist, type SpecRecord, type SpecKey } from "@/components/SpecChecklist";
import { Save, TrendingUp, Package, FileText, ShoppingCart } from "lucide-react";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();

  // Mock data
  const mock = {
    name: "FW26 Development",
    company: "Tintex",
    brand: "Fleur de Mal",
    contactEmail: "dev@client.com",
    stage: "Clarify Buyer Intent" as const,
    nextStep: "Confirm MOQ and delivery window"
  };

  const [nextStep, setNextStep] = useState(mock.nextStep);
  const [lastSpecChange, setLastSpecChange] = useState<{ key: SpecKey; previousValue: any } | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left Block */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold text-foreground mb-1">
                {mock.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {mock.company} • {mock.brand} • {mock.contactEmail}
              </p>
            </div>

            {/* Center Block */}
            <div className="flex items-center gap-4">
              <StagePill stage={mock.stage} />
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
                    <div className="text-2xl font-bold">{metrics.missingSpecs}</div>
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
            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
                <CardDescription>
                  Generated quotes and pricing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </CardContent>
            </Card>
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