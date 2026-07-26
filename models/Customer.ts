import mongoose, { Model } from 'mongoose';

export interface ICustomer {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  industrySector?: string;
  substationCapacity?: string;
  status?: string;
  notes?: string;
  totalOrders: number;
  totalSpent?: number;
  lastServiceDate?: string;
}

export interface ICustomerDocument extends ICustomer, mongoose.Document {}

const CustomerSchema = new mongoose.Schema<ICustomer>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contactPerson: String,
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  email: String,
  address: { type: String, required: true },
  industrySector: String,
  substationCapacity: String,
  status: String,
  notes: String,
  totalOrders: { type: Number, default: 0 },
  totalSpent: Number,
  lastServiceDate: String
}, { minimize: false, timestamps: true });

export const Customer: Model<ICustomerDocument> = mongoose.models.Customer || mongoose.model<ICustomerDocument>('Customer', CustomerSchema);
