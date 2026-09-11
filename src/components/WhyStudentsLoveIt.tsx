import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ShieldCheck, Zap, Download, Sparkles, BookOpen, FileCheck, Layers } from 'lucide-react';

export const WhyStudentsLoveIt: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Coursework & Project Translator",
      desc: "Turn university capstones, group projects, and club leadership into impactful, recruiter-ready bullet points with metrics.",
      badge: "Student Essential"
    },
    {
      icon: ShieldCheck,
      title: "100% ATS-Proof Formatting",
      desc: "Never worry about resume parser errors. Resumight exports clean, standardized PDF and text layouts guaranteed to pass ATS.",
      badge: "ATS Certified"
    },
    {
      icon: Zap,
      title: "Create & Tailor in Minutes",
      desc: "Stop spending hours wrestling with Google Docs or Word templates. Generate custom, job-specific resumes in seconds.",
      badge: "Fast & Easy"
    },
    {
      icon: Download,
      title: "Instant Free PDF Exports",
      desc: "Download high-resolution PDFs or copy raw text anytime without paywalls, hidden fees, or subscriptions.",
      badge: "Free Access"
    },
    {
      icon: BookOpen,
      title: "Smart Action-Verb Engine",
      desc: "Auto-replaces passive phrasing ('worked on', 'helped with') with high-energy action verbs ('spearheaded', 'architected', 'optimized').",
      badge: "AI Powered"
    },
    {
      icon: Layers,
      title: "4 Beautiful Aesthetic Themes",
      desc: "Switch effortlessly between Swiss, Serif, Spearmint, and Coral layouts with custom accent color palettes.",
      badge: "Custom Styling"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950 font-mono ">
            WHY STUDENTS LOVE RESUMIGHT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Designed specifically for early careers & students.
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Whether you are applying for your first internship, co-op placement, or graduate job, Resumight handles the heavy lifting so you stand out immediately.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-xl p-5 border-2 border-slate-900 bg-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-emerald-400 border-2 border-slate-900 text-slate-950 flex items-center justify-center font-black ">
                      <Icon className="w-5 h-5" />
                    </div>
                    {feat.badge && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-900 ">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-slate-950 text-lg leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student verified</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
