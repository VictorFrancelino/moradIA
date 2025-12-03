import { FurnitureItem, StepOption } from "@/app/types";
import { House, Building2, Maximize2 } from "lucide-react"
import { KeyRound, DollarSign } from "lucide-react";

export const TRANSACTION_TYPE_OPTIONS: StepOption[] = [
  { id: 1, icon: KeyRound, title: 'Aluguel', description: 'Você quer alugar o imóvel' },
  { id: 2, icon: DollarSign, title: 'Compra', description: 'Você quer comprar o imóvel' },
];

export const PROPERTY_TYPE_OPTIONS: StepOption[] = [
  { id: 1, icon: House, title: 'Casa', description: 'Casa térrea ou sobrado' },
  { id: 2, icon: Building2, title: 'Apartamento', description: 'Apartamento em prédio' },
  { id: 3, icon: Maximize2, title: 'Kitnet', description: 'Estúdio ou kitnet' },
];

export const LOCATION_OPTIONS: StepOption[] = [
  { id: 1, title: 'Manaus', description: 'AM' },
  { id: 2, title: 'São Paulo', description: 'SP' },
  { id: 3, title: 'Rio de Janeiro', description: 'RJ' },
  { id: 4, title: 'Belo Horizonte', description: 'MG' },
  { id: 5, title: 'Porto Alegre', description: 'RS' },
];

export const FURNITURE_ITEMS: FurnitureItem[] = [
  // Banheiro
  { id: 1, name: 'Chuveiro Elétrico', description: 'Chuveiro 7500W com ducha', price: 250, category: 'bathroom' },
  { id: 2, name: 'Vaso Sanitário', description: 'Vaso com caixa acoplada', price: 450, category: 'bathroom' },
  { id: 3, name: 'Pia de Banheiro', description: 'Pia em mármore com torneira', price: 320, category: 'bathroom' },
  { id: 4, name: 'Espelho Iluminado', description: 'Espelho com LED integrado', price: 180, category: 'bathroom' },
  { id: 5, name: 'Armário Medicina', description: 'Armário com espelho', price: 290, category: 'bathroom' },
  { id: 6, name: 'Box de Vidro', description: 'Box para banheiro 90x90', price: 850, category: 'bathroom' },
  
  // Cozinha
  { id: 7, name: 'Fogão 4 Bocas', description: 'Fogão inox com forno', price: 1200, category: 'kitchen' },
  { id: 8, name: 'Geladeira Frost Free', description: 'Geladeira 375L duplex', price: 2800, category: 'kitchen' },
  { id: 9, name: 'Micro-ondas', description: 'Micro-ondas 31L', price: 450, category: 'kitchen' },
  { id: 10, name: 'Máquina de Lavar', description: 'Máquina 12kg', price: 1900, category: 'kitchen' },
  { id: 11, name: 'Pia de Cozinha', description: 'Pia inox 1.5m', price: 680, category: 'kitchen' },
  { id: 12, name: 'Cooktop', description: 'Cooktop 4 bocas', price: 750, category: 'kitchen' },
  
  // Geral
  { id: 13, name: 'Ar Condicionado', description: 'Split 9000 BTUs', price: 2200, category: 'general' },
  { id: 14, name: 'Ventilador de Teto', description: 'Ventilador com luz', price: 320, category: 'general' },
  { id: 15, name: 'Cortinas', description: 'Cortinas blackout', price: 280, category: 'general' },
  { id: 16, name: 'Persianas', description: 'Persianas em alumínio', price: 420, category: 'general' },
  { id: 17, name: 'Tapete', description: 'Tapete persa 2x3m', price: 350, category: 'general' },
  { id: 18, name: 'Quadros Decorativos', description: 'Conjunto com 3 quadros', price: 190, category: 'general' },
  
  // Quarto
  { id: 19, name: 'Cama Box', description: 'Cama de casal 1.38x1.88', price: 1500, category: 'bedroom' },
  { id: 20, name: 'Guarda-Roupa', description: 'Guarda-roupa 6 portas', price: 2100, category: 'bedroom' },
  { id: 21, name: 'Cômoda', description: 'Cômoda 5 gavetas', price: 890, category: 'bedroom' },
  { id: 22, name: 'Mesa de Cabeceira', description: 'Par de mesas', price: 450, category: 'bedroom' },
  { id: 23, name: 'Abajur', description: 'Abajur de LED', price: 120, category: 'bedroom' },
  { id: 24, name: 'Espelho de Corpo', description: 'Espelho 1.80m', price: 380, category: 'bedroom' },
  
  // Sala
  { id: 25, name: 'Sofá 3 Lugares', description: 'Sofá em couro sintético', price: 2400, category: 'living-room' },
  { id: 26, name: 'TV 50"', description: 'Smart TV 4K', price: 3200, category: 'living-room' },
  { id: 27, name: 'Rack para TV', description: 'Rack em MDF', price: 680, category: 'living-room' },
  { id: 28, name: 'Mesa de Centro', description: 'Mesa em vidro temperado', price: 550, category: 'living-room' },
  { id: 29, name: 'Poltrona', description: 'Poltrona reclinável', price: 850, category: 'living-room' },
  { id: 30, name: 'Estante para Livros', description: 'Estante 1.80m', price: 720, category: 'living-room' },
];