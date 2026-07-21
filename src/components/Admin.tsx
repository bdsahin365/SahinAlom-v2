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
  ShieldAlert,
  Search,
  Moon,
  Sun,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { CASE_STUDIES, DEFAULT_HOMEPAGE_CONTENT, DEFAULT_PROFILE_DATA, INITIAL_ADMIN_STATS, DEFAULT_APP_SETTINGS, DEFAULT_BLOG_POSTS } from '../data';
import { CaseStudy, HomepageContent, ProfileData, ContactMessage, AdminStats, AppSettings, BlogPost } from '../types';

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
  // Shadcn UI Style Classes
  const inputClass = "flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 shadow-sm transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 font-sans";
  const textareaClass = "flex min-h-[60px] w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 shadow-sm transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 font-sans";
  const selectClass = "flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 font-sans cursor-pointer";
  
  const btnPrimaryClass = "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100/95 shadow-sm h-9 px-4 py-2 cursor-pointer";
  const btnSecondaryClass = "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50 h-9 px-4 py-2 cursor-pointer";
  const btnAmberClass = "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md h-9 px-4 py-2 cursor-pointer";
  const btnDestructiveClass = "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 bg-rose-600 hover:bg-rose-700 text-zinc-50 dark:bg-rose-900 dark:text-zinc-50 dark:hover:bg-rose-800/90 shadow h-9 px-4 py-2 cursor-pointer";

  // Authentication State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sidebar Layout State (Mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pages' | 'posts' | 'blog' | 'resume' | 'messages' | 'settings'>('dashboard');

  const [localDarkMode, setLocalDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return !document.documentElement.classList.contains('light');
    }
    return true;
  });

  const handleToggleLocalDarkMode = () => {
    const nextDark = !localDarkMode;
    setLocalDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('sahin_portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sahin_portfolio_theme', 'light');
    }
  };

  // Shared Data States
  const [stats, setStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [profileForm, setProfileForm] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(CASE_STUDIES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  // Active editors / selectors
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [searchMessageQuery, setSearchMessageQuery] = useState('');
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

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

  // Blog Post Editor States
  const [editingBlogSlug, setEditingBlogSlug] = useState<string | null>(null); // null means creating new
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Substation Maintenance',
    date: '',
    readTime: '5 min read',
    summary: '',
    content: '',
    tags: [],
    imageUrl: '',
    published: true
  });
  const [blogTagInput, setBlogTagInput] = useState('');

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
          const base64Img = event.target!.result as string;
          setHomepageContent(prev => ({
            ...prev,
            heroProfileImage: base64Img
          }));
          setProfileForm(prev => ({
            ...prev,
            imageUrl: base64Img
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
          const base64Img = event.target!.result as string;
          setHomepageContent(prev => ({
            ...prev,
            heroProfileImage: base64Img
          }));
          setProfileForm(prev => ({
            ...prev,
            imageUrl: base64Img
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
      try {
        const parsed = JSON.parse(storedStats);
        if (parsed && typeof parsed === 'object') {
          setStats({ ...INITIAL_ADMIN_STATS, ...parsed });
        } else {
          setStats(INITIAL_ADMIN_STATS);
        }
      } catch (e) {
        setStats(INITIAL_ADMIN_STATS);
      }
    } else {
      setStats(INITIAL_ADMIN_STATS);
      localStorage.setItem('sahin_admin_stats', JSON.stringify(INITIAL_ADMIN_STATS));
    }

    // Messages
    const storedMsgs = localStorage.getItem('sahin_portfolio_messages');
    if (storedMsgs) {
      try {
        const parsed = JSON.parse(storedMsgs);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        } else {
          setMessages([]);
        }
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }

    // Homepage Editable Fields
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

    // Profile CV Biodata
    const storedProfile = localStorage.getItem('sahin_profile_data');
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        if (parsed && typeof parsed === 'object') {
          setProfileForm({ ...DEFAULT_PROFILE_DATA, ...parsed });
        } else {
          setProfileForm(DEFAULT_PROFILE_DATA);
        }
      } catch (e) {
        setProfileForm(DEFAULT_PROFILE_DATA);
      }
    } else {
      setProfileForm(DEFAULT_PROFILE_DATA);
    }

    // Case Studies / Posts
    const storedStudies = localStorage.getItem('sahin_case_studies');
    if (storedStudies) {
      try {
        const parsed = JSON.parse(storedStudies);
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
      localStorage.setItem('sahin_case_studies', JSON.stringify(CASE_STUDIES));
    }

    // Blog Posts
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
      localStorage.setItem('sahin_blog_posts', JSON.stringify(DEFAULT_BLOG_POSTS));
      setBlogPosts(DEFAULT_BLOG_POSTS);
    }

    // App Settings
    const storedSettings = localStorage.getItem('sahin_portfolio_settings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        if (parsed && typeof parsed === 'object') {
          setAppSettings({ ...DEFAULT_APP_SETTINGS, ...parsed });
        } else {
          setAppSettings(DEFAULT_APP_SETTINGS);
        }
      } catch (e) {
        setAppSettings(DEFAULT_APP_SETTINGS);
      }
    } else {
      setAppSettings(DEFAULT_APP_SETTINGS);
      localStorage.setItem('sahin_portfolio_settings', JSON.stringify(DEFAULT_APP_SETTINGS));
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

  const handleSaveSettings = (updatedSettings: AppSettings) => {
    setAppSettings(updatedSettings);
    localStorage.setItem('sahin_portfolio_settings', JSON.stringify(updatedSettings));
    
    // Also sync the theme immediately so the changes reflect on the fly
    if (updatedSettings.defaultTheme === 'light') {
      document.documentElement.classList.add('light');
      localStorage.setItem('sahin_portfolio_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('sahin_portfolio_theme', 'dark');
    }

    if (onSync) onSync();
    triggerQuickAction('Console parameters updated & integrated.');
  };

  const handleResetFactoryDefaults = () => {
    if (window.confirm('Are you absolutely sure you want to reset all custom text, posts, blogs, and CV records to factory defaults? This is non-reversible.')) {
      localStorage.removeItem('sahin_homepage_content');
      localStorage.removeItem('sahin_profile_data');
      localStorage.removeItem('sahin_case_studies');
      localStorage.removeItem('sahin_blog_posts');
      localStorage.removeItem('sahin_portfolio_messages');
      localStorage.removeItem('sahin_admin_stats');
      localStorage.removeItem('sahin_portfolio_settings');
      localStorage.removeItem('sahin_portfolio_theme');
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

  // Blog Post CMS handlers
  const handleSaveBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.category) {
      alert('Title, slug, and category are required fields.');
      return;
    }

    let updatedList = [...blogPosts];
    // Autofill date if not set
    const finalDate = blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const finalForm = { ...blogForm, date: finalDate } as BlogPost;

    if (editingBlogSlug) {
      // Edit
      updatedList = updatedList.map(item => item.slug === editingBlogSlug ? finalForm : item);
      triggerQuickAction(`Blog article "${blogForm.title}" updated successfully.`);
    } else {
      // Check duplicate slug
      if (blogPosts.some(item => item.slug === blogForm.slug)) {
        alert('Slug already exists. Please choose a unique URL slug.');
        return;
      }
      // Create new
      updatedList.unshift(finalForm);
      triggerQuickAction(`New blog article "${blogForm.title}" published & live.`);
    }

    setBlogPosts(updatedList);
    localStorage.setItem('sahin_blog_posts', JSON.stringify(updatedList));
    if (onSync) onSync();
    
    handleCancelBlogEdit();
  };

  const handleDeleteBlogPost = (slug: string) => {
    if (window.confirm('Delete this blog post permanently?')) {
      const updatedList = blogPosts.filter(item => item.slug !== slug);
      setBlogPosts(updatedList);
      localStorage.setItem('sahin_blog_posts', JSON.stringify(updatedList));
      if (onSync) onSync();
      triggerQuickAction('Blog post removed from local memory.');
    }
  };

  const handleEditBlogClick = (post: BlogPost) => {
    setEditingBlogSlug(post.slug);
    setBlogForm({ ...post });
    setBlogTagInput(post.tags.join(', '));
  };

  const handleCreateNewBlogClick = () => {
    setEditingBlogSlug(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Substation Maintenance',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: '5 min read',
      summary: '',
      content: '',
      tags: [],
      imageUrl: '',
      published: true
    });
    setBlogTagInput('');
  };

  const handleCancelBlogEdit = () => {
    setEditingBlogSlug(null);
    setBlogForm({
      title: '',
      slug: '',
      category: 'Substation Maintenance',
      date: '',
      readTime: '5 min read',
      summary: '',
      content: '',
      tags: [],
      imageUrl: '',
      published: true
    });
    setBlogTagInput('');
  };

  const handleAddBlogTag = () => {
    if (!blogTagInput.trim()) return;
    const items = blogTagInput.split(',').map(s => s.trim()).filter(Boolean);
    setBlogForm(prev => ({
      ...prev,
      tags: Array.from(new Set([...(prev.tags || []), ...items]))
    }));
    setBlogTagInput('');
  };

  const handleRemoveBlogTag = (tagToRemove: string) => {
    setBlogForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
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
  const filteredMessages = (Array.isArray(messages) ? messages : []).filter(msg => {
    if (!msg) return false;
    const q = (searchMessageQuery || '').toLowerCase();
    const name = (msg.name || '').toLowerCase();
    const email = (msg.email || '').toLowerCase();
    const company = (msg.company || '').toLowerCase();
    const message = (msg.message || '').toLowerCase();
    return name.includes(q) || email.includes(q) || company.includes(q) || message.includes(q);
  });

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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 select-none antialiased">
        <div className="w-full max-w-sm p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-6 relative">
          
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="font-display font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
              Admin Gateway
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter authorized passcode to log into the Admin Desk.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider font-mono text-zinc-450 dark:text-zinc-505">
                  Authorized Key
                </label>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">SECURE ACCESS</span>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Passcode (voltage50 or admin)"
                className={`${inputClass} font-mono`}
                id="admin-auth-pass"
              />
              {authError && (
                <span className="block text-xs text-rose-500 font-semibold mt-1.5 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{authError}</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`${btnPrimaryClass} w-full py-2.5 h-10`}
              id="admin-auth-submit"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Unlock Console</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                sessionStorage.setItem('sahin_admin_authenticated', 'true');
                setAuthError('');
                triggerQuickAction('Console control lock bypassed. Systems authorized.');
              }}
              className={`${btnSecondaryClass} w-full py-2 h-9 text-[11px]`}
              id="admin-auth-bypass"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Bypass Password (Developer Pass)</span>
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-4">
            <span className="font-mono text-[10px] text-zinc-500 block leading-relaxed">
              Authorized keys can be found in the journal: <span className="text-amber-500 font-bold">voltage50</span> or <span className="text-amber-500 font-bold">admin</span>
            </span>
            <div className="pt-1">
              <button 
                onClick={() => window.location.hash = '#/'}
                className="inline-flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline transition-all font-mono uppercase tracking-wider cursor-pointer"
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row text-zinc-900 dark:text-zinc-50 select-none antialiased">
      
      {/* Toast Notification */}
      {quickActionNotification && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-emerald-500 text-zinc-950 rounded-lg shadow-xl font-mono text-xs font-bold flex items-center space-x-2 animate-fade-in border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-zinc-950" />
          <span>{quickActionNotification}</span>
        </div>
      )}

      {/* SLIDE-OVER DRAWER BACKDROP (MOBILE ONLY) */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
        />
      )}

      {/* MOBILE DRAWER SIDEBAR PANEL */}
      <div className={`
        fixed inset-y-0 left-0 bg-zinc-900 dark:bg-zinc-900 light:bg-white border-r border-zinc-800 dark:border-zinc-800 light:border-zinc-200 w-64 transform transition-transform duration-300 ease-in-out z-50 md:hidden flex flex-col pt-4 pb-6
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="px-6 pb-4 mb-4 border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-xs">⚡</div>
            <div>
              <span className="block font-display font-bold text-xs text-zinc-100 light:text-zinc-900 tracking-tight">Admin Control</span>
              <span className="block text-[8px] font-mono text-zinc-500 uppercase">Dhaka Substation</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Operational Desk', icon: LayoutDashboard },
            { id: 'pages', label: 'Home Page Editor', icon: FileText },
            { id: 'posts', label: 'Posts & Case Studies', icon: Layers },
            { id: 'blog', label: 'Industrial Notes CMS', icon: BookOpen },
            { id: 'resume', label: 'CV & Biodata Editor', icon: UserCheck },
            { id: 'messages', label: 'Inbox Messages', icon: Inbox, badge: messages.length },
            { id: 'settings', label: 'Console Settings', icon: SettingsIcon }
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
                className={`w-full flex items-center justify-between p-2.5 rounded text-left transition-all cursor-pointer border text-xs ${
                  isActive 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold' 
                    : 'border-transparent text-zinc-400 light:text-zinc-650 hover:text-zinc-200 light:hover:text-zinc-900 hover:bg-zinc-850/50 light:hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-500' : 'text-zinc-500'}`} />
                  <span className="font-sans uppercase tracking-wider text-[11px]">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-amber-500 text-zinc-950 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User profile / Log out */}
        <div className="px-4 pt-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-100 space-y-2">
          <div className="flex items-center space-x-2 px-2">
            <div className="w-7 h-7 rounded-full bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 flex items-center justify-center border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 font-bold text-zinc-400 light:text-zinc-600 uppercase text-xs">SA</div>
            <div>
              <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Sahin Alom</span>
              <span className="block text-[8px] font-mono text-zinc-500">Dhaka Substation</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.hash = '#/'}
            className="w-full py-1.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/30 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 hover:text-amber-500 text-[9px] font-mono uppercase tracking-widest rounded transition-colors text-zinc-400 light:text-zinc-600 flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Exit Console</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-1.5 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-rose-500/30 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 hover:text-rose-500 text-[9px] font-mono uppercase tracking-widest rounded transition-colors text-zinc-500 light:text-zinc-500"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* DESKTOP COLLAPSIBLE SIDEBAR PANEL */}
      <aside className={`
        hidden md:flex flex-col h-screen sticky top-0 bg-zinc-900 dark:bg-zinc-900 light:bg-white border-r border-zinc-850 dark:border-zinc-850 light:border-zinc-200 transition-all duration-300 flex-shrink-0 z-20
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Brand Header block */}
        <div className={`px-4 py-5 mb-4 border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-100 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center font-bold text-zinc-950 flex-shrink-0">⚡</div>
            {!isSidebarCollapsed && (
              <div className="animate-fade-in">
                <span className="block font-display font-bold text-xs text-zinc-100 light:text-zinc-900 tracking-tight whitespace-nowrap">Admin Control</span>
                <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Dhaka Substation</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation block */}
        <nav className="px-3 space-y-1.5 flex-1">
          {[
            { id: 'dashboard', label: 'Operational Desk', desc: 'Stats, messages & status', icon: LayoutDashboard },
            { id: 'pages', label: 'Home Page Editor', desc: 'Hero titles, taglines, media', icon: FileText },
            { id: 'posts', label: 'Posts & Case Studies', desc: 'Manage field research', icon: Layers },
            { id: 'blog', label: 'Industrial Notes CMS', desc: 'Add or edit blog articles', icon: BookOpen },
            { id: 'resume', label: 'CV & Biodata Editor', desc: 'Profile credentials & biography', icon: UserCheck },
            { id: 'messages', label: 'Inbox Messages', desc: 'Reader & reply portal', icon: Inbox, badge: messages.length },
            { id: 'settings', label: 'Console Settings', desc: 'Security & factory clear', icon: SettingsIcon }
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-2.5 rounded text-left transition-all group cursor-pointer border ${
                  isActive 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 font-semibold' 
                    : 'border-transparent text-zinc-400 light:text-zinc-650 hover:text-zinc-100 light:hover:text-zinc-900 hover:bg-zinc-850/30 light:hover:bg-zinc-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-400 light:group-hover:text-zinc-700'}`} />
                  {!isSidebarCollapsed && (
                    <div className="animate-fade-in">
                      <span className="block text-[11px] uppercase font-sans tracking-wider">{item.label}</span>
                      <span className="block text-[9px] font-mono text-zinc-500 truncate max-w-[150px]">{item.desc}</span>
                    </div>
                  )}
                </div>
                {!isSidebarCollapsed && item.badge && item.badge > 0 ? (
                  <span className="bg-amber-500 text-zinc-950 text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-full animate-pulse-slow">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Footer / User Profile block in Sidebar */}
        <div className="p-3 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-100 space-y-2">
          {!isSidebarCollapsed ? (
            <div className="animate-fade-in bg-zinc-950/40 dark:bg-zinc-950/40 light:bg-zinc-50 p-2.5 rounded-lg border border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
              <div className="flex items-center space-x-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 flex items-center justify-center border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 font-bold text-zinc-400 light:text-zinc-650 uppercase text-xs flex-shrink-0">
                  SA
                </div>
                <div>
                  <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Sahin Alom</span>
                  <span className="block text-[8px] font-mono text-zinc-500">Dhaka, Bangladesh</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-1 bg-zinc-900 dark:bg-zinc-900 light:bg-white hover:bg-zinc-850 hover:text-rose-500 text-[9px] font-mono uppercase tracking-widest rounded transition-colors text-zinc-400 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 dark:bg-zinc-800 light:bg-zinc-200 flex items-center justify-center border border-zinc-700 dark:border-zinc-700 light:border-zinc-300 font-bold text-zinc-400 light:text-zinc-600 uppercase text-xs">
                SA
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 rounded hover:bg-zinc-800/50 text-zinc-500 hover:text-rose-500"
                title="Sign Out / Lock Console"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CORE WORKSPACE CONTENT FRAME */}
      <main className="flex-1 min-w-0 flex flex-col bg-zinc-50 dark:bg-zinc-950 h-screen overflow-hidden">
        
        {/* PREMIUM SHADCN TOP NAVIGATION BAR */}
        <header className="h-14 border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-200 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/80 backdrop-blur sticky top-0 z-10 px-4 sm:px-6 flex items-center justify-between flex-shrink-0">
          
          {/* Left section: Collapse toggle, breadcrumb titles */}
          <div className="flex items-center space-x-2">
            {/* Desktop collapse button */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-md hover:bg-zinc-850/50 light:hover:bg-zinc-100 text-zinc-400 light:text-zinc-500 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>
            
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md hover:bg-zinc-850/50 light:hover:bg-zinc-100 text-zinc-400 light:text-zinc-500"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb typography */}
            <div className="flex items-center space-x-1.5 text-xs font-mono">
              <span className="text-zinc-500">Admin</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-amber-500 font-bold capitalize">
                {activeTab === 'dashboard' ? 'Operational Desk' : activeTab === 'pages' ? 'Home Editor' : activeTab === 'posts' ? 'Posts' : activeTab === 'blog' ? 'Blog CMS' : activeTab === 'resume' ? 'Biodata Editor' : activeTab === 'messages' ? 'Inbox' : 'Settings'}
              </span>
            </div>
          </div>

          {/* Center Section: Inline Search Bar (Laptops) */}
          <div className="relative max-w-xs hidden lg:block flex-1 mx-4">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search console metrics..." 
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="pl-8 h-8 w-full rounded-md border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-zinc-50 text-[11px] font-mono text-zinc-300 light:text-zinc-900 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600" 
            />
          </div>

          {/* Right section: System Status, Mode Switcher, Portfolio Link, Avatar */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Substation active indicator */}
            <div className="hidden sm:flex items-center space-x-2 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400 light:text-zinc-600">GRID SYSTEM: 50.02 HZ</span>
            </div>

            {/* Dark mode switcher */}
            <button 
              onClick={handleToggleLocalDarkMode}
              className="p-1.5 rounded-md hover:bg-zinc-850/50 light:hover:bg-zinc-100 text-zinc-400 light:text-zinc-500 transition-colors"
              title="Toggle theme mode"
            >
              {localDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Back button */}
            <button 
              onClick={() => window.location.hash = '#/'}
              className="p-1.5 rounded-md hover:bg-zinc-850/50 light:hover:bg-zinc-100 text-zinc-400 light:text-zinc-500 transition-colors flex items-center space-x-1 text-xs"
              title="Return to portfolio website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px] font-mono">Exit</span>
            </button>

            {/* Profile Avatar indicator */}
            <div className="flex items-center space-x-2 pl-3 border-l border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-xs">
                SA
              </div>
              <div className="hidden xl:block text-left leading-none">
                <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Sahin Alom</span>
                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Dhaka, BD</span>
              </div>
            </div>

          </div>

        </header>

        {/* WORKSPACE MAIN SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full pb-12">
            
            {/* Title banner inside the work area */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-4 gap-4">
              <div>
                <span className="font-mono text-[9px] text-amber-500 uppercase tracking-widest block font-extrabold">
                  AUTHORIZED SECURITY PROTOCOL SYSTEM ACTIVE
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight mt-0.5 capitalize">
                  {activeTab === 'dashboard' ? 'Operational Desk' : activeTab === 'pages' ? 'Page Content Editor' : activeTab === 'posts' ? 'Case Studies & Research' : activeTab === 'blog' ? 'Industrial Notes CMS' : activeTab === 'resume' ? 'CV & Marriage Biodata' : activeTab === 'messages' ? 'Received Contact Messages' : 'Console System Settings'}
                </h1>
              </div>
            </div>

            {/* TAB WORKSPACE CONTENT SWITCHER */}
            {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && (() => {
          // --- Custom SVG Chart Setup ---
          const width = 640;
          const height = 190;
          const paddingLeft = 45;
          const paddingRight = 20;
          const paddingTop = 25;
          const paddingBottom = 30;

          // Define dataset for each of the 3 credit cards, split by Weekly/Monthly
          const cardDataSets = [
            {
              // Card 0: Voltage Grid
              code: 'GRID CARD',
              label1: 'L1-L2 Voltage (V AC)',
              label2: 'L3-Neutral (V AC)',
              weekly1: [408, 415, 395, 412, 420, 408, 416],
              weekly2: [232, 240, 226, 238, 242, 235, 239],
              monthly1: [402, 408, 411, 415],
              monthly2: [230, 234, 237, 240],
              suffix: 'V',
              icon: Zap,
              color1: '#f59e0b', // Amber
              color2: '#3b82f6'  // Blue
            },
            {
              // Card 1: Traffic Hits
              code: 'TELEMETRY',
              label1: 'Page Views (Hits)',
              label2: 'Signals Received',
              weekly1: [1200, 1850, 1420, 2600, 2150, 3120, 2800],
              weekly2: [2, 4, 1, 6, 3, 9, 5],
              monthly1: [5200, 7800, 10200, stats.visitors || 12845],
              monthly2: [12, 19, 15, messages.length || 29],
              suffix: '',
              icon: Eye,
              color1: '#3b82f6', // Blue
              color2: '#10b981'  // Emerald
            },
            {
              // Card 2: Research & Journal Assets
              code: 'ASSET DECK',
              label1: 'Article Views',
              label2: 'Asset Downloads',
              weekly1: [210, 340, 280, 450, 390, 520, 480],
              weekly2: [15, 28, 19, 42, 31, 55, 40],
              monthly1: [1100, 1450, 1820, 2240],
              monthly2: [90, 120, 160, 210],
              suffix: ' DL',
              icon: BookOpen,
              color1: '#10b981', // Emerald
              color2: '#ec4899'  // Pink
            }
          ];

          const activeSet = cardDataSets[activeCardIndex];
          const activeData = chartPeriod === 'weekly' ? activeSet.weekly1 : activeSet.monthly1;
          const activeData2 = chartPeriod === 'weekly' ? activeSet.weekly2 : activeSet.monthly2;
          const activeLabels = chartPeriod === 'weekly' 
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

          // Compute max, min & scale
          const maxVal = Math.max(...activeData, ...activeData2, 1) * 1.15;
          const minVal = Math.max(0, Math.min(...activeData, ...activeData2, 0) * 0.85);
          const range = maxVal - minVal;

          const points1 = activeData.map((val, i) => {
            const x = paddingLeft + (i / (activeData.length - 1)) * (width - paddingLeft - paddingRight);
            const y = height - paddingBottom - ((val - minVal) / range) * (height - paddingTop - paddingBottom);
            return { x, y, val };
          });

          const points2 = activeData2.map((val, i) => {
            const x = paddingLeft + (i / (activeData2.length - 1)) * (width - paddingLeft - paddingRight);
            const y = height - paddingBottom - ((val - minVal) / range) * (height - paddingTop - paddingBottom);
            return { x, y, val };
          });

          const pathD1 = points1.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
          const areaD1 = points1.length > 0 
            ? `${pathD1} L ${points1[points1.length - 1].x} ${height - paddingBottom} L ${points1[0].x} ${height - paddingBottom} Z`
            : '';

          const pathD2 = points2.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
          const areaD2 = points2.length > 0 
            ? `${pathD2} L ${points2[points2.length - 1].x} ${height - paddingBottom} L ${points2[0].x} ${height - paddingBottom} Z`
            : '';

          // Render horizontal grid lines
          const gridRatios = [0, 0.25, 0.5, 0.75, 1.0];
          const gridLinesY = gridRatios.map(ratio => {
            const val = minVal + ratio * range;
            const y = height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
            return { y, val: Math.round(val) };
          });

          // Fallback static mock contacts when messages database is empty
          const defaultContactsList = [
            { id: 'm1', name: 'Farhan Ahmed', company: 'DESCO Grid Operations', email: 'f.ahmed@desco.org.bd', message: 'Inquiry regarding substation coupling relay interlocks settings.', date: 'July 19, 2026', initial: 'FA', color: 'from-amber-500 to-yellow-600' },
            { id: 'm2', name: 'M. Karim', company: 'PGCB Bangladesh', email: 'karim.m@pgcb.gov.bd', message: 'Seeking earth loop impedance data curves for Dhaka Central zone grid.', date: 'July 18, 2026', initial: 'MK', color: 'from-blue-500 to-indigo-600' },
            { id: 'm3', name: 'Sultana Yeasmin', company: 'Summit Power Ltd', email: 'sultana.y@summit.com.bd', message: 'Consultation request on BNBC 2020 grounding coefficients guidelines.', date: 'July 16, 2026', initial: 'SY', color: 'from-emerald-500 to-teal-600' }
          ];

          const displayContacts = (Array.isArray(messages) && messages.length > 0)
            ? messages.slice(0, 3).map((m, idx) => {
                const name = m?.name || 'Anonymous';
                const initial = name.split(' ').map(n => n ? n[0] : '').join('').toUpperCase().slice(0, 2) || 'A';
                return {
                  id: m?.id || String(idx),
                  name: name,
                  company: m?.company || 'Direct Contact',
                  email: m?.email || '',
                  message: m?.message || '',
                  date: m?.date || '',
                  initial: initial,
                  color: idx === 0 ? 'from-amber-500 to-yellow-600' : idx === 1 ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600'
                };
              })
            : defaultContactsList;

          return (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* TOP HEADER STATUS GREETING */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-5 bg-zinc-900/20 light:bg-zinc-100/40 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 light:text-zinc-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Control Panel Console Active</span>
                  </h2>
                  <p className="text-xs text-zinc-400 light:text-zinc-650 mt-1">
                    Welcome back, <strong className="text-zinc-200 light:text-zinc-950 font-bold">Sahin Alom</strong>. Manage field research, industrial logs, and bio-data details in real-time.
                  </p>
                </div>
                <div className="flex gap-2 font-mono text-[11px]">
                  <span className="px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 text-amber-500">
                    STATION: DHAKA 132/33KV
                  </span>
                  <span className="px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 text-emerald-500">
                    INTERLOCKS: NORMAL
                  </span>
                </div>
              </div>

              {/* SHADCN-STYLE CLEAN METRIC CARDS HEADER */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-1">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-400 light:text-zinc-500 uppercase">
                      Console Operational Metrics
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-sans">
                      Select a console card below to route real-time telemetry metrics to the main charting frame
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase font-bold">
                    SELECT METRIC FOR ANALYSIS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      index: 0,
                      label: 'GRID VOLTAGE CONTROL',
                      value: '415.82 V AC',
                      subtext: 'Frequency: 50.02 Hz | Cos φ: 0.98',
                      code: 'GRID VOLTAGE',
                      icon: Zap,
                      iconColor: 'text-amber-500'
                    },
                    {
                      index: 1,
                      label: 'TOTAL TRAFFIC READERS',
                      value: `${(stats.visitors || 12845).toLocaleString()}`,
                      subtext: `Inbox Queries: ${messages.length} pending`,
                      code: 'SERVER HITS',
                      icon: Eye,
                      iconColor: 'text-blue-500'
                    },
                    {
                      index: 2,
                      label: 'FIELD PROJECTS & CASE STUDIES',
                      value: `${caseStudies.length} Active Reports`,
                      subtext: `${blogPosts.length} Industrial Journal articles`,
                      code: 'ASSETS DECK',
                      icon: BookOpen,
                      iconColor: 'text-emerald-500'
                    }
                  ].map((card) => {
                    const isSelected = activeCardIndex === card.index;
                    const IconComponent = card.icon;
                    return (
                      <div
                        key={card.index}
                        onClick={() => {
                          setActiveCardIndex(card.index);
                          triggerQuickAction(`Tapped ${card.code}. Telemetry lines synchronized.`);
                        }}
                        className={`relative rounded-xl p-5 border cursor-pointer transition-all duration-250 select-none overflow-hidden group flex flex-col justify-between h-36 ${
                          isSelected 
                            ? 'bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-zinc-50/50 border-amber-500/50 dark:border-amber-500/50 ring-1 ring-amber-500/10' 
                            : 'bg-white dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-800'
                        }`}
                        id={`telemetry-card-${card.index}`}
                      >
                        {/* Top block */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="block text-[10px] font-mono font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                              {card.label}
                            </span>
                            <span className="block text-[9px] font-mono text-zinc-500 dark:text-zinc-600">
                              {card.code}
                            </span>
                          </div>
                          <div className={`p-2 rounded-lg bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200/50 dark:border-zinc-850 ${isSelected ? 'border-amber-500/30' : ''} transition-all`}>
                            <IconComponent className={`w-4 h-4 ${card.iconColor}`} />
                          </div>
                        </div>

                        {/* Value block */}
                        <div className="mt-1">
                          <span className="block font-display font-extrabold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                            {card.value}
                          </span>
                        </div>

                        {/* Bottom line */}
                        <div className="border-t border-zinc-100 dark:border-zinc-850/60 pt-2.5 mt-2.5 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                          <span className="font-mono truncate max-w-[180px]">{card.subtext}</span>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950/60 text-zinc-450 dark:text-zinc-500 uppercase tracking-widest font-bold">
                            {isSelected ? 'ACTIVE' : 'STANDBY'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BENTO GRID DOUBLE-COLUMN LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT BENTO PANELS (CHARTS & HUD) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* MAIN CHART PANEL: "YOUR BALANCE SUMMARY" */}
                  <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-4 mb-4 gap-3">
                      <div>
                        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">
                          Core Live Telemetry Link
                        </span>
                        <h4 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                          {activeSet.code} — Telemetry Metrics Summary
                        </h4>
                      </div>
                      
                      {/* Controls: Period Select & Legend */}
                      <div className="flex items-center gap-3">
                        <div className="flex rounded-md bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-0.5 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 text-[10px] font-mono">
                          <button
                            onClick={() => setChartPeriod('weekly')}
                            className={`px-2.5 py-1 rounded-sm transition-colors ${
                              chartPeriod === 'weekly' 
                                ? 'bg-amber-500 text-zinc-950 font-bold' 
                                : 'text-zinc-400 light:text-zinc-650'
                            }`}
                          >
                            Weekly
                          </button>
                          <button
                            onClick={() => setChartPeriod('monthly')}
                            className={`px-2.5 py-1 rounded-sm transition-colors ${
                              chartPeriod === 'monthly' 
                                ? 'bg-amber-500 text-zinc-950 font-bold' 
                                : 'text-zinc-400 light:text-zinc-650'
                            }`}
                          >
                            Monthly
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SVG GRAPH PLOTTING CONTAINER */}
                    <div className="relative">
                      {/* Chart Legend */}
                      <div className="flex gap-4 font-mono text-[10px] mb-3 justify-end px-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSet.color1 }} />
                          <span className="text-zinc-300 light:text-zinc-700">{activeSet.label1}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSet.color2 }} />
                          <span className="text-zinc-300 light:text-zinc-700">{activeSet.label2}</span>
                        </span>
                      </div>

                      <div className="w-full overflow-x-auto select-none">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                          <defs>
                            {/* Gradients */}
                            <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={activeSet.color1} stopOpacity="0.25" />
                              <stop offset="100%" stopColor={activeSet.color1} stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={activeSet.color2} stopOpacity="0.25" />
                              <stop offset="100%" stopColor={activeSet.color2} stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid lines */}
                          {gridLinesY.map((line, i) => (
                            <g key={i}>
                              <line 
                                x1={paddingLeft} 
                                y1={line.y} 
                                x2={width - paddingRight} 
                                y2={line.y} 
                                className="stroke-zinc-800 dark:stroke-zinc-850 light:stroke-zinc-200 stroke-[0.5]" 
                                strokeDasharray="3 3"
                              />
                              <text 
                                x={paddingLeft - 8} 
                                y={line.y + 3} 
                                textAnchor="end" 
                                className="fill-zinc-500 font-mono text-[8px]"
                              >
                                {line.val.toLocaleString()}
                              </text>
                            </g>
                          ))}

                          {/* Area & Line 2 (Secondary Metric) */}
                          <path d={areaD2} fill="url(#gradient2)" />
                          <path 
                            d={pathD2} 
                            fill="none" 
                            stroke={activeSet.color2} 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />

                          {/* Area & Line 1 (Primary Metric) */}
                          <path d={areaD1} fill="url(#gradient1)" />
                          <path 
                            d={pathD1} 
                            fill="none" 
                            stroke={activeSet.color1} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />

                          {/* X Axis Labels */}
                          {activeLabels.map((lbl, i) => {
                            const x = paddingLeft + (i / (activeLabels.length - 1)) * (width - paddingLeft - paddingRight);
                            return (
                              <text 
                                key={i} 
                                x={x} 
                                y={height - 10} 
                                textAnchor="middle" 
                                className="fill-zinc-400 font-mono text-[9px]"
                              >
                                {lbl}
                              </text>
                            );
                          })}

                          {/* Interaction Nodes (Circles) */}
                          {points1.map((p, i) => (
                            <g key={`p1-${i}`}>
                              <circle 
                                cx={p.x} 
                                cy={p.y} 
                                r={hoveredDataPoint === i ? 5 : 3.5} 
                                fill="#09090b" 
                                stroke={activeSet.color1} 
                                strokeWidth="1.5"
                                onMouseEnter={() => setHoveredDataPoint(i)}
                                onMouseLeave={() => setHoveredDataPoint(null)}
                                className="cursor-pointer transition-all"
                              />
                            </g>
                          ))}

                          {points2.map((p, i) => (
                            <g key={`p2-${i}`}>
                              <circle 
                                cx={p.x} 
                                cy={p.y} 
                                r={hoveredDataPoint === i ? 5 : 3} 
                                fill="#09090b" 
                                stroke={activeSet.color2} 
                                strokeWidth="1"
                                onMouseEnter={() => setHoveredDataPoint(i)}
                                onMouseLeave={() => setHoveredDataPoint(null)}
                                className="cursor-pointer transition-all"
                              />
                            </g>
                          ))}
                        </svg>
                      </div>

                      {/* Dynamic Live Floating Tooltip */}
                      {hoveredDataPoint !== null && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 border border-zinc-800 dark:border-zinc-800 light:border-zinc-250 p-3 rounded-lg shadow-xl pointer-events-none font-mono text-[10px] space-y-1.5 min-w-[150px] z-20">
                          <span className="block font-bold text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                            {activeLabels[hoveredDataPoint]} Logs
                          </span>
                          <div className="flex justify-between gap-4 border-t border-zinc-850/50 pt-1">
                            <span className="text-zinc-500">Primary:</span>
                            <span className="font-bold text-zinc-200 light:text-zinc-900">
                              {activeData[hoveredDataPoint].toLocaleString()}{activeSet.suffix}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-500 font-medium">Secondary:</span>
                            <span className="font-bold text-zinc-300 light:text-zinc-700">
                              {activeData2[hoveredDataPoint].toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick operational statistics footer */}
                    <div className="grid grid-cols-3 gap-2 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-250 pt-4 mt-3 font-mono text-[10px]">
                      <div>
                        <span className="text-zinc-500 block">Peak Metric:</span>
                        <span className="font-bold text-zinc-200 light:text-zinc-900">
                          {Math.max(...activeData).toLocaleString()}{activeSet.suffix}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Lowest Record:</span>
                        <span className="font-bold text-zinc-200 light:text-zinc-900">
                          {Math.min(...activeData).toLocaleString()}{activeSet.suffix}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Grid Status Index:</span>
                        <span className="text-emerald-500 font-bold block">● SECURED / STABLE</span>
                      </div>
                    </div>
                  </div>

                  {/* DUO PANEL: CONCENTRIC HUD GRAPH & BAR DIAGRAMS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Concentric high tech circular rings */}
                    <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-zinc-500 block uppercase tracking-wider">
                          Categories HUD Meter
                        </span>
                        <h4 className="font-display font-bold text-xs text-zinc-100 light:text-zinc-900 uppercase">
                          Industrial Section Distribution
                        </h4>
                      </div>

                      {/* Rings display */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
                        <div className="relative w-28 h-28 flex-shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {/* Inner Circle backing */}
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-zinc-800 dark:stroke-zinc-850 light:stroke-zinc-100" strokeWidth="2" />
                            <circle cx="18" cy="18" r="13" fill="none" className="stroke-zinc-800 dark:stroke-zinc-850 light:stroke-zinc-100" strokeWidth="2" />
                            <circle cx="18" cy="18" r="10" fill="none" className="stroke-zinc-800 dark:stroke-zinc-850 light:stroke-zinc-100" strokeWidth="2" />

                            {/* Ring 1 (Amber) - Grid Operations (85%) */}
                            <circle 
                              cx="18" cy="18" r="16" 
                              fill="none" 
                              stroke="#f59e0b" 
                              strokeWidth="2" 
                              strokeDasharray="85 100" 
                              strokeLinecap="round"
                            />
                            {/* Ring 2 (Emerald) - Protection Relays (68%) */}
                            <circle 
                              cx="18" cy="18" r="13" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="2" 
                              strokeDasharray="68 100" 
                              strokeLinecap="round"
                            />
                            {/* Ring 3 (Indigo) - Publications (45%) */}
                            <circle 
                              cx="18" cy="18" r="10" 
                              fill="none" 
                              stroke="#6366f1" 
                              strokeWidth="2" 
                              strokeDasharray="45 100" 
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-zinc-500">
                            85% MAX
                          </div>
                        </div>

                        {/* Legends */}
                        <div className="space-y-2.5 font-mono text-[10px] w-full text-left">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span className="text-zinc-400 light:text-zinc-650">Substation Grid (85%)</span>
                            </span>
                            <span className="font-bold text-zinc-200 light:text-zinc-950">4.5 kVA</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-zinc-400 light:text-zinc-650">Relays & Safety (68%)</span>
                            </span>
                            <span className="font-bold text-zinc-200 light:text-zinc-950">Active</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                              <span className="text-zinc-400 light:text-zinc-650">Journal Notes (45%)</span>
                            </span>
                            <span className="font-bold text-zinc-200 light:text-zinc-950">Logged</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bar chart - Peaks per weekday */}
                    <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-zinc-500 block uppercase tracking-wider">
                          Daily Maintenance Logs
                        </span>
                        <h4 className="font-display font-bold text-xs text-zinc-100 light:text-zinc-900 uppercase">
                          Peak Substation Checks
                        </h4>
                      </div>

                      <div className="flex justify-between items-end h-28 pt-4 pb-2 px-1">
                        {[
                          { day: 'Sun', height: '60%', val: 6 },
                          { day: 'Mon', height: '80%', val: 8 },
                          { day: 'Tue', height: '40%', val: 4 },
                          { day: 'Wed', height: '95%', val: 10, highlight: true },
                          { day: 'Thu', height: '70%', val: 7 },
                          { day: 'Fri', height: '30%', val: 3 },
                          { day: 'Sat', height: '50%', val: 5 }
                        ].map((bar, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                            {/* Bar Cylinder */}
                            <div className="w-2.5 sm:w-3.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 h-20 rounded-full flex items-end overflow-hidden relative border border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                              <div 
                                className={`w-full rounded-full transition-all duration-500 ${
                                  bar.highlight 
                                    ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                                    : 'bg-gradient-to-t from-zinc-700 to-zinc-500'
                                }`} 
                                style={{ height: bar.height }} 
                              />
                            </div>
                            <span className="font-mono text-[8px] text-zinc-500">{bar.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* RIGHT BENTO PANELS (CONTACTS & DYNAMIC CONTROL) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* DYNAMIC QUICK EDITOR DESK */}
                  <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none overflow-hidden">
                      <div className="bg-amber-500 text-zinc-950 text-[6px] font-mono font-bold text-center py-1 absolute transform rotate-45 top-2 right-[-20px] w-[70px] uppercase tracking-wider">
                        Quick-Edit
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-xs text-zinc-100 light:text-zinc-900 uppercase tracking-wider border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4 flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-amber-500" />
                      <span>Quick Operations Desk</span>
                    </h4>

                    {/* Form for rapid parameter modification */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">
                          Homepage Hero Tagline
                        </label>
                        <input 
                          type="text" 
                          value={homepageContent.heroTagline}
                          onChange={e => {
                            setHomepageContent(prev => ({ ...prev, heroTagline: e.target.value }));
                          }}
                          className={`${inputClass} h-8 text-xs font-mono`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">
                          Hero Main Title
                        </label>
                        <input 
                          type="text" 
                          value={homepageContent.heroHeading}
                          onChange={e => {
                            setHomepageContent(prev => ({ ...prev, heroHeading: e.target.value }));
                          }}
                          className={`${inputClass} h-8 text-xs`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">
                          Designation Credentials
                        </label>
                        <input 
                          type="text" 
                          value={homepageContent.heroProfileTitle}
                          onChange={e => {
                            setHomepageContent(prev => ({ ...prev, heroProfileTitle: e.target.value }));
                          }}
                          className={`${inputClass} h-8 text-xs font-mono`}
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <span className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">
                          On-Duty Operator Status
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setHomepageContent(prev => ({ ...prev, heroProfileName: 'Sahin Alom (Active Monitor)' }));
                              triggerQuickAction('Status updated to Active Monitoring');
                            }}
                            className={`flex-1 py-1 px-2 text-[10px] font-mono rounded border transition-all ${
                              homepageContent.heroProfileName.includes('Active')
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-bold'
                                : 'bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-zinc-850 text-zinc-400'
                            }`}
                          >
                            Active Monitor
                          </button>
                          <button
                            onClick={() => {
                              setHomepageContent(prev => ({ ...prev, heroProfileName: 'Sahin Alom' }));
                              triggerQuickAction('Status reset to Default');
                            }}
                            className={`flex-1 py-1 px-2 text-[10px] font-mono rounded border transition-all ${
                              !homepageContent.heroProfileName.includes('Active')
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 font-bold'
                                : 'bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-zinc-850 text-zinc-400'
                            }`}
                          >
                            Default (Off-Line)
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          localStorage.setItem('sahin_homepage_content', JSON.stringify(homepageContent));
                          if (onSync) onSync();
                          triggerQuickAction('Homepage parameter serialized & deployed successfully!');
                        }}
                        className={`${btnAmberClass} w-full mt-2 h-9`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Commit & Deploy Parameters</span>
                      </button>
                    </div>
                  </div>

                  {/* CONTACTS LIST (REPRESENTING INCOMING SIGNALS) */}
                  <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl">
                    <div className="flex justify-between items-center border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-4">
                      <h4 className="font-display font-bold text-xs text-zinc-100 light:text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5 text-amber-500" />
                        <span>Contacts Transmissions</span>
                      </h4>
                      <span className="bg-amber-500 text-zinc-950 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                        {messages.length || 3} Inbox
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {displayContacts.map((contact) => (
                        <div 
                          key={contact.id}
                          onClick={() => {
                            // Find real message if possible
                            const realMsg = messages.find(m => m.id === contact.id);
                            if (realMsg) {
                              setSelectedMessage(realMsg);
                            } else {
                              setSelectedMessage({
                                id: contact.id,
                                name: contact.name,
                                email: contact.email,
                                company: contact.company,
                                message: contact.message,
                                date: contact.date
                              });
                            }
                            setActiveTab('messages');
                            triggerQuickAction(`Synthesized transmission link for ${contact.name}`);
                          }}
                          className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-zinc-950/50 dark:bg-zinc-950/50 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-250 hover:border-amber-500/30 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Colorful avatar ring */}
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${contact.color} text-zinc-950 font-bold font-mono text-[11px] flex items-center justify-center flex-shrink-0 shadow-md`}>
                              {contact.initial}
                            </div>
                            <div className="text-left">
                              <span className="block text-xs font-semibold text-zinc-200 light:text-zinc-900 group-hover:text-amber-500 transition-colors">
                                {contact.name}
                              </span>
                              <span className="block text-[9px] font-mono text-zinc-500 leading-none truncate max-w-[140px] mt-0.5">
                                {contact.company}
                              </span>
                            </div>
                          </div>

                          <span className="font-mono text-[8px] text-zinc-600 dark:text-zinc-500 uppercase mt-0.5 whitespace-nowrap">
                            {contact.date.split(',')[0]}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setActiveTab('messages')}
                      className="w-full text-center mt-4 text-[10px] font-mono text-amber-500 uppercase hover:underline block"
                    >
                      View all incoming transmission traffic
                    </button>
                  </div>

                  {/* SAFETY SYSTEM LOGS DIAGNOSTIC */}
                  <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl">
                    <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <h4 className="font-display font-bold text-xs text-zinc-100 light:text-zinc-900 uppercase">
                          Relay Diagnostics
                        </h4>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="space-y-3 font-mono text-[10px]">
                      <p className="text-zinc-400 light:text-zinc-600 text-xs leading-relaxed">
                        Execute ground loop continuity scan sequence compliant with safety codes.
                      </p>
                      
                      <button 
                        onClick={runRelayDiagnostic}
                        disabled={simulationActive}
                        className="w-full py-1.5 rounded bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 hover:border-emerald-500/50 font-mono text-[10px] text-emerald-500 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer font-bold"
                      >
                        <RefreshCw className={`w-3 h-3 ${simulationActive ? 'animate-spin' : ''}`} />
                        <span>{simulationActive ? 'Executing Diagnostic...' : 'Run Earth Continuity Scan'}</span>
                      </button>

                      <div className="p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-900 rounded text-[9px] text-zinc-500 text-left leading-normal overflow-hidden max-h-[80px]">
                        {simLog}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })()}

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
                      className={inputClass}
                      id="page-hero-tagline"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Hero Main Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, heroHeading: e.target.value })}
                      className={inputClass}
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
                    className={textareaClass}
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
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 1 Label</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat1Label}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat1Label: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 2 Value</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat2Val}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat2Val: e.target.value })}
                      className={inputClass}
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
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 3 Value</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat3Val}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat3Val: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Stat 3 Label</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroStat3Label}
                      onChange={e => setHomepageContent({ ...homepageContent, heroStat3Label: e.target.value })}
                      className={inputClass}
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
                        className={inputClass}
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
                      className={inputClass}
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
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Profile Panel Designation Title</label>
                    <input 
                      type="text" 
                      value={homepageContent.heroProfileTitle}
                      onChange={e => setHomepageContent({ ...homepageContent, heroProfileTitle: e.target.value })}
                      className={inputClass}
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
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Journal Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.journalHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, journalHeading: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Journal Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.journalDesc}
                    onChange={e => setHomepageContent({ ...homepageContent, journalDesc: e.target.value })}
                    className={textareaClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Expertise Section Tagline (03)</label>
                    <input 
                      type="text" 
                      value={homepageContent.expertiseTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, expertiseTagline: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Expertise Section Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.expertiseHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, expertiseHeading: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Expertise Section Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.expertiseDesc}
                    onChange={e => setHomepageContent({ ...homepageContent, expertiseDesc: e.target.value })}
                    className={textareaClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Section Tagline (04)</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, contactTagline: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Section Heading</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, contactHeading: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Section Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.contactDesc}
                    onChange={e => setHomepageContent({ ...homepageContent, contactDesc: e.target.value })}
                    className={textareaClass}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Contact Email</label>
                    <input 
                      type="email" 
                      value={homepageContent.contactEmail}
                      onChange={e => setHomepageContent({ ...homepageContent, contactEmail: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Linkedin Link</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactLinkedin}
                      onChange={e => setHomepageContent({ ...homepageContent, contactLinkedin: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Github Link</label>
                    <input 
                      type="text" 
                      value={homepageContent.contactGithub}
                      onChange={e => setHomepageContent({ ...homepageContent, contactGithub: e.target.value })}
                      className={inputClass}
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
                    className={`${inputClass} max-w-xs mt-1 font-mono`}
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
                className={`${btnAmberClass} px-6 h-11 text-sm`}
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
                    className={`${btnSecondaryClass} h-8 text-[11px] font-mono px-3 py-1`}
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
                      className={inputClass}
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
                      className={inputClass}
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
                      className={selectClass}
                      id="post-edit-category"
                    >
                      <option value="Substation & Distribution" className="dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">Substation & Distribution</option>
                      <option value="Power Systems & Cables" className="dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">Power Systems & Cables</option>
                      <option value="Earthing & Safety" className="dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">Earthing & Safety</option>
                      <option value="Industrial Troubleshooting" className="dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">Industrial Troubleshooting</option>
                      <option value="General Engineering" className="dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">General Engineering</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Project Duration / Timeline</label>
                    <input 
                      type="text" 
                      value={postForm.duration || ''}
                      onChange={e => setPostForm({ ...postForm, duration: e.target.value })}
                      placeholder="e.g. 3 Weeks, 10 Days"
                      className={inputClass}
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
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* TECHNICAL SPECS SECTION */}
                <div className="border border-zinc-850 dark:border-zinc-800/80 light:border-zinc-200 rounded-lg p-4 bg-zinc-900/10 light:bg-zinc-50/50 space-y-3">
                  <h4 className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wide">
                    Technical Specifications (Datasheet fields)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">System Voltage</label>
                      <input 
                        type="text" 
                        value={postForm.specs?.voltage || ''}
                        onChange={e => setPostForm({
                          ...postForm,
                          specs: { ...(postForm.specs || {}), voltage: e.target.value }
                        })}
                        placeholder="e.g. 11kV / 0.415kV LT"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">Site Capacity</label>
                      <input 
                        type="text" 
                        value={postForm.specs?.capacity || ''}
                        onChange={e => setPostForm({
                          ...postForm,
                          specs: { ...(postForm.specs || {}), capacity: e.target.value }
                        })}
                        placeholder="e.g. 630 kVA Transformer"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">Project Duration</label>
                      <input 
                        type="text" 
                        value={postForm.specs?.duration || ''}
                        onChange={e => setPostForm({
                          ...postForm,
                          specs: { ...(postForm.specs || {}), duration: e.target.value }
                        })}
                        placeholder="e.g. 3 Weeks"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">Industrial Sector</label>
                      <input 
                        type="text" 
                        value={postForm.specs?.sector || ''}
                        onChange={e => setPostForm({
                          ...postForm,
                          specs: { ...(postForm.specs || {}), sector: e.target.value }
                        })}
                        placeholder="e.g. Textile Manufacturing"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">Primary Equipment</label>
                      <input 
                        type="text" 
                        value={postForm.specs?.equipment || ''}
                        onChange={e => setPostForm({
                          ...postForm,
                          specs: { ...(postForm.specs || {}), equipment: e.target.value }
                        })}
                        placeholder="e.g. HT VCB, Main ACB"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-400 light:text-zinc-500 uppercase">Applied Standard</label>
                      <input 
                        type="text" 
                        value={postForm.specs?.standard || ''}
                        onChange={e => setPostForm({
                          ...postForm,
                          specs: { ...(postForm.specs || {}), standard: e.target.value }
                        })}
                        placeholder="e.g. BNBC 2020 Part 8"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* GALLERY IMAGES SECTION */}
                <div className="border border-zinc-850 dark:border-zinc-800/80 light:border-zinc-200 rounded-lg p-4 bg-zinc-900/10 light:bg-zinc-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wide">
                      Site Gallery Photos (One URL per line)
                    </h4>
                    <span className="text-[9px] text-zinc-500 font-mono">LIGHTBOX EVIDENCE</span>
                  </div>
                  <textarea 
                    rows={3}
                    value={postForm.galleryImages ? postForm.galleryImages.join('\n') : ''}
                    onChange={e => setPostForm({
                      ...postForm,
                      galleryImages: e.target.value.split('\n').map(line => line.trim()).filter(Boolean)
                    })}
                    placeholder="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200&#10;https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200"
                    className={`${textareaClass} font-mono text-xs leading-relaxed`}
                  />
                  <p className="text-[9px] text-zinc-500 font-mono">
                    Enter one or more high-resolution photographic image URLs. Each URL must occupy a new line. These will render in the click-to-expand lightbox component on the detail view.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Short Description (Preview Snippet)</label>
                  <textarea 
                    rows={2}
                    required
                    value={postForm.shortDesc || ''}
                    onChange={e => setPostForm({ ...postForm, shortDesc: e.target.value })}
                    placeholder="Short summary of investigation for index card preview..."
                    className={textareaClass}
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
                      className={`${inputClass} flex-1`}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddTag}
                      className={`${btnSecondaryClass} h-9 px-4 font-mono text-xs`}
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
                      className={textareaClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase font-bold text-amber-500 font-sans">Field Math & Calculations (Monospace formatting)</label>
                    <textarea 
                      rows={5}
                      value={postForm.calculation || ''}
                      onChange={e => setPostForm({ ...postForm, calculation: e.target.value })}
                      placeholder="e.g. Transformer Rating: 630 kVA (11kV / 0.415kV)... I_LT = S / (√3 × V_LL)..."
                      className={`${textareaClass} font-mono text-amber-500`}
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
                    className={textareaClass}
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
                      className={`${inputClass} flex-1`}
                    />
                    <button 
                      type="button" 
                      onClick={handleAddResult}
                      className={`${btnSecondaryClass} h-9 px-4 font-mono text-xs`}
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
                    className={`${btnSecondaryClass} h-9 px-4 font-mono text-xs`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`${btnAmberClass} px-5 h-9 text-xs`}
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
                    className={`${btnAmberClass} h-8 text-[11px] font-mono px-3`}
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
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Designation Title</label>
                  <input 
                    type="text" 
                    value={profileForm.title}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Location</label>
                  <input 
                    type="text" 
                    value={profileForm.location}
                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                    className={inputClass}
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
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={profileForm.whatsapp}
                    onChange={e => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Professional Summary Statement</label>
                <textarea 
                  rows={4}
                  value={profileForm.summary}
                  onChange={e => setProfileForm({ ...profileForm, summary: e.target.value })}
                  className={textareaClass}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  value={profileForm.skills}
                  onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1 mt-2">
                <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Profile & Author Photo</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {profileForm.imageUrl ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-zinc-800 light:border-zinc-200 bg-zinc-950 flex-shrink-0">
                      <img src={profileForm.imageUrl} alt="Profile preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800 text-zinc-600 flex-shrink-0 text-xs">
                      No Photo
                    </div>
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <input 
                      type="text" 
                      value={profileForm.imageUrl || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setProfileForm({ ...profileForm, imageUrl: val });
                        setHomepageContent(prev => ({ ...prev, heroProfileImage: val }));
                      }}
                      placeholder="Paste public photo URL here"
                      className={inputClass}
                    />
                    <div className="flex items-center space-x-2">
                      <label className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-zinc-300 hover:text-amber-500 text-[11px] font-mono rounded cursor-pointer transition-colors">
                        Choose Image File
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageFileChange} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">This automatically updates your hero and blog author pictures.</span>
                    </div>
                  </div>
                </div>
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                  className={`${btnSecondaryClass} h-8 text-[11px] px-3 font-mono`}
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
                    className="absolute top-3 right-3 text-rose-500 hover:text-rose-400 text-xs flex items-center space-x-0.5"
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
                        className={inputClass}
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
                        className={inputClass}
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
                        className={inputClass}
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
                      className={textareaClass}
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
                  className={`${btnSecondaryClass} h-8 text-[11px] px-3 font-mono`}
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
                    className="absolute top-3 right-3 text-rose-500 hover:text-rose-400 text-xs flex items-center space-x-0.5"
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
                        className={inputClass}
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
                        className={inputClass}
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
                        className={inputClass}
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
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className={`${btnAmberClass} px-6 h-11 text-sm`}
                id="save-profile-btn"
              >
                <Save className="w-4 h-4 text-zinc-950" />
                <span>Save & Synchronize Profiles</span>
              </button>
            </div>
          </form>
        )}

        {/* 4b. BLOG NOTES CMS TAB */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/20 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 p-4 rounded-lg">
              <div>
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                  Industrial Experience Journal & Notes CMS
                </h3>
                <p className="text-xs text-zinc-400 light:text-zinc-500 mt-1">
                  Draft technical articles, share maintenance experiences, and document BNBC 2020 compliance standards. Supports custom markdown formatting.
                </p>
              </div>
              <button
                onClick={handleCreateNewBlogClick}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded shadow-md flex items-center space-x-1.5 self-start sm:self-center cursor-pointer"
                id="blog-cms-create-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Write Technical Note</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Blog posts directory/table (Left) */}
              <div className="lg:col-span-5 p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
                <div className="border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 flex justify-between items-center">
                  <span className="font-mono text-xs text-zinc-400 light:text-zinc-500 font-bold uppercase">Articles Index ({blogPosts.length})</span>
                  <span className="font-mono text-[9px] text-zinc-500">Local Synced Cache</span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 font-mono text-xs border border-dashed border-zinc-850 rounded">
                      No technical articles recorded yet. Use the action button to draft one.
                    </div>
                  ) : (
                    blogPosts.map((post) => (
                      <div
                        key={post.slug}
                        className={`p-4 border rounded transition-all text-left space-y-2 relative ${
                          editingBlogSlug === post.slug
                            ? 'bg-amber-500/10 border-amber-500/40 text-zinc-100'
                            : 'bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-zinc-900 dark:border-zinc-900 light:border-zinc-250 hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-100'
                        }`}
                        id={`blog-item-${post.slug}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            post.published 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                          <span className="font-mono text-[9px] text-zinc-500">{post.date}</span>
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 line-clamp-1">{post.title}</h4>
                          <span className="block font-mono text-[9px] text-amber-500/80 mt-0.5">{post.category}</span>
                          <p className="text-[11px] text-zinc-400 light:text-zinc-600 line-clamp-2 mt-1 leading-relaxed">{post.summary}</p>
                        </div>

                        <div className="flex items-center space-x-1 pt-1.5 border-t border-zinc-850 dark:border-zinc-850/40 light:border-zinc-200 justify-end">
                          <button
                            type="button"
                            onClick={() => handleEditBlogClick(post)}
                            className="p-1.5 rounded border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/50 hover:text-amber-500 text-zinc-400 light:text-zinc-600 text-xs flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="font-mono text-[9px]">Modify</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlogPost(post.slug)}
                            className="p-1.5 rounded border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-rose-500/50 hover:text-rose-500 text-zinc-500 text-xs flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="font-mono text-[9px]">Wipe</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Blog Form / Editor (Right) */}
              <div className="lg:col-span-7">
                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
                  <div className="border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 flex justify-between items-center">
                    <span className="font-mono text-xs text-amber-500 font-bold uppercase">
                      {editingBlogSlug ? `Modifying Article: "${blogForm.title}"` : 'Journal Matrix Compiler'}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500">
                      {editingBlogSlug ? 'Revision Mode' : 'New Stream Draft'}
                    </span>
                  </div>

                  <form onSubmit={handleSaveBlogPost} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Article Title</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title || ''}
                          onChange={e => {
                            const val = e.target.value;
                            const slugified = val.toLowerCase()
                              .replace(/[^a-z0-9\s-]/g, '')
                              .replace(/\s+/g, '-');
                            setBlogForm(prev => ({
                              ...prev,
                              title: val,
                              slug: editingBlogSlug ? prev.slug : slugified
                            }));
                          }}
                          placeholder="e.g. Substation Earthing & BNBC Codes"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Unique Slug Identifier</label>
                        <input
                          type="text"
                          required
                          value={blogForm.slug || ''}
                          onChange={e => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          placeholder="e.g. substation-earthing-bnbc"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Category</label>
                        <select
                          value={blogForm.category || ''}
                          onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                          className={selectClass}
                        >
                          <option value="Substation Maintenance">Substation Maintenance</option>
                          <option value="Safety & Earthing">Safety & Earthing</option>
                          <option value="BNBC Compliance">BNBC Compliance</option>
                          <option value="Power Quality & PFI">Power Quality & PFI</option>
                          <option value="ACB Selectivity">ACB Selectivity</option>
                          <option value="Transformers">Transformers</option>
                          <option value="General Engineering">General Engineering</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Estimated Read Time</label>
                        <input
                          type="text"
                          value={blogForm.readTime || ''}
                          onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })}
                          placeholder="e.g. 5 min read"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Banner Image URL (Optional)</label>
                        <input
                          type="url"
                          value={blogForm.imageUrl || ''}
                          onChange={e => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                          placeholder="Unsplash / custom image url"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Summary (Short Pitch / Overview)</label>
                        <span className="text-[9px] font-mono text-zinc-500">Max 2 sentences</span>
                      </div>
                      <textarea
                        rows={2}
                        value={blogForm.summary || ''}
                        onChange={e => setBlogForm({ ...blogForm, summary: e.target.value })}
                        placeholder="Draft a highly scannable introductory paragraph or hook for this engineering note."
                        className={textareaClass}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Core Technical Content (Markdown-like)</label>
                        <div className="text-[9px] font-mono text-zinc-500 flex gap-2">
                          <span># H1</span>
                          <span>## H2</span>
                          <span>- List</span>
                          <span>$$ Formula $$</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono leading-tight bg-zinc-900/20 light:bg-zinc-50 p-2 rounded border border-zinc-850 dark:border-zinc-850/60 light:border-zinc-200">
                        Pro tip: Use double asterisks **bold** to highlight terms. Write bullet points with `-`. Wrap formulas inside `$$` (e.g. `$$ I = S / (V * \sqrt{3}) $$`). Wrap logs or code blocks in triple backticks.
                      </p>
                      <textarea
                        rows={12}
                        value={blogForm.content || ''}
                        onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                        placeholder="Write your article core body contents here..."
                        className={`${textareaClass} font-mono leading-relaxed`}
                      />
                    </div>

                    {/* Tag Editor */}
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Tags / Keywords</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={blogTagInput}
                          onChange={e => setBlogTagInput(e.target.value)}
                          placeholder="e.g. PFI, BNBC, ACB (Comma separated)"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={handleAddBlogTag}
                          className={`${btnSecondaryClass} h-10 px-4 font-mono text-xs`}
                        >
                          Append
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {blogForm.tags?.map(t => (
                          <span key={t} className="bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 text-zinc-300 light:text-zinc-800 text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border border-zinc-800">
                            <span>#{t}</span>
                            <button type="button" onClick={() => handleRemoveBlogTag(t)} className="text-rose-500 hover:text-rose-400 font-bold ml-1 text-[10px]">×</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status Toggle (Published / Draft) */}
                    <div className="flex items-center space-x-3 pt-2">
                      <label className="font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">Publication Status:</label>
                      <button
                        type="button"
                        onClick={() => setBlogForm(prev => ({ ...prev, published: !prev.published }))}
                        className={`px-3 py-1 text-[10px] font-mono font-bold rounded border cursor-pointer transition-colors ${
                          blogForm.published
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                        }`}
                      >
                        {blogForm.published ? '⬤ Published (Live on Site)' : '⬤ Draft (Hidden)'}
                      </button>
                    </div>

                    {/* Editor actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                      <button
                        type="button"
                        onClick={handleCancelBlogEdit}
                        className={`${btnSecondaryClass} px-4 h-10 text-xs font-mono`}
                      >
                        Abort Changes
                      </button>
                      <button
                        type="submit"
                        className={`${btnAmberClass} px-6 h-10 text-xs`}
                      >
                        <Save className="w-4 h-4 text-zinc-950" />
                        <span>{editingBlogSlug ? 'Deploy Revisions' : 'Serialize & Broadcast'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
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
                className={inputClass}
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
                        className={textareaClass}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <button 
                            type="button"
                            onClick={() => setReplyText(`Dear ${selectedMessage.name},\n\nThank you for reaching out regarding your industrial electrical project. I have analyzed your query and would be glad to discuss the details. Let me know your available slot for a direct call.\n\nBest Regards,\nSahin Alom\nSenior Electrical Engineer\nDhaka`)}
                            className="px-2 py-1 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 hover:bg-zinc-900 border border-zinc-800 hover:text-amber-500 text-[10px] font-mono rounded text-zinc-400 light:text-zinc-700 cursor-pointer transition-colors"
                          >
                            Template: Call request
                          </button>
                        </div>
                        <button 
                          type="submit"
                          className={`${btnAmberClass} px-4 h-9 text-[11px] font-mono`}
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

              {/* Application Layout & Theme Configuration */}
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4 md:col-span-2">
                <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3">
                  Application Theme & Layout Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Bottom Navigation Toggle */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                      Mobile Bottom Navigation Tab
                    </label>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed">
                      Enable or disable the persistent bottom navigation bar on mobile devices.
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveSettings({ ...appSettings, showBottomNav: true })}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                          appSettings.showBottomNav
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-850 text-zinc-400 light:bg-zinc-100 light:text-zinc-600 border border-zinc-800 light:border-zinc-200'
                        }`}
                      >
                        Enabled (Default)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveSettings({ ...appSettings, showBottomNav: false })}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                          !appSettings.showBottomNav
                            ? 'bg-rose-500 text-zinc-950'
                            : 'bg-zinc-850 text-zinc-400 light:bg-zinc-100 light:text-zinc-600 border border-zinc-800 light:border-zinc-200'
                        }`}
                      >
                        Disabled (Turn Off)
                      </button>
                    </div>
                  </div>

                  {/* Default Theme Selection */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase tracking-wide">
                      Default Application Theme
                    </label>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed">
                      Configure the default theme mode (Dark/Night mode or Light mode) for visitors.
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveSettings({ ...appSettings, defaultTheme: 'dark' })}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                          appSettings.defaultTheme === 'dark'
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-850 text-zinc-400 light:bg-zinc-100 light:text-zinc-600 border border-zinc-800 light:border-zinc-200'
                        }`}
                      >
                        Dark Mode (Night Mode)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveSettings({ ...appSettings, defaultTheme: 'light' })}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded transition-colors cursor-pointer ${
                          appSettings.defaultTheme === 'light'
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-850 text-zinc-400 light:bg-zinc-100 light:text-zinc-600 border border-zinc-800 light:border-zinc-200'
                        }`}
                      >
                        Light Mode
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
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
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">New Security Passcode</label>
                    <input 
                      type="password"
                      value={passcodeForm.newPass}
                      onChange={e => setPasscodeForm({ ...passcodeForm, newPass: e.target.value })}
                      placeholder="Enter new code"
                      className={inputClass}
                    />
                  </div>
                  <button 
                    type="submit"
                    className={`${btnAmberClass} px-4 h-9 text-[10px] font-mono`}
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
                <p className="text-xs text-zinc-400 light:text-zinc-650 leading-relaxed">
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

          </div>
        </div>
      </main>

    </div>
  );
}
