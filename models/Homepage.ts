import mongoose, { Model } from 'mongoose';

export interface IHomepage {
  heroTagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;
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
  showDailyCheck?: boolean;
  dailyCheckTagline?: string;
  dailyCheckTitle?: string;
  dailyCheckDesc?: string;
  caseStudiesTagline?: string;
  caseStudiesHeading?: string;
  caseStudiesDesc?: string;
  expertiseTagline: string;
  expertiseHeading: string;
  expertiseDesc: string;
  journalTagline?: string;
  journalHeading?: string;
  journalDesc?: string;
  featuredBlogsTagline?: string;
  featuredBlogsHeading?: string;
  featuredBlogsDesc?: string;
  contactTagline: string;
  contactHeading: string;
  contactDesc: string;
  contactEmail: string;
  contactLinkedin: string;
  contactGithub: string;
  contactWhatsapp?: string;
  headerLogoIcon?: string;
}

export interface IHomepageDocument extends IHomepage, mongoose.Document {}

const HomepageSchema = new mongoose.Schema<IHomepage>({
  heroTagline: String,
  heroHeading: String,
  heroSubheading: String,
  heroCtaPrimaryText: String,
  heroCtaSecondaryText: String,
  heroStat1Val: String,
  heroStat1Label: String,
  heroStat2Val: String,
  heroStat2Label: String,
  heroStat3Val: String,
  heroStat3Label: String,
  heroProfileName: String,
  heroProfileTitle: String,
  heroProfileImage: String,
  heroProfileVideo: String,
  showDailyCheck: Boolean,
  dailyCheckTagline: String,
  dailyCheckTitle: String,
  dailyCheckDesc: String,
  caseStudiesTagline: String,
  caseStudiesHeading: String,
  caseStudiesDesc: String,
  expertiseTagline: String,
  expertiseHeading: String,
  expertiseDesc: String,
  journalTagline: String,
  journalHeading: String,
  journalDesc: String,
  featuredBlogsTagline: String,
  featuredBlogsHeading: String,
  featuredBlogsDesc: String,
  contactTagline: String,
  contactHeading: String,
  contactDesc: String,
  contactEmail: String,
  contactLinkedin: String,
  contactGithub: String,
  contactWhatsapp: String,
  headerLogoIcon: String
}, { minimize: false, timestamps: true });

export const Homepage: Model<IHomepageDocument> = mongoose.models.Homepage || mongoose.model<IHomepageDocument>('Homepage', HomepageSchema);
