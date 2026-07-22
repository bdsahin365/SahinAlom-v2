export const ELECTRICAL_CATEGORIES = [
  'Substation & Power Distribution',
  'BNBC Code & Electrical Safety',
  'Cable Sizing & Load Calculations',
  'Transformers & Protection Relays',
  'Lighting Design & Emergency Power',
  'Industrial Troubleshooting & PFI'
] as const;

export type ElectricalCategory = typeof ELECTRICAL_CATEGORIES[number];

export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  shortDesc: string;
  problem: string;
  calculation: string;
  solution: string;
  results: string[];
  imageUrl?: string;
  galleryImages?: string[];
  duration?: string;
  specs?: {
    voltage?: string;
    capacity?: string;
    duration?: string;
    equipment?: string;
    standard?: string;
    sector?: string;
  };
}

export interface ReadingItem {
  label: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
  unit: string;
}

export interface TimelineStep {
  time: string;
  title: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  date: string;
}

export interface AdminStats {
  visitors: number;
  caseStudiesCount: number;
  contactRequests: number;
  avgReadTime: string;
}

export interface ProfileExperience {
  role: string;
  company: string;
  period: string;
  details: string; // semicolon separated or newline separated
}

export interface ProfileEducation {
  degree: string;
  institution: string;
  passingYear: string;
  result?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  summary: string;
  skills: string; // comma separated
  imageUrl?: string;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  personalDetails: {
    dob: string;
    height: string;
    weight: string;
    bloodGroup: string;
    maritalStatus: string;
    religion: string;
    nationality: string;
    presentAddress: string;
    permanentAddress: string;
    fatherName: string;
    fatherProfession: string;
    motherName: string;
    motherProfession: string;
    siblings: string;
  };
}

export interface HomepageContent {
  heroTagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroStat1Val: string;
  heroStat1Label: string;
  heroStat2Val: string;
  heroStat2Label: string;
  heroStat3Val: string;
  heroStat3Label: string;
  heroProfileName: string;
  heroProfileTitle: string;
  heroProfileImage?: string;
  heroProfileVideo?: string;
  journalTagline: string;
  journalHeading: string;
  journalDesc: string;
  expertiseTagline: string;
  expertiseHeading: string;
  expertiseDesc: string;
  contactTagline: string;
  contactHeading: string;
  contactDesc: string;
  contactEmail: string;
  contactLinkedin: string;
  contactGithub: string;
  headerLogoIcon?: string;
}

export interface AppSettings {
  showBottomNav: boolean;
  defaultTheme: 'dark' | 'light';
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string; // Markdown or plain text with rich paragraphs
  tags: string[];
  imageUrl?: string;
  published: boolean;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  industrySector?: string; // 'Textile & RMG' | 'Pharmaceuticals' | 'Steel & Heavy Metal' | 'Power & Energy' | 'Commercial Complex' | 'Food & Beverage'
  substationCapacity?: string; // e.g. '11kV / 630 kVA Substation'
  status?: 'Active Client' | 'On-Going Contract' | 'Lead / Inquiry' | 'Completed Site';
  notes?: string;
  totalOrders: number;
  totalSpent?: number;
  lastServiceDate?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  topPrice?: number;
  middlePricePerFt?: number;
  bottomPrice?: number;
  unitPrice?: number;
  unit: string; // "পিস", "রানিং ফুট", "টন", "স্কয়ার ফুট", "বস্তা"
  stockStatus: 'ইন স্টক' | 'স্টক কম' | 'স্টক আউট';
}

export interface OrderItem {
  productId: string;
  productName: string;
  variant?: 'Top' | 'Middle' | 'Bottom' | 'General';
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface OrderInvoice {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: 'সম্পন্ন' | 'বকেয়া' | 'প্রসেসিং' | 'বাতিল';
  createdRole: 'Admin' | 'Staff';
  notes?: string;
}

export interface OfficeNote {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'সাধারণ' | 'জরুরি' | 'উচ্চ অগ্রাধিকার';
  isCompleted: boolean;
  author: string;
}

export interface MaintenanceLog {
  id: string;
  equipmentName: string;
  equipmentIdTag: string;
  location: string;
  category: string;
  status: 'Optimal' | 'Requires Attention' | 'Critical / Overdue' | 'In Maintenance';
  lastServiceDate: string;
  nextInspectionDueDate: string;
  technicianInCharge: string;
  priority: 'Routine' | 'High' | 'Emergency';
  notes?: string;
}

export interface QuickFieldNote {
  id: string;
  title: string;
  content: string;
  transcriptRaw?: string;
  category: string;
  equipmentTag?: string;
  author: string;
  createdAt: string;
  status: 'Draft' | 'Saved' | 'ConvertedToBlog' | 'ConvertedToCaseStudy';
  isAiEnhanced?: boolean;
  aiEnhancedContent?: string;
  language?: 'bn-BD' | 'en-US';
}





