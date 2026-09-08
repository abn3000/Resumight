import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { NavTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-emerald-200/60 bg-emerald-100/40 backdrop-blur-lg pt-12 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-emerald-200/60">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="text-xl font-black tracking-wider text-emerald-950 uppercase font-sans">
                RESUMIGHT
              </span>
            </div>
            <p className="text-xs text-emerald-900/80 font-medium max-w-sm">
              Helping students and new job seekers create clean, ATS-optimized resumes and tailor them to job postings in minutes.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-6 text-sm font-bold text-emerald-900">
            <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-700 transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-emerald-700 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => setActiveTab('resumaker')} className="hover:text-emerald-700 transition-colors cursor-pointer">
              Resumaker
            </button>
            <button onClick={() => setActiveTab('tailor')} className="hover:text-emerald-700 transition-colors cursor-pointer">
              Tailor
            </button>
            <button onClick={() => setActiveTab('coach')} className="hover:text-emerald-700 transition-colors cursor-pointer">
              Coach
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-emerald-900/70">
          <p>© {new Date().getFullYear()} Resumight • Built for hackathons, career fairs & first co-ops</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by students, for students • Free forever
          </p>
        </div>

      </div>
    </footer>
  );
};
