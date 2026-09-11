import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, FileCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface WhatsInsideSectionProps {
  onBuildClick: () => void;
}

export const WhatsInsideSection: React.FC<WhatsInsideSectionProps> = ({ onBuildClick }) => {
  const [activeTemplate, setActiveTemplate] = useState<'swiss' | 'serif' | 'spearmint' | 'coral'>('swiss');
  const [showComparison, setShowComparison] = useState(false);

  const templateDetails = {
    swiss: {
      title: "Swiss Template",
      subtitle: "Clean, structured, modern. Ideal for Tech, Design, and Product roles.",
      fontFamily: "font-sans",
      headerBg: "border-b-2 border-emerald-600 pb-2",
      colorClass: "text-emerald-800",
    },
    serif: {
      title: "Serif Template",
      subtitle: "Classic & authoritative. Perfect for Finance, Law, Consulting, and Academia.",
      fontFamily: "font-serif",
      headerBg: "border-b border-emerald-900 pb-2",
      colorClass: "text-emerald-950",
    },
    spearmint: {
      title: "Spearmint Template",
      subtitle: "Fresh sidebar layout highlighting key skills and student projects.",
      fontFamily: "font-sans",
      headerBg: "bg-emerald-100 p-3 rounded-xl",
      colorClass: "text-teal-900",
    },
    coral: {
      title: "Coral Template",
      subtitle: "Bold top header banner with clean bullet contrast.",
      fontFamily: "font-sans",
      headerBg: "bg-emerald-600 text-white p-4 rounded-t-xl",
      colorClass: "text-emerald-600",
    },
  };

  const curr = templateDetails[activeTemplate];

  return (
    <section className="py-16 px-4 sm:px-8 relative overflow-hidden bg-slate-100/60 border-y-2 border-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950 font-mono ">
              WHAT'S INSIDE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Polished layouts designed to stand out.
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              Explore four distinct resume aesthetics built specifically to highlight student experience, internships, and capstone achievements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 rounded-lg bg-white text-xs font-black font-mono text-slate-950 border-2 border-slate-900 hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              {showComparison ? 'View Template Cards' : 'Before vs After Resumight'}
            </button>
          </div>
        </motion.div>

        {!showComparison ? (
          /* Template Gallery */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Template Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {[
                { id: 'swiss', label: 'Swiss', desc: 'Modern & structured' },
                { id: 'serif', label: 'Serif', desc: 'Classic academic' },
                { id: 'spearmint', label: 'Spearmint', desc: 'Fresh sidebar' },
                { id: 'coral', label: 'Coral', desc: 'Bold header banner' },
              ].map((t) => {
                const isSel = activeTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id as any)}
                    className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between border-2 border-slate-900 ${
                      isSel
                        ? 'bg-emerald-300 '
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h3 className="font-black text-slate-950 text-base">{t.label} Layout</h3>
                      <p className="text-xs text-slate-700 font-mono font-bold">{t.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded border border-slate-900 flex items-center justify-center font-bold text-xs ${
                      isSel ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
                    }`}>
                      {isSel ? '✓' : '→'}
                    </div>
                  </button>
                );
              })}

              <div className="p-5 rounded-xl border-2 border-slate-900 bg-white space-y-3">
                <h4 className="font-black text-slate-950 text-sm flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Included with every template:
                </h4>
                <ul className="text-xs text-slate-800 space-y-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Automatic margin & font size balancing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    One-page constraint locking option
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Live PDF render & raw text copy
                  </li>
                </ul>

                <button
                  onClick={onBuildClick}
                  className="w-full mt-2 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-xs border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Use {curr.title.split(' ')[0]} Layout Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Paper Preview Card */}
            <div 
              key={activeTemplate}
              className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-7 border-2 border-slate-900 relative min-h-[500px] flex flex-col justify-between"
            >
              <div className={`space-y-6 ${curr.fontFamily}`}>
                
                {/* Header Block */}
                <div className={curr.headerBg}>
                  <h3 className={`text-2xl font-bold tracking-tight ${activeTemplate === 'coral' ? 'text-white' : 'text-emerald-950'}`}>
                    ALEX MORGAN
                  </h3>
                  <p className={`text-xs font-medium ${activeTemplate === 'coral' ? 'text-emerald-100' : 'text-emerald-800'}`}>
                    alexmorgan@berkeley.edu • (555) 019-2834 • San Francisco, CA • linkedin.com/in/alexmorgan
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-100 pb-1">
                    Education
                  </h4>
                  <div className="flex justify-between text-xs text-emerald-950 font-bold">
                    <span>University of California, Berkeley</span>
                    <span>Expected May 2026</span>
                  </div>
                  <p className="text-xs text-emerald-800 italic">
                    B.S. in Computer Science & Cognitive Science • GPA: 3.8/4.0
                  </p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-100 pb-1">
                    Projects & Experience
                  </h4>
                  <div>
                    <div className="flex justify-between text-xs text-emerald-950 font-bold">
                      <span>Product Design & Software Intern • TechStart Incubator</span>
                      <span>Jun 2025 – Present</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-emerald-900/90 space-y-1 mt-1 font-normal">
                      <li>Designed & deployed React frontend for student food marketplace used by 2,500+ active users.</li>
                      <li>Spearheaded 12 user research sessions, increasing onboarding completion rate by 28%.</li>
                      <li>Automated build pipeline using GitHub Actions to streamline weekly releases.</li>
                    </ul>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-100 pb-1">
                    Technical Skills & Tools
                  </h4>
                  <p className="text-xs text-emerald-900 font-normal">
                    <strong>Languages & Web:</strong> TypeScript, React, Python, HTML5, CSS3, Tailwind CSS<br />
                    <strong>Design & Tools:</strong> Figma, Design Systems, Wireframing, Git, Postman, Jira
                  </p>
                </div>

              </div>

              {/* Watermark Tag */}
              <div className="pt-6 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-700 font-mono font-bold">
                <span>Resumight Output • ATS Compliant</span>
                <span>Page 1 of 1</span>
              </div>
            </div>

          </div>
        ) : (
          /* Before vs After Transformation */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="p-5 rounded-xl border-2 border-slate-900 bg-red-100 space-y-3">
              <div className="flex items-center gap-2 text-rose-950 font-black font-mono text-sm">
                <span className="w-5 h-5 rounded border border-slate-900 bg-rose-300 flex items-center justify-center text-xs">✕</span>
                Messy Unformatted Resume Draft
              </div>
              <div className="bg-white p-4 rounded-lg font-mono text-xs text-slate-800 space-y-2 border-2 border-slate-900 ">
                <p className="font-bold">alex morgan - student</p>
                <p>email: alex@gmail.com phone: 555-1234</p>
                <p className="pt-2 font-bold">Experience:</p>
                <p>i worked on a project in class where we made an app. it was in react and i helped with the css. also did some testing with friends.</p>
                <p className="pt-2 font-bold">Skills:</p>
                <p>coding, team player, fast learner, microsoft office, css, html</p>
              </div>
            </div>

            {/* After */}
            <div className="p-5 rounded-xl border-2 border-slate-900 bg-emerald-100 space-y-3 ">
              <div className="flex items-center gap-2 text-slate-950 font-black font-mono text-sm">
                <span className="w-5 h-5 rounded border border-slate-900 bg-emerald-400 flex items-center justify-center text-xs font-black">✓</span>
                Polished Resumight Resume
              </div>
              <div className="bg-white p-4 rounded-lg text-xs text-slate-950 space-y-2 border-2 border-slate-900 ">
                <p className="font-black text-sm text-slate-950 border-b-2 border-slate-900 pb-1">ALEX MORGAN</p>
                <p className="text-[11px] text-slate-700 font-mono">alexmorgan@berkeley.edu • (555) 123-4567 • San Francisco, CA</p>
                <p className="pt-1 font-black text-slate-950 uppercase text-[10px] tracking-wider font-mono">PROJECT EXPERIENCE</p>
                <p className="font-bold text-[11px]">Lead Frontend Developer • Campus React Application</p>
                <p className="text-[11px] font-medium leading-relaxed text-slate-800">
                  • Architected modular React & Tailwind CSS components, improving application rendering speed by 35%.<br />
                  • Directed usability testing with 15+ student participants to refine accessibility and navigation flows.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
