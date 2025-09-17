import { useState } from "react";
import { Search, Info, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  sender: string;
  timestamp: string;
  content: string;
  isFromBuyer: boolean;
}

interface EmailThread {
  id: string;
  opportunityTitle: string;
  senderName: string;
  subject: string;
  lastMessagePreview: string;
  status: "Waiting on quote" | "Buyer replied" | "Need to confirm MOQ";
  summary: string;
  suggestedNextStep: string;
  buyerIntent: string[];
  messages: Message[];
}

const mockThreads: EmailThread[] = [
  {
    id: "1",
    opportunityTitle: "FW25 Cotton Jersey",
    senderName: "Sarah Chen",
    subject: "MOQ and pricing inquiry",
    lastMessagePreview: "Thanks for the quick response. Could you confirm the MOQ for 2000m?",
    status: "Waiting on quote",
    summary: "Buyer asked for MOQ and price on 2000m cotton jersey.",
    suggestedNextStep: "Confirm MOQ and provide detailed pricing breakdown.",
    buyerIntent: ["Negotiating price", "MOQ inquiry"],
    messages: [
      {
        id: "1",
        sender: "Sarah Chen",
        timestamp: "2024-01-15 10:30 AM",
        content: "Hi there, I'm interested in your cotton jersey for our FW25 collection. Could you provide pricing for 2000m and confirm the minimum order quantity?",
        isFromBuyer: true
      },
      {
        id: "2",
        sender: "You",
        timestamp: "2024-01-15 11:15 AM",
        content: "Hi Sarah, thank you for your interest. I'll prepare a detailed quote with MOQ information and send it over by end of day.",
        isFromBuyer: false
      },
      {
        id: "3",
        sender: "Sarah Chen",
        timestamp: "2024-01-15 2:45 PM",
        content: "Thanks for the quick response. Could you confirm the MOQ for 2000m? We're working on tight timelines for our collection.",
        isFromBuyer: true
      }
    ]
  },
  {
    id: "2",
    opportunityTitle: "SS25 Linen Blend",
    senderName: "Mark Rodriguez",
    subject: "Sample confirmation received",
    lastMessagePreview: "Perfect! The samples look great. When can we expect the production timeline?",
    status: "Buyer replied",
    summary: "Buyer confirmed receipt of samples and is ready to proceed.",
    suggestedNextStep: "Follow up with production timeline and next steps.",
    buyerIntent: ["Requesting samples", "Production timeline"],
    messages: [
      {
        id: "1",
        sender: "You",
        timestamp: "2024-01-14 9:00 AM",
        content: "Hi Mark, your linen blend samples have been shipped and should arrive tomorrow. Tracking number: ABC123456",
        isFromBuyer: false
      },
      {
        id: "2",
        sender: "Mark Rodriguez",
        timestamp: "2024-01-15 8:30 AM",
        content: "Samples received! The quality is exactly what we're looking for. The hand feel and drape are perfect for our SS25 collection.",
        isFromBuyer: true
      },
      {
        id: "3",
        sender: "Mark Rodriguez",
        timestamp: "2024-01-15 8:35 AM",
        content: "Perfect! The samples look great. When can we expect the production timeline? We'd like to place the order soon.",
        isFromBuyer: true
      }
    ]
  },
  {
    id: "3",
    opportunityTitle: "Custom Embroidered Denim",
    senderName: "Lisa Thompson",
    subject: "Embroidery options and MOQ",
    lastMessagePreview: "The embroidery samples are beautiful. What's the MOQ for custom embroidery work?",
    status: "Need to confirm MOQ",
    summary: "Buyer is reviewing embroidery options and needs MOQ confirmation.",
    suggestedNextStep: "Share MOQ requirements for custom embroidery work.",
    buyerIntent: ["Custom request", "MOQ inquiry"],
    messages: [
      {
        id: "1",
        sender: "Lisa Thompson",
        timestamp: "2024-01-13 3:20 PM",
        content: "Hi, I saw your work on custom embroidered denim. We're interested in a bespoke design for our premium line. Could you share some samples?",
        isFromBuyer: true
      },
      {
        id: "2",
        sender: "You",
        timestamp: "2024-01-13 4:45 PM",
        content: "Hello Lisa, I'd be happy to help with your custom embroidery project. I'll send over some samples of our recent work tomorrow.",
        isFromBuyer: false
      },
      {
        id: "3",
        sender: "Lisa Thompson",
        timestamp: "2024-01-15 11:20 AM",
        content: "The embroidery samples are beautiful. The detail work is impressive. What's the MOQ for custom embroidery work like this?",
        isFromBuyer: true
      }
    ]
  }
];

const getStatusBadgeVariant = (status: EmailThread["status"]) => {
  switch (status) {
    case "Waiting on quote":
      return "default"; // Will be styled yellow
    case "Buyer replied":
      return "secondary"; // Will be styled green
    case "Need to confirm MOQ":
      return "destructive"; // Will be styled red
    default:
      return "default";
  }
};

const getStatusBadgeClasses = (status: EmailThread["status"]) => {
  switch (status) {
    case "Waiting on quote":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200";
    case "Buyer replied":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-200";
    case "Need to confirm MOQ":
      return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900 dark:text-red-200";
    default:
      return "";
  }
};

export default function Inbox() {
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(mockThreads[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredThreads = mockThreads.filter(thread =>
    thread.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex">
      {/* Left Column - Thread List (30%) */}
      <div className="w-[30%] border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ask AI: What's the latest from Buyer X?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredThreads.map((thread) => (
              <Card
                key={thread.id}
                className={`mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedThread?.id === thread.id ? "bg-muted border-primary" : ""
                }`}
                onClick={() => setSelectedThread(thread)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm truncate">{thread.opportunityTitle}</h3>
                    <Badge 
                      variant={getStatusBadgeVariant(thread.status)}
                      className={`text-xs ${getStatusBadgeClasses(thread.status)}`}
                    >
                      {thread.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{thread.senderName}</p>
                  <p className="text-sm font-medium mb-1 truncate">{thread.subject}</p>
                  <p className="text-sm text-muted-foreground truncate">{thread.lastMessagePreview}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Column - Conversation View (70%) */}
      <div className="w-[70%] flex flex-col">
        {selectedThread ? (
          <>
            {/* AI Summary Card */}
            <div className="p-6 border-b bg-background">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">AI Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">{selectedThread.summary}</p>
                  </div>
                  
                  <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>Suggested Next Step:</strong> {selectedThread.suggestedNextStep}
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Buyer Intent</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedThread.buyerIntent.map((intent, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {intent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Thread */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">{selectedThread.subject}</h2>
                
                {selectedThread.messages.map((message, index) => (
                  <div key={message.id}>
                    <div className={`flex items-start gap-3 ${message.isFromBuyer ? '' : 'flex-row-reverse'}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {message.isFromBuyer ? message.sender.split(' ').map(n => n[0]).join('') : 'You'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[70%] ${message.isFromBuyer ? '' : 'text-right'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.isFromBuyer ? message.sender : 'You'}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        
                        <div className={`rounded-lg p-3 ${
                          message.isFromBuyer 
                            ? 'bg-muted text-foreground' 
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                    
                    {index < selectedThread.messages.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose an email thread to view the conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}