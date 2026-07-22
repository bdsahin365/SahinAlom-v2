import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  showBottomNav: boolean;
  defaultTheme: "dark" | "light";
  siteName?: string;
  contactEmail?: string;
  whatsappNumber?: string;
  maintenanceMode?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    showBottomNav: { type: Boolean, default: true },
    defaultTheme: { type: String, enum: ["dark", "light"], default: "dark" },
    siteName: { type: String, default: "Engineers Enterprise" },
    contactEmail: { type: String, default: "sardershain@gmail.com" },
    whatsappNumber: { type: String, default: "+8801700000000" },
    maintenanceMode: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
