import React, { useState, useEffect } from 'react';
import { CASE_STUDIES } from '../data';
import { ArrowLeft, Calculator, ShieldCheck, CheckCircle2, Clipboard, Cpu, Award, Clock } from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseStudyDetailProps {
  slug: string;
  onBack: () => void;
  caseStudies?: CaseStudy[];
}

export default function CaseStudyDetail({ slug, onBack, caseStudies = CASE_STUDIES }: CaseStudyDetailProps) {
  const [copied, setCopied] = useState(false);
  
  // Find case study matching slug
  const study = caseStudies.find(item => item.slug === slug);

  // Scroll to top when detail page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!study) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto text-center px-4">
        <h2 className="text-xl font-bold text-rose-500">Error: Report Not Found</h2>
        <p className="text-zinc-400 mt-2">The engineering case study with ID "{slug}" does not exist in the database.</p>
        <button 
          onClick={onBack}
          className="mt-6 inline-flex items-center space-x-2 bg-amber-500 text-zinc-950 px-4 py-2 rounded text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    );
  }

  const handleCopyMath = () => {
    navigator.clipboard.writeText(study.calculation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="pt-24 pb-20 md:pb-28 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation header */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-zinc-400 light:text-zinc-600 hover:text-amber-500 transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-wider">Back to investigations</span>
        </button>

        {/* Technical Title Header */}
        <div className="border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-900/40 light:bg-zinc-100 rounded-lg p-6 mb-8 circuit-border">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-[10px] text-amber-500 font-bold border border-amber-500/20 px-2.5 py-0.5 rounded">
              {study.category}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              ID: SHN-{slug.substring(0, 5).toUpperCase()}
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-zinc-100 light:text-zinc-900 leading-tight">
            {study.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-zinc-850 dark:border-zinc-800/30 light:border-zinc-200">
            <div className="flex flex-wrap gap-2">
              {study.tags.map(tag => (
                <span 
                  key={tag}
                  className="font-mono text-[10px] bg-zinc-950 dark:bg-zinc-950 light:bg-white text-zinc-400 light:text-zinc-600 border border-zinc-900 dark:border-zinc-900 light:border-zinc-300 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {study.duration && (
              <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded">
                <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px] mr-1">Project Duration:</span>
                <span className="font-bold">{study.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Case Study Content Grid */}
        <div className="space-y-8">
          
          {/* Section: The Problem */}
          <div className="p-6 bg-zinc-900/20 dark:bg-zinc-900/20 light:bg-zinc-100 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
            <h2 className="font-display font-bold text-lg text-zinc-200 light:text-zinc-900 flex items-center space-x-2">
              <span className="text-amber-500 font-mono">01 —</span>
              <span>The Diagnostic Report</span>
            </h2>
            <div className="h-0.5 w-8 bg-amber-500/50 mt-2 mb-4" />
            <p className="text-sm sm:text-base text-zinc-300 light:text-zinc-700 leading-relaxed">
              {study.problem}
            </p>
          </div>

          {/* Section: The Math (Monospace Engineering Report style) */}
          <div className="border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-lg overflow-hidden">
            <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 px-4 py-2.5 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-xs font-semibold text-zinc-300 light:text-zinc-800 uppercase tracking-wider">
                  Field Calculations & Formula Verification
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {copied && (
                  <span className="text-[11px] font-mono text-emerald-500 animate-pulse mr-2">
                    Copied!
                  </span>
                )}
                <button 
                  onClick={handleCopyMath}
                  className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-300 cursor-pointer"
                  title="Copy Calculations"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <pre className="p-4 sm:p-6 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 overflow-x-auto text-xs sm:text-sm font-mono text-amber-500/90 dark:text-amber-500/80 light:text-amber-700 leading-relaxed whitespace-pre">
              {study.calculation}
            </pre>
          </div>

          {/* Section: The Solution */}
          <div className="p-6 bg-zinc-900/20 dark:bg-zinc-900/20 light:bg-zinc-100 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
            <h2 className="font-display font-bold text-lg text-zinc-200 light:text-zinc-900 flex items-center space-x-2">
              <span className="text-amber-500 font-mono">02 —</span>
              <span>Engineering Action Implemented</span>
            </h2>
            <div className="h-0.5 w-8 bg-amber-500/50 mt-2 mb-4" />
            <p className="text-sm sm:text-base text-zinc-300 light:text-zinc-700 leading-relaxed">
              {study.solution}
            </p>
          </div>

          {/* Section: The Results */}
          <div className="p-6 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg circuit-border">
            <h2 className="font-display font-bold text-lg text-zinc-100 light:text-zinc-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Verifiable Outcomes</span>
            </h2>
            <div className="h-0.5 w-8 bg-emerald-500/50 mt-2 mb-6" />
            
            <ul className="space-y-4">
              {study.results.map((result, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-zinc-300 light:text-zinc-700 leading-relaxed">
                    {result}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification Stamps */}
          <div className="pt-6 flex flex-wrap items-center justify-between text-zinc-500 font-mono text-[10px] gap-4">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>STANDARD: COMPLIANT TO BNBC 2020 PART 8</span>
            </div>
            <div>
              <span>REPORT GENERATED: 2026-07-17 | SAHIN ALOM, EE</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
