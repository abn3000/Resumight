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
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            WHY STUDENTS LOVE RESUMIGHT
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            Designed specifically for early careers & students.
          </h2>
          <p className="text-base sm:text-lg text-emerald-900/80 leading-relaxed font-normal">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="glass-panel glass-panel-hover rounded-3xl p-7 border border-white/90 shadow-lg space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    {feat.badge && (
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-emerald-950 text-xl leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-emerald-900/80 text-sm font-normal leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Built for student success</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
