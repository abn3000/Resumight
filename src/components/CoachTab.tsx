import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  MessageSquare,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  ArrowLeft,
  Users,
  Mic,
  MicOff,
  Send,
  HelpCircle,
  TrendingUp,
  FileText,
  Mail,
  Linkedin,
  Compass
} from 'lucide-react';
import { PrepData, PracticeFeedback, InterviewQuestion, StarStory } from '../types';

export interface CoachTabProps {
  onBackToHome: () => void;
  onGoToResumaker: () => void;
  onGoToTailor: () => void;
}
export type PrepTabProps = CoachTabProps;

const SAMPLE_RESUME = `Alex Morgan
alex.morgan@berkeley.edu • (555) 019-2834 • San Francisco, CA • linkedin.com/in/alexmorgan

SUMMARY
Computer Science and Cognitive Science student at UC Berkeley passionate about building accessible, human-centered web tools and high-performance frontend interfaces.

EDUCATION
University of California, Berkeley — B.S. in Computer Science & Cognitive Science (Expected May 2026) • GPA: 3.82

EXPERIENCE
Product Design & Engineering Intern — TechStart Incubator (May 2024 – August 2024)
- Engineered 4 core React and TypeScript user dashboard components, boosting student task completion rate by 32%.
- Conducted 15 in-depth user experience interviews to identify onboarding friction, resulting in 40% fewer support tickets.
- Collaborated closely with 3 senior engineers in 2-week agile sprints, authoring clean documentation and unit tests in Jest.

Lead Frontend Developer — Cal Student Portal Project (Jan 2024 – May 2024)
- Built student schedule visualizer using Next.js and Tailwind CSS used by 4,500+ undergraduate students during registration.
- Reduced initial bundle load time by 45% through dynamic imports, code splitting, and memoized canvas renders.

SKILLS & TOOLS
React, TypeScript, Next.js, Python, Tailwind CSS, Figma, Jest, Git, REST APIs, Design Systems, User Research

ACTIVITIES & LEADERSHIP
President — Berkeley UI/UX Student Association • Hackathon 1st Place Winner (CalHacks 2024)`;

