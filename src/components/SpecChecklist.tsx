import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Check, X } from "lucide-react";

export type SpecKey = "fabricType" | "weightGSM" | "color" | "MOQ" | "deliveryWindow" | "certifications" | "priceTarget" | "handFeelNotes";

export type SpecRecord = Partial<Record<SpecKey, any>>;

interface SpecChecklistProps {
  specs: SpecRecord;
  onConfirm: (key: SpecKey, value: any) => void;
  onUndo?: () => void;
}

const specLabels: Record<SpecKey, string> = {
  fabricType: "Fabric Type",
  weightGSM: "Weight (GSM)",
  color: "Color",
  MOQ: "Minimum Order Quantity",
  deliveryWindow: "Delivery Window",
  certifications: "Certifications",
  priceTarget: "Price Target",
  handFeelNotes: "Hand Feel Notes"
};

const certificationOptions = [
  "OEKO-TEX Standard 100",
  "GOTS (Global Organic Textile Standard)",
  "BCI (Better Cotton Initiative)",
  "Cradle to Cradle Certified",
  "REACH Compliance",
  "Bluesign Approved"
];

const moqOptions = ["300", "500", "1000", "Custom"];

export function prettyPrintSpecLabel(key: SpecKey): string {
  return specLabels[key] || key;
}

export function SpecChecklist({ specs, onConfirm }: SpecChecklistProps) {
  const [editingKey, setEditingKey] = useState<SpecKey | null>(null);
  const [editingValue, setEditingValue] = useState<any>("");
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const { toast } = useToast();

  const handleEdit = (key: SpecKey) => {
    setEditingKey(key);
    const currentValue = specs[key];
    
    if (key === "certifications" && Array.isArray(currentValue)) {
      setSelectedCertifications(currentValue);
      setEditingValue("");
    } else {
      setEditingValue(currentValue || "");
      if (key === "certifications") {
        setSelectedCertifications([]);
      }
    }
  };

  const handleSave = (key: SpecKey) => {
    let processedValue: any = editingValue;

    if (key === "weightGSM") {
      processedValue = parseInt(editingValue) || 0;
    } else if (key === "priceTarget") {
      processedValue = parseFloat(editingValue) || 0;
    } else if (key === "certifications") {
      processedValue = selectedCertifications;
    } else if (key === "MOQ" && editingValue !== "Custom") {
      processedValue = parseInt(editingValue) || 0;
    }

    onConfirm(key, processedValue);
    
    toast({
      title: "Specification Updated",
      description: `${specLabels[key]} has been updated successfully`,
    });

    setEditingKey(null);
    setEditingValue("");
    setSelectedCertifications([]);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingValue("");
    setSelectedCertifications([]);
  };

  const formatSpecValue = (key: SpecKey, value: any) => {
    if (!value && value !== 0) return "Not provided";
    
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Not provided";
    }
    if (key === "weightGSM") {
      return `${value} GSM`;
    }
    if (key === "priceTarget") {
      return `$${value}`;
    }
    return value?.toString() || "Not provided";
  };

  const renderEditField = (key: SpecKey) => {
    switch (key) {
      case "weightGSM":
        return (
          <Input
            type="number"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder="Enter weight in GSM"
            className="h-8"
            autoFocus
          />
        );
      
      case "priceTarget":
        return (
          <Input
            type="number"
            step="0.01"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder="Enter target price"
            className="h-8"
            autoFocus
          />
        );
      
      case "MOQ":
        return (
          <Select value={editingValue.toString()} onValueChange={setEditingValue}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select MOQ" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-md z-50">
              {moqOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "Custom" ? "Custom Amount" : `${option} units`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "certifications":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-center space-x-2">
                  <Checkbox
                    id={cert}
                    checked={selectedCertifications.includes(cert)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCertifications([...selectedCertifications, cert]);
                      } else {
                        setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
                      }
                    }}
                  />
                  <label htmlFor={cert} className="text-sm">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "handFeelNotes":
        return (
          <Textarea
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder="Describe texture and feel requirements"
            className="min-h-20"
            autoFocus
          />
        );
      
      default:
        return (
          <Input
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder={`Enter ${specLabels[key].toLowerCase()}`}
            className="h-8"
            autoFocus
          />
        );
    }
  };

  const renderField = (key: SpecKey, label: string) => {
    const isEditing = editingKey === key;
    const value = specs[key];
    const hasValue = value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0);

    return (
      <div className={`group relative p-4 border rounded-lg transition-all hover:border-primary/20 hover:bg-accent/5 ${hasValue ? 'bg-muted/10' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm mb-1">{label}</div>
            {isEditing ? (
              <div className="space-y-3">
                {renderEditField(key)}
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleSave(key)} className="h-7">
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="h-7">
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground min-h-5">
                {formatSpecValue(key, value)}
              </div>
            )}
          </div>
          
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-7"
              onClick={() => handleEdit(key)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Specifications</CardTitle>
        <CardDescription>
          Overview of key sourcing criteria for this opportunity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Sourcing Details */}
        <div>
          <h3 className="font-semibold text-base mb-4 text-foreground">Sourcing Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField("MOQ", "Minimum Order Quantity")}
            {renderField("deliveryWindow", "Delivery Window")}
            {renderField("priceTarget", "Price Target")}
          </div>
        </div>

        {/* Fabric Details */}
        <div>
          <h3 className="font-semibold text-base mb-4 text-foreground">Fabric Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderField("fabricType", "Fabric Type")}
            {renderField("weightGSM", "Weight (GSM)")}
            {renderField("color", "Color")}
          </div>
        </div>

        {/* Compliance */}
        <div>
          <h3 className="font-semibold text-base mb-4 text-foreground">Compliance</h3>
          <div className="grid grid-cols-1 gap-4">
            {renderField("certifications", "Certifications")}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="font-semibold text-base mb-4 text-foreground">Notes</h3>
          <div className="grid grid-cols-1 gap-4">
            {renderField("handFeelNotes", "Hand Feel Notes")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}