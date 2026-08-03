import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Wand2, Target, Sparkles } from 'lucide-react';

interface BottomCtaSectionProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}

export const BottomCtaSection: React.FC<BottomCtaSectionProps> = ({ onGoToResumaker, onGoToTailor }) => {
  return (
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-8 sm:p-14 border border-emerald-600/40 shadow-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white text-center space-y-8 relative overflow-hidden"
        >
          {/* Background glow effects */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold uppercase tracking-wider font-mono border border-emerald-500/50">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              GET STARTED TODAY FOR FREE
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
              Your next internship starts with a resume.
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base font-normal leading-relaxed">
              Build it in minutes, tailor it to every application, and hit send with confidence.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <button
              onClick={onGoToResumaker}
              className="px-8 py-4 rounded-full bg-white text-emerald-950 font-black text-sm shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer group"
            >
              <Wand2 className="w-4 h-4 text-emerald-600" />
              Build Your Resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onGoToTailor}
              className="px-8 py-4 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-white font-bold text-sm border border-emerald-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4 text-teal-300" />
              Tailor to Job Posting
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
