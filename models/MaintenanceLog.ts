import mongoose, { Model } from 'mongoose';

export interface IMaintenanceLog {
  id: string;
  equipmentName: string;
  equipmentIdTag: string;
  location: string;
  category: string;
  status: string;
  lastServiceDate: string;
  nextInspectionDueDate: string;
  technicianInCharge: string;
  priority: string;
  notes?: string;
}

export interface IMaintenanceLogDocument extends IMaintenanceLog, mongoose.Document {}

const MaintenanceLogSchema = new mongoose.Schema<IMaintenanceLog>({
  id: { type: String, required: true, unique: true },
  equipmentName: { type: String, required: true },
  equipmentIdTag: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  lastServiceDate: { type: String, required: true },
  nextInspectionDueDate: { type: String, required: true },
  technicianInCharge: { type: String, required: true },
  priority: { type: String, required: true },
  notes: String
}, { minimize: false, timestamps: true });

export const MaintenanceLog: Model<IMaintenanceLogDocument> = mongoose.models.MaintenanceLog || mongoose.model<IMaintenanceLogDocument>('MaintenanceLog', MaintenanceLogSchema);
