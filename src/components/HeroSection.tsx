import React from 'react';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

interface HeroSectionProps {
  onBuildClick: () => void;
  onExploreClick: () => void;
  onCoachClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuildClick, onExploreClick, onCoachClick }) => {
  return (
    <section className="relative py-8 md:py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-5">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-yellow-300 border-2 border-slate-900">
            <GraduationCap className="w-4 h-4 text-slate-950" />
            <span className="text-xs font-black tracking-wider uppercase text-slate-950">
              STUDENT PROJECT // 100% FREE
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
            Resumes that get{' '}
            <span className="bg-emerald-300 px-2 py-0.5 border-2 border-slate-900 inline-block -rotate-1 rounded-sm">
              internships
            </span>
            , not rejections.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-900 max-w-xl font-medium leading-relaxed bg-white p-3 rounded-sm border-2 border-slate-900">
            Built by students who got tired of Google Docs breaking at 2 a.m. Resumight helps you write clean ATS-proof resumes, tailor them to job postings, and practice your pitch without paying $20/month.
          </p>

          {/* CTA Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBuildClick}
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              Build your resume
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-5 py-3 rounded-sm bg-white hover:bg-slate-100 text-slate-950 font-black text-sm border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              Tailor to job
            </button>

            {onCoachClick && (
              <button
                onClick={onCoachClick}
                className="w-full sm:w-auto px-4 py-3 rounded-sm bg-amber-200 hover:bg-amber-100 text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-900 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                Practice with Coach
              </button>
            )}
          </div>
        </div>

        {/* Right Column Blocky Student Card */}
        <div className="lg:col-span-5 relative">
          {/* Card Frame - Flat & Blocky */}
          <div className="rounded-sm p-5 sm:p-6 border-2 border-slate-900 bg-white space-y-4">
            
            {/* Top Student Profile Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black text-base">
                  ML
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-slate-950 text-base leading-tight">Maya Lin</h3>
                    <span className="text-[10px] font-bold bg-amber-300 border border-slate-900 text-slate-950 px-1.5 py-0.5 rounded-sm">
                      '26
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs font-bold">CS & CogSci @ UC Berkeley</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-950 bg-slate-100 border-2 border-slate-900 px-2 py-1 rounded-sm">
                  Software Intern
                </span>
              </div>
            </div>

            {/* Before vs After Student Bullet Transformation */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                Student Bullet Transformation
              </div>

              {/* Before box */}
              <div className="p-3 rounded-sm bg-slate-100 border-2 border-dashed border-slate-400 space-y-1">
                <div className="text-[10px] font-bold text-slate-600 uppercase">Original Draft Bullet:</div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "Worked on a React website in our group project and helped fix bugs and make the UI look good."
                </p>
              </div>

              {/* After box */}
              <div className="p-3 rounded-sm bg-emerald-100 border-2 border-slate-900 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-950 uppercase">
                  <span>Resumight Tailored:</span>
                  <span className="bg-emerald-300 border border-slate-900 px-1.5 py-0.5 rounded-sm text-[10px]">ATS Score: 96%</span>
                </div>
                <p className="text-xs font-bold text-slate-950 leading-relaxed">
                  "Architected modular course planner in React & TypeScript, adopted by 1,400+ campus students with 99.8% uptime."
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
