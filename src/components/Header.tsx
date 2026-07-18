import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, FileText, Menu, X, ShieldAlert, Cpu, CheckCircle,
  Zap, Activity, Flame, Plug, Wrench, Shield, Radio, Terminal, Server, Lightbulb, Gauge, Database, Layers, Settings, Component
} from 'lucide-react';
import { HomepageContent } from '../types';

const IconMap: Record<string, React.ComponentType<any>> = {
  Cpu,
  Zap,
  Activity,
  ShieldAlert,
  Flame,
  Plug,
  Wrench,
  Shield,
  Radio,
  Terminal,
  Server,
  Lightbulb,
  Gauge,
  Database,
  Layers,
  Settings,
  Component
};

export function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const IconComponent = IconMap[name] || Cpu; // default to Cpu
  return <IconComponent {...props} />;
}

interface HeaderProps {
  currentView: string;
  activeSection: string;
  onNavigate: (view: string, slug?: string, sectionId?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  homepageContent?: HomepageContent;
}

export default function Header({
  currentView,
  activeSection,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  homepageContent,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Track scroll position for header glass/flat styling and hiding on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled beyond 20px
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/show logic based on scroll direction (Mobile only or general)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false); // scrolling down
      } else {
        setHeaderVisible(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate('home', undefined, sectionId);
  };

  const triggerPrintCV = () => {
    window.print();
  };

  return (
    <>
      {/* Top sticky navigation */}
      <header
        id="app-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-zinc-50/95 border-zinc-800 dark:border-zinc-800 light:border-zinc-200 shadow-sm'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Title Left */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-9 h-9 border border-amber-500/30 rounded bg-zinc-900 group-hover:border-amber-500 transition-colors">
              <DynamicIcon name={homepageContent?.headerLogoIcon || 'Cpu'} className="w-5 h-5 text-amber-500" />
              {/* Live green dot in corner */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-lg text-zinc-100 light:text-zinc-950">
                SAHIN ALOM
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  EE. Dhaka
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Center */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('hero')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                activeSection === 'hero' && currentView === 'home'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('daily-check')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                activeSection === 'daily-check' && currentView === 'home'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              The Daily Check
            </button>
            <button
              onClick={() => handleNavClick('work')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                activeSection === 'work' && currentView === 'home'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Case Studies
            </button>
            <button
              onClick={() => handleNavClick('capabilities')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                activeSection === 'capabilities' && currentView === 'home'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                activeSection === 'contact' && currentView === 'home'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('resume')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                currentView === 'resume'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Resume
            </button>
            <button
              onClick={() => onNavigate('tools')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                currentView === 'tools'
                  ? 'text-amber-500 font-bold border-b border-amber-500/30'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`font-display text-sm font-medium tracking-wide transition-colors hover:text-amber-500 ${
                currentView === 'admin'
                  ? 'text-amber-500'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Admin
            </button>
            {currentView === 'biodata' && (
              <button
                onClick={() => onNavigate('biodata')}
                className="font-display text-sm font-medium tracking-wide transition-colors text-amber-500"
              >
                Biodata
              </button>
            )}
          </nav>

          {/* Desktop Right CTA / Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-400 light:text-zinc-600 hover:text-amber-500 hover:border-amber-500/40 transition-all cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Print CV */}
            <button
              onClick={triggerPrintCV}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium text-sm px-4 py-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download CV</span>
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded border border-zinc-800 light:border-zinc-200 text-zinc-400 light:text-zinc-600"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-zinc-800 light:border-zinc-200 text-zinc-100 light:text-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200 px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => handleNavClick('hero')}
              className="block w-full text-left py-2 px-3 rounded text-sm text-zinc-400 light:text-zinc-600 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('daily-check')}
              className="block w-full text-left py-2 px-3 rounded text-sm text-zinc-400 light:text-zinc-600 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
            >
              The Daily Check
            </button>
            <button
              onClick={() => handleNavClick('work')}
              className="block w-full text-left py-2 px-3 rounded text-sm text-zinc-400 light:text-zinc-600 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
            >
              Case Studies
            </button>
            <button
              onClick={() => handleNavClick('capabilities')}
              className="block w-full text-left py-2 px-3 rounded text-sm text-zinc-400 light:text-zinc-600 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
            >
              Capabilities
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full text-left py-2 px-3 rounded text-sm text-zinc-400 light:text-zinc-600 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
            >
              Contact
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('resume');
              }}
              className="block w-full text-left py-2 px-3 rounded text-sm text-zinc-400 light:text-zinc-600 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
            >
              Resume
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('tools');
              }}
              className={`block w-full text-left py-2 px-3 rounded text-sm hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100 ${
                currentView === 'tools'
                  ? 'text-amber-500 font-medium'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin');
              }}
              className={`block w-full text-left py-2 px-3 rounded text-sm hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100 ${
                currentView === 'admin'
                  ? 'text-amber-500 font-medium'
                  : 'text-zinc-400 light:text-zinc-600'
              }`}
            >
              Admin
            </button>
            {currentView === 'biodata' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('biodata');
                }}
                className="block w-full text-left py-2 px-3 rounded text-sm text-amber-500 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100"
              >
                Biodata
              </button>
            )}
            <button
              onClick={triggerPrintCV}
              className="flex items-center justify-center space-x-2 w-full bg-amber-500 text-zinc-950 font-semibold py-2.5 rounded text-sm mt-4"
            >
              <FileText className="w-4 h-4" />
              <span>Download CV</span>
            </button>
          </div>
        )}
      </header>

