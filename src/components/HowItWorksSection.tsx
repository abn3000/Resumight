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
    <section id="how-it-works" className="py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 text-center">
        
        {/* Eyebrow & Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            HOW IT WORKS
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            From blank page to polished resume in three steps.
          </h2>

          <p className="text-base sm:text-lg text-emerald-900/80 leading-relaxed font-normal">
            No formatting rabbit holes, no 3 a.m. design spirals. Just answers, choices, and a resume you're proud of.
          </p>
        </motion.div>

        {/* 3 Step Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/90 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6"
              >
                {/* Subtle Large Step Number Watermark */}
                <span className="absolute -top-3 -right-2 text-7xl font-black text-emerald-900/5 select-none pointer-events-none font-mono">
                  {step.num}
                </span>

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-extrabold text-emerald-950 text-2xl">
                    {step.title}
                  </h3>

                  <p className="text-emerald-900/80 text-sm leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 relative z-10">
                  <button
                    onClick={step.onClick}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors cursor-pointer group"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
