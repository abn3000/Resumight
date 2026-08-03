import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '../types';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "Is Resumight completely free for students and job seekers?",
      answer: "Yes! Resumight is built specifically to help students and early career candidates create, tailor, and export resumes without paywalls, hidden fees, or subscriptions."
    },
    {
      question: "How does the Tailor feature work?",
      answer: "Simply paste your current resume bullets and the job posting description into the Tailor workbench. Resumight analyzes required ATS keywords, identifies missing skills, and suggests tailored bullet point rewrites to increase your interview match rate."
    },
    {
      question: "Are the exported resumes ATS-compliant?",
      answer: "Absolutley. Every template layout (Swiss, Serif, Spearmint, Coral) strictly adheres to ATS parsing standard formatting — single column hierarchy, standard system typography, clean section headers, and no hidden table traps."
    },
    {
      question: "How does the voice-to-resume feature work?",
      answer: "Instead of typing out every detail, you can tap the microphone button in Resumaker and describe your projects, internships, or student leadership naturally. Resumight automatically categorizes what you say into the proper sections."
    },
    {
      question: "Can I export my resume as a PDF?",
      answer: "Yes, you can generate and download a crisp, high-resolution PDF or copy the raw formatted text into your clipboard with a single click."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            Got questions? We've got answers.
          </h2>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl border border-white/90 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-extrabold text-emerald-950 text-base sm:text-lg cursor-pointer hover:bg-white/40 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {f.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-700 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-emerald-900/80 text-sm sm:text-base leading-relaxed border-t border-emerald-100/60 font-normal animate-in fade-in">
                    {f.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
