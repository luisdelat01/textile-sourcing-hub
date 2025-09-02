import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, User, FileText, MessageSquare, Clock } from "lucide-react";

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();

  // Mock data - in real app this would come from API
  const opportunity = {
    id: id || "OPP-001",
    title: "Spring Collection Fabrics",
    client: "Fashion Forward Inc",
    status: "Active",
    deadline: "2024-03-15",
    value: "$45,000",
    description: "Sourcing high-quality cotton and silk blends for the upcoming spring collection. Requirements include sustainable sourcing practices and GOTS certification.",
    requirements: [
      "100% organic cotton base",
      "GOTS certified materials",
      "Minimum 50 GSM weight",
      "Color-fast dyes",
      "Sample approval required"
    ],
    timeline: [
      { date: "2024-01-15", event: "Opportunity created", status: "completed" },
      { date: "2024-01-20", event: "Initial supplier outreach", status: "completed" },
      { date: "2024-02-01", event: "Sample requests sent", status: "completed" },
      { date: "2024-02-15", event: "Sample review and approval", status: "in-progress" },
      { date: "2024-03-01", event: "Final quote preparation", status: "pending" },
      { date: "2024-03-15", event: "Final submission", status: "pending" },
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{opportunity.title}</h1>
            <Badge variant={opportunity.status === "Active" ? "default" : "secondary"}>
              {opportunity.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">ID: {opportunity.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button>Create Quote</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold">{opportunity.client}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="font-semibold">{opportunity.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-semibold">{opportunity.deadline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Days Left</p>
                <p className="font-semibold">23 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{opportunity.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
              <CardDescription>
                Detailed specifications for this sourcing opportunity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {opportunity.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>
                Track progress and upcoming milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunity.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'completed' ? 'bg-success' :
                      item.status === 'in-progress' ? 'bg-warning' : 'bg-muted'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant={
                      item.status === 'completed' ? 'default' :
                      item.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Files</CardTitle>
              <CardDescription>
                Attachments and related documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted rounded-lg">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}