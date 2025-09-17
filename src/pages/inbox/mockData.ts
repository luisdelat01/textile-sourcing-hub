export interface Message {
  id: string;
  sender: string;
  timestamp: string;
  content: string;
  isFromBuyer: boolean;
}

export interface EmailThread {
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

export const mockThreads: EmailThread[] = [
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