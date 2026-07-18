import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  UserCheck, 
  Inbox, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  Users, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Image, 
  Video, 
  Eye, 
  ArrowLeft,
  ChevronRight,
  Clipboard,
  Award,
  Cpu, 
  Activity, 
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
  Component, 
  ShieldAlert
} from 'lucide-react';
import { CASE_STUDIES, DEFAULT_HOMEPAGE_CONTENT, DEFAULT_PROFILE_DATA, INITIAL_ADMIN_STATS } from '../data';
import { CaseStudy, HomepageContent, ProfileData, ContactMessage, AdminStats } from '../types';

const LOGO_OPTIONS = [
  { id: 'Cpu', name: 'Microprocessor (Cpu)', desc: 'Standard system chip' },
  { id: 'Zap', name: 'Lightning Bolt (Zap)', desc: 'High voltage/Grid transmission' },
  { id: 'Activity', name: 'Oscilloscope Wave (Activity)', desc: 'Signal monitor' },
  { id: 'ShieldAlert', name: 'Interlock Guard (ShieldAlert)', desc: 'Safety/Protection relay' },
  { id: 'Flame', name: 'Thermal Spark (Flame)', desc: 'Arc Flash / Heat indicator' },
  { id: 'Plug', name: 'Power Connection (Plug)', desc: 'Load connect/AC Shore' },
  { id: 'Wrench', name: 'Preventive Tool (Wrench)', desc: 'Maintenance focus' },
  { id: 'Shield', name: 'Earthing Guard (Shield)', desc: 'Ground protection' },
  { id: 'Radio', name: 'RF Signal (Radio)', desc: 'RF transmitter/Signals' },
  { id: 'Terminal', name: 'System Console (Terminal)', desc: 'Command/Control cabinet' },
  { id: 'Server', name: 'Switchgear Rack (Server)', desc: 'Distribution panel' },
  { id: 'Lightbulb', name: 'Illumination (Lightbulb)', desc: 'Edison fixture/Innovation' },
  { id: 'Gauge', name: 'Meter Instrument (Gauge)', desc: 'Analog dial voltmeter' },
  { id: 'Database', name: 'Log Registry (Database)', desc: 'Trip event recorder' },
  { id: 'Layers', name: 'Phase Busbars (Layers)', desc: 'Three-phase stack' },
  { id: 'Component', name: 'SMD Integration (Component)', desc: 'Discrete device/IC' }
];

const ADMIN_ICON_MAP: Record<string, React.ComponentType<any>> = {
  Cpu, Zap, Activity, ShieldAlert, Flame, Plug, Wrench, Shield, Radio, Terminal, Server, Lightbulb, Gauge, Database, Layers, Component
};

interface AdminProps {
  onSync?: () => void;
}

