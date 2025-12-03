'use client'

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { CalculatorResult, SelectedFurniture } from '../types';
import ChoiceStep from '@/components/calculator/choiceStep';
import SquareMetersStep from '@/components/calculator/squareMetersStep';
import FurnitureStep from '@/components/calculator/furnitureStep';
import { FURNITURE_ITEMS, LOCATION_OPTIONS, PROPERTY_TYPE_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../data';

const STEPS_CONFIG = [
  { id: 1, title: "Qual o tipo?", desc: "Selecione o tipo de propriedade", options: PROPERTY_TYPE_OPTIONS },
  { id: 2, title: "Qual o objetivo?", desc: "Aluguel ou compra?", options: TRANSACTION_TYPE_OPTIONS },
  { id: 3, title: "Onde será?", desc: "Selecione a região aproximada", options: LOCATION_OPTIONS },
  { id: 4, title: "Metragem", desc: "Tamanho do imóvel" },
  { id: 5, title: "Móveis", desc: "Seleção de itens" }
];

interface Answers {
  propertyType: number | null;
  transactionType: number | null;
  location: number | null;
}

export default function MovingCalculator() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  
  // Estado Unificado
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>({
    propertyType: null,
    transactionType: null,
    location: null,
  });
  const [squareMeters, setSquareMeters] = useState<number>(50);
  const [selectedFurniture, setSelectedFurniture] = useState<SelectedFurniture>({});

  const handleNextStep = useCallback(async () => {
    // Validações
    if (currentStep === 4 && squareMeters <= 0) {
      alert("Por favor, informe uma metragem válida");
      return;
    }

    // Persistência das respostas dos passos 1, 2 e 3
    if (currentStep <= 3 && selectedOptionId !== null) {
      setAnswers(prev => ({
        ...prev,
        propertyType: currentStep === 1 ? selectedOptionId : prev.propertyType,
        transactionType: currentStep === 2 ? selectedOptionId : prev.transactionType,
        location: currentStep === 3 ? selectedOptionId : prev.location,
      }));
    }

    // FINALIZAÇÃO (Passo 5)
    if (currentStep === 5) {
      setLoading(true);

      const selectedItems = FURNITURE_ITEMS.filter(item => selectedFurniture[item.id]);
      const totalFurniture = selectedItems.reduce((sum, item) => sum + item.price, 0);

      // Resolvendo IDs para Texto
      const propertyType = PROPERTY_TYPE_OPTIONS.find(opt => opt.id === answers.propertyType)?.title || "Não informado";
      const transactionType = TRANSACTION_TYPE_OPTIONS.find(opt => opt.id === answers.transactionType)?.title || "Não informado";
      const location = LOCATION_OPTIONS.find(opt => opt.id === answers.location)?.title || "Não informado";

      const payloadForAI = {
        propertyTypeId: answers.propertyType,
        propertyType,
        transactionTypeId: answers.transactionType,
        transactionType,
        locationId: answers.location,
        location,
        squareMeters,
        selectedItems: selectedItems.map(i => ({ id: i.id, name: i.name, price: i.price, category: i.category })),
        totalFurniture
      };

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userData: payloadForAI })
        });

        const aiData = await res.json();

        const finalResult: CalculatorResult = {
          total: totalFurniture,
          monthsToSave: 12,
          selectedItems,
          propertyType,
          transactionType,
          location: `${location} (${LOCATION_OPTIONS.find(opt => opt.title === location)?.description || ""})`,
          squareMeters,
          aiData: {
            aiText: aiData.aiText,
            aiJson: aiData.aiJson,
            meta: aiData.meta,
            incomplete: aiData.incomplete
          }
        };

        localStorage.setItem('calculatorResult', JSON.stringify(finalResult));
        router.push('/calculator/results');
      } catch (err) {
        console.error('Erro enviando para IA:', err);
        alert('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Avançar passo normal
    if (selectedOptionId !== null || currentStep === 4) {
      setCurrentStep(prev => prev + 1);
      setSelectedOptionId(null);
    }
  }, [currentStep, selectedOptionId, squareMeters, selectedFurniture, answers, router]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      // Lógica de restauração visual ao voltar
      const prevStep = currentStep - 1;
      let savedOption = null;
      if (prevStep === 1) savedOption = answers.propertyType;
      if (prevStep === 2) savedOption = answers.transactionType;
      if (prevStep === 3) savedOption = answers.location;
      
      setSelectedOptionId(savedOption);
      setCurrentStep(prevStep);
    }
  }, [currentStep, answers]);

  const toggleFurnitureItem = (id: number) => {
    setSelectedFurniture(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStepContent = () => {
    const config = STEPS_CONFIG[currentStep - 1];

    switch (currentStep) {
      case 1:
      case 2:
      case 3:
        return (
          <ChoiceStep 
            title={config.title}
            description={config.desc}
            options={config.options || []} 
            selectedOptionId={selectedOptionId} 
            setSelectedOptionId={setSelectedOptionId} 
          />
        );
      case 4:
        return <SquareMetersStep squareMeters={squareMeters} setSquareMeters={setSquareMeters} />;
      case 5:
        return (
          <FurnitureStep 
            furnitureItems={FURNITURE_ITEMS} 
            selectedFurniture={selectedFurniture} 
            toggleFurnitureItem={toggleFurnitureItem} 
          />
        );
      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    if (currentStep <= 3) return selectedOptionId === null;
    if (currentStep === 4) return squareMeters <= 0;
    if (currentStep === 5) {
      const selectedCount = Object.values(selectedFurniture).filter(Boolean).length;
      return selectedCount === 0 || loading;
    }
    return false;
  };

  // Cálculo de progresso para a barra
  const progressPercentage = (currentStep / STEPS_CONFIG.length) * 100;

  return (
    <>
      {/* HEADER DE PROGRESSO */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-indigo-600">
              Passo {currentStep} de {STEPS_CONFIG.length}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {STEPS_CONFIG[currentStep - 1].title}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-indigo-600 transition-all duration-500 ease-out"
               style={{ width: `${progressPercentage}%` }}
             />
          </div>
        </div>
      </div>

      {renderStepContent()}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button 
            onClick={handlePreviousStep} 
            disabled={currentStep === 1 || loading}
            className="p-button-text font-bold text-gray-500 hover:text-gray-800"
            label="Voltar"
            text
          />
          
          <Button 
            onClick={handleNextStep} 
            disabled={isNextButtonDisabled()}
            loading={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 border-none font-bold shadow-lg shadow-indigo-200"
            label={currentStep === 5 ? 'Finalizar e Calcular' : 'Continuar'}
            icon={currentStep !== 5 ? "pi pi-arrow-right" : "pi pi-check"}
            iconPos="right"
          />
        </div>
      </div>
    </>
  );
}