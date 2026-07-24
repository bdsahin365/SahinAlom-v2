import { CaseStudy, TimelineStep, ReadingItem, AdminStats, ProfileData, HomepageContent, AppSettings, BlogPost, QuickFieldNote } from './types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'substation-sld-analysis',
    title: 'Substation SLD Analysis & Protection Coordination',
    category: 'সাবস্টেশন ও পাওয়ার ডিস্ট্রিবিউশন',
    tags: ['Substation', 'SLD', 'Protection', 'BNBC Compliance'],
    shortDesc: 'Read and interpreted SLDs for 11kV/0.4kV distribution substations, identifying protection coordination gaps and load flow paths.',
    problem: 'The factory experienced frequent total blackouts due to a lack of selectivity between the downstream sub-distribution boards and the upstream Substation Main Air Circuit Breaker (ACB). A localized fault in a knitting line motor was cascading up, tripping the entire facility.',
    calculation: `Transformer Rating: 630 kVA (11kV / 0.415kV, impedance voltage Z% = 4%)
Full Load Current (Low Tension Side):
I_LT = S / (√3 × V_LL) 
     = 630,000 VA / (1.732 × 415 V) 
     = 876.5 A

Fault Current at 0.415kV Busbar:
I_sc = I_LT × (100 / Z%) 
     = 876.5 × (100 / 4) 
     = 21,912.5 A (21.9 kA)

Downstream SDB Breaker (MCCB): 160A, Trip curve set to short-time delay of 0.1s.
Main ACB Trip Settings:
- Long-time delay (Overload): I_r = 0.9 × 1000A = 900A (Delay = 12s)
- Short-time delay (Short Circuit): I_sd = 4 × I_r = 3600A (Delay set previously to 0.05s — causing miscoordination with MCCB!)`,
    solution: 'Recalibrated the trip parameters on the primary Air Circuit Breaker (ACB) and MCCBs. Adjusted the ACB Short-Time Delay (t_sd) from 0.05 seconds to 0.25 seconds, establishing proper time-current grading. Upstream HT Vacuum Circuit Breaker (VCB) protection relays (IDMT type) were configured with a Time Multiplier Setting (TMS) of 0.20 to coordinate with the ACB trip time.',
    results: [
      'Successfully isolated a short-circuit fault in Knitting Section SDB-2 without tripping the main ACB.',
      'Achieved zero cascaded blackouts over a 12-month monitoring period.',
      'Ensured absolute safety compliance with BNBC 2020 Part 8 guidelines.'
    ],
    duration: '3 Weeks',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: {
      voltage: '11kV / 0.415kV LT',
      capacity: '630 kVA Transformer',
      duration: '3 Weeks',
      equipment: 'HT VCB, Main ACB, IDMT Protection Relays',
      standard: 'BNBC 2020 Part 8 (Selectivity)',
      sector: 'Textile & Apparel Manufacturing'
    }
  },
  {
    slug: 'industrial-load-distribution',
    title: 'Industrial Load Distribution & Main Feeder Sizing',
    category: 'ক্যাবল সাইজিং ও লোড ক্যালকুলেশন',
    tags: ['Load Calc', 'Cable Sizing', 'IEC Standards', 'Thermal Protection'],
    shortDesc: 'Calculated total connected load and demand load for an industrial facility. Sized cables and selected appropriate circuit breakers per IEC standards.',
    problem: 'The sub-feeder cable running to the 45kW circular knitting machine sector was running excessively hot (above 85°C), leading to insulation degradation. The cable layout was routed through a ceiling ladder tray with tight grouping, accelerating thermal breakdown.',
    calculation: `Connected Motor Load: 45 kW
Power Factor (Cos φ): 0.82, Efficiency (η): 0.88
Operating Active Input Power: P_in = 45 kW / 0.88 = 51.1 kW
Full Load Operating Current:
I_FL = P_in / (√3 × V_LL × Cos φ)
     = 51,100 W / (1.732 × 415 V × 0.82)
     = 86.8 A

Environmental & Installation Derating Factors (IEC 60364-5-52):
1. Ambient Temp Derating (for 40°C in Dhaka summers): K_temp = 0.87
2. Grouping Derating (3 circuits bundled in a single tray): K_group = 0.80
Effective Correction Factor: C_d = 0.87 × 0.80 = 0.696

Required Cable Continuous Ampacity (I_allowable):
I_allowable ≥ I_FL / C_d
            = 86.8 A / 0.696
            = 124.7 A

Previous Cable: 4-Core 25 mm² NYY (Rated for 95A in free air; derated rating = 95 × 0.696 = 66.1A — overloaded by 31.3%!)`,
    solution: 'Upgraded the sub-feeder cable from 4-Core 25 mm² to 4-Core 35 mm² NYY Copper Cable, which is rated for 125A in free air, yielding a derated capability of 87A (sufficient for the actual run). Rearranged the cabling inside the tray to maintain a clear 1-diameter spacing between adjacent runs to maximize heat dissipation.',
    results: [
      'Reduced cable operating temperature from 85°C to a stable 43°C under peak load.',
      'Prevented premature failure of cable insulation, saving the factory from potential fire hazards.',
      'Improved line voltage regulation at the knitting machine terminals from 390V to 411V.'
    ],
    duration: '2 Weeks',
    galleryImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: {
      voltage: '415V Three-Phase AC',
      capacity: '45 kW Knitting Machinery Sector',
      duration: '2 Weeks',
      equipment: '4-Core 35 mm² NYY Copper Cable, Cable Ladder Trays',
      standard: 'IEC 60364-5-52 Thermal Directives',
      sector: 'Light Industrial Manufacturing'
    }
  },
  {
    slug: 'earthing-system-inspection',
    title: 'Earthing System Inspection, Testing & Optimization',
    category: 'বিএনবিসি কোড ও ইলেকট্রিক্যাল সেফটি',
    tags: ['Earthing', 'Safety', 'Testing', 'Soil Resistivity'],
    shortDesc: 'Performed earth resistance testing and verified continuity of protective conductors across MDB and SDB panels in a commercial building.',
    problem: 'Operators on the factory floor reported receiving mild electrical shocks when touching the metallic chassis of the high-speed knitting machines. Additionally, sensitive micro-controller units on the machines were reset sporadically due to transient ground loops.',
    calculation: `Initial Measured Earth Electrode Resistance (3-point Fall-of-Potential method):
R_earth = 8.4 Ω (BNBC 2020 maximum limit: 1.0 Ω)

Let's calculate the Touch Voltage (V_touch) during a phase-to-earth fault (assuming 32A fuse protection):
If phase-to-earth leakage current is 25A:
V_touch = I_leakage × R_earth = 25A × 8.4Ω = 210 V! (Extremely lethal, safe limit is < 50V)

Target Earth Resistance: < 1.0 Ω
Required Parallel Resistance:
If we add parallel electrodes of resistance R_each ≈ 4 Ω:
R_total = R_existing || R_new1 || R_new2
We require 2 new chemical ground electrodes to reach under 1.0 Ω.`,
    solution: 'Conducted a comprehensive earth loop impedance test. Installed two new 10-foot copper chemical earth electrodes backfilled with low-resistivity bentonite compound. Bonded all redundant ground lines together with a 35 mm² bare copper earth continuity conductor (ECC) connected to the Main Earth Bar. Cleaned and tightened all rusted earthing lugs on the SDB boxes.',
    results: [
      'Brought composite earth electrode resistance down from 8.4 Ω to a highly safe 0.85 Ω.',
      'Measured chassis touch voltage dropped to absolute 0V during simulated fault tests.',
      'Completely eliminated operators electrical shock reports and erratic machine controller reboots.'
    ],
    duration: '4 Days',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: {
      voltage: 'Fault Grounding Selectivity',
      capacity: 'Composite Resistance < 1.0 Ω target',
      duration: '4 Days',
      equipment: 'Bentonite Chemical Earth Rods, 35 mm² ECC Bond',
      standard: 'BNBC 2020 Safety Ground Standards',
      sector: 'Heavy Industrial Machinery Plant'
    }
  },
  {
    slug: 'ips-lighting-troubleshooting',
    title: 'Instant Power Supply (IPS) & Emergency Lighting Optimization',
    category: 'লাইটিং ডিজাইন ও ইমার্জেন্সি ব্যাকআপ',
    tags: ['IPS', 'Maintenance', 'Emergency System', 'ATS Design'],
    shortDesc: 'Diagnosed and resolved faults in an integrated power supply system and emergency lighting circuits, restoring full operational status.',
    problem: 'During sudden utility line outages, the factory floor lighting would drop out for up to 15 seconds before the standby diesel generator fully booted. The 3kVA Instant Power Supply (IPS) designed to provide instant battery-backed emergency lighting was failing to switch over, creating safety hazards.',
    calculation: `Emergency Lighting Load:
150 × 12W LED Tube Lights = 1800 W (at Power Factor = 0.95)
Apparent Power: S = 1800W / 0.95 = 1894 VA (1.9 kVA)

Required Batter Capacity for 2-Hour Backup (12V System):
Discharge Current: I_dc = 1800W / (12V × 0.85 inverter efficiency) = 176.4 A
Required Capacity: C = I_dc × 2 hours = 352.8 Ah
Minimum Installed Battery: 2 × 200 Ah (12V) connected in parallel (400 Ah capacity).

Actual Problem: The relay contacts of the 40A Automatic Transfer Switch (ATS) were heavily pitted and oxidized, showing a contact resistance of 12.5 Ω, restricting coil voltage and preventing instantaneous snap-over.`,
    solution: 'Replaced the oxidized 40A double-pole transfer contactors with heavy-duty silver-alloy contact relays. Restructured the ATS relay control circuit by adding a snubbing capacitor to suppress arcing during transfer. Recalibrated the battery charging threshold on the 3kVA inverter to keep batteries at a healthy float voltage of 13.8V.',
    results: [
      'Reduced lighting switchover delay from a dangerous 15 seconds to less than 18 milliseconds (completely seamless to the human eye).',
      'Extended emergency lighting battery backup autonomy to a proven 2.2 hours under full load.',
      'Created a fail-safe manual bypass switch on the IPS control board for emergency maintenance.'
    ],
    duration: '1 Week',
    galleryImages: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: {
      voltage: '12V DC Battery / 240V AC Inverted Output',
      capacity: '3.0 kVA IPS Inverter Capacity',
      duration: '1 Week',
      equipment: '40A Silver-Alloy Contactor Relays, 2x 200Ah Deep-Cycle Batteries',
      standard: 'IEC Emergency Lighting Switching Standards',
      sector: 'Commercial and Logistics Facilities'
    }
  }
];

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    time: '06:30',
    title: 'Arrive & check MDB panel',
    description: 'Inspect the Main Distribution Board (MDB). Record phase voltages (typically 415V LL, 240V LN), currents, and line frequency. Check active alarms on the protection relays and verify that the capacitor bank (PFI plant) is maintaining power factor above 0.95.'
  },
  {
    time: '06:45',
    title: 'Floor walk & acoustic diagnostic',
    description: 'Walk through the circular knitting machine rows. Listen closely to the humming of the high-speed three-phase induction motors. Experienced ears can detect bearing wear or single-phase winding imbalances just by the pitch of the motor hum.'
  },
  {
    time: '07:00',
    title: 'Data logging & preventive planning',
    description: "Formally document the morning parameters in the factory's physical maintenance register. Check yesterday's thermal imaging logs. Draft the preventive maintenance agenda—scheduling motor greasing, terminal tightening, or dust cleaning during scheduled line rotations."
  },
  {
    time: '07:30',
    title: 'Technician brief & safety toolbox',
    description: 'Gather the junior electrical technicians. Hand over outstanding overnight reports from the night shift. Review safety protocols—specifically double-checking lockout/tagout (LOTO) tags on the SDB main breakers before opening any machine covers.'
  }
];

export const INITIAL_READINGS: ReadingItem[] = [
  { label: 'MDB Incoming Voltage', value: '415', unit: 'V', status: 'normal' },
  { label: 'MDB Grid Frequency', value: '50.02', unit: 'Hz', status: 'normal' },
  { label: 'Total Industrial Load', value: '312', unit: 'kW', status: 'normal' },
  { label: 'Main Busbar Temperature', value: '38', unit: '°C', status: 'normal' },
  { label: 'Earth Resistance', value: '0.85', unit: 'Ω', status: 'normal' },
  { label: 'Knitting Line 3 Motor', value: '72', unit: '°C', status: 'warning' }
];

export const INITIAL_ADMIN_STATS: AdminStats = {
  visitors: 1420,
  caseStudiesCount: 4,
  contactRequests: 18,
  avgReadTime: '4m 32s'
};

