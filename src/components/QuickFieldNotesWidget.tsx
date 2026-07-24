import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Sparkles, FileText, BookOpen, Save, Trash2, 
  Copy, Check, Globe, Clock, Tag, AlertCircle, X, ChevronDown, ChevronUp
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

export const QuickFieldNotesWidget: React.FC<QuickFieldNotesWidgetProps> = ({
  fieldNotes,
  setFieldNotes,
  triggerQuickAction,
  onConvertToBlog,
  onConvertToCaseStudy,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'bn-BD' | 'en-US'>('bn-BD');
  const [speechErrorMsg, setSpeechErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electrical Substation');
  const [equipmentTag, setEquipmentTag] = useState('');
  const [content, setContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiTargetType, setAiTargetType] = useState<'blog' | 'case_study' | 'technical_report'>('technical_report');
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const categories = [
    'Electrical Substation',
    'Transformer & Power Maintenance',
    'Cable Sizing & Switchgear',
    'Generator & Standby Power',
    'BNBC Code & Safety Audit'
  ];

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
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechErrorMsg("Audio speech API not supported in frame. You can type notes directly.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsRecording(true);
        triggerQuickAction(`Microphone active. Dictating in ${selectedLanguage === 'bn-BD' ? 'Bangla' : 'English'}...`);
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
          if (!title) {
            const words = currentTranscript.trim().split(' ').slice(0, 5).join(' ');
            setTitle(words ? `Note: ${words}...` : `Observation - ${new Date().toLocaleTimeString()}`);
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setSpeechErrorMsg('Microphone access blocked. Please allow permissions or type directly.');
        } else {
          setSpeechErrorMsg(`Notice: ${event.error}. Typing is always enabled.`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      setSpeechErrorMsg('Could not start microphone recorder.');
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
    triggerQuickAction('Dictation stopped.');
  };

  const handleSaveNote = () => {
    if (!content.trim()) {
      alert('Please enter or dictate field observation notes before saving.');
      return;
    }

    const newNote: QuickFieldNote = {
      id: `qfn-${Date.now()}`,
      title: title.trim() || `Field Note: ${category} (${new Date().toLocaleDateString('en-GB')})`,
      content: content.trim(),
      transcriptRaw: content.trim(),
      category,
      equipmentTag: equipmentTag.trim() || 'Site Log',
      author: 'Engr. Md. Sahin Alom',
      createdAt: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Saved',
      language: selectedLanguage
    };

    const updated = [newNote, ...fieldNotes];
    setFieldNotes(updated);
    safeLocalStorageSetItem('ee_quick_field_notes', JSON.stringify(updated));

    triggerQuickAction('Field Note saved!');
    setTitle('');
    setContent('');
    setEquipmentTag('');
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
    triggerQuickAction('Copied!');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRunAiEnhancement = async () => {
    if (!content.trim()) return;
    setIsEnhancing(true);
    await new Promise(r => setTimeout(r, 1000));

    let formattedText = '';
    if (aiTargetType === 'blog') {
      formattedText = `### 📌 Technical Insight: ${title || 'Field Observation'}\n\n**Category:** ${category}\n**Engineer:** Engr. Md. Sahin Alom\n\n#### Summary\n${content.trim()}\n\n#### On-Site Findings\n- Inspected in compliance with BNBC 2020 standards.\n- System parameters verified operational.`;
    } else {
      formattedText = `### 📑 Field Report: ${title || category}\n\n**Date:** ${new Date().toLocaleDateString()}\n**Location:** ${equipmentTag || 'Site'}\n\n**Observation:**\n"${content.trim()}"\n\n**Status:** Verified on-site.`;
    }

    setEnhancedResult(formattedText);
    setIsEnhancing(false);
  };

  return (
    <div className="bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl p-3 sm:p-4 shadow-sm space-y-3">
      
      {/* Header: Compact title & controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-500">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 light:text-zinc-900 flex items-center gap-1.5">
              <span>Quick Field Note</span>
              <span className="text-[9px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                Voice / Type
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded p-0.5 text-[10px] font-mono">
            <Globe className="w-3 h-3 text-zinc-400 ml-1 mr-0.5" />
            <button
              type="button"
              onClick={() => setSelectedLanguage('bn-BD')}
              className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                selectedLanguage === 'bn-BD' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('en-US')}
              className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                selectedLanguage === 'en-US' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'
              }`}
            >
              EN
            </button>
          </div>

          {/* AI Enhance trigger button */}
          {content.trim() && (
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer"
              title="AI Format Note"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Format</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Dictation Bar */}
      <div className="flex items-center justify-between bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-lg p-2 gap-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={startVoiceRecording}
            className="w-full sm:w-auto px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs rounded shadow transition-all flex items-center justify-center space-x-2 cursor-pointer min-h-[40px]"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span>Start Voice Dictation ({selectedLanguage === 'bn-BD' ? 'বাংলা' : 'EN'})</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopVoiceRecording}
            className="w-full sm:w-auto px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs rounded shadow transition-all flex items-center justify-center space-x-2 cursor-pointer animate-pulse min-h-[40px]"
          >
            <MicOff className="w-3.5 h-3.5" />
            <span>Stop Recording ({formatTime(recordingSeconds)})</span>
          </button>
        )}

        <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline truncate">
          {isRecording ? 'Listening...' : 'Tap record or type note below'}
        </span>
      </div>

      {speechErrorMsg && (
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-[11px] font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{speechErrorMsg}</span>
        </div>
      )}

      {/* Compact Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title / Topic (e.g. VCB Inspection)"
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded p-2 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none font-mono"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded p-2 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none font-mono"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-12">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type field note observations here or use voice dictation..."
            className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-xs rounded p-2.5 text-zinc-100 light:text-zinc-900 focus:border-amber-500 outline-none font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
        <button
          type="button"
          onClick={handleSaveNote}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs rounded shadow flex items-center space-x-1.5 cursor-pointer min-h-[38px]"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Note</span>
        </button>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="text-[11px] font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer py-1"
        >
          <span>Saved Logs ({fieldNotes.length})</span>
          {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Saved Notes Log (Collapsible or compact view) */}
      {showHistory && (
        <div className="pt-2 border-t border-zinc-800 space-y-2">
          {fieldNotes.length === 0 ? (
            <p className="text-[11px] font-mono text-zinc-500 text-center py-2">No saved notes yet.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {fieldNotes.map(note => (
                <div key={note.id} className="p-2.5 bg-zinc-950/70 dark:bg-zinc-950/70 light:bg-zinc-50 border border-zinc-800 rounded text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-400 text-xs truncate">{note.title}</span>
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(note.id, note.content)}
                        className="p-1 text-zinc-400 hover:text-amber-400 rounded"
                        title="Copy"
                      >
                        {copiedId === note.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 light:text-zinc-700 font-mono whitespace-pre-line leading-normal">
                    {note.content}
                  </p>
                  <div className="text-[9px] font-mono text-zinc-500 flex justify-between">
                    <span>{note.category}</span>
                    <span>{note.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Note Formatter
              </span>
              <button type="button" onClick={() => setIsAiModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase">Target Format</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAiTargetType('technical_report')}
                  className={`flex-1 py-1.5 rounded border text-[11px] ${aiTargetType === 'technical_report' ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}
                >
                  Report
                </button>
                <button
                  type="button"
                  onClick={() => setAiTargetType('blog')}
                  className={`flex-1 py-1.5 rounded border text-[11px] ${aiTargetType === 'blog' ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-400'}`}
                >
                  Blog Article
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunAiEnhancement}
              disabled={isEnhancing}
              className="w-full py-2 bg-amber-500 text-zinc-950 font-bold rounded cursor-pointer"
            >
              {isEnhancing ? 'Formatting...' : 'Generate Formatted Text'}
            </button>

            {enhancedResult && (
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <textarea
                  rows={6}
                  value={enhancedResult}
                  onChange={e => setEnhancedResult(e.target.value)}
                  className="w-full bg-zinc-950 p-2 border border-zinc-800 rounded text-zinc-200 text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setContent(enhancedResult);
                    setIsAiModalOpen(false);
                    triggerQuickAction('Applied formatted text!');
                  }}
                  className="w-full py-1.5 bg-emerald-600 text-white font-bold rounded"
                >
                  Apply to Note
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
