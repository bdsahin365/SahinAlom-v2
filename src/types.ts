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
  duration?: string;
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


