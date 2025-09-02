import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit3, CheckCircle, Circle, X } from "lucide-react";

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

const specHelpers: Record<SpecKey, string> = {
  fabricType: "e.g., Cotton, Polyester, Linen blend",
  weightGSM: "Grams per square meter (typical range: 100-300)",
  color: "Color name, hex code, or Pantone reference",
  MOQ: "Minimum quantity to place an order",
  deliveryWindow: "Expected timeframe for delivery",
  certifications: "Select all applicable certifications",
  priceTarget: "Target price per unit in USD",
  handFeelNotes: "Describe the desired texture and feel"
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

export function SpecChecklist({ specs, onConfirm, onUndo }: SpecChecklistProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<SpecKey | null>(null);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      value: "",
      certification: ""
    }
  });

  // Focus first input when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        const firstInput = document.querySelector('input[name="value"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [dialogOpen]);

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
    
    if (key === "certifications" && Array.isArray(currentValue)) {
      setSelectedCertifications(currentValue);
      form.setValue("value", "");
    } else if (Array.isArray(currentValue)) {
      form.setValue("value", currentValue.join(", "));
    } else {
      form.setValue("value", currentValue?.toString() || "");
    }
    
    setDialogOpen(true);
  };

  const handleSubmit = (formData: { value: string; certification: string }) => {
    if (!editingKey) return;

    let processedValue: any = formData.value;

    // Process different field types
    if (editingKey === "weightGSM" || editingKey === "MOQ") {
      processedValue = parseInt(formData.value) || 0;
    } else if (editingKey === "priceTarget") {
      processedValue = parseFloat(formData.value) || 0;
    } else if (editingKey === "certifications") {
      processedValue = selectedCertifications;
    }

    const wasNewSpec = specs[editingKey] === undefined || 
      specs[editingKey] === "" || 
      (Array.isArray(specs[editingKey]) && specs[editingKey].length === 0);

    onConfirm(editingKey, processedValue);
    
    const action = wasNewSpec ? "Added" : "Updated";
    toast({
      title: `${action} ${specLabels[editingKey]}`,
      description: `Successfully ${action.toLowerCase()} specification`,
      action: onUndo ? (
        <Button variant="outline" size="sm" onClick={onUndo}>
          Undo
        </Button>
      ) : undefined,
    });

    setDialogOpen(false);
    setEditingKey(null);
    setSelectedCertifications([]);
    form.reset();
  };

  const addCertification = () => {
    const newCert = form.getValues("certification");
    if (newCert && !selectedCertifications.includes(newCert)) {
      setSelectedCertifications([...selectedCertifications, newCert]);
      form.setValue("certification", "");
    }
  };

  const removeCertification = (cert: string) => {
    setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
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
                <FormDescription>{specHelpers[key]}</FormDescription>
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
                <FormDescription>{specHelpers[key]}</FormDescription>
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
                <FormDescription>{specHelpers[key]}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case "certifications":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="certification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{specLabels[key]}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a certification" />
                        </SelectTrigger>
                        <SelectContent>
                          {certificationOptions.map((cert) => (
                            <SelectItem key={cert} value={cert}>
                              {cert}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Button type="button" onClick={addCertification} size="sm">
                      Add
                    </Button>
                  </div>
                  <FormDescription>{specHelpers[key]}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedCertifications.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Certifications:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCertifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeCertification(cert)}
                        aria-label={`Remove ${cert}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                <FormDescription>{specHelpers[key]}</FormDescription>
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(key)}
                    aria-label={`Add ${specLabels[key]}`}
                  >
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
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEdit(key)}
                    aria-label={`Edit ${specLabels[key]}`}
                  >
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