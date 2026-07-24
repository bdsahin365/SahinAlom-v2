import React, { useState, useEffect, useRef } from 'react';
import { compressAndResizeImage, safeLocalStorageSetItem } from '../utils/imageUtils';
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
  CheckCircle,
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
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
  ChevronDown,
  ChevronUp,
  Sliders,
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
  ChevronsRight,
  ShoppingBag,
  Receipt,
  StickyNote,
  Printer,
  MessageCircle,
  MessageSquare,
  Filter,
  Check,
  CheckSquare,
  Square,
  UserPlus,
  FilePlus,
  PackagePlus,
  Share2,
  Download,
  User,
  Building2,
  Factory,
  Briefcase,
  Grid,
  List,
  FileSpreadsheet,
  Sparkles,
  RotateCcw,
  Smartphone,
  Monitor
} from 'lucide-react';
import { CASE_STUDIES, DEFAULT_HOMEPAGE_CONTENT, DEFAULT_PROFILE_DATA, INITIAL_ADMIN_STATS, DEFAULT_APP_SETTINGS, DEFAULT_BLOG_POSTS, DEFAULT_PRODUCTS, DEFAULT_CUSTOMERS, DEFAULT_ORDERS, DEFAULT_OFFICE_NOTES, DEFAULT_MAINTENANCE_LOGS, DEFAULT_QUICK_FIELD_NOTES } from '../data';
import { CaseStudy, HomepageContent, ProfileData, ContactMessage, AdminStats, AppSettings, BlogPost, ProductItem, Customer, OrderItem, OrderInvoice, OfficeNote, MaintenanceLog, QuickFieldNote, ELECTRICAL_CATEGORIES } from '../types';
import { QuickFieldNotesWidget } from './QuickFieldNotesWidget';

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

  // Role State (Admin vs Staff)
  const [userRole, setUserRole] = useState<'Admin' | 'Staff'>('Admin');

  // Sidebar Layout State (Mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'blog' | 'notes' | 'maintenance' | 'pages' | 'posts' | 'resume' | 'messages' | 'settings'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sahin_admin_active_tab');
      if (saved && ['dashboard', 'products', 'orders', 'customers', 'blog', 'notes', 'maintenance', 'pages', 'posts', 'resume', 'messages', 'settings'].includes(saved)) {
        return saved as any;
      }
    }
    return 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('sahin_admin_active_tab', activeTab);
  }, [activeTab]);

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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);

  // Business Data States (Md. Sahin Alom Operations)
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [orders, setOrders] = useState<OrderInvoice[]>(DEFAULT_ORDERS);
  const [officeNotes, setOfficeNotes] = useState<OfficeNote[]>(DEFAULT_OFFICE_NOTES);
  const [quickFieldNotes, setQuickFieldNotes] = useState<QuickFieldNote[]>(() => {
    const saved = localStorage.getItem('ee_quick_field_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_QUICK_FIELD_NOTES;
  });

  // Product Filter & Modal
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productStockFilter, setProductStockFilter] = useState<string>('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({
    name: '',
    category: 'Substation & Power Distribution',
    topPrice: undefined,
    middlePricePerFt: undefined,
    bottomPrice: undefined,
    unitPrice: undefined,
    unit: 'Service / Visit',
    stockStatus: 'Available'
  });

  // Customer Filter & Modal State
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSectorFilter, setCustomerSectorFilter] = useState<string>('All');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>('All');
  const [customerViewMode, setCustomerViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<Customer | null>(null);
  const [whatsAppModalCustomer, setWhatsAppModalCustomer] = useState<Customer | null>(null);
  const [customWaTemplate, setCustomWaTemplate] = useState<string>('inspection_report');
  const [customWaText, setCustomWaText] = useState<string>('');
  
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState<Partial<Customer>>({
    name: '',
    contactPerson: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    industrySector: 'Textile & RMG',
    substationCapacity: '',
    status: 'Active Client',
    notes: ''
  });

  // Order Filter, Modal & Invoice Print
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<OrderInvoice | null>(null);
  const [orderForm, setOrderForm] = useState<{
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    discount: number;
    paidAmount: number;
    notes: string;
    status: 'Completed' | 'Pending Due' | 'Processing' | 'Cancelled';
  }>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    discount: 0,
    paidAmount: 0,
    notes: '',
    status: 'Pending Due'
  });

  // Temp item row for Order Creation
  const [tempOrderItem, setTempOrderItem] = useState<{
    productId: string;
    variant: 'Top' | 'Middle' | 'Bottom' | 'General';
    quantity: number;
  }>({
    productId: '',
    variant: 'General',
    quantity: 1
  });

  // Office Note Modal & Filter
  const [notePriorityFilter, setNotePriorityFilter] = useState<string>('All');
  const [noteStatusFilter, setNoteStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Urgent'>('All');
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteAuthor, setQuickNoteAuthor] = useState('Engr. Sahin Alom');
  const [quickNotePriority, setQuickNotePriority] = useState<'Standard' | 'Urgent' | 'Normal'>('Standard');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState<Partial<OfficeNote>>({
    title: '',
    content: '',
    priority: 'Normal',
    author: 'Engr. Sahin Alom'
  });

  // Maintenance Log States & Filters
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('ee_maintenance_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_MAINTENANCE_LOGS;
  });
  const [maintenanceSearchQuery, setMaintenanceSearchQuery] = useState('');
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState<string>('All');
  const [maintenanceCategoryFilter, setMaintenanceCategoryFilter] = useState<string>('All');
  const [maintenanceSubTab, setMaintenanceSubTab] = useState<'equipment' | 'logbook'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sahin_admin_maint_subtab');
      if (saved && ['equipment', 'logbook'].includes(saved)) {
        return saved as any;
      }
    }
    return 'equipment';
  });

  useEffect(() => {
    localStorage.setItem('sahin_admin_maint_subtab', maintenanceSubTab);
  }, [maintenanceSubTab]);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [editingMaintenanceLog, setEditingMaintenanceLog] = useState<MaintenanceLog | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState<Partial<MaintenanceLog>>({
    equipmentName: '',
    equipmentIdTag: '',
    location: '',
    category: 'Transformer',
    status: 'Optimal',
    lastServiceDate: new Date().toISOString().slice(0, 10),
    nextInspectionDueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    technicianInCharge: 'Engr. Sahin Alom',
    priority: 'Routine',
    notes: ''
  });

  // Blog CMS Filter & View States
  const [blogSubView, setBlogSubView] = useState<'list' | 'editor'>('list');
  const [blogEditorTab, setBlogEditorTab] = useState<'write' | 'preview'>('write');
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('All');
  const [blogStatusFilter, setBlogStatusFilter] = useState<string>('All');
  const [blogPreviewMode, setBlogPreviewMode] = useState<boolean>(false);
  const [previewingBlogPost, setPreviewingBlogPost] = useState<BlogPost | null>(null);

  // Active editors / selectors
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);
  const [searchMessageQuery, setSearchMessageQuery] = useState('');
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // Homepage Editor UX States & SubTabs
  const [homepageSubTab, setHomepageSubTab] = useState<'hero' | 'stats' | 'media' | 'dailyCheck' | 'sections' | 'logo'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sahin_admin_homepage_subtab');
      if (saved && ['hero', 'stats', 'media', 'dailyCheck', 'sections', 'logo'].includes(saved)) {
        return saved as any;
      }
    }
    return 'hero';
  });

  useEffect(() => {
    localStorage.setItem('sahin_admin_homepage_subtab', homepageSubTab);
  }, [homepageSubTab]);
  const [logoIconSearch, setLogoIconSearch] = useState<string>('');

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
  const [isSlugEditedManually, setIsSlugEditedManually] = useState<boolean>(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');

  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: ELECTRICAL_CATEGORIES[0],
    date: '',
    readTime: '1 min read',
    summary: '',
    content: '',
    tags: [],
    imageUrl: '',
    published: true
  });
  const [blogTagInput, setBlogTagInput] = useState('');

  // Helper function to calculate estimated reading time automatically
  const calculateReadTime = (title?: string, summary?: string, content?: string) => {
    const fullText = `${title || ''} ${summary || ''} ${content || ''}`;
    const words = fullText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 130));
    return `${minutes} min read`;
  };

  // Helper function to slugify titles automatically while supporting Bangla titles
  const slugifyTitle = (text: string) => {
    if (!text) return '';
    const cleanLatin = text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    if (cleanLatin.length >= 2) {
      return cleanLatin;
    }
    const today = new Date().toISOString().slice(0, 10);
    const shortRandom = Math.floor(100 + Math.random() * 900);
    return `article-${today}-${shortRandom}`;
  };

  // Drag and Drop Image state & handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Img = await compressAndResizeImage(file, 1000, 1000, 0.78);
        setHomepageContent(prev => ({
          ...prev,
          heroProfileImage: base64Img
        }));
        setProfileForm(prev => ({
          ...prev,
          imageUrl: base64Img
        }));
        triggerQuickAction("Image optimized & loaded successfully.");
      } catch (err) {
        alert("Failed to process image file. Please try another file.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        const base64Img = await compressAndResizeImage(file, 1000, 1000, 0.78);
        setHomepageContent(prev => ({
          ...prev,
          heroProfileImage: base64Img
        }));
        setProfileForm(prev => ({
          ...prev,
          imageUrl: base64Img
        }));
        triggerQuickAction("Image dropped & optimized successfully.");
      } catch (err) {
        alert("Failed to process dropped image.");
      }
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

  const loadData = async () => {
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingSlugs = new Set(parsed.map(b => b.slug));
          const missingDefaults = DEFAULT_BLOG_POSTS.filter(d => !existingSlugs.has(d.slug));
          const merged = [...parsed, ...missingDefaults];
          setBlogPosts(merged);
          localStorage.setItem('sahin_blog_posts', JSON.stringify(merged));
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

    // Products Data
    const storedProds = localStorage.getItem('ee_products');
    if (storedProds) {
      try {
        const parsed = JSON.parse(storedProds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      localStorage.setItem('ee_products', JSON.stringify(DEFAULT_PRODUCTS));
      setProducts(DEFAULT_PRODUCTS);
    }

    // Customers Data
    const storedCusts = localStorage.getItem('ee_customers');
    if (storedCusts) {
      try {
        const parsed = JSON.parse(storedCusts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomers(parsed);
        } else {
          setCustomers(DEFAULT_CUSTOMERS);
        }
      } catch (e) {
        setCustomers(DEFAULT_CUSTOMERS);
      }
    } else {
      localStorage.setItem('ee_customers', JSON.stringify(DEFAULT_CUSTOMERS));
      setCustomers(DEFAULT_CUSTOMERS);
    }

    // Orders Data
    const storedOrders = localStorage.getItem('ee_orders');
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
        } else {
          setOrders(DEFAULT_ORDERS);
        }
      } catch (e) {
        setOrders(DEFAULT_ORDERS);
      }
    } else {
      localStorage.setItem('ee_orders', JSON.stringify(DEFAULT_ORDERS));
      setOrders(DEFAULT_ORDERS);
    }

    // Office Notes Data
    const storedNotes = localStorage.getItem('ee_office_notes');
    if (storedNotes) {
      try {
        const parsed = JSON.parse(storedNotes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOfficeNotes(parsed);
        } else {
          setOfficeNotes(DEFAULT_OFFICE_NOTES);
        }
      } catch (e) {
        setOfficeNotes(DEFAULT_OFFICE_NOTES);
      }
    } else {
      localStorage.setItem('ee_office_notes', JSON.stringify(DEFAULT_OFFICE_NOTES));
      setOfficeNotes(DEFAULT_OFFICE_NOTES);
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

    // Live MongoDB Fetch Synchronization
    try {
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const liveStats = await statsRes.json();
        setStats(liveStats);
        localStorage.setItem('sahin_admin_stats', JSON.stringify(liveStats));
      }
    } catch (e) {}

    try {
      const msgsRes = await fetch('/api/messages');
      if (msgsRes.ok) {
        const liveMsgs = await msgsRes.json();
        setMessages(liveMsgs);
        localStorage.setItem('sahin_portfolio_messages', JSON.stringify(liveMsgs));
      }
    } catch (e) {}

    try {
      const homeRes = await fetch('/api/homepage');
      if (homeRes.ok) {
        const liveHome = await homeRes.json();
        setHomepageContent(liveHome);
        localStorage.setItem('sahin_homepage_content', JSON.stringify(liveHome));
      }
    } catch (e) {}

    try {
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const liveProfile = await profileRes.json();
        setProfileForm(liveProfile);
        localStorage.setItem('sahin_profile_data', JSON.stringify(liveProfile));
      }
    } catch (e) {}

    try {
      const studiesRes = await fetch('/api/case-studies');
      if (studiesRes.ok) {
        const liveStudies = await studiesRes.json();
        setCaseStudies(liveStudies);
        localStorage.setItem('sahin_case_studies', JSON.stringify(liveStudies));
      }
    } catch (e) {}

    try {
      const blogsRes = await fetch('/api/blog-posts');
      if (blogsRes.ok) {
        const liveBlogs = await blogsRes.json();
        setBlogPosts(liveBlogs);
        localStorage.setItem('sahin_blog_posts', JSON.stringify(liveBlogs));
      }
    } catch (e) {}

    try {
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const liveSettings = await settingsRes.json();
        setAppSettings(liveSettings);
        localStorage.setItem('sahin_portfolio_settings', JSON.stringify(liveSettings));
      }
    } catch (e) {}
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

  const handleSaveSettings = async (updatedSettings: AppSettings) => {
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

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
    } catch (err) {
      console.warn("Failed to sync settings with MongoDB Atlas server:", err);
    }

    if (onSync) onSync();
    triggerQuickAction('Console parameters updated & integrated.');
  };

  // --- BUSINESS HANDLERS (Md. Sahin Alom Operations) ---

  // Product CRUD
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;
    let updated: ProductItem[];
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } as ProductItem : p);
      triggerQuickAction('Service / Equipment item updated successfully!');
    } else {
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        name: productForm.name || 'New Engineering Item',
        category: productForm.category || 'Substation & Power Distribution',
        imageUrl: productForm.imageUrl,
        topPrice: productForm.topPrice,
        middlePricePerFt: productForm.middlePricePerFt,
        bottomPrice: productForm.bottomPrice,
        unitPrice: productForm.unitPrice,
        unit: productForm.unit || 'Service / Visit',
        stockStatus: productForm.stockStatus || 'Available'
      };
      updated = [newProd, ...products];
      triggerQuickAction('New service / equipment item added successfully!');
    }
    setProducts(updated);
    safeLocalStorageSetItem('ee_products', JSON.stringify(updated));
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', category: 'Substation & Power Distribution', imageUrl: undefined, topPrice: undefined, middlePricePerFt: undefined, bottomPrice: undefined, unitPrice: undefined, unit: 'Service / Visit', stockStatus: 'Available' });
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    safeLocalStorageSetItem('ee_products', JSON.stringify(updated));
    triggerQuickAction('Product removed from catalog.');
  };

  const handleToggleStockStatus = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const isInStock = p.stockStatus === 'In Stock' || p.stockStatus === 'Available' || p.stockStatus === 'ইন স্টক';
        return {
          ...p,
          stockStatus: isInStock ? 'Out of Stock' : 'In Stock'
        } as ProductItem;
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('ee_products', JSON.stringify(updated));
    triggerQuickAction('Updated stock status!');
  };

  // Customer CRUD
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name) return;
    let updated: Customer[];
    const phoneClean = (customerForm.phone || '').replace(/\D/g, '');
    const waClean = customerForm.whatsapp ? customerForm.whatsapp.replace(/\D/g, '') : (phoneClean.startsWith('88') ? phoneClean : `88${phoneClean}`);

    if (editingCustomer) {
      updated = customers.map(c => c.id === editingCustomer.id ? {
        ...c,
        ...customerForm,
        whatsapp: waClean
      } as Customer : c);
      triggerQuickAction('Client profile updated successfully.');
    } else {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: customerForm.name || 'New Client',
        contactPerson: customerForm.contactPerson || '',
        phone: customerForm.phone || '',
        whatsapp: waClean,
        email: customerForm.email || '',
        address: customerForm.address || 'Dhaka, Bangladesh',
        industrySector: customerForm.industrySector || 'Textile & RMG',
        substationCapacity: customerForm.substationCapacity || '11kV Substation',
        status: customerForm.status || 'Active Client',
        notes: customerForm.notes || '',
        totalOrders: 0,
        totalSpent: 0,
        lastServiceDate: dateStr
      };
      updated = [newCust, ...customers];
      triggerQuickAction('New client profile added successfully.');
    }
    setCustomers(updated);
    localStorage.setItem('ee_customers', JSON.stringify(updated));
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
    setCustomerForm({
      name: '',
      contactPerson: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      industrySector: 'Textile & RMG',
      substationCapacity: '',
      status: 'Active Client',
      notes: ''
    });
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    localStorage.setItem('ee_customers', JSON.stringify(updated));
    triggerQuickAction('Client profile deleted successfully.');
  };

  // Order CRUD & Items
  const handleAddTempOrderItem = () => {
    if (!tempOrderItem.productId) return;
    const prod = products.find(p => p.id === tempOrderItem.productId);
    if (!prod) return;

    let pricePerUnit = 0;
    let nameVariant = prod.name;

    if (tempOrderItem.variant === 'Top') {
      pricePerUnit = prod.topPrice || prod.unitPrice || 0;
      nameVariant += ' (Top Section)';
    } else if (tempOrderItem.variant === 'Middle') {
      pricePerUnit = prod.middlePricePerFt || prod.unitPrice || 0;
      nameVariant += ' (Middle Section)';
    } else if (tempOrderItem.variant === 'Bottom') {
      pricePerUnit = prod.bottomPrice || prod.unitPrice || 0;
      nameVariant += ' (Bottom Base)';
    } else {
      pricePerUnit = prod.unitPrice || prod.topPrice || 0;
    }

    const newItem: OrderItem = {
      productId: prod.id,
      productName: nameVariant,
      variant: tempOrderItem.variant,
      quantity: Number(tempOrderItem.quantity) || 1,
      unit: tempOrderItem.variant === 'Middle' ? 'Running Feet' : prod.unit,
      pricePerUnit,
      totalPrice: pricePerUnit * (Number(tempOrderItem.quantity) || 1)
    };

    setOrderForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleRemoveOrderItem = (idx: number) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName || orderForm.items.length === 0) {
      alert('Please enter a client name and add at least 1 service item.');
      return;
    }

    const subtotal = orderForm.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = Number(orderForm.discount) || 0;
    const grandTotal = Math.max(0, subtotal - discount);
    const paidAmount = Number(orderForm.paidAmount) || 0;
    const dueAmount = Math.max(0, grandTotal - paidAmount);

    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const newOrder: OrderInvoice = {
      id: `ord-${Date.now()}`,
      invoiceNo: `EE-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone || 'N/A',
      customerAddress: orderForm.customerAddress || 'N/A',
      date: dateStr,
      items: orderForm.items,
      subtotal,
      discount,
      grandTotal,
      paidAmount,
      dueAmount,
      status: dueAmount === 0 ? 'Completed' : (orderForm.status || 'Pending Due'),
      createdRole: userRole,
      notes: orderForm.notes
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('ee_orders', JSON.stringify(updated));
    triggerQuickAction(`New work order & invoice generated (${newOrder.invoiceNo})!`);
    setIsOrderModalOpen(false);
    setSelectedInvoice(newOrder); // Auto open invoice preview!
    setOrderForm({ customerName: '', customerPhone: '', customerAddress: '', items: [], discount: 0, paidAmount: 0, notes: '', status: 'Pending Due' });
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('ee_orders', JSON.stringify(updated));
    triggerQuickAction('Invoice record deleted successfully.');
  };

  // Office Note CRUD
  const handleSaveOfficeNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title) return;
    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const newNote: OfficeNote = {
      id: `note-${Date.now()}`,
      title: noteForm.title,
      content: noteForm.content || '',
      date: dateStr,
      priority: noteForm.priority || 'Normal',
      isCompleted: false,
      author: noteForm.author || (userRole === 'Admin' ? 'Engr. Sahin Alom' : 'Maintenance Staff')
    };

    const updated = [newNote, ...officeNotes];
    setOfficeNotes(updated);
    localStorage.setItem('ee_office_notes', JSON.stringify(updated));
    triggerQuickAction('New maintenance task added to logbook!');
    setIsNoteModalOpen(false);
    setNoteForm({ title: '', content: '', priority: 'Normal', author: 'Engr. Sahin Alom' });
  };

  const handleQuickSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteTitle.trim()) return;
    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const newNote: OfficeNote = {
      id: `note-${Date.now()}`,
      title: quickNoteTitle.trim(),
      content: `Operational dispatch recorded by ${quickNoteAuthor} on ${dateStr}. System status logged.`,
      date: dateStr,
      priority: quickNotePriority,
      isCompleted: false,
      author: quickNoteAuthor
    };

    const updated = [newNote, ...officeNotes];
    setOfficeNotes(updated);
    localStorage.setItem('ee_office_notes', JSON.stringify(updated));
    triggerQuickAction(`Field note logged by ${quickNoteAuthor}!`);
    setQuickNoteTitle('');
  };

  const handleToggleOfficeNote = (id: string) => {
    const updated = officeNotes.map(n => n.id === id ? { ...n, isCompleted: !n.isCompleted } : n);
    setOfficeNotes(updated);
    localStorage.setItem('ee_office_notes', JSON.stringify(updated));
  };

  const handleDeleteOfficeNote = (id: string) => {
    const updated = officeNotes.filter(n => n.id !== id);
    setOfficeNotes(updated);
    localStorage.setItem('ee_office_notes', JSON.stringify(updated));
    triggerQuickAction('Note removed from logbook.');
  };

  // Field Note Conversion Handlers
  const handleConvertFieldNoteToBlog = (note: QuickFieldNote) => {
    const slug = (note.title || 'field-note')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setBlogForm({
      title: note.title,
      slug: slug || `field-note-${Date.now()}`,
      summary: note.content.slice(0, 150) + '...',
      content: `## ${note.title}\n\n**Technical Category:** ${note.category}\n**Equipment/Site Tag:** ${note.equipmentTag || 'Industrial Site'}\n**Field Inspection Date:** ${note.createdAt}\n**Logged By:** ${note.author}\n\n### 🔍 Field Inspection Findings\n${note.content}\n\n### 🛠️ Engineering Verification & Standard Compliance\nInspected and tested on-site according to **BNBC 2020 Part 8** and **IEC electrical safety directives**. All readings verified for operational reliability.`,
      author: note.author,
      date: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      category: note.category,
      tags: [note.category, note.equipmentTag || 'Field Note', 'On-Site Inspection'],
      imageUrl: '',
      published: true
    });
    setEditingBlogSlug(null);
    setActiveTab('blog');
    triggerQuickAction(`Converted Field Note to Blog draft! Opened Blog Publishing CMS.`);
  };

  const handleConvertFieldNoteToCaseStudy = (note: QuickFieldNote) => {
    const slug = (note.title || 'case-study')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setPostForm({
      title: note.title,
      slug: slug || `case-study-${Date.now()}`,
      category: note.category,
      tags: [note.category, note.equipmentTag || 'Field Inspection', 'BNBC Compliance'],
      shortDesc: note.content.slice(0, 150) + '...',
      problem: `On-site field observation recorded during technical inspection:\n"${note.content}"`,
      calculation: `Field Diagnostics & Parameters:\n- Category: ${note.category}\n- Asset Tag: ${note.equipmentTag || 'Site Unit'}\n- Logged Date: ${note.createdAt}`,
      solution: `Engineering diagnostic, contact cleaning, and relay parameter verification performed on-site by ${note.author}.`,
      results: [
        'Ensured full electrical safety & BNBC compliance.',
        'Prevented potential power disruptions or thermal hotspotting.',
        'Recorded in digital site logbook for maintenance tracking.'
      ],
      duration: '1 Day Field Inspection',
      specs: {
        voltage: '11kV / 415V LT',
        capacity: 'Field Inspection Unit',
        duration: '1 Day',
        equipment: note.equipmentTag || 'Switchgear / Substation',
        standard: 'BNBC 2020 Part 8',
        sector: note.category
      }
    });
    setEditingPostSlug(null);
    setActiveTab('posts');
    triggerQuickAction(`Converted Field Note to Case Study draft! Opened Case Study Editor.`);
  };

  // Maintenance Log CRUD Handlers
  const handleOpenNewMaintenanceModal = () => {
    setEditingMaintenanceLog(null);
    const today = new Date().toISOString().slice(0, 10);
    const nextDueDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setMaintenanceForm({
      equipmentName: '',
      equipmentIdTag: '',
      location: '',
      category: 'Transformer',
      status: 'Optimal',
      lastServiceDate: today,
      nextInspectionDueDate: nextDueDate,
      technicianInCharge: userRole === 'Admin' ? 'Engr. Sahin Alom' : 'Maintenance Staff',
      priority: 'Routine',
      notes: ''
    });
    setIsMaintenanceModalOpen(true);
  };

  const handleOpenEditMaintenanceModal = (log: MaintenanceLog) => {
    setEditingMaintenanceLog(log);
    setMaintenanceForm({ ...log });
    setIsMaintenanceModalOpen(true);
  };

  const handleSaveMaintenanceLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceForm.equipmentName || !maintenanceForm.equipmentIdTag) {
      alert('Please provide Equipment Name and Identification Tag.');
      return;
    }

    let updatedList: MaintenanceLog[];
    if (editingMaintenanceLog) {
      updatedList = maintenanceLogs.map(item => item.id === editingMaintenanceLog.id ? {
        ...item,
        ...maintenanceForm
      } as MaintenanceLog : item);
      triggerQuickAction(`Updated equipment record for ${maintenanceForm.equipmentName}`);
    } else {
      const newLog: MaintenanceLog = {
        id: `maint-${Date.now()}`,
        equipmentName: maintenanceForm.equipmentName || 'Equipment',
        equipmentIdTag: maintenanceForm.equipmentIdTag || 'TAG-00',
        location: maintenanceForm.location || 'Substation Yard',
        category: maintenanceForm.category || 'Transformer',
        status: maintenanceForm.status || 'Optimal',
        lastServiceDate: maintenanceForm.lastServiceDate || new Date().toISOString().slice(0, 10),
        nextInspectionDueDate: maintenanceForm.nextInspectionDueDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        technicianInCharge: maintenanceForm.technicianInCharge || 'Engr. Sahin Alom',
        priority: maintenanceForm.priority || 'Routine',
        notes: maintenanceForm.notes || ''
      };
      updatedList = [newLog, ...maintenanceLogs];
      triggerQuickAction(`Logged new maintenance entry for ${newLog.equipmentName}`);
    }

    setMaintenanceLogs(updatedList);
    localStorage.setItem('ee_maintenance_logs', JSON.stringify(updatedList));
    setIsMaintenanceModalOpen(false);
  };

  const handleQuickMarkServiced = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const nextDue = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const updatedList = maintenanceLogs.map(item => {
      if (item.id === id) {
        return {
          ...item,
          lastServiceDate: today,
          nextInspectionDueDate: nextDue,
          status: 'Optimal' as const
        };
      }
      return item;
    });
    setMaintenanceLogs(updatedList);
    localStorage.setItem('ee_maintenance_logs', JSON.stringify(updatedList));
    triggerQuickAction('Equipment marked as Serviced Today (+180 Days Inspection reset & Status set to Optimal).');
  };

  const handleDeleteMaintenanceLog = (id: string) => {
    const updatedList = maintenanceLogs.filter(item => item.id !== id);
    setMaintenanceLogs(updatedList);
    localStorage.setItem('ee_maintenance_logs', JSON.stringify(updatedList));
    triggerQuickAction('Maintenance log deleted successfully.');
  };

  // Blog Publishing Toggle
  const handleToggleBlogPublished = async (slug: string) => {
    const updated = blogPosts.map(p => p.slug === slug ? { ...p, published: !p.published } : p);
    setBlogPosts(updated);
    localStorage.setItem('sahin_blog_posts', JSON.stringify(updated));
    triggerQuickAction('Article publication status updated.');
    try {
      await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn("Failed to sync blog status:", err);
    }
  };


  const handleResetFactoryDefaults = async () => {
    if (window.confirm('Are you absolutely sure you want to reset all custom text, posts, blogs, and CV records to factory defaults? This is non-reversible.')) {
      localStorage.removeItem('sahin_homepage_content');
      localStorage.removeItem('sahin_profile_data');
      localStorage.removeItem('sahin_case_studies');
      localStorage.removeItem('sahin_blog_posts');
      localStorage.removeItem('sahin_portfolio_messages');
      localStorage.removeItem('sahin_admin_stats');
      localStorage.removeItem('sahin_portfolio_settings');
      localStorage.removeItem('sahin_portfolio_theme');

      try {
        await fetch('/api/reset-factory-defaults', { method: 'POST' });
      } catch (err) {
        console.warn("Failed to reset live MongoDB Atlas database:", err);
      }

      await loadData();
      if (onSync) onSync();
      triggerQuickAction('System cleared. Default Electrical Engineering portfolio values loaded from database.');
    }
  };

  // Homepage Editor handles
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    safeLocalStorageSetItem('sahin_homepage_content', JSON.stringify(homepageContent));

    try {
      await fetch('/api/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageContent)
      });
    } catch (err) {
      console.warn("Failed to sync homepage with MongoDB Atlas server:", err);
    }

    if (onSync) onSync();
    triggerQuickAction('Homepage sections serialized & deployed successfully! Live on site.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CV Profile Editor handles
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    safeLocalStorageSetItem('sahin_profile_data', JSON.stringify(profileForm));

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
    } catch (err) {
      console.warn("Failed to sync profile with MongoDB Atlas server:", err);
    }

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
  const handleSavePost = async (e: React.FormEvent) => {
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
    safeLocalStorageSetItem('sahin_case_studies', JSON.stringify(updatedList));

    try {
      await fetch('/api/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
    } catch (err) {
      console.warn("Failed to sync case studies with MongoDB Atlas server:", err);
    }

    if (onSync) onSync();
    
    // Clear / Reset Editor
    handleCancelPostEdit();
  };

  const handleDeletePost = async (slug: string) => {
    const updatedList = caseStudies.filter(item => item.slug !== slug);
    setCaseStudies(updatedList);
    safeLocalStorageSetItem('sahin_case_studies', JSON.stringify(updatedList));

    try {
      await fetch('/api/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
    } catch (err) {
      console.warn("Failed to sync case study deletion with MongoDB Atlas server:", err);
    }

    if (onSync) onSync();
    triggerQuickAction('Case study deleted successfully.');
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
  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.category) {
      alert('Title, slug, and category are required fields.');
      return;
    }

    // Auto-calculate read time based on word count
    const autoReadTime = calculateReadTime(blogForm.title, blogForm.summary, blogForm.content);

    // Register custom category if new
    if (blogForm.category && !customCategories.includes(blogForm.category)) {
      setCustomCategories(prev => [...prev, blogForm.category!]);
    }

    let updatedList = [...blogPosts];
    // Autofill date if not set
    const finalDate = blogForm.date || new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
    const finalForm = { ...blogForm, date: finalDate, readTime: autoReadTime } as BlogPost;

    if (editingBlogSlug) {
      // Edit
      updatedList = updatedList.map(item => item.slug === editingBlogSlug ? finalForm : item);
      triggerQuickAction(`ব্লগ নিবন্ধ "${blogForm.title}" ও ছবি ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে!`);
    } else {
      // Check duplicate slug
      if (blogPosts.some(item => item.slug === blogForm.slug)) {
        alert('Slug already exists. Please choose a unique URL slug.');
        return;
      }
      // Create new
      updatedList.unshift(finalForm);
      triggerQuickAction(`নতুন ব্লগ নিবন্ধ "${blogForm.title}" ও ছবি ডাটাবেজে সফলভাবে প্রকাশিত হয়েছে!`);
    }

    setBlogPosts(updatedList);
    safeLocalStorageSetItem('sahin_blog_posts', JSON.stringify(updatedList));

    try {
      await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
    } catch (err) {
      console.warn("Failed to sync blog posts with MongoDB Atlas server:", err);
    }

    if (onSync) onSync();
    
    handleCancelBlogEdit();
  };

  const handleDeleteBlogPost = async (slug: string) => {
    const updatedList = blogPosts.filter(item => item.slug !== slug);
    setBlogPosts(updatedList);
    safeLocalStorageSetItem('sahin_blog_posts', JSON.stringify(updatedList));

    try {
      await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
    } catch (err) {
      console.warn("Failed to sync blog post deletion with MongoDB Atlas server:", err);
    }

    if (onSync) onSync();
    triggerQuickAction('Blog article deleted successfully.');
  };

  const handleEditBlogClick = (post: BlogPost) => {
    setEditingBlogSlug(post.slug);
    setIsSlugEditedManually(true); // Preserve existing post slug unless edited
    setIsAddingCategory(false);
    setBlogForm({ ...post });
    setBlogTagInput(post.tags ? post.tags.join(', ') : '');
    setBlogEditorTab('write');
    setBlogSubView('editor');
  };

  const handleCreateNewBlogClick = () => {
    setEditingBlogSlug(null);
    setIsSlugEditedManually(false); // Enable auto slug from title
    setIsAddingCategory(false);
    setNewCategoryInput('');
    const initialTitle = '';
    const initialSummary = '';
    const initialContent = '';
    setBlogForm({
      title: initialTitle,
      slug: '',
      category: ELECTRICAL_CATEGORIES[0],
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: calculateReadTime(initialTitle, initialSummary, initialContent),
      summary: initialSummary,
      content: initialContent,
      tags: ['Electrical', 'BNBC', 'Substation'],
      imageUrl: '',
      published: true
    });
    setBlogTagInput('');
    setBlogEditorTab('write');
    setBlogSubView('editor');
  };

  const handleCancelBlogEdit = () => {
    setEditingBlogSlug(null);
    setBlogSubView('list');
  };

  const insertBlogFormatting = (snippet: string) => {
    setBlogForm(prev => ({
      ...prev,
      content: (prev.content || '') + (prev.content ? '\n\n' : '') + snippet
    }));
  };

  const contentImageInputRef = useRef<HTMLInputElement | null>(null);

  const handleInsertBlogContentImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressAndResizeImage(file, 950, 650, 0.75);
        const imgTitle = file.name.replace(/\.[^/.]+$/, "") || "Diagram";
        const markdownImg = `\n\n![${imgTitle}](${compressedBase64})\n\n`;
        setBlogForm(prev => ({
          ...prev,
          content: (prev.content || '') + markdownImg
        }));
        triggerQuickAction('Article body image attached! Click "Save Changes / Publish Article" to store permanently in MongoDB Atlas database.');
      } catch (err) {
        alert('Failed to process article content image.');
      } finally {
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleBlogBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressAndResizeImage(file, 1000, 650, 0.75);
        setBlogForm(prev => ({ ...prev, imageUrl: compressedBase64 }));
        triggerQuickAction('Banner cover image attached! Click "Save Changes / Publish Article" to store permanently in MongoDB Atlas database.');
      } catch (err) {
        alert('Failed to process blog banner image.');
      }
    }
  };

  const handlePostBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressAndResizeImage(file, 1200, 800, 0.78);
        setPostForm(prev => ({ ...prev, imageUrl: compressedBase64 }));
        triggerQuickAction('Case study banner cover image optimized & uploaded successfully.');
      } catch (err) {
        alert('Failed to process case study image.');
      }
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressAndResizeImage(file, 1000, 1000, 0.78);
        setProductForm(prev => ({ ...prev, imageUrl: compressedBase64 }));
        triggerQuickAction('Product item photo optimized & uploaded successfully.');
      } catch (err) {
        alert('Failed to process product image.');
      }
    }
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
  const handleDeleteMessage = async (id: string) => {
    const filtered = messages.filter(msg => msg.id !== id);
    setMessages(filtered);
    localStorage.setItem('sahin_portfolio_messages', JSON.stringify(filtered));
    
    // Update counts
    const updatedStats = { ...stats, contactRequests: Math.max(0, stats.contactRequests - 1) };
    setStats(updatedStats);
    localStorage.setItem('sahin_admin_stats', JSON.stringify(updatedStats));

    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Failed to delete message from MongoDB Atlas server:", err);
    }

    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    triggerQuickAction('Message deleted successfully.');
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
            <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-zinc-950 text-xs">
              <Zap className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
            </div>
            <div>
              <span className="block font-display font-bold text-xs text-zinc-100 light:text-zinc-900 tracking-tight">Engineer Console</span>
              <span className="block text-[8px] font-mono text-zinc-500 uppercase">Power Systems & Automation</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Operational Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Services & Equipment', icon: ShoppingBag },
            { id: 'orders', label: 'Work Orders & Invoices', icon: Receipt, badge: orders.filter(o => o.status === 'Pending Due').length },
            { id: 'maintenance', label: 'Maintenance & Operations', icon: Wrench, badge: maintenanceLogs.filter(m => m.status === 'Critical / Overdue' || m.status === 'Requires Attention').length + officeNotes.filter(n => !n.isCompleted).length },
            { id: 'customers', label: 'Industrial Clients', icon: Users, badge: customers.length },
            { id: 'blog', label: 'Technical Articles (CMS)', icon: BookOpen, badge: blogPosts.length },
            { id: 'pages', label: 'Homepage Editor', icon: FileText },
            { id: 'messages', label: 'Inquiries Inbox', icon: Inbox, badge: messages.length },
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
                  <span className="font-sans text-[11px] font-medium">{item.label}</span>
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
              <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Engr. Sahin Alom</span>
              <span className="block text-[8px] font-mono text-zinc-500">Dhaka, Bangladesh</span>
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
            <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-zinc-950 flex-shrink-0">
              <Zap className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            </div>
            {!isSidebarCollapsed && (
              <div className="animate-fade-in">
                <span className="block font-display font-bold text-xs text-zinc-100 light:text-zinc-900 tracking-tight whitespace-nowrap">Engineer Console</span>
                <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Power Systems & Automation</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation block */}
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Operational Dashboard', desc: 'System stats & live metrics', icon: LayoutDashboard },
            { id: 'products', label: 'Services & Equipment', desc: 'Substations, cables & audits', icon: ShoppingBag },
            { id: 'orders', label: 'Work Orders & Invoices', desc: 'A4 Memos & client billing', icon: Receipt, badge: orders.filter(o => o.status === 'Pending Due').length },
            { id: 'maintenance', label: 'Maintenance & Operations', desc: 'Equipment status & field logbook', icon: Wrench, badge: maintenanceLogs.filter(m => m.status === 'Critical / Overdue' || m.status === 'Requires Attention').length + officeNotes.filter(n => !n.isCompleted).length },
            { id: 'customers', label: 'Industrial Clients', desc: 'Factory directory & contacts', icon: Users, badge: customers.length },
            { id: 'blog', label: 'Technical Articles', desc: 'Engineering field journals', icon: BookOpen, badge: blogPosts.length },
            { id: 'pages', label: 'Homepage Editor', desc: 'Website content & banners', icon: FileText },
            { id: 'messages', label: 'Inquiries Inbox', desc: 'Client consultation forms', icon: Inbox, badge: messages.length },
            { id: 'settings', label: 'Console Settings', desc: 'Roles, security & database', icon: SettingsIcon }
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-2 rounded text-left transition-all group cursor-pointer border ${
                  isActive 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 font-semibold' 
                    : 'border-transparent text-zinc-400 light:text-zinc-650 hover:text-zinc-100 light:hover:text-zinc-900 hover:bg-zinc-850/30 light:hover:bg-zinc-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-400 light:group-hover:text-zinc-700'}`} />
                  {!isSidebarCollapsed && (
                    <div className="animate-fade-in">
                      <span className="block text-[11px] font-medium leading-tight">{item.label}</span>
                      <span className="block text-[9px] font-mono text-zinc-500 truncate max-w-[130px]">{item.desc}</span>
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
                  <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Engr. Sahin Alom</span>
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
              <span className="text-zinc-500 font-semibold">Engr. Sahin Alom</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-amber-500 font-bold capitalize">
                {activeTab === 'dashboard' ? 'Operational Dashboard' : 
                 activeTab === 'products' ? 'Services & Equipment Catalog' : 
                 activeTab === 'orders' ? 'Work Orders & Service Invoices' : 
                 activeTab === 'maintenance' ? 'Equipment Maintenance Log' : 
                 activeTab === 'customers' ? 'Industrial Clients Directory' : 
                 activeTab === 'blog' ? 'Technical Publications & CMS' : 
                 activeTab === 'notes' ? 'Field Maintenance Logbook' : 
                 activeTab === 'pages' ? 'Homepage Content Editor' : 
                 activeTab === 'messages' ? 'Inquiries Inbox' : 'Console Settings'}
              </span>
            </div>
          </div>

          {/* Center Section: Role Switcher & Date */}
          <div className="hidden lg:flex items-center space-x-3 mx-4">
            <div className="flex items-center bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 p-0.5 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
              <button
                onClick={() => setUserRole('Admin')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  userRole === 'Admin' 
                    ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Lead Engineer (Admin)
              </button>
              <button
                onClick={() => setUserRole('Staff')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  userRole === 'Staff' 
                    ? 'bg-amber-500 text-zinc-950 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Maintenance Staff
              </button>
            </div>
          </div>

          {/* Right section: System Status, Mode Switcher, Portfolio Link, Avatar */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Substation active indicator */}
            <div className="hidden sm:flex items-center space-x-2 bg-zinc-900/30 dark:bg-zinc-900/30 light:bg-zinc-100 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400 light:text-zinc-600">GRID FREQUENCY: 50.02 HZ</span>
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
              title="Return to public portfolio website"
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
                <span className="block text-xs font-semibold text-zinc-300 light:text-zinc-800">Engr. Sahin Alom</span>
                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Dhaka, BD</span>
              </div>
            </div>

          </div>

        </header>

        {/* MOBILE-FIRST QUICK TASK SWITCHER BAR */}
        <div className="md:hidden bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-10">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', icon: Receipt, badge: orders.length },
            { id: 'products', label: 'Catalog', icon: ShoppingBag, badge: products.length },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: maintenanceLogs.filter(m => m.status === 'Critical / Overdue' || m.status === 'Requires Attention').length },
            { id: 'customers', label: 'Clients', icon: Building2, badge: customers.length },
            { id: 'notes', label: 'Logbook', icon: StickyNote, badge: officeNotes.filter(n => !n.isCompleted).length },
            { id: 'pages', label: 'Editor', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: SettingsIcon }
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'bg-zinc-900/80 dark:bg-zinc-900 light:bg-white text-zinc-400 light:text-zinc-700 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* WORKSPACE MAIN SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <div className="max-w-7xl mx-auto w-full pb-10 space-y-4">
            
            {/* Title banner inside the work area */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-4 gap-4">
              <div>
                <span className="font-mono text-[9px] text-amber-500 uppercase tracking-widest block font-extrabold">
                  ENGR. SAHIN ALOM — PERSONAL PORTFOLIO & CONSULTANCY CONSOLE
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight mt-0.5 capitalize">
                  {activeTab === 'dashboard' ? 'Operational Dashboard' : 
                   activeTab === 'products' ? 'Services & Equipment Catalog' : 
                   activeTab === 'orders' ? 'Work Orders & Invoices' : 
                   activeTab === 'maintenance' ? 'Equipment Maintenance & Inspection Log' : 
                   activeTab === 'customers' ? 'Industrial Clients Directory' : 
                   activeTab === 'blog' ? 'Technical Publications & Journal CMS' : 
                   activeTab === 'notes' ? 'Field Maintenance Logbook' : 
                   activeTab === 'pages' ? 'Homepage Content Editor' : 
                   activeTab === 'messages' ? 'Inquiries Inbox & Contacts' : 'Console System Settings'}
                </h1>
              </div>
            </div>

            {/* TAB WORKSPACE CONTENT SWITCHER */}
            {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && (() => {
          // Compute summary stats from real state arrays
          const totalOrdersCount = orders.length;
          const completedOrders = orders.filter(o => o.status === 'Completed').length;
          const pendingOrders = orders.filter(o => o.status === 'Pending Due' || o.status === 'Processing').length;
          const totalRevenue = orders.reduce((sum, o) => sum + (o.netTotal || 0), 0);

          const totalEquipmentCount = maintenanceLogs.length;
          const equipmentDue = maintenanceLogs.filter(m => m.status === 'Maintenance Due' || m.status === 'Under Maintenance' || m.status === 'Inspection Overdue').length;

          const totalCustomersCount = customers.length;
          const activeCustomersCount = customers.filter(c => c.status === 'Active Client' || c.status === 'VIP Client').length;

          const totalMessagesCount = messages.length;

          return (
            <div className="space-y-4 sm:space-y-6 animate-fade-in text-left">
              
              {/* TOP MOBILE-FIRST GREETING & STATUS BANNER */}
              <div className="p-4 sm:p-5 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <h2 className="text-base sm:text-lg font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 leading-snug">
                        Operational Control — Engr. Md. Sahin Alom
                      </h2>
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-650 font-sans">
                      Industrial Electrical Substation & Power Distribution Consultancy
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      ● SYSTEM NORMAL
                    </span>
                    <span className="px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 text-zinc-400">
                      DHAKA, BD
                    </span>
                  </div>
                </div>

                {/* Mobile Quick Navigation Shortcuts */}
                <div className="pt-2 border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 flex flex-wrap gap-2 text-xs font-mono">
                  <button
                    onClick={() => {
                      setOrderForm({
                        customerName: '',
                        customerPhone: '',
                        customerAddress: '',
                        items: [],
                        discount: 0,
                        paidAmount: 0,
                        notes: '',
                        status: 'Pending Due'
                      });
                      setIsOrderModalOpen(true);
                      setActiveTab('orders');
                    }}
                    className="px-3 py-2 sm:py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] sm:min-h-[auto]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Order / Invoice</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 light:text-zinc-800 hover:border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] sm:min-h-[auto]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                    <span>Work Orders ({totalOrdersCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className="px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 light:text-zinc-800 hover:border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] sm:min-h-[auto]"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Equipment ({totalEquipmentCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('customers')}
                    className="px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 light:text-zinc-800 hover:border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] sm:min-h-[auto]"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>Clients ({totalCustomersCount})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 text-zinc-300 light:text-zinc-800 hover:border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px] sm:min-h-[auto]"
                  >
                    <Inbox className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inquiries ({totalMessagesCount})</span>
                  </button>
                </div>
              </div>

              {/* 4 CORE KPI STAT CARDS GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Work Orders & Revenue */}
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="p-3.5 sm:p-4 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 hover:border-amber-500/50 rounded-xl transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                      Work Orders
                    </span>
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-extrabold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 font-mono">
                      ৳{totalRevenue.toLocaleString()}
                    </span>
                    <span className="block text-[11px] font-mono text-zinc-400 mt-0.5">
                      {completedOrders} Done | <span className="text-amber-400 font-semibold">{pendingOrders} Pending</span>
                    </span>
                  </div>
                </div>

                {/* 2. Maintenance Status */}
                <div 
                  onClick={() => setActiveTab('maintenance')}
                  className="p-3.5 sm:p-4 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 hover:border-amber-500/50 rounded-xl transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                      Equipment Log
                    </span>
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                      <Wrench className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-extrabold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 font-mono">
                      {totalEquipmentCount} Units
                    </span>
                    <span className="block text-[11px] font-mono text-zinc-400 mt-0.5">
                      {equipmentDue > 0 ? (
                        <span className="text-rose-400 font-bold">{equipmentDue} Service Due</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">All Operational</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* 3. Clients Directory */}
                <div 
                  onClick={() => setActiveTab('customers')}
                  className="p-3.5 sm:p-4 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 hover:border-amber-500/50 rounded-xl transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                      Industrial Clients
                    </span>
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-extrabold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 font-mono">
                      {totalCustomersCount} Directory
                    </span>
                    <span className="block text-[11px] font-mono text-zinc-400 mt-0.5">
                      {activeCustomersCount} Active Retainers
                    </span>
                  </div>
                </div>

                {/* 4. Inquiries Inbox */}
                <div 
                  onClick={() => setActiveTab('messages')}
                  className="p-3.5 sm:p-4 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 hover:border-amber-500/50 rounded-xl transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
                      Inquiries Inbox
                    </span>
                    <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                      <Inbox className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-extrabold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 font-mono">
                      {totalMessagesCount} Messages
                    </span>
                    <span className="block text-[11px] font-mono text-amber-400 font-semibold mt-0.5">
                      Direct Consultations
                    </span>
                  </div>
                </div>

              </div>

              {/* COMPACT VOICE & FIELD NOTES WIDGET */}
              <QuickFieldNotesWidget
                fieldNotes={quickFieldNotes}
                setFieldNotes={setQuickFieldNotes}
                triggerQuickAction={triggerQuickAction}
                onConvertToBlog={handleConvertFieldNoteToBlog}
                onConvertToCaseStudy={handleConvertFieldNoteToCaseStudy}
              />

              {/* REAL DATA OVERVIEW PANELS (2 COLUMNS) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
                
                {/* RECENT WORK ORDERS PANEL */}
                <div className="p-4 sm:p-5 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
                    <h3 className="text-xs font-mono font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-500" />
                      <span>Recent Work Orders ({orders.length})</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-[11px] font-mono text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs font-mono text-zinc-500 text-center py-4">No work orders recorded yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          className="p-3 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5 text-left">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900">
                                {order.invoiceNo || order.id}
                              </span>
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                                order.status === 'Completed' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : order.status === 'Pending Due'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 dark:text-zinc-300 light:text-zinc-800 font-semibold truncate max-w-[220px]">
                              {order.customerName}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500">
                              {order.date}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                            <span className="font-mono text-sm font-bold text-amber-400">
                              ৳{(order.netTotal || 0).toLocaleString()}
                            </span>
                            {order.customerPhone && (
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1 transition-colors"
                                title="Contact via WhatsApp"
                              >
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* EQUIPMENT MAINTENANCE LOGS & RECENT INQUIRIES */}
                <div className="space-y-4">
                  
                  {/* Equipment Maintenance Panel */}
                  <div className="p-4 sm:p-5 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
                      <h3 className="text-xs font-mono font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-amber-500" />
                        <span>Equipment Inspection Status</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('maintenance')}
                        className="text-[11px] font-mono text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Logbook</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {maintenanceLogs.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 rounded-lg flex items-center justify-between gap-2"
                        >
                          <div className="space-y-0.5 text-left">
                            <span className="font-mono text-xs font-bold text-zinc-200 dark:text-zinc-200 light:text-zinc-900 block">
                              {item.equipmentName}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 block">
                              {item.category} • {item.location}
                            </span>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                            item.status === 'Operational' || item.status === 'Pass'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Inquiries Transmissions */}
                  <div className="p-4 sm:p-5 bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
                      <h3 className="text-xs font-mono font-bold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-amber-500" />
                        <span>Client Inquiries ({messages.length})</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-[11px] font-mono text-amber-500 hover:underline cursor-pointer"
                      >
                        Inbox
                      </button>
                    </div>

                    {messages.length === 0 ? (
                      <p className="text-xs font-mono text-zinc-500 text-center py-2">No incoming messages.</p>
                    ) : (
                      <div className="space-y-2">
                        {messages.slice(0, 2).map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => {
                              setSelectedMessage(msg);
                              setActiveTab('messages');
                            }}
                            className="p-2.5 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 rounded-lg hover:border-amber-500/40 cursor-pointer transition-colors space-y-1 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-amber-400">{msg.name}</span>
                              <span className="font-mono text-[9px] text-zinc-500">{msg.date}</span>
                            </div>
                            <p className="text-xs text-zinc-300 dark:text-zinc-300 light:text-zinc-700 line-clamp-1 font-mono">
                              {msg.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          );
        })()}

        {/* 2. PRODUCTS & PRICING TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl shadow-sm">
              <div>
                <div className="flex items-center space-x-2 text-xs text-zinc-500 font-mono mb-1">
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <span>{products.length} Equipment & Service Rates Documented</span>
                </div>
                <h2 className="text-xl font-display font-extrabold text-zinc-100 light:text-zinc-900">
                  Engineering Services & Equipment Catalog
                </h2>
                <p className="text-xs text-zinc-400 light:text-zinc-600 mt-0.5">
                  Manage substation equipment, transformer installations, HT/LT cable lines, and safety audit rate charts.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', category: 'Substation & Power Equipment', topPrice: undefined, middlePricePerFt: undefined, bottomPrice: undefined, unitPrice: undefined, unit: 'Job / Unit', stockStatus: 'In Stock' });
                  setIsProductModalOpen(true);
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Equipment / Service Item</span>
              </button>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="p-4 bg-zinc-900/30 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search equipment, cables, transformers, or service..."
                    value={productSearchQuery}
                    onChange={e => setProductSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-lg pl-9 pr-8 py-2 text-xs text-zinc-100 light:text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  {productSearchQuery && (
                    <button
                      onClick={() => setProductSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Stock Status Filter Dropdown */}
                <div className="flex items-center space-x-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 w-full md:w-auto">
                  <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-xs font-mono text-zinc-400 font-medium whitespace-nowrap">Stock:</span>
                  <select
                    value={productStockFilter}
                    onChange={e => setProductStockFilter(e.target.value)}
                    className="bg-transparent text-xs text-zinc-200 light:text-zinc-900 font-semibold focus:outline-none cursor-pointer w-full md:w-auto"
                  >
                    <option value="All" className="bg-zinc-900 text-zinc-100">All Stock Statuses</option>
                    <option value="In Stock" className="bg-zinc-900 text-zinc-100">In Stock / Available</option>
                    <option value="Out of Stock" className="bg-zinc-900 text-zinc-100">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Quick Horizontal Category Pills */}
              <div className="flex items-center gap-1.5 pt-2.5 border-t border-zinc-850/60 dark:border-zinc-850/60 light:border-zinc-100 overflow-x-auto no-scrollbar pb-0.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0 mr-1">Category:</span>
                {['All', 'Substation & Power Equipment', 'Cables & Conductors', 'Transformers & Switchgear', 'Protection & Relay Panels'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      productCategoryFilter === cat
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter(p => {
                  const matchCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
                  const matchSearch = !productSearchQuery || p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || (p.category && p.category.toLowerCase().includes(productSearchQuery.toLowerCase()));
                  const isInStock = p.stockStatus === 'In Stock' || p.stockStatus === 'Available' || p.stockStatus === 'ইন স্টক';
                  const matchStock = productStockFilter === 'All' || (productStockFilter === 'In Stock' ? isInStock : !isInStock);
                  return matchCategory && matchSearch && matchStock;
                })
                .map(product => {
                  const isInStock = product.stockStatus === 'In Stock' || product.stockStatus === 'Available' || product.stockStatus === 'ইন স্টক';
                  return (
                    <div key={product.id} className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-3 relative group hover:border-amber-500/40 transition-all shadow-sm flex flex-col justify-between">
                      <div className="space-y-2.5">
                        {/* Top Product Image Thumbnail if uploaded */}
                        {product.imageUrl && (
                          <div className="w-full h-32 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        )}

                        {/* Top Metadata Header */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider block">
                              {product.category || 'General Service'}
                            </span>
                            <h3 className="text-sm font-bold text-zinc-100 light:text-zinc-900 mt-1 leading-snug">
                              {product.name}
                            </h3>
                          </div>
                          
                          {/* Stock Status Badge */}
                          <div className="shrink-0">
                            <span className={`inline-flex items-center space-x-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border ${
                              isInStock
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 light:bg-emerald-50 light:text-emerald-700'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30 light:bg-rose-50 light:text-rose-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                              <span>{isInStock ? 'In Stock' : 'Out of Stock'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Pillar / Multi-tier Pricing Breakdown */}
                        {(product.topPrice || product.middlePricePerFt || product.bottomPrice) ? (
                          <div className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 p-3 rounded-lg border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 text-xs font-mono space-y-1.5">
                            {product.topPrice ? (
                              <div className="flex justify-between text-zinc-300 light:text-zinc-800">
                                <span className="text-zinc-400">Top Terminal Cap:</span>
                                <span className="text-amber-500 font-bold">৳ {product.topPrice} / Piece</span>
                              </div>
                            ) : null}
                            {product.middlePricePerFt ? (
                              <div className="flex justify-between text-zinc-300 light:text-zinc-800">
                                <span className="text-zinc-400">Middle Span Rate:</span>
                                <span className="text-amber-500 font-bold">৳ {product.middlePricePerFt} / Foot</span>
                              </div>
                            ) : null}
                            {product.bottomPrice ? (
                              <div className="flex justify-between text-zinc-300 light:text-zinc-800">
                                <span className="text-zinc-400">Base Foundation:</span>
                                <span className="text-amber-500 font-bold">৳ {product.bottomPrice} / Piece</span>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 p-3 rounded-lg border border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 text-xs font-mono flex justify-between items-center">
                            <span className="text-zinc-400 light:text-zinc-600">Unit Price ({product.unit || 'Job'}):</span>
                            <span className="text-amber-500 font-bold text-sm">৳ {product.unitPrice ? product.unitPrice.toLocaleString('en-US') : 0}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Controls & Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-100 mt-2">
                        {/* Toggle Stock Quick Button */}
                        <button
                          onClick={() => handleToggleStockStatus(product.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center space-x-1.5 border ${
                            isInStock
                              ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}
                          title="Click to toggle stock status"
                        >
                          <Check className="w-3 h-3 text-amber-500" />
                          <span className="text-[11px]">{isInStock ? 'Mark Out of Stock' : 'Mark In Stock'}</span>
                        </button>

                        <div className="flex items-center space-x-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setProductForm(product);
                              setIsProductModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors text-xs flex items-center justify-center cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. ORDERS & CASH MEMO INVOICE TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl">
              <div>
                <h2 className="text-base font-bold text-zinc-100 light:text-zinc-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-500" />
                  <span>Work Orders & A4 Service Invoices</span>
                </h2>
                <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1">
                  Generate A4 printable work orders, billing statements, and engineering service invoices.
                </p>
              </div>
              <button
                onClick={() => {
                  setOrderForm({ customerName: '', customerPhone: '', customerAddress: '', items: [], discount: 0, paidAmount: 0, notes: '', status: 'Due' });
                  setIsOrderModalOpen(true);
                }}
                className={btnAmberClass}
              >
                <Plus className="w-4 h-4" />
                <span>+ New Work Order & Invoice</span>
              </button>
            </div>

            {/* Filter Status Tabs */}
            <div className="flex items-center space-x-2 border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pb-2 overflow-x-auto">
              {['All', 'Due', 'Completed', 'Processing', 'Cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                    orderStatusFilter === st || (st === 'All' && orderStatusFilter === 'All')
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm' 
                      : 'bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 text-zinc-400 light:text-zinc-700 hover:text-zinc-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders - Mobile Cards & Desktop Table */}
            <div className="space-y-4">
              {/* MOBILE CARDS VIEW (md:hidden) */}
              <div className="grid grid-cols-1 gap-3.5 md:hidden">
                {orders
                  .filter(o => orderStatusFilter === 'All' || orderStatusFilter === 'All' || o.status === orderStatusFilter)
                  .map(order => {
                    const isPaidInFull = (order.dueAmount || 0) <= 0;
                    return (
                      <div key={order.id} className="p-4 bg-zinc-900/60 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-3 shadow-sm text-left">
                        {/* Header: Invoice No & Status */}
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-100">
                          <div className="flex items-center space-x-2">
                            <Receipt className="w-4 h-4 text-amber-500" />
                            <span className="font-mono font-extrabold text-sm text-amber-500">{order.invoiceNo}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">({order.date})</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            order.status === 'Completed' || order.status === 'সম্পন্ন'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 light:bg-emerald-50 light:text-emerald-700'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 light:bg-rose-50 light:text-rose-700'
                          }`}>
                            {order.status === 'সম্পন্ন' ? 'Completed' : order.status === 'বকেয়া' ? 'Due' : order.status}
                          </span>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-zinc-100 light:text-zinc-900">
                            {order.customerName}
                          </h4>
                          {order.customerPhone && (
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-amber-400 font-mono"
                            >
                              <Phone className="w-3 h-3 text-amber-500" />
                              <span>{order.customerPhone}</span>
                            </a>
                          )}
                          {order.customerAddress && (
                            <p className="text-[11px] text-zinc-400 light:text-zinc-600 line-clamp-1">
                              📍 {order.customerAddress}
                            </p>
                          )}
                        </div>

                        {/* Items Summary pill */}
                        {order.items && order.items.length > 0 && (
                          <div className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 p-2.5 rounded-lg border border-zinc-800/80 light:border-zinc-200 text-xs space-y-1">
                            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Line Items ({order.items.length}):</span>
                            <p className="text-xs text-zinc-300 light:text-zinc-800 font-medium line-clamp-2">
                              {order.items.map(i => i.productName).join(' • ')}
                            </p>
                          </div>
                        )}

                        {/* Financial Amounts Breakdown Grid */}
                        <div className="grid grid-cols-3 gap-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-2.5 rounded-lg border border-zinc-800/80 light:border-zinc-200 text-xs font-mono">
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Total</span>
                            <span className="font-bold text-zinc-200 light:text-zinc-900">৳ {(order.grandTotal || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Paid</span>
                            <span className="font-bold text-emerald-400">৳ {(order.paidAmount || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 block uppercase">Due</span>
                            <span className={`font-bold ${isPaidInFull ? 'text-zinc-500' : 'text-rose-400'}`}>
                              ৳ {(order.dueAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Card Action Controls */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800 dark:border-zinc-800 light:border-zinc-100">
                          <button
                            onClick={() => setSelectedInvoice(order)}
                            className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg shadow flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View & Print A4 Memo</span>
                          </button>

                          {order.customerPhone && (
                            <a
                              href={`https://wa.me/88${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Greetings from Engr. Md. Sahin Alom. Your work order invoice #${order.invoiceNo} is ready. Total: BDT ${order.grandTotal}, Paid: BDT ${order.paidAmount}, Due: BDT ${order.dueAmount}. Thank you!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono flex items-center space-x-1 cursor-pointer shrink-0"
                              title="Send WhatsApp Memo Update"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Notify</span>
                            </a>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors shrink-0 cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* DESKTOP TABLE VIEW (hidden on mobile, visible md:block) */}
              <div className="hidden md:block bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 uppercase border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                      <tr>
                        <th className="p-3">Invoice No</th>
                        <th className="p-3">Client & Contact</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Received</th>
                        <th className="p-3">Pending Due</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 dark:divide-zinc-850 light:divide-zinc-200">
                      {orders
                        .filter(o => orderStatusFilter === 'All' || orderStatusFilter === 'All' || o.status === orderStatusFilter)
                        .map(order => (
                          <tr key={order.id} className="hover:bg-zinc-850/30 dark:hover:bg-zinc-850/30 light:hover:bg-zinc-50 transition-colors">
                            <td className="p-3 font-bold text-amber-500">{order.invoiceNo}</td>
                            <td className="p-3 font-sans">
                              <span className="block font-bold text-zinc-100 light:text-zinc-900">{order.customerName}</span>
                              <span className="block text-[10px] text-zinc-400 light:text-zinc-600 font-mono">{order.customerPhone}</span>
                            </td>
                            <td className="p-3 text-zinc-400 light:text-zinc-600">{order.date}</td>
                            <td className="p-3 font-bold text-zinc-200 light:text-zinc-900">৳ {(order.grandTotal || 0).toLocaleString()}</td>
                            <td className="p-3 text-emerald-500 font-bold">৳ {(order.paidAmount || 0).toLocaleString()}</td>
                            <td className="p-3 font-bold">
                              {(order.dueAmount || 0) > 0 ? (
                                <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded font-bold">৳ {(order.dueAmount || 0).toLocaleString()}</span>
                              ) : (
                                <span className="text-emerald-500">৳ 0</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.status === 'Completed' || order.status === 'সম্পন্ন' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              }`}>
                                {order.status === 'সম্পন্ন' ? 'Completed' : order.status === 'বকেয়া' ? 'Due' : order.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => setSelectedInvoice(order)}
                                className="px-2.5 py-1 rounded bg-amber-500 text-zinc-950 font-bold text-[10px] hover:bg-amber-400 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                              >
                                <Printer className="w-3 h-3" />
                                <span>A4 Invoice</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CUSTOMERS DIRECTORY TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* TOP HEADER BANNER & STATS */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>Industrial Clients & Facility Directory</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold">
                          {customers.length} Facility Accounts
                        </span>
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Directory of factory plant engineers, substation specifications, and direct WhatsApp communication channels.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      const csvHeader = "ID,Company Name,Contact Person,Phone,WhatsApp,Email,Address,Industry Sector,Substation Capacity,Status,Total Orders,Total Spent (BDT)\n";
                      const csvRows = customers.map(c => 
                        `"${c.id}","${c.name}","${c.contactPerson || ''}","${c.phone}","${c.whatsapp}","${c.email || ''}","${c.address}","${c.industrySector || ''}","${c.substationCapacity || ''}","${c.status || ''}","${c.totalOrders || 0}","${c.totalSpent || 0}"`
                      ).join("\n");
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Engineers_Enterprise_Industrial_Clients_${new Date().toISOString().slice(0,10)}.csv`;
                      a.click();
                      triggerQuickAction('Client directory exported successfully.');
                    }}
                    className={`${btnSecondaryClass} hidden sm:inline-flex`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingCustomer(null);
                      setCustomerForm({
                        name: '',
                        contactPerson: '',
                        phone: '',
                        whatsapp: '',
                        email: '',
                        address: '',
                        industrySector: 'Textile & RMG',
                        substationCapacity: '',
                        status: 'Active Client',
                        notes: ''
                      });
                      setIsCustomerModalOpen(true);
                    }}
                    className={btnAmberClass}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add New Client</span>
                  </button>
                </div>
              </div>

              {/* QUICK METRIC CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-850">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase font-bold block">TOTAL INDUSTRIAL PLANTS</span>
                  <div className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">{customers.length} Factories</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">100% Verified Sites</span>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-850">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase font-bold block">ACTIVE CONTRACTS / SITES</span>
                  <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                    {customers.filter(c => c.status === 'Active Client' || c.status === 'On-Going Contract').length} Sites
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Active Service Agreements</span>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-850">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase font-bold block">TOTAL INVOICE VALUE</span>
                  <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ৳ {customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Service Billing History</span>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-850">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase font-bold block">COVERED GRID SUBSTATIONS</span>
                  <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">11kV / 33kV</div>
                  <span className="text-[10px] text-zinc-500 font-mono">BNBC & IEC Compliant</span>
                </div>
              </div>
            </div>

            {/* SEARCH & FILTER TOOLBAR */}
            <div className="bg-white dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-850 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search by company name, engineer, phone, substation, or location..."
                    value={customerSearchQuery}
                    onChange={e => setCustomerSearchQuery(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>

                {/* Grid vs Table View Mode Switcher */}
                <div className="flex items-center space-x-1.5 self-end md:self-auto flex-shrink-0">
                  <button
                    onClick={() => setCustomerViewMode('grid')}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      customerViewMode === 'grid'
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                    title="Grid Card View"
                  >
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>

                  <button
                    onClick={() => setCustomerViewMode('table')}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      customerViewMode === 'table'
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                    }`}
                    title="Table List View"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">Table</span>
                  </button>
                </div>
              </div>

              {/* FILTER PILLS FOR INDUSTRY SECTORS & STATUS */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 overflow-x-auto pb-1">
                {/* Sector Pills */}
                <div className="flex items-center space-x-1.5 flex-nowrap">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 flex items-center gap-1 mr-1 flex-shrink-0">
                    <Filter className="w-3 h-3" />
                    <span>Sector:</span>
                  </span>
                  {['All', 'Textile & RMG', 'Pharmaceuticals', 'Steel & Heavy Metal', 'Power & Energy', 'Commercial Complex'].map(sec => (
                    <button
                      key={sec}
                      onClick={() => setCustomerSectorFilter(sec)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                        customerSectorFilter === sec
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {sec === 'All' ? 'All Sectors' : sec}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-1.5 flex-nowrap flex-shrink-0">
                  <span className="text-[11px] font-mono font-bold text-zinc-500 mr-1 hidden sm:inline">Status:</span>
                  <select
                    value={customerStatusFilter}
                    onChange={e => setCustomerStatusFilter(e.target.value)}
                    className="h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-[11px] font-mono px-2 text-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active Client">Active Client</option>
                    <option value="On-Going Contract">On-Going Contract</option>
                    <option value="Lead / Inquiry">Lead / Inquiry</option>
                    <option value="Completed Site">Completed Site</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CUSTOMER LIST: GRID OR TABLE */}
            {(() => {
              const filteredCusts = customers.filter(c => {
                const matchesSearch = 
                  c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                  (c.contactPerson && c.contactPerson.toLowerCase().includes(customerSearchQuery.toLowerCase())) ||
                  c.phone.includes(customerSearchQuery) ||
                  c.address.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                  (c.substationCapacity && c.substationCapacity.toLowerCase().includes(customerSearchQuery.toLowerCase()));

                const matchesSector = customerSectorFilter === 'All' || c.industrySector === customerSectorFilter;
                const matchesStatus = customerStatusFilter === 'All' || c.status === customerStatusFilter;

                return matchesSearch && matchesSector && matchesStatus;
              });

              if (filteredCusts.length === 0) {
                return (
                  <div className="text-center py-12 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-3 shadow-sm">
                    <Users className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
                    <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">No industrial clients found matching your selected criteria.</p>
                    <button
                      onClick={() => {
                        setCustomerSearchQuery('');
                        setCustomerSectorFilter('All');
                        setCustomerStatusFilter('All');
                      }}
                      className={btnSecondaryClass}
                    >
                      Reset Filters
                    </button>
                  </div>
                );
              }

              if (customerViewMode === 'grid') {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCusts.map(customer => {
                      const isOptionActive = customer.status === 'Active Client' || customer.status === 'On-Going Contract';
                      return (
                        <div
                          key={customer.id}
                          className="p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3.5 hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all shadow-sm hover:shadow-md text-left relative flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex justify-between items-start gap-2 border-b border-zinc-100 dark:border-zinc-800/70 pb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold flex items-center justify-center font-mono text-base flex-shrink-0 shadow-inner">
                                  {customer.name.slice(0, 1)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-1" title={customer.name}>
                                    {customer.name}
                                  </h3>
                                  {customer.contactPerson ? (
                                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1 mt-0.5">
                                      <span className="flex items-center gap-1"><User className="w-3 h-3 text-zinc-400 inline" /><span>{customer.contactPerson}</span></span>
                                    </span>
                                  ) : (
                                    <span className="text-xs font-mono text-zinc-500">{customer.phone}</span>
                                  )}
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 flex-shrink-0 border ${
                                customer.status === 'Active Client'
                                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                  : customer.status === 'On-Going Contract'
                                  ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isOptionActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                                <span>{customer.status || 'Active Client'}</span>
                              </span>
                            </div>

                            {/* Tech Specs Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              {customer.industrySector && (
                                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] font-bold border border-zinc-200 dark:border-zinc-700">
                                  {customer.industrySector}
                                </span>
                              )}

                              {customer.substationCapacity && (
                                <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-amber-500" />
                                  <span>{customer.substationCapacity}</span>
                                </span>
                              )}
                            </div>

                            {/* Location & Contact Info */}
                            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-sans">
                              <div className="flex items-start space-x-1.5">
                                <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-2 text-xs">{customer.address}</span>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.name + ' ' + customer.address)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-amber-600 dark:text-amber-400 hover:underline text-[10px] font-mono flex-shrink-0"
                                  title="Google Maps direction"
                                >
                                  [Map]
                                </a>
                              </div>

                              <div className="flex items-center justify-between text-xs font-mono pt-1">
                                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-zinc-400" />
                                  {customer.phone}
                                </span>
                                {customer.email && (
                                  <a href={`mailto:${customer.email}`} className="text-zinc-500 hover:text-amber-500 text-[11px] truncate max-w-[140px]">
                                    {customer.email}
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Service Stats */}
                            <div className="grid grid-cols-2 gap-2 p-2 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-850 text-xs font-mono">
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Work Orders</span>
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{customer.totalOrders || 0} Invoices</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-zinc-500 block">Total Invoiced</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳ {(customer.totalSpent || 0).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Technical Notes Callout */}
                            {customer.notes && (
                              <p className="text-[11px] bg-amber-50/50 dark:bg-zinc-950/80 text-zinc-700 dark:text-zinc-300 p-2.5 rounded-xl border border-amber-200/50 dark:border-zinc-800 leading-relaxed italic">
                                "{customer.notes}"
                              </p>
                            )}
                          </div>

                          {/* Action Buttons Bar */}
                          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-1.5 mt-2">
                            {/* WhatsApp Preset Modal Launcher */}
                            <button
                              onClick={() => {
                                setWhatsAppModalCustomer(customer);
                                setCustomWaTemplate('inspection_report');
                                setCustomWaText(`Dear Sir, Greetings from Engr. Md. Sahin Alom regarding substation maintenance and safety inspection support for ${customer.name}.`);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold font-mono flex items-center space-x-1 transition-colors shadow-sm cursor-pointer"
                              title="1-Click WhatsApp Message Builder"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            {/* Direct Call */}
                            <a
                              href={`tel:${customer.phone}`}
                              className="px-2.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-[11px] font-bold font-mono flex items-center space-x-1 transition-colors cursor-pointer"
                              title="Call Client Direct"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-500" />
                              <span>Call</span>
                            </a>

                            {/* Client Dossier Modal */}
                            <button
                              onClick={() => setSelectedCustomerDetail(customer)}
                              className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-[11px] font-bold font-mono transition-colors cursor-pointer"
                              title="View Full Client Profile & Orders History"
                            >
                              <span>Profile</span>
                            </button>

                            {/* Edit & Delete */}
                            <div className="flex items-center space-x-0.5">
                              <button
                                onClick={() => {
                                  setEditingCustomer(customer);
                                  setCustomerForm(customer);
                                  setIsCustomerModalOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-amber-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Edit Customer Details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="p-1.5 text-zinc-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              // Table View
              return (
                <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 font-mono text-[11px] uppercase text-zinc-500 dark:text-zinc-400">
                        <tr>
                          <th className="p-3.5">Company / Facility</th>
                          <th className="p-3.5">Contact Person</th>
                          <th className="p-3.5">Sector & Capacity</th>
                          <th className="p-3.5">Location</th>
                          <th className="p-3.5">Phone & Email</th>
                          <th className="p-3.5">Total Invoiced</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
                        {filteredCusts.map(customer => (
                          <tr key={customer.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{customer.name}</div>
                              <span className="text-[10px] font-mono text-zinc-500">ID: {customer.id}</span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-zinc-800 dark:text-zinc-200">{customer.contactPerson || 'N/A'}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="space-y-0.5">
                                <span className="inline-block px-2 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] font-bold">
                                  {customer.industrySector || 'Textile & RMG'}
                                </span>
                                {customer.substationCapacity && (
                                  <span className="block text-[10px] font-mono text-amber-600 dark:text-amber-400">
                                    {customer.substationCapacity}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5 max-w-[180px]">
                              <span className="line-clamp-2 text-zinc-600 dark:text-zinc-300">{customer.address}</span>
                            </td>
                            <td className="p-3.5 font-mono text-[11px]">
                              <div>{customer.phone}</div>
                              {customer.email && <div className="text-[10px] text-zinc-500">{customer.email}</div>}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              ৳ {(customer.totalSpent || 0).toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                customer.status === 'Active Client'
                                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border-zinc-200'
                              }`}>
                                {customer.status || 'Active'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setWhatsAppModalCustomer(customer);
                                  setCustomWaTemplate('inspection_report');
                                  setCustomWaText(`Dear Sir, Greetings from Engr. Md. Sahin Alom regarding substation maintenance and safety inspection support for ${customer.name}.`);
                                }}
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold font-mono hover:bg-emerald-500 transition-colors"
                              >
                                WhatsApp
                              </button>

                              <button
                                onClick={() => setSelectedCustomerDetail(customer)}
                                className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-[10px] font-bold font-mono hover:bg-amber-500/20 transition-colors"
                              >
                                Profile
                              </button>

                              <button
                                onClick={() => {
                                  setEditingCustomer(customer);
                                  setCustomerForm(customer);
                                  setIsCustomerModalOpen(true);
                                }}
                                className="p-1 text-zinc-400 hover:text-amber-500 rounded"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="p-1 text-zinc-400 hover:text-rose-500 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 5. OFFICE NOTEBOOK & NOTICEBOARD TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Quick Field Note Voice Recorder */}
            <QuickFieldNotesWidget
              fieldNotes={quickFieldNotes}
              setFieldNotes={setQuickFieldNotes}
              triggerQuickAction={triggerQuickAction}
              onConvertToBlog={handleConvertFieldNoteToBlog}
              onConvertToCaseStudy={handleConvertFieldNoteToCaseStudy}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl">
              <div>
                <h2 className="text-base font-bold text-zinc-100 light:text-zinc-900 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-500" />
                  <span>Engineering Operational Logbook & Notices</span>
                </h2>
                <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1">
                  Internal site team tasks, relay maintenance reminders, delivery schedules, and urgent field notices.
                </p>
              </div>
              <button
                onClick={() => {
                  setNoteForm({ title: '', content: '', priority: 'Standard' });
                  setIsNoteModalOpen(true);
                }}
                className={btnAmberClass}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Operational Note</span>
              </button>
            </div>

            {/* Note Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {officeNotes.map(note => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    note.isCompleted 
                      ? 'bg-zinc-950/30 border-zinc-900 opacity-60' 
                      : note.priority === 'Urgent' || note.priority === 'জরুরি'
                      ? 'bg-amber-500/5 border-amber-500/30 shadow-sm'
                      : 'bg-zinc-900/40 light:bg-white border-zinc-900 dark:border-zinc-900 light:border-zinc-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2">
                      <button
                        onClick={() => handleToggleOfficeNote(note.id)}
                        className="mt-0.5 text-amber-500 hover:text-amber-400 cursor-pointer"
                      >
                        {note.isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-zinc-500" />}
                      </button>
                      <div>
                        <h3 className={`text-sm font-bold ${note.isCompleted ? 'line-through text-zinc-500' : 'text-zinc-100 light:text-zinc-900'}`}>
                          {note.title}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500 block">{note.date} • {note.author}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      note.priority === 'Urgent' || note.priority === 'জরুরি' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {note.priority === 'জরুরি' ? 'Urgent' : note.priority === 'সাধারণ' ? 'Standard' : note.priority}
                    </span>
                  </div>

                  {note.content && (
                    <p className="text-xs text-zinc-300 light:text-zinc-700 font-sans leading-relaxed pt-1">
                      {note.content}
                    </p>
                  )}

                  <div className="flex justify-end pt-2 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-100">
                    <button
                      onClick={() => handleDeleteOfficeNote(note.id)}
                      className="text-xs text-rose-500 hover:underline flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. PAGES EDIT TAB (Advanced Homepage Editor) */}
        {activeTab === 'pages' && (
          <form onSubmit={handleSaveHomepage} className="space-y-6 animate-fade-in text-left pb-16">
            
            {/* TOP HEADER */}
            <div className="p-3.5 sm:p-5 bg-zinc-900/60 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="hidden sm:block">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-display font-bold text-base text-zinc-100 light:text-zinc-900 tracking-tight">
                        Homepage Content & Layout Manager
                      </h2>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full">
                        Live Sync
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1 font-sans">
                      সহজে মোবাইল ও ডেক্সটপ দুই ভার্সনের জন্যই হোমপেজের ব্যানার, মেট্রিক্স, মিডিয়া ও টেক্সট কাস্টমাইজ করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="submit"
                    className={`${btnAmberClass} h-9 px-3 sm:px-4 text-xs shadow-md font-bold`}
                  >
                    <Save className="w-4 h-4 text-zinc-950" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RESPONSIVE SUBTAB NAVIGATION CHIPS */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
              <button
                type="button"
                onClick={() => setHomepageSubTab('hero')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  homepageSubTab === 'hero'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/60 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Hero Banner Text</span>
              </button>

              <button
                type="button"
                onClick={() => setHomepageSubTab('stats')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  homepageSubTab === 'stats'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/60 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>2. Stats & Metrics</span>
              </button>

              <button
                type="button"
                onClick={() => setHomepageSubTab('media')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  homepageSubTab === 'media'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/60 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>3. Media & Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setHomepageSubTab('dailyCheck')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  homepageSubTab === 'dailyCheck'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/60 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>4. Daily Check Routine</span>
              </button>

              <button
                type="button"
                onClick={() => setHomepageSubTab('sections')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  homepageSubTab === 'sections'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/60 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>5. Section Headings</span>
              </button>

              <button
                type="button"
                onClick={() => setHomepageSubTab('logo')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  homepageSubTab === 'logo'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/60 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>6. Brand Logo Icon</span>
              </button>
            </div>

            {/* TAB 1: HERO TEXT */}
            {homepageSubTab === 'hero' && (
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                      Hero Section Main Content
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">PRIMARY BANNER</span>
                </div>

                <div className="space-y-4">
                  {/* HERO TAGLINE */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Hero Tagline (Top Badge Label)
                      </label>
                      <span className={`text-[10px] font-mono ${
                        homepageContent.heroTagline.length > 70 ? 'text-amber-500' : 'text-zinc-500'
                      }`}>
                        {homepageContent.heroTagline.length} / 70 chars
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={homepageContent.heroTagline}
                      onChange={e => setHomepageContent({ ...homepageContent, heroTagline: e.target.value })}
                      placeholder="e.g. Md. Sahin Alom • Electrical Engineering & Substation Solutions"
                      className={inputClass}
                      id="page-hero-tagline"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-zinc-500 font-mono self-center">Suggestions:</span>
                      <button
                        type="button"
                        onClick={() => setHomepageContent({ ...homepageContent, heroTagline: 'Md. Sahin Alom • Electrical Engineering & Substation Solutions' })}
                        className="text-[9px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-400 hover:text-amber-500 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        EE Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setHomepageContent({ ...homepageContent, heroTagline: '11kV/33kV Substation Commissioning & Protection Relay Testing' })}
                        className="text-[9px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-400 hover:text-amber-500 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Substation & HT
                      </button>
                    </div>
                  </div>

                  {/* HERO HEADING */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Main Display Title (H1 Banner Heading)
                      </label>
                      <span className={`text-[10px] font-mono ${
                        homepageContent.heroHeading.length > 90 ? 'text-amber-500' : 'text-zinc-500'
                      }`}>
                        {homepageContent.heroHeading.length} / 90 chars
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={homepageContent.heroHeading}
                      onChange={e => setHomepageContent({ ...homepageContent, heroHeading: e.target.value })}
                      placeholder="e.g. Power System Engineering, HT Substation & Industrial Automation"
                      className={`${inputClass} font-bold text-sm`}
                      id="page-hero-heading"
                    />
                  </div>

                  {/* HERO SUBHEADING */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Subheading Description Paragraph
                      </label>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {homepageContent.heroSubheading.length} chars
                      </span>
                    </div>
                    <textarea 
                      rows={3}
                      value={homepageContent.heroSubheading}
                      onChange={e => setHomepageContent({ ...homepageContent, heroSubheading: e.target.value })}
                      placeholder="Specialized Electrical Power Distribution, Transformer Maintenance, High Voltage Testing, and BNBC 2020 Compliance Services in Bangladesh."
                      className={textareaClass}
                      id="page-hero-subheading"
                    />
                  </div>

                  {/* PROFILE BADGE DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Operator / Profile Card Name
                      </label>
                      <input 
                        type="text" 
                        value={homepageContent.heroProfileName}
                        onChange={e => setHomepageContent({ ...homepageContent, heroProfileName: e.target.value })}
                        placeholder="e.g. Engr. Sahin Alom"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Designation / Sub-Title
                      </label>
                      <input 
                        type="text" 
                        value={homepageContent.heroProfileTitle}
                        onChange={e => setHomepageContent({ ...homepageContent, heroProfileTitle: e.target.value })}
                        placeholder="e.g. Lead Electrical Engineer"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* HERO CALL TO ACTION BUTTONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 pt-3">
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Primary CTA Button Text (Contact / Action)
                      </label>
                      <input 
                        type="text" 
                        value={homepageContent.heroCtaPrimaryText ?? 'Get in touch'}
                        onChange={e => setHomepageContent({ ...homepageContent, heroCtaPrimaryText: e.target.value })}
                        placeholder="e.g. Contact Me / Get in touch"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase">
                        Secondary CTA Button Text (Explore / Portfolio)
                      </label>
                      <input 
                        type="text" 
                        value={homepageContent.heroCtaSecondaryText ?? 'View my work'}
                        onChange={e => setHomepageContent({ ...homepageContent, heroCtaSecondaryText: e.target.value })}
                        placeholder="e.g. View my work / Explore Field Studies"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STATS & METRICS */}
            {homepageSubTab === 'stats' && (
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                      Hero Key Statistics & Experience Metrics
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">3 BADGES</span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 light:text-zinc-600 font-sans">
                    হোমপেজের ব্যানার নিচে প্রদর্শিত ৩টি প্রধান অভিজ্ঞতা বা সার্ভিসের সংখ্যা সেট করুন।
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* STAT 1 */}
                    <div className="p-3.5 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block">Metric 1</span>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Value</label>
                        <input 
                          type="text" 
                          value={homepageContent.heroStat1Val}
                          onChange={e => setHomepageContent({ ...homepageContent, heroStat1Val: e.target.value })}
                          placeholder="10+ Yrs"
                          className={`${inputClass} font-bold text-amber-500`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Label / Description</label>
                        <input 
                          type="text" 
                          value={homepageContent.heroStat1Label}
                          onChange={e => setHomepageContent({ ...homepageContent, heroStat1Label: e.target.value })}
                          placeholder="Field Engineering Exp."
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* STAT 2 */}
                    <div className="p-3.5 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block">Metric 2</span>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Value</label>
                        <input 
                          type="text" 
                          value={homepageContent.heroStat2Val}
                          onChange={e => setHomepageContent({ ...homepageContent, heroStat2Val: e.target.value })}
                          placeholder="150+"
                          className={`${inputClass} font-bold text-amber-500`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Label / Description</label>
                        <input 
                          type="text" 
                          value={homepageContent.heroStat2Label}
                          onChange={e => setHomepageContent({ ...homepageContent, heroStat2Label: e.target.value })}
                          placeholder="Substation Sites Served"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* STAT 3 */}
                    <div className="p-3.5 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block">Metric 3</span>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Value</label>
                        <input 
                          type="text" 
                          value={homepageContent.heroStat3Val}
                          onChange={e => setHomepageContent({ ...homepageContent, heroStat3Val: e.target.value })}
                          placeholder="100%"
                          className={`${inputClass} font-bold text-amber-500`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Label / Description</label>
                        <input 
                          type="text" 
                          value={homepageContent.heroStat3Label}
                          onChange={e => setHomepageContent({ ...homepageContent, heroStat3Label: e.target.value })}
                          placeholder="BNBC & Safety Compliance"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* QUICK FILL CHIPS */}
                  <div className="pt-2 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                    <span className="text-[10px] font-mono text-zinc-500 block mb-1.5">Quick Fill Presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setHomepageContent({
                          ...homepageContent,
                          heroStat1Val: '10+ Yrs',
                          heroStat1Label: 'Field Engineering Exp.',
                          heroStat2Val: '150+',
                          heroStat2Label: 'Substation Sites Served',
                          heroStat3Val: '100%',
                          heroStat3Label: 'BNBC & Safety Compliance'
                        })}
                        className="px-2.5 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded cursor-pointer transition-colors"
                      >
                        Substation & Field
                      </button>
                      <button
                        type="button"
                        onClick={() => setHomepageContent({
                          ...homepageContent,
                          heroStat1Val: '33kV / 11kV',
                          heroStat1Label: 'High Voltage Systems',
                          heroStat2Val: '200+ MVA',
                          heroStat2Label: 'Total Power Managed',
                          heroStat3Val: '24/7',
                          heroStat3Label: 'Emergency Dispatch'
                        })}
                        className="px-2.5 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded cursor-pointer transition-colors"
                      >
                        High Voltage & MVA
                      </button>
                      <button
                        type="button"
                        onClick={() => setHomepageContent({
                          ...homepageContent,
                          heroStat1Val: '0.99 PFI',
                          heroStat1Label: 'Target Power Factor',
                          heroStat2Val: '300+',
                          heroStat2Label: 'Safety Audits Done',
                          heroStat3Val: 'Zero',
                          heroStat3Label: 'Unplanned Downtime'
                        })}
                        className="px-2.5 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded cursor-pointer transition-colors"
                      >
                        PFI & Industrial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA & PHOTO */}
            {homepageSubTab === 'media' && (
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <Image className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                      Hero Profile Image & Video Assets
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">MEDIA MANAGER</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* DRAG & DROP ZONE */}
                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase flex items-center space-x-1">
                      <Image className="w-3.5 h-3.5 text-amber-500" />
                      <span>On-Duty Photo Upload (Drag & Drop or Browse)</span>
                    </label>

                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all ${
                        isDragging 
                          ? 'border-amber-500 bg-amber-500/10 scale-[1.01]' 
                          : 'border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-950/60 light:bg-zinc-50'
                      }`}
                    >
                      {homepageContent.heroProfileImage ? (
                        <div className="relative group w-28 h-28 mb-3 border border-amber-500/30 rounded-lg overflow-hidden shadow-md">
                          <img 
                            src={homepageContent.heroProfileImage} 
                            alt="Current Operator Portrait" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setHomepageContent({ ...homepageContent, heroProfileImage: '' })}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full shadow hover:scale-110 transition-transform cursor-pointer"
                            title="Remove Photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-zinc-900 light:bg-zinc-200 flex items-center justify-center text-zinc-500 mb-2">
                          <Image className="w-6 h-6 text-amber-500" />
                        </div>
                      )}

                      <p className="text-xs text-zinc-300 light:text-zinc-700 font-sans">
                        Drag and drop photo here, or{" "}
                        <label className="text-amber-500 font-bold hover:underline cursor-pointer">
                          browse computer
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageFileChange} 
                            className="hidden" 
                          />
                        </label>
                      </p>
                      <span className="block text-[10px] text-zinc-500 font-mono mt-1">
                        PNG, JPG, WEBP or SVG (Auto-compressed)
                      </span>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Direct Image Web URL</label>
                      <input 
                        type="url" 
                        value={homepageContent.heroProfileImage || ''}
                        onChange={e => setHomepageContent({ ...homepageContent, heroProfileImage: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className={inputClass}
                        id="page-hero-profile-image"
                      />
                    </div>
                  </div>

                  {/* VIDEO ASSET & SETTINGS */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block font-mono text-[10px] text-zinc-400 light:text-zinc-500 uppercase flex items-center space-x-1">
                        <Video className="w-3.5 h-3.5 text-amber-500" />
                        <span>Optional MP4 Video Background / Loop Link</span>
                      </label>
                      <input 
                        type="url" 
                        value={homepageContent.heroProfileVideo || ''}
                        onChange={e => setHomepageContent({ ...homepageContent, heroProfileVideo: e.target.value })}
                        placeholder="https://example.com/substation-intro.mp4"
                        className={inputClass}
                      />
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Direct MP4 link. If set, this video plays as a loop behind the profile badge card instead of the static image.
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-lg space-y-1.5 mt-4">
                      <span className="text-[10px] font-mono text-amber-500 font-bold uppercase block">Media Display Hint</span>
                      <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                        The operator profile photo/video is displayed inside the hero badge card on desktop and full-width header on mobile. Ensure high resolution for best appearance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DAILY CHECK ROUTINE */}
            {homepageSubTab === 'dailyCheck' && (
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4.5 h-4.5 text-amber-500" />
                    <div>
                      <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                        Daily Check Routine & Operations Log
                      </h3>
                      <p className="text-xs text-zinc-400 light:text-zinc-600 mt-0.5">
                        হোমপেজের দৈনিক প্ল্যান্ট ইন্সপেকশন, টাইমলাইন এবং ওয়াটার রেজিস্টার সেকশন কাস্টমাইজ বা অন/অফ করুন।
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">HOMEPAGE SECTION</span>
                </div>

                <div className="space-y-5">
                  {/* ENABLE / DISABLE TOGGLE CARD */}
                  <div className="p-4 bg-zinc-950/80 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-900">
                            Section Status on Homepage
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                            (homepageContent.showDailyCheck ?? true)
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                          }`}>
                            {(homepageContent.showDailyCheck ?? true) ? '● ENABLED (VISIBLE)' : '○ DISABLED (HIDDEN)'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1">
                          এই অপশনটি বন্ধ থাকলে হোমপেজ থেকে Daily Check (01 - Operations Journal) সেকশনটি সম্পূর্ণ হাইড হয়ে যাবে।
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setHomepageContent({ ...homepageContent, showDailyCheck: true })}
                          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            (homepageContent.showDailyCheck ?? true)
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          Enable
                        </button>
                        <button
                          type="button"
                          onClick={() => setHomepageContent({ ...homepageContent, showDailyCheck: false })}
                          className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                            homepageContent.showDailyCheck === false
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          Disable
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EDITABLE FIELDS */}
                  <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-4">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">
                      Daily Check Content & Display Texts
                    </span>

                    {/* Tagline / Sub-badge */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">
                          Section Tagline / Number Decor
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {(homepageContent.dailyCheckTagline || homepageContent.journalTagline || '').length} chars
                        </span>
                      </div>
                      <input 
                        type="text" 
                        value={homepageContent.dailyCheckTagline ?? homepageContent.journalTagline ?? '01 — Operations Journal'}
                        onChange={e => setHomepageContent({ 
                          ...homepageContent, 
                          dailyCheckTagline: e.target.value,
                          journalTagline: e.target.value
                        })}
                        placeholder="e.g. 01 — Operations Journal"
                        className={inputClass}
                      />
                    </div>

                    {/* Main Title / Heading */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">
                          Main Heading Title
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {(homepageContent.dailyCheckTitle || homepageContent.journalHeading || '').length} chars
                        </span>
                      </div>
                      <input 
                        type="text" 
                        value={homepageContent.dailyCheckTitle ?? homepageContent.journalHeading ?? 'The daily check'}
                        onChange={e => setHomepageContent({ 
                          ...homepageContent, 
                          dailyCheckTitle: e.target.value,
                          journalHeading: e.target.value
                        })}
                        placeholder="e.g. The daily check"
                        className={`${inputClass} font-bold`}
                      />
                    </div>

                    {/* Section Description Paragraph */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">
                          Section Subtitle / Description Text
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {(homepageContent.dailyCheckDesc || homepageContent.journalDesc || '').length} chars
                        </span>
                      </div>
                      <textarea 
                        rows={3}
                        value={homepageContent.dailyCheckDesc ?? homepageContent.journalDesc ?? 'Every morning starts the same way. I walk the floor before the machines start...'}
                        onChange={e => setHomepageContent({ 
                          ...homepageContent, 
                          dailyCheckDesc: e.target.value,
                          journalDesc: e.target.value
                        })}
                        placeholder="Every morning starts the same way..."
                        className={textareaClass}
                      />
                    </div>

                    {/* Suggestions Presets */}
                    <div className="pt-2 border-t border-zinc-850 dark:border-zinc-800 light:border-zinc-200">
                      <span className="text-[10px] font-mono text-zinc-500 block mb-1.5">Quick Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setHomepageContent({
                            ...homepageContent,
                            dailyCheckTagline: '01 — Operations Journal',
                            dailyCheckTitle: 'The daily check',
                            dailyCheckDesc: 'Every morning starts the same way. I walk the floor before the machines start, reading the boards, logging the numbers, listening for what sounds wrong. This is how you catch problems before they become downtime.',
                            journalTagline: '01 — Operations Journal',
                            journalHeading: 'The daily check',
                            journalDesc: 'Every morning starts the same way. I walk the floor before the machines start, reading the boards, logging the numbers, listening for what sounds wrong. This is how you catch problems before they become downtime.'
                          })}
                          className="px-2.5 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded cursor-pointer transition-colors"
                        >
                          English Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => setHomepageContent({
                            ...homepageContent,
                            dailyCheckTagline: '০১ — দৈনিক অপোরেশনাল রেজিস্টার',
                            dailyCheckTitle: 'দৈনিক ইন্সপেকশন ও সেফটি রুটিন',
                            dailyCheckDesc: 'প্রতিদিন সকালে ফ্যাক্টরির প্রধান পাওয়ার ডিস্ট্রিবিউশন প্যানেল (MDB), ট্রান্সফরমার তেল ও তাপমাত্রা, PFI প্ল্যান্ট এবং বাসবার লোড পর্যবেক্ষণ দিয়ে কাজ শুরু হয়। যেকোনো ত্রুটি বড় ধরনের ডাউনটাইমে রূপ নেওয়ার আগেই শনাক্ত করা নিশ্চিত করা হয়।',
                            journalTagline: '০১ — দৈনিক অপোরেশনাল রেজিস্টার',
                            journalHeading: 'দৈনিক ইন্সপেকশন ও সেফটি রুটিন',
                            journalDesc: 'প্রতিদিন সকালে ফ্যাক্টরির প্রধান পাওয়ার ডিস্ট্রিবিউশন প্যানেল (MDB), ট্রান্সফরমার তেল ও তাপমাত্রা, PFI প্ল্যান্ট এবং বাসবার লোড পর্যবেক্ষণ দিয়ে কাজ শুরু হয়। যেকোনো ত্রুটি বড় ধরনের ডাউনটাইমে রূপ নেওয়ার আগেই শনাক্ত করা নিশ্চিত করা হয়।'
                          })}
                          className="px-2.5 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-amber-500 rounded cursor-pointer transition-colors"
                        >
                          বাংলা স্ট্যান্ডার্ড
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SECTION HEADINGS */}
            {homepageSubTab === 'sections' && (
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                      Landing Page Section Headings & Contact Node
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">SECTIONS 01-04</span>
                </div>

                <div className="space-y-5">
                  {/* SECTION 01: DAILY CHECK ROUTINE */}
                  <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Section 01 // Daily Check Routine & Operations Log</span>
                      <button
                        type="button"
                        onClick={() => setHomepageContent({ ...homepageContent, showDailyCheck: !(homepageContent.showDailyCheck ?? true) })}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded border transition-colors cursor-pointer ${
                          (homepageContent.showDailyCheck ?? true)
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                      >
                        {(homepageContent.showDailyCheck ?? true) ? '● Enabled' : '○ Disabled'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Tagline Decor</label>
                        <input 
                          type="text" 
                          value={homepageContent.dailyCheckTagline ?? homepageContent.journalTagline ?? '01 — Operations Journal'}
                          onChange={e => setHomepageContent({ 
                            ...homepageContent, 
                            dailyCheckTagline: e.target.value,
                            journalTagline: e.target.value 
                          })}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Main Heading</label>
                        <input 
                          type="text" 
                          value={homepageContent.dailyCheckTitle ?? homepageContent.journalHeading ?? 'The daily check'}
                          onChange={e => setHomepageContent({ 
                            ...homepageContent, 
                            dailyCheckTitle: e.target.value,
                            journalHeading: e.target.value 
                          })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Section Description</label>
                      <textarea 
                        rows={2}
                        value={homepageContent.dailyCheckDesc ?? homepageContent.journalDesc ?? 'Every morning starts the same way...'}
                        onChange={e => setHomepageContent({ 
                          ...homepageContent, 
                          dailyCheckDesc: e.target.value,
                          journalDesc: e.target.value 
                        })}
                        className={textareaClass}
                      />
                    </div>
                  </div>

                  {/* SECTION 02: CASE STUDIES */}
                  <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-3">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Section 02 // Field Investigations & Case Studies (Problem → Solve)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Tagline Decor</label>
                        <input 
                          type="text" 
                          value={homepageContent.caseStudiesTagline ?? '02 — Field Investigations'}
                          onChange={e => setHomepageContent({ ...homepageContent, caseStudiesTagline: e.target.value })}
                          placeholder="e.g. 02 — Field Investigations"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Main Heading</label>
                        <input 
                          type="text" 
                          value={homepageContent.caseStudiesHeading ?? 'Problem → Solve'}
                          onChange={e => setHomepageContent({ ...homepageContent, caseStudiesHeading: e.target.value })}
                          placeholder="e.g. Problem → Solve"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Section Description</label>
                      <textarea 
                        rows={2}
                        value={homepageContent.caseStudiesDesc ?? 'Real faults, real calculations, real fixes. Every case follows the same discipline: diagnose first, calculate second, fix third.'}
                        onChange={e => setHomepageContent({ ...homepageContent, caseStudiesDesc: e.target.value })}
                        className={textareaClass}
                      />
                    </div>
                  </div>

                  {/* SECTION 03: EXPERTISE / CAPABILITIES */}
                  <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-3">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Section 03 // Core Engineering Capabilities</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Tagline Decor</label>
                        <input 
                          type="text" 
                          value={homepageContent.expertiseTagline}
                          onChange={e => setHomepageContent({ ...homepageContent, expertiseTagline: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Main Heading</label>
                        <input 
                          type="text" 
                          value={homepageContent.expertiseHeading}
                          onChange={e => setHomepageContent({ ...homepageContent, expertiseHeading: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Section Description</label>
                      <textarea 
                        rows={2}
                        value={homepageContent.expertiseDesc}
                        onChange={e => setHomepageContent({ ...homepageContent, expertiseDesc: e.target.value })}
                        className={textareaClass}
                      />
                    </div>
                  </div>

                  {/* SECTION 04: FEATURED BLOGS / OPERATIONS JOURNAL */}
                  <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-3">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Section 04 // Operations Journal & Featured Notes</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Tagline Decor</label>
                        <input 
                          type="text" 
                          value={homepageContent.featuredBlogsTagline ?? homepageContent.journalTagline ?? '04 — Engineering Journal'}
                          onChange={e => setHomepageContent({ 
                            ...homepageContent, 
                            featuredBlogsTagline: e.target.value,
                            journalTagline: e.target.value 
                          })}
                          placeholder="e.g. 04 — Engineering Journal"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Main Heading</label>
                        <input 
                          type="text" 
                          value={homepageContent.featuredBlogsHeading ?? homepageContent.journalHeading ?? 'Operations Journal & Notes'}
                          onChange={e => setHomepageContent({ 
                            ...homepageContent, 
                            featuredBlogsHeading: e.target.value,
                            journalHeading: e.target.value 
                          })}
                          placeholder="e.g. Operations Journal & Notes"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Section Description</label>
                      <textarea 
                        rows={2}
                        value={homepageContent.featuredBlogsDesc ?? homepageContent.journalDesc ?? 'Field notes, compliance manuals, and calculation registers compiled directly from my daily substation maintenance routines in Dhaka, Bangladesh.'}
                        onChange={e => setHomepageContent({ 
                          ...homepageContent, 
                          featuredBlogsDesc: e.target.value,
                          journalDesc: e.target.value 
                        })}
                        className={textareaClass}
                      />
                    </div>
                  </div>

                  {/* SECTION 05: CONTACT NODE & SOCIALS */}
                  <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-lg space-y-3">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Section 05 // Contact Node & Direct Social Links</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Tagline Decor</label>
                        <input 
                          type="text" 
                          value={homepageContent.contactTagline}
                          onChange={e => setHomepageContent({ ...homepageContent, contactTagline: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Main Heading</label>
                        <input 
                          type="text" 
                          value={homepageContent.contactHeading}
                          onChange={e => setHomepageContent({ ...homepageContent, contactHeading: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Section Description</label>
                      <textarea 
                        rows={2}
                        value={homepageContent.contactDesc}
                        onChange={e => setHomepageContent({ ...homepageContent, contactDesc: e.target.value })}
                        className={textareaClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-zinc-850 dark:border-zinc-800/80 light:border-zinc-200 pt-3">
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">Official Email</label>
                        <input 
                          type="email" 
                          value={homepageContent.contactEmail}
                          onChange={e => setHomepageContent({ ...homepageContent, contactEmail: e.target.value })}
                          placeholder="sardersahin@gmail.com"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">LinkedIn Link</label>
                        <input 
                          type="text" 
                          value={homepageContent.contactLinkedin}
                          onChange={e => setHomepageContent({ ...homepageContent, contactLinkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">GitHub Link</label>
                        <input 
                          type="text" 
                          value={homepageContent.contactGithub}
                          onChange={e => setHomepageContent({ ...homepageContent, contactGithub: e.target.value })}
                          placeholder="https://github.com/..."
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-mono text-[9px] text-zinc-500 uppercase">WhatsApp Number</label>
                        <input 
                          type="text" 
                          value={homepageContent.contactWhatsapp ?? '+8801700000000'}
                          onChange={e => setHomepageContent({ ...homepageContent, contactWhatsapp: e.target.value })}
                          placeholder="+8801700000000"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BRAND LOGO ICON */}
            {homepageSubTab === 'logo' && (
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                      Sticky Header Brand Logo & Icon Customization
                    </h3>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={logoIconSearch}
                      onChange={e => setLogoIconSearch(e.target.value)}
                      placeholder="Search icons (e.g. Zap, Cpu, Flame)..."
                      className={`${inputClass} pl-8 h-8 text-xs font-mono`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-zinc-400 light:text-zinc-650 font-sans">
                    মেনুবারের বামপাশে প্রদর্শিত ব্র্যান্ড লোগো বা বিশেষ টেকনিক্যাল আইকনটি নির্বাচন করুন।
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 pt-1">
                    {LOGO_OPTIONS
                      .filter(opt => !logoIconSearch || opt.id.toLowerCase().includes(logoIconSearch.toLowerCase()) || opt.name.toLowerCase().includes(logoIconSearch.toLowerCase()))
                      .map((opt) => {
                        const IconComponent = ADMIN_ICON_MAP[opt.id] || Cpu;
                        const isSelected = (homepageContent.headerLogoIcon || 'Cpu') === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setHomepageContent({ ...homepageContent, headerLogoIcon: opt.id })}
                            className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500/15 text-amber-500 shadow-md ring-1 ring-amber-500/40 scale-[1.02]'
                                : 'border-zinc-800 dark:border-zinc-800 light:border-zinc-200 bg-zinc-950/60 light:bg-zinc-50 hover:border-zinc-700 text-zinc-400'
                            }`}
                          >
                            <IconComponent className={`w-6 h-6 mb-1.5 ${isSelected ? 'text-amber-500 animate-pulse' : 'text-zinc-500'}`} />
                            <span className="block text-[11px] font-mono uppercase font-bold tracking-tight">{opt.id}</span>
                            <span className="block text-[8px] text-zinc-500 font-sans mt-0.5 leading-tight">{opt.desc}</span>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-emerald-500/30" />
                            )}
                          </button>
                        );
                      })}
                  </div>

                  <div className="pt-3 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <label className="block font-mono text-[9px] text-zinc-500 uppercase">Custom Lucide Icon Name</label>
                      <input
                        type="text"
                        value={homepageContent.headerLogoIcon || 'Cpu'}
                        onChange={e => setHomepageContent({ ...homepageContent, headerLogoIcon: e.target.value })}
                        placeholder="e.g. Cpu, Zap, Activity, ShieldAlert"
                        className={`${inputClass} max-w-xs mt-1 font-mono`}
                      />
                    </div>
                    <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-zinc-400">Current Logo Icon Preview:</span>
                      {React.createElement(ADMIN_ICON_MAP[homepageContent.headerLogoIcon || 'Cpu'] || Cpu, { className: "w-5 h-5 text-amber-500" })}
                      <span className="text-xs font-mono font-bold text-amber-500">{homepageContent.headerLogoIcon || 'Cpu'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STICKY BOTTOM ACTION BAR (MOBILE & DESKTOP) */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 p-3.5 shadow-2xl">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline">Ready to sync changes with live database</span>
                  <span className="sm:hidden">Ready to sync</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    type="submit" 
                    className={`${btnAmberClass} px-5 h-9 text-xs font-bold shadow-lg`}
                    id="save-homepage-btn"
                  >
                    <Save className="w-4 h-4 text-zinc-950" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
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
                  <div className="space-y-1 sm:col-span-2 md:col-span-1">
                    <label className="block font-mono text-[10px] text-amber-500 font-bold uppercase">Cover / Technical Photo</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold text-xs rounded cursor-pointer flex items-center space-x-1.5 transition-colors shrink-0">
                          <Image className="w-3.5 h-3.5 text-amber-500" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePostBannerUpload}
                            className="hidden"
                          />
                        </label>
                        <input 
                          type="url" 
                          value={postForm.imageUrl || ''}
                          onChange={e => setPostForm({ ...postForm, imageUrl: e.target.value })}
                          placeholder="Or paste photo URL..."
                          className={inputClass}
                        />
                      </div>

                      {postForm.imageUrl && (
                        <div className="relative rounded overflow-hidden border border-amber-500/30 bg-zinc-950 h-28 flex items-center justify-center">
                          <img src={postForm.imageUrl} alt="Case Study Preview" className="max-h-full max-w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setPostForm({ ...postForm, imageUrl: '' })}
                            className="absolute top-1.5 right-1.5 px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold shadow flex items-center space-x-1 cursor-pointer"
                            title="Remove Image"
                          >
                            <X className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      )}
                    </div>
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
            
            {/* ----------------- BLOG SUB-VIEW 1: LISTING & DIRECTORY ----------------- */}
            {blogSubView === 'list' && (() => {
              const filteredPosts = blogPosts.filter(post => {
                const matchesCategory = blogCategoryFilter === 'All' || post.category === blogCategoryFilter;
                const matchesStatus = blogStatusFilter === 'All' || 
                  (blogStatusFilter === 'Published' && post.published) || 
                  (blogStatusFilter === 'Draft' && !post.published);
                const matchesQuery = !blogSearchQuery.trim() || 
                  post.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                  post.summary.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                  (post.tags && post.tags.some(t => t.toLowerCase().includes(blogSearchQuery.toLowerCase())));
                return matchesCategory && matchesStatus && matchesQuery;
              });

              const publishedCount = blogPosts.filter(p => p.published).length;
              const draftCount = blogPosts.filter(p => !p.published).length;
              const categoryList = Array.from(new Set(blogPosts.map(p => p.category).filter(Boolean)));

              return (
                <div className="space-y-6">
                  {/* Header Action Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 light:bg-white p-5 rounded-xl border border-zinc-800/80 light:border-zinc-200 shadow-sm">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-zinc-500 font-mono mb-1">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span>{blogPosts.length} Technical Articles Documented</span>
                      </div>
                      <h2 className="font-display font-extrabold text-xl text-zinc-100 light:text-zinc-900">
                        Technical Journal & Articles Directory
                      </h2>
                      <p className="text-xs text-zinc-400 light:text-zinc-600 mt-0.5">
                        Publication management for civil structures, BNBC 2020 compliance, boundary pillar casting, and engineering case studies.
                      </p>
                    </div>

                    <button
                      onClick={handleCreateNewBlogClick}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5 shrink-0"
                      id="blog-cms-create-btn"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write New Article</span>
                    </button>
                  </div>

                  {/* Quick Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-zinc-900/30 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">TOTAL ARTICLES</span>
                      <span className="font-display font-extrabold text-2xl text-amber-500 mt-0.5 block">{blogPosts.length}</span>
                    </div>
                    <div className="p-4 bg-zinc-900/30 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">PUBLISHED LIVE</span>
                      <span className="font-display font-extrabold text-2xl text-emerald-500 mt-0.5 block">{publishedCount}</span>
                    </div>
                    <div className="p-4 bg-zinc-900/30 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">DRAFTS</span>
                      <span className="font-display font-extrabold text-2xl text-rose-400 mt-0.5 block">{draftCount}</span>
                    </div>
                    <div className="p-4 bg-zinc-900/30 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">TOTAL CATEGORIES</span>
                      <span className="font-display font-extrabold text-2xl text-cyan-400 mt-0.5 block">{categoryList.length || 1}</span>
                    </div>
                  </div>

                  {/* Filters & Search Toolbar */}
                  <div className="p-4 bg-zinc-900/30 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-3">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      {/* Search input */}
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={blogSearchQuery}
                          onChange={e => setBlogSearchQuery(e.target.value)}
                          placeholder="Search articles by title, tags, or keyword..."
                          className="w-full bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-200 light:text-zinc-900 focus:outline-none focus:border-amber-500"
                        />
                        {blogSearchQuery && (
                          <button onClick={() => setBlogSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Category Filter Dropdown */}
                      <div className="flex items-center space-x-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 px-3 py-2 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 w-full md:w-auto">
                        <Filter className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-xs font-mono text-zinc-400 font-medium whitespace-nowrap">Category:</span>
                        <select
                          value={blogCategoryFilter}
                          onChange={e => setBlogCategoryFilter(e.target.value)}
                          className="bg-transparent text-xs text-zinc-200 light:text-zinc-900 font-semibold focus:outline-none cursor-pointer w-full md:w-auto"
                        >
                          <option value="All" className="bg-zinc-900 text-zinc-100">All Categories</option>
                          {Array.from(new Set([
                            'Boundary Pillar & Civil',
                            'BNBC Code & Safety',
                            'Foundation & Soil Test',
                            'Electrical Substation',
                            'Construction Materials',
                            'Engineering Tips',
                            ...blogPosts.map(p => p.category).filter(Boolean)
                          ])).map(cat => (
                            <option key={cat} value={cat} className="bg-zinc-900 text-zinc-100">
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status filter */}
                      <div className="flex items-center space-x-1 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-1 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 w-full md:w-auto justify-center shrink-0">
                        {['All', 'Published', 'Draft'].map(st => (
                          <button
                            key={st}
                            onClick={() => setBlogStatusFilter(st)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                              blogStatusFilter === st
                                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>


                  </div>

                  {/* Article Listing Grid */}
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-xl space-y-3">
                      <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
                      <p className="text-zinc-400 font-mono text-xs">No articles found. Click below to draft a new technical article.</p>
                      <button
                        onClick={handleCreateNewBlogClick}
                        className="px-4 py-2 bg-amber-500 text-zinc-950 text-xs font-bold rounded-lg inline-flex items-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Draft New Article</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredPosts.map(post => (
                        <div
                          key={post.slug}
                          className="bg-zinc-900/40 dark:bg-zinc-900/40 light:bg-white border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm"
                        >
                          <div>
                            {/* Banner Image or Graphic Header */}
                            <div className="h-36 bg-zinc-950 relative overflow-hidden">
                              {post.imageUrl ? (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 text-center">
                                  <BookOpen className="w-10 h-10 text-amber-500/40" />
                                </div>
                              )}
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shadow-sm ${
                                  post.published 
                                    ? 'bg-emerald-500 text-zinc-950' 
                                    : 'bg-amber-500 text-zinc-950'
                                }`}>
                                  {post.published ? 'Published' : 'Draft'}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur text-amber-400 border border-zinc-800 text-[9px] font-mono font-bold">
                                  {post.category}
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-zinc-950/80 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-zinc-800">
                                {post.readTime || '5 min'}
                              </div>
                            </div>

                            {/* Article Body Details */}
                            <div className="p-4 space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 block">{post.date}</span>
                              <h3 className="font-display font-bold text-base text-zinc-100 light:text-zinc-900 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h3>
                              <p className="text-xs text-zinc-400 light:text-zinc-600 line-clamp-3 leading-relaxed">
                                {post.summary || 'No excerpt provided.'}
                              </p>

                              {/* Tag list */}
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                  {post.tags.slice(0, 3).map(t => (
                                    <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 text-zinc-400 light:text-zinc-600 rounded border border-zinc-800">
                                      #{t}
                                    </span>
                                  ))}
                                  {post.tags.length > 3 && (
                                    <span className="text-[9px] font-mono text-zinc-500">+{post.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="p-3 bg-zinc-950/60 dark:bg-zinc-950/60 light:bg-zinc-50 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleBlogPublished(post.slug)}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                                post.published
                                  ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                  : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                              }`}
                              title="Toggle publication status"
                            >
                              {post.published ? 'Published' : 'Draft'}
                            </button>

                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => setPreviewingBlogPost(post)}
                                className="p-1.5 rounded border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-xs flex items-center space-x-1 cursor-pointer"
                                title="View Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEditBlogClick(post)}
                                className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteBlogPost(post.slug)}
                                className="p-1.5 rounded border border-zinc-800 hover:border-rose-500/50 text-zinc-500 hover:text-rose-400 text-xs cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Preview Modal */}
                  {previewingBlogPost && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-left">
                        <button
                          onClick={() => setPreviewingBlogPost(null)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                              {previewingBlogPost.category}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">• {previewingBlogPost.date} • {previewingBlogPost.readTime}</span>
                          </div>
                          <h2 className="font-display font-extrabold text-2xl text-zinc-100">{previewingBlogPost.title}</h2>
                          <p className="text-xs font-mono text-zinc-400">Author: Engr. Sahin Sarder</p>
                        </div>

                        {previewingBlogPost.imageUrl && (
                          <img src={previewingBlogPost.imageUrl} alt={previewingBlogPost.title} className="w-full h-56 object-cover rounded-xl border border-zinc-800" />
                        )}

                        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300 text-xs leading-relaxed italic">
                          "{previewingBlogPost.summary}"
                        </div>

                        <div className="space-y-3 text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap border-t border-zinc-800 pt-4">
                          {previewingBlogPost.content}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-zinc-800">
                          <button
                            onClick={() => {
                              const post = previewingBlogPost;
                              setPreviewingBlogPost(null);
                              handleEditBlogClick(post);
                            }}
                            className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Article</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ----------------- BLOG SUB-VIEW 2: WORKSPACE EDITOR ----------------- */}
            {blogSubView === 'editor' && (
              <div className="space-y-6 animate-fade-in">
                {/* Workspace Top Navigation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 light:bg-white p-4 rounded-xl border border-zinc-800 light:border-zinc-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelBlogEdit}
                      className="p-2 rounded-lg bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/50 text-zinc-300 light:text-zinc-700 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to List</span>
                    </button>
                    <div>
                      <span className="font-mono text-[10px] text-amber-500 font-bold uppercase block">
                        {editingBlogSlug ? `Edit Mode: ${editingBlogSlug}` : 'New Article Draft Workspace'}
                      </span>
                      <h2 className="font-display font-bold text-base text-zinc-100 light:text-zinc-900">
                        {blogForm.title || 'Untitled Article'}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View tab selector: Write vs Preview */}
                    <div className="flex items-center bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-1 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-200">
                      <button
                        type="button"
                        onClick={() => setBlogEditorTab('write')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                          blogEditorTab === 'write'
                            ? 'bg-amber-500 text-zinc-950 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlogEditorTab('preview')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                          blogEditorTab === 'preview'
                            ? 'bg-amber-500 text-zinc-950 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live Preview</span>
                      </button>
                    </div>

                    {/* Quick Status Toggle */}
                    <button
                      type="button"
                      onClick={() => setBlogForm(prev => ({ ...prev, published: !prev.published }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-colors ${
                        blogForm.published
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {blogForm.published ? 'Published' : 'Draft'}
                    </button>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={handleSaveBlogPost}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg shadow-md flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingBlogSlug ? 'Save Changes' : 'Publish Article'}</span>
                    </button>
                  </div>
                </div>

                {/* Editor Main Content Area */}
                {blogEditorTab === 'write' ? (
                  <form onSubmit={handleSaveBlogPost} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Core Fields & Formatting (8 cols) */}
                    <div className="lg:col-span-8 space-y-5 bg-zinc-900/40 light:bg-white p-6 rounded-xl border border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                      
                      {/* Title & Slug */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                            Article Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={blogForm.title || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setBlogForm(prev => ({
                                ...prev,
                                title: val,
                                slug: isSlugEditedManually ? (prev.slug || '') : slugifyTitle(val)
                              }));
                            }}
                            placeholder="e.g. 11kV Transformer Auditing & HT Switchgear Testing Procedure"
                            className={`${inputClass} text-sm font-bold`}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="block font-mono text-[10px] text-zinc-400 uppercase">URL Slug *</label>
                              {isSlugEditedManually && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsSlugEditedManually(false);
                                    if (blogForm.title) {
                                      setBlogForm(prev => ({ ...prev, slug: slugifyTitle(prev.title || '') }));
                                    }
                                  }}
                                  className="text-[9px] font-mono text-amber-400 hover:underline cursor-pointer"
                                >
                                  Reset Slug
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              required
                              value={blogForm.slug || ''}
                              onChange={e => {
                                setIsSlugEditedManually(true);
                                setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                              }}
                              placeholder="e.g. 11kv-transformer-audit-procedure"
                              className={`${inputClass} font-mono text-xs`}
                            />
                            <span className="text-[9px] font-mono text-zinc-500 block">
                              {isSlugEditedManually ? 'Manually edited' : 'Auto-generated from title'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <label className="block font-mono text-[10px] text-zinc-400 uppercase">Read Time (Auto-calculated)</label>
                            <div className="px-3 py-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-lg font-mono text-xs text-amber-400 flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-400 inline" />
                                <span>{calculateReadTime(blogForm.title, blogForm.summary, blogForm.content)}</span>
                              </span>
                              <span className="text-[10px] text-zinc-500">(Auto)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary / Excerpt */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                            Executive Excerpt / Summary
                          </label>
                          <span className="text-[10px] font-mono text-zinc-500">2-3 sentences summary for preview cards</span>
                        </div>
                        <textarea
                          rows={3}
                          value={blogForm.summary || ''}
                          onChange={e => setBlogForm({ ...blogForm, summary: e.target.value })}
                          placeholder="Write a concise summary of this article..."
                          className={textareaClass}
                        />
                      </div>

                      {/* Rich Markdown Formatting Toolbar & Textarea */}
                      <div className="space-y-2 pt-2 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                            Main Content & Technical Specifications (Markdown Supported)
                          </label>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {blogForm.content ? `${blogForm.content.trim().split(/\s+/).length} words` : '0 words'}
                          </span>
                        </div>

                        {/* Quick Formatting Snippets Toolbar */}
                        <div className="p-2.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 rounded-lg border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-500 mr-1">Quick Formatting:</span>
                          <button
                            type="button"
                            onClick={() => insertBlogFormatting('## 2. New Section Heading')}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 text-[10px] font-mono rounded cursor-pointer"
                          >
                            + H2 Heading
                          </button>
                          <button
                            type="button"
                            onClick={() => insertBlogFormatting('### 2.1 Subsection Details')}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 text-[10px] font-mono rounded cursor-pointer"
                          >
                            + H3 Subheading
                          </button>
                          <button
                            type="button"
                            onClick={() => insertBlogFormatting('- Thermal imaging camera hotspot inspection\n- Insulation resistance measurement via Megger test\n- Transformer oil breakdown voltage verification')}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 text-[10px] font-mono rounded cursor-pointer"
                          >
                            + Bullet Points
                          </button>
                          <button
                            type="button"
                            onClick={() => insertBlogFormatting('> **BNBC 2020 Electrical Code:** HT substation room must maintain minimum clearance and forced ventilation fans.')}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-[10px] font-mono rounded cursor-pointer"
                          >
                            + BNBC Callout
                          </button>
                          <button
                            type="button"
                            onClick={() => insertBlogFormatting('| Equipment | Voltage Level | Safety Rating |\n|---|---|---|\n| HT Vacuum Circuit Breaker | 11kV | IP54 Standard |')}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono rounded cursor-pointer"
                          >
                            + Table
                          </button>
                          <button
                            type="button"
                            onClick={() => insertBlogFormatting('**Warning:** After shutting down main HT breaker, discharge remnant charge using safety grounding rod.')}
                            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-500/30 text-[10px] font-mono rounded cursor-pointer"
                          >
                            + Warning
                          </button>
                          <button
                            type="button"
                            onClick={() => contentImageInputRef.current?.click()}
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono rounded font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Image className="w-3 h-3 text-amber-400" />
                            <span>+ Photo / Diagram into Text</span>
                          </button>
                          <input
                            type="file"
                            ref={contentImageInputRef}
                            accept="image/*"
                            onChange={handleInsertBlogContentImage}
                            className="hidden"
                          />
                        </div>

                        <textarea
                          rows={16}
                          value={blogForm.content || ''}
                          onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                          placeholder="Write your technical engineering article here..."
                          className={`${textareaClass} font-mono text-xs leading-relaxed`}
                        />
                      </div>
                    </div>

                    {/* Right Column: Meta Settings, Banner & Tags (4 cols) */}
                    <div className="lg:col-span-4 space-y-5">
                      
                      {/* Dynamic Category Selector */}
                      <div className="p-5 bg-zinc-900/40 light:bg-white rounded-xl border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                            className="text-[10px] font-mono font-bold text-amber-400 hover:underline cursor-pointer"
                          >
                            {isAddingCategory ? '← View List' : '+ Add Category'}
                          </button>
                        </div>

                        {isAddingCategory ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newCategoryInput}
                              onChange={e => {
                                setNewCategoryInput(e.target.value);
                                setBlogForm(prev => ({ ...prev, category: e.target.value }));
                              }}
                              placeholder="Enter category name..."
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newCategoryInput.trim()) {
                                  if (!customCategories.includes(newCategoryInput.trim())) {
                                    setCustomCategories(prev => [...prev, newCategoryInput.trim()]);
                                  }
                                  setBlogForm(prev => ({ ...prev, category: newCategoryInput.trim() }));
                                  setIsAddingCategory(false);
                                  triggerQuickAction(`New category "${newCategoryInput.trim()}" created successfully.`);
                                }
                              }}
                              className="px-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg cursor-pointer whitespace-nowrap"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <select
                            value={blogForm.category || ELECTRICAL_CATEGORIES[0]}
                            onChange={e => {
                              if (e.target.value === '__NEW_CATEGORY__') {
                                setIsAddingCategory(true);
                              } else {
                                setBlogForm({ ...blogForm, category: e.target.value });
                              }
                            }}
                            className={selectClass}
                          >
                            {Array.from(new Set([...ELECTRICAL_CATEGORIES, ...(blogPosts || []).map(p => p.category).filter(Boolean), ...customCategories])).map((cat, idx) => (
                              <option key={idx} value={cat}>{cat}</option>
                            ))}
                            <option value="__NEW_CATEGORY__">+ Add New Category...</option>
                          </select>
                        )}
                      </div>

                      {/* Banner Image File Upload */}
                      <div className="p-5 bg-zinc-900/40 light:bg-white rounded-xl border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                            Banner / Cover Image
                          </label>
                          {blogForm.imageUrl && (
                            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Image Attached</span>
                            </span>
                          )}
                        </div>
                        
                        <label className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-900 text-amber-400 border border-amber-500/30 font-mono font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center space-x-2 transition-colors">
                          <Image className="w-4 h-4 text-amber-500" />
                          <span>{blogForm.imageUrl ? 'Change Banner Image' : 'Upload Cover Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBlogBannerUpload}
                            className="hidden"
                          />
                        </label>

                        {blogForm.imageUrl ? (
                          <div className="relative rounded-lg overflow-hidden border border-emerald-500/40 group bg-zinc-950 h-40">
                            <img src={blogForm.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setBlogForm({ ...blogForm, imageUrl: '' })}
                              className="absolute top-2 right-2 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-bold shadow flex items-center space-x-1 cursor-pointer"
                              title="Remove Image"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                            <div className="absolute bottom-2 left-2 bg-zinc-950/90 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono border border-emerald-500/30 font-bold">
                              ✓ Banner Ready
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed border-zinc-800 rounded-lg text-center">
                            <span className="text-[11px] font-mono text-zinc-500">No cover banner image uploaded</span>
                          </div>
                        )}

                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-mono text-amber-300 space-y-1">
                          <p className="font-bold">💡 ডাটাবেজ নির্দেশনা (Database Notice):</p>
                          <p className="text-zinc-300 leading-relaxed font-sans">
                            ছবি সিলেক্ট করার পর ডাটাবেজে পার্মানেন্টলি সেভ করতে উপরে <strong className="text-amber-400">"Save Changes"</strong> অথবা <strong className="text-amber-400">"Publish Article"</strong> বাটনে অবশ্যই ক্লিক করুন।
                          </p>
                        </div>
                      </div>

                      {/* Tags & Keywords */}
                      <div className="p-5 bg-zinc-900/40 light:bg-white rounded-xl border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 space-y-3">
                        <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                          Tags & Search Keywords
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={blogTagInput}
                            onChange={e => setBlogTagInput(e.target.value)}
                            placeholder="e.g. Substation, IEEE, Relay"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={handleAddBlogTag}
                            className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold rounded-lg cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {blogForm.tags?.map(t => (
                            <span key={t} className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 text-amber-400 text-[10px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-zinc-800">
                              <span>#{t}</span>
                              <button type="button" onClick={() => handleRemoveBlogTag(t)} className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-5 bg-zinc-900/40 light:bg-white rounded-xl border border-zinc-850 dark:border-zinc-850 light:border-zinc-200 space-y-3">
                        <button
                          type="submit"
                          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-lg shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingBlogSlug ? 'Save Publication' : 'Publish Article'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelBlogEdit}
                          className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
                        >
                          Cancel / Return to List
                        </button>
                      </div>

                    </div>
                  </form>
                ) : (
                  /* Live Article Preview Screen */
                  <div className="bg-zinc-900/40 light:bg-white p-8 rounded-2xl border border-zinc-850 light:border-zinc-200 max-w-4xl mx-auto space-y-6 text-left">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-md">
                          {blogForm.category || 'General'}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">• {blogForm.date || 'Today'} • {calculateReadTime(blogForm.title, blogForm.summary, blogForm.content)}</span>
                      </div>
                      <h1 className="font-display font-extrabold text-3xl text-zinc-100 light:text-zinc-900 leading-tight">
                        {blogForm.title || 'Untitled Publication'}
                      </h1>
                      <div className="flex items-center space-x-3 pt-1">
                        <div className="w-9 h-9 rounded-full bg-amber-500 text-zinc-950 font-extrabold flex items-center justify-center text-xs">
                          SA
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-200 light:text-zinc-900 block">Engr. Sahin Alom</span>
                          <span className="text-[10px] text-zinc-400 font-mono">Senior Industrial Electrical Maintenance Engineer, Dhaka</span>
                        </div>
                      </div>
                    </div>

                    {blogForm.imageUrl && (
                      <div className="rounded-xl overflow-hidden h-72 border border-zinc-800 shadow-md">
                        <img src={blogForm.imageUrl} alt={blogForm.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {blogForm.summary && (
                      <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-zinc-200 light:text-zinc-800 text-sm italic leading-relaxed">
                        "{blogForm.summary}"
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none text-zinc-300 light:text-zinc-800 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                      {blogForm.content || 'No detailed content provided.'}
                    </div>

                    {blogForm.tags && blogForm.tags.length > 0 && (
                      <div className="pt-6 border-t border-zinc-850 dark:border-zinc-850 light:border-zinc-200 flex items-center space-x-2">
                        <span className="text-xs font-mono text-zinc-500">Tags:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {blogForm.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 text-amber-400 text-xs font-mono rounded border border-zinc-800">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

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
                  Application Theme & Mobile Navigation
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

              {/* ADVANCED CONFIGURATIONS ACCORDION */}
              <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 dark:border-zinc-800/50 light:border-zinc-100 pb-3">
                  <h3 className="font-display font-bold text-sm text-zinc-100 light:text-zinc-900 uppercase">
                    Advanced Operations
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono text-xs font-bold rounded-lg border border-zinc-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showAdvancedSettings ? 'Hide Options' : 'Show Options'}</span>
                    {showAdvancedSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showAdvancedSettings ? (
                  <div className="space-y-4 animate-fade-in pt-1">
                    {/* Database Reset */}
                    <div className="p-4 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 rounded-xl border border-rose-500/30 space-y-2.5">
                      <h4 className="font-mono text-xs font-bold text-rose-500 uppercase flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Reset Database (Factory Defaults)</span>
                      </h4>
                      <p className="text-xs text-zinc-400 light:text-zinc-650 leading-relaxed">
                        Clears customizations made to landing page headings, added case studies, or edited resume bio-data, and reloads default parameters.
                      </p>
                      <button 
                        type="button"
                        onClick={handleResetFactoryDefaults}
                        className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:text-zinc-950 text-rose-400 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>[Execute Factory Reset]</span>
                      </button>
                    </div>

                    {/* Local Storage Stats */}
                    <div className="p-4 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 rounded-xl border border-zinc-800 light:border-zinc-200 space-y-2">
                      <h4 className="font-mono text-xs font-bold text-amber-500 uppercase">
                        Storage Cache Records
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400">
                        <div className="p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded border border-zinc-800">Catalog: {products.length}</div>
                        <div className="p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded border border-zinc-800">Invoices: {orders.length}</div>
                        <div className="p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded border border-zinc-800">Clients: {customers.length}</div>
                        <div className="p-2 bg-zinc-900 dark:bg-zinc-900 light:bg-white rounded border border-zinc-800">Notes: {officeNotes.length}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    Advanced developer options, storage caches, and database overwrites are collapsed to keep your smartphone editor uncluttered. Click "Show Options" to expand.
                  </p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* MAINTENANCE LOG & LOGBOOK UNIFIED HUB */}
        {(activeTab === 'maintenance' || activeTab === 'notes') && (() => {
          const now = new Date();

          const alertCount = maintenanceLogs.filter(m => 
            m.status === 'Critical / Overdue' || 
            m.status === 'Requires Attention' || 
            new Date(m.nextInspectionDueDate) <= now
          ).length;

          const pendingNotesCount = officeNotes.filter(n => !n.isCompleted).length;

          const optimalCount = maintenanceLogs.filter(m => m.status === 'Optimal').length;
          const inMaintCount = maintenanceLogs.filter(m => m.status === 'In Maintenance').length;

          const filteredLogs = maintenanceLogs.filter(item => {
            const matchesSearch = 
              item.equipmentName.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()) ||
              item.equipmentIdTag.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()) ||
              item.location.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()) ||
              item.technicianInCharge.toLowerCase().includes(maintenanceSearchQuery.toLowerCase());
            
            const matchesStatus = maintenanceStatusFilter === 'All' ? true : item.status === maintenanceStatusFilter;
            const matchesCategory = maintenanceCategoryFilter === 'All' ? true : item.category === maintenanceCategoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
          });

          const filteredNotes = officeNotes.filter(item => {
            const matchesSearch = 
              item.title.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()) ||
              item.content.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()) ||
              (item.author && item.author.toLowerCase().includes(maintenanceSearchQuery.toLowerCase()));
            const matchesPriority = notePriorityFilter === 'All' ? true : item.priority === notePriorityFilter;
            let matchesStatus = true;
            if (noteStatusFilter === 'Pending') matchesStatus = !item.isCompleted;
            else if (noteStatusFilter === 'Completed') matchesStatus = item.isCompleted;
            else if (noteStatusFilter === 'Urgent') matchesStatus = item.priority === 'Urgent';

            return matchesSearch && matchesPriority && matchesStatus;
          });

          return (
            <div className="space-y-4 animate-fade-in text-left">
              {/* CRISP COMPACT SUB-TAB BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-2.5 sm:p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 flex-1 sm:flex-none overflow-x-auto min-w-0">
                  <button
                    onClick={() => setMaintenanceSubTab('equipment')}
                    className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-md text-[11px] sm:text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                      maintenanceSubTab === 'equipment'
                        ? 'bg-amber-500 text-zinc-950 shadow'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">Equipment Log ({maintenanceLogs.length})</span>
                    {alertCount > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full flex-shrink-0">
                        {alertCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setMaintenanceSubTab('logbook')}
                    className={`flex-1 sm:flex-none px-2.5 sm:px-3.5 py-1.5 rounded-md text-[11px] sm:text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                      maintenanceSubTab === 'logbook'
                        ? 'bg-amber-500 text-zinc-950 shadow'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <StickyNote className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">Field Logbook ({officeNotes.length})</span>
                    {pendingNotesCount > 0 && (
                      <span className="bg-amber-100 dark:bg-zinc-800 text-amber-800 dark:text-amber-400 text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-full border border-amber-300 dark:border-amber-500/30 flex-shrink-0">
                        {pendingNotesCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 hidden md:inline">
                    Engr. Sahin Alom Hub
                  </span>
                  <button
                    onClick={() => maintenanceSubTab === 'equipment' ? setIsMaintenanceModalOpen(true) : setIsNoteModalOpen(true)}
                    className={`${btnAmberClass} text-xs px-3 py-1.5 cursor-pointer flex-shrink-0`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{maintenanceSubTab === 'equipment' ? 'Add Unit' : 'New Note'}</span>
                  </button>
                </div>
              </div>

              {/* SUB-TAB 1: EQUIPMENT INSPECTION & STATUS REGISTRY */}
              {maintenanceSubTab === 'equipment' && (
                <div className="space-y-6">
                  {/* AUTOMATIC INSPECTION NOTIFICATION BANNER */}
                  {alertCount > 0 && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center justify-between gap-3 text-rose-800 dark:text-rose-200">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 animate-pulse" />
                        <p className="text-xs font-medium text-rose-900 dark:text-rose-100 truncate">
                          <strong>{alertCount} Overdue Item{alertCount > 1 ? 's' : ''}:</strong> Dielectric tests or inspections required.
                        </p>
                      </div>
                      <button
                        onClick={() => setMaintenanceStatusFilter('Critical / Overdue')}
                        className="px-2.5 py-1 bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500 text-rose-800 dark:text-rose-300 hover:text-white rounded text-[11px] font-mono font-bold border border-rose-300 dark:border-rose-500/30 transition-all flex-shrink-0 cursor-pointer"
                      >
                        Filter Overdue
                      </button>
                    </div>
                  )}

                  {/* STATS SUMMARY BAR */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Tracked Units</span>
                        <Wrench className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-2xl font-display font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                        {maintenanceLogs.length}
                      </p>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Total Substation Gear</span>
                    </div>

                    <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Optimal Status</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-500 mt-1">
                        {optimalCount}
                      </p>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Inspected & Safe</span>
                    </div>

                    <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Active Work</span>
                        <Activity className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-2xl font-display font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        {inMaintCount}
                      </p>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Under Servicing</span>
                    </div>

                    <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Inspection Alert</span>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                      </div>
                      <p className="text-2xl font-display font-extrabold text-rose-600 dark:text-rose-500 mt-1">
                        {alertCount}
                      </p>
                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400">Overdue / Warning</span>
                    </div>
                  </div>

                  {/* TOOLBAR: SEARCH & FILTERS & ADD LOG BUTTON */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900/30 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-1 items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Search equipment, tag ID, location, or technician..."
                          value={maintenanceSearchQuery}
                          onChange={e => setMaintenanceSearchQuery(e.target.value)}
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                      
                      <select
                        value={maintenanceStatusFilter}
                        onChange={e => setMaintenanceStatusFilter(e.target.value)}
                        className={`${inputClass} w-44`}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Optimal">Optimal</option>
                        <option value="Requires Attention">Requires Attention</option>
                        <option value="Critical / Overdue">Critical / Overdue</option>
                        <option value="In Maintenance">In Maintenance</option>
                      </select>

                      <select
                        value={maintenanceCategoryFilter}
                        onChange={e => setMaintenanceCategoryFilter(e.target.value)}
                        className={`${inputClass} w-40 hidden md:block`}
                      >
                        <option value="All">All Categories</option>
                        <option value="Transformer">Transformer</option>
                        <option value="Switchgear">Switchgear</option>
                        <option value="PFI Plant">PFI Plant</option>
                        <option value="Generator">Generator</option>
                        <option value="Earthing Grid">Earthing Grid</option>
                      </select>
                    </div>

                    <button
                      onClick={handleOpenNewMaintenanceModal}
                      className={`${btnAmberClass} flex-shrink-0`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Log Equipment Maintenance</span>
                    </button>
                  </div>

                  {/* EQUIPMENT CARDS LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLogs.map((item) => {
                      const dueDate = new Date(item.nextInspectionDueDate);
                      const isOverdue = dueDate <= now || item.status === 'Critical / Overdue';
                      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

                      return (
                        <div
                          key={item.id}
                          className={`bg-white dark:bg-zinc-900/60 border rounded-xl p-4 space-y-3.5 transition-all relative flex flex-col justify-between shadow-sm hover:shadow-md ${
                            isOverdue 
                              ? 'border-rose-400 dark:border-rose-500/50 shadow-rose-100 dark:shadow-rose-950/20' 
                              : item.status === 'Requires Attention'
                              ? 'border-amber-400 dark:border-amber-500/40'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {/* Card Header: Tag & Status */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700">
                                TAG: {item.equipmentIdTag}
                              </span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                                item.status === 'Optimal' 
                                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                                  : item.status === 'Requires Attention'
                                  ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                  : item.status === 'Critical / Overdue'
                                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 animate-pulse'
                                  : 'bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                              }`}>
                                {item.status === 'Optimal' && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500 inline mr-1" />}
                                {item.status === 'Critical / Overdue' && <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-500 inline mr-1" />}
                                {item.status}
                              </span>
                            </div>

                            {/* Title & Category */}
                            <div>
                              <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                                {item.equipmentName}
                              </h3>
                              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3 h-3 text-amber-500" />
                                <span>{item.location}</span>
                              </p>
                            </div>
                          </div>

                          {/* Equipment Inspection Schedule Dates */}
                          <div className="bg-zinc-50 dark:bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs font-mono">
                            <div>
                              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block uppercase">Last Serviced</span>
                              <span className="text-zinc-800 dark:text-zinc-300 font-semibold">{item.lastServiceDate}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block uppercase">Next Inspection</span>
                              <span className={`font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-amber-600 dark:text-amber-500'}`}>
                                {item.nextInspectionDueDate}
                              </span>
                            </div>
                          </div>

                          {/* Days remaining badge / Notice */}
                          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span className="text-[10px] font-mono text-zinc-500">
                              Tech: <span className="text-zinc-800 dark:text-zinc-300 font-semibold">{item.technicianInCharge}</span>
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              daysDiff < 0 
                                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400' 
                                : daysDiff <= 7 
                                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400' 
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                            }`}>
                              {daysDiff < 0 ? `Overdue by ${Math.abs(daysDiff)} days` : daysDiff === 0 ? 'Due Today' : `Due in ${daysDiff} days`}
                            </span>
                          </div>

                          {/* Notes snippet */}
                          {item.notes && (
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded border border-zinc-200 dark:border-zinc-800 italic">
                              "{item.notes}"
                            </p>
                          )}

                          {/* Card Action Controls */}
                          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleQuickMarkServiced(item.id)}
                              className="px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 rounded text-[11px] font-mono font-bold flex items-center space-x-1 cursor-pointer"
                              title="Record service done today (+180 days extension & Optimal status)"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Serviced Today</span>
                            </button>

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleOpenEditMaintenanceModal(item)}
                                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-amber-600 cursor-pointer"
                                title="Edit maintenance log"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaintenanceLog(item.id)}
                                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-rose-600 cursor-pointer"
                                title="Delete equipment log"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {filteredLogs.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-2 shadow-sm">
                      <Wrench className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto" />
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">No equipment maintenance records match filter parameters.</p>
                      <button onClick={handleOpenNewMaintenanceModal} className={btnAmberClass}>
                        + Add New Equipment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: FIELD OPERATIONAL LOGBOOK & TASKS */}
              {maintenanceSubTab === 'logbook' && (() => {
                const pendingCount = officeNotes.filter(n => !n.isCompleted).length;
                const urgentCount = officeNotes.filter(n => n.priority === 'Urgent' && !n.isCompleted).length;
                const completedCount = officeNotes.filter(n => n.isCompleted).length;

                return (
                  <div className="space-y-6">
                    {/* STATS SUMMARY TILES FOR LOGBOOK */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Total Entries</span>
                          <StickyNote className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-xl font-display font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                          {officeNotes.length}
                        </p>
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">Recorded Dispatches</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Pending Action</span>
                          <Activity className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-xl font-display font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                          {pendingCount}
                        </p>
                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400/80">Active Field Tasks</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Urgent Priority</span>
                          <ShieldAlert className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-xl font-display font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                          {urgentCount}
                        </p>
                        <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400/80">Needs Immediate Action</span>
                      </div>

                      <div className="p-3.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400">Resolved & Closed</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                          {completedCount}
                        </p>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400/80">Task Checklists Done</span>
                      </div>
                    </div>

                    {/* TOOLBAR: SEARCH & PILL FILTERS */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-zinc-900/30 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      {/* Search box */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Search field logbook entries, author, or keywords..."
                          value={maintenanceSearchQuery}
                          onChange={e => setMaintenanceSearchQuery(e.target.value)}
                          className={`${inputClass} pl-9`}
                        />
                      </div>

                      {/* Filter Status Pills */}
                      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
                        <button
                          onClick={() => setNoteStatusFilter('All')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                            noteStatusFilter === 'All'
                              ? 'bg-amber-500 text-zinc-950 shadow'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          All ({officeNotes.length})
                        </button>

                        <button
                          onClick={() => setNoteStatusFilter('Pending')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                            noteStatusFilter === 'Pending'
                              ? 'bg-amber-500 text-zinc-950 shadow'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <span>Pending Action</span>
                          <span className="px-1.5 py-0.2 bg-zinc-200 dark:bg-zinc-950/40 rounded text-[10px]">
                            {pendingCount}
                          </span>
                        </button>

                        <button
                          onClick={() => setNoteStatusFilter('Urgent')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                            noteStatusFilter === 'Urgent'
                              ? 'bg-rose-500 text-white shadow'
                              : 'bg-rose-100 dark:bg-zinc-800 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-950/30'
                          }`}
                        >
                          <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-rose-500 inline" /> Urgent</span>
                          <span className="px-1.5 py-0.2 bg-rose-200 dark:bg-black/30 rounded text-[10px]">
                            {urgentCount}
                          </span>
                        </button>

                        <button
                          onClick={() => setNoteStatusFilter('Completed')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                            noteStatusFilter === 'Completed'
                              ? 'bg-emerald-500 text-zinc-950 shadow'
                              : 'bg-emerald-100 dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-950/30'
                          }`}
                        >
                          <span>Resolved</span>
                          <span className="px-1.5 py-0.2 bg-emerald-200 dark:bg-black/30 rounded text-[10px]">
                            {completedCount}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* LOGBOOK CARDS LIST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredNotes.map((note) => {
                        const authorName = note.author || 'Engr. Sahin Alom';
                        const initials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                        const isUrgent = note.priority === 'Urgent';

                        return (
                          <div
                            key={note.id}
                            className={`p-4 sm:p-5 rounded-2xl border border-l-4 transition-all text-left space-y-3.5 relative flex flex-col justify-between shadow-sm hover:shadow-md ${
                              note.isCompleted
                                ? 'border-l-emerald-500 border-zinc-200 dark:border-zinc-850 bg-zinc-50/80 dark:bg-zinc-900/30 opacity-90'
                                : isUrgent
                                ? 'border-l-rose-500 border-rose-200 dark:border-rose-500/30 bg-rose-50/60 dark:bg-rose-950/20 shadow-sm'
                                : 'border-l-amber-500 border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            <div className="space-y-2.5">
                              {/* Header: Author Avatar & Date & Priority Badge */}
                              <div className="flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5">
                                <div className="flex items-center space-x-2.5">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-extrabold text-xs shadow-inner flex-shrink-0 ${
                                    isUrgent 
                                      ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40' 
                                      : note.isCompleted
                                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                                      : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                                  }`}>
                                    {initials}
                                  </div>

                                  <div>
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                        {authorName}
                                      </span>
                                      <span className="text-[9px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded">
                                        Field Eng.
                                      </span>
                                    </div>
                                    <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-400 inline" /> {note.date}</span>
                                    </p>
                                  </div>
                                </div>

                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 flex-shrink-0 ${
                                  note.isCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                    : isUrgent
                                    ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/40 animate-pulse'
                                    : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                }`}>
                                  {note.isCompleted ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                      <span>Resolved</span>
                                    </>
                                  ) : isUrgent ? (
                                    <>
                                      <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                      <span>Urgent Dispatch</span>
                                    </>
                                  ) : (
                                    <>
                                      <Activity className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                      <span>Pending Task</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              {/* Title & Checkbox */}
                              <div className="flex items-start space-x-3 pt-1">
                                <button
                                  onClick={() => handleToggleOfficeNote(note.id)}
                                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                                    note.isCompleted
                                      ? 'bg-emerald-500 border-emerald-500 text-zinc-950 font-bold'
                                      : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-500 bg-zinc-50 dark:bg-zinc-950/40'
                                  }`}
                                  title={note.isCompleted ? 'Mark as pending' : 'Mark as resolved'}
                                >
                                  {note.isCompleted && <CheckCircle2 className="w-4 h-4 text-zinc-950" />}
                                </button>

                                <div className="space-y-1 flex-1">
                                  <h4 className={`font-display font-bold text-sm leading-snug ${
                                    note.isCompleted ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'
                                  }`}>
                                    {note.title}
                                  </h4>

                                  {note.content && (
                                    <div className="text-xs text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-850 leading-relaxed font-sans mt-2">
                                      {note.content}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Footer */}
                            <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                              <button
                                onClick={() => handleToggleOfficeNote(note.id)}
                                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded transition-all cursor-pointer flex items-center space-x-1 ${
                                  note.isCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/20'
                                    : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/20'
                                }`}
                              >
                                {note.isCompleted ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Task Completed (Click to Reopen)</span>
                                  </>
                                ) : (
                                  <>
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>Mark Task Resolved</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteOfficeNote(note.id)}
                                className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded transition-all cursor-pointer"
                                title="Delete entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {filteredNotes.length === 0 && (
                      <div className="text-center py-12 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850 rounded-2xl space-y-3 shadow-sm">
                        <StickyNote className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">No field operational log entries match your filter parameters.</p>
                        <button onClick={() => setIsNoteModalOpen(true)} className={btnAmberClass}>
                          + Post Field Log Entry
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* MODALS & OVERLAYS FOR CMS BUSINESS MODULES               */}
        {/* ========================================================= */}

        {/* 1. PRODUCT ADD / EDIT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
                </h3>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                {/* Product Name */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono font-bold">Item / Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11kV VCB Switchgear Panel"
                    value={productForm.name || ''}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Product Image Upload Section */}
                <div className="p-3.5 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 rounded-lg border border-zinc-850 dark:border-zinc-800 space-y-2">
                  <label className="block font-mono text-[11px] text-amber-500 font-bold uppercase">
                    Product / Equipment Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold text-xs rounded-md cursor-pointer flex items-center justify-center space-x-1.5 transition-colors shrink-0">
                      <Image className="w-3.5 h-3.5 text-amber-500" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                    </label>

                    <input 
                      type="url"
                      placeholder="Or paste image URL (e.g. https://...)"
                      value={productForm.imageUrl || ''}
                      onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  {productForm.imageUrl && (
                    <div className="relative rounded-md overflow-hidden border border-amber-500/30 bg-zinc-900 h-28 flex items-center justify-center">
                      <img src={productForm.imageUrl} alt="Product Preview" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imageUrl: '' })}
                        className="absolute top-1.5 right-1.5 px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold shadow flex items-center space-x-1 cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Category</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="Substation & Power Equipment">Substation & Power Equipment</option>
                      <option value="Cables & Conductors">Cables & Conductors</option>
                      <option value="Transformers & Switchgear">Transformers & Switchgear</option>
                      <option value="Protection & Relay Panels">Protection & Relay Panels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Stock Status</label>
                    <select
                      value={productForm.stockStatus}
                      onChange={e => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Multi-tier pricing breakdown if present */}
                {(productForm.topPrice || productForm.middlePricePerFt || productForm.bottomPrice) ? (
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-2">
                    <span className="text-[10px] text-amber-500 font-mono font-bold block uppercase">Tiered Component Pricing</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-400">Top Cap / Terminal</label>
                        <input
                          type="number"
                          placeholder="৳ 350"
                          value={productForm.topPrice || ''}
                          onChange={e => setProductForm({ ...productForm, topPrice: Number(e.target.value) })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400">Span Rate (Per Ft)</label>
                        <input
                          type="number"
                          placeholder="৳ 180"
                          value={productForm.middlePricePerFt || ''}
                          onChange={e => setProductForm({ ...productForm, middlePricePerFt: Number(e.target.value) })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400">Base Foundation</label>
                        <input
                          type="number"
                          placeholder="৳ 400"
                          value={productForm.bottomPrice || ''}
                          onChange={e => setProductForm({ ...productForm, bottomPrice: Number(e.target.value) })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Unit Price (BDT)</label>
                      <input
                        type="number"
                        placeholder="৳ 540"
                        value={productForm.unitPrice || ''}
                        onChange={e => setProductForm({ ...productForm, unitPrice: Number(e.target.value) })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Unit Measurement</label>
                      <input
                        type="text"
                        placeholder="Job / Meter / Piece / Set"
                        value={productForm.unit || ''}
                        onChange={e => setProductForm({ ...productForm, unit: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className={btnSecondaryClass}>
                    Cancel
                  </button>
                  <button type="submit" className={btnAmberClass}>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. CUSTOMER ADD / EDIT MODAL */}
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left my-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  <span>{editingCustomer ? 'Edit Industrial Client Profile' : 'Add New Industrial Client'}</span>
                </h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs">
                {/* Company Name */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Company / Factory Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gazipur Spinning & Apparels Ltd. / Square Pharma Unit-2"
                    value={customerForm.name || ''}
                    onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Contact Person & Industry Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Contact Person & Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engr. Tanvir Ahmed (DGM Electrical)"
                      value={customerForm.contactPerson || ''}
                      onChange={e => setCustomerForm({ ...customerForm, contactPerson: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Industry Sector
                    </label>
                    <select
                      value={customerForm.industrySector || 'Textile & RMG'}
                      onChange={e => setCustomerForm({ ...customerForm, industrySector: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Textile & RMG">Textile & RMG</option>
                      <option value="Pharmaceuticals">Pharmaceuticals</option>
                      <option value="Steel & Heavy Metal">Steel & Heavy Metal</option>
                      <option value="Power & Energy">Power & Energy</option>
                      <option value="Commercial Complex">Commercial Complex</option>
                    </select>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="01711XXXXXX"
                      value={customerForm.phone || ''}
                      onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="8801711XXXXXX"
                      value={customerForm.whatsapp || ''}
                      onChange={e => setCustomerForm({ ...customerForm, whatsapp: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Email & Substation Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="electrical@plant.com"
                      value={customerForm.email || ''}
                      onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Substation & Load Specifications
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11kV Substation / 2000 kVA Transformer"
                      value={customerForm.substationCapacity || ''}
                      onChange={e => setCustomerForm({ ...customerForm, substationCapacity: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Status & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Client Status
                    </label>
                    <select
                      value={customerForm.status || 'Active Client'}
                      onChange={e => setCustomerForm({ ...customerForm, status: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="Active Client">Active Client</option>
                      <option value="On-Going Contract">On-Going Contract</option>
                      <option value="Lead / Inquiry">Lead / Inquiry</option>
                      <option value="Completed Site">Completed Site</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Plant / Factory Site Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BSCIC Industrial Area, Tongi, Gazipur"
                      value={customerForm.address || ''}
                      onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Technical Notes */}
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Technical Notes & Service Record
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Transformer oil filtration required, PFI plant capacitor testing scheduled..."
                    value={customerForm.notes || ''}
                    onChange={e => setCustomerForm({ ...customerForm, notes: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setIsCustomerModalOpen(false)} className={btnSecondaryClass}>
                    Cancel
                  </button>
                  <button type="submit" className={btnAmberClass}>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CUSTOMER DOSSIER & HISTORY MODAL */}
        {selectedCustomerDetail && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-left my-6 animate-fade-in">
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold flex items-center justify-center font-mono text-xl">
                    {selectedCustomerDetail.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <span>{selectedCustomerDetail.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {selectedCustomerDetail.status || 'Active Client'}
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                      {selectedCustomerDetail.contactPerson || 'Engineer Contact N/A'} • {selectedCustomerDetail.industrySector || 'Industrial Facility'}
                    </p>
                  </div>
                </div>

                <button onClick={() => setSelectedCustomerDetail(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Facility Specs Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Phone & Contact</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{selectedCustomerDetail.phone}</div>
                  {selectedCustomerDetail.email && <div className="text-[10px] text-zinc-500 truncate">{selectedCustomerDetail.email}</div>}
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Substation Capacity</span>
                  <div className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1"><Zap className="w-3.5 h-3.5 inline" /><span>{selectedCustomerDetail.substationCapacity || '11kV Substation'}</span></div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Plant Site Address</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 line-clamp-1">{selectedCustomerDetail.address}</div>
                </div>
              </div>

              {/* Linked Invoices & Work Orders */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-amber-500" />
                    <span>Work Orders & Service Billing History</span>
                  </h4>
                  <button
                    onClick={() => {
                      setSelectedCustomerDetail(null);
                      setOrderForm({
                        customerName: selectedCustomerDetail.name,
                        customerPhone: selectedCustomerDetail.phone,
                        customerAddress: selectedCustomerDetail.address,
                        items: [],
                        paidAmount: 0,
                        paymentMethod: 'Bank Transfer / Cheque',
                        status: 'Completed',
                        notes: `Service for ${selectedCustomerDetail.name}`
                      });
                      setIsOrderModalOpen(true);
                    }}
                    className="text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Create Work Order</span>
                  </button>
                </div>

                {(() => {
                  const linkedOrders = orders.filter(o => 
                    o.customerName.toLowerCase().includes(selectedCustomerDetail.name.toLowerCase()) || 
                    (selectedCustomerDetail.phone && o.customerPhone && o.customerPhone.includes(selectedCustomerDetail.phone))
                  );

                  if (linkedOrders.length === 0) {
                    return (
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200 dark:border-zinc-850 text-center text-xs text-zinc-500">
                        No previous invoice records found for this client.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {/* Mobile Cards View */}
                      <div className="space-y-2.5 sm:hidden">
                        {linkedOrders.map(ord => (
                          <div key={ord.id} className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-2 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">{ord.invoiceNo}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{ord.date}</span>
                            </div>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                              {ord.items.map(i => i.productName).join(', ')}
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                Total: ৳ {(ord.grandTotal ?? (ord as any).totalAmount ?? 0).toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedCustomerDetail(null);
                                  setSelectedInvoice(ord);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 text-zinc-950 font-bold text-[10px] hover:bg-amber-400 transition-colors cursor-pointer"
                              >
                                Print A4 Memo
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden sm:block border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 text-[10px] uppercase">
                            <tr>
                              <th className="p-2.5">Invoice #</th>
                              <th className="p-2.5">Date</th>
                              <th className="p-2.5">Items</th>
                              <th className="p-2.5 text-right">Total (BDT)</th>
                              <th className="p-2.5 text-right">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-sans">
                            {linkedOrders.map(ord => (
                              <tr key={ord.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                                <td className="p-2.5 font-mono font-bold text-amber-600 dark:text-amber-400">{ord.invoiceNo}</td>
                                <td className="p-2.5 text-zinc-500">{ord.date}</td>
                                <td className="p-2.5 text-zinc-700 dark:text-zinc-300">
                                  {ord.items.map(i => i.productName).join(', ')}
                                </td>
                                <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                  ৳ {(ord.grandTotal ?? (ord as any).totalAmount ?? 0).toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedCustomerDetail(null);
                                      setSelectedInvoice(ord);
                                    }}
                                    className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold text-[10px] hover:bg-amber-400 transition-colors cursor-pointer"
                                  >
                                    Print A4
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <a
                  href={`tel:${selectedCustomerDetail.phone}`}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold font-mono inline-flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Call ({selectedCustomerDetail.phone})</span>
                </a>

                <button onClick={() => setSelectedCustomerDetail(null)} className={btnSecondaryClass}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WHATSAPP TEMPLATE BUILDER MODAL */}
        {whatsAppModalCustomer && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span>WhatsApp Message Assistant</span>
                </h3>
                <button onClick={() => setWhatsAppModalCustomer(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
                  <div className="font-bold text-sm">{whatsAppModalCustomer.name}</div>
                  <div className="font-mono text-[11px] mt-0.5">
                    WhatsApp No: {whatsAppModalCustomer.whatsapp || whatsAppModalCustomer.phone}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Select Preset Message Template:
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      {
                        id: 'inspection_report',
                        title: '1. Substation Inspection & Thermal Audit Report Ready',
                        text: `Dear Sir, Greetings from Engr. Md. Sahin Alom. The 11kV substation thermal audit and safety inspection report for ${whatsAppModalCustomer.name} is ready for review. Thank you.`
                      },
                      {
                        id: 'maintenance_due',
                        title: '2. Transformer & PFI Maintenance Due Reminder',
                        text: `Dear Sir, Scheduled maintenance for the transformer and PFI plant at ${whatsAppModalCustomer.name} is due soon. Please let us know if you require technical service. - Engr. Md. Sahin Alom`
                      },
                      {
                        id: 'invoice_followup',
                        title: '3. Service Invoice & Billing Update',
                        text: `Dear Sir, A new service invoice has been issued for your plant site by Engr. Md. Sahin Alom. Please reply if you require any billing details or payment clarification.`
                      },
                      {
                        id: 'general_greetings',
                        title: '4. General Technical Inquiry & Support',
                        text: `Dear Sir, Greetings from Engr. Md. Sahin Alom. Please let us know if you require any emergency technical support or equipment servicing for your factory substation.`
                      }
                    ].map(tpl => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          setCustomWaTemplate(tpl.id);
                          setCustomWaText(tpl.text);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          customWaTemplate === tpl.id
                            ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 text-zinc-900 dark:text-zinc-100 font-bold'
                            : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="font-semibold">{tpl.title}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Review & Customize Message:
                  </label>
                  <textarea
                    rows={4}
                    value={customWaText}
                    onChange={e => setCustomWaText(e.target.value)}
                    className={`${inputClass} font-sans leading-relaxed`}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setWhatsAppModalCustomer(null)} className={btnSecondaryClass}>
                    Cancel
                  </button>
                  <a
                    href={`https://wa.me/${(whatsAppModalCustomer.whatsapp || whatsAppModalCustomer.phone).replace(/\D/g, '')}?text=${encodeURIComponent(customWaText)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setWhatsAppModalCustomer(null)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono inline-flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDER CREATION MODAL */}
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-left my-8 animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-500" />
                  <span>Create Work Order & Service Invoice</span>
                </h3>
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Client / Firm Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Power / Engr. Tanvir"
                      value={orderForm.customerName || ''}
                      onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="01711XXXXXX"
                      value={orderForm.customerPhone || ''}
                      onChange={e => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Site Address</label>
                    <input
                      type="text"
                      placeholder="Plant / Site Location"
                      value={orderForm.customerAddress || ''}
                      onChange={e => setOrderForm({ ...orderForm, customerAddress: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Quick Add Items Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-500 font-mono">Billable Line Items</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [...(orderForm.items || []), { productName: 'Substation Servicing', quantity: 1, unitPrice: 5000, totalAmount: 5000 }];
                        setOrderForm({ ...orderForm, items: newItems });
                      }}
                      className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-mono text-[10px] font-bold"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(orderForm.items || []).map((item, idx) => (
                      <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center">
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] text-zinc-500 font-mono sm:hidden mb-0.5">Item Description</label>
                          <input
                            type="text"
                            placeholder="Service/Product name (e.g. VCB Maintenance)"
                            value={item.productName}
                            onChange={e => {
                              const updated = [...orderForm.items];
                              updated[idx].productName = e.target.value;
                              setOrderForm({ ...orderForm, items: updated });
                            }}
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:col-span-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[10px] text-zinc-500 font-mono sm:hidden mb-0.5">Qty</label>
                            <input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={e => {
                                const updated = [...orderForm.items];
                                const qty = Number(e.target.value);
                                updated[idx].quantity = qty;
                                updated[idx].totalAmount = qty * updated[idx].unitPrice;
                                setOrderForm({ ...orderForm, items: updated });
                              }}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500 font-mono sm:hidden mb-0.5">Rate (৳)</label>
                            <input
                              type="number"
                              placeholder="Rate (৳)"
                              value={item.unitPrice}
                              onChange={e => {
                                const updated = [...orderForm.items];
                                const rate = Number(e.target.value);
                                updated[idx].unitPrice = rate;
                                updated[idx].totalAmount = updated[idx].quantity * rate;
                                setOrderForm({ ...orderForm, items: updated });
                              }}
                              className={inputClass}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:col-span-3 sm:justify-end sm:space-x-2 pt-1 sm:pt-0 border-t sm:border-0 border-zinc-900">
                          <span className="text-[10px] text-zinc-500 font-mono sm:hidden">Item Total:</span>
                          <span className="font-mono font-bold text-amber-500 text-sm sm:text-xs">
                            ৳ {(item.totalAmount || 0).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = orderForm.items.filter((_, i) => i !== idx);
                              setOrderForm({ ...orderForm, items: updated });
                            }}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            title="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculation summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono">
                  <div>
                    <label className="block text-zinc-400 text-[10px]">Discount (৳)</label>
                    <input
                      type="number"
                      value={orderForm.discount || 0}
                      onChange={e => setOrderForm({ ...orderForm, discount: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-[10px]">Received Amount (৳)</label>
                    <input
                      type="number"
                      value={orderForm.paidAmount || 0}
                      onChange={e => setOrderForm({ ...orderForm, paidAmount: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-[10px]">Status</label>
                    <select
                      value={orderForm.status || 'Due'}
                      onChange={e => setOrderForm({ ...orderForm, status: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="Due">Due</option>
                      <option value="Completed">Completed</option>
                      <option value="Processing">Processing</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setIsOrderModalOpen(false)} className={btnSecondaryClass}>
                    Cancel
                  </button>
                  <button type="submit" className={btnAmberClass}>
                    <Printer className="w-4 h-4" />
                    <span>Generate & Save Invoice</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. OFFICE NOTE MODAL */}
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Create Field Logbook Note
                </h3>
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOfficeNote} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule transformer oil filtration at Gazipur plant tomorrow"
                    value={noteForm.title || ''}
                    onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Logged By</label>
                    <input
                      type="text"
                      value={noteForm.author || 'Engr. Sahin Alom'}
                      onChange={e => setNoteForm({ ...noteForm, author: e.target.value })}
                      className={inputClass}
                      placeholder="Engr. Sahin Alom"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Priority</label>
                    <select
                      value={noteForm.priority || 'Standard'}
                      onChange={e => setNoteForm({ ...noteForm, priority: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Urgent">Urgent Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Detailed Instructions</label>
                  <textarea
                    rows={3}
                    placeholder="Operation log details, safety checklist, or site dispatch note..."
                    value={noteForm.content || ''}
                    onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setIsNoteModalOpen(false)} className={btnSecondaryClass}>
                    Cancel
                  </button>
                  <button type="submit" className={btnAmberClass}>
                    <Save className="w-4 h-4" />
                    <span>Save Log Note</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MAINTENANCE LOG ADD/EDIT MODAL */}
        {isMaintenanceModalOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-left my-8 animate-fade-in">
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  <span>{editingMaintenanceLog ? 'Update Equipment Maintenance Record' : 'New Maintenance Record'}</span>
                </h3>
                <button onClick={() => setIsMaintenanceModalOpen(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMaintenanceLog} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 630 kVA HT/LT Power Transformer"
                    value={maintenanceForm.equipmentName || ''}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, equipmentName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Identification Tag *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TR-01-S1"
                      value={maintenanceForm.equipmentIdTag || ''}
                      onChange={e => setMaintenanceForm({ ...maintenanceForm, equipmentIdTag: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Category</label>
                    <select
                      value={maintenanceForm.category || 'Transformer'}
                      onChange={e => setMaintenanceForm({ ...maintenanceForm, category: e.target.value })}
                      className={inputClass}
                    >
                      <option value="Transformer">Transformer</option>
                      <option value="Switchgear">Switchgear / VCB</option>
                      <option value="PFI Plant">PFI Capacitor Bank</option>
                      <option value="Generator">Diesel Generator</option>
                      <option value="Earthing Grid">Earthing Grid</option>
                      <option value="Distribution Panel">Distribution Panel / MCCB</option>
                      <option value="Protection Relay">Protection Relay</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Plant / Substation Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Substation Yard - Gazipur Plant"
                    value={maintenanceForm.location || ''}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, location: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Current Equipment Status</label>
                    <select
                      value={maintenanceForm.status || 'Optimal'}
                      onChange={e => setMaintenanceForm({ ...maintenanceForm, status: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="Optimal">Optimal (Inspected & Safe)</option>
                      <option value="Requires Attention">Requires Attention</option>
                      <option value="Critical / Overdue">Critical / Overdue</option>
                      <option value="In Maintenance">In Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Priority</label>
                    <select
                      value={maintenanceForm.priority || 'Routine'}
                      onChange={e => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="Routine">Routine</option>
                      <option value="High">High Priority</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Last Service Date</label>
                    <input
                      type="date"
                      value={maintenanceForm.lastServiceDate || ''}
                      onChange={e => setMaintenanceForm({ ...maintenanceForm, lastServiceDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-rose-400 mb-1 font-mono font-bold">Next Inspection Due Date</label>
                    <input
                      type="date"
                      value={maintenanceForm.nextInspectionDueDate || ''}
                      onChange={e => setMaintenanceForm({ ...maintenanceForm, nextInspectionDueDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Technician In Charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Engr. Sahin Alom"
                    value={maintenanceForm.technicianInCharge || ''}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, technicianInCharge: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Engineering Inspection Notes</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Oil dielectric breakdown voltage test result, breaker trip times, megger test readings..."
                    value={maintenanceForm.notes || ''}
                    onChange={e => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <button type="button" onClick={() => setIsMaintenanceModalOpen(false)} className={btnSecondaryClass}>
                    Cancel
                  </button>
                  <button type="submit" className={btnAmberClass}>
                    <Save className="w-4 h-4" />
                    <span>Save Maintenance Record</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. A4 PRINTABLE INVOICE MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white text-zinc-900 rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl text-left my-8 animate-fade-in print:p-0 print:shadow-none print:m-0 print:w-full">
              {/* Header Bar Actions (Hidden during print) */}
              <div className="flex justify-between items-center border-b pb-4 print:hidden">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-600">
                  <Printer className="w-4 h-4" />
                  <span>Print Preview - A4 Work Order Invoice</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold rounded text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* PRINTABLE MEMO CONTENT */}
              <div className="border-2 border-zinc-900 p-6 rounded-lg space-y-6">
                {/* Brand Title Header */}
                <div className="text-center border-b-2 border-zinc-900 pb-4">
                  <h1 className="text-2xl font-black text-zinc-950 tracking-tight">ENGR. MD. SAHIN ALOM</h1>
                  <p className="text-xs font-bold text-zinc-700 mt-0.5">Electrical Engineer • B.Sc. in EEE (Green University of Bangladesh)</p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    Industrial Substation Design, VCB/LBS Panels, Transformers & Switchgear Maintenance
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    Dhaka, Bangladesh | Phone: +880 1760-816120 | Email: sardershain@gmail.com
                  </p>
                </div>

                {/* Memo & Customer Details Grid */}
                <div className="flex justify-between items-start text-xs font-mono">
                  <div className="space-y-1">
                    <p><strong>Client / Organization:</strong> {selectedInvoice.customerName}</p>
                    <p><strong>Contact Phone:</strong> {selectedInvoice.customerPhone}</p>
                    <p><strong>Site Location:</strong> {selectedInvoice.customerAddress || 'Dhaka'}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p><strong>Invoice No:</strong> <span className="font-bold text-amber-600">{selectedInvoice.invoiceNo}</span></p>
                    <p><strong>Date:</strong> {selectedInvoice.date}</p>
                    <p><strong>Issued By:</strong> {selectedInvoice.createdRole || (selectedInvoice as any).createdBy || 'Engr. Sahin Alom'}</p>
                  </div>
                </div>

                {/* Itemized Cards for Mobile Screen View */}
                <div className="space-y-2.5 sm:hidden print:hidden">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider block">Itemized Scope ({selectedInvoice.items.length} items):</span>
                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-zinc-50 rounded-lg border border-zinc-300 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-zinc-900 font-sans text-sm flex-1">{idx + 1}. {item.productName}</span>
                        <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs ml-2">
                          ৳ {(item.totalPrice || (item as any).totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-600 pt-1 border-t border-zinc-200">
                        <span>Quantity: <strong>{item.quantity}</strong></span>
                        <span>Unit Rate: <strong>৳ {(item.pricePerUnit || (item as any).unitPrice || 0).toLocaleString()}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Itemized Table for Desktop & A4 Print */}
                <table className="hidden sm:table print:table w-full text-xs font-mono border-collapse border border-zinc-900">
                  <thead>
                    <tr className="bg-zinc-100 border-b border-zinc-900 text-left">
                      <th className="p-2 border-r border-zinc-900">SL</th>
                      <th className="p-2 border-r border-zinc-900">Item Description / Technical Scope</th>
                      <th className="p-2 border-r border-zinc-900 text-center">Qty</th>
                      <th className="p-2 border-r border-zinc-900 text-right">Unit Rate (৳)</th>
                      <th className="p-2 text-right">Total (৳)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-zinc-300">
                        <td className="p-2 border-r border-zinc-900">{idx + 1}</td>
                        <td className="p-2 border-r border-zinc-900 font-sans font-medium">{item.productName}</td>
                        <td className="p-2 border-r border-zinc-900 text-center">{item.quantity}</td>
                        <td className="p-2 border-r border-zinc-900 text-right">৳ {(item.pricePerUnit || (item as any).unitPrice || 0).toLocaleString()}</td>
                        <td className="p-2 text-right font-bold">৳ {(item.totalPrice || (item as any).totalAmount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals & Due Breakdown */}
                <div className="flex justify-between items-end pt-2 text-xs font-mono">
                  <div className="text-[10px] text-zinc-500 space-y-1">
                    <p>• Goods & technical equipment once accepted on site are non-refundable.</p>
                    <p>• Please inspect testing reports and physical condition upon delivery.</p>
                  </div>
                  <div className="w-64 space-y-1 border-t border-zinc-900 pt-2 text-right">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>৳ {(selectedInvoice.subtotal ?? (selectedInvoice as any).subTotal ?? 0).toLocaleString()}</span>
                    </div>
                    {(selectedInvoice.discount || 0) > 0 && (
                      <div className="flex justify-between text-rose-600">
                        <span>Discount:</span>
                        <span>- ৳ {(selectedInvoice.discount || 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t border-zinc-400 pt-1 text-sm">
                      <span>Grand Total:</span>
                      <span>৳ {(selectedInvoice.grandTotal || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Received Amount:</span>
                      <span>৳ {(selectedInvoice.paidAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-bold border-t border-zinc-300 pt-1">
                      <span>Balance Due:</span>
                      <span>৳ {(selectedInvoice.dueAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="flex justify-between items-center pt-12 text-xs font-mono">
                  <div className="text-center border-t border-zinc-900 pt-1 w-36">
                    Client's Signature
                  </div>
                  <div className="text-center border-t border-zinc-900 pt-1 w-48">
                    Engr. Md. Sahin Alom<br />
                    <span className="text-[10px] text-zinc-500">Electrical Engineer (B.Sc. in EEE)</span>
                  </div>
                </div>
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

