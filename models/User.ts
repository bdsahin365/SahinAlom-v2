import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username?: string;
  email: string;
  passwordHash?: string;
  name: string;
  role: "Admin" | "Staff" | "User";
  phone?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    name: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Staff", "User"], default: "User" },
    phone: { type: String },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
