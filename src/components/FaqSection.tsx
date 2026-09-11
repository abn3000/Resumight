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
    <section className="py-16 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-xs font-black uppercase tracking-wider text-slate-950 font-mono ">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Got questions? We've got answers.
          </h2>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-xl border-2 border-slate-900 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-black text-slate-950 text-base cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {f.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-900 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 pt-2 text-slate-800 text-sm leading-relaxed border-t-2 border-slate-200 font-medium">
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
