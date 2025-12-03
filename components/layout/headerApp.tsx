import { Github } from "lucide-react";
import Link from "next/link";
import { Button } from "primereact/button";

export default function HeaderApp() {
  return (
    <header className="w-full shadow-md text-center bg-white">
      <div className='max-w-4xl mx-auto flex justify-between items-center p-5'>
        <Link href="/">
          <h1 className="font-bold text-2xl flex-2 text-gray-950">Morad<span className='text-indigo-600'>IA</span></h1>
        </Link>
        <Link href="https://github.com/VictorFrancelino/moradIA" target="_blank">
          <Button icon={<Github/>} rounded outlined aria-label="Filter" />
        </Link>
      </div>
    </header>
  )
}