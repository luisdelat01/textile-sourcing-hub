import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface DebugRow {
  label: string;
  value: string | number | boolean;
  pass?: boolean;
}

interface DebugSection {
  title: string;
  rows: DebugRow[];
}

interface DebugBarProps {
  open: boolean;
  onToggle: () => void;
  sections: DebugSection[];
}

export function DebugBar({ open, onToggle, sections }: DebugBarProps) {
  return (
    <div className="border-b bg-muted/20">
      <Collapsible open={open} onOpenChange={onToggle}>
        <div className="px-6 py-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-7">
              {open ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              DEBUG
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="px-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="bg-background/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-1">
                    {section.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{row.label}:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono">
                            {typeof row.value === 'boolean' ? String(row.value) : row.value}
                          </span>
                          {row.pass !== undefined && (
                            <Badge 
                              variant={row.pass ? "default" : "destructive"} 
                              className={cn(
                                "h-4 px-1 text-xs",
                                row.pass ? "bg-green-600 hover:bg-green-700" : ""
                              )}
                            >
                              {row.pass ? "✓" : "✗"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}