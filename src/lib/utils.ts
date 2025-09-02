import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (n: number, currency = "USD") => 
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n ?? 0);

export const formatDate = (iso?: string) => 
  iso ? new Date(iso).toLocaleDateString() : "—";
