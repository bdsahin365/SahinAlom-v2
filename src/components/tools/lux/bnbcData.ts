import { BuildingType, RoomPreset } from './types';

export const BNBC_ROOM_PRESETS: RoomPreset[] = [
  // --- RESIDENTIAL ---
  {
    id: 'res-bedroom',
    buildingType: 'Residential',
    roomName: 'Bedroom',
    roomNameBn: 'শোবার ঘর (Bedroom)',
    recommendedLux: 150,
    minLux: 100,
    maxAllowableLPD: 5.5,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'সাধারণ আলো ও পঠনপাঠনের জন্য ১৫০ লাক্স সমতুল্য আলো উপযুক্ত।'
  },
  {
    id: 'res-living',
    buildingType: 'Residential',
    roomName: 'Living Room',
    roomNameBn: 'বসবার ঘর / ড্রয়িং রুম (Living Room)',
    recommendedLux: 200,
    minLux: 150,
    maxAllowableLPD: 6.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'পারিবারিক বিনোদন ও অতিথিদের আপ্যায়নের জন্য ২০০ লাক্স আর্কিটেকচারাল আলো।'
  },
  {
    id: 'res-kitchen',
    buildingType: 'Residential',
    roomName: 'Kitchen Counter',
    roomNameBn: 'রান্নাঘর ওয়ার্কটপ (Kitchen Counter)',
    recommendedLux: 250,
    minLux: 200,
    maxAllowableLPD: 8.0,
    standardWorkingPlaneHeight: 0.85,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'খাদ্য প্রস্তুতকরণ ও কাটাকাটির নিরাপদ পরিবেশের জন্য ২৫০ লাক্স প্রয়োজন।'
  },
  {
    id: 'res-dining',
    buildingType: 'Residential',
    roomName: 'Dining Room',
    roomNameBn: 'খাবার ঘর (Dining Room)',
    recommendedLux: 150,
    minLux: 100,
    maxAllowableLPD: 6.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'খাবারের টেবিলে আরামদায়ক আলোর পরিবেশ।'
  },
  {
    id: 'res-bath',
    buildingType: 'Residential',
    roomName: 'Bathroom & Washroom',
    roomNameBn: 'বাথরুম ও ওয়াশরুম',
    recommendedLux: 150,
    minLux: 100,
    maxAllowableLPD: 6.0,
    standardWorkingPlaneHeight: 0.0,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'আইপি ৪৪/৬৫ সারফেস ডাউনলাইটের মাধ্যমে উপযুক্ত আলো।'
  },
  {
    id: 'res-stair',
    buildingType: 'Residential',
    roomName: 'Staircase & Landing',
    roomNameBn: 'সিঁড়ি ও ল্যান্ডিং (Staircase)',
    recommendedLux: 100,
    minLux: 75,
    maxAllowableLPD: 4.5,
    standardWorkingPlaneHeight: 0.0,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'নিরাপদ যাতায়াতের জন্য সর্বনিম্ন ১০০ লাক্স বাধ্যবাধকতা।'
  },
  {
    id: 'res-study',
    buildingType: 'Residential',
    roomName: 'Study Desk / Home Office',
    roomNameBn: 'পড়ার টেবিল / হোম অফিস',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 8.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.5',
    description: 'পড়ালেখা ও ল্যাপটপ ব্যবহারের জন্য চোখের চাপমুক্ত ৩০০ লাক্স আলো।'
  },

  // --- OFFICE & COMMERCIAL ---
  {
    id: 'off-general',
    buildingType: 'Office',
    roomName: 'General Workstation / Office Desk',
    roomNameBn: 'জেনারেল অফিস ডেস্কে (General Office Desk)',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 9.8,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.6',
    description: 'কম্পিউটার ডেটা এন্ট্রি ও পেপারওয়ার্কের জন্য ৩০০ লাক্স।'
  },
  {
    id: 'off-open',
    buildingType: 'Office',
    roomName: 'Open Workspace / CAD Drafting',
    roomNameBn: 'ওপেন ওয়ার্কস্পেস / ড্রাফটিং ডেক্স',
    recommendedLux: 400,
    minLux: 300,
    maxAllowableLPD: 10.5,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.6',
    description: 'উচ্চ মাত্রার একাগ্রতা ও নকশা তৈরির জন্য ৪০০ লাক্স আলো।'
  },
  {
    id: 'off-exec',
    buildingType: 'Office',
    roomName: 'Executive Cabin / Director Room',
    roomNameBn: 'এক্সিকিউটিভ রুম / ডিরেক্টর কেবিন',
    recommendedLux: 400,
    minLux: 300,
    maxAllowableLPD: 10.8,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.6',
    description: 'প্রিমিয়াম গ্লেয়ার-ফ্রি এলইডি প্যানেল সহ ৪০০ লাক্স আলো।'
  },
  {
    id: 'off-conf',
    buildingType: 'Office',
    roomName: 'Conference & Meeting Room',
    roomNameBn: 'কনফারেন্স ও মিটিং রুম (Conference Room)',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 10.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.6',
    description: 'মিটিং, প্রেজেন্টেশন ও আলোচনার উপযুক্ত ৩০০ লাক্স।'
  },
  {
    id: 'off-reception',
    buildingType: 'Office',
    roomName: 'Reception & Entrance Lobby',
    roomNameBn: 'রিিসেপশন ও এন্ট্রান্স লবি',
    recommendedLux: 200,
    minLux: 150,
    maxAllowableLPD: 8.5,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.6',
    description: 'দর্শনার্থীদের অভ্যর্থনা জানাতে নান্দনিক ২০০ লাক্স আলো।'
  },
  {
    id: 'off-server',
    buildingType: 'Office',
    roomName: 'Server & IT Control Room',
    roomNameBn: 'সার্ভার ও আইটি কন্ট্রোল রুম',
    recommendedLux: 500,
    minLux: 300,
    maxAllowableLPD: 11.2,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.6',
    description: 'প্যাচ প্যানেল ও ওয়্যারিং নিখুঁত পর্যবেক্ষণের জন্য ৫০০ লাক্স।'
  },

  // --- EDUCATIONAL ---
  {
    id: 'edu-classroom',
    buildingType: 'Educational',
    roomName: 'Classroom / Lecture Hall',
    roomNameBn: 'শ্রেণীকক্ষ / লেকচার হল (Classroom)',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 9.5,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.7',
    description: 'বোর্ড ও বেঞ্চে শিক্ষার্থীদের পড়াশোনার মানসম্মত ৩০০ লাক্স।'
  },
  {
    id: 'edu-lab',
    buildingType: 'Educational',
    roomName: 'Science & Engineering Lab',
    roomNameBn: 'সায়েন্স ও ইঞ্জিনিয়ারিং ল্যাবরেটরি',
    recommendedLux: 500,
    minLux: 300,
    maxAllowableLPD: 12.0,
    standardWorkingPlaneHeight: 0.85,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.7',
    description: 'যন্ত্রপাতি ও কেমিক্যাল পরীক্ষার জন্য ৫০০ লাক্স।'
  },
  {
    id: 'edu-library',
    buildingType: 'Educational',
    roomName: 'Library Reading Zone',
    roomNameBn: 'লাইব্রেরি রিডিং জোন (Library)',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 9.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.7',
    description: 'বই পড়ার টেবিলে আরামদায়ক ৩০০ লাক্স লাইটিং।'
  },
  {
    id: 'edu-drawing',
    buildingType: 'Educational',
    roomName: 'Architectural / Engineering Drafting Studio',
    roomNameBn: 'আর্কিটেকচারাল / ড্রয়িং স্টুডিও',
    recommendedLux: 600,
    minLux: 450,
    maxAllowableLPD: 14.0,
    standardWorkingPlaneHeight: 0.90,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.7',
    description: 'সূক্ষ্ম রেখা ও স্কেচ ড্রয়িংয়ের জন্য ৬০০ লাক্স।'
  },

  // --- HEALTHCARE ---
  {
    id: 'med-ward',
    buildingType: 'Healthcare',
    roomName: 'Hospital Patient Ward',
    roomNameBn: 'হাসপাতাল পেশেন্ট ওয়ার্ড (Ward)',
    recommendedLux: 150,
    minLux: 100,
    maxAllowableLPD: 8.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.8',
    description: 'রোগীদের বিশ্রামের উপযোগী সুষম ১৫০ লাক্স আলো।'
  },
  {
    id: 'med-exam',
    buildingType: 'Healthcare',
    roomName: 'Doctor Examination Room',
    roomNameBn: 'ডাক্তারের চেম্বার / এক্সামিনেশন রুম',
    recommendedLux: 500,
    minLux: 300,
    maxAllowableLPD: 12.5,
    standardWorkingPlaneHeight: 0.85,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.8',
    description: 'শারীরিক পরীক্ষা-নিরীক্ষার জন্য পরিষ্কার ৫০০ লাক্স।'
  },
  {
    id: 'med-ot',
    buildingType: 'Healthcare',
    roomName: 'Operation Theatre (General Illumination)',
    roomNameBn: 'অপারেশন থিয়েটার (OT General)',
    recommendedLux: 1000,
    minLux: 750,
    maxAllowableLPD: 22.0,
    standardWorkingPlaneHeight: 0.90,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.8',
    description: 'সার্জিক্যাল রুমের সার্বিক আলোর জন্য ১০০০ লাক্স।'
  },
  {
    id: 'med-waiting',
    buildingType: 'Healthcare',
    roomName: 'Hospital Corridor & Waiting Area',
    roomNameBn: 'হাসপাতাল করিডোর ও ওয়েটিং এরিয়া',
    recommendedLux: 150,
    minLux: 100,
    maxAllowableLPD: 6.5,
    standardWorkingPlaneHeight: 0.0,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.8',
    description: 'রোগী চলাচলের নিরাপদ আলোর পরিবেশ।'
  },

  // --- INDUSTRIAL & FACTORY ---
  {
    id: 'ind-garments',
    buildingType: 'Industrial',
    roomName: 'Garments Cutting & Sewing Floor',
    roomNameBn: 'গার্মেন্টস কাটিং ও সুইং ফ্লোর',
    recommendedLux: 500,
    minLux: 400,
    maxAllowableLPD: 13.0,
    standardWorkingPlaneHeight: 0.85,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.9',
    description: 'পোশাক শিল্পের নির্ভুল কাটিং ও সেলাইয়ের জন্য ৫০০ লাক্স।'
  },
  {
    id: 'ind-machinery',
    buildingType: 'Industrial',
    roomName: 'Heavy Machinery & Assembly Line',
    roomNameBn: 'হেভি মেশিনারি ও অ্যাসেম্বলি ফ্লোর',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 11.5,
    standardWorkingPlaneHeight: 0.85,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.9',
    description: 'শিল্প কারখানার সাধারণ উৎপাদন লাইনের জন্য ৩০০ লাক্স।'
  },
  {
    id: 'ind-inspection',
    buildingType: 'Industrial',
    roomName: 'Quality Control & Inspection Area',
    roomNameBn: 'কোয়ালিটি কন্ট্রোল (QC) ও ইন্সপেকশন',
    recommendedLux: 750,
    minLux: 500,
    maxAllowableLPD: 16.0,
    standardWorkingPlaneHeight: 0.90,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.9',
    description: 'পণ্যের ক্ষুদ্রতম ত্রুটি সনাক্তকরণে ৭৫০ লাক্স অতি-উজ্জ্বল আলো।'
  },
  {
    id: 'ind-substation',
    buildingType: 'Industrial',
    roomName: 'Substation & HT/LT Switchgear Room',
    roomNameBn: 'সাবস্টেশন ও সুইচগিয়ার রুম (Substation)',
    recommendedLux: 250,
    minLux: 150,
    maxAllowableLPD: 8.5,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.9',
    description: 'ইলেকট্রিক্যাল প্যানেল ও মেগা টেস্টের নিরাপদ পরিবেশ।'
  },

  // --- WAREHOUSE ---
  {
    id: 'wh-racks',
    buildingType: 'Warehouse',
    roomName: 'Warehouse High Racks Storage',
    roomNameBn: 'ওয়্যারহাউস র‌্যাকস ও মালামাল স্টোরেজ',
    recommendedLux: 150,
    minLux: 100,
    maxAllowableLPD: 6.0,
    standardWorkingPlaneHeight: 0.0,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.10',
    description: 'ফর্কলিফট চালনা ও কার্টন লেবেল দেখার জন্য ১৫০ লাক্স।'
  },
  {
    id: 'wh-loading',
    buildingType: 'Warehouse',
    roomName: 'Loading Dock & Dispatch Bay',
    roomNameBn: 'লোডিং ডক ও ডিসপ্যাচ এলাকা',
    recommendedLux: 200,
    minLux: 150,
    maxAllowableLPD: 7.5,
    standardWorkingPlaneHeight: 0.0,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.10',
    description: 'ট্রাক লোডিং-আনলোডিং ও ইনভেন্টরি ট্র্যাকিং।'
  },

  // --- SHOPPING MALL & RETAIL ---
  {
    id: 'ret-sales',
    buildingType: 'Shopping Mall',
    roomName: 'Retail Shop General Sales Floor',
    roomNameBn: 'দোকান / রিটেইল শপ সেলস ফ্লোর',
    recommendedLux: 400,
    minLux: 300,
    maxAllowableLPD: 12.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.11',
    description: 'পণ্য প্রদর্শনী ও ক্রেতাদের কেনাকাটার ৪০০ লাক্স আকর্ষণীয় আলো।'
  },
  {
    id: 'ret-showcase',
    buildingType: 'Shopping Mall',
    roomName: 'Jewelry / Feature Display Window',
    roomNameBn: 'ডিসপ্লে উইন্ডো / জুয়েলারি শোরুম',
    recommendedLux: 1000,
    minLux: 750,
    maxAllowableLPD: 20.0,
    standardWorkingPlaneHeight: 0.90,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.11',
    description: 'হাই-লাইটিং স্পটলাইটের মাধ্যমে ১০০০ লাক্স আলো।'
  },

  // --- HOTEL & RESTAURANT ---
  {
    id: 'hot-lobby',
    buildingType: 'Hotel',
    roomName: 'Grand Hotel Entrance Lobby',
    roomNameBn: 'হোটেল গ্র্যান্ড লবি',
    recommendedLux: 300,
    minLux: 200,
    maxAllowableLPD: 10.0,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.12',
    description: 'আভিজাত্যময় ও উষ্ণ অভ্যর্থনার জন্য ৩০০ লাক্স আলো।'
  },
  {
    id: 'rest-dining',
    buildingType: 'Restaurant',
    roomName: 'Restaurant Dining Area',
    roomNameBn: 'রেস্তোরাঁ ডাইনিং এরিয়া',
    recommendedLux: 200,
    minLux: 100,
    maxAllowableLPD: 8.5,
    standardWorkingPlaneHeight: 0.75,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.12',
    description: 'আরামদায়ক খাবার পরিবেশের জন্য ২০০ লাক্স।'
  },
  {
    id: 'rest-kitchen',
    buildingType: 'Restaurant',
    roomName: 'Commercial Restaurant Kitchen',
    roomNameBn: 'বাণিজ্যিক রেস্তোরাঁ কিচেন (Commercial Kitchen)',
    recommendedLux: 500,
    minLux: 300,
    maxAllowableLPD: 14.0,
    standardWorkingPlaneHeight: 0.85,
    bnbcClause: 'BNBC 2020 Part 8, Table 8.1.12',
    description: 'খাদ্য নিরাপত্তা ও দ্রুত রান্নার জন্য ৫০০ লাক্স ওয়াটারপ্রুফ আলো।'
  }
];

export const BUILDING_TYPES: BuildingType[] = [
  'Residential',
  'Office',
  'Commercial',
  'Industrial',
  'Educational',
  'Healthcare',
  'Warehouse',
  'Shopping Mall',
  'Hotel',
  'Restaurant'
];

/**
 * Calculates Utilization Factor (UF) based on Room Index (K)
 * Standard photometric curve estimation for typical 70/50/20 reflectance
 */
export function calculateAutoUF(roomIndex: number): number {
  if (roomIndex <= 0.6) return 0.40;
  if (roomIndex <= 0.8) return 0.48;
  if (roomIndex <= 1.0) return 0.55;
  if (roomIndex <= 1.25) return 0.62;
  if (roomIndex <= 1.5) return 0.68;
  if (roomIndex <= 2.0) return 0.73;
  if (roomIndex <= 2.5) return 0.77;
  if (roomIndex <= 3.0) return 0.80;
  if (roomIndex <= 4.0) return 0.83;
  return 0.86;
}
