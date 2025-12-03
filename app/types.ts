import { LucideIcon } from "lucide-react";

export interface StepOption {
  id: number;
  icon?: LucideIcon;
  title: string;
  description: string;
}

export interface FurnitureItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'bathroom' | 'kitchen' | 'general' | 'bedroom' | 'living-room';
}

export interface SelectedFurniture {
  [key: number]: boolean;
}

export interface CalculatorResult {
  propertyType: string;
  transactionType: string;
  location: string;
  squareMeters: number;
  selectedItems: FurnitureItem[];
  total: number;
  monthsToSave: number;
  aiData?: {
    aiText: string;
    aiJson: any;
    meta: any;
    incomplete: boolean;
  };
}