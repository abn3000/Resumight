import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Sparkles, Star, Quote, GraduationCap, FileCheck, Target, MessageSquare } from 'lucide-react';

interface HeroSectionProps {
  onBuildClick: () => void;
  onExploreClick: () => void;
  onCoachClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuildClick, onExploreClick, onCoachClick }) => {
  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-8 overflow-hidden">
      {/* Subtle Math/Dot Grid Background - authentic student notebook feel */}
      <div className="absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/70 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span className="text-xs sm:text-xs font-bold tracking-wider uppercase text-emerald-900 font-mono">
              STUDENT BUILT // 100% FREE FOR EARLY CAREERS
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-emerald-950 tracking-tight leading-[1.1]">
            Resumes that get <span className="text-emerald-700 underline decoration-emerald-300/80 decoration-wavy decoration-2 underline-offset-8">internships</span>, not rejections.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-emerald-900/80 max-w-2xl font-normal leading-relaxed">
            Built by students who got tired of Google Docs margins breaking at 2 a.m. Resumight helps you build clean ATS-proof resumes, tailor them to job postings, and practice your pitch with a free AI coach.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={onBuildClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-emerald-600/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              Build your resume
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-panel hover:bg-white text-emerald-950 font-bold text-sm sm:text-base transition-all duration-200 border border-emerald-200/80 shadow-2xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              How it works
            </button>

            {onCoachClick && (
              <button
                onClick={onCoachClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-100/70 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm transition-all border border-emerald-200/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Practice with Coach
              </button>
            )}
          </div>

          {/* Bullet List */}
          <div className="pt-2 flex flex-col gap-2.5">
            {[
              "Turn coursework, club roles & capstones into high-impact bullet points",
              "Match ATS keywords and fix gaps for specific job postings in 1 click",
              "Ace 'Tell me about yourself' and STAR stories with our built-in Coach"
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-emerald-900 font-medium text-xs sm:text-sm">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column Authentic Student Showcase Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          {/* Card Frame with Student Blueprint Style */}
          <div className="relative glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-200/90 shadow-xl bg-white/90 space-y-5">
            
            {/* Top Student Profile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ML
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-emerald-950 text-base leading-tight">Maya Lin</h3>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      '26
                    </span>
                  </div>
                  <p className="text-emerald-800/80 text-xs font-semibold">CS & Cognitive Science @ UC Berkeley</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2 py-1 rounded-lg">
                  Target: Software Intern
                </span>
              </div>
            </div>

            {/* Before vs After Student Bullet Transformation */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Real Student Bullet Transformation
              </div>

              {/* Before box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Original Class Project Bullet:</div>
                <p className="text-xs text-slate-600 italic">
                  "Worked on a React website in our group project and helped fix bugs and make the UI look good."
                </p>
              </div>

              {/* After box */}
              <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-800 uppercase">
                  <span>Resumight Tailored:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-200/70 px-1.5 py-0.2 rounded">ATS Score: 96%</span>
                </div>
                <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                  "Architected modular course planner in React & TypeScript, adopted by 1,400+ campus students with 99.8% uptime."
                </p>
              </div>
            </div>

            {/* Genuine Student Testimonial */}
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-100/90 text-emerald-950 text-xs leading-relaxed space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[11px] text-emerald-800 font-bold ml-1">Landed 4 interview callbacks</span>
              </div>
              <p className="text-emerald-900/90 italic font-medium">
                "Other sites lock your download behind a $20 paywall after you finish typing. Resumight lets you build, tailor for job listings, and download clean PDFs for free."
              </p>
            </div>

            {/* Student Tags */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-900">
                🎓 1-Page Layout Lock
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-900">
                ⚡ 0 Paywalls
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-900">
                🎯 Recruiter-Ready
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
