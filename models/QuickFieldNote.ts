import mongoose, { Model } from 'mongoose';

export interface IQuickFieldNote {
  id: string;
  title: string;
  content: string;
  transcriptRaw?: string;
  category: string;
  equipmentTag?: string;
  author: string;
  createdAt: string;
  status: string;
  isAiEnhanced?: boolean;
  aiEnhancedContent?: string;
  language?: string;
}

export interface IQuickFieldNoteDocument extends IQuickFieldNote, mongoose.Document {}

const QuickFieldNoteSchema = new mongoose.Schema<IQuickFieldNote>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  transcriptRaw: String,
  category: { type: String, required: true },
  equipmentTag: String,
  author: { type: String, required: true },
  createdAt: { type: String, required: true },
  status: { type: String, required: true },
  isAiEnhanced: Boolean,
  aiEnhancedContent: String,
  language: String
}, { minimize: false, timestamps: true });

export const QuickFieldNote: Model<IQuickFieldNoteDocument> = mongoose.models.QuickFieldNote || mongoose.model<IQuickFieldNoteDocument>('QuickFieldNote', QuickFieldNoteSchema);
