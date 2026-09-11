import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Wand2, Target, Sparkles } from 'lucide-react';

interface BottomCtaSectionProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({ onGoToResumaker, onGoToTailor }) => {
  return (
    <section className="py-16 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-xl p-8 sm:p-12 border-2 border-slate-900 bg-slate-950 text-white text-center space-y-6 relative overflow-hidden"
        >
          <div className="space-y-3 max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider font-mono border-2 border-slate-900 ">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              GET STARTED TODAY FOR FREE
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Your next internship starts with a resume.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Build it in minutes, tailor it to every application, and hit send with confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <button
              onClick={onGoToResumaker}
              className="px-6 py-3 rounded-lg bg-emerald-400 text-slate-950 font-black font-mono text-sm border-2 border-slate-900 hover:bg-emerald-300 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Wand2 className="w-4 h-4 text-slate-950" />
              Build Your Resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoToTailor}
              className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-black font-mono text-sm border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4 text-slate-950" />
              Tailor to Job Posting
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
