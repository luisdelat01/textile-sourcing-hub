import { Badge } from "@/components/ui/badge";
import { 
  Inbox, 
  MessageCircle, 
  Package, 
  FileText, 
  Clipboard, 
  Cog, 
  Truck, 
  CheckCircle 
} from "lucide-react";

type StageType = 
  | "Inbound Request"
  | "Clarify Buyer Intent" 
  | "Samples Sent"
  | "Quote Sent"
  | "PO Received"
  | "In Production"
  | "Ready to Ship"
  | "Closed – Delivered";

interface StagePillProps {
  stage: StageType;
}

const stageConfig = {
  "Inbound Request": {
    icon: Inbox,
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
  },
  "Clarify Buyer Intent": {
    icon: MessageCircle,
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
  },
  "Samples Sent": {
    icon: Package,
    variant: "secondary" as const,
    className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
  },
  "Quote Sent": {
    icon: FileText,
    variant: "secondary" as const,
    className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
  },
  "PO Received": {
    icon: Clipboard,
    variant: "secondary" as const,
    className: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800"
  },
  "In Production": {
    icon: Cog,
    variant: "secondary" as const,
    className: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800"
  },
  "Ready to Ship": {
    icon: Truck,
    variant: "secondary" as const,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
  },
  "Closed – Delivered": {
    icon: CheckCircle,
    variant: "default" as const,
    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
  }
};

export function StagePill({ stage }: StagePillProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1.5 px-3 py-1 ${config.className}`}>
      <Icon className="h-3 w-3" />
      {stage}
    </Badge>
  );
}