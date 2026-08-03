import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Sparkles, Upload, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';

export const TailorSection: React.FC = () => {
  const [resumeText, setResumeText] = useState(
    "Alex Morgan\nProduct Design Intern & CS Major\n\nExperience:\n- Built React components for campus marketplace app.\n- Conducted user interviews with 15 students.\n- Collaborated with developers using GitHub and Figma."
  );

  const [jobDescription, setJobDescription] = useState(
    "We are seeking a UI/UX Product Design Intern. Requirements:\n- Proficiency in Figma, Design Systems, and React.\n- Strong understanding of user research & usability testing.\n- Experience with accessibility standards (WCAG) and rapid prototyping."
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleJobs = [
    {
      title: "UI/UX Product Intern @ Figma",
      desc: "Seeking a UI/UX Design Intern proficient in Figma, Design Systems, React, user research, and accessibility standards."
    },
    {
      title: "Software Engineering Intern @ Google",
      desc: "Looking for CS students with Python/TypeScript, Data Structures, Git, REST APIs, and team collaboration experience."
    },
    {
      title: "Marketing Coordinator @ Canva",
      desc: "Seeking a creative Marketing student with Social Media strategy, Content Writing, SEO, and Analytics skills."
    }
  ];

  const handleRunTailor = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="tailor-section" className="py-20 px-4 sm:px-8 relative overflow-hidden bg-emerald-50/40">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-200/30 via-teal-200/20 to-emerald-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300/60 text-xs font-bold uppercase tracking-wider text-emerald-900 font-mono">
            TAILOR TOOL
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
            Fit your resume to the job, every time.
          </h2>
          <p className="text-base sm:text-lg text-emerald-900/80 leading-relaxed font-normal">
            Bring in a finished resume, paste the job description, and Resumight highlights what matches, flags what's missing, and reorders your skills to lead with what this role cares about most.
          </p>
        </motion.div>

        {/* Tailor Interactive Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Inputs: Resume + Job Description */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6"
          >
            {/* Input 1: Resume */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Bring in your resume
                </h3>
                <span className="text-xs text-emerald-700/80 font-medium">Text or drop .txt</span>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full p-4 rounded-2xl glass-input text-emerald-950 text-xs sm:text-sm font-mono leading-relaxed resize-none"
                  placeholder="Paste your current resume bullets here..."
                />
              </div>
            </div>

            {/* Input 2: Job Posting */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Paste target job description
                </h3>
                <span className="text-xs text-emerald-800/80 font-medium">Or load sample:</span>
              </div>

              {/* Sample job chips */}
              <div className="flex flex-wrap gap-2">
                {sampleJobs.map((sj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setJobDescription(sj.desc)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100/70 hover:bg-emerald-200/80 text-[11px] font-bold text-emerald-900 transition-colors cursor-pointer"
                  >
                    {sj.title}
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-4 rounded-2xl glass-input text-emerald-950 text-xs sm:text-sm font-mono leading-relaxed resize-none"
                placeholder="Paste the job posting description here..."
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunTailor}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/40 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing Match & Rewriting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  Tailor my resume now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>

          {/* Right Column: Tailored Analysis Output */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6 min-h-[420px] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-emerald-950 text-lg">Match Breakdown</h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                  {analyzed ? '88% Match' : 'Waiting for input'}
                </span>
              </div>

              {!analyzed && !isAnalyzing && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Target className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-950 text-base">Ready for comparison</h4>
                  <p className="text-xs text-emerald-800 max-w-xs mx-auto">
                    Add a resume and job description on the left, then click "Tailor my resume" to see your tailored match score and missing keywords.
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="py-16 text-center space-y-4">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-emerald-950">
                    Extracting ATS keywords & optimizing bullet points...
                  </p>
                </div>
              )}

              {analyzed && !isAnalyzing && (
                <div className="space-y-5 pt-4 animate-in fade-in">
                  
                  {/* Score Bar */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-1.5">
                      <span>ATS Keyword Alignment</span>
                      <span className="text-emerald-700 font-extrabold">88%</span>
                    </div>
                    <div className="w-full bg-emerald-100 h-3 rounded-full overflow-hidden p-0.5">
                      <div className="bg-emerald-600 h-full rounded-full w-[88%] shadow-sm transition-all duration-700" />
                    </div>
                  </div>

                  {/* Matches vs Missing */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Matched Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["Figma", "React", "User Research", "Agile Collaboration"].map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 text-xs font-bold">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Recommended Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["Design Systems", "Accessibility (WCAG)", "Prototyping"].map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-amber-100/80 text-amber-950 text-xs font-bold border border-amber-200">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tailored Bullet Rewrite */}
                  <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                        Tailored Bullet Suggestion
                      </span>
                      <button
                        onClick={handleCopy}
                        className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                      "Engineered responsive React user interfaces and established a unified Figma Design System, ensuring WCAG 2.1 accessibility compliance for 15+ student research participants."
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* Bottom Note */}
            <div className="pt-4 border-t border-emerald-100 text-[11px] text-emerald-800/80 font-medium">
              💡 Tip: Resumight keeps your original data safe and lets you export multiple target versions.
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
