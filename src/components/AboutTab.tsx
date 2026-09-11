import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, GraduationCap, ShieldCheck, Zap, ArrowRight, Target, Users, BookOpen } from 'lucide-react';

interface AboutTabProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ onGoToResumaker, onGoToTailor }) => {
  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-left space-y-3 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950 font-mono ">
          ABOUT RESUMIGHT
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Empowering new job seekers & students to land interviews.
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
          Resumight was built with a single goal: eliminate the stress, formatting rabbit holes, and paywalls involved in building job-winning resumes for early careers.
        </p>
      </motion.div>

      {/* Story / Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl p-6 border-2 border-slate-900 bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-950">Built for Students First</h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
            Most resume builders cater to senior executives with 15+ years of experience. Resumight translates coursework, university club leadership, and class projects into impactful bullet points recruiters notice.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl p-6 border-2 border-slate-900 bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-300 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-950">100% Free & No Paywalls</h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
            We believe students shouldn't have to pay $20/month just to download a single PDF after spending an hour editing. Resumight is completely free with zero credit cards required.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-xl p-6 border-2 border-slate-900 bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-300 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-black text-slate-950">ATS-Optimized Engineering</h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
            Over 75% of resumes are filtered out by Applicant Tracking Systems before a human eye ever sees them. Our layouts guarantee clean keyword scanning and zero parsing errors.
          </p>
        </motion.div>

      </div>

      {/* Core Features Overview */}
      <div 
        className="rounded-xl p-6 sm:p-8 border-2 border-slate-900 bg-white space-y-6"
      >
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">How Resumight Helps You Win</h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Whether you want to build a fresh resume from scratch or customize your existing draft for 10 different job postings, Resumight has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-5 rounded-lg bg-slate-50 border-2 border-slate-900 space-y-3">
            <div className="w-9 h-9 rounded-md bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-950 text-base">1. Resumaker Tool</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Use standard form fields or voice dictation to auto-generate single-page resumes with modern Swiss, Serif, Spearmint, and Coral layouts.
            </p>
            <button
              onClick={onGoToResumaker}
              className="text-xs font-black font-mono text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-1 cursor-pointer"
            >
              Open Resumaker <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 border-2 border-slate-900 space-y-3">
            <div className="w-9 h-9 rounded-md bg-amber-300 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-950 text-base">2. Job Posting Tailor</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Paste any job description alongside your resume draft. Tailor highlights keyword gaps, calculates ATS compatibility scores, and suggests bullet rewrites.
            </p>
            <button
              onClick={onGoToTailor}
              className="text-xs font-black font-mono text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-1 cursor-pointer"
            >
              Open Tailor Workbench <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-black text-slate-950">Ready to build your next resume?</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGoToResumaker}
            className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-sm border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Start with Resumaker
          </button>
          <button
            onClick={onGoToTailor}
            className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-black font-mono text-sm border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Tailor a Job Posting
          </button>
        </div>
      </div>

    </div>
  );
};
