import { FurnitureItem } from '@/app/types';
import { Sofa, Bath, ChefHat, Box, Bed, Check } from 'lucide-react';

interface FurnitureStepProps {
  furnitureItems: FurnitureItem[];
  selectedFurniture: { [key: number]: boolean };
  toggleFurnitureItem: (id: number) => void;
}

const furnitureCategories = [
  { id: 'living-room', name: 'Sala de Estar', icon: Sofa },
  { id: 'bedroom', name: 'Quarto', icon: Bed },
  { id: 'kitchen', name: 'Cozinha', icon: ChefHat },
  { id: 'bathroom', name: 'Banheiro', icon: Bath },
  { id: 'general', name: 'Geral / Outros', icon: Box },
];

export default function FurnitureStep({ 
  furnitureItems, 
  selectedFurniture, 
  toggleFurnitureItem 
}: FurnitureStepProps) {
  
  const totalValue = furnitureItems
    .filter(item => selectedFurniture[item.id])
    .reduce((sum, item) => sum + item.price, 0);

  const totalItems = Object.values(selectedFurniture).filter(Boolean).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className='space-y-2 text-center md:text-left'>
        <h2 className='font-bold text-3xl md:text-4xl text-gray-950'>Móveis e Eletros</h2>
        <p className='text-gray-600 text-lg'>Selecione o que você precisa comprar (estimativa média).</p>
      </div>

      <div className="space-y-12">
        {furnitureCategories.map(category => {
          const Icon = category.icon;
          const categoryItems = furnitureItems.filter(item => item.category === category.id);
          
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Icon size={20} />
                </div>
                <h4 className="text-xl font-bold text-gray-800">{category.name}</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map(item => {
                   const isSelected = selectedFurniture[item.id];
                   return (
                    <div 
                      key={item.id}
                      className={`
                        group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                        ${isSelected 
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                          : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'}
                      `}
                      onClick={() => toggleFurnitureItem(item.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>{item.name}</h5>
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-indigo-500' : 'bg-gray-200 group-hover:bg-gray-300'}
                        `}>
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 min-h-[2.5em]">{item.description}</p>
                      <div className="font-bold text-gray-900">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}