import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Wand2, Target, Info } from 'lucide-react';
import { NavTab } from '../types';

interface BlankSectionProps {
  section: NavTab;
  onBackToHome: () => void;
  onJumpToSection?: (elementId: string) => void;
}

export const BlankSection: React.FC<BlankSectionProps> = ({ section, onBackToHome, onJumpToSection }) => {
  const configs = {
    about: {
      title: "About Resumight",
      subtitle: "Empowering new job seekers and university students with AI-assisted resume building.",
      icon: Info,
      badge: "ABOUT SECTION",
      desc: "Resumight was created to solve the formatting headaches, ATS parser failures, and bullet point writer's block faced by students transitioning into the job market. This page is kept clean as requested.",
      actionLabel: "Back to Home",
      anchorId: undefined,
    },
    resumaker: {
      title: "Resumaker Engine",
      subtitle: "Type or talk to generate clean, ATS-compliant resumes in seconds.",
      icon: Wand2,
      badge: "RESUMAKER SECTION",
      desc: "The full Resumaker workspace lets students select templates (Swiss, Serif, Spearmint, Coral), speak naturally into their microphone, and download customized PDFs.",
      actionLabel: "See Resumaker Preview on Home",
      anchorId: "how-it-works",
    },
    tailor: {
      title: "Job Tailor Workbench",
      subtitle: "Match your resume to specific job postings and target missing keywords.",
      icon: Target,
      badge: "TAILOR SECTION",
      desc: "Paste your raw resume draft and any target internship or full-time job description to calculate match scores and generate instant bullet rewrites.",
      actionLabel: "Try Tailor Workbench on Home",
      anchorId: "tailor-section",
    },
    home: {
      title: "Home",
      subtitle: "",
      icon: Sparkles,
      badge: "",
      desc: "",
      actionLabel: "",
      anchorId: undefined,
    }
  };

  const info = configs[section] || configs.about;
  const Icon = info.icon;

  return (
    <div className="min-h-[70vh] py-16 px-4 sm:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full glass-panel rounded-3xl p-8 sm:p-12 border border-white/90 shadow-2xl text-center space-y-6 backdrop-blur-2xl bg-white/70"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
          <Icon className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
          {info.badge}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          {info.title}
        </h1>

        <p className="text-base text-emerald-900/80 leading-relaxed font-normal">
          {info.desc}
        </p>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-xs text-emerald-800 font-medium">
          💡 This section tab is reserved for full app expansion. The landing page includes live interactive previews for all these features!
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              onBackToHome();
              if (info.anchorId && onJumpToSection) {
                setTimeout(() => onJumpToSection(info.anchorId!), 100);
              }
            }}
            className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {info.actionLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
