import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Sparkles, Upload, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Copy, Check, ArrowLeft, Wand2 } from 'lucide-react';

interface TailorTabProps {
  onBackToHome: () => void;
  onGoToResumaker: () => void;
}

export const TailorTab: React.FC<TailorTabProps> = ({ onBackToHome, onGoToResumaker }) => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const SAMPLE_RESUME = "Alex Morgan\nProduct Design & CS Major at UC Berkeley\n\nExperience:\n- Built React components for campus student app.\n- Conducted user interviews with 15 students to refine UX.\n- Collaborated with software engineers using Git and Figma.";

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedBulletIndex, setCopiedBulletIndex] = useState<number | null>(null);

  const [tailoredResult, setTailoredResult] = useState<{
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    tailoredResumeText: string;
    bulletRewrites: { original: string; tailored: string; reasoning: string }[];
    summaryFeedback: string;
  } | null>(null);

  const sampleJobs = [
    {
      title: "UI/UX Product Intern @ Figma",
      desc: "Seeking a UI/UX Design Intern proficient in Figma, Design Systems, React, user research, and accessibility standards (WCAG)."
    },
    {
      title: "Software Engineering Intern @ Google",
      desc: "Looking for CS students with Python/TypeScript, Data Structures, Git, REST APIs, CI/CD pipelines, and team collaboration."
    },
    {
      title: "Product Marketing Intern @ Canva",
      desc: "Seeking a creative Marketing student with Social Media strategy, Content Writing, SEO, Market Research, and Analytics skills."
    }
  ];

  const handleRunTailor = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both your resume text and target job description.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();

      if (data.success) {
        setTailoredResult({
          matchScore: data.matchScore || 85,
          matchedKeywords: data.matchedKeywords || [],
          missingKeywords: data.missingKeywords || [],
          tailoredResumeText: data.tailoredResumeText || '',
          bulletRewrites: data.bulletRewrites || [],
          summaryFeedback: data.summaryFeedback || '',
        });
        setAnalyzed(true);
      } else {
        setError(data.error || 'Tailoring failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Tailor error:', err);
      setError('Failed to reach AI server. Please check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl bg-gradient-to-r from-emerald-100/70 via-teal-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider font-mono shadow-sm">
            JOB TAILOR WORKBENCH
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Fit your resume to any job posting.
          </h1>
          <p className="text-emerald-900/80 text-sm sm:text-base font-normal max-w-2xl">
            Paste your resume bullets and the target job description. Tailor identifies ATS keyword gaps, calculates your match score, and rewrites bullet points for maximum impact.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToHome}
            className="px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-emerald-950 border border-emerald-200 hover:bg-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs: Resume + Job Posting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6"
        >
          {/* Resume Input Block */}
          <div className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                Your Resume Text
              </h2>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-bold px-3 py-1 rounded-lg bg-emerald-100/70 border border-emerald-200 cursor-pointer"
                >
                  Load sample
                </button>
                {/* Upload file option */}
                <label className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 cursor-pointer bg-emerald-100/70 px-3 py-1 rounded-lg border border-emerald-200">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  Upload .txt resume
                  <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <textarea
              rows={5}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 rounded-2xl glass-input text-emerald-950 text-xs sm:text-sm font-mono leading-relaxed resize-none"
              placeholder="Paste your resume text here..."
            />
          </div>

          {/* Job Description Input Block */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Target Job Description
              </h2>
              <span className="text-xs text-emerald-800/80 font-medium">Or load sample role:</span>
            </div>

            {/* Sample role chips */}
            <div className="flex flex-wrap gap-2">
              {sampleJobs.map((sj, idx) => (
                <button
                  key={idx}
                  onClick={() => setJobDescription(sj.desc)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100/80 hover:bg-emerald-200 text-[11px] font-bold text-emerald-900 transition-colors cursor-pointer"
                >
                  {sj.title}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-4 rounded-2xl glass-input text-emerald-950 text-xs sm:text-sm font-mono leading-relaxed resize-none"
              placeholder="Paste the target job description here..."
            />
          </div>

          {/* Tailor Button */}
          <button
            onClick={handleRunTailor}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-600/25 hover:shadow-2xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing Match & Optimizing Bullets...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                Tailor My Resume Now
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>

        {/* Right Column: Tailored Analysis & Rewrites */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6 min-h-[460px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-950 text-lg">ATS Match Breakdown</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono">
                {analyzed && tailoredResult ? `${tailoredResult.matchScore}% Match` : 'Ready'}
              </span>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-100 text-rose-950 text-xs font-semibold border border-rose-200">
                {error}
              </div>
            )}

            {!analyzed && !isAnalyzing && (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-950 text-base">Comparison Workbench</h4>
                <p className="text-xs text-emerald-800 max-w-xs mx-auto">
                  Enter your resume and job posting on the left, then click "Tailor My Resume Now" to view your ATS compatibility score, missing buzzwords, and full rewritten resume!
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="py-16 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-emerald-950">
                  Gemini AI scanning ATS keywords & crafting full tailored resume...
                </p>
              </div>
            )}

            {analyzed && !isAnalyzing && tailoredResult && (
              <div className="space-y-6 pt-4 animate-in fade-in">
                
                {/* Score Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-950 mb-1.5">
                    <span>ATS Keyword Match Score</span>
                    <span className="text-emerald-700 font-extrabold text-sm">{tailoredResult.matchScore}%</span>
                  </div>
                  <div className="w-full bg-emerald-100 h-3 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-emerald-600 h-full rounded-full shadow-sm transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(10, tailoredResult.matchScore))}%` }}
                    />
                  </div>
                </div>

                {/* Matches vs Missing */}
                <div className="space-y-3">
                  {tailoredResult.matchedKeywords.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Matched Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tailoredResult.matchedKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 text-xs font-bold">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tailoredResult.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Added Buzzwords & Target Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tailoredResult.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-amber-100/90 text-amber-950 text-xs font-bold border border-amber-200">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FULL TAILORED RESUME BOX */}
                <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Full Tailored Resume
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tailoredResult.tailoredResumeText);
                          setCopiedResume(true);
                          setTimeout(() => setCopiedResume(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedResume ? 'Copied Full Resume' : 'Copy Full Text'}
                      </button>

                      <button
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([tailoredResult.tailoredResumeText], {type: 'text/plain'});
                          element.href = URL.createObjectURL(file);
                          element.download = "Tailored_Resume_Resumight.txt";
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        Download .txt
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-64 overflow-y-auto text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-text">
                    {tailoredResult.tailoredResumeText}
                  </div>
                </div>

                {/* Key Bullet Point Transformations */}
                {tailoredResult.bulletRewrites.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Targeted Bullet Point Transformations
                    </h4>
                    {tailoredResult.bulletRewrites.map((rw, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800">
                          <span>BEFORE</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(rw.tailored);
                              setCopiedBulletIndex(i);
                              setTimeout(() => setCopiedBulletIndex(null), 2000);
                            }}
                            className="text-emerald-700 hover:text-emerald-950 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedBulletIndex === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedBulletIndex === i ? 'Copied Bullet' : 'Copy Tailored'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 line-through">{rw.original}</p>

                        <div className="text-[10px] font-bold text-emerald-700 pt-1">AFTER (OPTIMIZED)</div>
                        <p className="text-xs font-semibold text-emerald-950 leading-relaxed bg-emerald-50/80 p-2 rounded-lg border border-emerald-100">
                          "{rw.tailored}"
                        </p>
                        <p className="text-[11px] text-emerald-800/90 italic pt-0.5">💡 {rw.reasoning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strategic Advice */}
                {tailoredResult.summaryFeedback && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Strategic AI Advice
                    </div>
                    <p className="text-emerald-900/90 leading-relaxed font-normal">{tailoredResult.summaryFeedback}</p>
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
            <button
              onClick={onGoToResumaker}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
              Need a fresh resume draft? Open Resumaker →
            </button>
          </div>
        </motion.div>

      </div>

    </div>
  );
};
