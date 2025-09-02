import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { CatalogFilter, CatalogFilters } from "@/components/CatalogFilter";
import { SelectionTable, Selection, SelectionItem } from "@/components/SelectionTable";

// Mock catalog data
interface CatalogProduct {
  id: string;
  product: string;
  fabricType: string;
  weight: number;
  unit: string;
  moq: number;
  leadTime: string;
  certifications: string[];
  basePrice: number;
}

const mockCatalog: CatalogProduct[] = [
  {
    id: "1",
    product: "Premium Cotton Poplin",
    fabricType: "Cotton",
    weight: 120,
    unit: "yard",
    moq: 500,
    leadTime: "4-6 weeks",
    certifications: ["OEKO-TEX Standard 100", "GOTS (Global Organic Textile Standard)"],
    basePrice: 8.50
  },
  {
    id: "2", 
    product: "Stretch Poly Blend",
    fabricType: "Polyester",
    weight: 180,
    unit: "yard",
    moq: 1000,
    leadTime: "3-4 weeks",
    certifications: ["OEKO-TEX Standard 100"],
    basePrice: 6.25
  },
  {
    id: "3",
    product: "Organic Linen Canvas",
    fabricType: "Linen",
    weight: 200,
    unit: "meter",
    moq: 300,
    leadTime: "6-8 weeks",
    certifications: ["GOTS (Global Organic Textile Standard)", "Cradle to Cradle Certified"],
    basePrice: 12.75
  },
  {
    id: "4",
    product: "Mulberry Silk Charmeuse",
    fabricType: "Silk",
    weight: 95,
    unit: "yard",
    moq: 200,
    leadTime: "8-10 weeks",
    certifications: ["OEKO-TEX Standard 100"],
    basePrice: 28.90
  },
  {
    id: "5",
    product: "Merino Wool Jersey",
    fabricType: "Wool",
    weight: 160,
    unit: "yard",
    moq: 400,
    leadTime: "5-7 weeks",
    certifications: ["OEKO-TEX Standard 100", "REACH Compliance"],
    basePrice: 18.45
  }
];

export default function SelectionBuilder() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<CatalogFilters>({
    fabricType: "All Types",
    weightMin: 0,
    weightMax: 500,
    moqMax: 10000,
    certifications: []
  });

  const [activeSelection, setActiveSelection] = useState<Selection>({
    id: "sel-001",
    name: "FW26 Development Selection",
    version: 1,
    items: [
      {
        id: "item-1",
        product: "Premium Cotton Poplin",
        unit: "yard",
        volumeTiers: [
          { minQty: 500, price: 8.50 },
          { minQty: 1000, price: 7.95 },
          { minQty: 2500, price: 7.25 }
        ],
        adjustments: "Custom dye lot",
        quoteStatus: "pending",
        sampleStatus: "sent",
        buyerFeedback: "Good quality, need darker shade",
        dropped: false
      }
    ],
    createdAt: new Date(),
    notes: "Initial selection for FW26 collection"
  });

  // Filter catalog products
  const filteredProducts = useMemo(() => {
    return mockCatalog.filter(product => {
      // Fabric type filter
      if (filters.fabricType !== "All Types" && product.fabricType !== filters.fabricType) {
        return false;
      }
      
      // Weight range filter
      if (product.weight < filters.weightMin || product.weight > filters.weightMax) {
        return false;
      }
      
      // MOQ filter
      if (product.moq > filters.moqMax) {
        return false;
      }
      
      // Certifications filter
      if (filters.certifications.length > 0) {
        const hasAllCerts = filters.certifications.every(cert => 
          product.certifications.includes(cert)
        );
        if (!hasAllCerts) {
          return false;
        }
      }
      
      return true;
    });
  }, [filters]);

  const handleAddToSelection = (product: CatalogProduct) => {
    const newItem: SelectionItem = {
      id: `item-${Date.now()}`,
      product: product.product,
      unit: product.unit,
      volumeTiers: [
        { minQty: product.moq, price: product.basePrice },
        { minQty: product.moq * 2, price: product.basePrice * 0.95 },
        { minQty: product.moq * 5, price: product.basePrice * 0.88 }
      ],
      adjustments: "",
      quoteStatus: "pending",
      sampleStatus: "not_sent",
      buyerFeedback: "",
      dropped: false
    };

    setActiveSelection(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    toast({
      title: "Product Added",
      description: `${product.product} added to selection`,
    });
  };

  const handleDuplicateVersion = () => {
    const newVersion = activeSelection.version + 1;
    const timestamp = new Date().toLocaleString();
    
    setActiveSelection(prev => ({
      ...prev,
      version: newVersion,
      createdAt: new Date(),
      notes: `Duplicated from v${prev.version} on ${timestamp}`,
      items: prev.items.map(item => ({ ...item, id: `${item.id}-v${newVersion}` }))
    }));

    toast({
      title: "Version Duplicated",
      description: `Created ${activeSelection.name} v${newVersion}`,
    });
  };

  const handleSendSamples = (logistics: any) => {
    console.log("SAMPLES_SENT:", logistics);
    toast({
      title: "Samples Sent",
      description: `Sample logistics recorded for ${logistics.courier}`,
    });
  };

  const handleUpdateItem = (itemId: string, updates: Partial<SelectionItem>) => {
    setActiveSelection(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setActiveSelection(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
    
    toast({
      title: "Item Removed",
      description: "Product removed from selection",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Selection Builder</h1>
        <p className="text-muted-foreground">
          Browse catalog products and build custom selections for opportunities
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Catalog Filter */}
        <div className="lg:col-span-1">
          <CatalogFilter onFiltersChange={setFilters} />
        </div>

        {/* Right: Results Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Catalog Results</CardTitle>
              <CardDescription>
                {filteredProducts.length} products match your filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>MOQ</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.product}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.fabricType} • {product.weight} GSM
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>{product.moq.toLocaleString()}</TableCell>
                        <TableCell>{product.leadTime}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.certifications.slice(0, 2).map((cert) => (
                              <Badge key={cert} variant="outline" className="text-xs">
                                {cert.split(" ")[0]}
                              </Badge>
                            ))}
                            {product.certifications.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.certifications.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleAddToSelection(product)}
                            aria-label={`Add ${product.product} to selection`}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No products match your current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: Active Selection */}
      <SelectionTable
        selection={activeSelection}
        onDuplicateVersion={handleDuplicateVersion}
        onSendSamples={handleSendSamples}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}