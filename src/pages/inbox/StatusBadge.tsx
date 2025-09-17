import { Badge } from "@/components/ui/badge";
import { EmailThread } from "./mockData";

interface StatusBadgeProps {
  status: EmailThread["status"];
}

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

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge 
      variant={getStatusBadgeVariant(status)}
      className={`text-xs ${getStatusBadgeClasses(status)}`}
    >
      {status}
    </Badge>
  );
}