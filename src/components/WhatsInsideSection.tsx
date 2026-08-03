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
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden bg-emerald-100/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
              WHAT'S INSIDE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
              Polished layouts designed to stand out.
            </h2>
            <p className="text-base sm:text-lg text-emerald-900/80 leading-relaxed">
              Explore four distinct resume aesthetics built specifically to highlight student experience, internships, and capstone achievements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-5 py-2.5 rounded-xl glass-panel text-xs font-bold text-emerald-950 border border-emerald-200 hover:bg-white transition-all cursor-pointer flex items-center gap-2"
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
            <div className="lg:col-span-5 space-y-4">
              {[
                { id: 'swiss', label: 'Swiss', desc: 'Modern & structured' },
                { id: 'serif', label: 'Serif', desc: 'Classic academic' },
                { id: 'spearmint', label: 'Spearmint', desc: 'Fresh sidebar' },
                { id: 'coral', label: 'Coral', desc: 'Bold header banner' },
              ].map((t) => {
                const isSel = activeTemplate === t.id;
                return (
                  <motion.button
                    key={t.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTemplate(t.id as any)}
                    className={`w-full p-5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between border ${
                      isSel
                        ? 'glass-panel bg-white/95 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                        : 'glass-panel bg-white/60 border-emerald-100 hover:bg-white/80'
                    }`}
                  >
                    <div>
                      <h3 className="font-extrabold text-emerald-950 text-base">{t.label} Layout</h3>
                      <p className="text-xs text-emerald-800/80">{t.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSel ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isSel ? '✓' : '→'}
                    </div>
                  </motion.button>
                );
              })}

              <div className="p-6 rounded-3xl glass-panel border border-white/90 space-y-3">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Included with every template:
                </h4>
                <ul className="text-xs text-emerald-900 space-y-2 font-medium">
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
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Use {curr.title.split(' ')[0]} Layout Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Paper Preview Card */}
            <motion.div 
              key={activeTemplate}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-7 bg-white rounded-3xl p-8 border border-emerald-100 shadow-2xl relative min-h-[500px] flex flex-col justify-between"
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
              <div className="pt-6 border-t border-emerald-100 flex justify-between items-center text-[10px] text-emerald-800 font-sans font-semibold">
                <span>Resumight Output • ATS Compliant</span>
                <span>Page 1 of 1</span>
              </div>
            </motion.div>

          </div>
        ) : (
          /* Before vs After Transformation */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="glass-panel p-6 rounded-3xl border border-red-200/80 bg-red-50/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-xs">✕</span>
                Messy Unformatted Resume Draft
              </div>
              <div className="bg-white/80 p-4 rounded-2xl font-mono text-xs text-slate-700 space-y-2 border border-rose-100">
                <p className="font-bold">alex morgan - student</p>
                <p>email: alex@gmail.com phone: 555-1234</p>
                <p className="pt-2 font-bold">Experience:</p>
                <p>i worked on a project in class where we made an app. it was in react and i helped with the css. also did some testing with friends.</p>
                <p className="pt-2 font-bold">Skills:</p>
                <p>coding, team player, fast learner, microsoft office, css, html</p>
              </div>
            </div>

            {/* After */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-300 bg-emerald-50/50 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                Polished Resumight Resume
              </div>
              <div className="bg-white p-4 rounded-2xl text-xs text-emerald-950 space-y-2 border border-emerald-200 shadow-sm">
                <p className="font-extrabold text-sm text-emerald-900 border-b border-emerald-100 pb-1">ALEX MORGAN</p>
                <p className="text-[11px] text-emerald-800">alexmorgan@berkeley.edu • (555) 123-4567 • San Francisco, CA</p>
                <p className="pt-1 font-bold text-emerald-900 uppercase text-[10px] tracking-wider">PROJECT EXPERIENCE</p>
                <p className="font-bold text-[11px]">Lead Frontend Developer • Campus React Application</p>
                <p className="text-[11px] font-normal leading-relaxed text-emerald-900">
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
