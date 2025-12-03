import { StepOption } from '@/app/types';
import Option from '@/components/calculator/option';

interface ChoiceOfPropertyProps {
  options: StepOption[];
  selectedOptionId: number | null;
  setSelectedOptionId: (id: number) => void;
}

export default function ChoiceOfProperty({ 
  options, 
  selectedOptionId, 
  setSelectedOptionId 
}: ChoiceOfPropertyProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {options.map((item) => (
        <Option
          key={`step_1_option_${item.id}`}
          onClick={() => setSelectedOptionId(item.id)}
          isSelected={selectedOptionId === item.id}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  )
}