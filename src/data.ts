import { CaseStudy, TimelineStep, ReadingItem, AdminStats, ProfileData, HomepageContent, AppSettings, BlogPost } from './types';

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
  name: "Sahin Alom",
  title: "Industrial Electrical Engineer",
  location: "Dhaka, Bangladesh",
  email: "sardershain@gmail.com",
  phone: "+880 1712-345678",
  whatsapp: "+880 1712-345678",
  summary: "Results-driven Industrial Electrical Engineer with over 4 years of hands-on expertise in electrical maintenance, load calculation, distribution substation operation, and advanced troubleshooting for large-scale textile and sweater manufacturing operations. Proven capability in maintaining zero unscheduled downtime, ensuring electrical safety compliance per BNBC and IEC standards, and designing automatic protection and transfer systems.",
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
  heroTagline: "Electrical Engineer",
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

export const DEFAULT_APP_SETTINGS: AppSettings = {
  showBottomNav: true,
  defaultTheme: 'dark'
};

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'pfi-plant-maintenance-bangladesh',
    title: 'The Ultimate Guide to PFI (Power Factor Improvement) Plant Maintenance in Bangladesh Factories',
    category: 'Substation Maintenance',
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
    category: 'Electrical Safety',
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
    category: 'Industrial Protection',
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
  }
];




