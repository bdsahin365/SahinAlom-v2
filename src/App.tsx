import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DailyCheck from './components/DailyCheck';
import CaseStudies from './components/CaseStudies';
import FeaturedBlogs from './components/FeaturedBlogs';
import Capabilities from './components/Capabilities';
import Contact from './components/Contact';
import CaseStudyDetail from './components/CaseStudyDetail';
import Admin from './components/Admin';
import Resume from './components/Resume';
import Biodata from './components/Biodata';
import Tools from './components/Tools';
import AllCaseStudies from './components/AllCaseStudies';
import Blogs from './components/Blogs';
import { Home, Calculator, Cpu, Mail, Zap, ExternalLink, FileText, Heart } from 'lucide-react';
import { CASE_STUDIES, DEFAULT_HOMEPAGE_CONTENT, DEFAULT_APP_SETTINGS, DEFAULT_BLOG_POSTS } from './data';
import { CaseStudy, HomepageContent, AppSettings, BlogPost } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' | 'work-detail' | 'admin' | 'resume' | 'biodata'
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(CASE_STUDIES);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Sync data function
  const syncFromStorage = async () => {
    // 1. Immediate local memory load for snappy interface performance
    const storedCaseStudies = localStorage.getItem('sahin_case_studies');
    if (storedCaseStudies) {
      try {
        const parsed = JSON.parse(storedCaseStudies);
        if (Array.isArray(parsed)) {
          setCaseStudies(parsed);
        } else {
          setCaseStudies(CASE_STUDIES);
        }
      } catch (e) {
        setCaseStudies(CASE_STUDIES);
      }
    } else {
      setCaseStudies(CASE_STUDIES);
    }

    const storedHome = localStorage.getItem('sahin_homepage_content');
    if (storedHome) {
      try {
        const parsed = JSON.parse(storedHome);
        if (parsed && typeof parsed === 'object') {
          setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...parsed });
        } else {
          setHomepageContent(DEFAULT_HOMEPAGE_CONTENT);
        }
      } catch (e) {
        setHomepageContent(DEFAULT_HOMEPAGE_CONTENT);
      }
    } else {
      setHomepageContent(DEFAULT_HOMEPAGE_CONTENT);
    }

    const storedSettings = localStorage.getItem('sahin_portfolio_settings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings) as AppSettings;
        if (parsed && typeof parsed === 'object') {
          const merged = { ...DEFAULT_APP_SETTINGS, ...parsed };
          setAppSettings(merged);
          
          const storedTheme = localStorage.getItem('sahin_portfolio_theme');
          const themeToApply = storedTheme || merged.defaultTheme;
          if (themeToApply === 'light') {
            setDarkMode(false);
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
          } else {
            setDarkMode(true);
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
          }
        } else {
          setAppSettings(DEFAULT_APP_SETTINGS);
        }
      } catch (e) {
        setAppSettings(DEFAULT_APP_SETTINGS);
      }
    } else {
      setAppSettings(DEFAULT_APP_SETTINGS);
    }

    const storedBlogs = localStorage.getItem('sahin_blog_posts');
    if (storedBlogs) {
      try {
        const parsed = JSON.parse(storedBlogs);
        if (Array.isArray(parsed)) {
          setBlogPosts(parsed);
        } else {
          setBlogPosts(DEFAULT_BLOG_POSTS);
        }
      } catch (e) {
        setBlogPosts(DEFAULT_BLOG_POSTS);
      }
    } else {
      setBlogPosts(DEFAULT_BLOG_POSTS);
    }

    // 2. Fetch live values asynchronously from MongoDB Atlas database
    try {
      const homeRes = await fetch('/api/homepage');
      if (homeRes.ok) {
        const data = await homeRes.json();
        setHomepageContent(data);
        localStorage.setItem('sahin_homepage_content', JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Could not retrieve homepage from MongoDB Atlas, using cache.");
    }

    try {
      const studiesRes = await fetch('/api/case-studies');
      if (studiesRes.ok) {
        const data = await studiesRes.json();
        setCaseStudies(data);
        localStorage.setItem('sahin_case_studies', JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Could not retrieve case studies from MongoDB Atlas, using cache.");
    }

    try {
      const blogsRes = await fetch('/api/blog-posts');
      if (blogsRes.ok) {
        const data = await blogsRes.json();
        setBlogPosts(data);
        localStorage.setItem('sahin_blog_posts', JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Could not retrieve blog posts from MongoDB Atlas, using cache.");
    }

    try {
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setAppSettings(data);
        localStorage.setItem('sahin_portfolio_settings', JSON.stringify(data));
        
        const storedTheme = localStorage.getItem('sahin_portfolio_theme');
        const themeToApply = storedTheme || data.defaultTheme;
        if (themeToApply === 'light') {
          setDarkMode(false);
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          setDarkMode(true);
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        }
      }
    } catch (err) {
      console.warn("Could not retrieve settings from MongoDB Atlas, using cache.");
    }

    try {
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const data = await profileRes.json();
        localStorage.setItem('sahin_profile_data', JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Could not retrieve profile from MongoDB Atlas, using cache.");
    }
  };

  // Load editable contents
  useEffect(() => {
    syncFromStorage();
  }, []);

  // Initialize theme from storage
  useEffect(() => {
    const storedTheme = localStorage.getItem('sahin_portfolio_theme');
    let isLight = false;
    if (storedTheme) {
      isLight = storedTheme === 'light';
    } else {
      const storedSettings = localStorage.getItem('sahin_portfolio_settings');
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings) as AppSettings;
          isLight = parsed.defaultTheme === 'light';
        } catch (e) {}
      } else {
        isLight = DEFAULT_APP_SETTINGS.defaultTheme === 'light';
      }
    }

    if (isLight) {
      setDarkMode(false);
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Hash Router Interpretation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      
      if (hash.startsWith('#/work/')) {
        const slug = hash.replace('#/work/', '');
        setCurrentView('work-detail');
        setActiveSlug(slug);
      } else if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        setCurrentView('blog');
        setActiveSlug(slug);
      } else if (hash === '#/blog') {
        setCurrentView('blog');
        setActiveSlug('');
      } else if (hash === '#/admin') {
        setCurrentView('admin');
        setActiveSlug('');
      } else if (hash === '#/resume') {
        setCurrentView('resume');
        setActiveSlug('');
      } else if (hash === '#/biodata') {
        setCurrentView('biodata');
        setActiveSlug('');
      } else if (hash === '#/tools') {
        setCurrentView('tools');
        setActiveSlug('');
      } else if (hash === '#/all-work') {
        setCurrentView('all-work');
        setActiveSlug('');
      } else {
        setCurrentView('home');
        setActiveSlug('');
        
        // Handle scrolling to sections from hash
        const sections = ['daily-check', 'work', 'capabilities', 'contact', 'hero'];
        const sectionId = hash.replace('#/', '');
        if (sections.includes(sectionId)) {
          setTimeout(() => {
            scrollToSection(sectionId);
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger once on load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Intersection Observer to highlight active section in Navbar
  useEffect(() => {
    if (currentView !== 'home') return;

    const sections = ['hero', 'daily-check', 'work', 'capabilities', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.35 }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [currentView]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('sahin_portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sahin_portfolio_theme', 'light');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Safe navigation handler that manages window hashes
  const handleNavigate = (view: string, slug?: string, sectionId?: string) => {
    if (view === 'work-detail' && slug) {
      window.location.hash = `#/work/${slug}`;
    } else if (view === 'blog') {
      if (slug) {
        window.location.hash = `#/blog/${slug}`;
      } else {
        window.location.hash = '#/blog';
      }
    } else if (view === 'admin') {
      window.location.hash = '#/admin';
    } else if (view === 'resume') {
      window.location.hash = '#/resume';
    } else if (view === 'biodata') {
      window.location.hash = '#/biodata';
    } else if (view === 'tools') {
      window.location.hash = '#/tools';
    } else if (view === 'all-work') {
      window.location.hash = '#/all-work';
    } else {
      // Home navigation
      if (sectionId) {
        window.location.hash = `#/${sectionId}`;
        scrollToSection(sectionId);
      } else {
        window.location.hash = '#/';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('hero');
      }
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      
      {/* Top Header */}
      {currentView === 'home' && (
        <Header 
          currentView={currentView}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          homepageContent={homepageContent}
        />
      )}

      {/* Main Container */}
      <main className={(currentView === 'admin' || !appSettings.showBottomNav) ? '' : 'pb-16 md:pb-0'}>
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero onScrollToSection={scrollToSection} homepageContent={homepageContent} />

            {/* Daily Check (About) */}
            <DailyCheck />

            {/* Case Studies */}
            <CaseStudies onNavigate={handleNavigate} caseStudies={caseStudies} />

            {/* Featured Blogs */}
            <FeaturedBlogs onNavigate={handleNavigate} posts={blogPosts} />

            {/* Capabilities */}
            <Capabilities onNavigate={handleNavigate} />

            {/* Contact */}
            <Contact />
          </>
        )}

        {currentView === 'work-detail' && (
          <CaseStudyDetail 
            slug={activeSlug}
            onBack={() => handleNavigate('home')}
            caseStudies={caseStudies}
          />
        )}

        {currentView === 'blog' && (
          <Blogs 
            initialSlug={activeSlug}
            onBack={() => handleNavigate('home')}
            blogPosts={blogPosts}
          />
        )}

        {currentView === 'admin' && (
          <Admin onSync={syncFromStorage} />
        )}

        {currentView === 'resume' && (
          <Resume onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'biodata' && (
          <Biodata onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'tools' && (
          <Tools onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'all-work' && (
          <AllCaseStudies 
            onBack={() => handleNavigate('home')} 
            caseStudies={caseStudies}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer Section */}
      {currentView !== 'admin' && (
        <footer className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 py-12 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-6 gap-4">
              <span className="font-display font-semibold text-sm text-zinc-350 light:text-zinc-800">
                Sahin Alom — Electrical Engineer, Dhaka
              </span>
              <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px] text-zinc-400">
                <button onClick={() => handleNavigate('home', undefined, 'daily-check')} className="hover:text-amber-500 cursor-pointer">Daily Check</button>
                <button onClick={() => handleNavigate('home', undefined, 'work')} className="hover:text-amber-500 cursor-pointer">Work</button>
                <button onClick={() => handleNavigate('home', undefined, 'capabilities')} className="hover:text-amber-500 cursor-pointer">Capabilities</button>
                <button onClick={() => handleNavigate('home', undefined, 'contact')} className="hover:text-amber-500 cursor-pointer">Contact</button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px]">
              <span>
                &copy; 2026 Sahin Alom. Designed for heavy industrial reliability.
              </span>
              <span className="font-mono text-zinc-600">
                COMPLIANT TO BNBC 2020 | DESCO GRID REF: 50HZ
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Tab Navigation (< 768px) */}
      {currentView !== 'admin' && currentView !== 'tools' && appSettings.showBottomNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-zinc-50/95 border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200 z-50 h-16 flex items-center justify-around px-4 shadow-lg backdrop-blur">
          
          <button
            onClick={() => handleNavigate('home', undefined, 'hero')}
            className={`flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded transition-colors ${
              activeSection === 'hero' && currentView === 'home'
                ? 'text-amber-500'
                : 'text-zinc-500 light:text-zinc-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase tracking-tight">Home</span>
          </button>

          <button
            onClick={() => handleNavigate('home', undefined, 'work')}
            className={`flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded transition-colors ${
              activeSection === 'work' && currentView === 'home'
                ? 'text-amber-500'
                : 'text-zinc-500 light:text-zinc-400'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase tracking-tight">Work</span>
          </button>

          <button
            onClick={() => handleNavigate('home', undefined, 'capabilities')}
            className={`flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded transition-colors ${
              activeSection === 'capabilities' && currentView === 'home'
                ? 'text-amber-500'
                : 'text-zinc-500 light:text-zinc-400'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase tracking-tight">Expertise</span>
          </button>

          <button
            onClick={() => handleNavigate('home', undefined, 'contact')}
            className={`flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded transition-colors ${
              activeSection === 'contact' && currentView === 'home'
                ? 'text-amber-500'
                : 'text-zinc-500 light:text-zinc-400'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="text-[9px] font-mono uppercase tracking-tight">Contact</span>
          </button>

        </div>
      )}

    </div>
  );
}
