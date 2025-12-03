import { LucideIcon, CheckCircle2 } from "lucide-react";

interface OptionInterface {
  onClick: () => void;
  icon?: LucideIcon;
  title: string;
  description: string;
  isSelected: boolean;
}

export default function Option({ onClick, icon: Icon, title, description, isSelected }: OptionInterface) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative w-full flex flex-col p-6 rounded-xl text-left cursor-pointer transition-all duration-200 border-2
        ${isSelected 
          ? "border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200 ring-offset-2" 
          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1"
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-indigo-600">
          <CheckCircle2 size={24} fill="white" />
        </div>
      )}
      
      {Icon && (
        <div className={`mb-4 w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
           <Icon size={24} className={isSelected ? 'text-indigo-600' : 'text-gray-600'} />
        </div>
      )}
      
      <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
        {description}
      </p>
    </div>
  )
}