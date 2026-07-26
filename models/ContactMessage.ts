import mongoose, { Model } from 'mongoose';

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  date: string;
}

export interface IContactMessageDocument extends IContactMessage, mongoose.Document {}

const ContactMessageSchema = new mongoose.Schema<IContactMessage>({
  id: String,
  name: String,
  email: String,
  company: String,
  message: String,
  date: String
}, { minimize: false, timestamps: true });

export const ContactMessage: Model<IContactMessageDocument> = mongoose.models.ContactMessage || mongoose.model<IContactMessageDocument>('ContactMessage', ContactMessageSchema);
