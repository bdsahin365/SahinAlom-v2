import React from 'react';
import { CASE_STUDIES } from '../data';
import { ChevronRight, Calculator, CheckSquare, Settings } from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseStudiesProps {
  onNavigate: (view: string, slug?: string) => void;
  caseStudies?: CaseStudy[];
}

export default function CaseStudies({ onNavigate, caseStudies = CASE_STUDIES }: CaseStudiesProps) {
  return (
    <section 
      id="work" 
      className="py-20 md:py-28 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block">
              02 — Field Investigations
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight">
              Problem → Solve
            </h2>
            <p className="text-zinc-400 light:text-zinc-600 max-w-xl text-sm md:text-base">
              Real faults, real calculations, real fixes. Every case follows the same discipline: 
              diagnose first, calculate second, fix third.
            </p>
          </div>
          <div className="h-0.5 w-12 bg-amber-500 mt-4 md:mt-0 md:hidden" />
        </div>

        {/* 2-Column Grid on Desktop, Horizontal Snap Carousel or stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {caseStudies.map((study) => (
            <div 
              key={study.slug}
              onClick={() => onNavigate('work-detail', study.slug)}
              className="group relative flex flex-col justify-between p-6 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg cursor-pointer hover:border-amber-500/40 hover:shadow-lg transition-all duration-300"
            >
              
              {/* Card top details */}
              <div className="space-y-4">
                
                {/* Category & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-amber-500 font-bold tracking-wider uppercase border border-amber-500/20 px-2 py-0.5 rounded">
                    {study.category}
                  </span>
                  {study.duration && (
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 px-2 py-0.5 rounded bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-zinc-50 font-bold">
                      {study.duration}
                    </span>
                  )}
                  {study.tags.map(tag => (
                    <span 
                      key={tag}
                      className="font-mono text-[9px] text-zinc-500 light:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-display font-bold text-lg md:text-xl text-zinc-100 light:text-zinc-900 group-hover:text-amber-500 transition-colors">
                  {study.title}
                </h3>

                <p className="text-sm text-zinc-400 light:text-zinc-600 leading-relaxed line-clamp-3">
                  {study.shortDesc}
                </p>
              </div>

              {/* Hover overlay indicator link */}
              <div className="mt-6 pt-4 border-t border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 flex items-center justify-between font-mono text-xs text-zinc-500 group-hover:text-amber-500 transition-colors">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-500" />
                  <span>View Math & Schematics</span>
                </div>
                <div className="flex items-center space-x-1 font-semibold">
                  <span>Read case study</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Minimal decoration */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-transparent group-hover:border-amber-500/40 transition-colors rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-transparent group-hover:border-amber-500/40 transition-colors rounded-bl-lg" />

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
