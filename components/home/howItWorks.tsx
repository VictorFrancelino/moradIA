interface HowItWorksProps {
  step: string;
  title: string;
  description: string;
}

export default function HowItWorks({ step, title, description }: HowItWorksProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 p-4">
      <div className="bg-indigo-600 text-white flex w-12 h-12 justify-center items-center rounded-full shadow-lg shadow-indigo-200 font-bold text-xl mb-2">
        {step}
      </div>
      <h3 className="font-bold text-lg text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  )
}