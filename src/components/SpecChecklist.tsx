import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit3, CheckCircle, Circle } from "lucide-react";

export type SpecKey = "fabricType" | "weightGSM" | "color" | "MOQ" | "deliveryWindow" | "certifications" | "priceTarget" | "handFeelNotes";

export type SpecRecord = Partial<Record<SpecKey, any>>;

interface SpecChecklistProps {
  specs: SpecRecord;
  onConfirm: (key: SpecKey, value: any) => void;
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

const specDescriptions: Record<SpecKey, string> = {
  fabricType: "Type of fabric material required",
  weightGSM: "Fabric weight in grams per square meter",
  color: "Color specification or requirements",
  MOQ: "Minimum order quantity required",
  deliveryWindow: "Expected delivery timeframe",
  certifications: "Required certifications (OEKO-TEX, GOTS, etc.)",
  priceTarget: "Target price per unit or yard",
  handFeelNotes: "Texture and feel requirements"
};

const certificationOptions = [
  "OEKO-TEX Standard 100",
  "GOTS (Global Organic Textile Standard)",
  "BCI (Better Cotton Initiative)",
  "Cradle to Cradle Certified",
  "REACH Compliance",
  "Bluesign Approved"
];

export function prettyPrintSpecLabel(key: SpecKey): string {
  return specLabels[key] || key;
}

export function SpecChecklist({ specs, onConfirm }: SpecChecklistProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<SpecKey | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      value: ""
    }
  });

  const allSpecKeys: SpecKey[] = [
    "fabricType", "weightGSM", "color", "MOQ", 
    "deliveryWindow", "certifications", "priceTarget", "handFeelNotes"
  ];

  const missingSpecs = allSpecKeys.filter(key => 
    specs[key] === undefined || 
    specs[key] === "" || 
    (Array.isArray(specs[key]) && specs[key].length === 0)
  );

  const confirmedSpecs = allSpecKeys.filter(key => 
    specs[key] !== undefined && 
    specs[key] !== "" && 
    (!Array.isArray(specs[key]) || specs[key].length > 0)
  );

  const handleEdit = (key: SpecKey) => {
    setEditingKey(key);
    const currentValue = specs[key];
    
    if (Array.isArray(currentValue)) {
      form.setValue("value", currentValue.join(", "));
    } else {
      form.setValue("value", currentValue?.toString() || "");
    }
    
    setDialogOpen(true);
  };

  const handleSubmit = (formData: { value: string }) => {
    if (!editingKey) return;

    let processedValue: any = formData.value;

    // Process different field types
    if (editingKey === "weightGSM" || editingKey === "MOQ") {
      processedValue = parseInt(formData.value) || 0;
    } else if (editingKey === "priceTarget") {
      processedValue = parseFloat(formData.value) || 0;
    } else if (editingKey === "certifications") {
      processedValue = formData.value.split(",").map(cert => cert.trim()).filter(Boolean);
    }

    onConfirm(editingKey, processedValue);
    
    toast({
      title: "Spec Confirmed",
      description: `SPEC_FIELD_CONFIRMED: ${editingKey}`,
    });

    setDialogOpen(false);
    setEditingKey(null);
    form.reset();
  };

  const renderFormField = (key: SpecKey) => {
    switch (key) {
      case "weightGSM":
      case "MOQ":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{specLabels[key]}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case "priceTarget":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{specLabels[key]}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case "handFeelNotes":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{specLabels[key]}</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe texture and feel requirements" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case "certifications":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{specLabels[key]}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter certifications separated by commas" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{specLabels[key]}</FormLabel>
                <FormControl>
                  <Input placeholder="Enter value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  const formatSpecValue = (key: SpecKey, value: any) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (key === "weightGSM") {
      return `${value} GSM`;
    }
    if (key === "priceTarget") {
      return `$${value}`;
    }
    return value?.toString() || "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Specification Checklist
        </CardTitle>
        <CardDescription>
          Track and confirm all required specifications for this opportunity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Missing Specs */}
        {missingSpecs.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">
              Missing Specifications ({missingSpecs.length})
            </h4>
            <div className="space-y-2">
              {missingSpecs.map((key) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Circle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{specLabels[key]}</div>
                      <div className="text-xs text-muted-foreground">{specDescriptions[key]}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(key)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Specs */}
        {confirmedSpecs.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">
              Confirmed Specifications ({confirmedSpecs.length})
            </h4>
            <div className="space-y-2">
              {confirmedSpecs.map((key) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">{specLabels[key]}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatSpecValue(key, specs[key])}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(key)}>
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialog for editing */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingKey && (confirmedSpecs.includes(editingKey) ? "Edit" : "Add")} {editingKey && specLabels[editingKey]}
              </DialogTitle>
              <DialogDescription>
                {editingKey && specDescriptions[editingKey]}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {editingKey && renderFormField(editingKey)}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Confirm
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}