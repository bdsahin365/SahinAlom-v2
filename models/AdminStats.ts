import mongoose, { Model } from 'mongoose';

export interface IAdminStats {
  visitors: number;
  caseStudiesCount: number;
  contactRequests: number;
  avgReadTime: string;
}

export interface IAdminStatsDocument extends IAdminStats, mongoose.Document {}

const AdminStatsSchema = new mongoose.Schema<IAdminStats>({
  visitors: { type: Number, default: 0 },
  caseStudiesCount: { type: Number, default: 0 },
  contactRequests: { type: Number, default: 0 },
  avgReadTime: { type: String, default: '5 min' }
}, { minimize: false, timestamps: true });

export const AdminStats: Model<IAdminStatsDocument> = mongoose.models.AdminStats || mongoose.model<IAdminStatsDocument>('AdminStats', AdminStatsSchema);
