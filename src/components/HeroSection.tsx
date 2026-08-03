import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Sparkles, Star, Quote } from 'lucide-react';

interface HeroSectionProps {
  onBuildClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuildClick, onExploreClick }) => {
  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-8 overflow-hidden">
      {/* Light Glass Ambient Gradient Orbs in Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-200/40 via-teal-200/30 to-emerald-100/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/50 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-900 font-mono">
              BEAUTIFUL RESUMES DON'T HAVE TO BE HARD
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-emerald-950 tracking-tight leading-[1.1]">
            Make a <span className="text-emerald-700">polished resume</span> in minutes.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-emerald-900/80 max-w-2xl font-normal leading-relaxed">
            Create a clean, confident resume that feels custom — tailored specifically for students and early job seekers, without the stress of formatting or design.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onBuildClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group cursor-pointer"
            >
              Build your resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel hover:bg-white/90 text-emerald-950 font-bold text-base transition-all duration-300 border border-white/90 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              See what's inside
            </button>
          </div>

          {/* Bullet List */}
          <div className="pt-4 flex flex-col gap-3">
            {[
              "Smart, modern ATS-optimized templates",
              "Fast editing and one-click job description tailoring",
              "Clean layout that feels effortless and tailored for students"
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3 text-emerald-900 font-medium text-sm sm:text-base">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column Glass Visual Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          {/* Subtle Glow Behind Glass Frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-300/20 rounded-3xl filter blur-xl transform rotate-2 scale-95" />

          {/* Main Glass Floating Card */}
          <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl backdrop-blur-2xl bg-white/70 space-y-6">
            
            {/* Top User Profile Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-emerald-100/60">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                  BP
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-lg leading-tight">Bruce Poon Tip</h3>
                <p className="text-emerald-800/70 text-xs font-semibold">Owner at G Adventures</p>
                <div className="flex items-center gap-1 text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-emerald-900/60 font-semibold ml-1">Global Leader</span>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 text-emerald-950 text-xs font-semibold italic leading-relaxed relative">
              <Quote className="w-6 h-6 text-emerald-300 absolute top-2 right-2 opacity-60" />
              *Resumight is not actually affiliated with BPT
            </div>

            {/* Skeleton / Live Mini Preview Representation */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-emerald-800/60">
                <span>ATS Compatibility Score</span>
                <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">96% Excellent</span>
              </div>
              <div className="w-full bg-emerald-100/60 h-2.5 rounded-full overflow-hidden p-0.5">
                <div className="bg-emerald-500 h-full rounded-full w-[96%] transition-all duration-1000 shadow-sm" />
              </div>

              {/* Sample Tag Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-emerald-200/60 text-xs font-medium text-emerald-900 shadow-2xs">
                  ✨ React & TypeScript
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-emerald-200/60 text-xs font-medium text-emerald-900 shadow-2xs">
                  ✨ Agile Coursework
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-emerald-200/60 text-xs font-medium text-emerald-900 shadow-2xs">
                  ✨ Product Management
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
