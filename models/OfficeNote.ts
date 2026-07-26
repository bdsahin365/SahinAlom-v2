import mongoose, { Model } from 'mongoose';

export interface IOfficeNote {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: string;
  isCompleted: boolean;
  author: string;
}

export interface IOfficeNoteDocument extends IOfficeNote, mongoose.Document {}

const OfficeNoteSchema = new mongoose.Schema<IOfficeNote>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  priority: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  author: { type: String, required: true }
}, { minimize: false, timestamps: true });

export const OfficeNote: Model<IOfficeNoteDocument> = mongoose.models.OfficeNote || mongoose.model<IOfficeNoteDocument>('OfficeNote', OfficeNoteSchema);
