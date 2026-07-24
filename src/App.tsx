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
import { CASE_STUDIES, DEFAULT_HOMEPAGE_CONTENT, DEFAULT_APP_SETTINGS, DEFAULT_BLOG_POSTS, DEFAULT_PROFILE_DATA } from './data';
import { CaseStudy, HomepageContent, AppSettings, BlogPost, ProfileData } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' | 'work-detail' | 'admin' | 'resume' | 'biodata'
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(CASE_STUDIES);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync & Load data: Prioritizes live database API fetch, falling back to localStorage and default constants
  const syncFromStorage = async (showLoadingScreen = false) => {
    if (showLoadingScreen) {
      setIsLoading(true);
    }
    // Pre-populate with localStorage cache for instant UI feedback before API fetch resolves
    try {
      const storedCaseStudies = localStorage.getItem('sahin_case_studies');
      if (storedCaseStudies) setCaseStudies(JSON.parse(storedCaseStudies));

      const storedHome = localStorage.getItem('sahin_homepage_content');
      if (storedHome) setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...JSON.parse(storedHome) });

      const storedSettings = localStorage.getItem('sahin_portfolio_settings');
      if (storedSettings) setAppSettings({ ...DEFAULT_APP_SETTINGS, ...JSON.parse(storedSettings) });

      const storedProfile = localStorage.getItem('sahin_profile_data');
      if (storedProfile) setProfileData({ ...DEFAULT_PROFILE_DATA, ...JSON.parse(storedProfile) });

      const storedBlogs = localStorage.getItem('sahin_blog_posts');
      if (storedBlogs) {
        try {
          const parsed = JSON.parse(storedBlogs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingSlugs = new Set(parsed.map(b => b.slug));
            const missingDefaults = DEFAULT_BLOG_POSTS.filter(d => !existingSlugs.has(d.slug));
            const merged = [...parsed, ...missingDefaults];
            setBlogPosts(merged);
            localStorage.setItem('sahin_blog_posts', JSON.stringify(merged));
          } else {
            setBlogPosts(DEFAULT_BLOG_POSTS);
          }
        } catch {
          setBlogPosts(DEFAULT_BLOG_POSTS);
        }
      }
    } catch (e) {
      console.warn("Error reading cached local storage:", e);
    }

    // Direct Database API Fetching (Highest Priority)
    try {
      const [homeRes, studiesRes, blogsRes, settingsRes, profileRes] = await Promise.allSettled([
        fetch('/api/homepage'),
        fetch('/api/case-studies'),
        fetch('/api/blog-posts'),
        fetch('/api/settings'),
        fetch('/api/profile')
      ]);

      if (homeRes.status === 'fulfilled' && homeRes.value.ok) {
        const data = await homeRes.value.json();
        if (data && Object.keys(data).length > 0) {
          setHomepageContent(data);
          localStorage.setItem('sahin_homepage_content', JSON.stringify(data));
        }
      }

      if (studiesRes.status === 'fulfilled' && studiesRes.value.ok) {
        const data = await studiesRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setCaseStudies(data);
          localStorage.setItem('sahin_case_studies', JSON.stringify(data));
        }
      }

      if (blogsRes.status === 'fulfilled' && blogsRes.value.ok) {
        const data = await blogsRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setBlogPosts(data);
          localStorage.setItem('sahin_blog_posts', JSON.stringify(data));
        }
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
        const data = await settingsRes.value.json();
        if (data && typeof data === 'object') {
          const merged = { ...DEFAULT_APP_SETTINGS, ...data };
          setAppSettings(merged);
          localStorage.setItem('sahin_portfolio_settings', JSON.stringify(merged));

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
        }
      }

      if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
        const data = await profileRes.value.json();
        if (data && typeof data === 'object') {
          setProfileData(data);
          localStorage.setItem('sahin_profile_data', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn("Could not retrieve live data from database API, using cache or defaults.", err);
    } finally {
      if (showLoadingScreen) {
        setIsLoading(false);
      }
    }
  };

  // Load editable contents
  useEffect(() => {
    syncFromStorage(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 light:bg-zinc-50 text-zinc-100 light:text-zinc-900 transition-colors duration-300 flex flex-col justify-between">
        {/* Skeleton Header */}
        <header className="border-b border-zinc-900 light:border-zinc-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-850 light:bg-zinc-200 animate-pulse" />
            <div className="w-40 h-5 bg-zinc-850 light:bg-zinc-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="w-16 h-4 bg-zinc-850 light:bg-zinc-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-zinc-850 light:bg-zinc-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-zinc-850 light:bg-zinc-200 rounded animate-pulse" />
            <div className="w-20 h-8 bg-zinc-850 light:bg-zinc-200 rounded-lg animate-pulse" />
          </div>
        </header>

        {/* Skeleton Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12 my-auto">
          {/* Hero Section Skeleton */}
          <div className="space-y-4 max-w-3xl">
            <div className="w-36 h-6 bg-amber-500/20 rounded-full animate-pulse" />
            <div className="w-full sm:w-3/4 h-10 bg-zinc-850 light:bg-zinc-200 rounded-lg animate-pulse" />
            <div className="w-2/3 h-10 bg-zinc-850 light:bg-zinc-200 rounded-lg animate-pulse" />
            <div className="w-full h-4 bg-zinc-850/60 light:bg-zinc-300/60 rounded animate-pulse mt-4" />
            <div className="w-4/5 h-4 bg-zinc-850/60 light:bg-zinc-300/60 rounded animate-pulse" />
            <div className="flex space-x-4 pt-4">
              <div className="w-36 h-11 bg-amber-500/30 rounded-lg animate-pulse" />
              <div className="w-32 h-11 bg-zinc-850 light:bg-zinc-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-900 light:border-zinc-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900/50 light:bg-white p-6 rounded-xl border border-zinc-850 light:border-zinc-200 space-y-4 animate-pulse">
                <div className="w-full h-40 bg-zinc-850 light:bg-zinc-200 rounded-lg" />
                <div className="w-24 h-4 bg-amber-500/20 rounded" />
                <div className="w-3/4 h-6 bg-zinc-850 light:bg-zinc-200 rounded" />
                <div className="w-full h-12 bg-zinc-850/50 light:bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Footer */}
        <footer className="border-t border-zinc-900 light:border-zinc-200 py-6 px-6 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-mono text-zinc-400">Synchronizing Systems & Data...</span>
          </div>
          <span className="font-mono text-zinc-600 hidden sm:inline">Portfolio & Operations Platform</span>
        </footer>
      </div>
    );
  }

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
            {(homepageContent.showDailyCheck ?? true) && (
              <DailyCheck homepageContent={homepageContent} />
            )}

            {/* Case Studies */}
            <CaseStudies onNavigate={handleNavigate} caseStudies={caseStudies} homepageContent={homepageContent} />

            {/* Featured Blogs */}
            <FeaturedBlogs onNavigate={handleNavigate} posts={blogPosts} homepageContent={homepageContent} />

            {/* Capabilities */}
            <Capabilities onNavigate={handleNavigate} homepageContent={homepageContent} />

            {/* Contact */}
            <Contact homepageContent={homepageContent} profileData={profileData} appSettings={appSettings} />
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
          <Admin onSync={() => syncFromStorage(false)} />
        )}

        {currentView === 'resume' && (
          <Resume onBack={() => handleNavigate('home')} profileData={profileData} />
        )}

        {currentView === 'biodata' && (
          <Biodata onBack={() => handleNavigate('home')} profileData={profileData} />
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
                {(homepageContent?.showDailyCheck ?? true) && (
                  <button onClick={() => handleNavigate('home', undefined, 'daily-check')} className="hover:text-amber-500 cursor-pointer">Daily Check</button>
                )}
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