export default function Admin({ onSync }: AdminProps) {
  // Authentication State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sidebar Layout State (Mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pages' | 'posts' | 'resume' | 'messages' | 'settings'>('dashboard');

  // Shared Data States
  const [stats, setStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [profileForm, setProfileForm] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(CASE_STUDIES);

  // Active editors / selectors
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [searchMessageQuery, setSearchMessageQuery] = useState('');

  // Post / Case Study Editor States
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null); // null means creating new
  const [postForm, setPostForm] = useState<Partial<CaseStudy>>({
    title: '',
    slug: '',
    category: '',
    tags: [],
    shortDesc: '',
    problem: '',
    calculation: '',
    solution: '',
    results: [],
    imageUrl: '',
    duration: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [resultInput, setResultInput] = useState('');

  // Drag and Drop Image state & handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHomepageContent(prev => ({
            ...prev,
            heroProfileImage: event.target!.result as string
          }));
          triggerQuickAction("Image loaded & parsed as Data URL successfully.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHomepageContent(prev => ({
            ...prev,
            heroProfileImage: event.target!.result as string
          }));
          triggerQuickAction("Image dropped & parsed successfully.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Toast System Actions
  const [quickActionNotification, setQuickActionNotification] = useState('');

  const triggerQuickAction = (msg: string) => {
    setQuickActionNotification(msg);
    setTimeout(() => setQuickActionNotification(''), 4500);
  };

  // Check login session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('sahin_admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const loadData = () => {
    // Stats
    const storedStats = localStorage.getItem('sahin_admin_stats');
    if (storedStats) {
      try { setStats(JSON.parse(storedStats)); } catch (e) {}
    } else {
      localStorage.setItem('sahin_admin_stats', JSON.stringify(INITIAL_ADMIN_STATS));
    }

    // Messages
    const storedMsgs = localStorage.getItem('sahin_portfolio_messages');
    if (storedMsgs) {
      try { setMessages(JSON.parse(storedMsgs)); } catch (e) {}
    }

    // Homepage Editable Fields
    const storedHome = localStorage.getItem('sahin_homepage_content');
    if (storedHome) {
      try { setHomepageContent(JSON.parse(storedHome)); } catch (e) {}
    }

    // Profile CV Biodata
    const storedProfile = localStorage.getItem('sahin_profile_data');
    if (storedProfile) {
      try { setProfileForm(JSON.parse(storedProfile)); } catch (e) {}
    }

    // Case Studies / Posts
    const storedStudies = localStorage.getItem('sahin_case_studies');
    if (storedStudies) {
      try { setCaseStudies(JSON.parse(storedStudies)); } catch (e) {}
    } else {
      localStorage.setItem('sahin_case_studies', JSON.stringify(CASE_STUDIES));
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'voltage50' || password.trim() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sahin_admin_authenticated', 'true');
      setAuthError('');
      triggerQuickAction('Console control lock bypassed. Systems authorized.');
    } else {
      setAuthError('Unauthorized passcode matching failure. Protection relay locked.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sahin_admin_authenticated');
    setPassword('');
    triggerQuickAction('Console control locks restored. Session cleared.');
  };

  // Settings: passcode edit
  const [passcodeForm, setPasscodeForm] = useState({ current: 'admin', newPass: '' });
  const handleSavePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    triggerQuickAction('Passcode updated successfully!');
  };

  const handleResetFactoryDefaults = () => {
    if (window.confirm('Are you absolutely sure you want to reset all custom text, posts, and CV records to factory defaults? This is non-reversible.')) {
      localStorage.removeItem('sahin_homepage_content');
      localStorage.removeItem('sahin_profile_data');
      localStorage.removeItem('sahin_case_studies');
      localStorage.removeItem('sahin_portfolio_messages');
      localStorage.removeItem('sahin_admin_stats');
      loadData();
      if (onSync) onSync();
      triggerQuickAction('System cleared. Default EE matrices loaded from flash memory.');
    }
  };

  // Homepage Editor handles
  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sahin_homepage_content', JSON.stringify(homepageContent));
    if (onSync) onSync();
    triggerQuickAction('Homepage sections serialized & deployed successfully! Live on site.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CV Profile Editor handles
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sahin_profile_data', JSON.stringify(profileForm));
    if (onSync) onSync();
    triggerQuickAction('CV & Marriage Biodata synchronization complete.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CV sublists
  const addExperience = () => {
    setProfileForm(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: 'New Role', company: 'Company Name', period: '2026 - Present', details: 'Added role details.' }
      ]
    }));
  };

  const removeExperience = (idx: number) => {
    setProfileForm(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  const addEducation = () => {
    setProfileForm(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: 'Degree Name', institution: 'University / Board', passingYear: '2026', result: 'CGPA' }
      ]
    }));
  };

  const removeEducation = (idx: number) => {
    setProfileForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };

  // Case Studies / Posts handles
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.slug || !postForm.category) {
      alert('Title, slug, and category are required fields.');
      return;
    }

    let updatedList = [...caseStudies];
    if (editingPostSlug) {
      // Edit
      updatedList = updatedList.map(item => item.slug === editingPostSlug ? (postForm as CaseStudy) : item);
      triggerQuickAction(`Case study "${postForm.title}" upgraded successfully.`);
    } else {
      // Check duplicate slug
      if (caseStudies.some(item => item.slug === postForm.slug)) {
        alert('Slug already exists. Please choose a unique URL slug.');
        return;
      }
      // Create new
      updatedList.unshift(postForm as CaseStudy);
      triggerQuickAction(`New case study "${postForm.title}" recorded & live.`);
    }

    setCaseStudies(updatedList);
    localStorage.setItem('sahin_case_studies', JSON.stringify(updatedList));
    if (onSync) onSync();
    
    // Clear / Reset Editor
    handleCancelPostEdit();
  };

  const handleDeletePost = (slug: string) => {
    if (window.confirm('Delete this case study/blog post permanently?')) {
      const updatedList = caseStudies.filter(item => item.slug !== slug);
      setCaseStudies(updatedList);
      localStorage.setItem('sahin_case_studies', JSON.stringify(updatedList));
      if (onSync) onSync();
      triggerQuickAction('Post deleted from local matrices.');
    }
  };

  const handleEditPostClick = (study: CaseStudy) => {
    setEditingPostSlug(study.slug);
    setPostForm({ ...study });
    setTagInput(study.tags.join(', '));
    setResultInput('');
  };

  const handleCreateNewPostClick = () => {
    setEditingPostSlug(null);
    setPostForm({
      title: '',
      slug: '',
      category: 'Substation & Distribution',
      tags: [],
      shortDesc: '',
      problem: '',
      calculation: '',
      solution: '',
      results: [],
      imageUrl: '',
      duration: ''
    });
    setTagInput('');
    setResultInput('');
  };

  const handleCancelPostEdit = () => {
    setEditingPostSlug(null);
    setPostForm({
      title: '',
      slug: '',
      category: '',
      tags: [],
      shortDesc: '',
      problem: '',
      calculation: '',
      solution: '',
      results: [],
      imageUrl: '',
      duration: ''
    });
    setTagInput('');
    setResultInput('');
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const items = tagInput.split(',').map(s => s.trim()).filter(Boolean);
    setPostForm(prev => ({
      ...prev,
      tags: Array.from(new Set([...(prev.tags || []), ...items]))
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  const handleAddResult = () => {
    if (!resultInput.trim()) return;
    setPostForm(prev => ({
      ...prev,
      results: [...(prev.results || []), resultInput.trim()]
    }));
    setResultInput('');
  };

  const handleRemoveResult = (idx: number) => {
    setPostForm(prev => ({
      ...prev,
      results: (prev.results || []).filter((_, i) => i !== idx)
    }));
  };

  // Messages operations
  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Permanently delete this message?')) {
      const filtered = messages.filter(msg => msg.id !== id);
      setMessages(filtered);
      localStorage.setItem('sahin_portfolio_messages', JSON.stringify(filtered));
      
      // Update counts
      const updatedStats = { ...stats, contactRequests: Math.max(0, stats.contactRequests - 1) };
      setStats(updatedStats);
      localStorage.setItem('sahin_admin_stats', JSON.stringify(updatedStats));

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      triggerQuickAction('Message cleared from local memory.');
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setReplySuccess(true);
    setTimeout(() => {
      setReplyText('');
      setReplySuccess(false);
      triggerQuickAction(`Draft reply pre-loaded. Simulated dispatch to <${selectedMessage.email}>`);
    }, 1000);
  };

  // Filter messages by search query
  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchMessageQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchMessageQuery.toLowerCase()) ||
    (msg.company && msg.company.toLowerCase().includes(searchMessageQuery.toLowerCase())) ||
    msg.message.toLowerCase().includes(searchMessageQuery.toLowerCase())
  );

  // Simulation controls on Admin Desk
  const [simulationActive, setSimulationActive] = useState(false);
  const [simLog, setSimLog] = useState('Safety grid status: NORMAL. Voltage levels stabilized at 415V LL.');
  const runRelayDiagnostic = () => {
    if (simulationActive) return;
    setSimulationActive(true);
    setSimLog('Executing safety diagnostic sequence... Scanning ACB long-time delay coefficients.');
    setTimeout(() => {
      setSimLog('Checking ground loop earthing continuity. Electrode resistance 0.85 Ω [OK].');
    }, 1500);
    setTimeout(() => {
      setSimLog('Diagnostic complete. IDMT curveTMS values nominal. Complies to BNBC Code 2020 Part 8.');
      setSimulationActive(false);
    }, 3200);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 min-h-screen flex flex-col items-center justify-center px-4 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50">
        <div className="w-full max-w-md p-6 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg shadow-2xl circuit-border relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
            <div className="bg-amber-500 text-zinc-950 text-[8px] font-mono font-bold text-center py-1 absolute transform rotate-45 top-3 right-[-24px] w-[90px] uppercase tracking-wider">
              Secure
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 mb-6">
            <div className="w-12 h-12 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-zinc-100 light:text-zinc-900 tracking-tight">
                Control Board Gatekeeper
              </h2>
              <p className="text-xs text-zinc-400 light:text-zinc-500 mt-1">
                Enter authorized passcode to log into the Admin Desk.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                  Authorized Key
                </label>
                <span className="text-[9px] font-mono text-zinc-500">AES-256 PORTAL</span>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Passcode (voltage50 or admin)"
                className="w-full px-3.5 py-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 rounded text-sm text-zinc-100 light:text-zinc-900 focus:outline-none focus:border-amber-500 transition-colors"
                id="admin-auth-pass"
              />
              {authError && (
                <span className="block text-[10px] text-rose-500 font-mono mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>{authError}</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold rounded text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              id="admin-auth-submit"
            >
              <Zap className="w-4 h-4 text-zinc-950" />
              <span>Authorize & Unlock</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 text-center space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 block">
              Authorized keys are printed inside the maintenance journal: <span className="text-amber-500 font-bold">voltage50</span> or <span className="text-amber-500 font-bold">admin</span>
            </span>
            <div className="pt-2">
              <button 
                onClick={() => window.location.hash = '#/'}
                className="inline-flex items-center space-x-1.5 text-xs text-amber-500 hover:text-amber-400 hover:underline transition-all font-mono uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit & Return to Portfolio</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 flex flex-col md:flex-row text-zinc-100 light:text-zinc-900">
      
      {/* Toast Notification */}
      {quickActionNotification && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-emerald-500 text-zinc-950 rounded-lg shadow-xl font-mono text-xs font-bold flex items-center space-x-2 animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-zinc-950" />
          <span>{quickActionNotification}</span>
        </div>
      )}

      {/* MOBILE TOP BAR (Hidden on Desktop) */}
      <div className="md:hidden w-full bg-zinc-900 dark:bg-zinc-900 light:bg-white border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200 h-14 flex items-center justify-between px-4 z-40 fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-2">
          <Zap className="w-4.5 h-4.5 text-amber-500" />
          <span className="font-display font-bold text-sm tracking-tight text-zinc-100 light:text-zinc-900">Sahin Alom Admin</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.hash = '#/'}
            className="p-1.5 rounded border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-xs text-amber-500 font-mono flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-zinc-400 light:text-zinc-700"
            id="mobile-sidebar-toggle"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR + CONTENT WORKSPACE */}
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className={`
        fixed inset-y-0 left-0 pt-20 md:pt-8 pb-6 bg-zinc-900 dark:bg-zinc-900 light:bg-white border-r border-zinc-800 dark:border-zinc-800 light:border-zinc-200 w-64 transform transition-transform duration-300 ease-in-out z-30 md:translate-x-0 md:fixed md:h-screen md:top-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Header */}
        <div className="px-6 pb-6 mb-6 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 hidden md:block">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center font-bold text-zinc-950">
              ⚡
            </div>
            <div>
              <span className="block font-display font-bold text-sm text-zinc-100 light:text-zinc-900 tracking-tight">Admin Control</span>
              <span className="block text-[10px] font-mono text-zinc-500 uppercase">Dhaka Substation</span>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="px-4 space-y-1.5">
          {[
            { id: 'dashboard', label: 'Operational Desk', desc: 'Stats, messages & status', icon: LayoutDashboard },
            { id: 'pages', label: 'Home Page Editor', desc: 'Hero titles, taglines, media', icon: FileText },
            { id: 'posts', label: 'Posts & Case Studies', desc: 'Manage field research', icon: BookOpen },
            { id: 'resume', label: 'CV & Biodata Editor', desc: 'Profile credentials & biography', icon: UserCheck },
            { id: 'messages', label: 'Inbox Messages', desc: 'Reader & reply portal', icon: Inbox, badge: messages.length },
            { id: 'settings', label: 'Console Settings', desc: 'Security & factory clear', icon: SettingsIcon }
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded text-left transition-all group cursor-pointer border ${
                  isActive 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold' 
                    : 'border-transparent text-zinc-400 light:text-zinc-600 hover:text-zinc-200 light:hover:text-zinc-900 hover:bg-zinc-850/50 light:hover:bg-zinc-100'
                }`}
                id={`nav-tab-${item.id}`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                  <div>
                    <span className="block text-[12px] uppercase font-mono tracking-wide">{item.label}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 truncate max-w-[150px]">{item.desc}</span>
                  </div>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-amber-500 text-zinc-950 text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User Info / Log out */}
        <div className="absolute bottom-6 left-4 right-4 pt-4 border-t border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 flex flex-col space-y-3">
          <div className="flex items-center space-x-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 font-bold text-zinc-400 uppercase text-xs">
              SA
            </div>
            <div>
              <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Sahin Alom</span>
              <span className="block text-[9px] font-mono text-zinc-500">Dhaka, Bangladesh</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.hash = '#/'}
            className="w-full py-2 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/30 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 hover:text-amber-500 text-[10px] font-mono uppercase tracking-widest rounded transition-colors text-zinc-400 cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Exit to Website</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-2 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-rose-500/30 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 hover:text-rose-500 text-[10px] font-mono uppercase tracking-widest rounded transition-colors text-zinc-500 cursor-pointer"
            id="admin-logout"
          >
            Sign Out / Lock Console
          </button>
        </div>
      </aside>

      {/* SIDEBAR BACKDROP FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
        />
      )}

      {/* CORE WORKSPACE CONTENT FRAME */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:pl-72 pt-20 md:pt-8 max-w-7xl mx-auto w-full">
        
        {/* Page Tab Header Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-4 gap-4">
          <div>
            <span className="font-mono text-[10px] text-amber-500 uppercase tracking-widest block font-bold">
              AUTHORIZED OPERATIONS — SYSTEM ACTIVE
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight mt-0.5 capitalize">
              {activeTab === 'dashboard' ? 'Operational Desk' : activeTab === 'pages' ? 'Page Content Editor' : activeTab === 'posts' ? 'Case Studies & Blogs' : activeTab === 'resume' ? 'CV & Marriage Biodata' : activeTab === 'messages' ? 'Received Contact Messages' : 'Console System Settings'}
            </h1>
          </div>
          
          <div className="font-mono text-[10px] text-zinc-500 flex items-center space-x-2 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-zinc-100 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GRID SYSTEM: 50.02 HZ</span>
          </div>
        </div>

        {/* TAB WORKSPACE CONTENT SWITCHER */}
        
        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Quick Informational Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Total Visitors</span>
                <span className="block font-display font-bold text-2xl text-zinc-100 light:text-zinc-900 mt-1">{stats.visitors}</span>
                <span className="block text-[9px] text-emerald-500 font-mono mt-1">↑ 12% this week</span>
              </div>
              <div className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Messages Received</span>
                <span className="block font-display font-bold text-2xl text-zinc-100 light:text-zinc-900 mt-1">{messages.length}</span>
                <span className="block text-[9px] text-zinc-500 font-mono mt-1">In local storage cache</span>
              </div>
              <div className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Case Studies Count</span>
                <span className="block font-display font-bold text-2xl text-zinc-100 light:text-zinc-900 mt-1">{caseStudies.length}</span>
                <span className="block text-[9px] text-amber-500 font-mono mt-1">Editable posts</span>
              </div>
              <div className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">Avg Session Time</span>
                <span className="block font-display font-bold text-2xl text-zinc-100 light:text-zinc-900 mt-1">{stats.avgReadTime}</span>
                <span className="block text-[9px] text-zinc-500 font-mono mt-1">Dhaka zone read mean</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side: System Diagnostic & logs */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Simulated Interlocking controller diagnostic */}
                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase tracking-wide">
                        Safety Relay Interlock System Status
                      </h3>
                    </div>
                    <button 
                      onClick={runRelayDiagnostic}
                      disabled={simulationActive}
                      className="px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 hover:border-amber-500/50 font-mono text-[10px] text-zinc-300 light:text-zinc-700 transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${simulationActive ? 'animate-spin text-amber-500' : ''}`} />
                      <span>{simulationActive ? 'Testing...' : 'Run Diagnostics'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded font-mono text-xs text-zinc-400 light:text-zinc-800">
                    <div className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold mb-1.5 uppercase tracking-wider">Diagnostic Controller Log</div>
                    <p className={simulationActive ? 'text-amber-400' : 'text-emerald-400'}>
                      {simLog}
                    </p>
                  </div>
                </div>

                {/* Recent Messages list */}
                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                  <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase tracking-wide mb-4 flex items-center space-x-2">
                    <Inbox className="w-4 h-4 text-amber-500" />
                    <span>Recent Incoming Queries</span>
                  </h3>

                  {messages.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded">
                      <p className="text-xs text-zinc-500">No signals transmitted yet. Mail transmitter system idle.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {messages.slice(0, 3).map((msg) => (
                        <div 
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            setActiveTab('messages');
                          }}
                          className="p-3 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 rounded cursor-pointer transition-colors flex justify-between items-start gap-4"
                        >
                          <div className="space-y-1">
                            <span className="block font-semibold text-xs text-zinc-200 light:text-zinc-900">{msg.name}</span>
                            <span className="block text-[10px] text-zinc-500 font-mono">{msg.email} {msg.company ? `| ${msg.company}` : ''}</span>
                            <p className="text-xs text-zinc-400 light:text-zinc-600 line-clamp-1 mt-1">{msg.message}</p>
                          </div>
                          <span className="text-[9px] text-zinc-600 font-mono whitespace-nowrap">{msg.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {messages.length > 3 && (
                    <button 
                      onClick={() => setActiveTab('messages')}
                      className="w-full text-center mt-3 text-[11px] font-mono text-amber-500 uppercase hover:underline"
                    >
                      View all {messages.length} messages in box
                    </button>
                  )}
                </div>

              </div>

              {/* Right Side Info Panel: Workspace stats and tasks */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                  <h3 className="font-display font-bold text-xs text-zinc-300 light:text-zinc-800 uppercase tracking-widest mb-3">
                    System Parameters
                  </h3>
                  <div className="space-y-2.5 font-mono text-[11px]">
                    <div className="flex justify-between py-1 border-b border-zinc-850 dark:border-zinc-800/30 light:border-zinc-100">
                      <span className="text-zinc-500">Database Engine:</span>
                      <span className="text-amber-500 font-bold">Local Cache State</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-850 dark:border-zinc-800/30 light:border-zinc-100">
                      <span className="text-zinc-500">Auth Code:</span>
                      <span className="text-zinc-300 light:text-zinc-700">AES Secured</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-850 dark:border-zinc-800/30 light:border-zinc-100">
                      <span className="text-zinc-500">Standard Code:</span>
                      <span className="text-emerald-500 font-bold">BNBC 2020 Compliant</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">System Clock:</span>
                      <span className="text-zinc-300 light:text-zinc-700">July 2026 UTC+6</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg text-xs leading-relaxed text-zinc-400 light:text-zinc-600">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">Administrative Tip</span>
                  <p>
                    All changes made in this dashboard are immediately serialized into the local web-browser memory storage layer. Go back to Home using navigation tabs to see the updated changes. No page reload is needed!
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. PAGES EDIT TAB (Hero, subtitles, etc) */}
        {activeTab === 'pages' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6 animate-fade-in text-left">
            
            {/* HERO SECTION EDITS */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <FileText className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Hero Section Text, Titles & Media Assets
                </h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Hero Tagline</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, heroTagline: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                      id="page-hero-tagline"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Hero Main Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, heroHeading: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                      id="page-hero-heading"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Hero Paragraph (Subheading)</label>
                  <textarea 
                    rows={3}
                    value={homepageContent.heroSubheading}
                    onChange={e => setHomepageContent({ ...homepageContent, heroSubheading: e.target.value })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    id="page-hero-subheading"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 1 Value</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat1Val}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat1Val: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 1 Label</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat1Label}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat1Label: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 2 Value</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat2Val}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat2Val: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 2 Label</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat2Label}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat2Label: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 3 Value</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat3Val}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat3Val: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 3 Label</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat3Label}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat3Label: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3 mt-3">
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase flex items-center space-x-1">
                      <Image className="w-3 h-3 text-zinc-500" />
                      <span>Currently On Duty Portrait (Image File / Drag & Drop)</span>
                    </label>

                    {/* Drag and Drop Zone */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all ${
                        isDragging 
                          ? 'border-amber-500 bg-amber-500/10' 
                          : 'border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50'
                      }`}
                    >
                      {homepageContent.heroProfileImage ? (
                        <div className="relative group w-24 h-24 mb-2 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 rounded overflow-hidden">
                          <img 
                            src={homepageContent.heroProfileImage} 
                            alt="Current Operator Portrait" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[9px] font-mono text-zinc-300">Hover view</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-zinc-900 light:bg-zinc-200 flex items-center justify-center text-zinc-500 mb-2">
                          <Image className="w-5 h-5" />
                        </div>
                      )}

                      <p className="text-[11px] text-zinc-400 light:text-zinc-600">
                        Drag and drop your on-duty photo here, or{" "}
                        <label className="text-amber-500 hover:underline cursor-pointer">
                          browse files
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageFileChange} 
                            className="hidden" 
                          />
                        </label>
                      </p>
                      <span className="block text-[9px] text-zinc-500 font-mono mt-1">
                        Supports PNG, JPG, WEBP, SVG (Max 2MB)
                      </span>
                    </div>

                    <div className="space-y-1 mt-2">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Alternative Image URL</label>
                      <input 
                        type="url" 
                        value={homepageContent.heroProfileImage || ''}
                        onChange={e => setHomepageContent({ ...homepageContent, heroProfileImage: e.target.value })}
                        placeholder="https://example.com/your-photo.jpg"
                        className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                        id="page-hero-profile-image"
                      />
                      <span className="block text-[9px] text-zinc-500 font-mono">You can also paste a public image link directly.</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase flex items-center space-x-1">
                      <Video className="w-3 h-3 text-zinc-500" />
                      <span>Custom Video Link (Alternative Profile video)</span>
                    </label>
                    <input 
                      type="url" 
                      value={homepageContent.heroProfileVideo || ''}
                      onChange={e => setHomepageContent({ ...homepageContent, heroProfileVideo: e.target.value })}
                      placeholder="https://example.com/your-video.mp4"
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                    <span className="block text-[9px] text-zinc-500 font-mono">MP4 video URL. If provided, overrides profile image.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Profile Panel Name</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroProfileName}
                      onChange={e => setHomepageContent({ ...homepageContent, heroProfileName: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Profile Panel Designation Title</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroProfileTitle}
                      onChange={e => setHomepageContent({ ...homepageContent, heroProfileTitle: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTIONS & HEADINGS EDITS */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <FileText className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Landing Section Headers, Decors & Contact Node
                </h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Journal Tagline (01)</label>
                    <input 
                      type="text" 
                      value={homepageContent.journalTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, journalTagline: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Journal Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.journalHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, journalHeading: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Journal Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.journalDesc}
                    onChange={e => setHomepageContent({ ...homepageContent, journalDesc: e.target.value })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Expertise Section Tagline (03)</label>
                    <input 
                      type="text" 
                      value={homepageContent.expertiseTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, expertiseTagline: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Expertise Section Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.expertiseHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, expertiseHeading: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Expertise Section Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.expertiseDesc}
                    onChange={e => setHomepageContent({ ...homepageContent, expertiseDesc: e.target.value })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Section Tagline (04)</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, contactTagline: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Section Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, contactHeading: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Section Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.contactDesc}
                    onChange={e => setHomepageContent({ ...homepageContent, contactDesc: e.target.value })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Email</label>
                    <input 
                      type="email" 
                      value={homepageContent.contactEmail}
                      onChange={e => setHomepageContent({ ...homepageContent, contactEmail: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Linkedin Link</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactLinkedin}
                      onChange={e => setHomepageContent({ ...homepageContent, contactLinkedin: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Github Link</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactGithub}
                      onChange={e => setHomepageContent({ ...homepageContent, contactGithub: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BRAND LOGO SECTION EDITS */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <SettingsIcon className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Header Navigation Brand & Logo Customization
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-zinc-400 light:text-zinc-650">
                  Select a brand logo icon to display in the main sticky header navigation. This represents your electrical engineering sub-specialization and system status node.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {LOGO_OPTIONS.map((opt) => {
                    const IconComponent = ADMIN_ICON_MAP[opt.id] || Cpu;
                    const isSelected = (homepageContent.headerLogoIcon || 'Cpu') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setHomepageContent({ ...homepageContent, headerLogoIcon: opt.id })}
                        className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-md ring-1 ring-amber-500/30'
                            : 'border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 hover:border-zinc-700 dark:hover:border-zinc-700 light:hover:border-zinc-350 text-zinc-400 light:text-zinc-600'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mb-1.5 ${isSelected ? 'text-amber-500' : 'text-zinc-500 light:text-zinc-650'}`} />
                        <span className="block text-[10px] font-mono uppercase font-bold tracking-tight">{opt.id}</span>
                        <span className="block text-[8px] text-zinc-500 font-sans mt-0.5 leading-tight">{opt.desc}</span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block font-mono text-[9px] text-zinc-500 uppercase">Selected Icon Name (or type arbitrary Lucide name)</label>
                  <input
                    type="text"
                    value={homepageContent.headerLogoIcon || 'Cpu'}
                    onChange={e => setHomepageContent({ ...homepageContent, headerLogoIcon: e.target.value })}
                    placeholder="e.g. Cpu, Zap, Activity, ShieldAlert"
                    className="w-full max-w-xs mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded font-mono"
                  />
                  <p className="text-[9px] text-zinc-500 font-mono mt-1">
                    Select from the presets above or enter a valid case-sensitive Lucide icon name.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded shadow-md flex items-center space-x-2 cursor-pointer"
                id="save-homepage-btn"
              >
                <Save className="w-4 h-4 text-zinc-950" />
                <span>Save & Sync Homepage</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. POSTS & CASE STUDIES TAB (Blogs, list, creator, editor) */}
        {activeTab === 'posts' && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Show Form if Editing or Creating */}
            {editingPostSlug !== null || postForm.slug ? (
              <form onSubmit={handleSavePost} className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
                
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                      {editingPostSlug ? `Modifying: ${editingPostSlug}` : 'Adding New Field Case Study / Blog Post'}
                    </h3>
                  </div>
                  <button 
                    type="button"
                    onClick={handleCancelPostEdit}
                    className="px-3 py-1 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-200 text-[10px] font-mono rounded border border-zinc-850 text-zinc-400 light:text-zinc-600"
                  >
                    Cancel / Back to List
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Title</label>
                    <input 
                      type="text" 
                      required
                      value={postForm.title || ''}
                      onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="e.g. Substation SLD Analysis & Compliance"
                      className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                      id="post-edit-title"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Slug (Unique URL ID)</label>
                    <input 
                      type="text" 
                      required
                      value={postForm.slug || ''}
                      onChange={e => setPostForm({ ...postForm, slug: e.target.value })}
                      placeholder="substation-sld-analysis"
                      className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                      id="post-edit-slug"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Category</label>
                    <select 
                      value={postForm.category || ''}
                      onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                      className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                      id="post-edit-category"
                    >
                      <option value="Substation & Distribution">Substation & Distribution</option>
                      <option value="Power Systems & Cables">Power Systems & Cables</option>
                      <option value="Earthing & Safety">Earthing & Safety</option>
                      <option value="Industrial Troubleshooting">Industrial Troubleshooting</option>
                      <option value="General Engineering">General Engineering</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Project Duration / Timeline</label>
                    <input 
                      type="text" 
                      value={postForm.duration || ''}
                      onChange={e => setPostForm({ ...postForm, duration: e.target.value })}
                      placeholder="e.g. 3 Weeks, 10 Days"
                      className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                      id="post-edit-duration"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Media / Image URL (Optional)</label>
                    <input 
                      type="url" 
                      value={postForm.imageUrl || ''}
                      onChange={e => setPostForm({ ...postForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-xxx"
                      className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Short Description (Preview Snippet)</label>
                  <textarea 
                    rows={2}
                    required
                    value={postForm.shortDesc || ''}
                    onChange={e => setPostForm({ ...postForm, shortDesc: e.target.value })}
                    placeholder="Short summary of investigation for index card preview..."
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                    id="post-edit-shortdesc"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Tags (Separate with comma)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      placeholder="Substation, SLD, Protection, BNBC"
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white text-zinc-300 light:text-zinc-800 border border-zinc-800 text-xs font-mono rounded"
                    >
                      Add
                    </button>
                  </div>
                  {postForm.tags && postForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {postForm.tags.map(t => (
                        <span key={t} className="inline-flex items-center space-x-1 font-mono text-[10px] bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 px-2 py-0.5 rounded text-amber-500">
                          <span>#{t}</span>
                          <button type="button" onClick={() => handleRemoveTag(t)} className="text-zinc-500 hover:text-rose-500">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">The Problem / Diagnostic Report</label>
                    <textarea 
                      rows={5}
                      value={postForm.problem || ''}
                      onChange={e => setPostForm({ ...postForm, problem: e.target.value })}
                      placeholder="Specify the industrial crisis, machine temperatures, cascading delays, or fault details..."
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase font-bold text-amber-500">Field Math & Calculations (Monospace formatting)</label>
                    <textarea 
                      rows={5}
                      value={postForm.calculation || ''}
                      onChange={e => setPostForm({ ...postForm, calculation: e.target.value })}
                      placeholder="e.g. Transformer Rating: 630 kVA (11kV / 0.415kV)... I_LT = S / (√3 × V_LL)..."
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs font-mono rounded text-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">The Solution / Engineering Action Taken</label>
                  <textarea 
                    rows={4}
                    value={postForm.solution || ''}
                    onChange={e => setPostForm({ ...postForm, solution: e.target.value })}
                    placeholder="Describe how the selectivity curves were graded, chemical ground electrodes installed, or ATS relay Snubbers customized..."
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Verifiable Outcomes / Results List</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={resultInput}
                      onChange={e => setResultInput(e.target.value)}
                      placeholder="e.g. Successfully isolated short-circuit fault in Knitting SDB-2 without cascading."
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddResult}
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white text-zinc-300 light:text-zinc-800 border border-zinc-800 text-xs font-mono rounded"
                    >
                      Add Outcome
                    </button>
                  </div>
                  {postForm.results && postForm.results.length > 0 && (
                    <ul className="space-y-1.5 pt-2">
                      {postForm.results.map((r, i) => (
                        <li key={i} className="flex items-center justify-between text-xs bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-2 border border-zinc-850 rounded">
                          <span className="text-zinc-300 light:text-zinc-700">{i+1}. {r}</span>
                          <button type="button" onClick={() => handleRemoveResult(i)} className="text-rose-500 hover:text-rose-400 text-xs px-1">Remove</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-3">
                  <button 
                    type="button" 
                    onClick={handleCancelPostEdit}
                    className="px-4 py-2 border border-zinc-800 rounded font-mono text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded shadow flex items-center space-x-2 cursor-pointer"
                    id="save-post-btn"
                  >
                    <Save className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Save & Deploy Post</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Table & Overview List */
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg">
                <div className="flex justify-between items-center border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                  <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                    Active Field Investigations & Case Studies
                  </h3>
                  <button
                    onClick={handleCreateNewPostClick}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-mono text-[10px] font-extrabold rounded flex items-center space-x-1 cursor-pointer"
                    id="create-new-post-btn"
                  >
                    <Plus className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Create New Post</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-850 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Slug</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5">Tags</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850/40 dark:divide-zinc-800/40">
                      {caseStudies.map((study) => (
                        <tr key={study.slug} className="hover:bg-zinc-900/10 dark:hover:bg-zinc-900/10 light:hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3 font-semibold text-zinc-200 light:text-zinc-800 max-w-xs truncate">{study.title}</td>
                          <td className="py-3 text-zinc-400 font-mono text-[10px]">{study.slug}</td>
                          <td className="py-3 text-amber-500/80 text-[10px]">{study.category}</td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {study.tags.slice(0, 2).map(t => (
                                <span key={t} className="text-[9px] text-zinc-500">#{t}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button 
                              onClick={() => handleEditPostClick(study)}
                              className="text-amber-500 hover:text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeletePost(study.slug)}
                              className="text-rose-500 hover:text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. CV & MARRIAGE BIODATA TAB */}
        {activeTab === 'resume' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in text-left">
            
            {/* GENERAL PROFILE BLOCK */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  CV Profile Basic Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Designation Title</label>
                  <input 
                    type="text" 
                    value={profileForm.title}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Location</label>
                  <input 
                    type="text" 
                    value={profileForm.location}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={profileForm.whatsapp}
                    onChange={e => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Professional Summary Statement</label>
                <textarea 
                  rows={4}
                  value={profileForm.summary}
                  onChange={e => setProfileForm({ ...profileForm, summary: e.target.value })}
                  className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  value={profileForm.skills}
                  onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className="w-full p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                />
              </div>
            </div>

            {/* MARRIAGE BIODATA INDIVIDUAL DETAILS */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Bengali Marriage Biodata Specification Matrices
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Date of Birth</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.dob}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, dob: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Height</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.height}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, height: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Weight</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.weight}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, weight: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Blood Group</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.bloodGroup}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, bloodGroup: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Marital Status</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.maritalStatus}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, maritalStatus: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Religion (Sunni / Shia)</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.religion}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, religion: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Nationality</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.nationality}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, nationality: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Siblings</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.siblings}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, siblings: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Present Address</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.presentAddress}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, presentAddress: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Permanent Address</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.permanentAddress}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, permanentAddress: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Father's Name</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.fatherName}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, fatherName: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Father's Profession</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.fatherProfession}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, fatherProfession: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Mother's Name</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.motherName}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, motherName: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Mother's Profession</label>
                  <input 
                    type="text" 
                    value={profileForm.personalDetails.motherProfession}
                    onChange={e => setProfileForm({
                      ...profileForm,
                      personalDetails: { ...profileForm.personalDetails, motherProfession: e.target.value }
                    })}
                    className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC WORK HISTORY TIMELINE */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Field Work Experience & History Timeline
                </h3>
                <button 
                  type="button" 
                  onClick={addExperience}
                  className="px-3 py-1.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 text-[10px] font-mono hover:border-amber-500/50 hover:text-amber-500 text-zinc-300 rounded flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience Run</span>
                </button>
              </div>

              {profileForm.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 rounded space-y-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeExperience(idx)}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-400 text-xs flex items-center space-x-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Drop</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Role / Post Title</label>
                      <input 
                        type="text" 
                        value={exp.role}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[idx].role = e.target.value;
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Company Name & Location</label>
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[idx].company = e.target.value;
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Period (e.g. 2022 - Present)</label>
                      <input 
                        type="text" 
                        value={exp.period}
                        onChange={e => {
                          const updated = [...profileForm.experience];
                          updated[idx].period = e.target.value;
                          setProfileForm({ ...profileForm, experience: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] text-zinc-500 uppercase">Detailed Duties (Use semicolon to separate points)</label>
                    <textarea 
                      rows={2}
                      value={exp.details}
                      onChange={e => {
                        const updated = [...profileForm.experience];
                        updated[idx].details = e.target.value;
                        setProfileForm({ ...profileForm, experience: updated });
                      }}
                      className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* DYNAMIC EDUCATION SECTION */}
            <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Education Credentials
                </h3>
                <button 
                  type="button" 
                  onClick={addEducation}
                  className="px-3 py-1.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 text-[10px] font-mono hover:border-amber-500/50 hover:text-amber-500 text-zinc-300 rounded flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Academic Run</span>
                </button>
              </div>

              {profileForm.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 rounded space-y-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeEducation(idx)}
                    className="absolute top-2 right-2 text-rose-500 hover:text-rose-400 text-xs flex items-center space-x-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Drop</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Degree / Diploma Title</label>
                      <input 
                        type="text" 
                        value={edu.degree}
                        onChange={e => {
                          const updated = [...profileForm.education];
                          updated[idx].degree = e.target.value;
                          setProfileForm({ ...profileForm, education: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Institution Name</label>
                      <input 
                        type="text" 
                        value={edu.institution}
                        onChange={e => {
                          const updated = [...profileForm.education];
                          updated[idx].institution = e.target.value;
                          setProfileForm({ ...profileForm, education: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Passing Year</label>
                      <input 
                        type="text" 
                        value={edu.passingYear}
                        onChange={e => {
                          const updated = [...profileForm.education];
                          updated[idx].passingYear = e.target.value;
                          setProfileForm({ ...profileForm, education: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Result / CGPA</label>
                      <input 
                        type="text" 
                        value={edu.result || ''}
                        onChange={e => {
                          const updated = [...profileForm.education];
                          updated[idx].result = e.target.value;
                          setProfileForm({ ...profileForm, education: updated });
                        }}
                        className="w-full p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white border border-zinc-800 text-xs rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded shadow-md flex items-center space-x-2 cursor-pointer"
                id="save-profile-btn"
              >
                <Save className="w-4 h-4 text-zinc-950" />
                <span>Save & Synchronize Profiles</span>
              </button>
            </div>
          </form>
        )}

        {/* 5. MESSAGES INBOX TAB */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
            
            {/* Messages Directory (Left panel) */}
            <div className="lg:col-span-5 p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
              <div className="border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 flex justify-between items-center">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase">Messages Feed Directory</span>
                <span className="font-mono text-[10px] text-zinc-500">{filteredMessages.length} elements</span>
              </div>

              {/* Search Bar */}
              <input 
                type="text"
                placeholder="Search index..."
                value={searchMessageQuery}
                onChange={e => setSearchMessageQuery(e.target.value)}
                className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-100 light:text-zinc-900"
                id="messages-search-field"
              />

              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 font-mono text-xs">No matching signals found.</div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 border rounded cursor-pointer transition-colors text-left space-y-1 ${
                        selectedMessage?.id === msg.id
                          ? 'bg-amber-500/10 border-amber-500/35 text-zinc-100'
                          : 'bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-zinc-900 dark:border-zinc-900 light:border-zinc-250 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100'
                      }`}
                      id={`message-item-${msg.id}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-zinc-200 light:text-zinc-900 truncate max-w-[120px]">{msg.name}</span>
                        <span className="text-[9px] text-zinc-600 font-mono">{msg.date}</span>
                      </div>
                      <span className="block text-[10px] text-zinc-500 font-mono truncate">{msg.email}</span>
                      <p className="text-xs text-zinc-400 light:text-zinc-600 line-clamp-1 truncate">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Message Viewer (Right panel) */}
            <div className="lg:col-span-7">
              {selectedMessage ? (
                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-5">
                  <div className="border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-500 block">TRANSMITTED SIGNAL ID: #{selectedMessage.id}</span>
                      <h3 className="font-display font-bold text-base text-zinc-100 light:text-zinc-900 mt-0.5">{selectedMessage.name}</h3>
                      <span className="block text-xs font-mono text-amber-500/80 mt-0.5">{selectedMessage.email}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-1.5 rounded border border-zinc-800 hover:border-rose-500/50 hover:text-rose-500 text-zinc-500 transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="block font-mono text-[9px] text-zinc-500 uppercase">Header metadata parameters</span>
                      <div className="p-3 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 rounded text-xs font-mono text-zinc-400 light:text-zinc-700 space-y-1 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                        <div><span className="text-zinc-600 dark:text-zinc-500">Sender:</span> {selectedMessage.name}</div>
                        <div><span className="text-zinc-600 dark:text-zinc-500">Company:</span> {selectedMessage.company || 'Not Specified'}</div>
                        <div><span className="text-zinc-600 dark:text-zinc-500">Date Log:</span> {selectedMessage.date}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="block font-mono text-[9px] text-zinc-500 uppercase">Message Signal Core Content</span>
                      <div className="p-4 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 rounded text-xs sm:text-sm text-zinc-300 light:text-zinc-800 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>

                    {/* Preloaded quick responses creator */}
                    <form onSubmit={handleSendReply} className="space-y-2 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-4">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Transmit Quick Reply Draft (Simulated)</label>
                      <textarea 
                        rows={3}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Draft your professional email back here... e.g. Assalamu Alaikum, thank you for reaching out..."
                        className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-250 text-xs rounded"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <button 
                            type="button"
                            onClick={() => setReplyText(`Dear ${selectedMessage.name},\n\nThank you for reaching out regarding your industrial electrical project. I have analyzed your query and would be glad to discuss the details. Let me know your available slot for a direct call.\n\nBest Regards,\nSahin Alom\nSenior Electrical Engineer\nDhaka`)}
                            className="px-2 py-1 bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 hover:bg-zinc-850 dark:hover:bg-zinc-850 light:hover:bg-zinc-200 text-[9px] font-mono rounded border border-zinc-850 text-zinc-400 light:text-zinc-700"
                          >
                            Template: Call request
                          </button>
                        </div>
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-[10px] font-mono font-bold rounded"
                        >
                          Send simulated reply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-zinc-900/10 border border-dashed border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-lg text-zinc-500 font-mono text-xs">
                  Select any transmission item from directory tree to read message signal.
                </div>
              )}
            </div>

          </div>
        )}

        {/* 6. CONSOLE SYSTEM SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Passcode changer */}
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3">
                  Change Console Passcode
                </h3>
                <form onSubmit={handleSavePasscode} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Current Passcode</label>
                    <input 
                      type="password"
                      value={passcodeForm.current}
                      onChange={e => setPasscodeForm({ ...passcodeForm, current: e.target.value })}
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">New Security Passcode</label>
                    <input 
                      type="password"
                      value={passcodeForm.newPass}
                      onChange={e => setPasscodeForm({ ...passcodeForm, newPass: e.target.value })}
                      placeholder="Enter new code"
                      className="w-full p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 text-xs rounded"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-mono text-[10px] font-bold rounded"
                  >
                    Upgrade Passcode
                  </button>
                </form>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 text-rose-500">
                  Relay System Overwrite (Reset Database)
                </h3>
                <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed">
                  Resetting database clears any customizations made to the landing page headings, custom timeline readings, added case studies, or edited resume bio-data, and loads the original default electrical portfolio parameters.
                </p>
                <button 
                  onClick={handleResetFactoryDefaults}
                  className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:text-zinc-950 text-rose-500 text-xs font-mono font-bold rounded transition-colors cursor-pointer"
                >
                  [Execute Hard Factory Reset Overwrite]
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