export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "Md Sahin Alom",
  title: "Electrical Engineer",
  location: "Dhaka, Bangladesh",
  email: "sardershain@gmail.com",
  phone: "+8801760816120",
  whatsapp: "+8801760816120",
  summary: "Results-driven Electrical Engineer with B.Sc. in EEE from Green University of Bangladesh. Over 4 years of hands-on expertise in industrial electrical maintenance, load calculation, distribution substation operation, and advanced troubleshooting for large-scale manufacturing operations. Proven capability in maintaining zero unscheduled downtime, ensuring electrical safety compliance per BNBC and IEC standards, and designing automatic protection and transfer systems.",
  skills: "Substation Maintenance (11kV/0.4kV), SLD Interpretation, Protection Selectivity (ACB/MCCB/VCB), Power Factor Improvement (PFI), Cable & Breaker Sizing, Earth Resistance Testing, Generator Load Matching, Industrial Automation, LOTO Safety Protocols, BNBC & IEC Compliance",
  imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  experience: [
    {
      role: "Senior Electrical Maintenance Engineer",
      company: "Dhaka Sweater Factory Ltd., Dhaka",
      period: "2022 - Present",
      details: "In charge of 24/7 electrical operations maintaining circular knitting and heavy machinery; Designed and executed protective relay coordination reducing blackouts by 100%; Formulated preventative maintenance plans for 630kVA substation and sub-distribution boards."
    },
    {
      role: "Maintenance Electrical Engineer",
      company: "Gazipur Textile Mills Ltd., Gazipur",
      period: "2020 - 2022",
      details: "Conducted continuous monitoring of plant load distribution and thermal scanning of major feeder terminals; Optimized power factor from 0.88 to 0.98 through PFI bank servicing; Restructured emergency standby generator switchover automatic transfer panels."
    }
  ],
  education: [
    {
      degree: "B.Sc. in Electrical and Electronic Engineering (EEE)",
      institution: "Green University of Bangladesh",
      passingYear: "2020",
      result: "Graduated"
    },
    {
      degree: "Diploma in Electrical Technology",
      institution: "Dhaka Polytechnic Institute",
      passingYear: "2016",
      result: "GPA: 3.82/4.00"
    }
  ],
  personalDetails: {
    dob: "15 October 1996",
    height: "5' 8\"",
    weight: "72 kg",
    bloodGroup: "O+ (O Positive)",
    maritalStatus: "Single",
    religion: "Islam (Sunni)",
    nationality: "Bangladeshi",
    presentAddress: "Sector 11, Uttara, Dhaka - 1230",
    permanentAddress: "Village: Sreepur, Post: Sreepur, District: Gazipur",
    fatherName: "Abdur Rahman Alom",
    fatherProfession: "Retired Govt. Service Holder",
    motherName: "Salma Begum",
    motherProfession: "Homemaker",
    siblings: "1 Brother, 2 Sisters (All established)"
  }
};

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroTagline: "Electrical Engineer",
  heroHeading: "I keep factories running.",
  heroSubheading: "Electrical maintenance, load distribution, and power system troubleshooting for industrial facilities. B.Sc. in EEE from Green University of Bangladesh. Currently maintaining industrial power systems — keeping production lines live, motors humming, and safety standards met.",
  heroCtaPrimaryText: "Contact Me",
  heroCtaSecondaryText: "Explore Field Studies",
  heroStat1Val: "4+ Years",
  heroStat1Label: "Field Exp",
  heroStat2Val: "24/7",
  heroStat2Label: "Operations",
  heroStat3Val: "100%",
  heroStat3Label: "Uptime Focus",
  heroProfileName: "Md. Sahin Alom",
  heroProfileTitle: "Md. Sahin Alom — Electrical Engineer",
  heroProfileImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  heroProfileVideo: "",
  showDailyCheck: true,
  dailyCheckTagline: "01 — Operations Journal",
  dailyCheckTitle: "The daily check",
  dailyCheckDesc: "Every morning starts the same way. I walk the floor before the machines start, reading the boards, logging the numbers, listening for what sounds wrong. This is how you catch problems before they become downtime.",
  caseStudiesTagline: "02 — Field Investigations",
  caseStudiesHeading: "Problem → Solve",
  caseStudiesDesc: "Real faults, real calculations, real fixes. Every case follows the same discipline: diagnose first, calculate second, fix third.",
  expertiseTagline: "03 — Scope of Expertise",
  expertiseHeading: "What I can do for you",
  expertiseDesc: "Organized by who you are and what you need. Not a skills list — a capabilities statement.",
  journalTagline: "04 — Engineering Journal",
  journalHeading: "Operations Journal & Notes",
  journalDesc: "Field notes, compliance manuals, and calculation registers compiled directly from my daily substation maintenance routines in Dhaka, Bangladesh.",
  featuredBlogsTagline: "04 — Engineering Journal",
  featuredBlogsHeading: "Operations Journal & Notes",
  featuredBlogsDesc: "Field notes, compliance manuals, and calculation registers compiled directly from my daily substation maintenance routines in Dhaka, Bangladesh.",
  contactTagline: "05 — Transmission Node",
  contactHeading: "Let's collaborate",
  contactDesc: "Open to project collaborations, technical discussions, and international opportunities in the electrical and power systems space. Let me know what you are looking to build or solve.",
  contactEmail: "sardershain@gmail.com",
  contactLinkedin: "https://linkedin.com",
  contactGithub: "https://github.com",
  contactWhatsapp: "+8801700000000",
  headerLogoIcon: "Cpu"
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  showBottomNav: true,
  defaultTheme: 'dark'
};

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'bnbc-2020-lighting-design-guide-ch1',
    title: 'BNBC 2020 Lighting Design Guide (বাংলায়) — Chapter 1: Lighting Design কী ও কেন গুরুত্বপূর্ণ',
    category: 'লাইটিং ডিজাইন ও ইমার্জেন্সি ব্যাকআপ',
    date: '2026-07-21',
    readTime: '8 min read',
    summary: 'BNBC 2020 পার্ট ৮ অনুযায়ী লাইটিং ডিজাইন কী, কেন এটি সাধারণ বৈদ্যুতিক ওয়ারিংয়ের চেয়ে আলাদা, এবং কীভাবে এটি মানুষের নিরাপত্তা ও কর্মদক্ষতা নিশ্চিত করে তা বাস্তব উদাহরণসহ বুঝুন।',
    content: `আমরা প্রায় সবাই মনে করি, একটি রুমে কয়েকটি লাইট লাগিয়ে দিলেই লাইটিং ডিজাইন শেষ। আসলে বিষয়টি এত সহজ নয়।

একটি অফিসে যদি খুব কম আলো থাকে, তবে মানুষ ঠিকমতো কাজ করতে পারবে না। অনেকক্ষণ কম্পিউটারের সামনে বসে থাকলে চোখ ব্যথা করবে এবং প্রোডাক্টিভিটি কমে যাবে। আবার যদি খুব বেশি আলো দিয়ে দেন, তখনও समस्या। অনেক বেশি উজ্জ্বল আলো কম্পিউটার স্ক্রিনে গ্লেয়ার (Glare) তৈরি করবে, মাথা ব্যথা হবে, চোখে চাপ পড়বে এবং অপ্রয়োজনীয় বিদ্যুৎ খরচ হবে।

ঠিক এই কারণেই **Lighting Design** নামে ইলেকট্রিক্যাল ইঞ্জিনিয়ারিংয়ের একটি অত্যন্ত গুরুত্বপূর্ণ শাখা রয়েছে। 

লাইটিং ডিজাইনের মূল কাজ হলো:
- যেখানে যতটুকু আলো দরকার, ঠিক ততটুকু আলো দেওয়া।
- পুরো রুমে আলো সমানভাবে ছড়িয়ে দেওয়া (Uniform Distribution)।
- বিদ্যুৎ অপচয় কমানো এবং এনার্জি এফিশিয়েন্সি বজায় রাখা।
- মানুষের চোখের আরাম নিশ্চিত করা এবং গ্লেয়ার কমানো।
- BNBC এবং আন্তর্জাতিক স্ট্যান্ডার্ড মেনে নিরাপদ লাইটিং সিস্টেম তৈরি করা।

### BNBC কেন Lighting নিয়ে এত গুরুত্ব দিয়েছে?
অনেকেই ভাবেন লাইটিং মানে শুধু ঘরকে সুন্দর করে সাজানো। আসলে বাংলাদেশ ন্যাশনাল বিল্ডিং কোড (BNBC 2020) অনুযায়ী লাইটিংয়ের উদ্দেশ্য অনেক বড় ও তাৎপর্যপূর্ণ।

BNBC অনুযায়ী লাইটিং ডিজাইনের প্রধান উদ্দেশ্যসমূহ হলো:
- **মানুষের নিরাপত্তা নিশ্চিত করা**: পর্যাপ্ত আলো থাকলে বিপদজনক স্থানে দুর্ঘটনার ঝুঁকি শতভাগ এড়ানো সম্ভব।
- **কর্মক্ষেত্রে পর্যাপ্ত আলো**: উৎপাদনশীলতা বৃদ্ধি ও চোখের ওপর চাপ কমানো।
- **দুর্ঘটনা কমানো**: সঠিক কোণ থেকে আলো ফেলে বিপজ্জনক এলাকা চিহ্নিত করা।
- **Energy Efficient Design**: অহেতুক লাইট বসিয়ে বিদ্যুৎ অপচয় রোধ করা।
- **Emergency Exit Lighting**: বিদ্যুৎ চলে গেলে বা ফায়ার এলার্ম বাজলে নিরাপদে বের হওয়ার দিকনির্দেশনা দেওয়া।

এ কারণেই BNBC 2020-এর পার্ট ৮, চ্যাপ্টার ১-এ লাইটিংয়ের জন্য আলাদা ক্লজ (Clause 1.2 - Illumination Design) যুক্ত করা হয়েছে।

### Lighting Design কী- কম্পিউটার স্ক্রিনে রিফ্লেকশন এসে চোখে ক্লান্তি ও মাথা ব্যথার সৃষ্টি করবে।
- এসির লোড বেড়ে যাবে (লাইটের উৎপন্ন অতিরিক্ত তাপের কারণে)।

হ্যাভ ইউ হার্ড অফ দ্য গোল্ডেন রুল? "If you cannot find your own shadow, there is too much light." (অতিরিক্ত আলোতে ছায়া হারিয়ে যায়!)

 অন্যদিকে যদি মাত্র ১০০ লাক্স দেওয়া হয়, তবে কাজের মান খারাপ হবে, অপারেটরদের চোখে অতিরিক্ত চাপ পড়বে এবং কাজের ভুল অনেক বেড়ে যাবে। তাই ভালো লাইটিং মানে বেশি আলো নয়—ঠিক যতটুকু দরকার ততটুকু আলো।�ধারণ করা হয়।

ইঞ্জিনিয়ারিং হিসাব অনুযায়ী আলোর তীব্রতা পরিমাপের জন্য নিচের মৌলিক সমীকরণটি ব্যবহার করা হয়:
$$\\text{Lux } (lx) = \\frac{\\text{Luminous Flux (Lumen)}}{\\text{Area } (m^2)}$$

অর্থাৎ লাইটিং ডিজাইন শুধু ফিক্সচার কেনা বা ঝুলিয়ে দেওয়া নয়, এর মধ্যে রয়েছে সুনির্দিষ্ট ধাপ:

- **Room Analysis**: রুমের লেন্থ, উইডথ ও সিলিংয়ের উচ্চতা জানা।
- **Lux & Lumen Calculation**: সঠিক পরিমাণ আলোর তীব্রতা ও বাল্ব নির্বাচন করা।
- **Fixture Selection**: কাজের ধরণ অনুযায়ী সঠিক বিম অ্যাঙ্গেলের লাইট নির্বাচন।
- **Circuit Design**: সুইচের পজিশনিং ও ক্যাবল সাইজিং করা।
- **Emergency Lighting**: ইমার্জেন্সি এক্সিট ও ফায়ার এস্কেপ লাইট নির্ধারণ করা.

### Table 8.1.5: Recommended Values of Illumination for Residential Buildings (আবাসিক ভবন ও হোটেল)
আবাসিক বা ডুয়েলিং হাউজে মানুষের দৈনন্দিন আরামদায়ক জীবনযাপন নিশ্চিত করতে এবং হোটেলে কাস্টমারদের আকর্ষণীয় সেবা দিতে এই আলোর মাত্রাগুলো নির্দিষ্ট করা হয়েছে:

| রুম বা কার্যক্রমের স্থান (Area or Activity) | প্রয়োজনীয় আলোর তীব্রতা (Illuminance - Lux) |
|---|---|
| শোবার ঘর (Bedrooms) - সাধারণ আলো (General) | 70 Lux |
| শোবার ঘর (Bedrooms) - বিছানার মাথা ও ড্রেসিং টেবিল (Bed-head & Dressing Table) | 250 Lux |
| রান্নাঘর (Kitchens) | 200 Lux |
| ডাইনিং বা খাবার ঘর (Dining Rooms - Tables) | 150 Lux |
| বাথরুম (Bathrooms) - সাধারণ আলো (General) | 100 Lux |
| বাথরুম (Bathrooms) - সেভিং ও মেক-আপ (Shaving & Make-up) | 300 Lux |
| বাথরুম (Bathrooms) - আয়নার উপর (Above mirror) | 300 Lux |
| সিঁড়িঘর (Stairs) | 100 Lux |
| বসার ঘর বা লাউঞ্জ (Lounges) | 100 Lux |
| গ্যারেজ ও প্রবেশ বারান্দা (Garages & Porches) | 100 Lux |
| বেসমেন্ট গাড়ি পার্কিং (Basement Car Park) | 100 Lux |
| প্রবেশদ্বার ও অন্যান্য প্রবেশপথ (Porches, Entrances) | 70 Lux |
| কাপড়ের সেলাই ও মেরামত কাজ (Sewing and darning) | 600 Lux |
| বই পড়া - সাধারণ ও ক্যাজুয়াল (Reading - casual) | 150 Lux |
| দীর্ঘ সময় ধরে পড়াশোনা ও হোম ওয়ার্ক (Home work and sustained reading) | 300 Lux |
| খাদ্য সামগ্রী ভাণ্ডার (Food stores) | 100 Lux |
| অন্যান্য কর্মক্ষেত্র (Working areas) | 250 Lux |
| প্যাসেঞ্জার ও মালামাল বা লিফট (Goods and passenger lifts) | 70 Lux |
| টয়লেট ও ড্রেসিং রুম (Cloak-rooms and toilets) | 100 Lux |
| হোটেল - মেইন এন্ট্রান্স হল (Hotels - Entrance Halls) | 150 Lux |
| হোটেল - রিসিপশন ও হিসাবরক্ষণ কাউন্টার (Hotels - Reception & Accounts) | 300 Lux |
| হোটেল - রেস্টুরেন্ট বা ডাইনিং টেবিল (Hotels - Dining Rooms) | 150 Lux |
| হোটেল - লাউঞ্জ ও সাধারণ বসার এলাকা (Hotels - Lounges) | 150 Lux |
| হোটেল - গেস্ট বেডরুম সাধারণ আলো (Hotels - Bedrooms General) | 100 Lux |
| হোটেল - বেডরুম ড্রেসিং টেবিল ও বেড হেড (Hotels - Dressing Tables & Bed Heads) | 250 Lux |
| হোটেল - গেস্ট রিডিং ও রাইটিং টেবিল (Hotels - Writing Rooms) | 300 Lux |
| হোটেল - করিডোর ও যাতায়াত পথ (Hotels - Corridors) | 70 Lux |
| হোটেল - গেস্ট সিঁড়িঘর (Hotels - Stairs) | 100 Lux |
| হোটেল - নিজস্ব লন্ড্রি বা ধোলাইখানা (Hotels - Laundries) | 200 Lux |

---

### Table 8.1.6: Recommended Values of Illumination for Educational Buildings (শিক্ষা প্রতিষ্ঠান)
শ্রেণীকক্ষ, ল্যাবরেটরি ও পরীক্ষার হলগুলোতে শিক্ষার্থীদের চোখের ক্লান্তি এড়াতে এবং পড়াশোনায় পূর্ণ মনোযোগ ধরে রাখতে সঠিক আলোর মাত্রা অত্যন্ত জরুরি:

| শিক্ষা প্রতিষ্ঠানের কার্যক্রম বা স্থান (Area or Activity) | প্রয়োজনীয় আলোর তীব্রতা (Illuminance - Lux) |
|---|---|
| স্কুল ও কলেজ মিলনায়তন (Assembly Halls) - সাধারণ আলো (General) | 150 Lux |
| স্কুল ও কলেজ মিলনায়তন (Assembly Halls) - পরীক্ষার সময় (When used for examinations) | 300 Lux |
| স্কুল ও কলেজ মিলনায়তন (Assembly Halls) - মঞ্চ বা ডায়াস (Platforms) | 300 Lux |
| শ্রেণীকক্ষ ও লেকচার থিয়েটার (Class & Lecture Rooms) - ডেস্ক ও বেঞ্চ (Desks) | 300 Lux |
| শ্রেণীকক্ষ ও লেকচার থিয়েটার (Class & Lecture Rooms) - ব্ল্যাকবোর্ড (Black boards) | 300 Lux |
| সেলাই, এমব্রয়ডারি ও ক্রাফটিং রুম (Embroidery and sewing rooms) | 500 Lux |
| বিজ্ঞানের গবেষণাগার বা ল্যাবরেটরি (Laboratories) | 350 Lux |
| আর্ট রুম ও ড্রয়িং ক্লাসরুম (Art rooms) | 400 Lux |
| প্রশাসনিক অফিস ও প্রিন্সিপাল চেম্বার (Offices) | 300 Lux |
| শিক্ষক মিলনায়তন ও কমন রুম (Staff rooms and common rooms) | 150 Lux |
| বারান্দা ও করিডোর (Corridors) | 100 Lux |
| যাতায়াতের সিঁড়িঘর (Stairs) | 100 Lux |
| জিমনেসিয়াম বা ইনডোর ক্রীড়াকক্ষ (Gymnasium) - সাধারণ প্র্যাকটিস (General) | 150 Lux |
| জিমনেসিয়াম বা ইনডোর ক্রীড়াকক্ষ (Gymnasium) - ম্যাচ বা প্রতিযোগিতা (Matches) | 300 Lux |
| গ্রন্থাগার বা রিডিং হল (Library) | See Table 8.1.8 |
| আবাসিক শিক্ষা প্রতিষ্ঠানের ডরমিটরি বা হোস্টেল (Living quarters) | See Table 8.1.5 |

---

### Table 8.1.7: Recommended Values of Illumination for Health Care Buildings (হাসপাতাল ও ক্লিনিক)
চিকিৎসকদের নিখুঁত রোগ নির্ণয়, ইনটেনসিভ কেয়ার এবং জটিল সার্জারি করার জন্য হাসপাতালগুলোতে অত্যন্ত সংবেদনশীল ও বিশেষায়িত আলোর প্রয়োজন হয়:

| হাসপাতাল ও ক্লিনিকের কার্যক্রম বা স্থান (Area or Activity) | প্রয়োজনীয় আলোর তীব্রতা (Illuminance - Lux) |
|---|---|
| রিসিপশন কাউন্টার ও ওয়েটিং রুম (Reception & waiting rooms) | 150 Lux |
| আউটডোর বা বহিঃবিভাগ (Outpatient department) | 150 Lux |
| ইনডোর জেনারেল ওয়ার্ড (Wards) - সাধারণ আলো (General) | 150 Lux |
| রোগীর শয্যা বা বেড এলাকা (Beds) | 150 Lux |
| অপারেশন থিয়েটার (Operating theatres) - সাধারণ পরিপার্শ্ব (General) | 300 Lux |
| মাইনর অপারেশন টেবিল (Minor Table - Adjustable Lamp) | 2000 Lux |
| মেজর অপারেশন টেবিল (Major Table - Adjustable Lamp) | 5000 Lux |
| ডাক্তারদের কনসালটেশন ও পরীক্ষা কক্ষ (Doctor's examination rooms) | 150 Lux |
| এক্স-রে, আল্ট্রাসনোগ্রাফি ও রেডিওলজি বিভাগ (Radiology departments) | 100 Lux |
| জরুরি বা ক্যাজুয়াল্টি বিভাগ (Casualty) | 150 Lux |
| সিঁড়িঘর ও মূল প্যাসেজওয়ে (Stairs and corridors) | 100 Lux |
| ফার্মেসি বা মেডিসিন ডিসপেনসারি (Dispensaries) | 250 Lux |

---

### Table 8.1.8: Recommended Values of Illumination for Assembly Buildings (সামাজিক, জনসমাবেশ ও বিনোদনমূলক ভবন)
সিনেমা হল, গ্রন্থাগার, রেস্তোরাঁ ও বিভিন্ন ইনডোর স্পোর্টস সেন্টারে আগত বিশাল জনগণের নিরাপত্তা ও বিনোদন সুনিশ্চিত করতে নিচের গাইডলাইন প্রযোজ্য:

| জনসমাবেশ ও বিনোদন কার্যক্রম (Area or Activity) | প্রয়োজনীয় আলোর তীব্রতা (Illuminance - Lux) |
|---|---|
| সিনেমা হল (Cinemas) - প্রবেশদ্বার বা ফয়ার (Foyers) | 150 Lux |
| সিনেমা হল (Cinemas) - অডিটোরিয়াম দর্শক আসন (Auditorium) | 100 Lux |
| সিনেমা হল (Cinemas) - যাতায়াত করিডোর (Corridors) | 100 Lux |
| সিনেমা হল (Cinemas) - সিঁড়িঘর (Stairs) | 150 Lux |
| থিয়েটার বা নাট্যমঞ্চ (Theatres) - ফয়ার (Foyers) | 150 Lux |
| থিয়েটার বা নাট্যমঞ্চ (Theatres) - দর্শক গ্যালারি (Auditorium) | 70 Lux |
| থিয়েটার বা নাট্যমঞ্চ (Theatres) - করিডোর (Corridors) | 90 Lux |
| থিয়েটার বা নাট্যমঞ্চ (Theatres) - প্রধান সিঁড়িঘর (Stairs) | 150 Lux |
| গ্রন্থাগার (Libraries) - বই রাখার প্রধান তাক বা র্যাক (Shelves - stacks) | 150 Lux |
| গ্রন্থাগার (Libraries) - সংবাদপত্র ও সাময়িকী কক্ষ (Newspapers & magazines) | 200 Lux |
| গ্রন্থাগার (Libraries) - রিডিং টেবিল (Reading tables) | 300 Lux |
| গ্রন্থাগার (Libraries) - বই বাঁধাই ও মেরামত কক্ষ (Book repair/binding) | 300 Lux |
| গ্রন্থাগার (Libraries) - ক্যাটালগিং, সোর্টিং ও স্টক রুম | 150 Lux |
| ইনডোর স্পোর্টস সেন্টার - প্রধান স্পোর্টস হল (Halls) | 200 Lux |
| ইনডোর স্পোর্টস সেন্টার - সুইমিং পুল (Swimming pools) | 250 Lux |
| লন টেনিস, ব্যাডমিন্টন, ভলিবল কোর্ট - টুর্নামেন্ট খেলা (Tournament) | 300 Lux |
| লন টেনিস, ব্যাডমিন্টন, ভলিবল কোর্ট - ক্লাবের সাধারণ প্র্যাকটিস (Club) | 200 Lux |
| জাদুঘর (Museums) - সাধারণ পরিভ্রমণ এলাকা (General) | 200 Lux |
| জাদুঘর (Museums) - বিশেষ শো-কেস বা গ্লাস ক্যাবিনেট (Displays) | Special Lighting |
| আর্ট গ্যালারি (Art galleries) - সাধারণ ভিউয়িং এরিয়া (General) | 250 Lux |
| আর্ট গ্যালারি (Art galleries) - পেইন্টিং ও শিল্পকর্ম প্রদর্শন (Paintings) | 250 Lux |
| রেস্তোরাঁ (Restaurant) - খাবার টেবিল এলাকা (Dining rooms) | 150 Lux |
| রেস্তোরাঁ (Restaurant) - বিলিং ও ক্যাশ কাউন্টার (Cash desks) | 300 Lux |
| রেস্তোরাঁ (Restaurant) - সেলফ-সার্ভিস কাউন্টার (Counters) | 300 Lux |
| রেস্তোরাঁ (Restaurant) - রান্নাঘর বা কিচেন (Kitchens) | 200 Lux |
| রেস্তোরাঁ (Restaurant) - টয়লেট ও ক্লোকরুম (Toilets) | 100 Lux |
| সাধারণ রিক্রিয়েশন সেন্টার ও ক্লাবহাউজ (Recreational) | 150 Lux |
| শুটিং রেঞ্জ (Shooting ranges) - নিশানা বা টার্গেট পয়েন্ট (On target) | 300 Lux |
| শুটিং রেঞ্জ (Shooting ranges) - ফায়ারিং পজিশন (Firing point) | 200 Lux |
| শুটিং রেঞ্জ (Shooting ranges) - সাধারণ রেঞ্জ এরিয়া (Range) | 100 Lux |
| ফুটবল স্টেডিয়াম ও বড় খেলার মাঠ (Football) | 500 Lux |

---

### Table 8.1.9: Recommended Values of Illumination for Business and Commercial Buildings (ব্যবসা ও বাণিজ্যিক ভবন)
অফিস, ব্যাংক, এয়ারপোর্ট ও শোরুমগুলোতে নিরবচ্ছিন্ন পাবলিক ট্রাফিক এবং জটিল দাপ্তরিক কাজের গতিশীলতা বাড়াতে প্রয়োজনীয় লাক্স স্ট্যান্ডার্ড:

| বাণিজ্যিক কার্যক্রম বা স্থান (Area or Activity) | প্রয়োজনীয় আলোর তীব্রতা (Illuminance - Lux) |
|---|---|
| এয়ারপোর্ট (Airport) - রিসিপশন ও হেল্প ডেস্ক (Reception areas) | 300 Lux |
| এয়ারপোর্ট (Airport) - লাগেজ হ্যান্ডলিং, কাস্টমস ও ইমিগ্রেশন হল | 300 Lux |
| এয়ারপোর্ট (Airport) - লাউঞ্জ ও সাধারণ সার্কুলেশন এরিয়া | 200 Lux |
| ব্যাংক (Banks) - ক্যাশ কাউন্টার, টাইপিং ও খাতা হিসাব এলাকা | 300 Lux |
| ব্যাংক (Banks) - সাধারণ পাবলিক এরিয়া ও প্রধান লবি (Lobby) | 150 Lux |
| ব্যাংক (Banks) - কর্মকর্তাদের সাধারণ ডেস্ক (Offices) | 200 Lux |
| বুক বাইন্ডিং (Book Binding) - আঠা লাগানো ও পঞ্চিং কাজ (Pasting) | 200 Lux |
| বুক বাইন্ডিং (Book Binding) - ফোল্ডিং ও বিবিধ বাইন্ডিং মেশিন | 300 Lux |
| বুক বাইন্ডিং (Book Binding) - গোল্ড ব্লক ও ফাইনাল এমবসিং কাজ | 300 Lux |
| ডেন্টাল ক্লিনিক (Dental Surgeries) - ওয়েটিং রুম (Waiting rooms) | 300 Lux |
| ডেন্টাল ক্লিনিক (Dental Surgeries) - সাধারণ ডেন্টাল চেম্বার | 150 Lux |
| ডেন্টাল ক্লিনিক (Dental Surgeries) - দাঁতের অপারেশন চেয়ার (Chairs) | Special Lighting |
| ডেন্টাল ক্লিনিক (Dental Surgeries) - ডেন্টাল টেকনিক্যাল ল্যাব | 300 Lux |
| ডাক্তার চেম্বার (Doctor's Surgeries) - কনসালটিং রুম | 150 Lux |
| ডাক্তার চেম্বার (Doctor's Surgeries) - চোখের দৃষ্টি পরীক্ষা ওয়াল চার্ট | 450 Lux |
| জুয়েলারি ও ঘড়ি প্রস্তুত কারখানা (Jewellery) - সূক্ষ্ম এসেম্বলিং কাজ | 700 Lux |
| জুয়েলারি ও ঘড়ি প্রস্তুত কারখানা (Jewellery) - ডায়মন্ড কাটিং ও পলিশিং | 1500 Lux |
| জুয়েলারি ও ঘড়ি প্রস্তুত কারখানা (Jewellery) - অতি সূক্ষ্ম প্রসেস কাজ | 3000 Lux |
| লন্ড্রি ও ড্রাই-ক্লিনিং - সোর্টিং, ওয়াশিং ও ড্রাইং এলাকা | 200 Lux |
| লন্ড্রি ও ড্রাই-ক্লিনিং - সূক্ষ্ম হ্যান্ড আয়রন, সেলাই ও ইন্সপেকশন | 300 Lux |
| সাধারণ অফিস (Offices) - এন্ট্রান্স লবি ও রিসিপশন এলাকা | 150 Lux |
| সাধারণ অফিস (Offices) - কনফারেন্স রুম ও ম্যানেজিং ডিরেক্টর অফিস | 300 Lux |
| সাধারণ অফিস (Offices) - সাধারণ কর্মকর্তাদের ওপেন ডেস্ক এরিয়া | 300 Lux |
| সাধারণ অফিস (Offices) - বড় ডাটা এন্ট্রি ও বিজনেস মেশিন অপারেটর | 450 Lux |
| সাধারণ অফিস (Offices) - ড্রয়িং অফিস ও ডিজাইন ব্লুপ্রিন্ট রুম | 300 Lux |
| সাধারণ অফিস (Offices) - ড্রয়িং বোর্ড ও ব্লুপ্রিন্ট ট্রেসিং টেবিল | 450 Lux |
| সাধারণ অফিস (Offices) - লিফট ও মেইন করিডোর (Lift & corridors) | 70 Lux |
| সাধারণ অফিস (Offices) - লিফটের ল্যান্ডিং লবি (Lift landings) | 150 Lux |
| টেলিফোন এক্সচেঞ্জ - ম্যানুয়াল বোর্ড কানেকশন ডেস্ক এরিয়া | 200 Lux |
| টেলিফোন এক্সচেঞ্জ - মেইন ডিস্ট্রিবিউশন ফ্রেম রুম (MDF Room) | 150 Lux |
| দোকান ও সুপারশপ (Shops & Stores) - সাধারণ পণ্য প্রদর্শন এলাকা | 150 - 300 Lux |
| দোকান ও সুপারশপ (Shops & Stores) - ব্যাক-এন্ড স্টোর ও কার্গো হোল্ড | 200 Lux |
| দোকান ও সুপারশপ (Shops & Stores) - ডিসপ্লে উইন্ডো (শোরুম সামনের গ্লাস) | 500 Lux |

---

### Table 8.1.10: Recommended Values of Illumination for Industrial Buildings and Processes (শিল্পকারখানা ও ইন্ডাস্ট্রিয়াল প্রসেস)
বাংলাদেশের প্রধান রপ্তানি খাত তৈরি পোশাক (RMG), টেক্সটাইল, ওষুধ শিল্প (Pharmaceuticals) ও ভারী মেশিন শপগুলোতে উৎপাদনশীলতা ও কর্মীর নিরাপত্তা নিশ্চিত করার জন্য নির্ধারিত লাক্স স্ট্যান্ডার্ড:

| শিল্পকারখানার ধরন ও কার্যক্রম (Industrial Area or Activity) | প্রয়োজনীয় আলোর তীব্রতা (Illuminance - Lux) |
|---|---|
| গার্মেন্টস (Clothing) - ফেব্রিক কালার ম্যাচিং (Matching-up) | 450 Lux |
| গার্মেন্টস (Clothing) - সাধারণ লাইট ফেব্রিক কাটিং ও সেলাই কাজ | 300 Lux |
| গার্মেন্টস (Clothing) - মিডিয়াম ফেব্রিক কাটিং ও মেশিন সেলাই কাজ | 450 Lux |
| গার্মেন্টস (Clothing) - গাঢ় রঙের সূক্ষ্ম ফেব্রিক কাটিং ও সেলাই কাজ | 700 Lux |
| গার্মেন্টস (Clothing) - লাইট ফেব্রিক কোয়ালিটি কন্ট্রোল ইন্সপেকশন | 450 Lux |
| গার্মেন্টস (Clothing) - মিডিয়াম ফেব্রিক কোয়ালিটি কন্ট্রোল ইন্সপেকশন | 1000 Lux |
| গার্মেন্টস (Clothing) - অত্যন্ত গাঢ় রঙের সূক্ষ্ম ফেব্রিক ইন্সপেকশন | 1500 Lux |
| গার্মেন্টস (Clothing) - পোশাক ফিনিশিং ও ইস্ত্রি বা প্রেসিং | 300 Lux |
| কার্পেট কারখানা - সুতা ওয়াইন্ডিং ও বিমিং (Winding) | 200 Lux |
| কার্পেট কারখানা - জ্যাকর্ড কার্ড কাটিং, ডিজাইনিং ও টুফটিং | 300 Lux |
| কার্পেট কারখানা - কার্পেট উইভিং, মেন্ডিং ও চূড়ান্ত ইন্সপেকশন | 450 Lux |
| টেক্সটাইল মিল (Cotton) - তুলা বেল ব্রেকিং ও মিক্সিং (Bale breaking) | 150 Lux |
| টেক্সটাইল মিল (Cotton) - সুতা কার্ডিং ও ড্রয়িং (Carding & drawing) | 200 Lux |
| টেক্সটাইল মিল (Cotton) - সুতা স্লাবিং, রোভিং ও স্পুলিং | 200 Lux |
| টেক্সটাইল মিল (Cotton) - সাধারণ কাপড় বিমিং ও সাইজিং (Grey goods) | 200 Lux |
| টেক্সটাইল মিল (Cotton) - ডেনিমস বা ভারী জিন্স কাপড় বিমিং ও সাইজিং | 300 Lux |
| টেক্সটাইল মিল (Cotton) - প্যাটার্নড হালকা রঙের কাপড় বোনা (Weaving) | 300 Lux |
| টেক্সটাইল মিল (Cotton) - প্যাটার্নড গাঢ় রঙের সূক্ষ্ম কাপড় বোনা | 500 Lux |
| টেক্সটাইল মিল (Cotton) - সাধারণ গ্রে ক্লথ উইভিং কাজ | 200 Lux |
| টেক্সটাইল মিল (Cotton) - ফিনিশড কাপড় পরিদর্শন (Cloth inspection) | 700 Lux |
| সিল্ক ও সিন্থেটিক টেক্সটাইল - সুতা সোকিং ও টুইস্টিং কাজ | 200 Lux |
| সিল্ক ও সিন্থেটিক টেক্সটাইল - উইন্ডিং ও কুইল্টিং (Light thread) | 200 Lux |
| সিল্ক ও সিন্থেটিক টেক্সটাইল - উইন্ডিং ও কুইল্টিং (Dark thread) | 300 Lux |
| সিল্ক ও সিন্থেটিক টেক্সটাইল - ড্রয়িং-ইন ও হিল্ডিং (Healding) | 700 Lux |
| সিল্ক ও সিন্থেটিক টেক্সটাইল - সিল্ক কাপড় উইভিং ও মেন্ডিং | 300 - 500 Lux |
| সিল্ক ও সিন্থেটিক টেক্সটাইল - চূড়ান্ত সিল্ক ইন্সপেকশন | 1000 Lux |
| উলের টেক্সটাইল - উলের ক্লিনিং, কার্বোনাইজিং ও প্রেসিং | 150 Lux |
| উলের টেক্সটাইল - ব্লেন্ডিং, কার্ডিং ও ড্রাইং | 200 Lux |
| উলের টেক্সটাইল - স্পিনিং, রোভিং, উইন্ডিং ও টুইস্টিং | 450 Lux |
| উলের টেক্সটাইল - সূক্ষ্ম ওরস্টেড কাপড় উইভিং (Fine worsteds) | 700 Lux |
| উলের টেক্সটাইল - মিডিয়াম ওরস্টেড উইভিং (Medium worsteds) | 450 Lux |
| উলের টেক্সটাইল - ভারী উলের কাপড় উইভিং (Heavy woollens) | 300 Lux |
| উলের টেক্সটাইল - বার্লিং ও মেন্ডিং (Burling and mending) | 700 Lux |
| উলের টেক্সটাইল - গ্রে ইন্সপেকশন (Perching - Grey) | 700 Lux |
| উলের টেক্সটাইল - চূড়ান্ত ফিনিশড উল পরিদর্শন (Perching - Final) | 2000 Lux |
| ফার্মাসিউটিক্যালস (Pharmaceuticals) - কাঁচামাল স্টোরেজ ও গুদাম | 200 Lux |
| ফার্মাসিউটিক্যালস (Pharmaceuticals) - গ্রাইন্ডিং, গ্র্যানুলেটিং ও ড্রাইং | 300 Lux |
| ফার্মাসিউটিক্যালস (Pharmaceuticals) - সলিউশন প্রিপারেশন, সিলিং ও ফিলিং | 300 Lux |
| ফার্মাসিউটিক্যালস (Pharmaceuticals) - ক্যাপসুলিং, ট্যাবলেট মেকিং ও কার্টনিং | 300 Lux |
| ফার্মাসিউটিক্যালস (Pharmaceuticals) - কোয়ালিটি কন্ট্রোল ল্যাব ও টেস্টিং | 300 Lux |
| ফার্মাসিউটিক্যালস (Pharmaceuticals) - কেমিক্যাল প্রসেসিং ও ফিনিশিং | 200 - 300 Lux |
| লেদার কারখানা (Leather) - চামড়া ক্লিনিং, ট্যানিং ও স্ট্রেচিং ভ্যাটস | 150 Lux |
| লেদার কারখানা (Leather) - চামড়া কাটিং, ফ্লেশিং ও স্টাফিং | 200 Lux |
| লেদার কারখানা (Leather) - চামড়া ফিনিশিং ও স্কার্ফিং | 200 Lux |
| চামড়ার জুতো কারখানা - কাটিং টেবিল ও সোর্টিং (Cutting) | 450 Lux |
| চামড়ার জুতো কারখানা - জুতো সেলাই লাইট ফেব্রিক (Stitching - Light) | 300 Lux |
| চামড়ার জুতো কারখানা - জুতো সেলাই ডার্ক বা ব্ল্যাক লেদার (Stitching - Dark) | 1000 Lux |
| চামড়ার জুতো কারখানা - সোল লেয়ারিং, নেইলিং ও চূড়ান্ত পলিশিং | 600 Lux |
| রবার জুতো কারখানা - ওয়াশিং, কোটিং ও মিল রান কম্পাউন্ডিং | 100 Lux |
| রবার জুতো কারখানা - বার্নিশিং, ভলকানাইজিং ও সোলের ক্যালেন্ডারিং | 300 Lux |
| রবার জুতো কারখানা - সোল রোলিং ও লাইনিং মেকিং প্রসেস | 500 Lux |
| ইলেকট্রিক্যাল শিল্প - রজন ইম্প্রেগনেটিং (Impregnating) | 250 Lux |
| ইলেকট্রিক্যাল শিল্প - কয়েল ওয়াইন্ডিং ও মোটর ইনসুলেটিং | 500 Lux |
| ইলেকট্রিক্যাল শিল্প - সাধারণ ইলেকট্রিক্যাল প্রোডাক্ট এসেম্বলি | 500 Lux |
| ইলেকট্রিক্যাল শিল্প - অতি সূক্ষ্ম ইলেকট্রনিক্স এসেম্বলি (Very fine) | 750 Lux |
| ইলেকট্রিক্যাল শিল্প - পারফরম্যান্স টেস্টিং ল্যাব ও টেস্টিং এরিয়া | 500 Lux |
| পাওয়ার স্টেশন (Indoor) - টারবাইন হল (Turbine halls) | 150 Lux |
| পাওয়ার স্টেশন (Indoor) - বয়লার হাউস ও কোল কনভেয়র এলাকা | 100 - 150 Lux |
| পাওয়ার স্টেশন (Indoor) - ব্যাটারি রুম, অক্সিলিয়ারি জেনারেটর রুম | 150 Lux |
| পাওয়ার স্টেশন (Indoor) - সাবস্টেশন বেসমেন্ট ও ক্যাবল টানেল | 100 Lux |
| পাওয়ার স্টেশন (Indoor) - জরুরি ইমার্জেন্সি লাইটিং (Emergency) | 30 Lux |
| সাবস্টেশন কন্ট্রোল রুম - ভার্টিক্যাল কন্ট্রোল প্যানেল বোর্ড | 200 - 300 Lux |
| সাবস্টেশন কন্ট্রোল রুম - অপারেটর ডেস্ক (Control desks) | 300 Lux |
| সাবস্টেশন কন্ট্রোল রুম - কন্ট্রোল প্যানেলের পিছনের অংশ | 150 Lux |
| সাবস্টেশন কন্ট্রোল রুম - সুইচ হাউস এলাকা (Switch houses) | 150 Lux |
| পাওয়ার স্টেশন (Outdoor) - সুইচইয়ার্ড গ্রাউন্ড (Switchyard) | 70 Lux |
| পাওয়ার স্টেশন (Outdoor) - ট্র্যান্সফর্মার ও আউটডোর সুইচগিয়ার এলাকা | 100 Lux |
| পাওয়ার স্টেশন (Outdoor) - কনভেয়র গ্যান্ট্রি ও অয়েল স্টোরেজ ট্যাংক | 70 Lux |
| পাওয়ার স্টেশন (Outdoor) - ক্যাট-ওয়াক ও আউটডোর গ্যাংওয়ে প্লাটফর্ম | 70 Lux |
| পাওয়ার স্টেশন (Outdoor) - আউটডোর ইমার্জেন্সি লাইটিং (Emergency) | 50 Lux |
| কেমিক্যাল কারখানা - হ্যান্ড ফার্নেস, ফুটন্ত ও ক্রিস্টালাইজার ট্যাংক | 150 Lux |
| কেমিক্যাল কারখানা - মেকানিক্যাল ফার্নেস ও ফিল্ট্রেশন ফিল্টার | 200 Lux |
| কেমিক্যাল কারখানা - কেমিক্যাল কুকিং ট্যাংক ও ডিস্ট্রিলারি ফিল্টার | 200 Lux |
| কাগজ কারখানা - কাগজের বিটার ও পাল্প গ্রাইন্ডিং (Grinding) | 150 Lux |
| কাগজ কারখানা - পেপার মেকিং মেশিন ফিনিশিং ও কাটিং | 200 Lux |
| কাগজ কারখানা - কাগজের শিট গণনা (Hand counting) | 350 Lux |
| কাগজ কারখানা - পেপার মেশিন রিল, পেপার ইন্সপেকশন ল্যাব | 500 Lux |
| কাগজ কারখানা - পেপার রোল রিউইন্ডার (Rewinder) | 500 Lux |
| কাগজ কারখানা - কাগজের বক্স প্রস্তুতকরণ (Paper box making) | 200 Lux |
| ময়দা ও ময়দার কল (Flour Mills) - রোলার ফ্লোর ও মিলিং (Rolling) | 150 Lux |
| ময়দা ও ময়দার কল (Flour Mills) - চালনি ও প্যাকিং সেকশন (Sifting/Packing) | 150 Lux |
| ময়দা ও ময়দার কল (Flour Mills) - ফাইন প্রোডাক্ট কোয়ালিটি কন্ট্রোল | 300 Lux |
| ময়দা ও ময়দার কল (Flour Mills) - স্ক্রিন ক্লিনিং ও ম্যান লিফট যাতায়াত পথ | 100 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - ফোর্জিং শপ ফ্লোর (Forge shop) | 150 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - অ্যানিলিং ফার্নেস বা তাপ নিয়ন্ত্রণ চুলা | 150 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - ফাইন কোর মেকিং বা ছাঁচ তৈরি (Fine) | 300 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - মিডিয়াম কোর মেকিং বা ছাঁচ তৈরি | 150 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - গ্রাইন্ডিং ও মেটাল চিপিং (Grinding) | 200 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - ঢালাই পরিদর্শনের ফাইন কোয়ালিটি চেক | 1000 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - ঢালাই পরিদর্শনের মিডিয়াম কোয়ালিটি চেক | 300 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - মোল্ডিং বা মেটাল ছাঁচ প্রস্তুতি (Medium) | 300 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - মোল্ডিং বা মেটাল ছাঁচ প্রস্তুতি (Large) | 150 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - লিকুইড মেটাল ঢালাই কাজ (Pouring) | 150 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - পার্টস সোর্টিং ও স্ক্র্যাপ ফিল্টারিং | 200 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - কিউপোলা ফার্নেস কন্ট্রোল (Cupola) | 100 Lux |
| মেটাল ফোর্জিং ও ফাউন্ড্রি - শেক আউট বা মেটাল পার্টস পৃথকীকরণ | 150 Lux |
| গ্যারেজ ও অটোমোবাইল সার্ভিস - গাড়ির পার্কিং গ্যারেজ (Interior) | 70 Lux |
| গ্যারেজ ও অটোমোবাইল সার্ভিস - গাড়ি ধোয়া ও পলিশিং, গ্রীসিং ও পিট | 200 Lux |
| গ্লাস কারখানা - গ্লাস ফার্নেস রুম, বাঁকানো ও অ্যানিলিং লেহর | 100 Lux |
| গ্লাস কারখানা - গ্লাস মিক্সিং রুম, ফর্মিং ও রোলার ব্লোয়িং | 150 Lux |
| গ্লাস কারখানা - গ্লাস সাইজ কাটিং, গ্রাইন্ডিং ও পলিশিং | 200 Lux |
| গ্লাস কারখানা - গ্লাস এচিং, ডেকোরেশন ও সিলভারিং ফিনিশ | 300 Lux |
| গ্লাস কারখানা - চমৎকার কাটিং সাধারণ কাজ (Brilliant - General) | 200 Lux |
| গ্লাস কারখানা - চমৎকার কাটিং সূক্ষ্ম ডিজাইন কাজ (Brilliant - Fine) | 500 Lux |
| গ্লাস কারখানা - চূড়ান্ত গ্লাস ইন্সপেকশন ও সুদৃশ্য ডেকোরেশন | 500 Lux |
| দস্তানা বা গ্লাভস প্রস্তুত - প্রেসিং, নিটিং ও কাটিং | 300 Lux |
| দস্তানা বা গ্লাভস প্রস্তুত - গ্লাভস সেলাই লাইট ফেব্রিক | 300 Lux |
| দস্তানা বা গ্লাভস প্রস্তুত - গ্লাভস সেলাই ডার্ক বা উলের ফেব্রিক | 700 Lux |
| দস্তানা বা গ্লাভস প্রস্তুত - গ্লাভস ইন্সপেকশন (Medium inspection) | 1000 Lux |
| দস্তানা বা গ্লাভস প্রস্তুত - গ্লাভস ইন্সপেকশন (Dark inspection) | 1500 Lux |
| হোসিয়ারি ও নিটওয়্যার - বৃত্তাকার ও ফ্ল্যাট নিটিং মেশিন সেকশন | 300 Lux |
| হোসিয়ারি ও নিটওয়্যার - লক-স্টিচ ও ওভারলকিং লাইট সূক্ষ্ম কাজ | 300 Lux |
| হোসিয়ারি ও নিটওয়্যার - লক-স্টিচ ও ওভারলকিং ডার্ক বা উলের ফেব্রিক | 700 Lux |
| হোসিয়ারি ও নিটওয়্যার - সুতা রি-নিং ও সুতো মেন্ডিং কাজ (Mending) | 1500 Lux |
| হোসিয়ারি ও নিটওয়্যার - চূড়ান্ত পোশাকের ডিফেক্ট এক্সামিনেশন | 700 Lux |
| হোসিয়ারি ও নিটওয়্যার - পার্টস লিংকিং বা একত্রীকরণ কাজ | 450 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - কাঁচামাল ইয়ার্ড (Stock yard) | 20 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - ফার্নেস চার্জিং ফ্লোর ও স্ল্যাগ পিট | 100 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - কন্ট্রোল কেবিন ও ব্রিজ প্লাটফর্ম | 100 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - মোল্ড ইয়ার্ড ও কাস্টিং এরিয়া | 25 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - হট টপ স্টোরেজ ও হট রোলিং স্টোর | 100 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - স্ক্র্যাপ স্টকইয়ার্ড ও ডাম্প এরিয়া | 20 Lux |
| লোহা ও ইস্পাত ম্যানুফ্যাকচারিং - রিমিক্সার বিল্ডিং ও ক্যালসিনিং | 100 Lux |
| লোহা ও ইস্পাত রোলিং মিলস - ব্লুমিং ও স্ল্যাবিং হট স্ট্রিপ মিলস | 100 Lux |
| লোহা ও ইস্পাত রোলিং মিলস - কোল্ড স্ট্রিপ ও প্লেট কাটিং মিলস | 150 Lux |
| লোহা ও ইস্পাত রোলিং মিলস - পাইপ, রড, টিউব ও ওয়্যার ড্রয়িং মিলস | 200 Lux |
| লোহা ও ইস্পাত রোলিং মিলস - মার্চেন্ট ও শেয়ারড প্লেট ফিনিশিং | 100 Lux |
| টিন প্লেট ও শিট মেটাল ওয়ার্ক - টিনিং ও গ্যালভানাইজিং প্রসেস | 200 Lux |
| টিন প্লেট ও শিট মেটাল ওয়ার্ক - কোল্ড স্ট্রিপ রোলিং মিল এরিয়া | 200 Lux |
| টিন প্লেট ও শিট মেটাল ওয়ার্ক - বিবিধ মেশিন ও সাধারণ বেঞ্চ ওয়ার্ক | 200 Lux |
| টিন প্লেট ও শিট মেটাল ওয়ার্ক - মেটাল প্রেসিং, ফোল্ডিং ও স্ট্যাম্পিং | 200 Lux |
| টিন প্লেট ও শিট মেটাল ওয়ার্ক - টিন প্লেট চূড়ান্ত পরিদর্শন (Inspection) | 500 Lux |
| লোহার স্ট্রাকচারাল ফেব্রিকেশন - লোহা ফেব্রিকেশন ও সাধারণ কাজ | 150 Lux |
| লোহার স্ট্রাকচারাল ফেব্রিকেশন - মেটাল মার্কিং, লেআউট ও মেটাল কাটিং | 300 Lux |
| মেটাল প্লেটিং শপ - ভ্যাট ও মেটাল পলিশিং বাফিং বাথস | 200 Lux |
| মেটাল প্লেটিং শপ - চূড়ান্ত বাফিং ও উজ্জ্বল পলিশিং (Final) | 500 Lux |
| মেশিন শপ - রাফ বেঞ্চ ওয়ার্ক ও রাফ মেশিন টুলস কাজ | 150 Lux |
| মেশিন শপ - মাঝারি বেঞ্চ ও সাধারণ লেদ ও লিনিয়ার মেশিন | 300 Lux |
| machine শপ - সূক্ষ্ম এসেম্বলিং, সূক্ষ্ম মিলিং ও গ্রাইন্ডিং কাজ | 700 Lux |
| মেশিন শপ - অতি সূক্ষ্ম এসেম্বলিং ও প্রিসিশন গ্রাইন্ডিং কাজ | 1000 Lux |
| পেইন্ট বা রং কারখানা - সাধারণ অটোমেটিক কালার ফিলিং প্রসেস | 200 Lux |
| পেইন্ট বা রং কারখানা - বিশেষ কালার ব্যাচ মিক্সিং (Batch mixing) | 450 Lux |
| পেইন্ট বা রং কারখানা - সূক্ষ্ম কালার ম্যাচিং পরিদর্শন (Color matching) | 700 Lux |
| সাবান কারখানা - কেটল হাউস ও কন্টিনিউয়াস সোপ মেকিং | 150 Lux |
| সাবান কারখানা - সাবানের কন্ট্রোল প্যানেল ও মিটার বোর্ড | 200 - 300 Lux |
| সাবান কারখানা - সাবান কুলিং, কাটিং ও ড্রাইং মিলিং সেকশন | 150 Lux |
| সাবান কারখানা - সাবান স্ট্যাম্পিং, র‍্যাপিং ও প্যাকিং লাইন | 150 Lux |
| সাবান কারখানা - ভোজ্য তেল প্রসেসিং ও ভোজ্য ঘি প্যাকিং লাইন | 200 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - প্লাস্টিসেটিং ও রাবার মিলিং | 100 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - রাবার ক্যালেন্ডারিং শিট | 150 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - উলের বা কাপড়ের কটন ফেব্রিক কাটিং | 250 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - টায়ার সলিড ও টায়ার টিউবিং | 250 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - টায়ার বিল্ডিং (Pneumatic) | 250 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - কিউরিং কিট ও কিউরিং ডিপার্টমেন্ট | 350 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - চূড়ান্ত টিউব ও টায়ার কাস্টিং চেক | 1000 Lux |
| রবার টায়ার ও টিউব ম্যানুফ্যাকচারিং - চূড়ান্ত টায়ার র‍্যাপিং ও প্যাকিং | 200 Lux |
| কাঠ মিল ও ফার্নিচার ফ্যাক্টরি - রাফ কাঠের করাত মিলের সয়িং | 150 Lux |
| কাঠ মিল ও ফার্নিচার ফ্যাক্টরি - কাঠ সাইজিং, প্ল্যানিং ও গ্লুয়িং | 200 Lux |
| কাঠ মিল ও ফার্নিচার ফ্যাক্টরি - সূক্ষ্ম কাঠের বেঞ্চ ওয়ার্ক ও ফিনিশিং | 300 Lux |

---

### লাইটিং ডিজাইনের সবচেয়ে বড় ভুল ধারণা
অনেকেই মনে করেন, "বেশি আলো মানেই ভালো লাইটিং।" এটি সম্পূর্ণ ভুল। 

ধরুন, একটি ২০ বর্গমিটারের অফিসে BNBC অনুযায়ী ৩০০ লাক্স আলো দরকার। কিন্তু ঠিকাদার না বুঝে সেখানে ৮০০ লাক্স আলো দিয়ে দিল। এর ফলে:
- বিদ্যুৎ বিল দ্বিগুণ হবে।
- মানুষের চোখে তীব্র গ্লেয়ার বা আলোর ঝলকানি লাগবে।
- কম্পিউটার স্ক্রিনে রিফ্লেকশন এসে চোখে ক্লান্তি ও মাথা ব্যথার সৃষ্টি করবে।
- এসির লোড বেড়ে যাবে (লাইটের উৎপন্ন অতিরিক্ত তাপের কারণে)।

হ্যাভ ইউ হার্ড অফ দ্য গোল্ডেন রুল? "If you cannot find your own shadow, there is too much light." (অতিরিক্ত আলোতে ছায়া হারিয়ে যায়!)

অন্যদিকে যদি মাত্র ১০০ লাক্স দেওয়া হয়, তবে কাজের মান খারাপ হবে, অপারেটরদের চোখে অতিরিক্ত চাপ পড়বে এবং কাজের ভুল অনেক বেড়ে যাবে। তাই ভালো লাইটিং মানে বেশি আলো নয়—ঠিক যতটুকু দরকার ততটুকু আলো।

### একজন Electrical Engineer-এর কাছে এটি কেন গুরুত্বপূর্ণ?
ইলেকট্রিক্যাল ইঞ্জিনিয়ার হিসেবে যদি আপনি লাইটিং ডিজাইন না জানেন, তবে আপনি বড় কোনো অফিস, হাসপাতাল, শপিং মল বা ইন্ডাস্ট্রিয়াল প্রজেক্ট সফলভাবে ডিজাইন করতে পারবেন না। তাছাড়া রাজউক (RAJUK) কিংবা ফায়ার সার্ভিস (FSCD) থেকে বিল্ডিং ক্লিয়ারেন্স সার্টিফিকেটের জন্য এই কমপ্লায়েন্স ডিরেক্টিভগুলো মেনে চলাই একমাত্র পথ।

### এই সম্পূর্ণ লাইটিং ডিরেক্টিভ গাইড থেকে আপনি কী শিখবেন?
- **Lux ও Lumen-এর গাণিতিক সম্পর্ক**: লাক্স এবং লুমেন কীভাবে একে অপরের সাথে সম্পর্কিত।
- **Lumen Method দিয়ে লাইটের সংখ্যা গণনা**: একটি রুমে কয়টি লাইট লাগবে তা সুনির্দিষ্ট সূত্রে বের করা।
- **Utilization Factor (UF) ও Maintenance Factor (MF) নির্বাচন**: কীভাবে ঘরের চারপাশের দেয়াল ও ছাদের আলোর প্রতিফলন বিবেচনা করে ফ্যাক্টরগুলো ঠিক করতে হয়।
- **Ceiling, Wall এবং Floor-এর Reflectance**: বিভিন্ন রঙের দেয়ালের প্রতিফলন অনুপাত জানা।
- **Emergency Lighting & Exit Sign**: জরুরি অবস্থায় পথ নির্দেশ করার জন্য এক্সিট লাইটের সঠিক অবস্থান ও সংযোগ নিশ্চিত করা।

পরবর্তী অধ্যায়ে আমরা সবচেয়ে গুরুত্বপূর্ণ বিষয় লাক্স (Lux) এবং লুমেন (Lumen) নিয়ে বিস্তারিত গাণিতিক সমীকরণ ও উদাহরণসহ আলোচনা করব। চোখ রাখুন পরবর্তী অধ্যায়ে!`,
    tags: ['BNBC 2020', 'Lighting Design', 'Electrical Safety', 'Industrial Maintenance', 'Energy Efficiency'],
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    published: true
  },
  {
    slug: 'pfi-plant-maintenance-bangladesh',
    title: 'The Ultimate Guide to PFI (Power Factor Improvement) Plant Maintenance in Bangladesh Factories',
    category: 'সাবস্টেশন ও পাওয়ার ডিস্ট্রিবিউশন',
    date: '2026-06-15',
    readTime: '6 min read',
    summary: 'A deep-dive technical look at maintaining power factor correction above 0.95 under harsh industrial loads, preventing heavy regulatory penalties from distribution authorities.',
    content: `Maintaining a healthy Power Factor (PF) is not just a technical necessity in Bangladesh—it is a critical financial priority. Under Bangladesh Energy Regulatory Commission (BERC) rules, local distribution utilities (like DESCO, DPDC, or BREB) levy heavy surcharges if a factory's average power factor drops below 0.95.

### The Physics of Power Factor in Textile Machinery
Most textile machinery operates using highly inductive loads (three-phase induction motors for circular knitting machines, spinning frames, compressors, and pumps). These inductive loads absorb both Active Power (kW) and Reactive Power (kVAR). 

The Power Factor is represented as:
$$\\text{PF} = \\cos(\\theta) = \\frac{\\text{Active Power (kW)}}{\\text{Apparent Power (kVA)}}$$

To compensate for the lagging reactive current, we install a Power Factor Improvement (PFI) plant, which supplies local leading reactive power via heavy-duty capacitor banks.

### Common Failure Points of PFI Plants in Dhaka's Climate
Having maintained PFI plants in Gazipur and Uttara, I have identified three primary reasons why power factor panels fail:

1. **Capacitor Cell Degradation due to Ambient Thermal Stress:**
   Dhaka summers routinely push factory ambient temperatures above 40°C. Heavy-duty capacitors generate internal heat. If the PFI panel lacks active forced ventilation (cooling fans with clean dust filters), the internal foil insulation inside the capacitor cans dries out. This results in a gradual loss of capacitance. A 50 kVAR capacitor cell can drop to 30 kVAR in less than a year without thermal management.

2. **Contact Pit & Arcing in Switching Contactors:**
   Standard electrical contactors suffer from heavy sparking (inrush currents) when switching capacitive loads. Over time, the contacts become pitted, creating high contact resistance. This causes voltage imbalances across the capacitor phases or prevents the steps from turning on altogether.
   *Solution:* Always use specialized capacitor-switching contactors equipped with pre-charging damping resistors to limit current surges.

3. **Inaccurate Power Factor Controller (PFC) Relays:**
   The brain of the PFI plant is the microprocessor controller. If the CT (Current Transformer) ratio is entered incorrectly or if the CT is installed on the wrong phase, the controller reads false parameters, leading to under-compensation (surcharges) or over-compensation (overvoltage and resonance issues).

### Recommended Monthly PFI Maintenance Protocol
To ensure 100% reliability and keep your power factor at a comfortable 0.98, implement this checklist:
- **Thermal Imaging:** Scan all capacitor terminal blocks, contactors, and HRC fuses weekly. Any hot spot (> 55°C) indicates loose terminals or internal capacitor cell failure.
- **Current Balance Check:** Measure the individual phase currents of each capacitor step using a clamp-on ammeter. Equal current across all three phases verifies balanced capacitive impedance.
- **Manual Discharge and Discharge Resistor Verification:** Always wait 3-5 minutes after switching off a capacitor step before re-energizing or servicing, allowing built-in discharging resistors to bleed down the residual voltage to a safe level (< 50V).`,
    tags: ['PFI', 'Substation', 'Energy Efficiency', 'Industrial Maintenance'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    published: true
  },
  {
    slug: 'bnbc-2020-earthing-guidelines',
    title: 'Understanding BNBC 2020 Earthing and Safety Bonding Guidelines for Industrial Plants',
    category: 'বিএনবিসি কোড ও ইলেকট্রিক্যাল সেফটি',
    date: '2026-05-28',
    readTime: '5 min read',
    summary: 'An engineer\'s field manual to the latest Bangladesh National Building Code (BNBC) directives on grounding system design, soil resistivity testing, and equipment bonding.',
    content: `Safety earthing is the single most important line of defense against electrocution and equipment failure in modern industrial plants. In Bangladesh, the definitive standard is the **Bangladesh National Building Code (BNBC) 2020, Part 8, Chapter 2**.

### The Core Target: Earth Electrode Resistance
BNBC 2020 specifies that the composite resistance of the earthing system should ideally be **less than 1.0 Ohm** for industrial substations and sensitive electronic data centers, and must never exceed **5.0 Ohms** for residential/commercial loads under any seasonal variations.

In regions like Gazipur, Savar, and Narayanganj, the upper soil layer consists of highly resistive red clay and sand. Achieving less than 1.0 Ohm with a simple copper pipe is nearly impossible.

### Field Engineering: Achieving Compliance in Low-Conductivity Soils
To drive down earthing resistance to compliant levels, we employ several techniques:

1. **Chemical Earthing Systems:**
   Instead of traditional salt-and-charcoal (which washes away in the monsoon and corrodes the copper electrode), we use bentonite-based chemical earth-enhancing compounds. Bentonite is an highly conductive clay that absorbs surrounding soil moisture, expanding to form a tight, continuous conductive path around the electrode.

2. **Parallel Earth Loop Grid:**
   Never rely on a single earth bore. Connect all earth electrodes (Power Earth, Substation Neutral Earth, Lightning Protection Earth, and Body Earth) in a parallel loop. The equivalent resistance of parallel resistors is always lower than the lowest single resistance:
   $$\\frac{1}{R_{\\text{total}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots + \\frac{1}{R_n}$$

3. **Equipotential Bonding:**
   To completely eliminate dangerous potential differences between metal structures, BNBC 2020 mandates equipotential bonding. All exposed structural metallic parts, generator frames, boiler pipes, and cable ladders must be bonded together and connected directly to the Earth Grid using Earth Continuity Conductors (ECC) sized precisely according to the maximum prospective fault current.

### How We Conduct Soil Resistivity Testing
Before drilling, we perform a 4-point Wenner test using an earth tester:
- Place four stakes in a straight line at equal spacing 'a'.
- Inject current through the outer stakes and measure the voltage drop across the inner stakes.
- Calculate soil resistivity ($\\rho$) using:
  $$\\rho = 2 \\pi a R$$
This value tells us exactly how deep we need to bore or how many parallel earth rods are required.`,
    tags: ['BNBC 2020', 'Earthing', 'Safety Compliance', 'Field Testing'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200',
    published: true
  },
  {
    slug: 'acb-mccb-relay-selectivity',
    title: 'Demystifying ACB vs MCCB Protective Relay Selectivity & Coordination',
    category: 'ট্রান্সফরমার ও প্রোটেকশন রিলে',
    date: '2026-04-10',
    readTime: '7 min read',
    summary: 'How to plot IDMT curves and configure micro-processor trip units to prevent minor downstream faults from causing expensive factory-wide blackouts.',
    content: `A factory-wide power interruption is extremely expensive. In sweater manufacturing, a sudden loss of voltage during a circular knitting cycle ruins the raw material, causing major production waste and disrupting tight delivery schedules.

The solution to avoiding cascading outages is **Protective Device Coordination (Selectivity)**.

### What is Selectivity?
Selectivity means that when an electrical fault (overload or short-circuit) occurs, only the protective device immediately upstream of the fault should trip. All other upstream devices must remain closed, confining the outage exclusively to the faulty sub-circuit.

If a motor on a knitting floor has a phase-to-ground short, the individual Sub-Distribution Board (SDB) Moulded Case Circuit Breaker (MCCB) must trip. The main Substation Air Circuit Breaker (ACB) must NOT trip.

### The Role of Microprocessor-Based Trip Units (LSIG)
Modern ACBs are equipped with advanced electronic trip units that monitor and protect against four main conditions:
- **L (Long Time Delay - Overload):** Protects cable systems from slow, sustained overcurrents. Set close to the rated operating current ($I_r$).
- **S (Short Time Delay - Short Circuit):** Protects against medium-intensity faults. Allows downstream breakers to clear the fault first by delaying the ACB trip by a few milliseconds (e.g., 100ms or 200ms).
- **I (Instantaneous - High Fault Current):** Trips with no intentional time delay if a catastrophic near-zero impedance short-circuit occurs close to the main busbars.
- **G (Ground Fault):** Detects leakage current to earth, identifying winding insulation failures.

### Real-World Configuration Scenario
Consider an industrial facility with:
1. Downstream MCCB protecting a 45 kW motor line: Rated at 125A.
2. Main Substation ACB: Rated at 1000A.

If a short-circuit fault of 3000A occurs on the motor cable:
- If the ACB Instantaneous trip is set to $3 \\times I_n = 3000A$ with 0s delay, **both** the ACB and MCCB will trip simultaneously. The entire factory goes dark.
- **Selectivity Fix:** Adjust the ACB Short-Time trip ($I_{sd}$) to $4 \\times I_r = 4000A$ with a delay of **150 milliseconds**, while keeping the MCCB instantaneous trip at 0.05s. This 150ms buffer gives the downstream MCCB ample time to clear the motor fault independently. The ACB stays online, keeping the other floors operating normally.`,
    tags: ['Selectivity', 'ACB', 'MCCB', 'Overcurrent Protection', 'LSIG'],
    imageUrl: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=1200',
    published: true
  },
  {
    slug: 'bnbc-2020-lighting-design-guide-ch2',
    title: 'BNBC 2020 Lighting Design Guide (বাংলায়) — Chapter 2: Lux কী? কোথায় কত Lux লাগবে? BNBC অনুযায়ী Lighting Design-এর প্রথম ধাপ',
    category: 'লাইটিং ডিজাইন ও ইমার্জেন্সি ব্যাকআপ',
    date: '2026-07-21',
    readTime: '9 min read',
    summary: 'BNBC 2020 পার্ট ৮, চ্যাপ্টার ১ অনুযায়ী কোন রুমে কত লাক্স (Lux) আলো প্রয়োজন, লাক্স এবং ওয়াটের মধ্যকার পার্থক্য এবং ডিজাইন শুরু করার পূর্বে ইঞ্জিনিয়ারিং নিয়মাবলী জানুন।',
    content: `### BNBC Reference: Part VIII, Chapter 1, Clause 1.2.2 (Illumination Requirements)

আপনি যদি একটি রুমে দাঁড়িয়ে থাকেন এবং হঠাৎ চিন্তা করেন সেখানে লাইটিং ডিজাইন করবেন, আপনার প্রথম পদক্ষেপ কী হওয়া উচিত?

ধরুন আপনি নতুন একটি Office Building-এ গেছেন। Developer আপনাকে বলল, "এই Floor-এর Lighting Design করে দেন।" আপনি প্রথমে কী করবেন?
অনেকেই বলবেন, "আগে Light Selection করব।" আবার কেউ বলবেন, "আগে LED Panel কিনে ফেলি।" কিন্তু একজন Professional Lighting Designer কখনোই এভাবে কাজ শুরু করেন না। তিনি প্রথমে একটি প্রশ্ন করেন:
**"এই Room-এ কত Lux দরকার?"**
কারণ লাইটিং ডিজাইনের পুরো মূল ভিত্তিটাই হলো Lux।

## Lux আসলে কী?

সহজ ভাষায়, **Lux হলো কোনো নির্দিষ্ট জায়গায় বা কাজের তলে কতটুকু কার্যকর আলো পড়ছে তার পরিমাপ** (Illumination Level)।

ধরুন, আপনার হাতে একটি Torch আছে। Torch থেকে অনেক Light বের হচ্ছে (একে Lumen বলে)। কিন্তু সেই আলো যদি ১ বর্গমিটার জায়গায় পড়ে, আর একই আলো যদি ১০ বর্গমিটার জায়গায় ছড়িয়ে যায়, দুই ক্ষেত্রেই কি Brightness এক হবে? অবশ্যই না। এখানেই Lux-এর মূল ধারণা আসে।

### একটা সহজ উদাহরণ (বালতি ও পানির রূপক)

ধরুন আপনার কাছে এক বালতি পানি আছে। আপনি যদি সেই পানি একটি ছোট গ্লাসে ঢালেন, গ্লাস ভরে উপচে যাবে। কিন্তু একই পানি যদি একটি বড় ড্রামে ঢালেন, ড্রাম প্রায় খালিই থাকবে।

Light-ও ঠিক একই রকম। একই পরিমাণ আলো (Lumen) ছোট Room-এ অনেক Bright লাগবে, কিন্তু একই আলো বড় Hall-এ অনেক কম মনে হবে। এই কাজের তলের Brightness বা আলোর ঘনত্বকেই আমরা **Lux (lx)** দিয়ে পরিমাপ করি।

## Lux-এর গাণিতিক Formula

Lux বের করার সবচেয়ে সহজ Formula হলো—

$$\\text{Lux} = \\frac{\\text{Lumen}}{\\text{Area}}$$

এখানে,
- **Lux (lx)** = Working Surface-এ পড়া আলোর তীব্রতা
- **Lumen (lm)** = Light Source বা বাল্ব থেকে বের হওয়া মোট আলো (Luminous Flux)
- **Area (m²)** = যে জায়গায় আলো পড়ছে তার ক্ষেত্রফল (Square Meter)

### বাস্তব হিসাব নিকাশ (Real-world Calculation Node)

ধরুন, একটি LED Panel **3600 Lumens** আলো দেয়। এটি যদি **12 m²** এর একটি ছোট Room-এ ব্যবহার করেন, তাহলে গড়ে কত Lux পাবেন?

$$\\text{Lux} = \\frac{3600}{12} = 300\\text{ Lux}$$

অর্থাৎ, এই Room-এর Average Illumination হবে **300 Lux**।

## Watt বনাম Lux: সবচেয়ে বড় ভুল ধারণা!

অনেকে বলেন, *"এই Room-এ ২০ Watt Light লাগবে"* বা *"৪০ Watt দিলেই যথেষ্ট।"* এভাবে অন্ধকারে ঢিল ছুঁড়ে লাইটিং ডিজাইন করা সম্পূর্ণ ভুল। কারণ—
- **Watt** কোনো আলোর পরিমাপ নয়। এটি হলো **Electrical Power Consumption** (লাইটটি কতটুকু বিদ্যুৎ শক্তি গ্রহণ করছে)।
- **Lux** হলো **Light Level** (কাজের টেবিলে কতটুকু কার্যকর আলো এসে পৌঁছাচ্ছে)।

টেকনোলজি পরিবর্তনের সাথে সাথে একই Watt-এর লাইট ভিন্ন Lumen দিতে পারে। যেমন একটি ২০ ওয়াট সাধারণ টিউবলাইট ১০০০ লুমেন দিলে, একটি আধুনিক ২০ ওয়াট এলইডি লাইট ২০০০ লুমেনের বেশি আলো দিতে পারে। তাই ওয়াট দেখে নয়, লাক্স হিসাব করে ডিজাইন করতে হবে।

### Watt, Lumen এবং Lux-এর তুলনামূলক পার্থক্য

| বিষয় | কী বোঝায়? | পরিমাপের একক | উদাহরণ |
| :--- | :--- | :--- | :--- |
| **Watt** | লাইটটি চালাতে কতটুকু বিদ্যুৎ শক্তি বা কারেন্ট খরচ হচ্ছে | Watt (W) | 20W LED Panel |
| **Lumen** | লাইট বাল্বটি সবদিকে মোট কতটুকু আলো ছড়াচ্ছে | Lumen (lm) | 3600 lm output |
| **Lux** | সেই আলো কাজের নির্দিষ্ট তলে বা টেবিলে কতটুকু এসে পড়ছে | Lux (lx) | 300 lx on table |

## BNBC কেন Lux ব্যবহার করে?

একটি গার্মেন্টস বা Factory-এর কথা চিন্তা করুন। যদি Sewing Machine Operator ঠিকমতো কাপড়ের সুতা দেখতে না পারে, তাহলে—
- ভুল সেলাই বা Stitch হবে (Productivity হ্রাস পাবে)।
- সুই আঙুলে ঢুকে Needle Accident হতে পারে (নিরাপত্তা বিঘ্নিত হবে)।
- কর্মীদের চোখের ও মাথার উপর অতিরিক্ত চাপ পড়বে।

আবার, Hospital-এর Operation Theatre-এ যদি আলো পর্যাপ্ত না থাকে, তবে সেটি সরাসরি মানুষের জীবন-মৃত্যুর প্রশ্ন। এ কারণেই BNBC (Bangladesh National Building Code) কখনো কোনো রুমের জন্য "কত ওয়াট লাইট" লাগবে তা বলে না। বরং আইনগতভাবে বলে দেয়—**রুমের ধরন অনুযায়ী কাজের তলে কত Lux নিশ্চিত করতে হবে**।

## BNBC-এর 150 Lux Golden Rule

BNBC-এর একটি অত্যন্ত গুরুত্বপূর্ণ বেসিক নির্দেশিকা বা রুল হলো—
**যে কোনো Work Area বা নিয়মিত কাজ করার জায়গায় কমপক্ষে 150 Lux আলো থাকতে হবে।**

কাজের জায়গা বা Work Area বলতে নিচে উল্লিখিত স্থানসমূহকে বোঝায়:
- [ ] Office Desk (অফিস কাজের টেবিল)
- [ ] Kitchen Working Area (রান্নাঘর কাটিং/কুকিং এরিয়া)
- [ ] Engineering Workshop & Labs (ল্যাবরেটরি ও রিডিং রুম)
- [ ] Factory Production Floor (গার্মেন্টস বা যেকোনো প্রোডাকশন কারখানা)
- [ ] Reading Desk (পড়ার টেবিল)

যদি কোনো নিয়মিত কর্মক্ষেত্রে বা কাজের জায়গায় ১৫০ লাক্সের কম আলো থাকে, তবে সেটি নিরাপদ ও স্বাস্থ্যকর Working Environment হিসেবে আইনত গ্রহণযোগ্য নয়।

## BNBC অনুযায়ী কোথায় কত Lux লাগবে? (Illumination Tables)

বাস্তবে Bedroom আর Operation Theatre-এর আলোর প্রয়োজন কখনো এক নয়। নিচে BNBC 2020 (Part 8, Chapter 1) এর বিভিন্ন টেবিল থেকে গুরুত্বপূর্ণ কাজের ক্ষেত্রসমূহের Lux সংকলন দেওয়া হলো:

| ভবনের ধরন | নির্দিষ্ট এলাকা (Specific Area) | প্রয়োজনীয় আলো (BNBC Recommended Lux) | টেবিল রেফারেন্স (BNBC Table) |
| :--- | :--- | :--- | :--- |
| **Residential (আবাসিক)** | Bedroom (শোবার ঘর) | 70 Lux | Table 8.1.5 |
| **Residential (আবাসিক)** | Corridor (বারান্দা/হাঁটার পথ) | 70 Lux | Table 8.1.5 |
| **Residential (আবাসিক)** | Stairs (সিঁড়িঘর) | 100 Lux | Table 8.1.5 |
| **Residential (আবাসিক)** | Kitchen (রান্নাঘর) | 250 Lux | Table 8.1.5 |
| **Educational (শিক্ষা প্রতিষ্ঠান)** | Standard Classroom | 300 Lux | Table 8.1.6 |
| **Educational (শিক্ষা প্রতিষ্ঠান)** | Lecture Theatre | 300 Lux | Table 8.1.6 |
| **Healthcare (হাসপাতাল)** | General Ward (সাধারণ ওয়ার্ড) | 100 Lux | Table 8.1.7 |
| **Healthcare (হাসপাতাল)** | Examination Room (পরীক্ষা কক্ষ) | 300 Lux | Table 8.1.7 |
| **Healthcare (হাসপাতাল)** | Operation Theatre (ওটি টেবিল) | 10000 Lux | Table 8.1.7 |
| **Commercial (অফিস/বাণিজ্যিক)** | General Office Desk | 300 Lux | Table 8.1.9 |
| **Commercial (অফিস/বাণিজ্যিক)** | Conference Room (মিটিং রুম) | 300 Lux | Table 8.1.9 |
| **Commercial (অফিস/বাণিজ্যিক)** | Drawing Board (নকশা টেবিল) | 450 Lux | Table 8.1.9 |
| **Industrial (কারখানা/ইন্ডাস্ট্রি)** | General Assembly Line | 300 Lux | Table 8.1.10 |
| **Industrial (কারখানা/ইন্ডাস্ট্রি)** | Fine Precision Work (সূক্ষ্ম কাজ) | 1500 Lux | Table 8.1.10 |

## যদি BNBC অনুযায়ী Lux না মেনে ডিজাইন করেন?

ধরুন, একটি অফিসের জন্য ৩০০ লাক্স দরকার। কিন্তু আপনি নামমাত্র কয়েকটি লাইট দিয়ে ডিজাইন করলেন মাত্র **১২০ লাক্স**। এর ফলে কী সমস্যা হবে?
- কম্পিউটার স্ক্রিন ঝাপসা লাগবে ও মাথা ঘুরবে।
- কর্মীদের কাজের গতি বা প্রোডাক্টিভিটি মারাত্মকভাবে কমে যাবে।
- গ্রাহক বা ক্লায়েন্ট অসন্তুষ্ট হয়ে কমপ্লেইন করবে।

আবার অতিরিক্ত ভেবে যদি সেই একই রুমে **৭০০ লাক্স** লাইটিং করে দেন, তাহলে:
- ক্লায়েন্টের বিদ্যুৎ বিল দ্বিগুণ আসবে।
- অতিরিক্ত লাইট কেনার জন্য ইনিশিয়াল কস্টিং বা বাজেট অনেক বেড়ে যাবে।
- তীব্র আলোর গ্লেয়ারে চোখ ব্যথা করবে।

## একজন Professional Engineer-এর প্রথম ৪টি কাজ

আমি যখনই কোনো লাইটিং ডিজাইনের প্রজেক্ট হাতে পাই, তখন সরাসরি কোনো লাইট না কিনে প্রথমে এই ৪টি প্রশ্ন নিজে সমাধান করি:
- [ ] এই Room-টির আসল ব্যবহার বা ফাংশন কী? (যেমন: এটি কি অফিস নাকি সিঁড়ি?)
- [ ] BNBC 2020 অনুযায়ী এই কাজের জন্য নির্দিষ্ট কত Lux প্রয়োজন?
- [ ] রুমটির মোট ক্ষেত্রফল (Area in m²) কত?
- [ ] প্রয়োজনীয় লুমেন কত? এরপর Lumen Method বা Dialux ব্যবহার করে মোট কয়টি লাইট লাগবে তা হিসাব করা।

## Chapter Summary & Takeaways

- **Lux** হলো কাজের তলে এসে পড়া কার্যকরী আলোর ঘনত্ব।
- **Lux এবং Watt সম্পূর্ণ ভিন্ন বিষয়**; ওয়াট কেবল বিদ্যুৎ খরচ নির্দেশ করে।
- **BNBC Lighting Design** করার একমাত্র ভিত্তি হলো লাক্স লেভেল নিশ্চিত করা।
- কর্মক্ষেত্রের যেকোনো ওয়ার্কিং টেবিলে কমপক্ষে **১৫০ লাক্স** লাইট বাধ্যতামূলক (Golden Rule)।
- ভিন্ন ভিন্ন রুমের প্রয়োজনের উপর ভিত্তি করে লাক্স নির্ধারণ করা হয়েছে (Tables 8.1.5 - 8.1.10)।
- আগে লাক্স নিশ্চিত করুন, তারপর ওয়াট বা ফিক্সচার নির্বাচন করুন।

---

### লেখকের নোট (Author's Operational Note)

আমি যখন কেরিয়ারের শুরুতে প্রথম লাইটিং ডিজাইন শিখছিলাম, তখন আমিও সাধারণ মানুষের মতো ওয়াট নিয়েই চিন্তা করতাম—"এখানে কি ২০ ওয়াট দেবো নাকি ৪০ ওয়াট?" কিন্তু BNBC গভীরভাবে পড়ার পর বুঝতে পারলাম, একজন প্রফেশনাল ইঞ্জিনিয়ার কখনোই ওয়াট দিয়ে কাজ শুরু করেন না। কাজের প্রথম এবং প্রধান ভিত্তিই হলো Lux। এই লাক্স বুঝতে পারলে লুমেন মেথড এবং ফিক্সচার সিলেকশন আপনার জন্য পানির মতো সহজ হয়ে যাবে!`,
    tags: ['BNBC 2020', 'Lighting Design', 'Lux Levels', 'Lumen Method'],
    imageUrl: 'https://images.unsplash.com/photo-1565538810844-1e1194116c67?auto=format&fit=crop&q=80&w=1200',
    published: true
  },
  {
    slug: 'bnbc-2020-lighting-design-guide-ch3',
    title: 'BNBC 2020 Lighting Design Guide (বাংলায়) — Chapter 3: Lumen Method – কতগুলো Light লাগবে? Step-by-Step Calculation শিখুন (BNBC 2020)',
    category: 'লাইটিং ডিজাইন ও ইমার্জেন্সি ব্যাকআপ',
    date: '2026-07-22',
    readTime: '10 min read',
    summary: 'BNBC 2020 অনুযায়ী একটি রুমে নির্দিষ্ট Lux পাওয়ার জন্য কতগুলো LED Light Fixture লাগবে তা Lumen Method দিয়ে Step-by-Step গাণিতিক উপায়ে বের করতে শিখুন।',
    content: `### BNBC Reference: Part VIII, Chapter 1 (Lighting Design Method) — Lumen Method Design Approach

## Introduction

এখন পর্যন্ত আমরা দুটি গুরুত্বপূর্ণ বিষয় শিখেছি।
প্রথমে জেনেছি **Lighting Design কী** এবং কেন এটি Electrical Engineering-এর একটি গুরুত্বপূর্ণ অংশ।
এরপর শিখেছি **Lux কী** এবং BNBC 2020 অনুযায়ী কোন Room-এ কত Lux প্রয়োজন।

কিন্তু এখন সবচেয়ে বড় প্রকৌশলগত প্রশ্ন হলো—
> **"যদি আমি জানি একটি Office-এ 300 Lux লাগবে, তাহলে কতগুলো LED Panel লাইট লাগাব?"**

এটাই Lighting Design-এর সবচেয়ে গুরুত্বপূর্ণ Calculation। এবং এই কাজের জন্য পৃথিবীর প্রায় সব Electrical & Lighting Engineer যে গাণিতিক পদ্ধতিটি ব্যবহার করেন, সেটির নাম হলো **Lumen Method**।

---

## Lumen Method কী?

সহজ ভাষায়, **Lumen Method হলো এমন একটি Calculation Method, যার মাধ্যমে কোনো Room-এ নির্দিষ্ট Lux পাওয়ার জন্য মোট কতগুলো Light Fixture লাগবে তা গাণিতিকভাবে নির্ণয় করা হয়।**

Lighting Design-এর প্রায় সব Manual Calculation এবং প্রাথমিক লেআউট ডিজাইন এই Method দিয়েই শুরু হয়।

### কেন আন্দাজে লাইটিং ডিজাইন করা নিষিদ্ধ?

ধরুন, আপনি ১,৫০০ Square Feet-এর একটি Corporate Office-এর Lighting Design করছেন। আপনি কি আন্দাজে বলবেন— *"এখানে ২০টা লাইট লাগিয়ে দিন, হয়ে যাবে"*?

**অবশ্যই না!** 
কারণ Electrical & Illumination Engineering কখনো আন্দাজের ওপর চলে না। 
- বেশি লাইট লাগালে অতিরিক্ত বিদ্যুৎ বিল ও অপ্রয়োজনীয় বাজেটিং হবে।
- কম লাইট লাগালে চোখের ক্ষতি হবে এবং BNBC 2020 স্ট্যান্ডার্ড অমান্য হবে।
- প্রতিটি Fixture-এর সঠিক সংখ্যা ও স্পেসিং গাণিতিক সূত্র দিয়ে হিসাব করে বের করতে হয়।

---

## Lumen (lm) কী?

Chapter 2-এ আমরা **Lux (lx)** সম্পর্কে বিস্তারিত জেনেছি। এখন **Lumen (lm)** ভালোভাবে বুঝতে হবে।

> **Lumen (lm) হলো একটি Light Source বা বাল্ব থেকে প্রতি সেকেন্ডে চারদিকে মোট কতটুকু আলো উৎপন্ন হচ্ছে তার পরিমাপ (Luminous Flux)।**

ধরুন, একটি LED Panel-এর প্যাকেজিংয়ে লেখা আছে— **3600 Lumens**। 
এর মানে হলো, এই LED Panel-টি চালিত হলে মোট ৩,৬০০ লুমেন পরিমাণ আলো ছড়ায়।

### Lux এবং Lumen-এর মধ্যকার সুনির্দিষ্ট পার্থক্য

| বিষয় | Lumen (lm) | Lux (lx) |
| :--- | :--- | :--- |
| **সংজ্ঞা** | লাইট সোর্স থেকে উৎপন্ন **মোট আলোর পরিমাণ** | কাজের তলে এসে পড়া **আলোর তীব্রতা** |
| **স্থান নির্ভরশীলতা** | রুমের সাইজ যাই হোক, লাইটের Lumen অপরিবর্তিত থাকে | রুমের সাইজ বড় হলে Lux কমে যায় |
| **রূপক তুলনা** | ট্যাংকে রাখা পানির মোট পরিমাণ | মাটিতে ভিজা পানির ঘনত্ব |

### 💡 পানির ট্যাংক ও বাগানের রূপক উদাহরণ

ধরুন আপনার পানির ট্যাংকে **১,০০০ লিটার পানি** আছে। এটি হলো **Lumen** (উৎপন্ন মোট আলো)।
এখন সেই ১,০০০ লিটার পানি যদি একটি ছোট বাগানে ছিটান, বাগান অনেক বেশি ভিজে যাবে (High Lux)।
কিন্তু একই ১,০০০ লিটার পানি যদি বিশাল ১ একরের মাঠে ছিটান, মাঠ কিন্তু খুব একটা ভিজবে না (Low Lux)।

> - **Lumen = মোট উৎপন্ন আলো**
> - **Lux = নির্দিষ্ট কাজের তলে পৌঁছানো আলো**

---

## Lumen Method Formula (মূল গাণিতিক সমীকরণ)

Lighting Design-এর বিশ্বজুড়ে স্বীকৃত সবচেয়ে পরিচিত ও মানসম্মত Formula হলো:

$$N = \\frac{E \\times A}{F \\times UF \\times MF}$$

এখানে প্রতিটি প্রতীকের পূর্ণরূপ ও অর্থ:

- **N** = Required Number of Light Fixtures (প্রয়োজনীয় মোট লাইট ফিক্সচারের সংখ্যা)
- **E** = Required Illuminance in Lux (BNBC 2020 নির্দেশিত প্রয়োজনীয় লাক্স)
- **A** = Room Area in $m^2$ (রুমের দৈর্ঘ্য × প্রস্থ)
- **F** = Lumen Output of One Fixture (একটি লাইট ফিক্সচারের মোট লুমেন)
- **UF** = Utilization Factor (ইউটিলাইজেশন ফ্যাক্টর - ০.৬০ থেকে ০.৮০)
- **MF** = Maintenance Factor (মেইনটেন্যান্স ফ্যাক্টর - সাধারণত ০.৮০)

---

## Formula-এর প্রতিটি অংশের বিশদ ব্যাখ্যা

### ১. E = Required Lux (প্রয়োজনীয় লাক্স)
এটি আপনাকে সরাসরি **BNBC 2020 (Part 8, Table 8.1.5 - 8.1.10)** থেকে গ্রহণ করতে হবে।
- **Standard Office Area**: 300 Lux
- **Classroom / Reading Room**: 300 Lux
- **Kitchen Working Area**: 250 Lux
- **Drawing Office / Fine Draft**: 450 Lux

### ২. A = Room Area ($m^2$)
রুমটির মেঝের দৈর্ঘ্য এবং প্রস্থের গুণফল (মিটারে)।
> উদাহরণ: দৈর্ঘ্য ১০ মিটার এবং প্রস্থ ৮ মিটার হলে, $\\text{Area} = 10 \\times 8 = 80 \\text{ m}^2$।

### ৩. F = Fixture Lumen (ফিক্সচারের লুমেন)
এটি লাইট প্রস্তুতকারক কোম্পানির (Catalogue/Datasheet) থেকে পাওয়া যায়।
> উদাহরণ: একটি ৪০ ওয়াট স্ট্যান্ডার্ড LED Panel প্রায় **3,600 Lumens** আলো দেয়।

### ৪. UF = Utilization Factor (ইউটিলাইজেশন ফ্যাক্টর)
লাইটের সব আলো কিন্তু সরাসরি মেঝে বা কাজের টেবিলে পড়ে না। কিছু আলো সিলিংয়ে, কিছু দেয়ালে প্রতিফলিত হয়ে নষ্ট হয়, আর কিছু লাইটের ভেতরের ডিফিউজারেই আটকে যায়।
> **UF নির্দেশ করে লাইটের মোট আলোর কত শতাংশ আসলে কার্যকর Working Plane-এ এসে পৌঁছায়।**
> সাধারণ অফিসের ক্ষেত্রে UF এর মান সাধারণত **0.60 থেকে 0.80** এর মধ্যে ধরা হয় (যা Room Index ও Reflection Factor-এর ওপর নির্ভর করে)।

### ৫. MF = Maintenance Factor (মেইনটেন্যান্স ফ্যাক্টর)
নতুন ইনস্টল করা লাইটের আলো আর ৫ বছর ব্যবহার করা লাইটের আলো কখনোই এক থাকে না।
সময়ের সাথে সাথে:
1. লাইট বা ডিফিউজারের ওপর ধুলাবালি (Dust Layer) জমে।
2. LED চিপর কার্যক্ষমতা সময়ের সাথে কিছুটা হ্রাস পায় (Lumen Depreciation)।
3. দেয়াল ও সিলিংয়ের রঙ মলিন হয়ে রিফ্লেকশন কমে যায়।

> এই আলোর অপচয় বিবেচনা করে ডিজাইনে **Maintenance Factor (MF)** ধরা হয়। ইনডোর পরিষ্কার অফিসের জন্য স্ট্যান্ডার্ড ডিজাইনে **MF = 0.80** ব্যবহার করা হয়।

---

## 📐 চলুন একটি বাস্তব ইঞ্জিনিয়ারিং Calculation করি!

### প্রজেক্ট সিনারিও:
আপনাকে একটি Corporate Office Room-এর জন্য লাইটিং ডিজাইন করতে বলা হলো।

#### প্রদত্ত উপাত্তসমূহ (Given Data):
- **Room Dimension**: ১০ মিটার (দৈর্ঘ্য) × ৮ মিটার (প্রস্থ)
- **Room Area (A)**: $10 \\times 8 = 80 \\text{ m}^2$
- **Target Lux (E)**: 300 Lux (BNBC 2020 Standard)
- **Selected Light**: 40W LED Panel ($F = 3600 \\text{ Lumens}$)
- **Utilization Factor (UF)**: 0.60
- **Maintenance Factor (MF)**: 0.80

---

### Step-by-Step Calculation:

#### ধাপ ১: লব (Numerator) অংশ বের করি (মোট প্রয়োজনীয় লুমেন)
$$\\text{Total Required Lumens} = E \\times A = 300 \\text{ Lux} \\times 80 \\text{ m}^2 = 24,000 \\text{ Lumens}$$

#### ধাপ ২: হর (Denominator) অংশ বের করি (একটি ফিক্সচারের কার্যকর লুমেন)
$$\\text{Effective Lumen per Fixture} = F \\times UF \\times MF = 3600 \\times 0.60 \\times 0.80 = 1,728 \\text{ Lumens}$$

#### ধাপ ৩: প্রয়োজনীয় ফিক্সচার সংখ্যা (N) হিসাব করি
$$N = \\frac{24,000}{1,728} = 13.88 \\text{ টি}$$

---

### ⚠️ অত্যন্ত গুরুত্বপূর্ণ নিয়মানুযায়ী Rounding Up:

গাণিতিক ফলাফলে এসেছে **13.88 টি** লাইট।
আপনি বাজারে কখনোই ১৩.৮৮ টি লাইট কিনতে পারবেন না!

> **BNBC Golden Rule:**
> লাইটিং ডিজাইনে ফিক্সচারের সংখ্যা কখনোই নিচের পূর্ণ সংখ্যায় (Round Down) নামানো যাবে না। **সবসময় পরবর্তী পূর্ণ সংখ্যায় (Round Up) নিতে হবে।**

সুতরাং, **Required Light Fixtures = 14 টি** (১৪টি ৪০ ওয়াটের এলইডি প্যানেল লাগবে)।

---

## 💡 যদি একটি Fixture-এ একাধিক Tube/Lamp থাকে?

অনেক সময় ইন্ডাস্ট্রিতে এমন ফিক্সচার ব্যবহার করা হয় যেখানে ১টি ফিক্সচারের ভেতরে ২টি বা ৩টি টিউবলাইট বা এলইডি মডিউল থাকে।

ধরা যাক, আপনার গণনায় এসেছে মোট **১৬টি ল্যাম্প (Lamp)** লাগবে।
যদি আপনার নির্বাচিত ফিক্সচারে **প্রতিটিতে ২টি করে ল্যাম্প** থাকে, তবে:

$$\\text{Required Fixtures} = \\frac{16}{2} = 8 \\text{ টি ফিক্সচার}$$

---

## 🚫 নতুন ইঞ্জিনিয়ারদের ৫টি সাধারণ ও মারাত্মক ভুল!

সাইট এবং ডিজাইনিংয়ে নতুন ইঞ্জিনিয়াররা যে ভুলগুলো বারবার করেন:

1. ❌ **Watt দেখে লাইট নির্বাচন করা**: লুমেন না দেখে ওয়াট দিয়ে হিসাব করা সম্পূর্ণ ভুল।
2. ❌ **UF এবং MF বাদ দেওয়া**: Utilization Factor ও Maintenance Factor না ধরলে বাস্তবে রুমে তীব্র আলোর ঘাটতি হবে।
3. ❌ **Fixture সংখ্যা Round Down করা**: ১৩.৮৮ কে ১৩টি ধরে ফেললে প্রয়োজনীয় Lux অর্জিত হবে না।
4. ❌ **রুমের ভুল Area হিসাব করা**: বারান্দা বা পিলারের অতিরিক্ত স্থান ঠিকমতো মাইনাস না করা।
5. ❌ **Datasheet না দেখা**: আন্দাজে একটি লাইটের লুমেন ধরে নেওয়া।

---

## 🖥️ Lighting Design কি শুধুই এই Formula?

**না!** এটি নতুন ইঞ্জিনিয়ারদের একটি বড় ভুল ধারণা। Formula দিয়ে ফিক্সচারের সংখ্যা বের হওয়া মানে লাইটিং ডিজাইনের কেবল ২০% সম্পন্ন হলো। এরপরও অনেক গুরুত্বপূর্ণ কাজ বাকি থাকে:

- **Fixture Layout & Grid Positioning**: লাইটগুলোর পারস্পরিক দূরত্ব (Spacing) সমান রাখা।
- **Spacing-to-Height Ratio (SHR)**: ফিক্সচারের উচ্চতা অনুযায়ী দূরত্ব ঠিক রাখা যাতে আলো ওভারল্যাপ হয়।
- **Uniformity Factor**: পুরো রুমে যেন আলো সমানভাবে ছড়ায়, কোনো কোণে কালো অন্ধকার না থাকে।
- **Glare Control (UGR)**: মনিটরের গ্লেয়ার কমানো।
- **DIALux evo Software Verification**: ৩ডি সিমুলেশনের মাধ্যমে ভিজ্যুয়াল আলো পরীক্ষা করা।

> **Lumen Method আপনাকে সঠিক প্রাথমিক দিকনির্দেশনা (Starting Point) দেয়, যা পরবর্তীতে DIALux evo সফটওয়্যারের মাধ্যমে চূড়ান্ত যাচাই করা হয়।**

---

## Chapter Summary & Quick Checklist

- **Lumen Method** হলো নির্দিষ্ট Lux পাওয়ার জন্য প্রয়োজনীয় লাইটের সংখ্যা বের করার প্রধান ম্যানুয়াল সূত্র।
- **Formula:** $N = \\frac{E \\times A}{F \\times UF \\times MF}$।
- **Round Up Rule:** ফলাফলে দশমিক আসলে সবসময় পরবর্তী পূর্ণ সংখ্যায় রাউন্ড আপ করতে হবে।
- **UF & MF Factor:** আলোর ক্ষয় ও ময়লার কারণে ইউটিলাইজেশন ও মেইনটেন্যান্স ফ্যাক্টর ধরা বাধ্যতামূলক।
- **Next Step:** ফিক্সচার সংখ্যা জানার পর সেটির স্পেসিং ও লেআউট ডিজাইন করতে হয়।

---

### 📝 লেখকের নোট (Author's Operational Note)
আমি যখন প্রথম কেরিয়ারে Lumen Method নিয়ে কাজ করি, তখন UF আর MF এর হিসাব দেখে কিছুটা কনফিউজড হয়ে যেতাম। কিন্তু পরবর্তীতে প্র্যাক্টিক্যাল প্রজেক্ট করার পর বুঝলাম—এগুলো আসলে আলোর বাস্তব জীবনের অপচয়ের হিসাব! Formula মুখস্থ করার চেয়ে প্রতিটি অক্ষরের বাস্তব প্রকৌশলগত অর্থ বুঝলে লাইটিং ডিজাইন অনেক বেশি আনন্দদায়ক হয়ে ওঠে। আশা করি এই আর্টিকেলের পর Lumen Method নিয়ে আপনাদের সকল দ্বিধা দূর হয়ে যাবে!`,
    tags: ['BNBC 2020', 'Lighting Design', 'Lumen Method', 'Illumination Calculation', 'BNBC Part 8'],
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1200',
    published: true
  }
];

export const DEFAULT_PRODUCTS: import('./types').ProductItem[] = [
  {
    id: 'prod-1',
    name: '11kV HT/LT Substation Thermal Audit & Safety Inspection',
    category: 'Substation & Power Systems',
    unitPrice: 15000,
    unit: 'Service / Visit',
    stockStatus: 'ইন স্টক'
  },
  {
    id: 'prod-2',
    name: 'Earthing System & Soil Resistivity Megger Test (BNBC 2020)',
    category: 'Earthing & Safety Audit',
    unitPrice: 8500,
    unit: 'Point Test',
    stockStatus: 'ইন স্টক'
  },
  {
    id: 'prod-3',
    name: 'Industrial PFI Plant Calibration & Power Factor Testing',
    category: 'PFI & Capacitor Banks',
    unitPrice: 12000,
    unit: 'Panel Audit',
    stockStatus: 'ইন স্টক'
  },
  {
    id: 'prod-4',
    name: 'BNBC Compliant Industrial Factory Lighting & Lux Level Audit',
    category: 'Lighting & Energy Audit',
    unitPrice: 18000,
    unit: 'Floor Design',
    stockStatus: 'ইন স্টক'
  },
  {
    id: 'prod-5',
    name: 'HT/LT Cable Thermal Scanning & Busbar Torquing Inspection',
    category: 'Cable & Busbar Maintenance',
    unitPrice: 10000,
    unit: 'Feeder Audit',
    stockStatus: 'ইন স্টক'
  }
];

export const DEFAULT_CUSTOMERS: import('./types').Customer[] = [
  {
    id: 'cust-1',
    name: 'Gazipur Spinning & Apparels Ltd.',
    contactPerson: 'Engr. Tanvir Ahmed (DGM Electrical)',
    phone: '01711223344',
    whatsapp: '8801711223344',
    email: 'tanvir@gazipurspinning.com',
    address: 'Chowrastha, Gazipur, Dhaka',
    industrySector: 'Textile & RMG',
    substationCapacity: '11kV / 1000 kVA Substation',
    status: 'Active Client',
    notes: '11kV Substation Thermal Audit & PFI Capacitor Bank Maintenance Project',
    totalOrders: 2,
    totalSpent: 45000,
    lastServiceDate: '2026-07-15'
  },
  {
    id: 'cust-2',
    name: 'Uttara Textile & Knitting Mills',
    contactPerson: 'Md. Rafiqul Islam (Plant Engineer)',
    phone: '01819887766',
    whatsapp: '8801819887766',
    email: 'rafiq@uttaratextile.com',
    address: 'Sector 7, Uttara, Dhaka',
    industrySector: 'Textile & RMG',
    substationCapacity: '11kV / 630 kVA Substation',
    status: 'On-Going Contract',
    notes: 'BNBC 2020 Electrical Safety Audit & Earthing Grid Resistance Test',
    totalOrders: 1,
    totalSpent: 28000,
    lastServiceDate: '2026-06-28'
  },
  {
    id: 'cust-3',
    name: 'Savar Fabrics Industries Limited',
    contactPerson: 'Sharif Hossain (Maintenance Head)',
    phone: '01912345678',
    whatsapp: '8801912345678',
    email: 'sharif@savarfabrics.bd',
    address: 'EPZ Road, Savar, Dhaka',
    industrySector: 'Textile & RMG',
    substationCapacity: '33kV / 2500 kVA Substation',
    status: 'Active Client',
    notes: 'Factory Floor Lighting Design & Lux Level Measurement Report per BNBC Standards',
    totalOrders: 3,
    totalSpent: 62000,
    lastServiceDate: '2026-07-20'
  },
  {
    id: 'cust-4',
    name: 'Square Pharmaceuticals Plant 2',
    contactPerson: 'Dr. Engr. Anisur Rahman (AGM Utilities)',
    phone: '01730011223',
    whatsapp: '8801730011223',
    email: 'anisur@squarepharma.com',
    address: 'Salna, Gazipur Industrial Belt, Dhaka',
    industrySector: 'Pharmaceuticals',
    substationCapacity: '11kV Cleanroom Dual Substation',
    status: 'Active Client',
    notes: 'Harmonics Filter & Precision PFI Panel Annual Servicing and Cleanroom Earth Pit Audit',
    totalOrders: 2,
    totalSpent: 85000,
    lastServiceDate: '2026-07-02'
  },
  {
    id: 'cust-5',
    name: 'Chittagong Steel Re-Rolling Mills (CSRM)',
    contactPerson: 'Engr. Kamrul Hasan (AGM Plant Operations)',
    phone: '01844556677',
    whatsapp: '8801844556677',
    email: 'kamrul@csrm-steel.com',
    address: 'Sitakunda Heavy Industrial Area, Chittagong',
    industrySector: 'Steel & Heavy Metal',
    substationCapacity: '33kV / 5000 kVA Induction Furnace Substation',
    status: 'On-Going Contract',
    notes: 'Heavy Arc Suppression, Vacuum Circuit Breaker (VCB) Calibration, and Busbar Torquing',
    totalOrders: 4,
    totalSpent: 140000,
    lastServiceDate: '2026-07-18'
  }
];

export const DEFAULT_ORDERS: import('./types').OrderInvoice[] = [
  {
    id: 'ord-101',
    invoiceNo: 'EE-2026-001',
    customerName: 'Gazipur Spinning & Apparels Ltd.',
    customerPhone: '01711223344',
    customerAddress: 'Chowrastha, Gazipur, Dhaka',
    date: '21 July 2026',
    items: [
      {
        productId: 'prod-1',
        productName: '11kV HT/LT Substation Thermal Audit & Safety Inspection',
        variant: 'General',
        quantity: 1,
        unit: 'Service',
        pricePerUnit: 15000,
        totalPrice: 15000
      }
    ],
    subtotal: 15000,
    discount: 1000,
    grandTotal: 14000,
    paidAmount: 14000,
    dueAmount: 0,
    status: 'সম্পন্ন',
    createdRole: 'Admin',
    notes: 'Thermal imaging scan and insulation test report delivered to client.'
  }
];

export const DEFAULT_OFFICE_NOTES: import('./types').OfficeNote[] = [
  {
    id: 'note-1',
    title: 'Sign Gazipur Site Earthing Resistance Test Report',
    content: 'Deliver signed earthing test certificate with engineering seal to client office by 10 AM tomorrow.',
    date: '21 July 2026',
    priority: 'জরুরি',
    isCompleted: false,
    author: 'Engr. Sahin Alom'
  },
  {
    id: 'note-2',
    title: 'Review BNBC 2020 Electrical Safety Guidelines Chapter 2',
    content: 'Verified technical formulas and tables in the newly published article before sharing with factory maintenance managers.',
    date: '20 July 2026',
    priority: 'সাধারণ',
    isCompleted: true,
    author: 'Engr. Sahin Alom'
  }
];

export const DEFAULT_MAINTENANCE_LOGS: import('./types').MaintenanceLog[] = [
  {
    id: 'maint-101',
    equipmentName: '630 kVA HT/LT Power Transformer',
    equipmentIdTag: 'TR-01-S1',
    location: 'Substation Yard - Gazipur Plant',
    category: 'Transformer',
    status: 'Critical / Overdue',
    lastServiceDate: '2026-01-10',
    nextInspectionDueDate: '2026-07-10',
    technicianInCharge: 'Engr. Sahin Alom',
    priority: 'Emergency',
    notes: 'Oil dielectric breakdown voltage (BDV) test and silica gel breather replacement required.'
  },
  {
    id: 'maint-102',
    equipmentName: '11kV Vacuum Circuit Breaker (VCB Panel)',
    equipmentIdTag: 'VCB-02-MAIN',
    location: 'HT Switchgear Room - Narayanganj Textile',
    category: 'Switchgear',
    status: 'Requires Attention',
    lastServiceDate: '2026-02-15',
    nextInspectionDueDate: '2026-07-25',
    technicianInCharge: 'Md. Rafiqul Islam (Tech Lead)',
    priority: 'High',
    notes: 'Contact resistance test & trip mechanism lubrication scheduled.'
  },
  {
    id: 'maint-103',
    equipmentName: '450 KVAR Automatic PFI Capacitor Bank',
    equipmentIdTag: 'PFI-01-BLD2',
    location: 'Main Distribution Room - Savar Garments',
    category: 'PFI Plant',
    status: 'Optimal',
    lastServiceDate: '2026-05-10',
    nextInspectionDueDate: '2026-11-10',
    technicianInCharge: 'Engr. Sahin Alom',
    priority: 'Routine',
    notes: 'Power factor holding steady at 0.98. All capacitor stages tested OK.'
  },
  {
    id: 'maint-104',
    equipmentName: '1250 kVA Prime Diesel Generator Unit 1',
    equipmentIdTag: 'GEN-01-PWR',
    location: 'Power House - Chittagong Steel Ltd',
    category: 'Generator',
    status: 'In Maintenance',
    lastServiceDate: '2026-07-01',
    nextInspectionDueDate: '2026-08-01',
    technicianInCharge: 'Sharif Ahmed (Staff)',
    priority: 'High',
    notes: 'Replacing AVR voltage regulator board and fuel filters during scheduled shutdown.'
  },
  {
    id: 'maint-105',
    equipmentName: 'Substation Earthing Grid & Neutral Earth Pit',
    equipmentIdTag: 'EARTH-GRID-01',
    location: 'Outdoor Switchyard - Manikganj',
    category: 'Earthing Grid',
    status: 'Optimal',
    lastServiceDate: '2026-04-20',
    nextInspectionDueDate: '2026-10-20',
    technicianInCharge: 'Engr. Sahin Alom',
    priority: 'Routine',
    notes: 'Earthing resistance measured at 0.72 Ω (BNBC standard compliant).'
  }
];

export const DEFAULT_QUICK_FIELD_NOTES: QuickFieldNote[] = [
  {
    id: 'qfn-101',
    title: '11kV Substation VCB Contact Resistance & Vacuum Bottle Check',
    content: 'আজকে সাভার স্পিনিং মিলের ১১ কেভি সাবস্টেশন পরিদর্শন করার সময় VCB প্যানেলের মেগার টেস্ট এবং ভ্যাকুয়াম বোতল ইন্টিগ্রিটি চেক করা হয়েছে। ভ্যাকুয়াম বোতলে কনট্যাক্ট রেজিস্ট্যান্স পাওয়া গেছে ১৮ মাইক্রো-ওহম যা নির্দিষ্ট সীমার মধ্যে রয়েছে। তবে কন্ট্রোল ক্যাবল ট্যার্মিনালে কিছুটা ধুলাবালি জমা ছিল যা পরিষ্কার করে টাইট দেওয়া হয়েছে।',
    transcriptRaw: 'আজকে সাভার স্পিনিং মিলের ১১ কেভি সাবস্টেশন পরিদর্শন করার সময় VCB প্যানেলের মেগার টেস্ট এবং ভ্যাকুয়াম বোতল ইন্টিগ্রিটি চেক করা হয়েছে। ভ্যাকুয়াম বোতলে কনট্যাক্ট রেজিস্ট্যান্স পাওয়া গেছে ১৮ মাইক্রো-ওহম যা নির্দিষ্ট সীমার মধ্যে রয়েছে। তবে কন্ট্রোল ক্যাবল ট্যার্মিনালে কিছুটা ধুলাবালি জমা ছিল যা পরিষ্কার করে টাইট দেওয়া হয়েছে।',
    category: 'Electrical Substation',
    equipmentTag: 'HT VCB Panel - Savar Unit 2',
    author: 'Engr. Sahin Alom',
    createdAt: '2026-07-20 14:30',
    status: 'Saved',
    language: 'bn-BD'
  },
  {
    id: 'qfn-102',
    title: '630kVA Transformer Oil Dielectric Breakdown Voltage Test',
    content: 'Performed oil dielectric breakdown voltage (BDV) test on the 630 kVA oil-immersed distribution transformer. The measured BDV value was 58 kV across a 2.5mm gap, confirming excellent dielectric strength. Moisture content in silica gel breather was normal (blue indicator).',
    transcriptRaw: 'Performed oil dielectric breakdown voltage test on the 630 kVA oil immersed distribution transformer. Measured BDV value was 58 kV across 2.5 millimeter gap, confirming excellent dielectric strength.',
    category: 'Transformer & Power Maintenance',
    equipmentTag: 'XFRM-01 630kVA',
    author: 'Engr. Sahin Alom',
    createdAt: '2026-07-18 11:15',
    status: 'Saved',
    language: 'en-US'
  }
];





