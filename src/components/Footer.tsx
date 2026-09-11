import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { NavTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-16 border-t-2 border-slate-900 bg-emerald-100/70 pt-10 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b-2 border-slate-900">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-xl font-black tracking-wider text-slate-950 uppercase font-mono">
                RESUMIGHT
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium max-w-sm">
              Helping students and new job seekers create clean, ATS-optimized resumes and tailor them to job postings in minutes.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm font-black text-slate-950">
            <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:underline cursor-pointer">
              Home
            </button>
            <button onClick={() => setActiveTab('resumaker')} className="hover:underline cursor-pointer">
              Resumaker
            </button>
            <button onClick={() => setActiveTab('tailor')} className="hover:underline cursor-pointer">
              Tailor
            </button>
            <button onClick={() => setActiveTab('coach')} className="hover:underline cursor-pointer">
              Coach
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-bold text-slate-700">
          <p>© {new Date().getFullYear()} Resumight • Built for hackathons, career fairs & first co-ops</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by students, for students • Free forever
          </p>
        </div>

      </div>
    </footer>
  );
};
