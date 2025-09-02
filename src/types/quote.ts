export type QuoteLine = {
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  labDipRequired?: boolean;
};

export type Quote = {
  id: string;
  selectionId: string;
  lines: QuoteLine[];
  validityDate: string;
  deliveryTerms: string;
  incoterms?: "EXW" | "FOB" | "CIF" | "DAP" | "DDP";
  total: number;
  status: "Draft" | "Sent";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};