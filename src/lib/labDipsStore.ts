import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface LabDip {
  id: string;
  article: string;
  colorRef: string;
  status: "Requested" | "Sent" | "Approved";
}

interface LabDipsContextType {
  labDips: LabDip[];
  addLabDips: (newDips: LabDip[]) => void;
  updateLabDipStatus: (id: string, newStatus: LabDip["status"]) => void;
}

const LabDipsContext = createContext<LabDipsContextType | undefined>(undefined);

const initialLabDips: LabDip[] = [
  { id: "LD-001", article: "Organic Cotton Tee", colorRef: "Forest Green #2E7D32", status: "Requested" },
  { id: "LD-002", article: "Silk Blouse", colorRef: "Navy Blue #1565C0", status: "Requested" },
  { id: "LD-003", article: "Linen Pants", colorRef: "Warm Beige #8D6E63", status: "Requested" },
  { id: "LD-004", article: "Cotton Hoodie", colorRef: "Charcoal Gray #424242", status: "Sent" },
  { id: "LD-005", article: "Denim Jacket", colorRef: "Indigo Blue #303F9F", status: "Sent" },
  { id: "LD-006", article: "Wool Sweater", colorRef: "Burgundy #880E4F", status: "Sent" },
  { id: "LD-007", article: "Canvas Shorts", colorRef: "Olive Green #689F38", status: "Approved" },
  { id: "LD-008", article: "Silk Scarf", colorRef: "Rose Pink #E91E63", status: "Approved" },
  { id: "LD-009", article: "Cotton Dress", colorRef: "Sky Blue #03A9F4", status: "Approved" },
];

export function LabDipsProvider({ children }: { children: ReactNode }) {
  const [labDips, setLabDips] = useState<LabDip[]>(initialLabDips);

  const addLabDips = (newDips: LabDip[]) => {
    setLabDips(prev => [...prev, ...newDips]);
  };

  const updateLabDipStatus = (id: string, newStatus: LabDip["status"]) => {
    setLabDips(prev => 
      prev.map(dip => 
        dip.id === id ? { ...dip, status: newStatus } : dip
      )
    );
  };

  return (
    <LabDipsContext.Provider value={{ labDips, addLabDips, updateLabDipStatus }}>
      {children}
    </LabDipsContext.Provider>
  );
}

export function useLabDips() {
  const context = useContext(LabDipsContext);
  if (context === undefined) {
    throw new Error('useLabDips must be used within a LabDipsProvider');
  }
  return context;
}