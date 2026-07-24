import React from 'react';
import { ShieldCheck, Cpu, ClipboardSignature, FileCheck2, UserCheck, ChevronRight } from 'lucide-react';
import { HomepageContent } from '../types';

interface CapabilitiesProps {
  onNavigate?: (view: string) => void;
  homepageContent?: HomepageContent;
}

export default function Capabilities({ onNavigate, homepageContent }: CapabilitiesProps) {
  const tagline = homepageContent?.expertiseTagline || "03 — Scope of Expertise";
  const heading = homepageContent?.expertiseHeading || "What I can do for you";
  const desc = homepageContent?.expertiseDesc || "Organized by who you are and what you need. Not a skills list — a capabilities statement.";
  const categories = [
    {
      num: '01',
      audience: 'For Factory Owners',
      headline: 'Keep your production running.',
      sub: 'I understand that every minute of downtime costs money. My primary focus is prevention and rapid restoration.',
      points: [
        'Preventive maintenance scheduling for industrial lines',
        'Fault diagnosis & emergency troubleshooting under pressure',
        'Load optimization, energy audit & power factor restoration',
        'Safety compliance, earthing verification & protection audit'
      ],
      icon: Cpu,
    },
    {
      num: '02',
      audience: 'For Engineers',
      headline: 'Learn from real field experience.',
      sub: "I document everything so you don't have to guess. I support collaborative knowledge sharing.",
      points: [
        'SLD (Single Line Diagram) reading & professional interpretation',
        'Protection coordination basics & breaker setting formulas',
        'Rigorous industrial troubleshooting methodology & diagnostic trees',
        'Detailed technical documentation & CAD layout standards'
      ],
      icon: ClipboardSignature,
    },
    {
      num: '03',
      audience: 'For Recruiters',
      headline: 'International standard of work.',
      sub: 'I am looking for international opportunities. Here is how I align with global standards.',
      points: [
        'Full compliance with BNBC, NFPA 70 & IEC codes',
        'Hands-on heavy machinery & switchgear experience',
        'Strong documentation, computer skills & report writing',
        'Fully available for relocation or contract assignments'
      ],
      icon: UserCheck,
    }
  ];

  const standards = [
    'BNBC 2020',
    'NFPA 70 (NEC)',
    'IEC 60364',
    'IEC 61439',
    'BS 7671'
  ];

  return (
    <section 
      id="capabilities" 
      className="py-20 md:py-28 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block mb-2">
            {tagline}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight">
            {heading}
          </h2>
          <p className="text-zinc-400 light:text-zinc-600 mt-2 text-sm md:text-base max-w-xl">
            {desc}
          </p>
          <div className="h-0.5 w-12 bg-amber-500 mt-4" />
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg flex flex-col justify-between"
              >
                <div>
                  {/* Number & Icon header */}
                  <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-4 mb-5">
                    <span className="font-mono text-xl font-bold text-amber-500">
                      {cat.num}
                    </span>
                    <Icon className="w-5 h-5 text-zinc-500" />
                  </div>

                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                    {cat.audience}
                  </span>
                  
                  <h3 className="font-display font-bold text-lg text-zinc-100 light:text-zinc-900 mb-2">
                    {cat.headline}
                  </h3>

                  <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed mb-6">
                    {cat.sub}
                  </p>

                  <ul className="space-y-3.5">
                    {cat.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2.5">
                        <ShieldCheck className="w-4 h-4 text-amber-500/80 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-zinc-300 light:text-zinc-700 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sizing Tools Invitation Banner */}
        <div className="mb-16 p-6 sm:p-8 bg-amber-500/5 border border-amber-500/20 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-5 pointer-events-none">
            <Cpu className="w-48 h-48 text-amber-500" />
          </div>
          
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <span className="font-mono text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              NEW: DIGITAL COMPLIANCE TOOLS
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-100 light:text-zinc-900">
              Interactive Sizing Engines (BNBC 2020 / IEC 60364)
            </h3>
            <p className="text-xs text-zinc-400 light:text-zinc-650 leading-relaxed">
              Calculate connected loads, estimate maximum demands with diversity factors, determine copper conductor cable gauges (cross-sections), and select circuit breakers according to actual local regulatory standards.
            </p>
          </div>

          <button
            onClick={() => onNavigate?.('tools')}
            className="w-full md:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider font-mono rounded cursor-pointer transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg hover:shadow-amber-500/10"
          >
            <span>Launch Calculators</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Standards Row */}
        <div className="pt-8 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              Standards I work to:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {standards.map((standard) => (
                <span 
                  key={standard}
                  className="font-mono text-[11px] font-semibold text-zinc-300 light:text-zinc-800 bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-200 border border-zinc-800 dark:border-zinc-800 light:border-zinc-250 px-3 py-1 rounded"
                >
                  {standard}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
