import React from 'react';
import { motion } from 'motion/react';
import { Wand2, Target, Mic, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface HomeTeasersSectionProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}

export const HomeTeasersSection: React.FC<HomeTeasersSectionProps> = ({ onGoToResumaker, onGoToTailor }) => {
  return (
    <section className="py-16 px-4 sm:px-8 relative overflow-hidden bg-emerald-50/50">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-3 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            TOOL SAMPLING
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Explore Resumight's twin powerhouses.
          </h2>
          <p className="text-base text-emerald-900/80 font-normal">
            A quick peek at the full tools available in the Resumaker and Tailor tabs above.
          </p>
        </motion.div>

        {/* Two Teaser Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Resumaker Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl flex flex-col justify-between space-y-6 bg-gradient-to-br from-white/90 to-emerald-50/60"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-xl">1. Resumaker Tool</h3>
                    <p className="text-xs text-emerald-800 font-medium">Type or speak your experience</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                  Tab Preview
                </span>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-4 rounded-2xl bg-white/80 border border-emerald-100 space-y-3 shadow-2xs font-sans">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950 border-b border-emerald-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-Formatted Section Draft
                  </span>
                  <span className="text-emerald-700 font-mono text-[10px]">4 Layouts</span>
                </div>
                <p className="text-xs text-emerald-900 font-medium italic">
                  "Spearheaded 4-person student team to engineer a React & TypeScript app used by 2,500+ campus students."
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 p-2 rounded-xl">
                  <Mic className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Voice assistant active — converting spoken notes into ATS bullet points</span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToResumaker}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              Open Resumaker Builder Tab
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Tailor Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl flex flex-col justify-between space-y-6 bg-gradient-to-br from-white/90 to-teal-50/60"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-xl">2. Job Posting Tailor</h3>
                    <p className="text-xs text-emerald-800 font-medium">Match ATS keywords & rewrite bullets</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                  Tab Preview
                </span>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-4 rounded-2xl bg-white/80 border border-emerald-100 space-y-3 shadow-2xs font-sans">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                  <span>Target Role: UI/UX Design Intern</span>
                  <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">88% Match</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> React & Figma
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" /> + Design Systems
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToTailor}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              Open Tailor Workbench Tab
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
