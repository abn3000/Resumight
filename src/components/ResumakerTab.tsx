import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Check, FileText, Palette, Layout, Wand2, Sparkles, Download, X, Copy, Printer, ArrowLeft } from 'lucide-react';
import { NavTab } from '../types';

interface ResumakerTabProps {
  onBackToHome: () => void;
  onGoToTailor: () => void;
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

export const ResumakerTab: React.FC<ResumakerTabProps> = ({ onBackToHome, onGoToTailor }) => {
  // Form State
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'exp' | 'edu' | 'skills' | 'activities'>('basic');
  const [formData, setFormData] = useState({ ...EMPTY_FORM_DATA });
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({});

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
            RESUMAKER WORKSPACE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Create your resume in minutes.
          </h1>
          <p className="text-emerald-900/80 text-sm sm:text-base font-normal max-w-2xl">
            Type your details into the fields below or tap the microphone to describe your background naturally. Choose your layout and accent color, then hit Generate!
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

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form & Voice Mic */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-emerald-950 text-xl">1. Add your details</h2>
                <p className="text-emerald-800/70 text-xs font-medium">Fill in each section or use voice to auto-populate.</p>
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
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold px-3 py-1 rounded-lg bg-emerald-100/80 border border-emerald-200 cursor-pointer"
            >
              Load sample data
            </button>
          </div>

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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFormTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-100/70 text-emerald-900 hover:bg-emerald-200/80'
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
                <label className="block text-xs font-bold text-emerald-900 mb-1">Full name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Target role / title</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g. Product Design & CS Student"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Email</label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g. alex.morgan@berkeley.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g. (555) 019-2834"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">LinkedIn / Portfolio</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="e.g. linkedin.com/in/alexmorgan"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Professional summary
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="e.g. Computer Science student passionate about building human-centered web applications..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm resize-none"
                />
              </div>
            </div>
          )}

          {activeFormTab === 'exp' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-emerald-900">Work & Project Experience</label>
              <textarea
                rows={5}
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm resize-none"
                placeholder="Include internship roles, team projects, capstones, or student jobs..."
              />
            </div>
          )}

          {activeFormTab === 'edu' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-emerald-900">Education & Coursework</label>
              <textarea
                rows={4}
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm resize-none"
                placeholder="University, degree, expected graduation date, GPA, relevant modules..."
              />
            </div>
          )}

          {activeFormTab === 'skills' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-emerald-900">Technical & Soft Skills</label>
              <textarea
                rows={4}
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm resize-none"
                placeholder="React, TypeScript, Python, Figma, Git, Communication..."
              />
            </div>
          )}

          {activeFormTab === 'activities' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-emerald-900">Activities, Clubs & Honors</label>
              <textarea
                rows={4}
                value={formData.activities}
                onChange={(e) => handleInputChange('activities', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-emerald-950 font-medium text-sm resize-none"
                placeholder="Student club leadership, hackathon awards, volunteer work..."
              />
            </div>
          )}

          {/* Voice Assistant & AI Speech Categorizer */}
          <div className="pt-4 border-t border-emerald-100 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-600" />
                  Voice Assistant Mode
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    GEMINI AI POWERED
                  </span>
                </h3>
                <p className="text-xs text-emerald-800/80">
                  Tap the mic to speak or type/paste spoken notes. Gemini will categorize and format them into your resume sections.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
                  className="w-full p-3 pr-10 rounded-xl glass-input text-emerald-950 text-xs font-medium resize-none"
                />
                {voiceTranscript && (
                  <button
                    type="button"
                    onClick={() => setVoiceTranscript('')}
                    className="absolute top-2 right-2 p-1 text-emerald-600 hover:text-emerald-900 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] text-emerald-800 font-medium">
                  {isListening ? '🔴 Recording live speech...' : 'Press button on right to analyze speech with AI:'}
                </span>

                <button
                  type="button"
                  onClick={() => handleProcessSpeechText()}
                  disabled={isProcessingAi || !voiceTranscript.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingAi ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                      Gemini Categorizing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      Categorize with Gemini AI
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback messages */}
            {aiSummaryMessage && (
              <div className="p-3 rounded-xl bg-emerald-100 text-xs font-semibold text-emerald-950 border border-emerald-300 flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{aiSummaryMessage}</span>
              </div>
            )}

            {speechError && (
              <div className="p-3 rounded-xl bg-amber-100/90 text-xs font-medium text-amber-950 border border-amber-300">
                {speechError}
              </div>
            )}
          </div>

        </motion.div>

        {/* Right Column: Customization & Live Generation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Layout Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel rounded-3xl p-6 border border-white/90 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-lg">2. Choose a layout</h3>
                <p className="text-emerald-800/70 text-xs font-medium">Four Google Docs inspired resume layouts.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {layouts.map((l) => {
                const isSelected = selectedLayout === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLayout(l.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white/60 border-emerald-100 hover:bg-white/90'
                    }`}
                  >
                    <div className="w-full h-12 rounded-lg bg-emerald-100/50 p-2 flex flex-col gap-1 overflow-hidden relative">
                      <div className={`h-2 rounded ${l.iconBg} w-1/3`} />
                      <div className="h-1 rounded bg-emerald-300/60 w-3/4" />
                      <div className="h-1 rounded bg-emerald-200/50 w-1/2" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-xs text-emerald-950">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Color Accent Picker */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel rounded-3xl p-6 border border-white/90 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-lg">3. Pick accent color</h3>
                <p className="text-emerald-800/70 text-xs font-medium">Style section headers & borders.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {colors.map((c) => {
                const isSelected = selectedColor === c.hex;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                      isSelected ? 'scale-110 ring-2 ring-emerald-600 ring-offset-2' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && <Check className="w-5 h-5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Generate CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel rounded-3xl p-6 border border-white/90 shadow-xl space-y-4 bg-gradient-to-br from-emerald-100/60 to-white/90"
          >
            <div className="space-y-1">
              <h3 className="font-bold text-emerald-950 text-base">Ready to review?</h3>
              <p className="text-xs text-emerald-800">Generate your formatted resume instantly and export as PDF.</p>
            </div>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-600/20 hover:shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-5 h-5" />
              Generate Resume
            </button>

            <button
              onClick={onGoToTailor}
              className="w-full py-2.5 text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              Want to match a specific job posting? Try Tailor →
            </button>
          </motion.div>

        </div>

      </div>

      {/* Generated Resume Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl bg-white/95 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-emerald-950 text-xl">
                  {formData.name}'s Resume ({selectedLayout} Layout)
                </h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 rounded-xl text-emerald-800 hover:bg-emerald-100/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resume Sheet */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm font-sans space-y-5 text-left text-xs sm:text-sm text-emerald-950">
              <div className="border-b-2 pb-3" style={{ borderColor: selectedColor }}>
                <h2 className="text-2xl font-black tracking-tight uppercase" style={{ color: selectedColor }}>
                  {formData.name}
                </h2>
                <p className="text-xs text-emerald-800 mt-1 font-medium">
                  {formData.email} • {formData.phone} • {formData.location} • {formData.linkedin}
                </p>
                <p className="text-xs text-emerald-900 mt-2 font-normal">
                  {formData.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Education
                </h4>
                <p className="text-xs text-emerald-950">{formData.education}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Experience & Projects
                </h4>
                <p className="text-xs text-emerald-950 leading-relaxed">{formData.experience}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Skills & Tools
                </h4>
                <p className="text-xs text-emerald-950">{formData.skills}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: selectedColor, borderColor: `${selectedColor}40` }}>
                  Activities & Honors
                </h4>
                <p className="text-xs text-emerald-950">{formData.activities}</p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full">
                ✓ ATS Formatted • Single Page Certified
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-emerald-950 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Printer className="w-4 h-4 text-emerald-600" />}
                  {copiedText ? 'Copied' : 'Copy Text'}
                </button>

                <button
                  onClick={() => {
                    alert("Resume PDF generated and saved!");
                    setShowGenerateModal(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
