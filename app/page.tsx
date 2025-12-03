import Link from 'next/link';
import { Button } from 'primereact/button';            
import { Calculator, TrendingUp, ChartPie, Clock } from 'lucide-react';         
import Feature from '@/components/home/feature';
import HowItWorks from '@/components/home/howItWorks';

export default function Home() {
  const features = [
    {
      icon: Calculator,
      title: 'Cálculo Completo',
      description: 'Calcula todos os custos envolvidos na sua mudança, desde transporte até taxas ocultas.'
    },
    {
      icon: TrendingUp,
      title: 'Plano de Poupança',
      description: 'Divida o valor total em parcelas mensais que cabem no seu bolso.'
    },
    {
      icon: ChartPie,
      title: 'Análise Detalhada',
      description: 'Veja gráficos visuais da distribuição de cada custo no seu orçamento.'
    },
    {
      icon: Clock,
      title: 'Tempo Personalizável',
      description: 'Defina sua meta de tempo e veja quanto precisa guardar por mês.'
    }
  ];

  const steps = [
    { step: '1', title: 'Selecione o Tipo', desc: 'Casa, apartamento ou kitnet' },
    { step: '2', title: 'Escolha a Forma', desc: 'Aluguel ou compra do imóvel' },
    { step: '3', title: 'Defina o Local', desc: 'Região e bairro desejado' },
    { step: '4', title: 'Defina a Metragem', desc: 'Tamanho ideal em m²' },
    { step: '5', title: 'Itens & Móveis', desc: 'O que você precisa comprar?' },
    { step: '6', title: 'Resultados', desc: 'Receba sua estimativa via IA' },
  ];

  return (  
    <>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]"></div>
      </div>
      
      <div className="space-y-6 pt-20">
        <h1 className="text-gray-900 text-6xl md:text-7xl font-extrabold tracking-tight">
          Calculadora de <span className="text-indigo-600">Mudança</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
          Descubra quanto você precisa economizar para se mudar. Calcule todos os custos e planeje sua mudança de forma inteligente e sem surpresas.
        </p>
        <div className="pt-4">
          <Link href="/calculator">
            <Button size="large" className="font-bold px-8 py-4 shadow-lg shadow-indigo-200">
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {features.map((feature, index) => (
          <Feature 
            key={index}
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </div>

      <div className="space-y-12 text-center bg-gray-50 py-20 rounded-xl">
        <div>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-950'>Como Funciona</h2>
          <p className="text-gray-600 mt-2">Simples, rápido e eficiente.</p>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
          {steps.map((item, index) => (
            <HowItWorks 
              key={index}
              step={item.step} 
              title={item.title} 
              description={item.desc} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-8 mb-24">
        <h2 className='text-4xl md:text-5xl font-bold text-gray-950'>
          Pronto para Calcular?
        </h2>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed'>
          Use nossa calculadora para ter uma visão clara dos custos da sua mudança e criar um plano de poupança realista hoje mesmo.
        </p>
        <Link href="/calculator">
          <Button size="large" className="font-bold px-8 py-4 shadow-lg shadow-indigo-200">
            Começar Gratuitamente
          </Button>
        </Link>
      </div>
    </>
  );
}