import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICaseStudySpecs {
  voltage?: string;
  capacity?: string;
  duration?: string;
  equipment?: string;
  standard?: string;
  sector?: string;
}

export interface ICaseStudy extends Document {
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
  specs?: ICaseStudySpecs;
  createdAt?: Date;
  updatedAt?: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    slug: { type: String, unique: true, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String }],
    shortDesc: { type: String },
    problem: { type: String },
    calculation: { type: String },
    solution: { type: String },
    results: [{ type: String }],
    imageUrl: { type: String },
    galleryImages: [{ type: String }],
    duration: { type: String },
    specs: {
      voltage: String,
      capacity: String,
      duration: String,
      equipment: String,
      standard: String,
      sector: String
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const CaseStudy: Model<ICaseStudy> =
  mongoose.models.CaseStudy || mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);

export default CaseStudy;
