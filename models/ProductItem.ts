import mongoose, { Model } from 'mongoose';

export interface IProductItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  topPrice?: number;
  middlePricePerFt?: number;
  bottomPrice?: number;
  unitPrice?: number;
  unit: string;
  stockStatus: string;
}

export interface IProductItemDocument extends IProductItem, mongoose.Document {}

const ProductItemSchema = new mongoose.Schema<IProductItem>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: String,
  topPrice: Number,
  middlePricePerFt: Number,
  bottomPrice: Number,
  unitPrice: Number,
  unit: { type: String, required: true },
  stockStatus: { type: String, required: true }
}, { minimize: false, timestamps: true });

export const ProductItem: Model<IProductItemDocument> = mongoose.models.ProductItem || mongoose.model<IProductItemDocument>('ProductItem', ProductItemSchema);
