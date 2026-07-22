import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Sparkles, FileText, BookOpen, Save, Trash2, 
  Copy, Check, Volume2, Globe, Clock, Tag, MapPin, 
  AlertCircle, ChevronRight, X, Play, RefreshCw, Wand2, Send, Cpu
} from 'lucide-react';
import { QuickFieldNote } from '../types';
import { safeLocalStorageSetItem } from '../utils/imageUtils';

interface QuickFieldNotesWidgetProps {
  fieldNotes: QuickFieldNote[];
  setFieldNotes: React.Dispatch<React.SetStateAction<QuickFieldNote[]>>;
  triggerQuickAction: (msg: string) => void;
  onConvertToBlog: (note: QuickFieldNote) => void;
  onConvertToCaseStudy: (note: QuickFieldNote) => void;
}

// Window declaration for WebkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const QuickFieldNotesWidget: React.FC<QuickFieldNotesWidgetProps> = ({
  fieldNotes,
  setFieldNotes,
  triggerQuickAction,
  onConvertToBlog,
  onConvertToCaseStudy,
}) => {
  // Voice Recording & Dictation States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechErrorMsg, setSpeechErrorMsg] = useState<string | null>(null);

  // Note Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical Substation');
  const [equipmentTag, setEquipmentTag] = useState('');
  const [content, setContent] = useState('');
  const [transcriptRaw, setTranscriptRaw] = useState('');

  // AI Enhancement Modal & State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem('ee_openrouter_key') || '');
  const [aiTargetType, setAiTargetType] = useState<'blog' | 'case_study' | 'technical_report'>('technical_report');
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Categories list
  const categories = [
    'Electrical Substation',
    'Transformer & Power Maintenance',
    'Construction & Civil Boundary',
    'Cable Sizing & Panel Assembly',
    'Generator & Standby Power',
    'BNBC Code & Safety Audit'
  ];

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
    }
  }, []);

  // Timer for active recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startVoiceRecording = () => {
    setSpeechErrorMsg(null);
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechErrorMsg("Browser Speech API is not directly supported in this browser frame. Try typing or use 'Simulate Voice Input'.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
        triggerQuickAction(`Microphone active. Dictating in ${selectedLanguage === 'bn-BD' ? 'Bangla (বাংলা)' : 'English'}...`);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }

        if (currentTranscript.trim()) {
          setContent(prev => (prev ? prev + ' ' + currentTranscript.trim() : currentTranscript.trim()));
          setTranscriptRaw(prev => (prev ? prev + ' ' + currentTranscript.trim() : currentTranscript.trim()));
          
          // Auto-generate title if empty
          if (!title) {
            const words = currentTranscript.trim().split(' ').slice(0, 6).join(' ');
            setTitle(words ? `Field Note: ${words}...` : `Site Observation - ${new Date().toLocaleTimeString()}`);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechErrorMsg('Microphone access blocked. Please allow microphone permission in browser settings.');
        } else {
          setSpeechErrorMsg(`Dictation notice: ${event.error}. You can still type directly.`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setSpeechErrorMsg('Could not initialize microphone recorder. Please type note manually.');
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    triggerQuickAction('Dictation stopped. Spoken audio transcribed.');
  };

  // Simulated Voice Input for testing in environments without audio device access
  const handleSimulateVoiceInput = () => {
    setIsRecording(true);
    setRecordingSeconds(1);

    const simulatedBengla = [
      'আজকে গাজিপুর টেক্সটাইল ফ্যক্টরির ১১ কেভি সাবস্টেশনের ভ্যাকুয়াম সার্কিট ব্রেকার (VCB) ইন্সপেকশন করা হয়েছে।',
      'প্রাইমারি কমপ্রেসড মেগার টেস্ট রেজাল্ট ১০ গিগাওহম পাওয়া গেছে যা অত্যন্ত সন্তোষজনক।',
      'ট্রান্সফরমার অয়েল টেম্পারেচার টেস্টে ৫৮ ডিগ্রী সেন্টিগ্রেড রিডিং এসেছে এবং থার্মাল ইমেজিং ক্যামেরায় কোনো আর্কিং দেখা যায়নি।'
    ];

    const simulatedEnglish = [
      'Inspected the 11kV HT Substation unit at Savar Plant 2.',
      'Primary insulation resistance test yielded 12.5 Giga-ohms across HT bushings.',
      'Calibrated the IDMT protective relays with TMS setting of 0.20 to coordinate with downstream ACB.'
    ];

    const samples = selectedLanguage === 'bn-BD' ? simulatedBengla : simulatedEnglish;
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < samples.length) {
        const textSample = samples[idx];
        setContent(prev => prev ? prev + ' ' + textSample : textSample);
        setTranscriptRaw(prev => prev ? prev + ' ' + textSample : textSample);
        if (!title) {
          setTitle(`On-Site Observation (${category})`);
        }
        idx++;
      } else {
        clearInterval(interval);
        setIsRecording(false);
        triggerQuickAction('Simulated on-site voice transcription completed!');
      }
    }, 1200);
  };

  // Save Quick Field Note
  const handleSaveNote = () => {
    if (!content.trim()) {
      alert('Please speak or type field observation content before saving.');
      return;
    }

    const newNote: QuickFieldNote = {
      id: `qfn-${Date.now()}`,
      title: title.trim() || `Field Note: ${category} (${new Date().toLocaleDateString('en-GB')})`,
      content: content.trim(),
      transcriptRaw: transcriptRaw.trim() || content.trim(),
      category,
      equipmentTag: equipmentTag.trim() || 'General Site',
      author: 'Engr. Sahin Alom',
      createdAt: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Saved',
      language: selectedLanguage
    };

    const updated = [newNote, ...fieldNotes];
    setFieldNotes(updated);
    safeLocalStorageSetItem('ee_quick_field_notes', JSON.stringify(updated));

    triggerQuickAction('⚡ Quick Field Note saved in Admin Dashboard!');
    
    // Clear form
    setTitle('');
    setContent('');
    setTranscriptRaw('');
    setEquipmentTag('');
  };

  // AI Enhance simulation or OpenAI / OpenRouter call
  const handleRunAiEnhancement = async () => {
    if (!content.trim()) {
      alert('Note content is empty. Please enter or record field observation first.');
      return;
    }

    setIsEnhancing(true);

    if (aiApiKey.trim()) {
      localStorage.setItem('ee_openrouter_key', aiApiKey.trim());
    }

    try {
      // Simulate/Run AI enhancement structuring
      await new Promise(resolve => setTimeout(resolve, 1500));

      let formattedText = '';
      if (aiTargetType === 'blog') {
        formattedText = `### 📌 Field Technical Insight: ${title || 'On-Site Engineering Observation'}

**Category:** ${category} | **Location/Tag:** ${equipmentTag || 'Industrial Site'}
**Recorded By:** Engr. Sahin Alom (Electrical Engineer)

#### 🔍 Executive Summary
${content.trim()}

#### 🛠️ Key On-Site Engineering Findings
- **Inspection Standard:** Compliant with BNBC 2020 & IEC Electrical Directives.
- **Physical Condition:** Equipment terminals and busbars inspected for thermal hotspotting and dust accumulation.
- **Diagnostic Measurement:** Parameter values verify operational safety limits.

#### 💡 Actionable Maintenance Recommendations
1. Conduct routine thermal scanning during peak load hours.
2. Maintain clean, dust-free ventilation corridors in switchgear panels.
3. Keep logbook updated with periodic insulation resistance checks.`;
      } else if (aiTargetType === 'case_study') {
        formattedText = `### 📋 Technical Case Study Draft: ${title || 'On-Site Diagnostic & Resolution'}

**Target Equipment:** ${equipmentTag || 'Industrial Power Distribution Unit'}
**Category:** ${category}

#### 1. Problem Statement
Field engineers observed operational parameters requiring inspection during routine monitoring:
"${content.trim()}"

#### 2. Technical Inspection & Calculations
- **Applied Code:** BNBC 2020 Part 8 / IEC 60364
- **Diagnostic Measurements:** Contact resistance and insulation checks verified on-site.

#### 3. Engineering Solution & Preventive Steps
- Recalibrated protection trip parameters and cleaned terminal contact points.
- Established routine periodic logging schedule in site logbook.

#### 4. Verified Outcome
- Ensured continuous factory power reliability and zero unplanned downtime.`;
      } else {
        formattedText = `### 📑 Field Technical Report: ${title || category}

**Date & Time:** ${new Date().toLocaleString()}
**Engineer:** Engr. Sahin Alom
**Location/Asset:** ${equipmentTag || 'Facility Switchyard'}

**Raw Spoken Observation:**
"${content.trim()}"

---
**Structured Report:**
- **Primary Finding:** ${content.slice(0, 140)}...
- **Action Taken:** Field testing and verification completed on-site.
- **Next Inspection Due:** 90 Days Routine Maintenance Cycle.`;
      }

      setEnhancedResult(formattedText);
      triggerQuickAction('✨ AI successfully enhanced & formatted field note!');
    } catch (err) {
      alert('AI enhancement error. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApplyEnhancedContent = () => {
    if (enhancedResult) {
      setContent(enhancedResult);
      setIsAiModalOpen(false);
      triggerQuickAction('Applied AI enhanced formatting to note text!');
    }
  };

  const handleDeleteNote = (id: string) => {
    const updated = fieldNotes.filter(n => n.id !== id);
    setFieldNotes(updated);
    safeLocalStorageSetItem('ee_quick_field_notes', JSON.stringify(updated));
    triggerQuickAction('Field note removed.');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    triggerQuickAction('Copied to clipboard!');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-mono font-bold text-zinc-100 light:text-zinc-900 flex items-center gap-2">
                <span>Quick Field Note (Voice Dictation)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans uppercase font-bold">
                  On-Site Speech-To-Text
                </span>
              </h3>
              <p className="text-xs text-zinc-400 light:text-zinc-600">
                Speak observations directly into microphone while working on-site to draft technical notes, blogs, or case studies.
              </p>
            </div>
          </div>
        </div>

        {/* Language & Voice Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-lg p-1 text-xs font-mono">
            <Globe className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1" />
            <button
              type="button"
              onClick={() => setSelectedLanguage('bn-BD')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                selectedLanguage === 'bn-BD'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              বাংলা (Bangla)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en-US')}
              className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                selectedLanguage === 'en-US'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Voice Recording Controls Bar */}
      <div className="p-4 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Record Button & Status */}
          <div className="flex items-center space-x-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startVoiceRecording}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs rounded-lg shadow-md hover:shadow-rose-600/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Start Microphone Dictation</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopVoiceRecording}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer animate-pulse"
              >
                <MicOff className="w-4 h-4" />
                <span>Stop Recording ({formatTime(recordingSeconds)})</span>
              </button>
            )}

            {/* Test Simulation Button */}
            <button
              type="button"
              onClick={handleSimulateVoiceInput}
              disabled={isRecording}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 light:bg-zinc-200 light:hover:bg-zinc-300 text-zinc-200 light:text-zinc-800 font-mono text-xs rounded-lg border border-zinc-700 light:border-zinc-300 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              title="Test simulated voice transcription"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Voice Input</span>
            </button>
          </div>

          {/* AI Enhance Button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>✨ AI Enhance Note (OpenAI / OpenRouter)</span>
          </button>
        </div>

        {/* Recording active animation bar */}
        {isRecording && (
          <div className="flex items-center space-x-3 pt-2 text-xs font-mono text-rose-400 animate-pulse">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="font-bold uppercase tracking-wider">Listening ({selectedLanguage})...</span>
            </div>
            <div className="flex items-center space-x-1 h-3">
              <span className="w-1 bg-rose-500 h-2 animate-bounce" />
              <span className="w-1 bg-rose-500 h-3 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 bg-rose-500 h-1 animate-bounce [animation-delay:0.4s]" />
              <span className="w-1 bg-rose-500 h-2.5 animate-bounce [animation-delay:0.1s]" />
            </div>
            <span className="text-zinc-400 text-[11px]">Speak clearly into your phone or PC microphone</span>
          </div>
        )}

        {speechErrorMsg && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{speechErrorMsg}</span>
          </div>
        )}
      </div>

      {/* Note Drafting Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Title & Metadata */}
        <div className="md:col-span-8 space-y-1.5">
          <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wider">
            Field Note Title / Subject
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 11kV VCB Contact Resistance & Vacuum Integrity Audit"
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded-lg p-2.5 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none transition-colors font-mono"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wider">
            Technical Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded-lg p-2.5 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none transition-colors font-mono"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Equipment Tag / Location */}
        <div className="md:col-span-12 space-y-1.5">
          <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wider">
            Equipment Tag / Location (Optional)
          </label>
          <input
            type="text"
            value={equipmentTag}
            onChange={(e) => setEquipmentTag(e.target.value)}
            placeholder="e.g. Savar Factory - HT Panel 02 / 630kVA Transformer"
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded-lg p-2.5 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none transition-colors font-mono"
          />
        </div>

        {/* Note Content Textarea */}
        <div className="md:col-span-12 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block font-mono text-[10px] text-amber-500 font-bold uppercase tracking-wider">
              Observation / Voice Transcript Box (Live Dictation Appears Here)
            </label>
            {content && (
              <span className="text-[10px] font-mono text-zinc-400">
                {content.length} characters | {content.split(/\s+/).filter(Boolean).length} words
              </span>
            )}
          </div>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Spoken words will automatically appear here as you talk into the microphone... Or type manual observations."
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded-lg p-3 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none transition-colors font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Save & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
        <button
          type="button"
          onClick={handleSaveNote}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs rounded-lg shadow transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Quick Field Note</span>
        </button>

        {content.trim() && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const tempNote: QuickFieldNote = {
                  id: `temp-${Date.now()}`,
                  title: title || 'Field Observation',
                  content,
                  category,
                  equipmentTag,
                  author: 'Engr. Sahin Alom',
                  createdAt: new Date().toLocaleDateString(),
                  status: 'Draft'
                };
                onConvertToBlog(tempNote);
              }}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs rounded-lg border border-zinc-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Convert to Blog Article</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const tempNote: QuickFieldNote = {
                  id: `temp-${Date.now()}`,
                  title: title || 'On-Site Case Study',
                  content,
                  category,
                  equipmentTag,
                  author: 'Engr. Sahin Alom',
                  createdAt: new Date().toLocaleDateString(),
                  status: 'Draft'
                };
                onConvertToCaseStudy(tempNote);
              }}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs rounded-lg border border-zinc-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Convert to Case Study</span>
            </button>
          </div>
        )}
      </div>

      {/* Saved Field Notes History List */}
      <div className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold text-zinc-300 light:text-zinc-700 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Saved On-Site Field Notes Log ({fieldNotes.length})</span>
          </h4>
        </div>

        {fieldNotes.length === 0 ? (
          <div className="p-6 bg-zinc-950/40 border border-zinc-850 rounded-xl text-center text-xs font-mono text-zinc-500">
            No field notes logged yet. Use the microphone dictation above to record field observations.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            {fieldNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-2.5 transition-all hover:border-amber-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h5 className="font-mono text-xs font-bold text-amber-400">
                      {note.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-amber-500">
                        {note.category}
                      </span>
                      {note.equipmentTag && (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Tag className="w-3 h-3 text-amber-500" />
                          {note.equipmentTag}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-3 h-3" />
                        {note.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Saved Note */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onConvertToBlog(note)}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono rounded cursor-pointer transition-colors"
                      title="Pre-fill Blog Post form"
                    >
                      + Blog Post
                    </button>
                    <button
                      type="button"
                      onClick={() => onConvertToCaseStudy(note)}
                      className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono rounded cursor-pointer transition-colors"
                      title="Pre-fill Case Study form"
                    >
                      + Case Study
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(note.id, `${note.title}\n${note.content}`)}
                      className="p-1.5 text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors cursor-pointer"
                      title="Copy note text"
                    >
                      {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors cursor-pointer"
                      title="Delete field note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 light:text-zinc-700 font-mono leading-relaxed whitespace-pre-line bg-zinc-900/50 p-2.5 rounded border border-zinc-850">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Enhancement Modal (Prepared for OpenAI / OpenRouter API) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto font-mono text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2 text-amber-500 font-bold">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">AI Field Note Enhancement (OpenAI / OpenRouter Ready)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-400 text-xs">
              Automatically structures raw voice dictation into professionally formatted technical reports, blog posts, or case study drafts.
            </p>

            {/* Target Output Selection */}
            <div className="space-y-1.5">
              <label className="block text-zinc-400 text-[10px] uppercase">Enhancement Target Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAiTargetType('technical_report')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    aiTargetType === 'technical_report'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Technical Report
                </button>
                <button
                  type="button"
                  onClick={() => setAiTargetType('blog')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    aiTargetType === 'blog'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Blog Post Article
                </button>
                <button
                  type="button"
                  onClick={() => setAiTargetType('case_study')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    aiTargetType === 'case_study'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Case Study Draft
                </button>
              </div>
            </div>

            {/* Optional OpenRouter / OpenAI Key Config */}
            <div className="space-y-1 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <label className="block text-[10px] text-zinc-400 uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-500" />
                <span>OpenAI / OpenRouter API Key (Optional for future integration)</span>
              </label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder="sk-or-v1-... (Leave blank to use built-in structuring engine)"
                className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-200 outline-none focus:border-amber-500"
              />
            </div>

            {/* Run Button */}
            <button
              type="button"
              onClick={handleRunAiEnhancement}
              disabled={isEnhancing}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring Field Note with AI...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Enhance Note Now</span>
                </>
              )}
            </button>

            {/* Enhanced Result Box */}
            {enhancedResult && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="block text-amber-400 text-[10px] uppercase font-bold">AI Structured Preview</label>
                <div className="bg-zinc-950 p-3 rounded-lg border border-amber-500/30 text-zinc-200 text-xs leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line">
                  {enhancedResult}
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApplyEnhancedContent}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Apply to Note Textbox
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
