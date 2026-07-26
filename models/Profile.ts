import mongoose, { Model } from 'mongoose';

export interface IProfileExperience {
  role: string;
  company: string;
  period: string;
  details: string;
}

export interface IProfileEducation {
  degree: string;
  institution: string;
  passingYear: string;
  result?: string;
}

export interface IProfilePersonalDetails {
  dob: string;
  height: string;
  weight: string;
  bloodGroup: string;
  maritalStatus: string;
  religion: string;
  nationality: string;
  presentAddress: string;
  permanentAddress: string;
  fatherName: string;
  fatherProfession: string;
  motherName: string;
  motherProfession: string;
  siblings: string;
}

export interface IProfile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  summary: string;
  skills: string;
  imageUrl?: string;
  experience: IProfileExperience[];
  education: IProfileEducation[];
  personalDetails: IProfilePersonalDetails;
}

export interface IProfileDocument extends IProfile, mongoose.Document {}

const ProfileSchema = new mongoose.Schema<IProfile>({
  name: String,
  title: String,
  location: String,
  email: String,
  phone: String,
  whatsapp: String,
  summary: String,
  skills: String,
  imageUrl: String,
  experience: [
    {
      role: String,
      company: String,
      period: String,
      details: String
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      passingYear: String,
      result: String
    }
  ],
  personalDetails: {
    dob: String,
    height: String,
    weight: String,
    bloodGroup: String,
    maritalStatus: String,
    religion: String,
    nationality: String,
    presentAddress: String,
    permanentAddress: String,
    fatherName: String,
    fatherProfession: String,
    motherName: String,
    motherProfession: String,
    siblings: String
  }
}, { minimize: false, timestamps: true });

export const Profile: Model<IProfileDocument> = mongoose.models.Profile || mongoose.model<IProfileDocument>('Profile', ProfileSchema);
