import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockThreads, EmailThread } from "./inbox/mockData";
import StatusBadge from "./inbox/StatusBadge";
import AISummaryCard from "./inbox/AISummaryCard";

export default function Inbox() {
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(mockThreads[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIViewEnabled, setIsAIViewEnabled] = useState(true);

  const filteredThreads = mockThreads.filter(thread =>
    thread.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex">
      {/* Left Column - Thread List (30%) */}
      <div className="flex-[3] min-w-[250px] border-r bg-muted/30">
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
                    <StatusBadge status={thread.status} />
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
      <div className="flex-[7] flex flex-col">
        {selectedThread ? (
          <>
            {/* Header with AI Toggle */}
            <div className="p-4 border-b bg-background flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedThread.subject}</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-view" className="text-sm font-medium">AI View</Label>
                <Switch
                  id="ai-view"
                  checked={isAIViewEnabled}
                  onCheckedChange={setIsAIViewEnabled}
                />
              </div>
            </div>

            {/* AI Summary Card - Conditionally rendered */}
            {isAIViewEnabled && (
              <div className="p-6 border-b bg-background">
                <AISummaryCard 
                  summary={selectedThread.summary}
                  suggestedNextStep={selectedThread.suggestedNextStep}
                  buyerIntent={selectedThread.buyerIntent}
                />
              </div>
            )}

            {/* Message Thread */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                
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