import { Button } from 'primereact/button';            
import { Calculator, TrendingUp, ChartPie, Clock } from 'lucide-react';         

export default function Home() {
  return (
    <>
      <header className="w-full text-center p-5 shadow-md">
        <h1 className="font-bold text-xl">MoradIA</h1>
      </header>
      <main className="p-5 text-center">
        <div className="space-y-5 p-10">
          <h1 className="text-gray-950 text-6xl font-bold text-center">Calculadora de Mudança</h1>
          <p className="text-gray-500">Descubra quanto você precisa economizar para se mudar. Calcule todos os custos e planeje sua mudança de forma inteligente.</p>
          <Button>Começar</Button>
        </div>
        <div className="w-full px-40 space-x-5 flex flex-wrap">
          <div className="max-w-96 p-5 w-full rounded-md shadow-md space-y-2.5">
            <Calculator color="#6366f1" size="40" />
            <h2 className='text-left text-xl font-bold'>Cálculo Completo</h2>
            <p className='text-left text-gray-500'>Calcula todos os custos envolvidos na sua mudança</p>
          </div>
          <div className="max-w-96 p-5 w-full rounded-md shadow-md space-y-2.5">
            <TrendingUp color="#6366f1" size="40" />
            <h2 className='text-left text-xl font-bold'>Plano de Poupança</h2>
            <p className='text-left text-gray-500'>Divida o valor total em parcelas mensais</p>
          </div>
          <div className="max-w-96 p-5 w-full rounded-md shadow-md space-y-2.5">
            <ChartPie color="#6366f1" size="40" />
            <h2 className='text-left text-xl font-bold'>Análise Detalhada</h2>
            <p className='text-left text-gray-500'>Veja a distribuição de cada custo</p>
          </div>
          <div className="max-w-96 p-5 w-full rounded-md shadow-md space-y-2.5">
            <Clock color="#6366f1" size="40" />
            <h2 className='text-left text-xl font-bold'>Tempo Personalizável</h2>
            <p className='text-left text-gray-500'>Escolha quantos meses quer para economizar</p>
          </div>
        </div>
        <div className="mx-50 border-2 rounded-md p-5 space-y-5">
          <h2 className='text-xl font-bold'>Como Funciona</h2>
          <div className='flex justify-between'>
            <div className='flex flex-col items-center space-y-1'>
              <div className='bg-indigo-500 flex w-12 h-12 justify-center items-center p-5 rounded-full'>
                <p>1</p>
              </div>
              <h3 className='font-bold'>Selecione o Tipo</h3>
              <p className='text-gray-500'>Casa, apartamento ou kitnet</p>
            </div>
            <div>
              <p>2</p>
              <h3>Escolha a Forma</h3>
              <p>Aluguel ou compra</p>
            </div>
            <div>
              <p>3</p>
              <h3>Defina o Local</h3>
              <p>Região e tamanho do imóvel</p>
            </div>
            <div>
              <p>4</p>
              <h3>Visualize Custos</h3>
              <p>Obtenha seu plano de poupança</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