      {/* Printable Resume Overlay (only active when printing) */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-8 z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto border border-black p-6">
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold font-sans tracking-tight">Sahin Alom</h1>
              <p className="text-md text-gray-700 font-medium">Electrical Engineer — Industrial Power Specialist</p>
              <p className="text-sm text-gray-500">Dhaka, Bangladesh | sardershain@gmail.com</p>
            </div>
            <div className="text-right text-xs font-mono">
              <p>Standards Compliance:</p>
              <p>BNBC 2020 | NFPA 70 | IEC 60364</p>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2 uppercase tracking-wide">Professional Profile</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Highly disciplined industrial electrical engineer with over 4 years of hands-on experience keeping heavy factory equipment online and running with 100% safety focus. Specialized in low-voltage and medium-voltage load distribution, earth resistance testing, protection coordination, and preventative electrical maintenance. Currently heading on-duty operational support for a major sweater factory in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2 uppercase tracking-wide">Key Capabilities</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold">• Industrial Load & Cable Sizing</p>
                <p className="text-xs text-gray-500 ml-3">Calculating load flow & selecting breaker ratings to IEC standards.</p>
                <p className="font-semibold">• Substation & SLD Auditing</p>
                <p className="text-xs text-gray-500 ml-3">Interpreting Single Line Diagrams, transformer settings, and ATS relays.</p>
              </div>
              <div>
                <p className="font-semibold">• Earthing System Optimization</p>
                <p className="text-xs text-gray-500 ml-3">Resistance measurements, multi-electrode ground bonding.</p>
                <p className="font-semibold">• Continuous Factory Support</p>
                <p className="text-xs text-gray-500 ml-3">24/7 Operations tracking, motor diagnostics, fault troubleshooting.</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold border-b pb-1 mb-2 uppercase tracking-wide">Work Experience</h2>
            <div className="mb-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>Senior Maintenance Engineer — Dhaka Sweater Factory</span>
                <span className="text-gray-500 font-mono">2022 - Present</span>
              </div>
              <ul className="list-disc ml-5 text-xs text-gray-600 mt-1 space-y-1">
                <li>Manage electrical distribution, SDB sizing, and maintenance of 150+ knitting machinery lines.</li>
                <li>Conduct daily morning checks of MDB panels, recording voltages, loads, and busbar temperatures.</li>
                <li>Reduced power-cascading trips by upgrading coordination parameters of primary Air Circuit Breakers.</li>
                <li>Overhauled earthing infrastructure to lower safety earth electrode resistance under 1.0 Ω.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold border-b pb-1 mb-2 uppercase tracking-wide">Technical Certifications</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="border border-gray-400 px-2 py-0.5 rounded">IEC 60364 Standard Compliance</span>
              <span className="border border-gray-400 px-2 py-0.5 rounded">BNBC 2020 Part 8 Safety Guidelines</span>
              <span className="border border-gray-400 px-2 py-0.5 rounded">NFPA 70 National Electrical Code</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
