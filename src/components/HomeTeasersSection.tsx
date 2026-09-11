import React from 'react';
import { motion } from 'motion/react';
import { Wand2, Target, Mic, Sparkles, ArrowRight, CheckCircle2, AlertCircle, MessageSquare, Briefcase, Mail, GraduationCap } from 'lucide-react';

interface HomeTeasersSectionProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
  onGoToCoach?: () => void;
  onGoToPrep?: () => void;
}

export const HomeTeasersSection: React.FC<HomeTeasersSectionProps> = ({ onGoToResumaker, onGoToTailor, onGoToCoach, onGoToPrep }) => {
  const handleCoachClick = onGoToCoach || onGoToPrep || onGoToTailor;

  return (
    <section className="py-12 px-4 sm:px-8 relative overflow-hidden bg-emerald-100/50 border-y-2 border-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-2 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950 font-mono ">
            THE STUDENT CAREER TOOLKIT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Build it. Tailor it. Ace the interview.
          </h2>
          <p className="text-sm sm:text-base text-slate-800 font-medium">
            Three free tools built specifically to get college students and new grads hired.
          </p>
        </motion.div>

        {/* Three Teaser Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* 1. Resumaker Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-xl p-5 border-2 border-slate-900 flex flex-col justify-between space-y-4 bg-white"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">1. Resumaker</h3>
                    <p className="text-xs text-slate-700 font-bold font-mono">Type or speak your experience</p>
                  </div>
                </div>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-3 rounded-lg bg-slate-50 border-2 border-slate-900 space-y-2 font-sans ">
                <div className="flex items-center justify-between text-xs font-bold text-slate-950 border-b-2 border-slate-200 pb-1.5 font-mono">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Section Auto-Draft
                  </span>
                  <span className="text-slate-900 text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded border border-slate-900 font-bold">4 Layouts</span>
                </div>
                <p className="text-[11px] text-slate-800 font-medium italic leading-relaxed">
                  "Engineered React components boosting task completion rate by 32%."
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900 bg-white p-2 rounded border border-slate-300">
                  <Mic className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Voice assistant turns casual descriptions into metrics</span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToResumaker}
              className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-xs border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              Open Resumaker
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* 2. Tailor Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl p-5 border-2 border-slate-900 flex flex-col justify-between space-y-4 bg-white"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-300 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">2. Job Tailor</h3>
                    <p className="text-xs text-slate-700 font-bold font-mono">ATS keyword match & rewrites</p>
                  </div>
                </div>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-3 rounded-lg bg-slate-50 border-2 border-slate-900 space-y-2 font-sans ">
                <div className="flex justify-between items-center text-xs font-bold text-slate-950 font-mono">
                  <span>Target: Software Intern</span>
                  <span className="text-slate-950 font-bold bg-amber-200 px-1.5 py-0.5 rounded border border-slate-900 text-[10px]">88% ATS Match</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-900 text-slate-950 text-[10px] font-mono font-bold flex items-center gap-1 ">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> React & TypeScript
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-900 text-slate-950 text-[10px] font-mono font-bold flex items-center gap-1 ">
                    <AlertCircle className="w-2.5 h-2.5 text-amber-600" /> + Agile Sprints
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToTailor}
              className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-xs border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              Open Tailor
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* 3. Coach Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-xl p-5 border-2 border-slate-900 flex flex-col justify-between space-y-4 bg-white"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-300 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950 text-base">3. Coach</h3>
                    <p className="text-xs text-slate-700 font-bold font-mono">Pitch drill, STAR & cold DMs</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-900">
                  interactive
                </span>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-3 rounded-lg bg-slate-50 border-2 border-slate-900 space-y-2 font-sans ">
                <div className="flex items-center justify-between text-xs font-bold text-slate-950 font-mono">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    60-Second Pitch Drill
                  </span>
                  <span className="text-slate-900 text-[10px] bg-amber-200 px-1.5 py-0.5 rounded border border-slate-900 font-bold font-mono">~52 sec</span>
                </div>
                <p className="text-[11px] text-slate-800 font-medium italic leading-relaxed">
                  "Hook &rarr; 2 concrete resume proof points &rarr; Forward pivot to target role."
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900 bg-white p-2 rounded border border-slate-300">
                  <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Includes 300-char LinkedIn DMs & STAR behavioral cards</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCoachClick}
              className="w-full py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-xs border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              Open Coach
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
