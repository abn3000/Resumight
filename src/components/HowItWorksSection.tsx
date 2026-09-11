import React from 'react';
import { motion } from 'motion/react';
import { FileText, Palette, Target, Sparkles, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onGoToResumaker, onGoToTailor }) => {
  const steps = [
    {
      num: "01",
      icon: FileText,
      title: "Tell us about you",
      desc: "Add your basics, experience, education and skills — type it out, or tap the mic and talk naturally.",
      actionLabel: "Try Resumaker",
      onClick: onGoToResumaker,
    },
    {
      num: "02",
      icon: Palette,
      title: "Pick your look",
      desc: "Choose from four clean layouts and an accent color. No design skills needed — it just looks good.",
      actionLabel: "Explore Templates",
      onClick: onGoToResumaker,
    },
    {
      num: "03",
      icon: Target,
      title: "Generate & tailor",
      desc: "Download a polished PDF in minutes, then fit it to any job description with one click.",
      actionLabel: "Try Tailor Tool",
      onClick: onGoToTailor,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 text-center">
        
        {/* Eyebrow & Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-3 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950 font-mono ">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            HOW IT WORKS
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            From blank page to polished resume in three steps.
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            No formatting rabbit holes, no 3 a.m. design spirals. Just answers, choices, and a resume you're proud of.
          </p>
        </motion.div>

        {/* 3 Step Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="rounded-xl p-6 border-2 border-slate-900 bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all relative overflow-hidden flex flex-col justify-between space-y-5"
              >
                {/* Step Number Stamp */}
                <span className="absolute top-3 right-3 text-4xl font-black text-slate-200 select-none pointer-events-none font-mono">
                  {step.num}
                </span>

                <div className="space-y-3 relative z-10">
                  <div className="w-11 h-11 rounded-lg bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-black text-slate-950 text-xl">
                    {step.title}
                  </h3>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 relative z-10">
                  <button
                    onClick={step.onClick}
                    className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-emerald-300 text-slate-950 border-2 border-slate-900 font-mono font-bold text-xs active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 transition-all cursor-pointer group"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
