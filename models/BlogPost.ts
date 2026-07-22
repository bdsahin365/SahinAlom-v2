import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  author?: string;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, unique: true, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: "General Engineering Tips" },
    date: { type: String },
    readTime: { type: String, default: "5 min" },
    summary: { type: String },
    content: { type: String, required: true },
    tags: [{ type: String }],
    imageUrl: { type: String },
    published: { type: Boolean, default: true },
    author: { type: String, default: "Engr. Sahin Sarder" },
    views: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
