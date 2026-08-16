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
  Newspaper
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 h-screen sticky top-0 flex flex-col py-6">
      <div className="px-6 mb-8">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-600 text-white" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-100" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}

        <div className="mt-8 mb-2 px-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization</p>
        </div>
        {orgItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <item.icon className="w-5 h-5 text-slate-400" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
