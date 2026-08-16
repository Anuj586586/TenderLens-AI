import Link from 'next/link';
import { Search } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-950 text-indigo-100">
        <Search className="w-5 h-5 absolute" />
        <div className="absolute w-full h-full border-2 border-indigo-200/30 rounded-lg transform rotate-12 scale-110"></div>
      </div>
      <span className="text-xl font-bold text-slate-900 tracking-tight">TenderLens AI</span>
    </Link>
  );
}
