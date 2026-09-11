import React, { useState } from 'react';
import { NavTab } from '../types';
import { Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'resumaker', label: 'Resumaker' },
    { id: 'tailor', label: 'Tailor' },
    { id: 'coach', label: 'Coach' },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto rounded-md px-5 py-3 flex items-center justify-between border-2 border-slate-900 bg-white">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleTabClick('home')} 
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-sm bg-emerald-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center font-black text-lg">
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
              RESUMIGHT
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-slate-900 bg-amber-300 border-2 border-slate-900 px-2 py-0.5 rounded-sm tracking-wider uppercase">
              student project
            </span>
          </div>
        </button>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-sm border-2 border-slate-900">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'coach' && activeTab === 'prep');
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-1.5 rounded-sm text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-slate-950 bg-emerald-300 border-2 border-slate-900'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 border-2 border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-sm border-2 border-slate-900 bg-slate-100 text-slate-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-sm p-4 border-2 border-slate-900 bg-white flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`text-left px-4 py-2.5 rounded-sm font-bold text-sm border-2 transition-colors ${
                activeTab === item.id || (item.id === 'coach' && activeTab === 'prep')
                  ? 'bg-emerald-300 border-slate-900 text-slate-950'
                  : 'border-transparent text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
