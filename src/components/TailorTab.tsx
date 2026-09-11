import React, { useState, useRef } from 'react';
import { Target, Sparkles, Upload, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Copy, Check, ArrowLeft, Wand2, Loader2, FileUp, FileText } from 'lucide-react';

interface TailorTabProps {
  onBackToHome: () => void;
  onGoToResumaker: () => void;
  onGoToCoach?: () => void;
  onGoToPrep?: () => void;
}

export const TailorTab: React.FC<TailorTabProps> = ({ onBackToHome, onGoToResumaker, onGoToCoach, onGoToPrep }) => {
  const handleCoach = onGoToCoach || onGoToPrep;
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const SAMPLE_RESUME = "Alex Morgan\nProduct Design & CS Major at UC Berkeley\n\nExperience:\n- Built React components for campus student app.\n- Conducted user interviews with 15 students to refine UX.\n- Collaborated with software engineers using Git and Figma.";

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedBulletIndex, setCopiedBulletIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const processUploadedFile = async (file: File) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    setUploadFileName(file.name);
    setError(null);

    // If it's a PDF, call our Gemini /api/parse-pdf endpoint to get the full formatted text
    if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
      setIsUploadingFile(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          if (!result) {
            setError('Could not read PDF file.');
            setIsUploadingFile(false);
            return;
          }

          try {
            const res = await fetch('/api/parse-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileBase64: result,
                mimeType: 'application/pdf',
                fileName: file.name,
              }),
            });

            const data = await res.json();
            if (data.success && (data.rawResumeText || data.updatedFields)) {
              let textToSet = data.rawResumeText;
              if (!textToSet && data.updatedFields) {
                const u = data.updatedFields;
                textToSet = `${u.name || ''}\n${u.role || ''} • ${u.email || ''} • ${u.phone || ''}\n${u.location || ''} • ${u.linkedin || ''}\n\nSUMMARY\n${u.summary || ''}\n\nEXPERIENCE\n${u.experience || ''}\n\nEDUCATION\n${u.education || ''}\n\nSKILLS\n${u.skills || ''}\n\nACTIVITIES\n${u.activities || ''}`.trim();
              }
              setResumeText(textToSet || '');
            } else {
              setError(data.error || 'Failed to extract text from PDF.');
            }
          } catch (apiErr) {
            console.error('PDF parse error:', apiErr);
            setError('Failed to connect to AI server to parse PDF.');
          } finally {
            setIsUploadingFile(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        setError('Error reading PDF file.');
        setIsUploadingFile(false);
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDropResume = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div 
        className="rounded-xl border-4 border-slate-900 bg-emerald-100 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-slate-950 text-xs font-mono font-black uppercase tracking-wider ">
            JOB TAILOR WORKBENCH
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Fit your resume to any job posting.
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl">
            Upload your PDF resume or paste your bullets and target job description. Tailor identifies ATS keyword gaps, calculates your match score, and rewrites bullet points for maximum impact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-2 rounded-lg bg-white border-2 border-slate-900 text-xs font-mono font-black text-slate-950 hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>
          <button
            onClick={onGoToResumaker}
            className="px-3.5 py-2 rounded-lg bg-white border-2 border-slate-900 text-xs font-mono font-black text-slate-950 hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Resumaker
          </button>
          {handleCoach && (
            <button
              onClick={handleCoach}
              className="px-3.5 py-2 rounded-lg bg-amber-300 hover:bg-amber-200 border-2 border-slate-900 text-xs font-mono font-black text-slate-950 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              Coach
            </button>
          )}
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs: Resume + Job Posting */}
        <div 
          className="lg:col-span-7 rounded-xl border-4 border-slate-900 bg-white p-6 sm:p-8 space-y-6"
        >
          {/* Resume Input Block */}
          <div className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-black text-slate-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-mono font-black">1</span>
                Your Resume Text
              </h2>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const stored = localStorage.getItem('resumight_resume_data');
                      if (stored) {
                        const parsed = JSON.parse(stored);
                        const formatted = `${parsed.name || ''}\n${parsed.role ? parsed.role + ' • ' : ''}${parsed.email || ''} • ${parsed.phone || ''}\n${parsed.location || ''} • ${parsed.linkedin || ''}\n\nSUMMARY\n${parsed.summary || ''}\n\nEXPERIENCE\n${parsed.experience || ''}\n\nEDUCATION\n${parsed.education || ''}\n\nSKILLS\n${parsed.skills || ''}\n\nACTIVITIES\n${parsed.activities || ''}`.trim();
                        setResumeText(formatted);
                      } else {
                        setResumeText(SAMPLE_RESUME);
                      }
                    } catch (e) {
                      setResumeText(SAMPLE_RESUME);
                    }
                  }}
                  className="text-xs font-mono font-bold text-slate-950 px-3 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
                >
                  Import from Resumaker
                </button>
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-xs font-mono font-bold text-slate-950 px-3 py-1 rounded-md bg-white hover:bg-slate-100 border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  Sample
                </button>
                {/* Upload file option */}
                <button
                  type="button"
                  disabled={isUploadingFile}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-mono font-bold text-slate-950 flex items-center gap-1.5 cursor-pointer bg-amber-300 hover:bg-amber-200 px-3 py-1 rounded-md border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      Parsing PDF...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-slate-950" />
                      Upload PDF / Text
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDropResume}
              className={`relative rounded-lg transition-all ${
                isDragging ? 'ring-4 ring-emerald-500 bg-emerald-50' : ''
              }`}
            >
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-4 rounded-lg border-2 border-slate-900 bg-slate-50 text-slate-950 text-xs sm:text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Paste your resume text here, or drag & drop a PDF resume directly into this box..."
              />
              {isUploadingFile && (
                <div className="absolute inset-0 bg-white/95 rounded-lg border-2 border-slate-900 flex flex-col items-center justify-center gap-2 z-10">
                  <Loader2 className="w-6 h-6 text-slate-950 animate-spin" />
                  <span className="text-xs font-mono font-bold text-slate-950">
                    Extracting resume from {uploadFileName || 'PDF'}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Input Block */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-black text-slate-950 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs flex items-center justify-center font-mono font-black">2</span>
                Target Job Description
              </h2>
              <span className="text-xs font-mono text-slate-600 font-bold">Or load sample role:</span>
            </div>

            {/* Sample role chips */}
            <div className="flex flex-wrap gap-2">
              {sampleJobs.map((sj, idx) => (
                <button
                  key={idx}
                  onClick={() => setJobDescription(sj.desc)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] font-mono font-bold text-slate-900 border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-colors cursor-pointer"
                >
                  {sj.title}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-4 rounded-lg border-2 border-slate-900 bg-slate-50 text-slate-950 text-xs sm:text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Paste the target job description here..."
            />
          </div>

          {/* Tailor Button */}
          <button
            onClick={handleRunTailor}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-base border-4 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                Analyzing Match & Optimizing Bullets...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-slate-950" />
                Tailor My Resume Now
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Tailored Analysis & Rewrites */}
        <div 
          className="lg:col-span-5 rounded-xl border-4 border-slate-900 bg-white p-6 sm:p-8 space-y-6 min-h-[460px] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-950" />
                <h3 className="font-black text-slate-950 text-lg">ATS Match Breakdown</h3>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-md bg-amber-300 border-2 border-slate-900 text-slate-950 font-mono ">
                {analyzed && tailoredResult ? `${tailoredResult.matchScore}% Match` : 'Ready'}
              </span>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-100 text-rose-950 text-xs font-mono font-bold border-2 border-rose-400">
                {error}
              </div>
            )}

            {!analyzed && !isAnalyzing && (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-slate-900 text-slate-950 flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-950 text-base">Comparison Workbench</h4>
                <p className="text-xs text-slate-700 max-w-xs mx-auto leading-relaxed">
                  Enter your resume and job posting on the left, then click "Tailor My Resume Now" to view your ATS compatibility score, missing keywords, and full rewritten resume!
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="py-16 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-slate-950 animate-spin mx-auto" />
                <p className="text-sm font-mono font-bold text-slate-950">
                  Scanning ATS keywords & crafting full tailored resume...
                </p>
              </div>
            )}

            {analyzed && !isAnalyzing && tailoredResult && (
              <div className="space-y-6 pt-4 animate-in fade-in">
                
                {/* Score Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-950 mb-1.5">
                    <span>ATS Keyword Match Score</span>
                    <span className="font-black text-sm">{tailoredResult.matchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full border-2 border-slate-900 overflow-hidden p-0.5">
                    <div 
                      className="bg-emerald-400 h-full rounded-full border-r-2 border-slate-900 transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(10, tailoredResult.matchScore))}%` }}
                    />
                  </div>
                </div>

                {/* Matches vs Missing */}
                <div className="space-y-3">
                  {tailoredResult.matchedKeywords.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono font-black text-slate-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Matched Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tailoredResult.matchedKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-100 border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold ">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {tailoredResult.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono font-black text-slate-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Added Buzzwords & Target Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tailoredResult.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-amber-200 border-2 border-slate-900 text-slate-950 text-xs font-mono font-bold ">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FULL TAILORED RESUME BOX */}
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-900 space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs font-mono font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      Full Tailored Resume
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tailoredResult.tailoredResumeText);
                          setCopiedResume(true);
                          setTimeout(() => setCopiedResume(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-950 text-xs font-mono font-bold border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedResume ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                        {copiedResume ? 'Copied' : 'Copy Text'}
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
                        className="px-2.5 py-1 rounded-md bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-mono font-bold border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer transition-all"
                      >
                        Download .txt
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white border-2 border-slate-900 max-h-64 overflow-y-auto text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-text">
                    {tailoredResult.tailoredResumeText}
                  </div>
                </div>

                {/* Key Bullet Point Transformations */}
                {tailoredResult.bulletRewrites.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-black text-slate-950 uppercase tracking-wider">
                      Targeted Bullet Point Transformations
                    </h4>
                    {tailoredResult.bulletRewrites.map((rw, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white border-2 border-slate-900 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-700">
                          <span>BEFORE</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(rw.tailored);
                              setCopiedBulletIndex(i);
                              setTimeout(() => setCopiedBulletIndex(null), 2000);
                            }}
                            className="text-slate-950 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            {copiedBulletIndex === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedBulletIndex === i ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 line-through">{rw.original}</p>

                        <div className="text-[10px] font-mono font-black text-slate-950 pt-1">AFTER (OPTIMIZED)</div>
                        <p className="text-xs font-mono font-bold text-slate-950 leading-relaxed bg-emerald-50 p-2 rounded-md border-2 border-emerald-300">
                          "{rw.tailored}"
                        </p>
                        <p className="text-[11px] text-slate-700 italic pt-0.5">💡 {rw.reasoning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Strategic Advice */}
                {tailoredResult.summaryFeedback && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-slate-900 text-xs text-slate-950 space-y-1">
                    <div className="font-mono font-black text-slate-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      Strategic Advice
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">{tailoredResult.summaryFeedback}</p>
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onGoToResumaker}
              className="text-xs font-mono font-black text-slate-950 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-slate-950" />
              Need a fresh resume draft? Open Resumaker →
            </button>

            {handleCoach && (
              <button
                onClick={handleCoach}
                className="px-4 py-2 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 text-xs font-mono font-black border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                Practice with Coach →
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
