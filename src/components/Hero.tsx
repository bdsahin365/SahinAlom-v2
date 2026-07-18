import React from 'react';
import { Activity, ShieldCheck, Zap, AlertTriangle, ArrowRight, Mail } from 'lucide-react';
import { HomepageContent } from '../types';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
  homepageContent?: HomepageContent;
}

export default function Hero({ onScrollToSection, homepageContent }: HeroProps) {
  const content = homepageContent || {
    heroTagline: "Electrical Engineer — Dhaka, Bangladesh",
    heroHeading: "I keep factories running.",
    heroSubheading: "Electrical maintenance, load distribution, and power system troubleshooting for industrial facilities. Currently maintaining a sweater factory in Dhaka — keeping production lines live, motors humming, and safety standards met.",
    heroStat1Val: "4+ Years",
    heroStat1Label: "Field Exp",
    heroStat2Val: "24/7",
    heroStat2Label: "Operations",
    heroStat3Val: "100%",
    heroStat3Label: "Uptime Focus",
    heroProfileName: "Sahin Alom",
    heroProfileTitle: "Sahin Alom — Senior EE",
    heroProfileImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    heroProfileVideo: ""
  };

  return (
    <section 
      id="hero" 
      className="relative pt-32 pb-20 md:py-40 technical-grid overflow-hidden border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200"
    >
      {/* Decorative circuit lines (Subtle, structural background elements) */}
      <div className="absolute top-1/4 right-10 w-64 h-64 border border-zinc-800/20 dark:border-zinc-800/20 light:border-zinc-400/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-40 w-32 h-32 border border-zinc-800/10 dark:border-zinc-800/10 light:border-zinc-400/5 rounded-full pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-96 h-1 border-t border-dashed border-zinc-800/30 dark:border-zinc-800/30 light:border-zinc-400/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & stats */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status indicator pill */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-900/50 light:bg-zinc-100 rounded text-xs font-mono text-amber-500 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              <span>{content.heroTagline}</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-zinc-100 light:text-zinc-900 leading-tight">
              {content.heroHeading.includes("running.") ? (
                <>I keep factories <span className="text-amber-500 font-medium">running.</span></>
              ) : content.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 light:text-zinc-600 leading-relaxed max-w-xl">
              {content.heroSubheading}
            </p>

            {/* Industrial Stats Widget */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-zinc-800 dark:border-zinc-800 light:border-zinc-200 max-w-lg">
              <div className="space-y-1">
                <span className="block font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900">{content.heroStat1Val}</span>
                <span className="block text-[11px] font-mono text-zinc-400 light:text-zinc-500 uppercase tracking-wider">{content.heroStat1Label}</span>
              </div>
              <div className="space-y-1 border-l border-zinc-800 dark:border-zinc-800 light:border-zinc-200 pl-4">
                <span className="block font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900">{content.heroStat2Val}</span>
                <span className="block text-[11px] font-mono text-zinc-400 light:text-zinc-500 uppercase tracking-wider">{content.heroStat2Label}</span>
              </div>
              <div className="space-y-1 border-l border-zinc-800 dark:border-zinc-800 light:border-zinc-200 pl-4">
                <span className="block font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900">{content.heroStat3Val}</span>
                <span className="block text-[11px] font-mono text-zinc-400 light:text-zinc-500 uppercase tracking-wider">{content.heroStat3Label}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onScrollToSection('work')}
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium px-6 py-3 rounded transition-all group cursor-pointer"
              >
                <span>View my work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onScrollToSection('contact')}
                className="flex items-center space-x-2 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/50 hover:bg-zinc-900/20 light:hover:bg-zinc-100 text-zinc-300 light:text-zinc-700 px-6 py-3 rounded transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Get in touch</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live panel portrait mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] p-4 bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-lg shadow-xl circuit-border">
              
              {/* Camera layout lines */}
              <div className="absolute top-2 left-2 text-[9px] font-mono text-zinc-500 tracking-wider">REC ● CH1</div>
              <div className="absolute top-2 right-2 text-[9px] font-mono text-zinc-500 tracking-wider">1080P 50FPS</div>
              <div className="absolute bottom-2 left-2 text-[9px] font-mono text-zinc-500 tracking-wider">UTC+6 (DHAKA)</div>

              {/* Blinking Badge */}
              <div className="absolute -top-3 left-6 inline-flex items-center space-x-1.5 px-2 py-0.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 bg-zinc-950 dark:bg-zinc-950 light:bg-white rounded text-[10px] font-mono text-zinc-100 light:text-zinc-900 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Currently on duty</span>
              </div>

              {/* Styled Technical Portrait Frame */}
              <div className="w-full h-[360px] bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-200 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 relative overflow-hidden flex flex-col items-center justify-center">
                
                {/* Technical portrait representing operator (Fills the entire container) */}
                {content.heroProfileImage ? (
                  <img 
                    src={content.heroProfileImage} 
                    alt={content.heroProfileName} 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    referrerPolicy="no-referrer"
                  />
                ) : content.heroProfileVideo ? (
                  <video 
                    src={content.heroProfileVideo} 
                    controls 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center z-0 bg-zinc-950">
                    <svg className="w-40 h-40 text-amber-500/25 dark:text-amber-500/15" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  </div>
                )}

                {/* Dark Gradient Overlay for text and hud readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 pointer-events-none" />

                {/* Simulated Radar / Circle Grids overlaying on top of the image */}
                <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center z-10">
                  <div className="w-64 h-64 border border-amber-500/30 rounded-full" />
                  <div className="w-44 h-44 border border-dashed border-amber-500/20 rounded-full" />
                  <div className="w-24 h-24 border border-amber-500/35 rounded-full" />
                </div>

                {/* Grid Overlay on top of image */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-10" />

                {/* Technical Corner Brackets on top of image */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-500 z-10 pointer-events-none" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-500 z-10 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-500 z-10 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-500 z-10 pointer-events-none" />

                {/* Overlaid Title and Info */}
                <div className="absolute bottom-4 left-4 right-4 z-20 text-center sm:text-left">
                  <span className="inline-block font-mono text-[9px] text-amber-500 tracking-widest uppercase font-bold bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                    OPERATOR CHASSIS PROFILE
                  </span>
                  <span className="block font-display font-bold text-base text-white tracking-wide mt-1.5 drop-shadow-md">
                    {content.heroProfileTitle}
                  </span>
                </div>
              </div>

              {/* Status bar details below screen */}
              <div className="mt-4 pt-3 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-200 flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center space-x-2 text-zinc-400 light:text-zinc-600">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>SYS: ONLINE</span>
                </div>
                <div className="text-zinc-500">
                  REF_V: 415.00V
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
