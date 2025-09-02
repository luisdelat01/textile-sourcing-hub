import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { X, Filter } from "lucide-react";

export interface CatalogFilters {
  fabricType: string;
  weightMin: number;
  weightMax: number;
  moqMax: number;
  certifications: string[];
}

interface CatalogFilterProps {
  onFiltersChange: (filters: CatalogFilters) => void;
}

const fabricTypes = [
  "All Types",
  "Cotton",
  "Polyester", 
  "Linen",
  "Silk",
  "Wool",
  "Bamboo",
  "Modal",
  "Tencel"
];

const certificationOptions = [
  "OEKO-TEX Standard 100",
  "GOTS (Global Organic Textile Standard)",
  "BCI (Better Cotton Initiative)",
  "Cradle to Cradle Certified",
  "REACH Compliance",
  "Bluesign Approved"
];

export function CatalogFilter({ onFiltersChange }: CatalogFilterProps) {
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [tempCertification, setTempCertification] = useState("");

  const form = useForm<CatalogFilters>({
    defaultValues: {
      fabricType: "All Types",
      weightMin: 0,
      weightMax: 500,
      moqMax: 10000,
      certifications: []
    }
  });

  const watchedValues = form.watch();

  const handleFiltersChange = () => {
    const filters = {
      ...watchedValues,
      certifications: selectedCertifications
    };
    onFiltersChange(filters);
  };

  const addCertification = () => {
    if (tempCertification && !selectedCertifications.includes(tempCertification)) {
      const newCerts = [...selectedCertifications, tempCertification];
      setSelectedCertifications(newCerts);
      setTempCertification("");
      setTimeout(handleFiltersChange, 0);
    }
  };

  const removeCertification = (cert: string) => {
    const newCerts = selectedCertifications.filter(c => c !== cert);
    setSelectedCertifications(newCerts);
    setTimeout(handleFiltersChange, 0);
  };

  // Trigger filter change when form values change
  React.useEffect(() => {
    handleFiltersChange();
  }, [watchedValues]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Catalog Filters
        </CardTitle>
        <CardDescription>
          Filter products by specifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <div className="space-y-4">
            {/* Fabric Type */}
            <FormField
              control={form.control}
              name="fabricType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fabric Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fabricTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight Range */}
            <div className="space-y-2">
              <FormLabel>Weight Range (GSM)</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="weightMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Min" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Max" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 500)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* MOQ */}
            <FormField
              control={form.control}
              name="moqMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum MOQ</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter max MOQ" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 10000)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certifications */}
            <div className="space-y-3">
              <FormLabel>Certifications</FormLabel>
              <div className="flex gap-2">
                <Select value={tempCertification} onValueChange={setTempCertification}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select certification" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationOptions.map((cert) => (
                      <SelectItem key={cert} value={cert}>
                        {cert}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addCertification} size="sm">
                  Add
                </Button>
              </div>
              
              {selectedCertifications.length > 0 && (
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
              )}
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}