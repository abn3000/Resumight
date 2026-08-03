import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, GraduationCap, ShieldCheck, Zap, ArrowRight, Target, Users, BookOpen } from 'lucide-react';

interface AboutTabProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ onGoToResumaker, onGoToTailor }) => {
  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-left space-y-4 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
          ABOUT RESUMIGHT
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-emerald-950 tracking-tight leading-tight">
          Empowering new job seekers & students to land interviews.
        </h1>
        <p className="text-lg text-emerald-900/80 leading-relaxed">
          Resumight was built with a single goal: eliminate the stress, formatting rabbit holes, and paywalls involved in building job-winning resumes for early careers.
        </p>
      </motion.div>

      {/* Story / Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/90 shadow-lg space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-emerald-950">Built for Students First</h2>
          <p className="text-emerald-900/80 text-sm leading-relaxed">
            Most resume builders cater to senior executives with 15+ years of experience. Resumight translates coursework, university club leadership, and class projects into impactful bullet points recruiters notice.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/90 shadow-lg space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-emerald-950">100% Free & No Paywalls</h2>
          <p className="text-emerald-900/80 text-sm leading-relaxed">
            We believe students shouldn't have to pay $20/month just to download a single PDF after spending an hour editing. Resumight is completely free with zero credit cards required.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/90 shadow-lg space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-emerald-950">ATS-Optimized Engineering</h2>
          <p className="text-emerald-900/80 text-sm leading-relaxed">
            Over 75% of resumes are filtered out by Applicant Tracking Systems before a human eye ever sees them. Our layouts guarantee clean keyword scanning and zero parsing errors.
          </p>
        </motion.div>

      </div>

      {/* Core Features Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/90 shadow-xl bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/30 space-y-8"
      >
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">How Resumight Helps You Win</h2>
          <p className="text-sm sm:text-base text-emerald-900/80">
            Whether you want to build a fresh resume from scratch or customize your existing draft for 10 different job postings, Resumight has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-emerald-950 text-lg">1. Resumaker Tool</h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Use standard form fields or voice dictation to auto-generate single-page resumes with modern Swiss, Serif, Spearmint, and Coral layouts.
            </p>
            <button
              onClick={onGoToResumaker}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 pt-1 cursor-pointer"
            >
              Open Resumaker <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-emerald-950 text-lg">2. Job Posting Tailor</h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Paste any job description alongside your resume draft. Tailor highlights keyword gaps, calculates ATS compatibility scores, and suggests bullet rewrites.
            </p>
            <button
              onClick={onGoToTailor}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 pt-1 cursor-pointer"
            >
              Open Tailor Workbench <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Call to action */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-black text-emerald-950">Ready to build your next resume?</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGoToResumaker}
            className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Start with Resumaker
          </button>
          <button
            onClick={onGoToTailor}
            className="px-8 py-3.5 rounded-full glass-panel hover:bg-white text-emerald-950 font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Tailor a Job Posting
          </button>
        </div>
      </div>

    </div>
  );
};
