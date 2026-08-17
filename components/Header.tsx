'use client';

import { Search, Bell, LogOut, LogIn, Menu } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';

export function Header({ toggleSidebar, isSidebarOpen }: { toggleSidebar?: () => void, isSidebarOpen?: boolean }) {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-4">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); alert('Search functionality coming soon'); }} className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tenders, documents, analysis..." 
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600/20 focus:outline-none placeholder:text-slate-500"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <button onClick={() => alert('No new notifications')} className="text-slate-400 hover:text-slate-600 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 leading-none">{user.displayName || 'User'}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300">
              <Image 
                src={user.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.displayName || 'User'}&backgroundColor=e2e8f0`} 
                alt="User profile" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button onClick={signOut} className="text-slate-500 hover:text-slate-700 p-2" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={signIn} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
