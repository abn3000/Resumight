import React, { useState } from 'react';
import { NavTab } from '../types';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onCtaClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onCtaClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'resumaker', label: 'Resumaker' },
    { id: 'tailor', label: 'Tailor' },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel px-6 py-3.5 flex items-center justify-between border border-white/80 shadow-sm backdrop-blur-xl bg-white/70">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleTabClick('home')} 
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600/90 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-emerald-950 uppercase font-sans">
            RESUMIGHT
          </span>
        </button>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-emerald-100/50 p-1.5 rounded-full border border-emerald-200/40">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'text-emerald-950 bg-white shadow-sm shadow-emerald-900/10 font-bold'
                    : 'text-emerald-800/70 hover:text-emerald-950 hover:bg-white/40'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('resumaker');
              onCtaClick();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            Create Resume
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-emerald-900 hover:bg-emerald-100/50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl glass-panel p-5 border border-white/80 bg-white/90 shadow-xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`text-left px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-100/70 text-emerald-950 font-bold border border-emerald-200'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-emerald-100">
            <button
              onClick={() => {
                setActiveTab('resumaker');
                setMobileMenuOpen(false);
                onCtaClick();
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-center shadow-md flex items-center justify-center gap-2"
            >
              Build your resume
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
