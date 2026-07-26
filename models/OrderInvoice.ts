import mongoose, { Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  variant?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface IOrderInvoice {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  createdRole: string;
  notes?: string;
}

export interface IOrderInvoiceDocument extends IOrderInvoice, mongoose.Document {}

const OrderInvoiceSchema = new mongoose.Schema<IOrderInvoice>({
  id: { type: String, required: true, unique: true },
  invoiceNo: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  date: { type: String, required: true },
  items: [
    {
      productId: String,
      productName: String,
      variant: String,
      quantity: Number,
      unit: String,
      pricePerUnit: Number,
      totalPrice: Number
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, required: true },
  status: { type: String, required: true },
  createdRole: { type: String, required: true },
  notes: String
}, { minimize: false, timestamps: true });

export const OrderInvoice: Model<IOrderInvoiceDocument> = mongoose.models.OrderInvoice || mongoose.model<IOrderInvoiceDocument>('OrderInvoice', OrderInvoiceSchema);
