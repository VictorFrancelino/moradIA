import { Slider } from 'primereact/slider';
import { Home } from 'lucide-react';

interface SquareMetersStepProps {
  squareMeters: number;
  setSquareMeters: (value: number) => void;
}

export default function SquareMetersStep({ 
  squareMeters, 
  setSquareMeters 
}: SquareMetersStepProps) {

  // Helper para feedback visual do tamanho
  const getSizeLabel = (size: number) => {
    if (size < 40) return { label: "Compacto (Studio/Kitnet)", color: "text-blue-500" };
    if (size < 80) return { label: "Padrão (Apto 2 quartos)", color: "text-green-500" };
    if (size < 120) return { label: "Confortável (Apto 3 quartos/Casa)", color: "text-orange-500" };
    return { label: "Amplo (Casa grande/Cobertura)", color: "text-purple-500" };
  };

  const sizeInfo = getSizeLabel(squareMeters);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className='space-y-2 text-center md:text-left'>
        <h2 className='font-bold text-3xl md:text-4xl text-gray-950'>Qual a metragem?</h2>
        <p className='text-gray-600 text-lg'>Isso ajuda a IA a estimar a quantidade de móveis e custos de reforma.</p>
      </div>
      
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center space-y-8">
          
          <div className="relative">
            <Home size={200} strokeWidth={1} className="text-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center mt-4">
               <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                {squareMeters}<span className="text-2xl text-gray-400">m²</span>
              </span>
            </div>
          </div>

          <div className={`font-medium ${sizeInfo.color} bg-gray-50 px-4 py-2 rounded-full`}>
            {sizeInfo.label}
          </div>

          <div className="w-full px-4">
            <Slider 
              value={squareMeters} 
              onChange={(e) => setSquareMeters(e.value as number)}
              min={20} 
              max={200} 
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex justify-between w-full text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>20m²</span>
            <span>200m² +</span>
          </div>
        </div>
      </div>
    </div>
  );
}