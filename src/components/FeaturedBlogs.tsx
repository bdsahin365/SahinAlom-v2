import React from 'react';
import { DEFAULT_BLOG_POSTS } from '../data';
import { ChevronRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { BlogPost, HomepageContent } from '../types';

interface FeaturedBlogsProps {
  onNavigate: (view: string, slug?: string) => void;
  posts?: BlogPost[];
  homepageContent?: HomepageContent;
}

// Helper to calculate estimated reading time based on content word count
const getReadingTime = (content: string) => {
  const text = content || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return {
    minutes,
    words,
    text: `${minutes} min read`
  };
};

export default function FeaturedBlogs({ onNavigate, posts = DEFAULT_BLOG_POSTS, homepageContent }: FeaturedBlogsProps) {
  // Show first 3 published blog posts
  const featuredPosts = posts.filter(p => p.published).slice(0, 3);

  const tagline = homepageContent?.featuredBlogsTagline || homepageContent?.journalTagline || "04 — Engineering Journal";
  const heading = homepageContent?.featuredBlogsHeading || homepageContent?.journalHeading || "Operations Journal & Notes";
  const desc = homepageContent?.featuredBlogsDesc || homepageContent?.journalDesc || "Field notes, compliance manuals, and calculation registers compiled directly from my daily substation maintenance routines in Dhaka, Bangladesh.";

  return (
    <section 
      id="featured-blogs" 
      className="py-20 md:py-28 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-row items-end justify-between border-b border-zinc-900/60 dark:border-zinc-900/40 light:border-zinc-200 pb-6">
          <div className="space-y-1 flex-1 pr-4">
            <span className="font-mono text-[10px] sm:text-xs text-amber-500 uppercase tracking-widest block">
              {tagline}
            </span>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight">
                {heading}
              </h2>
              
              {/* Mobile-only Arrow Button right next to/aligned with Title */}
              <button
                onClick={() => onNavigate('blog')}
                className="md:hidden flex items-center justify-center p-2 rounded-full border border-amber-500/20 text-amber-500 hover:bg-amber-500/10 cursor-pointer transition-colors"
                title="View All Notes"
                id="mobile-view-all-blogs-btn"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-zinc-400 light:text-zinc-650 max-w-xl text-xs sm:text-sm leading-relaxed mt-2">
              {desc}
            </p>
          </div>
          
          {/* Desktop-only View All Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-500 hover:text-amber-400 font-bold group cursor-pointer transition-all"
              id="view-all-blogs-header-btn"
            >
              <span>View All Journal Notes ({posts.length})</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredPosts.map((post) => (
            <div 
              key={post.slug}
              onClick={() => onNavigate('blog', post.slug)}
              className="group relative flex flex-col justify-between p-5 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 hover:border-amber-500/30 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <div>
                {/* Image if available */}
                {post.imageUrl && (
                  <div className="aspect-[16/9] w-full rounded-lg overflow-hidden mb-4 bg-zinc-950 border border-zinc-900/60 light:border-zinc-200">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Meta details */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono uppercase tracking-wider rounded">
                    {post.category}
                  </span>
                  <span className="text-zinc-600 font-mono text-[10px]">•</span>
                  <span className="inline-flex items-center text-zinc-500 font-mono text-[10px] gap-1" title="Dynamic word count reading time">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{getReadingTime(post.content).text}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-zinc-100 light:text-zinc-900 group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-zinc-400 light:text-zinc-600 mt-2 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-100 mt-4 pt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-amber-500 transition-colors">
                <span>{post.date}</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  Read Note <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button Bottom */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => onNavigate('blog')}
            className="w-full py-3 bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 text-xs font-mono uppercase tracking-wider text-amber-500 font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore All Journal Notes ({posts.length})</span>
          </button>
        </div>

      </div>
    </section>
  );
}
