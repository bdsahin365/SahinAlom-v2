import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { DEFAULT_BLOG_POSTS } from '../data';
import { Search, Calendar, Clock, ArrowLeft, Tag, BookOpen, Share2, Check, Send, ChevronRight, CheckSquare, Square } from 'lucide-react';

interface BlogsProps {
  onBack: () => void;
  blogPosts?: BlogPost[];
  initialSlug?: string;
}

// Helper to calculate estimated reading time based on content word count
export const getReadingTime = (content: string) => {
  const text = content || '';
  // Split on whitespaces to get clean word array
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200; // Average technical reading speed
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return {
    minutes,
    words,
    text: `${minutes} min read`
  };
};

export default function Blogs({ onBack, blogPosts = DEFAULT_BLOG_POSTS, initialSlug }: BlogsProps) {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Local checklist state to remember checked items interactively
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper function to parse fractions in math expressions
  const parseFrac = (text: string): { left: string; numerator: string; denominator: string; right: string } | null => {
    const fracIndex = text.indexOf('\\frac{');
    if (fracIndex === -1) return null;
    
    // Find matching brace for numerator
    let braceCount = 1;
    let numEnd = -1;
    for (let i = fracIndex + 6; i < text.length; i++) {
      if (text[i] === '{') braceCount++;
      else if (text[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          numEnd = i;
          break;
        }
      }
    }
    
    if (numEnd === -1) return null;
    const numerator = text.substring(fracIndex + 6, numEnd);
    
    // Find matching brace for denominator
    if (text[numEnd + 1] !== '{') return null;
    braceCount = 1;
    let denEnd = -1;
    for (let i = numEnd + 2; i < text.length; i++) {
      if (text[i] === '{') braceCount++;
      else if (text[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          denEnd = i;
          break;
        }
      }
    }
    
    if (denEnd === -1) return null;
    const denominator = text.substring(numEnd + 2, denEnd);
    
    return {
      left: text.substring(0, fracIndex),
      numerator,
      denominator,
      right: text.substring(denEnd + 1)
    };
  };

  // Helper function to parse subscripts
  const parseSubscript = (text: string): { left: string; base: string; sub: string; right: string } | null => {
    const subIndex = text.indexOf('_');
    if (subIndex === -1 || subIndex === 0) return null;
    
    const base = text[subIndex - 1];
    const left = text.substring(0, subIndex - 1);
    
    let sub = '';
    let right = '';
    if (text[subIndex + 1] === '{') {
      let braceCount = 1;
      let end = -1;
      for (let i = subIndex + 2; i < text.length; i++) {
        if (text[i] === '{') braceCount++;
        else if (text[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            end = i;
            break;
          }
        }
      }
      if (end !== -1) {
        sub = text.substring(subIndex + 2, end);
        right = text.substring(end + 1);
      } else {
        return null;
      }
    } else {
      sub = text[subIndex + 1] || '';
      right = text.substring(subIndex + 2);
    }
    
    return { left, base, sub, right };
  };

  // Recursively render segments of math expressions
  const renderMathSegment = (text: string): React.ReactNode => {
    let cleaned = text.trim();
    if (!cleaned) return null;

    // First check for fractions
    const frac = parseFrac(cleaned);
    if (frac) {
      return (
        <span className="inline-flex items-center">
          {renderMathSegment(frac.left)}
          <span className="inline-flex flex-col items-center align-middle mx-1.5 px-1 bg-zinc-900/10 dark:bg-zinc-900/20 light:bg-zinc-100 rounded border border-zinc-850/20 light:border-zinc-200">
            <span className="text-[11px] sm:text-xs border-b border-zinc-750 dark:border-zinc-700 light:border-zinc-300 pb-0.5 text-center leading-none font-bold text-amber-500">
              {renderMathSegment(frac.numerator)}
            </span>
            <span className="text-[11px] sm:text-xs pt-0.5 text-center leading-none text-zinc-300 light:text-zinc-700">
              {renderMathSegment(frac.denominator)}
            </span>
          </span>
          {renderMathSegment(frac.right)}
        </span>
      );
    }

    // Check for subscripts
    const sub = parseSubscript(cleaned);
    if (sub) {
      return (
        <span className="inline-flex items-center">
          {renderMathSegment(sub.left)}
          <span className="font-mono text-zinc-150 light:text-zinc-900">{sub.base}</span>
          <sub className="text-[9px] text-amber-500 font-bold -bottom-[0.25em] relative inline-block leading-none mx-0.5">
            {renderMathSegment(sub.sub)}
          </sub>
          {renderMathSegment(sub.right)}
        </span>
      );
    }

    // Clean up text tags
    let textRegex = /\\text\{([^\}]+)\}/g;
    cleaned = cleaned.replace(textRegex, '$1');

    // Replace mathematical symbols and greek letters with unicode equivalents
    cleaned = cleaned
      .replace(/\\theta/g, 'θ')
      .replace(/\\pi/g, 'π')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\cos/g, 'cos')
      .replace(/\\times/g, ' × ')
      .replace(/\\dots/g, '⋯')
      .replace(/=/g, ' = ')
      .replace(/\+/g, ' + ');

    return <span className="font-mono text-zinc-150 light:text-zinc-800 tracking-wide font-semibold">{cleaned}</span>;
  };

  const [authorName, setAuthorName] = useState('Sahin Alom');
  const [authorTitle, setAuthorTitle] = useState('Senior Industrial Electrical Maintenance Engineer, Dhaka');
  const [authorImage, setAuthorImage] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop');

  useEffect(() => {
    // Attempt to load from profile data
    const savedProfile = localStorage.getItem('sahin_profile_data');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setAuthorName(parsed.name);
        if (parsed.title) setAuthorTitle(parsed.title);
        if (parsed.imageUrl) setAuthorImage(parsed.imageUrl);
      } catch (e) {}
    }

    // Attempt to load profile image from homepage content if not loaded from profile
    const savedHome = localStorage.getItem('sahin_homepage_content');
    if (savedHome) {
      try {
        const parsed = JSON.parse(savedHome);
        if (parsed.heroProfileImage) {
          setAuthorImage(parsed.heroProfileImage);
        }
      } catch (e) {}
    }
  }, []);

  // Sync selectedPost with initialSlug prop
  useEffect(() => {
    if (initialSlug) {
      const found = posts.find(p => p.slug === initialSlug);
      if (found) {
        setSelectedPost(found);
      }
    } else {
      setSelectedPost(null);
    }
  }, [initialSlug, posts]);

  // Sync with localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('sahin_blog_posts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as BlogPost[];
        // Filter out drafts for frontend viewing (unless they are previewed)
        setPosts(parsed.filter(p => p.published));
      } catch (e) {
        console.error(e);
      }
    } else {
      setPosts(blogPosts.filter(p => p.published));
    }
  }, [blogPosts]);

  // Scroll to top on mount or post selection
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedPost]);

  // Reading progress scroll tracker for long-form technical articles
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!selectedPost) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once initially to set starting state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedPost]);

  // Extract unique categories
  const categories = Array.from(new Set(posts.map(p => p.category)));

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleShare = (post: BlogPost) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/blog/${post.slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderInlineMathAndFormatting = (text: string): React.ReactNode => {
    // Check for inline math split ($...$)
    const mathRegex = /\$([^\$]+)\$/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mathRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...parseInlineBold(text.substring(lastIndex, match.index)));
      }
      parts.push(
        <span 
          key={`math-${match.index}`} 
          className="inline-flex items-center px-1.5 py-0.5 bg-amber-500/5 text-amber-500 light:text-amber-600 font-mono text-[11px] sm:text-xs rounded border border-amber-500/10 mx-0.5 font-bold"
        >
          {renderMathSegment(match[1])}
        </span>
      );
      lastIndex = mathRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(...parseInlineBold(text.substring(lastIndex)));
    }

    return parts.length > 0 ? parts : text;
  };

  const parseInlineBold = (text: string): React.ReactNode[] => {
    const boldParts: React.ReactNode[] = [];
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIdx = 0;
    let boldMatch;

    while ((boldMatch = boldRegex.exec(text)) !== null) {
      if (boldMatch.index > lastIdx) {
        boldParts.push(text.substring(lastIdx, boldMatch.index));
      }
      boldParts.push(
        <strong key={`bold-${boldMatch.index}`} className="font-bold text-zinc-150 light:text-zinc-950 font-display">
          {boldMatch[1]}
        </strong>
      );
      lastIdx = boldRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      boldParts.push(text.substring(lastIdx));
    }

    return boldParts;
  };

  const formatContent = (content: string) => {
    // Basic rich text/markdown paragraph splitter & custom renderer for standard codes & formulas
    return content.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      // Check for code blocks / tables
      if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
        const codeText = trimmed.slice(3, -3).trim();
        return (
          <pre key={index} className="p-4 bg-zinc-950 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded font-mono text-xs text-zinc-300 light:text-zinc-800 overflow-x-auto my-4 leading-relaxed light:bg-zinc-100">
            {codeText}
          </pre>
        );
      }

      // Check for formulas (starts with $$ and ends with $$)
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        const formula = trimmed.slice(2, -2).trim();
        return (
          <div key={index} className="my-6 p-5 bg-amber-500/5 border-l-2 border-amber-500 font-mono text-xs sm:text-sm text-amber-500 overflow-x-auto rounded-r-xl shadow-inner flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <span className="block text-[8px] text-zinc-500 uppercase tracking-widest mb-2 font-bold font-mono">
                Industrial Calculation Node
              </span>
              <div className="py-2 text-sm sm:text-base text-zinc-100 light:text-zinc-900 select-all overflow-x-auto leading-relaxed">
                {renderMathSegment(formula)}
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono bg-zinc-950/40 p-2 rounded border border-zinc-900 self-start md:self-auto uppercase tracking-wider">
              Formula Node: {formula.includes('\\frac') ? 'Fraction Relation' : 'Lineal Relation'}
            </div>
          </div>
        );
      }

      // Check for headings
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={index} className="text-sm sm:text-base font-bold font-display text-zinc-100 light:text-zinc-900 mt-6 mb-3 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
            {trimmed.replace('###', '').trim()}
          </h3>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h2 key={index} className="text-base sm:text-lg font-bold font-display text-zinc-100 light:text-zinc-900 mt-8 mb-4 border-b border-zinc-800 dark:border-zinc-800/60 light:border-zinc-250 pb-1.5 tracking-tight">
            {trimmed.replace('##', '').trim()}
          </h2>
        );
      }

      // Check for bullet items - render as nice checklists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(li => li.replace(/^[-*]\s+/, '').trim());
        return (
          <div key={index} className="my-6 p-4 bg-zinc-900/10 dark:bg-zinc-900/15 light:bg-zinc-100/60 rounded-xl border border-zinc-900 dark:border-zinc-850 light:border-zinc-200/85 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-900/50 dark:border-zinc-850/40 light:border-zinc-200">
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500 light:text-amber-600 font-bold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                Operations Checklist / Guidelines
              </span>
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                Interactive Check
              </span>
            </div>
            <ul className="space-y-2.5 pl-1">
              {items.map((item, i) => {
                const itemKey = `${selectedPost?.slug}-${index}-${i}`;
                const isChecked = !!checkedItems[itemKey];

                // Check if starting with custom brackets [ ] or [x]
                let isExplicitChecklist = false;
                let isExplicitChecked = false;
                let cleanItem = item;

                if (item.startsWith('[ ]')) {
                  isExplicitChecklist = true;
                  cleanItem = item.substring(3).trim();
                } else if (item.startsWith('[x]')) {
                  isExplicitChecklist = true;
                  isExplicitChecked = true;
                  cleanItem = item.substring(3).trim();
                }

                // If explicit check state not set in checkedItems, use explicit checked status
                const activeChecked = checkedItems[itemKey] !== undefined ? isChecked : (isExplicitChecklist ? isExplicitChecked : false);

                // Extract bold prefix like "Bold Text:" or "**Bold Text**:"
                let prefix = '';
                let restText = cleanItem;

                const boldMatch = cleanItem.match(/^(\*\*([^*]+)\*\*|([^:]+)):(.*)$/);
                if (boldMatch) {
                  prefix = boldMatch[2] || boldMatch[3];
                  restText = boldMatch[4].trim();
                }

                return (
                  <li 
                    key={i} 
                    onClick={() => toggleCheck(itemKey)}
                    className={`group flex items-start gap-3 cursor-pointer select-none text-xs sm:text-sm leading-relaxed p-2 rounded-lg transition-all ${
                      activeChecked 
                        ? 'text-zinc-500 line-through decoration-zinc-700/50 bg-zinc-900/10 dark:bg-zinc-950/20 light:bg-zinc-200/30' 
                        : 'text-zinc-300 light:text-zinc-700 hover:bg-zinc-900/30 dark:hover:bg-zinc-900/10 light:hover:bg-zinc-200/50'
                    }`}
                  >
                    <button 
                      className={`mt-0.5 flex-shrink-0 transition-colors focus:outline-none ${
                        activeChecked ? 'text-amber-500' : 'text-zinc-600 group-hover:text-amber-500/80'
                      }`}
                    >
                      {activeChecked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      {prefix && (
                        <strong className={`font-bold transition-colors block sm:inline mr-1 ${
                          activeChecked ? 'text-zinc-600' : 'text-zinc-100 light:text-zinc-900 font-display'
                        }`}>
                          {prefix}:
                        </strong>
                      )}
                      <span>
                        {renderInlineMathAndFormatting(restText)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }

      // Default paragraph, split and check for inline math ($...$) and inline bold (**...**)
      return (
        <p key={index} className="text-xs sm:text-sm text-zinc-300 light:text-zinc-700 leading-relaxed mb-4">
          {renderInlineMathAndFormatting(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="pt-12 md:pt-16 pb-20 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50">
      {/* Thin reading progress bar for long-form technical articles */}
      {selectedPost && (
        <div 
          className="fixed top-0 left-0 w-full h-[4px] bg-zinc-900/10 dark:bg-zinc-950/20 light:bg-zinc-250/10 z-[100] pointer-events-none"
          id="reading-progress-bar"
        >
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK / HEADER NAV */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={selectedPost ? () => setSelectedPost(null) : onBack}
            className="group inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-zinc-450 hover:text-amber-500 transition-colors cursor-pointer"
            id="blog-back-btn"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{selectedPost ? "Back to Operations Notes" : "Return to Dashboard"}</span>
          </button>
          
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            SYSTEM NODE: ENGINEERING JOURNAL
          </span>
        </div>

        {/* READER VIEW */}
        {selectedPost ? (
          <article className="max-w-3xl mx-auto" id="selected-blog-view">
            
            {/* Header Metadata */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase tracking-wider rounded">
                  {selectedPost.category}
                </span>
                <span className="text-zinc-500 font-mono text-xs">•</span>
                <span className="inline-flex items-center text-zinc-400 font-mono text-[11px] gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {selectedPost.date}
                </span>
                <span className="text-zinc-500 font-mono text-xs">•</span>
                <span className="inline-flex items-center text-zinc-400 font-mono text-[11px] gap-1.5 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-zinc-100 px-2 py-0.5 rounded border border-zinc-800 dark:border-zinc-800/80 light:border-zinc-200" title="Dynamically calculated based on article word count">
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span className="text-amber-500 font-semibold">{getReadingTime(selectedPost.content).text}</span>
                  <span className="text-zinc-500 text-[10px]">({getReadingTime(selectedPost.content).words} words)</span>
                </span>
              </div>

              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight leading-tight">
                {selectedPost.title}
              </h1>

              <div className="h-0.5 w-16 bg-amber-500" />
              
              <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-600 italic leading-relaxed border-l-2 border-zinc-800 dark:border-zinc-800 light:border-zinc-200 pl-4 py-1">
                {selectedPost.summary}
              </p>
            </div>

            {/* Post Banner Image */}
            {selectedPost.imageUrl && (
              <div className="aspect-[21/9] rounded-xl overflow-hidden border border-zinc-800 dark:border-zinc-800/80 light:border-zinc-200 mb-8 bg-zinc-900">
                <img 
                  src={selectedPost.imageUrl} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Rendered Markdown/Plain Text Content */}
            <div className="max-w-none text-zinc-300 light:text-zinc-800">
              {formatContent(selectedPost.content)}
            </div>

            {/* Footer tags / actions */}
            <div className="border-t border-zinc-800 dark:border-zinc-800/80 light:border-zinc-200 mt-12 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {selectedPost.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 bg-zinc-900 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 px-2 py-0.5 rounded">
                    <Tag className="w-2.5 h-2.5 text-zinc-500" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 text-xs font-mono rounded border border-zinc-800 hover:border-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Copy permanent share link"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-400">Copied Link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Share Post</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/8801712345678?text=Hello%20Sahin,%20I%20just%20read%20your%20article%20%22${encodeURIComponent(selectedPost.title)}%22%20and%20wanted%20to%20discuss%20it.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Discuss Article</span>
                </a>
              </div>
            </div>

            {/* Author box */}
            <div className="mt-10 p-5 bg-zinc-900/40 light:bg-zinc-100/80 border border-zinc-800 light:border-zinc-200 rounded-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/20 light:border-amber-500/40 bg-zinc-950 light:bg-zinc-200 flex-shrink-0 animate-edge-pulse">
                <img 
                  src={authorImage} 
                  alt={authorName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-amber-500 light:text-amber-600 font-bold">WRITTEN BY</span>
                <span className="block font-display font-bold text-sm text-zinc-200 light:text-zinc-900">{authorName}</span>
                <span className="block text-xs text-zinc-400 light:text-zinc-600">{authorTitle}</span>
              </div>
            </div>

          </article>
        ) : (
          /* BLOG LIST VIEW WITH FILTER AND SEARCH */
          <div className="space-y-12">
            
            {/* Page Header */}
            <div>
              <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block mb-1">
                Industrial Logs & Field Records
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight">
                Operations Journal & Notes
              </h1>
              <p className="text-zinc-400 light:text-zinc-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-2xl">
                Field notes, compliance manuals, and load troubleshooting registers compiled directly from my daily factory operations in Dhaka, Bangladesh. Highly specific industrial advice.
              </p>
              <div className="h-0.5 w-12 bg-amber-500 mt-4" />
            </div>

            {/* Search and Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Search input */}
              <div className="relative md:col-span-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technical notes, codes, formulas..."
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 text-xs rounded-lg text-zinc-100 light:text-zinc-900 focus:border-amber-500/50 outline-none transition-colors font-mono"
                />
              </div>

              {/* Categories horizontally */}
              <div className="md:col-span-6 flex overflow-x-auto md:flex-wrap gap-2 justify-start md:justify-end pb-3 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border cursor-pointer transition-all shrink-0 ${
                    selectedCategory === null
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : 'bg-zinc-900 light:bg-zinc-100 border-zinc-800 light:border-zinc-200 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All Categories ({posts.length})
                </button>
                {categories.map((cat, i) => {
                  const count = posts.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border cursor-pointer transition-all shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                          : 'bg-zinc-900 light:bg-zinc-100 border-zinc-800 light:border-zinc-200 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

            </div>

            {/* List Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.slug}
                    onClick={() => setSelectedPost(post)}
                    className="group flex flex-col justify-between p-5 bg-zinc-900/30 hover:bg-zinc-900/60 light:bg-white light:hover:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 hover:border-amber-500/20 rounded-xl cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <div>
                      {/* Image Preview if available */}
                      {post.imageUrl && (
                        <div className="aspect-[16/9] w-full rounded-lg overflow-hidden mb-4 bg-zinc-950 border border-zinc-800 light:border-zinc-200">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-amber-500/5 text-amber-500 text-[9px] font-mono uppercase tracking-wider rounded border border-amber-500/10">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1" title="Dynamic word count reading time">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{getReadingTime(post.content).text}</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-zinc-200 light:text-zinc-900 group-hover:text-amber-500 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-zinc-400 light:text-zinc-600 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="border-t border-zinc-800/60 dark:border-zinc-800/40 light:border-zinc-100 mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {post.date}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-zinc-400 group-hover:text-amber-500 flex items-center gap-1 transition-colors">
                        <span>Read Note</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-zinc-800 dark:border-zinc-800 border-dashed rounded-xl">
                <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-display font-semibold text-zinc-300">No Industrial Notes Found</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  No matching technical guides or log files fit the search parameters. Try broadening your keywords or select another category.
                </p>
              </div>
            )}

            {/* Quick Consultation CTA */}
            <div className="p-6 bg-zinc-900/10 light:bg-zinc-100/50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-base text-zinc-200 light:text-zinc-900">
                  Looking for customized power calculations?
                </h3>
                <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1 max-w-xl">
                  If you need specific advice on transformer sizing, earthing grids, or protective relay calibrations for your factory, let's schedule an inspection session.
                </p>
              </div>
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-mono font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