export const CoachTab: React.FC<CoachTabProps> = ({
  onBackToHome,
  onGoToResumaker,
  onGoToTailor,
}) => {
  // Input State
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepData, setPrepData] = useState<PrepData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active Prep Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'pitch' | 'star' | 'outreach' | 'drill'>('pitch');

  // Copy feedback state
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Stopwatch / Timer for Pitch
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  // Speech Synth for Pitch read-aloud
  const [isSpeakingPitch, setIsSpeakingPitch] = useState(false);

  // Document upload state
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mock Interview Drill State
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecordingAnswer, setIsRecordingAnswer] = useState(false);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [drillError, setDrillError] = useState<string | null>(null);
  const drillRecognitionRef = useRef<any>(null);

  // Load resume from localStorage if available on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resumight_resume_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name || parsed.experience) {
          const formatted = `${parsed.name || ''}
${parsed.role ? parsed.role + ' • ' : ''}${parsed.email || ''} • ${parsed.phone || ''} • ${parsed.location || ''} • ${parsed.linkedin || ''}

SUMMARY
${parsed.summary || ''}

EDUCATION
${parsed.education || ''}

EXPERIENCE
${parsed.experience || ''}

SKILLS & TOOLS
${parsed.skills || ''}

ACTIVITIES & HONORS
${parsed.activities || ''}`.trim();

          setResumeText(formatted);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // Speech recognition for drill
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setCandidateAnswer((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
          }
        };

        rec.onerror = (event: any) => {
          console.warn('Drill mic error:', event.error);
          setIsRecordingAnswer(false);
        };

        rec.onend = () => {
          setIsRecordingAnswer(false);
        };

        drillRecognitionRef.current = rec;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }
  }, []);

  const toggleDrillRecording = () => {
    setDrillError(null);
    if (isRecordingAnswer) {
      if (drillRecognitionRef.current) {
        drillRecognitionRef.current.stop();
      }
      setIsRecordingAnswer(false);
    } else {
      if (drillRecognitionRef.current) {
        try {
          drillRecognitionRef.current.start();
          setIsRecordingAnswer(true);
        } catch (e) {
          console.error(e);
          setIsRecordingAnswer(false);
        }
      } else {
        setDrillError('Speech-to-text not supported in this browser; you can type your answer directly!');
      }
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleTogglePitchSpeech = () => {
    if (!prepData?.elevatorPitch?.fullScript) return;

    if (isSpeakingPitch) {
      window.speechSynthesis.cancel();
      setIsSpeakingPitch(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(prepData.elevatorPitch.fullScript);
      utterance.rate = 0.95; // Clear conversational cadence
      utterance.onend = () => setIsSpeakingPitch(false);
      utterance.onerror = () => setIsSpeakingPitch(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeakingPitch(true);
    }
  };

  const handleGeneratePrep = async () => {
    if (!resumeText.trim()) {
      setError('Please provide your resume text or import from Resumaker.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: targetRole.trim() || undefined,
          targetCompany: targetCompany.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPrepData(data.data);
        if (data.data.recommendedQuestions?.length > 0) {
          setSelectedQuestion(data.data.recommendedQuestions[0]);
        }
      } else {
        setError(data.error || 'Failed to generate interview prep.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to connect to the AI coaching service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateDrillAnswer = async () => {
    if (!selectedQuestion) {
      setDrillError('Please select a question to practice.');
      return;
    }
    if (!candidateAnswer.trim()) {
      setDrillError('Please speak or type your answer before evaluating.');
      return;
    }

    setIsEvaluatingAnswer(true);
    setDrillError(null);

    try {
      const res = await fetch('/api/practice-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.question,
          candidateAnswer: candidateAnswer.trim(),
          resumeContext: resumeText.slice(0, 3000),
        }),
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setPracticeFeedback(data.feedback);
      } else {
        setDrillError(data.error || 'Failed to evaluate answer.');
      }
    } catch (err: any) {
      console.error(err);
      setDrillError('Failed to connect to AI feedback engine.');
    } finally {
      setIsEvaluatingAnswer(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadFileName(file.name);
    setError(null);

    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
      setIsUploadingFile(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          if (!result) {
            setError('Could not read PDF.');
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
            console.error(apiErr);
            setError('Failed to extract resume from PDF.');
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
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setResumeText(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-emerald-100">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToResumaker}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/60 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Resumaker
          </button>
          <button
            onClick={onGoToTailor}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/60 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Tailor (ATS)
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/70 text-xs font-bold tracking-wide uppercase font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          STUDENT CAREER & INTERVIEW COACH
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-tight">
          Turn your resume into spoken confidence & recruiter replies.
        </h1>
        <p className="text-emerald-900/80 text-sm sm:text-base font-normal max-w-3xl leading-relaxed">
          Students with great resumes often freeze when asked <em>"Tell me about yourself"</em> or complex behavioral questions.
          <strong> Coach</strong> translates your resume bullets into a crisp 60-second verbal pitch, STAR story talking points, networking cold DMs, and an interactive mock drill with student-friendly advice.
        </p>

        {/* Authentic Student Tip Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs max-w-3xl">
          <span className="text-base shrink-0">💡</span>
          <div className="leading-relaxed">
            <strong className="text-emerald-900">Career Fair & Recruiter Screen Tip:</strong> When an interviewer asks "Walk me through your background", don't recite every bullet line-by-line. Hit them with a quick 60-second hook &rarr; 2 concrete project metrics &rarr; why their team excites you.
          </div>
        </div>
      </div>

      {/* Setup Workbench / Inputs */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg bg-white/85 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-emerald-950">1. Provide your background & target</h2>
            <p className="text-emerald-800/70 text-xs font-medium mt-0.5">
              Paste your resume, import from Resumaker, or upload your PDF.
            </p>
          </div>

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
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 cursor-pointer bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Import from Resumaker
            </button>

            <button
              type="button"
              onClick={() => {
                setResumeText(SAMPLE_RESUME);
                setTargetRole('Product Engineering Intern');
                setTargetCompany('Figma');
              }}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 cursor-pointer bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              Load Sample Data
            </button>

            <button
              type="button"
              disabled={isUploadingFile}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 cursor-pointer bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors disabled:opacity-50"
            >
              {isUploadingFile ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  Extracting PDF...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  Upload PDF / Doc
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Input Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Textbox */}
          <div className="lg:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Resume Text or Bullets
            </label>
            <div className="relative">
              <textarea
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content, experience bullets, or click 'Import from Resumaker'..."
                className="w-full p-4 rounded-2xl glass-input text-emerald-950 text-xs sm:text-sm font-mono leading-relaxed resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {isUploadingFile && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-2 z-10">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <span className="text-xs font-bold text-emerald-950">
                    Extracting structured resume from {uploadFileName || 'PDF'}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Optional Targeting */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5">
                Target Role (Optional)
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer Intern, UX Designer"
                className="w-full p-3 rounded-xl glass-input text-emerald-950 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5">
                Target Company or Industry (Optional)
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Stripe, Figma, Big 4, Early-Stage AI"
                className="w-full p-3 rounded-xl glass-input text-emerald-950 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick Chips */}
            <div>
              <span className="text-[11px] font-bold text-emerald-800/80 block mb-1.5">Popular Student Tracks:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { role: 'Software Engineering Intern', comp: 'Tech' },
                  { role: 'Product Management Intern', comp: 'Startup' },
                  { role: 'Data & AI Analyst', comp: 'Enterprise' },
                  { role: 'UI/UX Product Designer', comp: 'Creative' },
                ].map((chip) => (
                  <button
                    key={chip.role}
                    type="button"
                    onClick={() => {
                      setTargetRole(chip.role);
                      setTargetCompany(chip.comp);
                    }}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 transition-colors cursor-pointer"
                  >
                    {chip.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="button"
              disabled={isGenerating || !resumeText.trim()}
              onClick={handleGeneratePrep}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Prep Package...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  Generate Prep Package
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Generated Prep Toolkits */}
      {prepData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-emerald-100/60 border border-emerald-200/60">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'pitch', label: '60s "Tell Me About Yourself" Pitch', icon: MessageSquare },
                { id: 'star', label: 'STAR Story Bank', icon: Briefcase },
                { id: 'outreach', label: 'Recruiter & Alumni DMs', icon: Mail },
                { id: 'drill', label: 'Mock Interview Drill (AI Coach)', icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-white text-emerald-950 shadow-sm'
                        : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-white/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-emerald-700/60'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-tab 1: 60s Elevator Pitch */}
          {activeSubTab === 'pitch' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg bg-white/90 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                <div>
                  <h3 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    The 60-Second "Tell Me About Yourself" Script
                  </h3>
                  <p className="text-xs text-emerald-800/70 font-medium mt-0.5">
                    100% of interviewers open with this. Deliver a crisp narrative hook instead of reciting your resume line by line.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(prepData.elevatorPitch.fullScript, 'pitch')}
                    className="px-3.5 py-1.5 rounded-xl glass-panel text-xs font-bold text-emerald-900 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200"
                  >
                    {copiedItem === 'pitch' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                        Copy Script
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePitchSpeech}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200/80 text-xs font-bold text-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200"
                  >
                    {isSpeakingPitch ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        Stop Audio
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                        Listen to Cadence
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pitch Breakdown Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    The Hook (Origin & Passion)
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    "{prepData.elevatorPitch.hook}"
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-teal-950 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Two Key Proof Points
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-4 font-medium">
                    {prepData.elevatorPitch.proofPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    The Forward Pivot
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    "{prepData.elevatorPitch.pivot}"
                  </p>
                </div>
              </div>

              {/* Full Conversational Script Card */}
              <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                    Full Teleprompter / Spoken Script
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ~{prepData.elevatorPitch.fullScript.split(/\s+/).length} words • ~{prepData.elevatorPitch.estimatedSeconds || 50} seconds
                  </span>
                </div>

                <p className="text-sm sm:text-base text-emerald-950 font-medium leading-relaxed font-sans p-4 rounded-xl bg-slate-50/60 border border-slate-100 select-all">
                  "{prepData.elevatorPitch.fullScript}"
                </p>

                {/* Built-in Stopwatch Drill */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-emerald-950 bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                      {String(timerSeconds % 60).padStart(2, '0')}
                    </div>

                    <button
                      type="button"
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        timerRunning
                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      {timerRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          Stop Timer
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Practice Read (Start Stopwatch)
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(0);
                      }}
                      className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-100/70 transition-colors cursor-pointer"
                      title="Reset stopwatch"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-emerald-800/80 font-medium">
                    {timerSeconds > 0 && timerSeconds <= 60 && (
                      <span className="text-emerald-700 font-bold">✓ Great pace! Keep under 60 seconds.</span>
                    )}
                    {timerSeconds > 60 && (
                      <span className="text-amber-700 font-bold">⚠️ Over 60 seconds — try trimming filler words!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Tips */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/50 space-y-2">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  Coach Delivery Advice:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-900 font-medium">
                  {prepData.elevatorPitch.deliveryTips.map((tip, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                      • {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: STAR Behavioral Story Bank */}
          {activeSubTab === 'star' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg bg-white/90 space-y-6">
              <div className="pb-4 border-b border-emerald-100">
                <h3 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  STAR Behavioral Story Bank
                </h3>
                <p className="text-xs text-emerald-800/70 font-medium mt-0.5">
                  Behavioral questions ("Tell me about a time when...") account for over 60% of interview evaluations.
                  Here are 3 structured stories pulled directly from your resume.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {prepData.starStories.map((story: StarStory, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-4 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                            Story #{index + 1}
                          </span>
                          <span className="text-xs font-bold text-emerald-800/80">
                            {story.contextRole}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-emerald-950 mt-1">
                          {story.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200">
                          {story.metricHighlight}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `Question: ${story.coreQuestion}\n\nSituation: ${story.situation}\nTask: ${story.task}\nAction: ${story.action}\nResult: ${story.result}`,
                              `star-${index}`
                            )
                          }
                          className="p-2 rounded-xl text-emerald-800 hover:bg-emerald-100/70 transition-colors cursor-pointer"
                          title="Copy STAR story"
                        >
                          {copiedItem === `star-${index}` ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Question It Answers */}
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-xs font-bold text-emerald-950 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Best used for: "{story.coreQuestion}"</span>
                    </div>

                    {/* S - T - A - R Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                        <span className="font-extrabold text-emerald-800 block tracking-wide uppercase text-[10px]">
                          [S] Situation
                        </span>
                        <p className="text-emerald-950 font-medium leading-relaxed">{story.situation}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                        <span className="font-extrabold text-emerald-800 block tracking-wide uppercase text-[10px]">
                          [T] Task
                        </span>
                        <p className="text-emerald-950 font-medium leading-relaxed">{story.task}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                        <span className="font-extrabold text-teal-800 block tracking-wide uppercase text-[10px]">
                          [A] Action
                        </span>
                        <p className="text-emerald-950 font-medium leading-relaxed">{story.action}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                        <span className="font-extrabold text-emerald-800 block tracking-wide uppercase text-[10px]">
                          [R] Result
                        </span>
                        <p className="text-emerald-950 font-medium leading-relaxed">{story.result}</p>
                      </div>
                    </div>

                    {/* Recruiter Curveball Follow-up */}
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Recruiter Curveball Drill-Down:</span>
                        <span className="font-normal italic">"{story.recruiterFollowUp}"</span>
                      </div>
                      <p className="text-amber-900/90 pl-5 font-medium">
                        <strong>Cheat Code:</strong> {story.followUpAnswerTip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Recruiter & Alumni Cold Outreach Pack */}
          {activeSubTab === 'outreach' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg bg-white/90 space-y-6">
              <div className="pb-4 border-b border-emerald-100">
                <h3 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  High-Converting Cold Outreach Messages
                </h3>
                <p className="text-xs text-emerald-800/70 font-medium mt-0.5">
                  Over 70% of early-career roles are landed through referrals. Use these customized, respectful messages to connect on LinkedIn or email.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. LinkedIn 300-char note */}
                <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        LinkedIn Connection Note
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {prepData.outreachPack.linkedinNote.length} / 300 chars
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800/70 font-medium">
                      Fits within LinkedIn's free connection character limit.
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-emerald-950 font-mono leading-relaxed whitespace-pre-wrap">
                      {prepData.outreachPack.linkedinNote}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(prepData.outreachPack.linkedinNote, 'linkedin')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedItem === 'linkedin' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied Note!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy LinkedIn Note
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Hiring Manager Email */}
                <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      Hiring Manager Direct Pitch
                    </div>
                    <p className="text-xs text-emerald-800/70 font-medium">
                      Short, high-value email sent directly to the team lead or recruiter.
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-emerald-950">
                      <div className="font-bold text-emerald-900 border-b pb-1">
                        Subj: {prepData.outreachPack.hiringManagerEmail.subject}
                      </div>
                      <div className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                        {prepData.outreachPack.hiringManagerEmail.body}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Subject: ${prepData.outreachPack.hiringManagerEmail.subject}\n\n${prepData.outreachPack.hiringManagerEmail.body}`,
                        'hm-email'
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedItem === 'hm-email' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied Email!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Full Email
                      </>
                    )}
                  </button>
                </div>

                {/* 3. Alumni Coffee Chat Request */}
                <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                      <Users className="w-4 h-4 text-teal-600" />
                      Alumni Coffee Chat Request
                    </div>
                    <p className="text-xs text-emerald-800/70 font-medium">
                      Humble, respectful outreach asking school alumni for 15 minutes of insight.
                    </p>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-emerald-950">
                      <div className="font-bold text-emerald-900 border-b pb-1">
                        Subj: {prepData.outreachPack.alumniCoffeeChat.subject}
                      </div>
                      <div className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                        {prepData.outreachPack.alumniCoffeeChat.body}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Subject: ${prepData.outreachPack.alumniCoffeeChat.subject}\n\n${prepData.outreachPack.alumniCoffeeChat.body}`,
                        'alumni-email'
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedItem === 'alumni-email' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied Message!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Alumni Chat
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Mock Interview Drill (Interactive AI Coach) */}
          {activeSubTab === 'drill' && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg bg-white/90 space-y-6">
              <div className="pb-4 border-b border-emerald-100">
                <h3 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  Mock Interview Drill & AI Coaching Feedback
                </h3>
                <p className="text-xs text-emerald-800/70 font-medium mt-0.5">
                  Pick one of your recommended resume questions. Speak or type your answer to get instant AI scoring, STAR structural analysis, and an upgraded pro delivery.
                </p>
              </div>

              {/* Recommended Questions Carousel */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Select a Question to Practice:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prepData.recommendedQuestions.map((q, idx) => {
                    const isSelected = selectedQuestion?.question === q.question;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedQuestion(q);
                          setPracticeFeedback(null);
                        }}
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-100/70 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                            : 'bg-white border-emerald-200/80 hover:bg-emerald-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                            {q.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.difficulty === 'Warmup'
                                ? 'bg-blue-100 text-blue-800'
                                : q.difficulty === 'Curveball'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-xs sm:text-sm text-emerald-950 leading-snug">
                          "{q.question}"
                        </h5>
                        <p className="text-[11px] text-emerald-800/80 mt-1 font-medium italic">
                          Why recruiters ask: {q.whyRecruitersAsk}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Input Sandbox */}
              {selectedQuestion && (
                <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-extrabold text-emerald-950">
                      Your Spoken or Written Answer:
                    </div>

                    {/* Microphone Dictate Button */}
                    <button
                      type="button"
                      onClick={toggleDrillRecording}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isRecordingAnswer
                          ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                          : 'bg-emerald-100/80 hover:bg-emerald-200/90 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {isRecordingAnswer ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-emerald-700" />
                          Speak Answer (Dictate)
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                    placeholder="Speak using the microphone button or type how you would answer this interview question out loud..."
                    className="w-full p-4 rounded-xl glass-input text-emerald-950 text-xs sm:text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none font-sans"
                  />

                  {drillError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                      {drillError}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={isEvaluatingAnswer || !candidateAnswer.trim()}
                      onClick={handleEvaluateDrillAnswer}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isEvaluatingAnswer ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Coaching in progress...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-200" />
                          Evaluate My Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Evaluation Results Card */}
              {practiceFeedback && (
                <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                        <span className="text-base">{practiceFeedback.score}</span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-200">/10</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-emerald-950 text-base">
                          {practiceFeedback.score >= 8 ? 'Outstanding Delivery!' : practiceFeedback.score >= 6 ? 'Solid Foundation — A Few Tweaks Needed' : 'Good Start — Needs More Structure'}
                        </h4>
                        <p className="text-xs text-emerald-800/80 font-medium">
                          {practiceFeedback.coachSummary}
                        </p>
                      </div>
                    </div>

                    {/* STAR checklist pills */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      {[
                        { label: 'S', ok: practiceFeedback.starAssessment.situationCovered },
                        { label: 'T', ok: practiceFeedback.starAssessment.taskCovered },
                        { label: 'A', ok: practiceFeedback.starAssessment.actionCovered },
                        { label: 'R', ok: practiceFeedback.starAssessment.resultCovered },
                      ].map((item) => (
                        <span
                          key={item.label}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono ${
                            item.ok
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                          title={item.ok ? `${item.label} covered` : `${item.label} missing or weak`}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Strengths */}
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                      <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        What You Did Well:
                      </span>
                      <ul className="space-y-1.5 text-emerald-900 font-medium list-disc pl-4">
                        {practiceFeedback.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvement Areas */}
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2">
                      <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        Areas to Tighten:
                      </span>
                      <ul className="space-y-1.5 text-emerald-900 font-medium list-disc pl-4">
                        {practiceFeedback.areasToImprove.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pro Version Rewrite */}
                  <div className="p-4 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        The "Pro Candidate" Delivery Rewrite:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(practiceFeedback.proVersion, 'pro-rewrite')}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedItem === 'pro-rewrite' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                        {copiedItem === 'pro-rewrite' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed italic bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                      "{practiceFeedback.proVersion}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PrepTab = CoachTab;
