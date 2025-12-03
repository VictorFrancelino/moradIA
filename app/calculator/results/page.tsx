'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import { TrendingUp, Calendar, DollarSign, Bath, ChefHat, Box, Bed, Sofa, Home, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { CalculatorResult } from '@/app/types';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [monthsToSave, setMonthsToSave] = useState(12);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiJson, setAiJson] = useState<Record<string, any> | null>(null);
  
  // Utilitário para formatar moeda
  function formatCurrency(value: any) {
    if (value == null) return '—';
    const num = typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : Number(value);
    if (Number.isNaN(num)) return '—';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  useEffect(() => {
    const savedResult = localStorage.getItem('calculatorResult');
    if (savedResult) {
      try {
        const parsedResult: CalculatorResult = JSON.parse(savedResult);
        setResult(parsedResult);
        setMonthsToSave(Math.max(1, parsedResult.monthsToSave || 12));

        if (parsedResult.aiData) {
          const { aiText, aiJson } = parsedResult.aiData;
          
          if (aiJson) {
            setAiJson(aiJson);
            if (aiText) {
              const textWithoutJson = aiText.replace(/```json[\s\S]*?```/i, '').trim();
              setAiSummary(textWithoutJson || aiText);
            }
          } else if (aiText) {
            // Fallback para tentar extrair JSON se não vier estruturado
            const extractJsonFromText = (text: string) => {
              const jsonMatch = text.match(/(\{[\s\S]*\})/);
              if (!jsonMatch) return null;
              try {
                return JSON.parse(jsonMatch[1]);
              } catch {
                try {
                  const cleaned = jsonMatch[1].replace(/,\s*}$/, '}');
                  return JSON.parse(cleaned);
                } catch {
                  return null;
                }
              }
            };
            
            const json = extractJsonFromText(aiText);
            if (json) {
              setAiJson(json);
              const textWithoutJson = aiText.replace(/```json[\s\S]*?```/i, '').trim();
              setAiSummary(textWithoutJson || aiText);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
      }
    }
  }, []);
  
  // Calcular o total combinado
  const combinedTotal = useMemo(() => {
    if (!result) return 0;
    
    // Se não tiver aiJson, retorna só os móveis
    if (!aiJson) return result.total;
    
    const transactionLower = result.transactionType.toLowerCase();
    
    if (transactionLower.includes('compra') || transactionLower.includes('comprar')) {
      const propertyValue = aiJson.property_estimate || 0;
      return propertyValue + result.total;
    } else if (transactionLower.includes('aluguel') || transactionLower.includes('alugar')) {
      const upfrontCost = aiJson.total_upfront || 0;
      return upfrontCost;
    }
    
    return result.total;
  }, [result, aiJson]);

  const monthlySavings = combinedTotal / monthsToSave;
  
  const categories = ['bathroom', 'kitchen', 'general', 'bedroom', 'living-room'] as const;
  const categoryIcons = {
    'bathroom': Bath,
    'kitchen': ChefHat,
    'general': Box,
    'bedroom': Bed,
    'living-room': Sofa,
    'property': Home,
    'rent': KeyRound,
  };
  const categoryLabels = {
    'bathroom': 'Banheiro',
    'kitchen': 'Cozinha',
    'general': 'Geral',
    'bedroom': 'Quarto',
    'living-room': 'Sala',
    'property': 'Valor do Imóvel',
    'rent': 'Custos de Entrada (Aluguel)',
  };

  // Calcular totais por categoria incluindo transação
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    // Móveis por categoria
    categories.forEach(category => {
      totals[category] = result ? result.selectedItems
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + item.price, 0) : 0;
    });
    
    if (aiJson && result) {
      const transactionLower = result.transactionType.toLowerCase();
      
      if ((transactionLower.includes('compra') || transactionLower.includes('comprar')) 
          && aiJson.property_estimate) {
        totals['property'] = aiJson.property_estimate;
      } else if ((transactionLower.includes('aluguel') || transactionLower.includes('alugar'))
                 && aiJson.total_upfront) {
        const rentOnly = aiJson.total_upfront - (aiJson.furnishing_cost || 0);
        totals['rent'] = rentOnly > 0 ? rentOnly : aiJson.total_upfront;
      }
    }
    
    return totals;
  }, [result, aiJson, categories]);

  // Calcular porcentagens
  const categoryPercentages = useMemo(() => {
    const denom = combinedTotal || 1;
    
    const percentages = Object.entries(categoryTotals)
      .filter(([_, total]) => total > 0)
      .map(([category, total]) => ({
        category,
        total,
        percentage: (total / denom) * 100
      }))
      .sort((a, b) => b.total - a.total); // Ordenar do maior para o menor
    
    return percentages;
  }, [categoryTotals, combinedTotal]);

  const handleRecalculate = () => {
    localStorage.removeItem('calculatorResult');
    router.push('/calculator');
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum resultado</h2>
          <p className="text-gray-500 mb-8">Parece que você ainda não completou a simulação.</p>
          <Button onClick={() => router.push('/calculator')} label="Fazer Simulação" className="w-full font-bold" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-20 font-sans rounded-b-xl">
      {/* HEADER RESULTADOS */}
      <div className="bg-indigo-600 pt-12 pb-24 px-4 text-center text-white rounded-t-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Resultado da Simulação</h1>
        <p className="text-indigo-100 text-lg">Seu plano financeiro personalizado para a mudança.</p>
      </div>

      <div className="px-4 -mt-16 space-y-8">
        
        {/* CARDS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Total */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Valor Total Estimado</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{formatCurrency(combinedTotal)}</h3>
          </div>

          {/* Card Prazo */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Prazo da Meta</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{monthsToSave} meses</h3>
          </div>

          {/* Card Mensalidade */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center ring-2 ring-indigo-500 ring-offset-2 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Economia Mensal</p>
            <h3 className="text-3xl font-extrabold text-indigo-600 mt-1">{formatCurrency(monthlySavings)}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUNA ESQUERDA: Distribuição e Ajuste */}
          <div className="space-y-8">
            
            {/* Gráfico de Barras */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Box size={20} className="text-indigo-500" />
                Onde vai seu dinheiro?
              </h3>
              <div className="space-y-5">
                {categoryPercentages.map(({ category, total, percentage }) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  const label = categoryLabels[category as keyof typeof categoryLabels];

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Icon size={18} className="text-gray-400" />
                          <span>{label}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 block">{formatCurrency(total)}</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-right text-gray-400">{percentage.toFixed(1)}% do total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider de Ajuste */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Simular Prazo</h3>
              <p className="text-gray-500 text-sm mb-6">Arraste para ver como o valor mensal muda se você economizar por mais ou menos tempo.</p>
              
              <div className="px-2">
                <div className="flex justify-between mb-4 text-sm font-medium text-gray-500">
                  <span>1 mês</span>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">{monthsToSave} meses</span>
                  <span>60 meses</span>
                </div>
                <Slider 
                  value={monthsToSave} 
                  onChange={(e) => setMonthsToSave(e.value as number)}
                  min={1} 
                  max={60} 
                  className="w-full"
                />
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <p className="text-sm text-indigo-800 mb-1">Nova meta mensal:</p>
                <p className="text-2xl font-bold text-indigo-700">{formatCurrency(monthlySavings)}</p>
              </div>
            </div>

            {/* Botão Recalcular */}
            <div className="text-center pt-4">
              <Button 
                onClick={handleRecalculate}
                className="w-full md:w-auto px-8 py-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-bold shadow-sm"
                icon="pi pi-refresh"
                label="Fazer Nova Simulação"
                outlined
              />
            </div>
          </div>

          {/* COLUNA DIREITA: IA e Detalhes */}
          <div className="space-y-8">
            
            {/* Análise IA */}
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-500 fill-purple-100" />
                  Análise da IA Gemini
                </h3>

                {aiSummary ? (
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {aiSummary}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl mb-4 text-gray-500 italic">Análise detalhada indisponível.</div>
                )}

                {aiJson && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Estimativas de Mercado</h4>
                      <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 divide-y divide-indigo-100">
                        {aiJson.property_estimate && (
                           <div className="flex justify-between p-3">
                             <span className="text-sm text-gray-600">Valor Estimado do Imóvel</span>
                             <span className="text-sm font-bold text-gray-900">{formatCurrency(aiJson.property_estimate)}</span>
                           </div>
                        )}
                        {aiJson.rent_monthly_estimate && (
                           <div className="flex justify-between p-3">
                             <span className="text-sm text-gray-600">Aluguel Estimado</span>
                             <span className="text-sm font-bold text-gray-900">{formatCurrency(aiJson.rent_monthly_estimate)}</span>
                           </div>
                        )}
                        <div className="flex justify-between p-3 bg-indigo-50">
                          <span className="text-sm font-bold text-indigo-700">Total Inicial Sugerido</span>
                          <span className="text-sm font-bold text-indigo-700">{formatCurrency(aiJson.total_upfront)}</span>
                        </div>
                      </div>
                    </div>

                    {aiJson.notes && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notas & Suposições</h4>
                        <p className="text-xs text-gray-500 bg-white border border-gray-200 p-3 rounded-lg leading-relaxed">
                          {aiJson.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes do Imóvel e Itens */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumo da Seleção</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Tipo de Imóvel</p>
                  <p className="font-semibold text-gray-800">{result.propertyType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Transação</p>
                  <p className="font-semibold text-gray-800">{result.transactionType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Localização</p>
                  <p className="font-semibold text-gray-800 truncate" title={result.location}>{result.location}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Metragem</p>
                  <p className="font-semibold text-gray-800">{result.squareMeters}m²</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-700">Itens Selecionados</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{result.selectedItems.length} itens</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {result.selectedItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-2 border-b border-dashed border-gray-100 last:border-0">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  {result.selectedItems.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-2">Nenhum item de mobília selecionado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}