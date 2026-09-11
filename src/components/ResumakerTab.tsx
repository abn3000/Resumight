import React, { useState } from 'react';
import { Mic, MicOff, Check, FileText, Palette, Layout, Wand2, Sparkles, Download, X, Copy, Printer, ArrowLeft, Upload, FileUp, Loader2, FileType } from 'lucide-react';
import { NavTab } from '../types';

interface ResumakerTabProps {
  onBackToHome: () => void;
  onGoToTailor: () => void;
  onGoToCoach?: () => void;
  onGoToPrep?: () => void;
}

const EMPTY_FORM_DATA = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  education: '',
  experience: '',
  skills: '',
  activities: '',
};

const SAMPLE_FORM_DATA = {
  name: 'Alex Morgan',
  role: 'Product Design & CS Student',
  email: 'alex.morgan@berkeley.edu',
  phone: '(555) 019-2834',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexmorgan',
  summary: 'Computer Science and Cognitive Science student passionate about building accessible, human-centered web applications.',
  education: 'University of California, Berkeley — B.S. in CS & Cognitive Science (Expected May 2026)',
  experience: 'Product Design Intern @ TechStart Incubator — Built React components and led 12 user interviews.',
  skills: 'React, TypeScript, Python, Tailwind CSS, Figma, Design Systems, Git, User Research',
  activities: 'President @ Berkeley UI/UX Club • Hackathon Winner 2025 • Dean\'s Honor List',
};

