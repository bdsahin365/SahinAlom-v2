import { CaseStudy, TimelineStep, ReadingItem, AdminStats, ProfileData, HomepageContent } from './types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'substation-sld-analysis',
    title: 'Substation SLD Analysis & Protection Coordination',
    category: 'Substation & Distribution',
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
    duration: '3 Weeks'
  },
  {
    slug: 'industrial-load-distribution',
    title: 'Industrial Load Distribution & Main Feeder Sizing',
    category: 'Power Systems & Cables',
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
    duration: '2 Weeks'
  },
  {
    slug: 'earthing-system-inspection',
    title: 'Earthing System Inspection, Testing & Optimization',
    category: 'Earthing & Safety',
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
    duration: '4 Days'
  },
  {
    slug: 'ips-lighting-troubleshooting',
    title: 'Instant Power Supply (IPS) & Emergency Lighting Optimization',
    category: 'Industrial Troubleshooting',
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
    duration: '1 Week'
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
  name: "Sahin Alom",
  title: "Industrial Electrical Engineer",
  location: "Dhaka, Bangladesh",
  email: "sardershain@gmail.com",
  phone: "+880 1712-345678",
  whatsapp: "+880 1712-345678",
  summary: "Results-driven Industrial Electrical Engineer with over 4 years of hands-on expertise in electrical maintenance, load calculation, distribution substation operation, and advanced troubleshooting for large-scale textile and sweater manufacturing operations. Proven capability in maintaining zero unscheduled downtime, ensuring electrical safety compliance per BNBC and IEC standards, and designing automatic protection and transfer systems.",
  skills: "Substation Maintenance (11kV/0.4kV), SLD Interpretation, Protection Selectivity (ACB/MCCB/VCB), Power Factor Improvement (PFI), Cable & Breaker Sizing, Earth Resistance Testing, Generator Load Matching, Industrial Automation, LOTO Safety Protocols, BNBC & IEC Compliance",
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
      institution: "Dhaka University of Engineering & Technology (DUET)",
      passingYear: "2020",
      result: "CGPA: 3.65/4.00"
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
  heroTagline: "Electrical Engineer — Dhaka, Bangladesh",
  heroHeading: "I keep factories running.",
  heroSubheading: "Electrical maintenance, load distribution, and power system troubleshooting for industrial facilities. Currently maintaining a sweater factory in Dhaka — keeping production lines live, motors humming, and safety standards met.",
  heroStat1Val: "4+ Years",
  heroStat1Label: "Field Exp",
  heroStat2Val: "24/7",
  heroStat2Label: "Operations",
  heroStat3Val: "100%",
  heroStat3Label: "Uptime Focus",
  heroProfileName: "Sahin Alom",
  heroProfileTitle: "Sahin Alom — Senior EE",
  heroProfileImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  heroProfileVideo: "",
  journalTagline: "01 — Operations Journal",
  journalHeading: "The daily check",
  journalDesc: "Every morning starts the same way. I walk the floor before the machines start, reading the boards, logging the numbers, listening for what sounds wrong. This is how you catch problems before they become downtime.",
  expertiseTagline: "03 — Scope of Expertise",
  expertiseHeading: "What I can do for you",
  expertiseDesc: "Organized by who you are and what you need. Not a skills list — a capabilities statement.",
  contactTagline: "04 — Transmission Node",
  contactHeading: "Let's collaborate",
  contactDesc: "Open to project collaborations, technical discussions, and international opportunities in the electrical and power systems space. Let me know what you are looking to build or solve.",
  contactEmail: "sardershain@gmail.com",
  contactLinkedin: "https://linkedin.com",
  contactGithub: "https://github.com",
  headerLogoIcon: "Cpu"
};


