import { useState } from 'react';

export interface LabDip {
  id: string;
  article: string;
  colorRef: string;
  status: "Requested" | "Sent" | "Approved";
}

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

// Simple global state using a module-level variable (temporary solution)
let globalLabDips: LabDip[] = [...initialLabDips];
const subscribers: Array<(dips: LabDip[]) => void> = [];

export function useLabDipsData() {
  const [labDips, setLabDips] = useState<LabDip[]>(globalLabDips);

  // Subscribe to global changes
  useState(() => {
    const unsubscribe = () => {
      const index = subscribers.indexOf(setLabDips);
      if (index > -1) subscribers.splice(index, 1);
    };
    
    subscribers.push(setLabDips);
    return unsubscribe;
  });

  const addLabDips = (newDips: LabDip[]) => {
    globalLabDips = [...globalLabDips, ...newDips];
    subscribers.forEach(subscriber => subscriber([...globalLabDips]));
  };

  const updateLabDipStatus = (id: string, newStatus: LabDip["status"]) => {
    globalLabDips = globalLabDips.map(dip => 
      dip.id === id ? { ...dip, status: newStatus } : dip
    );
    subscribers.forEach(subscriber => subscriber([...globalLabDips]));
  };

  return {
    labDips,
    addLabDips,
    updateLabDipStatus
  };
}