export const ResumakerTab: React.FC<ResumakerTabProps> = ({ onBackToHome, onGoToTailor, onGoToCoach, onGoToPrep }) => {
  const handleCoach = onGoToCoach || onGoToPrep;
  // Form State
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'exp' | 'edu' | 'skills' | 'activities'>('basic');
  const [formData, setFormData] = useState({ ...EMPTY_FORM_DATA });
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({});

  // Auto-sync resume to localStorage for Tailor & Prep tabs
  React.useEffect(() => {
    try {
      localStorage.setItem('resumight_resume_data', JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Template Layout State
  const [selectedLayout, setSelectedLayout] = useState('Swiss');
  const layouts = [
    { id: 'Swiss', name: 'Swiss', desc: 'Modern, clean & structured', iconBg: 'bg-emerald-600' },
    { id: 'Serif', name: 'Serif', desc: 'Classic academic & formal', iconBg: 'bg-emerald-800' },
    { id: 'Spearmint', name: 'Spearmint', desc: 'Fresh sidebar highlight', iconBg: 'bg-teal-600' },
    { id: 'Coral', name: 'Coral', desc: 'Bold header banner', iconBg: 'bg-emerald-500' },
  ];

  // Color Accent State
  const [selectedColor, setSelectedColor] = useState('#059669');
  const colors = [
    { id: 'emerald', hex: '#059669', name: 'Emerald' },
    { id: 'royal', hex: '#2563eb', name: 'Royal Blue' },
    { id: 'purple', hex: '#7c3aed', name: 'Purple' },
    { id: 'teal', hex: '#0d9488', name: 'Teal' },
    { id: 'slate', hex: '#475569', name: 'Slate' },
    { id: 'gold', hex: '#d97706', name: 'Amber Gold' },
  ];

  // Voice & AI Categorization State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [aiSummaryMessage, setAiSummaryMessage] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // PDF / Document Upload State
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const pdfInputRef = React.useRef<HTMLInputElement | null>(null);

  // Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Web Speech Recognition Ref
  const recognitionRef = React.useRef<any>(null);

  // Initialize Web Speech API
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setVoiceTranscript(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone access blocked. You can also type or paste spoken notes below.');
          } else {
            setSpeechError(`Speech status: ${event.error}. You can also type notes directly below.`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }
  }, []);

  const toggleListening = () => {
    setSpeechError(null);
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          setVoiceTranscript('');
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.error(err);
          setIsListening(false);
        }
      } else {
        setSpeechError('Web Speech API is not supported in this browser environment. You can type/paste notes below to process with Gemini!');
      }
    }
  };

  // Call real Gemini API to parse speech text into structured form categories
  const handleProcessSpeechText = async (textToProcess?: string) => {
    const text = textToProcess || voiceTranscript;
    if (!text.trim()) return;

    setIsProcessingAi(true);
    setAiSummaryMessage(null);
    setSpeechError(null);

    // Compute fields that are still blank or unedited
    const defaultFields = Object.keys(formData).filter(
      (key) => !editedFields[key] || !(formData as any)[key]?.trim()
    );

    try {
      const res = await fetch('/api/parse-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: text,
          currentFormData: formData,
          defaultFields,
        }),
      });

      const data = await res.json();

      if (data.success && data.updatedFields) {
        // Merge or overwrite updated fields into formData
        setFormData((prev) => {
          const next = { ...prev };
          Object.keys(data.updatedFields).forEach((key) => {
            const val = data.updatedFields[key];
            if (val && typeof val === 'string' && val.trim().length > 0) {
              (next as any)[key] = val;
            }
          });
          return next;
        });

        // Mark all updated fields as customized by the user
        setEditedFields((prev) => {
          const next = { ...prev };
          Object.keys(data.updatedFields).forEach((key) => {
            const val = data.updatedFields[key];
            if (val && typeof val === 'string' && val.trim().length > 0) {
              next[key] = true;
            }
          });
          return next;
        });

        setAiSummaryMessage(data.summaryMessage || 'Speech successfully processed & categorized into resume fields!');
        setVoiceTranscript('');
      } else {
        setSpeechError(data.error || 'Could not parse speech. Please try again.');
      }
    } catch (err: any) {
      console.error('Error sending speech to Gemini API:', err);
      setSpeechError('Failed to connect to AI server. Please check your connection.');
    } finally {
      setIsProcessingAi(false);
    }
  };

  // Handle PDF / Document Upload
  const handlePdfFile = async (file: File) => {
    if (!file) return;

    // Check supported file extensions or MIME types
    const validExtensions = ['.pdf', '.txt', '.md', '.docx', '.doc'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext)) || file.type === 'application/pdf' || file.type.startsWith('text/');

    if (!isValid) {
      setPdfUploadError('Please upload a PDF (.pdf), Word document (.docx), or text (.txt/.md) file.');
      return;
    }

    setIsUploadingPdf(true);
    setPdfFileName(file.name);
    setPdfUploadError(null);
    setAiSummaryMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        if (!result) {
          setPdfUploadError('Could not read file. Please try again.');
          setIsUploadingPdf(false);
          return;
        }

        try {
          const res = await fetch('/api/parse-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: result,
              mimeType: file.type || (lowerName.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
              fileName: file.name,
            }),
          });

          const data = await res.json();

          if (data.success && data.updatedFields) {
            // Merge or overwrite updated fields into formData
            setFormData((prev) => {
              const next = { ...prev };
              Object.keys(data.updatedFields).forEach((key) => {
                const val = data.updatedFields[key];
                if (val && typeof val === 'string' && val.trim().length > 0) {
                  (next as any)[key] = val;
                }
              });
              return next;
            });

            // Mark all updated fields as customized by the user
            setEditedFields((prev) => {
              const next = { ...prev };
              Object.keys(data.updatedFields).forEach((key) => {
                const val = data.updatedFields[key];
                if (val && typeof val === 'string' && val.trim().length > 0) {
                  next[key] = true;
                }
              });
              return next;
            });

            setAiSummaryMessage(data.summaryMessage || `Successfully extracted resume from ${file.name}!`);
          } else {
            setPdfUploadError(data.error || 'Failed to extract resume fields from document.');
          }
        } catch (apiErr: any) {
          console.error('API parse-pdf error:', apiErr);
          setPdfUploadError('Failed to connect to AI server. Please check your connection.');
        } finally {
          setIsUploadingPdf(false);
        }
      };

      reader.onerror = () => {
        setPdfUploadError('Failed to read the file from disk.');
        setIsUploadingPdf(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('PDF file handle error:', err);
      setPdfUploadError('Error processing file upload.');
      setIsUploadingPdf(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div 
        className="rounded-xl p-6 sm:p-8 border-2 border-slate-900 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider font-mono border-2 border-slate-900 ">
            RESUMAKER WORKSPACE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Create your resume in minutes.
          </h1>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl">
            Type your details into the fields below or tap the microphone to describe your background naturally. Choose your layout and accent color, then hit Generate!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-2 rounded-lg bg-white text-xs font-black font-mono text-slate-950 border-2 border-slate-900 hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>
          <button
            onClick={onGoToTailor}
            className="px-3.5 py-2 rounded-lg bg-emerald-300 hover:bg-emerald-200 text-xs font-black font-mono text-slate-950 border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Tailor (ATS)
          </button>
          {handleCoach && (
            <button
              onClick={handleCoach}
              className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-black font-mono text-slate-950 border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              Coach
            </button>
          )}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form & Voice Mic */}
        <div 
          className="lg:col-span-7 rounded-xl p-6 sm:p-8 border-2 border-slate-900 bg-white space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-950 text-amber-300 border-2 border-slate-900 flex items-center justify-center font-mono font-black ">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-slate-950 text-xl">1. Add your details</h2>
                <p className="text-slate-600 text-xs font-medium">Upload your PDF resume, fill in sections, or use voice.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData({ ...SAMPLE_FORM_DATA });
                const edited: Record<string, boolean> = {};
                Object.keys(SAMPLE_FORM_DATA).forEach((k) => (edited[k] = true));
                setEditedFields(edited);
              }}
              className="text-xs text-slate-950 hover:bg-amber-200 font-mono font-black px-3 py-1.5 rounded-lg bg-amber-300 border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Load sample data
            </button>
          </div>

          {/* PDF & Document Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-4 transition-all duration-150 flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDraggingFile
                ? 'border-slate-900 bg-amber-100 scale-[1.01]'
                : 'border-slate-900 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePdfFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white text-slate-950 border-2 border-slate-900 flex items-center justify-center shrink-0 ">
                {isUploadingPdf ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                ) : (
                  <FileUp className="w-5 h-5 text-slate-950" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-950 text-sm">
                    {isUploadingPdf ? 'Parsing Resume with Gemini AI...' : 'Upload Existing Resume'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-slate-950 text-[10px] font-mono font-bold border border-slate-900">
                    PDF • DOCX • TXT
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-0.5">
                  {isUploadingPdf
                    ? `Reading structure, experiences, and skills from ${pdfFileName || 'document'}...`
                    : 'Drag & drop your PDF resume here or click to auto-fill all form fields.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isUploadingPdf}
              onClick={() => pdfInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black font-mono border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isUploadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  Extracting...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-slate-950" />
                  Browse PDF
                </>
              )}
            </button>
          </div>

          {pdfUploadError && (
            <div className="p-3 rounded-lg bg-rose-100 border-2 border-slate-900 text-rose-950 text-xs font-bold flex items-center justify-between gap-2">
              <span>{pdfUploadError}</span>
              <button
                type="button"
                onClick={() => setPdfUploadError(null)}
                className="text-rose-950 hover:underline font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'exp', label: 'Experience' },
              { id: 'edu', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'activities', label: 'Activities & Awards' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black border-2 border-slate-900 transition-all cursor-pointer ${
                  activeFormTab === tab.id
                    ? 'bg-amber-300 text-slate-950 '
                    : 'bg-white text-slate-900 hover:bg-slate-100 '
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Fields */}
          {activeFormTab === 'basic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">Full name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">Target role / title</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g. Product Design & CS Student"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g. alex.morgan@berkeley.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g. (555) 019-2834"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">LinkedIn / Portfolio</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="e.g. linkedin.com/in/alexmorgan"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-black text-slate-950 uppercase mb-1">
                  Professional summary
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="e.g. Computer Science student passionate about building human-centered web applications..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {activeFormTab === 'exp' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-mono font-black text-slate-950 uppercase">Work & Project Experience</label>
              <textarea
                rows={5}
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none resize-none"
                placeholder="Include internship roles, team projects, capstones, or student jobs..."
              />
            </div>
          )}

          {activeFormTab === 'edu' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-mono font-black text-slate-950 uppercase">Education & Coursework</label>
              <textarea
                rows={4}
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none resize-none"
                placeholder="University, degree, expected graduation date, GPA, relevant modules..."
              />
            </div>
          )}

          {activeFormTab === 'skills' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-mono font-black text-slate-950 uppercase">Technical & Soft Skills</label>
              <textarea
                rows={4}
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none resize-none"
                placeholder="React, TypeScript, Python, Figma, Git, Communication..."
              />
            </div>
          )}

          {activeFormTab === 'activities' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-mono font-black text-slate-950 uppercase">Activities, Clubs & Honors</label>
              <textarea
                rows={4}
                value={formData.activities}
                onChange={(e) => handleInputChange('activities', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 font-mono text-sm focus:outline-none resize-none"
                placeholder="Student club leadership, hackathon awards, volunteer work..."
              />
            </div>
          )}

          {/* Voice Assistant & AI Speech Categorizer */}
          <div className="pt-4 border-t-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-950 text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4 text-slate-950" />
                  Voice Assistant Mode
                  <span className="px-2 py-0.5 rounded-md bg-amber-300 text-slate-950 text-[10px] font-mono font-black border border-slate-900">
                    GEMINI AI
                  </span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Tap the mic to speak or type/paste spoken notes. Gemini will categorize and format them into your resume sections.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleListening}
                className={`w-11 h-11 rounded-lg border-2 border-slate-900 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-rose-400 text-slate-950 animate-pulse ring-2 ring-slate-900'
                    : 'bg-amber-300 hover:bg-amber-200 text-slate-950'
                }`}
                title={isListening ? 'Stop Listening' : 'Start Microphone Listening'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            {/* Transcript & Speech input box */}
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  rows={2}
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to your voice live... Speak naturally about your degree, projects, or work history!'
                      : 'Speak via microphone above OR type/paste spoken background notes here (e.g. "I led a 4-person team in CS 160 to build an accessible study planner in React and Python")...'
                  }
                  className="w-full p-3 pr-14 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-950 text-xs font-mono focus:outline-none resize-none"
                />
                {voiceTranscript && (
                  <button
                    type="button"
                    onClick={() => setVoiceTranscript('')}
                    className="absolute top-2 right-2 px-2 py-1 bg-white border border-slate-900 rounded text-slate-950 hover:bg-slate-100 text-xs font-mono font-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-slate-700 font-bold">
                  {isListening ? '🔴 Recording live speech...' : 'Analyze speech notes:'}
                </span>

                <button
                  type="button"
                  onClick={() => handleProcessSpeechText()}
                  disabled={isProcessingAi || !voiceTranscript.trim()}
                  className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-mono font-black border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingAi ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      Gemini Categorizing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-slate-950" />
                      Categorize with Gemini AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback messages */}
            {aiSummaryMessage && (
              <div className="p-3 rounded-lg bg-emerald-100 text-xs font-mono font-bold text-slate-950 border-2 border-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{aiSummaryMessage}</span>
              </div>
            )}

            {speechError && (
              <div className="p-3 rounded-lg bg-amber-100 text-xs font-mono font-bold text-slate-950 border-2 border-slate-900">
                {speechError}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Customization & Live Generation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Layout Selector */}
          <div 
            className="rounded-xl p-6 border-2 border-slate-900 bg-white space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-950 text-amber-300 border-2 border-slate-900 flex items-center justify-center font-mono font-black ">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-950 text-lg">2. Choose a layout</h3>
                <p className="text-slate-600 text-xs font-medium">Four Google Docs inspired resume layouts.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {layouts.map((l) => {
                const isSelected = selectedLayout === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLayout(l.id)}
                    className={`p-3 rounded-xl border-2 border-slate-900 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-amber-100 ring-2 ring-slate-900'
                        : 'bg-white hover:bg-slate-50 '
                    }`}
                  >
                    <div className="w-full h-12 rounded-lg bg-slate-100 border border-slate-900 p-2 flex flex-col gap-1 overflow-hidden relative">
                      <div className={`h-2 rounded ${l.iconBg} w-1/3`} />
                      <div className="h-1 rounded bg-slate-400 w-3/4" />
                      <div className="h-1 rounded bg-slate-300 w-1/2" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-slate-950 text-amber-300 rounded-full flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="font-black text-xs text-slate-950">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Accent Picker */}
          <div 
            className="rounded-xl p-6 border-2 border-slate-900 bg-white space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-950 text-amber-300 border-2 border-slate-900 flex items-center justify-center font-mono font-black ">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-950 text-lg">3. Pick accent color</h3>
                <p className="text-slate-600 text-xs font-medium">Style section headers & borders.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {colors.map((c) => {
                const isSelected = selectedColor === c.hex;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`w-9 h-9 rounded-lg border-2 border-slate-900 flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'scale-110 ring-2 ring-slate-900' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate CTA Box */}
          <div 
            className="rounded-xl p-6 border-2 border-slate-900 space-y-4 bg-amber-50"
          >
            <div className="space-y-1">
              <h3 className="font-black text-slate-950 text-base">Ready to review?</h3>
              <p className="text-xs text-slate-700 font-medium">Generate your formatted resume instantly and export as PDF.</p>
            </div>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="w-full py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black font-mono text-base border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-5 h-5 text-slate-950" />
              Generate Resume
            </button>

            <button
              onClick={onGoToTailor}
              className="w-full py-2.5 text-center text-xs font-mono font-black text-slate-950 hover:underline"
            >
              Want to match a specific job posting? Try Tailor →
            </button>
          </div>

        </div>

      </div>

      {/* Generated Resume Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="relative w-full max-w-3xl rounded-xl p-6 sm:p-8 border-4 border-slate-900 bg-white space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-slate-950" />
                <h3 className="font-black text-slate-950 text-xl">
                  {formData.name}'s Resume ({selectedLayout} Layout)
                </h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1.5 rounded-lg border-2 border-slate-900 text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resume Sheet */}
            <div className="bg-white rounded-lg p-6 sm:p-8 border-2 border-slate-900 font-sans space-y-5 text-left text-xs sm:text-sm text-slate-950">
              <div className="border-b-2 pb-3" style={{ borderColor: selectedColor }}>
                <h2 className="text-2xl font-black tracking-tight uppercase" style={{ color: selectedColor }}>
                  {formData.name}
                </h2>
                <p className="text-xs text-slate-700 mt-1 font-mono font-medium">
                  {formData.email} • {formData.phone} • {formData.location} • {formData.linkedin}
                </p>
                <p className="text-xs text-slate-800 mt-2 font-normal leading-relaxed">
                  {formData.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black font-mono uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Education
                </h4>
                <p className="text-xs text-slate-900">{formData.education}</p>
              </div>

              <div>
                <h4 className="text-xs font-black font-mono uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Experience & Projects
                </h4>
                <p className="text-xs text-slate-900 leading-relaxed">{formData.experience}</p>
              </div>

              <div>
                <h4 className="text-xs font-black font-mono uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Skills & Tools
                </h4>
                <p className="text-xs text-slate-900">{formData.skills}</p>
              </div>

              <div>
                <h4 className="text-xs font-black font-mono uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Activities & Honors
                </h4>
                <p className="text-xs text-slate-900">{formData.activities}</p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs font-mono font-black text-slate-950 bg-amber-300 border-2 border-slate-900 px-3 py-1.5 rounded-md ">
                ✓ ATS Formatted • Single Page Certified
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-white text-xs font-mono font-black text-slate-950 border-2 border-slate-900 hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Printer className="w-4 h-4 text-slate-950" />}
                  {copiedText ? 'Copied' : 'Copy Text'}
                </button>

                {handleCoach && (
                  <button
                    onClick={() => {
                      setShowGenerateModal(false);
                      handleCoach();
                    }}
                    className="px-4 py-2.5 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 font-mono font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    Practice with Coach
                  </button>
                )}

                <button
                  onClick={() => {
                    window.print();
                    setShowGenerateModal(false);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono font-black text-xs border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  Print / Save PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
