import { StepOption } from '@/app/types';
import Option from '@/components/calculator/option';

interface ChoiceStepProps {
  title: string;
  description: string;
  options: StepOption[];
  selectedOptionId: number | null;
  setSelectedOptionId: (id: number) => void;
}

export default function ChoiceStep({ 
  title,
  description,
  options, 
  selectedOptionId, 
  setSelectedOptionId 
}: ChoiceStepProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className='space-y-2 text-center md:text-left'>
        <h2 className='font-bold text-3xl md:text-4xl text-gray-900'>{title}</h2>
        <p className='text-gray-500 text-lg'>{description}</p>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {options.map((item) => (
          <Option
            key={`option_${item.id}`}
            onClick={() => setSelectedOptionId(item.id)}
            isSelected={selectedOptionId === item.id}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}