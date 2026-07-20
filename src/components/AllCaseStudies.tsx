import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Filter, Layers, LayoutGrid, List, Calendar, Tag, ChevronRight, Calculator, RefreshCw
} from 'lucide-react';
import { CaseStudy } from '../types';
import { motion } from 'motion/react';

interface AllCaseStudiesProps {
  onBack: () => void;
  caseStudies: CaseStudy[];
  onNavigate: (view: string, slug?: string) => void;
}

export default function AllCaseStudies({ onBack, caseStudies, onNavigate }: AllCaseStudiesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dynamically extract categories from all case studies
  const categories = useMemo(() => {
    const cats = new Set<string>();
    caseStudies.forEach(study => {
      if (study.category) cats.add(study.category);
    });
    return ['All', ...Array.from(cats)];
  }, [caseStudies]);

  // Dynamically extract tags from all case studies
  const tags = useMemo(() => {
    const tg = new Set<string>();
    caseStudies.forEach(study => {
      if (study.tags) {
        study.tags.forEach(t => tg.add(t));
      }
    });
    return ['All', ...Array.from(tg)];
  }, [caseStudies]);

  // Filter case studies based on search query, selected category, and selected tag
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(study => {
      const matchesSearch = 
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (study.problem && study.problem.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (study.solution && study.solution.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || study.category === selectedCategory;
      
      const matchesTag = selectedTag === 'All' || (study.tags && study.tags.includes(selectedTag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [caseStudies, searchQuery, selectedCategory, selectedTag]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTag('All');
  };

  // Stagger animations container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 text-zinc-100 light:text-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK NAVIGATION */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-all cursor-pointer font-bold"
            id="all-work-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>

          {/* Mini total counter */}
          <div className="text-[10px] sm:text-xs font-mono text-zinc-400 light:text-zinc-500 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 px-3 py-1 rounded-full bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white">
            Total Projects Logged: <span className="text-amber-500 font-bold">{caseStudies.length}</span>
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="mb-8 pb-6 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Layers className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight">
                Engineering Case Studies
              </h1>
              <p className="text-[10px] sm:text-xs font-mono text-amber-500 font-semibold uppercase mt-0.5 tracking-wider">
                Field Investigations, Fault Coordination & Systems Diagnostics
              </p>
            </div>
          </div>
          <p className="text-zinc-400 light:text-zinc-650 text-xs sm:text-sm mt-3 max-w-4xl leading-relaxed">
            Detailed calculations, technical field notes, and diagnostic logs detailing root cause analyses, load coordination strategies, thermal scanning audits, and protective equipment programming.
          </p>
        </div>

        {/* SEARCH AND FILTER ENGINE */}
        <div className="bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl p-4 sm:p-6 mb-8 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search by keywords, categories, or technical terms... (e.g. Substation, Transformer)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-800 light:border-zinc-250 hover:border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-zinc-100 light:text-zinc-900 text-xs sm:text-sm rounded-lg py-2.5 pl-10 pr-4 outline-none transition-all placeholder:text-zinc-500"
                id="case-study-search-input"
              />
            </div>

            {/* Display & View Controls */}
            <div className="flex items-center gap-3 justify-end">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">View:</span>
              <div className="flex items-center border border-zinc-850 dark:border-zinc-800 light:border-zinc-200 rounded p-0.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
                  title="Grid Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
                  title="List Layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Pill bar */}
          <div className="space-y-2">
            <span className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
              Filter by Category:
            </span>
            <div className="flex overflow-x-auto md:flex-wrap gap-1.5 md:max-h-24 pb-3 md:pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded transition-all cursor-pointer border shrink-0 ${
                    selectedCategory === category 
                      ? 'bg-amber-500 border-amber-500 text-zinc-950 font-semibold' 
                      : 'bg-zinc-950/40 border-zinc-850 hover:border-zinc-700 text-zinc-350 light:bg-zinc-100 light:border-zinc-200 light:text-zinc-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Tags filter */}
          {tags.length > 1 && (
            <div className="space-y-1.5 pt-1 border-t border-zinc-900/60 dark:border-zinc-850/40 light:border-zinc-100">
              <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wide">
                Filter by Technical Tag:
              </span>
              <div className="flex overflow-x-auto md:flex-wrap gap-1 md:max-h-16 pb-3 md:pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all cursor-pointer shrink-0 ${
                      selectedTag === tag 
                        ? 'bg-zinc-100 dark:bg-zinc-100 light:bg-zinc-900 text-zinc-900 dark:text-zinc-900 light:text-zinc-100 font-bold' 
                        : 'text-zinc-400 hover:text-zinc-200 light:text-zinc-500 light:hover:text-zinc-700 bg-zinc-900/20 light:bg-zinc-50 border border-transparent hover:border-zinc-800 light:hover:border-zinc-250'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active filters status / clear bar */}
          {(selectedCategory !== 'All' || selectedTag !== 'All' || searchQuery) && (
            <div className="pt-2 flex items-center justify-between text-xs">
              <div className="text-zinc-400 light:text-zinc-500 font-mono">
                Showing <span className="text-amber-500 font-bold">{filteredCaseStudies.length}</span> of <span className="text-zinc-100 light:text-zinc-900 font-bold">{caseStudies.length}</span> results.
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center space-x-1 text-amber-500 hover:text-amber-400 transition-colors font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {filteredCaseStudies.length === 0 && (
          <div className="py-16 text-center border border-dashed border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl bg-zinc-900/10 light:bg-zinc-50">
            <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-zinc-300 light:text-zinc-700">No Case Studies Found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
              No case studies match your search queries or active filters. Please adjust your criteria or show all logs.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 text-xs font-mono font-bold bg-amber-500 text-zinc-950 rounded hover:bg-amber-400 transition-colors"
            >
              Show All Case Studies
            </button>
          </div>
        )}

        {/* CASE STUDIES DISPLAY */}
        {viewMode === 'grid' ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {filteredCaseStudies.map((study) => (
              <motion.div
                key={study.slug}
                variants={itemVariants}
                onClick={() => onNavigate('work-detail', study.slug)}
                className="group relative flex flex-col justify-between p-6 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl cursor-pointer hover:border-amber-500/40 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  
                  {/* Category, tags, and Duration */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] text-amber-500 font-bold tracking-wider uppercase border border-amber-500/20 px-2 py-0.5 rounded">
                      {study.category}
                    </span>
                    {study.duration && (
                      <span className="font-mono text-[9px] text-zinc-400 light:text-zinc-500 border border-zinc-800 dark:border-zinc-850 light:border-zinc-200 px-2 py-0.5 rounded bg-zinc-950/20 dark:bg-zinc-950/20 light:bg-zinc-50 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
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

                  <h3 className="font-display font-bold text-lg text-zinc-100 light:text-zinc-900 group-hover:text-amber-500 transition-colors">
                    {study.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 light:text-zinc-650 leading-relaxed line-clamp-3">
                    {study.shortDesc}
                  </p>
                </div>

                {/* Bottom link panel */}
                <div className="mt-6 pt-4 border-t border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-zinc-500">
                  <div className="flex items-center space-x-2 font-mono text-[10px] sm:text-xs">
                    <Calculator className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                    <span>Math & Diagrams Included</span>
                  </div>
                  
                  {/* Highly responsive button: Mobile full width, Desktop compact styled */}
                  <div className="w-full sm:w-auto">
                    <span className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-1.5 border border-amber-500/30 group-hover:border-amber-500 text-zinc-200 light:text-zinc-800 group-hover:text-zinc-950 font-mono text-[11px] uppercase tracking-wider rounded-md bg-amber-500/5 group-hover:bg-amber-500 transition-all duration-300 font-bold shadow-sm sm:text-xs">
                      <span>View Case Study</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Minimal tech decoration corners */}
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-transparent group-hover:border-amber-500/40 transition-colors rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-transparent group-hover:border-amber-500/40 transition-colors rounded-bl-xl" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* List Mode */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredCaseStudies.map((study) => (
              <motion.div
                key={study.slug}
                variants={itemVariants}
                onClick={() => onNavigate('work-detail', study.slug)}
                className="group relative p-4 bg-zinc-900/20 dark:bg-zinc-900/20 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl cursor-pointer hover:border-amber-500/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                      {study.category}
                    </span>
                    {study.duration && (
                      <span className="text-[9px] font-mono text-zinc-500">| {study.duration}</span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-base text-zinc-100 light:text-zinc-900 group-hover:text-amber-500 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 line-clamp-2 leading-relaxed">
                    {study.shortDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:self-center self-end">
                  {study.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag}
                      className="font-mono text-[9px] text-zinc-500 light:text-zinc-400 border border-zinc-800 dark:border-zinc-850 light:border-zinc-200 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  <div className="p-1 rounded-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 group-hover:bg-amber-500 group-hover:text-zinc-950 text-zinc-400 transition-all ml-2">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
