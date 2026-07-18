# Sahin Alom — Industrial Electrical Engineer Portfolio

A complete, production-ready full-stack-inspired personal portfolio website for **Sahin Alom**, an electrical engineer currently maintaining a sweater factory in Dhaka, Bangladesh. The site has been meticulously designed around an industrial **"control room"** aesthetic — delivering a balanced blend of hands-on field credibility, technical depth, and modern responsive visual hierarchy.

## 🛠️ Design & Theme Philosophy
- **Control Room Aesthetic**: Designed to feel like walking into a well-organized factory control board. Surfaces feature clean `1px` structural grids, minimal flat shadows, and crisp layout frames.
- **Dark-First Palette**: Includes a clean dark-first zinc-slate workspace by default with a fully functional live **Light Mode toggle** in the navigation header.
- **Copper/Amber Accents**: Highlights active nodes, telemetry statuses, and CTAs in a striking warm busbar-copper color (`#f59e0b`).
- **Data-Driven Typography**: Integrates a pairing of **Space Grotesk** for display-ready headers, **Inter** for clean readable copy, and **JetBrains Mono** for raw sensor data and engineering math.

---

## ⚡ Key Content Sections

### 1. Interactive Control Deck (Hero)
- Highlighting live operational metrics from the Dhaka sweater factory floor.
- Features a **"Currently on duty"** flashing status beacon.
- Displays key stats: `4+ Years Field Exp`, `24/7 Operations Support`, and `100% Uptime Focus`.

### 2. The Daily Journal (About)
- Highlights the rigorous morning routine of a maintenance engineer.
- **This Morning's Readings Widget**: Integrates a live interactive telemetry dashboard showing voltages, grid frequencies, earth resistances, and thermal metrics.
- **Interlocking Trip Simulator**: Try clicking the **"Run Line 3 Fault & Trip Simulation"** button to watch how the automatic protection system detects an over-temperature warning and safely trips downstream sub-distribution boards (SDB) without cascading to the primary Air Circuit Breakers (ACB).

### 3. Case Studies (Problem → Solve)
Details four high-fidelity engineering field reports with step-by-step calculations, formula models, and verifiable outcomes:
1. **Substation SLD Analysis & Selectivity** — Adjusting ACB short-circuit time delay (`t_sd`) to coordinate trip selectivity.
2. **Industrial Load & Main Feeder Cable Sizing** — Applying IEC temperature and grouping derating coefficients to correct thermal overloaded feeders.
3. **Earthing Electrode Optimization** — Troubleshooting touch voltages and designing parallel chemical electrodes to lower resistance below 1.0 Ω.
4. **IPS Inverter Emergency Lighting System** — Tracing ATS contact oxidation and designing a battery charging snubbing circuit.

### 4. Audience Capabilities
Three targeted value-statements curated for:
- **Factory Owners** (Prevention of downtime)
- **Engineers** (Troubleshooting methods & SLDs)
- **Recruiters** (Compliant standards & relocation readiness)

### 5. Transmission Node (Contact Form)
- Real-time client-side form validation.
- Submitting messages safely writes to `localStorage`, populating the live inbox on the Admin console.

---

## 🔐 Authorized Admin Console (`#/admin`)
A secure administrative control board mimicking a substation PLC.
- **Protection Passcode**: Log in using either **`voltage50`** or **`admin`** to unlock the console.
- **Live Inquiries Queue**: View, delete, or respond to messages sent via the contact form. (Pre-seeded with realistic textile-industry inquiries).
- **Control Boards**: Manage site parameters, review visitor statistics, and access quick configuration shortcuts.

---

## 🛠️ Project Structure
```text
/src
 ├── App.tsx               # Master router, Scroll tracking & Mobile bottom navigation
 ├── types.ts              # Core TypeScript interfaces for messages, stats, and readings
 ├── data.ts               # Seed data, full calculation models, and timeline details
 ├── index.css             # Font imports, custom Tailwind v4 theme, and blinking animations
 ├── components
      ├── Header.tsx       # Sticky top nav, theme toggle, mobile drawer, print CV sheet
      ├── Hero.tsx         # Professional introduction & live radar silhouette mockup
      ├── DailyCheck.tsx   # Morning logs timeline & interactive fault simulator
      ├── CaseStudies.tsx  # Grid links to engineering calculations
      ├── CaseStudyDetail.tsx # Deep-dive math reports with Copy-to-Clipboard
      ├── Capabilities.tsx # Audience-curated scope & standard compliance badges
      ├── Contact.tsx      # Form validation & persistent message transmission
      └── Admin.tsx        # Password gate, real-time message feed, and quick actions
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The server will boot locally on port `3000` (per AI Studio specifications).

### 3. Build & Compile for Production
```bash
npm run build
```
This produces an optimized, lightweight set of static assets in the `/dist` folder.
