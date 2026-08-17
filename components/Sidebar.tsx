'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  List, 
  FileSearch, 
  Files, 
  Building2, 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings,
  Globe,
  Newspaper,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tender Matches', href: '/dashboard/available', icon: Globe },
  { name: 'My Tenders', href: '/dashboard/tenders', icon: List },
  { name: 'Analyze Tender', href: '/dashboard/analyze', icon: FileSearch },
  { name: 'Documents', href: '/dashboard/document', icon: Files },
  { name: 'News & Blogs', href: '/dashboard/blogs', icon: Newspaper },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
];

const orgItems = [
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ isOpen = true, setIsOpen }: { isOpen?: boolean, setIsOpen?: (v: boolean) => void }) {
  const pathname = usePathname();

  return (
    <div 
      className={cn(
        "transition-all duration-300 flex-shrink-0 overflow-hidden bg-slate-50 border-r border-slate-200 h-screen sticky top-0",
        isOpen ? "w-64" : "w-0 border-r-0"
      )}
    >
      <aside className="w-64 flex flex-col h-full py-6">
        <div className="px-6 mb-8 flex items-center justify-between">
          <Logo />
          {/* Mobile close button if we needed one, but Hamburger handles toggle */}
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-4 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-indigo-100" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-8 mb-2 px-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Organization</p>
          </div>
          {orgItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              <item.icon className="w-5 h-5 text-slate-400 shrink-0" />
              {item.name}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
