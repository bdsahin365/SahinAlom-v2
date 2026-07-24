import React from 'react';
import { ShieldCheck, Zap, AlertTriangle, ArrowRight, Mail } from 'lucide-react';
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
    heroProfileVideo: "",
    heroCtaPrimaryText: "Get in touch",
    heroCtaSecondaryText: "View my work"
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
            
            {/* Visually stunning Electrical Engineer profile card badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 animate-edge-pulse bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-zinc-50 rounded-full backdrop-blur-sm">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20">
                <Zap className="w-2.5 h-2.5 animate-pulse text-amber-500" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-100 light:text-zinc-800">
                {content.heroTagline || "Electrical Engineer"}
              </span>
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
                <span>{content.heroCtaSecondaryText || "View my work"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onScrollToSection('contact')}
                className="flex items-center space-x-2 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/50 hover:bg-zinc-900/20 light:hover:bg-zinc-100 text-zinc-300 light:text-zinc-700 px-6 py-3 rounded transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{content.heroCtaPrimaryText || "Get in touch"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Professional Portrait Panel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] p-3 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800/60 light:border-zinc-200/80 rounded-2xl shadow-sm">
              
              {/* Animated Live Status Badge */}
              <div className="absolute top-5 left-5 z-20 inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/90 backdrop-blur border border-zinc-800/50 dark:border-zinc-800/50 light:border-zinc-200 rounded-full text-[10px] font-mono font-bold text-emerald-400 light:text-emerald-600 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Active On Duty</span>
              </div>

              {/* Styled Technical Portrait Frame */}
              <div className="w-full h-[380px] bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                
                {/* Profile Picture */}
                {content.heroProfileImage ? (
                  <img 
                    src={content.heroProfileImage} 
                    alt={content.heroProfileName} 
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 hover:scale-105"
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
                    <svg className="w-24 h-24 text-amber-500/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  </div>
                )}

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 pointer-events-none" />

                {/* Overlaid Title and Info */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <span className="block font-display font-bold text-base text-white tracking-wide drop-shadow-sm">
                    {content.heroProfileName}
                  </span>
                  <span className="block text-xs text-zinc-300 font-mono mt-0.5 opacity-90">
                    {content.heroProfileTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
