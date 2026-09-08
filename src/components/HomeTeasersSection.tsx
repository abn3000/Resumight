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
    <section className="py-16 px-4 sm:px-8 relative overflow-hidden bg-emerald-50/60 border-y border-emerald-200/50">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-2.5 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/70 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            THE STUDENT CAREER TOOLKIT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Build it. Tailor it. Ace the interview.
          </h2>
          <p className="text-base text-emerald-900/80 font-normal">
            Three free tools built specifically to get college students and new grads hired.
          </p>
        </motion.div>

        {/* Three Teaser Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* 1. Resumaker Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-3xl p-6 border border-emerald-200/80 shadow-md flex flex-col justify-between space-y-5 bg-white/90"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-lg">1. Resumaker</h3>
                    <p className="text-xs text-emerald-800 font-medium">Type or speak your experience</p>
                  </div>
                </div>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2.5 font-sans">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950 border-b border-emerald-200/60 pb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Section Auto-Draft
                  </span>
                  <span className="text-emerald-700 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">4 Layouts</span>
                </div>
                <p className="text-[11px] text-emerald-900 font-medium italic leading-relaxed">
                  "Engineered React components boosting task completion rate by 32%."
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-white p-2 rounded-lg border border-emerald-100">
                  <Mic className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Voice assistant turns casual descriptions into metrics</span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToResumaker}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              Open Resumaker
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* 2. Tailor Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel rounded-3xl p-6 border border-emerald-200/80 shadow-md flex flex-col justify-between space-y-5 bg-white/90"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-2xs">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-lg">2. Job Tailor</h3>
                    <p className="text-xs text-emerald-800 font-medium">ATS keyword match & rewrites</p>
                  </div>
                </div>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2.5 font-sans">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
                  <span>Target: Software Intern</span>
                  <span className="text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-teal-200 text-[10px]">88% ATS Match</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-950 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> React & TypeScript
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-950 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <AlertCircle className="w-2.5 h-2.5 text-amber-600" /> + Agile Sprints
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToTailor}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              Open Tailor
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* 3. Coach Sampling Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel rounded-3xl p-6 border border-emerald-200/80 shadow-md flex flex-col justify-between space-y-5 bg-white/90"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-2xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-lg">3. Coach</h3>
                    <p className="text-xs text-emerald-800 font-medium">Pitch drill, STAR & cold DMs</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                  interactive
                </span>
              </div>

              {/* Sample Mini Interface */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2 font-sans">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    60-Second Pitch Drill
                  </span>
                  <span className="text-emerald-700 font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">~52 sec</span>
                </div>
                <p className="text-[11px] text-emerald-900 font-medium italic leading-relaxed">
                  "Hook &rarr; 2 concrete resume proof points &rarr; Forward pivot to target role."
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-white p-2 rounded-lg border border-emerald-100">
                  <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Includes 300-char LinkedIn DMs & STAR behavioral cards</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCoachClick}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
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
