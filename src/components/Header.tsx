import React from 'react';
import { Dog, Briefcase, UserCircle2, ArrowLeftRight, HeartHandshake, Sparkles, MessageSquare } from 'lucide-react';

interface HeaderProps {
  currentRole: 'owner' | 'sitter' | 'social';
  setRole: (role: 'owner' | 'sitter' | 'social') => void;
  userEmail: string;
  onOpenRegister: () => void;
}

export default function Header({ currentRole, setRole, userEmail, onOpenRegister }: HeaderProps) {
  return (
    <header className="bg-white border-b border-violet-150/80 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white p-2.5 rounded-2xl shadow-md shadow-violet-600/20 flex items-center justify-center">
            <Dog className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-transparent font-sans tracking-tight">BarkSitter</h1>
            <p className="text-[10px] text-fuchsia-600 font-mono tracking-wider uppercase font-extrabold">Local Pet Trust</p>
          </div>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/80 p-1 rounded-xl">
          <button
            id="role-switch-owner"
            onClick={() => setRole('owner')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              currentRole === 'owner'
                ? 'bg-white text-violet-700 shadow-xs ring-1 ring-violet-150'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Owner Profile</span>
            <span className="sm:hidden">Owner</span>
          </button>
          
          <button
            id="role-switch-sitter"
            onClick={() => setRole('sitter')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              currentRole === 'sitter'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sitter Dashboard</span>
            <span className="sm:hidden">Sitter</span>
          </button>

          <button
            id="role-switch-social"
            onClick={() => setRole('social')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              currentRole === 'social'
                ? 'bg-fuchsia-100 text-fuchsia-700 shadow-xs ring-1 ring-fuchsia-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Social Forum</span>
            <span className="sm:hidden">Social</span>
          </button>
        </div>

        {/* User Info & Portal Registration triggers */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenRegister}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-[11px] font-black px-3.5 py-2 rounded-xl transition hover:scale-[1.02] shadow-sm shadow-violet-600/10 cursor-pointer flex items-center space-x-1"
            title="Register new Owner or Sitter accounts"
          >
            <Sparkles className="h-3 w-3 text-white" />
            <span className="hidden sm:inline">Join / Register</span>
            <span className="sm:hidden">Register</span>
          </button>

          <div className="hidden md:flex flex-col text-right">
            <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">Username</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{userEmail.split('@')[0]}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-fuchsia-100 border border-fuchsia-200 flex items-center justify-center text-sm font-bold text-fuchsia-700">
            🐶
          </div>
        </div>
      </div>
    </header>
  );
}
