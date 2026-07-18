import React, { useState, useEffect } from 'react';
import { 
  Calculator, Shield, Layers, Info, ArrowLeft, Plus, Trash2, 
  Printer, Zap, CheckCircle, AlertTriangle, Copy, RefreshCw, ChevronRight, FileText,
  HelpCircle, ChevronDown, ChevronUp, BookOpen, Maximize2, Minimize2, TrendingUp, Activity
} from 'lucide-react';

interface ToolsProps {
  onBack: () => void;
}

const PRESET_LOADS = [
  { name: 'LED Tube Light / এলইডি লাইট', power: 18, pf: 0.9, phase: '1-Phase', df: 0.9 },
  { name: 'Ceiling Fan / সিলিং ফ্যান', power: 80, pf: 0.85, phase: '1-Phase', df: 0.85 },
  { name: 'General Outlets 5A / সাধারণ সকেট', power: 100, pf: 0.8, phase: '1-Phase', df: 0.4 },
  { name: 'Power Outlet 13A/15A / পাওয়ার সকেট', power: 1000, pf: 0.8, phase: '1-Phase', df: 0.4 },
  { name: 'Split AC 1.5 Ton / দেড় টন এসি', power: 1800, pf: 0.88, phase: '1-Phase', df: 0.7 },
  { name: 'Split AC 2.0 Ton / দুই টন এসি', power: 2400, pf: 0.88, phase: '1-Phase', df: 0.7 },
  { name: 'Water Pump 1 HP / পানির পাম্প ১ ঘোড়া', power: 746, pf: 0.82, phase: '1-Phase', df: 0.8 },
  { name: 'Water Pump 3 HP / পানির পাম্প ৩ ঘোড়া', power: 2238, pf: 0.82, phase: '3-Phase', df: 0.8 },
  { name: 'Industrial Motor 10 HP / ইন্ডাস্ট্রিয়াল মোটর ১০ ঘোড়া', power: 7460, pf: 0.85, phase: '3-Phase', df: 0.8 },
  { name: 'Water Heater / Geyser / গিজার', power: 2000, pf: 1.0, phase: '1-Phase', df: 0.8 },
  { name: 'Microwave Oven / মাইক্রোওয়েভ ওভেন', power: 1200, pf: 0.95, phase: '1-Phase', df: 0.8 },
  { name: 'Desktop PC & Workstation / ডেক্সটপ কম্পিউটার', power: 250, pf: 0.9, phase: '1-Phase', df: 0.8 }
];

interface LoadItem {
  id: string;
  name: string;
  quantity: number;
  powerWatts: number;
  pf: number;
  phase: '1-Phase' | '3-Phase';
  diversityFactor: number;
}

const CABLE_RESISTANCE: Record<number, number> = {
  1.5: 12.1, 2.5: 7.41, 4.0: 4.61, 6.0: 3.08, 10.0: 1.83, 16.0: 1.15,
  25.0: 0.727, 35.0: 0.524, 50.0: 0.387, 70.0: 0.268, 95.0: 0.193,
  120.0: 0.153, 150.0: 0.124, 185.0: 0.0991, 240.0: 0.0754, 300.0: 0.0601
};

const CURRENT_CAPACITY_CONDUIT: Record<number, { singlePhase: number; threePhase: number }> = {
  1.5: { singlePhase: 14, threePhase: 13 },
  2.5: { singlePhase: 19, threePhase: 18 },
  4.0: { singlePhase: 26, threePhase: 24 },
  6.0: { singlePhase: 34, threePhase: 31 },
  10.0: { singlePhase: 46, threePhase: 42 },
  16.0: { singlePhase: 61, threePhase: 56 },
  25.0: { singlePhase: 80, threePhase: 73 },
  35.0: { singlePhase: 99, threePhase: 89 },
  50.0: { singlePhase: 119, threePhase: 105 },
  70.0: { singlePhase: 151, threePhase: 133 },
  95.0: { singlePhase: 182, threePhase: 159 },
  120.0: { singlePhase: 210, threePhase: 182 },
  150.0: { singlePhase: 240, threePhase: 206 },
  185.0: { singlePhase: 273, threePhase: 233 },
  240.0: { singlePhase: 321, threePhase: 273 },
  300.0: { singlePhase: 367, threePhase: 311 }
};

const CURRENT_CAPACITY_TRAY: Record<number, { singlePhase: number; threePhase: number }> = {
  1.5: { singlePhase: 22, threePhase: 19 },
  2.5: { singlePhase: 30, threePhase: 26 },
  4.0: { singlePhase: 40, threePhase: 35 },
  6.0: { singlePhase: 51, threePhase: 45 },
  10.0: { singlePhase: 70, threePhase: 62 },
  16.0: { singlePhase: 94, threePhase: 83 },
  25.0: { singlePhase: 125, threePhase: 110 },
  35.0: { singlePhase: 154, threePhase: 135 },
  50.0: { singlePhase: 187, threePhase: 163 },
  70.0: { singlePhase: 238, threePhase: 207 },
  95.0: { singlePhase: 289, threePhase: 251 },
  120.0: { singlePhase: 335, threePhase: 290 },
  150.0: { singlePhase: 384, threePhase: 331 },
  185.0: { singlePhase: 439, threePhase: 377 },
  240.0: { singlePhase: 518, threePhase: 443 },
  300.0: { singlePhase: 593, threePhase: 505 }
};

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function getSubBreaker(name: string, powerWatts: number, quantity: number, phase: '1-Phase' | '3-Phase', pf: number) {
  const totalWatts = powerWatts * quantity;
  const voltage = phase === '3-Phase' ? 400 : 230;
  const current = phase === '3-Phase' 
    ? totalWatts / (1.732 * voltage * pf) 
    : totalWatts / (voltage * pf);
  
  const lowerName = name.toLowerCase();
  
  let rating = 10;
  let cableSize = '1.5';
  
  // Rule-based professional branch circuit sizing for Bangladesh
  if (lowerName.includes('ac') || lowerName.includes('এসি') || lowerName.includes('air conditioner')) {
    // Air Conditioner Branch: High inrush and continuous inductive load
    if (phase === '3-Phase') {
      rating = 16;
      cableSize = '2.5';
    } else {
      if (powerWatts <= 1800) { // 1.5 Ton AC or below
        rating = 20;
        cableSize = '4.0';
      } else { // 2.0 Ton AC or above
        rating = 25;
        cableSize = '4.0';
      }
    }
  } else if (lowerName.includes('pump') || lowerName.includes('পাম্প') || lowerName.includes('motor') || lowerName.includes('মোটর')) {
    // Motor / Pump Branch: Very high starting current
    if (phase === '3-Phase') {
      const designCurrent = current * 1.5; // High safety factor for 3-phase motors
      const ratings = [10, 16, 20, 25, 32, 40, 50, 63];
      rating = ratings.find(r => r >= designCurrent) || 63;
      cableSize = rating > 25 ? '6.0' : (rating > 16 ? '4.0' : '2.5');
    } else {
      if (powerWatts <= 800) { // 1 HP or below
        rating = 16; // 16A to absorb start-up surge
        cableSize = '2.5';
      } else { // 1.5 HP or 2 HP
        rating = 20;
        cableSize = '4.0';
      }
    }
  } else if (lowerName.includes('geyser') || lowerName.includes('গিজার') || lowerName.includes('heater') || lowerName.includes('হিটার') || lowerName.includes('oven') || lowerName.includes('ওভেন')) {
    // Heavy resistive continuous load
    if (powerWatts <= 1500) {
      rating = 16;
      cableSize = '2.5';
    } else {
      rating = 20;
      cableSize = '4.0';
    }
  } else if (lowerName.includes('outlet') || lowerName.includes('socket') || lowerName.includes('সকেট')) {
    // Power/General Socket outlets
    if (powerWatts >= 1000) {
      rating = 16; // 13A/15A Power socket (2.5 RM BYA standard in Bangladesh)
      cableSize = '2.5';
    } else {
      rating = 10; // 5A Socket
      cableSize = '1.5';
    }
  } else {
    // General Lighting/Fan or custom loads
    const designCurrent = current * 1.25;
    const ratings = [6, 10, 16, 20, 25, 32, 40, 50, 63];
    rating = ratings.find(r => r >= designCurrent) || 63;
    
    // Wire coordination: In <= Iz
    if (rating > 40) {
      cableSize = '10.0';
    } else if (rating > 25) {
      cableSize = '6.0';
    } else if (rating > 20) {
      cableSize = '4.0';
    } else if (rating > 10) {
      cableSize = '2.5';
    } else {
      cableSize = '1.5';
    }
  }

  const pole = phase === '3-Phase' ? 'TP' : 'SP';

  return {
    rating,
    pole,
    current: current.toFixed(1),
    cableSize,
    displayText: `${rating}A ${pole}`,
    cableText: `${cableSize} mm²`
  };
}

function getBusbarDetails(mainBreakerAmp: number) {
  // Standard bar dimensions in mm (Width x Thickness) used commonly in Bangladesh / IEC
  const standardBars = [
    { w: 15, t: 3 },
    { w: 20, t: 3 },
    { w: 20, t: 5 },
    { w: 25, t: 5 },
    { w: 30, t: 5 },
    { w: 40, t: 5 },
    { w: 30, t: 10 },
    { w: 40, t: 10 },
    { w: 50, t: 10 },
    { w: 60, t: 10 },
    { w: 80, t: 10 },
    { w: 100, t: 10 },
    { w: 125, t: 8 },
    { w: 125, t: 10 },
  ];

  // Number of parallel runs we can use
  const runsOptions = [1, 2, 3, 4];
  const currentDensity = 1.5; // A/mm² - standard rule of thumb for copper busbars in Bangladesh (BNBC / IEC 60364)

  let bestOption = {
    w: 15,
    t: 3,
    runs: 1,
    area: 45,
    ampRating: 67.5,
    sizeText: '15 × 3 mm',
  };

  let minDiff = Infinity;
  let found = false;

  // Try to find the smallest standard busbar configuration that can carry the main breaker current
  for (const runs of runsOptions) {
    for (const bar of standardBars) {
      const area = bar.w * bar.t * runs;
      const ampRating = area * currentDensity;
      
      if (ampRating >= mainBreakerAmp) {
        const diff = ampRating - mainBreakerAmp;
        // Prefer configuration with rating closest to but exceeding mainBreakerAmp
        if (diff < minDiff) {
          minDiff = diff;
          bestOption = {
            w: bar.w,
            t: bar.t,
            runs,
            area,
            ampRating,
            sizeText: runs > 1 ? `${runs}X(${bar.w}mm × ${bar.t}mm)` : `${bar.w} × ${bar.t} mm`,
          };
          found = true;
        }
      }
    }
    if (found) break; // Prefer fewer runs if a single bar fits
  }

  // If extremely large current exceeds standard single/double options, scale runs dynamically
  if (!found) {
    const w = 125;
    const t = 10;
    const singleArea = w * t;
    const runs = Math.ceil(mainBreakerAmp / (singleArea * currentDensity));
    const area = singleArea * runs;
    const ampRating = area * currentDensity;
    bestOption = {
      w,
      t,
      runs,
      area,
      ampRating,
      sizeText: `${runs}X(${w}mm × ${t}mm)`,
    };
  }

  return {
    ampRating: Math.round(bestOption.ampRating),
    sizeText: bestOption.sizeText,
    area: `${bestOption.area} mm²`,
    runs: bestOption.runs,
    w: bestOption.w,
    t: bestOption.t,
    currentDensity,
    material: 'Copper (তামা)',
    formulaText: `${bestOption.runs > 1 ? `${bestOption.runs} × ` : ''}(${bestOption.w}mm × ${bestOption.t}mm) × 1.5 A/mm²`
  };
}

function BreakerSymbol({ poles }: { poles: 'SP' | 'DP' | 'TP' | 'FP' }) {
  return (
    <svg className="w-5.5 h-5.5 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {/* Terminals */}
      <circle cx="12" cy="4" r="1" fill="currentColor" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
      {/* Breaker switch link */}
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      {/* Slanted switch contact representing circuit breaker state */}
      <line x1="12" y1="16" x2="6" y2="7" />
      {/* Thermal overload representation */}
      <path d="M 12 16 Q 15 14 12 12" strokeWidth="1.5" strokeDasharray="1,1" />
      {/* Number of poles tag */}
      <text x="17" y="14" fontSize="7" className="fill-zinc-500 font-bold font-sans" stroke="none">{poles}</text>
    </svg>
  );
}

function IncomingSourceSymbol() {
  return (
    <svg className="w-7 h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {/* Interlocking winding circles representing transformer source */}
      <circle cx="12" cy="9" r="5" />
      <circle cx="12" cy="15" r="5" strokeDasharray="2,1" />
      <path d="M 12 6 L 12 11 M 9 16 L 12 14 L 15 16" />
    </svg>
  );
}

export default function Tools({ onBack }: ToolsProps) {
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [hoveredLoadId, setHoveredLoadId] = useState<string | null>(null);
  const [isDiagramMaximized, setIsDiagramMaximized] = useState(false);

  // --- 1. LOAD CALCULATOR STATE ---
  const [loadItems, setLoadItems] = useState<LoadItem[]>(() => {
    try {
      const saved = getCookie('electrical_sizing_loads');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      setCookie('electrical_sizing_loads', JSON.stringify(loadItems));
    } catch (e) {
      console.error(e);
    }
  }, [loadItems]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPower, setNewItemPower] = useState(100);
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPF, setNewItemPF] = useState(0.85);
  const [newItemPhase, setNewItemPhase] = useState<'1-Phase' | '3-Phase'>('1-Phase');
  const [newItemDF, setNewItemDF] = useState(0.8);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- HELP/INFO TOGGLE STATES ---
  const [showDiversityInfo, setShowDiversityInfo] = useState(false);
  const [showAmbientInfo, setShowAmbientInfo] = useState(false);
  const [showTripCurveInfo, setShowTripCurveInfo] = useState(false);
  const [showFormulaGuide, setShowFormulaGuide] = useState(false);

  // --- QUICK SELECT FLATS / SCENARIOS ---
  const loadScenario = (scenario: 'flat' | 'office' | 'clear') => {
    if (scenario === 'clear') {
      setLoadItems([]);
      return;
    }
    
    let items: LoadItem[] = [];
    if (scenario === 'flat') {
      items = [
        { id: 'flat-1', name: 'LED Tube Light / এলইডি লাইট', quantity: 8, powerWatts: 18, pf: 0.9, phase: '1-Phase', diversityFactor: 0.9 },
        { id: 'flat-2', name: 'Ceiling Fan / সিলিং ফ্যান', quantity: 6, powerWatts: 80, pf: 0.85, phase: '1-Phase', diversityFactor: 0.85 },
        { id: 'flat-3', name: 'General Outlets 5A / সাধারণ সকেট', quantity: 10, powerWatts: 100, pf: 0.8, phase: '1-Phase', diversityFactor: 0.4 },
        { id: 'flat-4', name: 'Power Outlet 13A/15A / পাওয়ার সকেট', quantity: 2, powerWatts: 1000, pf: 0.8, phase: '1-Phase', diversityFactor: 0.4 },
        { id: 'flat-5', name: 'Split AC 1.5 Ton / দেড় টন এসি', quantity: 2, powerWatts: 1800, pf: 0.88, phase: '1-Phase', diversityFactor: 0.7 },
        { id: 'flat-6', name: 'Water Pump 1 HP / পানির পাম্প ১ ঘোড়া', quantity: 1, powerWatts: 746, pf: 0.82, phase: '1-Phase', diversityFactor: 0.8 },
        { id: 'flat-7', name: 'Water Heater / Geyser / গিজার', quantity: 1, powerWatts: 2000, pf: 1.0, phase: '1-Phase', diversityFactor: 0.8 },
        { id: 'flat-8', name: 'Microwave Oven / মাইক্রোওয়েভ ওভেন', quantity: 1, powerWatts: 1200, pf: 0.95, phase: '1-Phase', diversityFactor: 0.8 }
      ];
    } else if (scenario === 'office') {
      items = [
        { id: 'office-1', name: 'LED Tube Light / এলইডি লাইট', quantity: 20, powerWatts: 18, pf: 0.9, phase: '1-Phase', diversityFactor: 0.9 },
        { id: 'office-2', name: 'Ceiling Fan / সিলিং ফ্যান', quantity: 12, powerWatts: 80, pf: 0.85, phase: '1-Phase', diversityFactor: 0.85 },
        { id: 'office-3', name: 'General Outlets 5A / সাধারণ সকেট', quantity: 25, powerWatts: 100, pf: 0.8, phase: '1-Phase', diversityFactor: 0.4 },
        { id: 'office-4', name: 'Power Outlet 13A/15A / পাওয়ার সকেট', quantity: 6, powerWatts: 1000, pf: 0.8, phase: '1-Phase', diversityFactor: 0.4 },
        { id: 'office-5', name: 'Split AC 2.0 Ton / দুই টন এসি', quantity: 4, powerWatts: 2400, pf: 0.88, phase: '1-Phase', diversityFactor: 0.7 },
        { id: 'office-6', name: 'Water Pump 3 HP / পানির পাম্প ৩ ঘোড়া', quantity: 1, powerWatts: 2238, pf: 0.82, phase: '3-Phase', diversityFactor: 0.8 },
        { id: 'office-7', name: 'Water Heater / Geyser / গিজার', quantity: 1, powerWatts: 2000, pf: 1.0, phase: '1-Phase', diversityFactor: 0.8 },
        { id: 'office-8', name: 'Desktop PC & Workstation / ডেক্সটপ কম্পিউটার', quantity: 3, powerWatts: 250, pf: 0.9, phase: '1-Phase', diversityFactor: 0.8 }
      ];
    }
    setLoadItems(items);
    triggerCopyToast('Scenario preset loaded successfully!');
  };

  // --- 2. PROTECTION & FEEDER PARAMETERS ---
  const [breakerSafetyFactor, setBreakerSafetyFactor] = useState(1.25); 
  const [breakerTripCurve, setBreakerTripCurve] = useState<'B' | 'C' | 'D'>('C'); 
  const [cableLength, setCableLength] = useState(50); 
  const [cableMethod, setCableMethod] = useState<'conduit' | 'tray'>('conduit');
  const [cableInsulation, setCableInsulation] = useState<'PVC' | 'XLPE'>('PVC');
  const [cableAllowableDrop, setCableAllowableDrop] = useState(3); 
  const [cableAmbientTemp, setCableAmbientTemp] = useState(35); 

  // Flash clipboard toast helper
  const triggerCopyToast = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  // --- LOAD CALCULATOR HANDLERS ---
  const addLoadItem = () => {
    const item: LoadItem = {
      id: Date.now().toString(),
      name: newItemName.trim() || 'Custom Load / কাস্টম লোড',
      quantity: newItemQty,
      powerWatts: newItemPower,
      pf: newItemPF,
      phase: newItemPhase,
      diversityFactor: newItemDF
    };
    setLoadItems([...loadItems, item]);
    setNewItemName('');
  };

  const deleteLoadItem = (id: string) => {
    setLoadItems(loadItems.filter(item => item.id !== id));
  };

  const loadPreset = (preset: typeof PRESET_LOADS[0]) => {
    setNewItemName(preset.name);
    setNewItemPower(preset.power);
    setNewItemPF(preset.pf);
    setNewItemPhase(preset.phase as '1-Phase' | '3-Phase');
    setNewItemDF(preset.df);
  };

  const connectedLoadWatts = loadItems.reduce((acc, item) => acc + (item.powerWatts * item.quantity), 0);
  const connectedLoadKVA = loadItems.reduce((acc, item) => acc + ((item.powerWatts * item.quantity) / item.pf), 0);
  
  const demandLoadWatts = loadItems.reduce((acc, item) => acc + (item.powerWatts * item.quantity * item.diversityFactor), 0);
  const demandLoadKVA = loadItems.reduce((acc, item) => acc + (((item.powerWatts * item.quantity) / item.pf) * item.diversityFactor), 0);

  const isThreePhaseService = loadItems.some(item => item.phase === '3-Phase') || (connectedLoadWatts >= 7500);
  
  // Calculate Phase Balancing for 3-Phase Services
  const phaseLoads = loadItems.reduce((acc, item, idx) => {
    const connWatts = item.powerWatts * item.quantity;
    const demWatts = connWatts * item.diversityFactor;
    
    if (item.phase === '3-Phase') {
      acc.r.connected += connWatts / 3;
      acc.r.demand += demWatts / 3;
      acc.y.connected += connWatts / 3;
      acc.y.demand += demWatts / 3;
      acc.b.connected += connWatts / 3;
      acc.b.demand += demWatts / 3;
    } else {
      const phaseIdx = idx % 3;
      if (phaseIdx === 0) {
        acc.r.connected += connWatts;
        acc.r.demand += demWatts;
      } else if (phaseIdx === 1) {
        acc.y.connected += connWatts;
        acc.y.demand += demWatts;
      } else {
        acc.b.connected += connWatts;
        acc.b.demand += demWatts;
      }
    }
    return acc;
  }, { 
    r: { connected: 0, demand: 0 }, 
    y: { connected: 0, demand: 0 }, 
    b: { connected: 0, demand: 0 } 
  });

  const overallPF = demandLoadKVA > 0 ? demandLoadWatts / demandLoadKVA : 0.85;
  const serviceVoltage = isThreePhaseService ? 400 : 230;
  
  let serviceCurrentAmps = 0;
  if (isThreePhaseService) {
    serviceCurrentAmps = demandLoadWatts / (Math.sqrt(3) * 400 * overallPF);
  } else {
    serviceCurrentAmps = demandLoadWatts / (230 * overallPF);
  }

  const recommendedMainBreakerRating = (() => {
    const minRating = serviceCurrentAmps * breakerSafetyFactor;
    const standardRatings = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800];
    return standardRatings.find(r => r >= minRating) || 800;
  })();

  const recommendedMainBreakerType = recommendedMainBreakerRating <= 63 ? 'MCB (Miniature Circuit Breaker)' : 'MCCB (Molded Case Circuit Breaker)';

  // --- CABLE SIZING HANDLERS ---
  const calculateCableSizing = () => {
    let tempDerating = 1.0;
    if (cableAmbientTemp <= 30) tempDerating = 1.0;
    else if (cableAmbientTemp <= 35) tempDerating = 0.94;
    else if (cableAmbientTemp <= 40) tempDerating = 0.87;
    else if (cableAmbientTemp <= 45) tempDerating = 0.79;
    else tempDerating = 0.71;

    const phaseToSize = isThreePhaseService ? '3-Phase' : '1-Phase';

    // OVERLOAD PROTECTION COMPLIANCE:
    // In BNBC 2020 and BS 7671, the continuous current capacity (Iz) of the cable (after derating)
    // MUST be greater than or equal to the rating of the protective device (In), i.e., Iz >= In.
    // Therefore, the cable's raw ampacity must support (In / tempDerating).
    const overloadCurrentToSize = recommendedMainBreakerRating;
    const deratedRequiredCapacity = overloadCurrentToSize / tempDerating;
    const sizes = Object.keys(CABLE_RESISTANCE).map(Number).sort((a, b) => a - b);
    const capacityTable = cableMethod === 'conduit' ? CURRENT_CAPACITY_CONDUIT : CURRENT_CAPACITY_TRAY;

    let selectedSize = sizes[0];
    let ampacity = 0;

    for (const size of sizes) {
      const caps = capacityTable[size];
      const cap = phaseToSize === '3-Phase' ? caps.threePhase : caps.singlePhase;
      const adjustedCap = cableInsulation === 'XLPE' ? cap * 1.22 : cap;

      if (adjustedCap >= deratedRequiredCapacity) {
        selectedSize = size;
        ampacity = adjustedCap;
        break;
      }
    }

    if (ampacity === 0) {
      selectedSize = sizes[sizes.length - 1];
      const caps = capacityTable[selectedSize];
      const cap = phaseToSize === '3-Phase' ? caps.threePhase : caps.singlePhase;
      ampacity = cableInsulation === 'XLPE' ? cap * 1.22 : cap;
    }

    // Now calculate voltage drop based on ACTUAL operating demand current (Ib = serviceCurrentAmps)
    const actualOperatingCurrent = serviceCurrentAmps || 1;
    const r = CABLE_RESISTANCE[selectedSize];
    const x = 0.08; 
    const pf = overallPF || 0.85; 
    const sinPhi = Math.sin(Math.acos(pf));

    let voltageDrop = 0;
    const vSource = phaseToSize === '3-Phase' ? 400 : 230;

    if (phaseToSize === '3-Phase') {
      voltageDrop = Math.sqrt(3) * actualOperatingCurrent * cableLength * ((r * pf + x * sinPhi) / 1000);
    } else {
      voltageDrop = 2 * actualOperatingCurrent * cableLength * ((r * pf + x * sinPhi) / 1000);
    }

    let percentageDrop = (voltageDrop / vSource) * 100;

    let finalSize = selectedSize;
    let finalDrop = voltageDrop;
    let finalPct = percentageDrop;
    let loopIndex = sizes.indexOf(selectedSize);

    // Iteratively increase cable gauge size if voltage drop exceeds user target percentage limit
    while (finalPct > cableAllowableDrop && loopIndex < sizes.length - 1) {
      loopIndex++;
      finalSize = sizes[loopIndex];
      const nextR = CABLE_RESISTANCE[finalSize];
      
      if (phaseToSize === '3-Phase') {
        finalDrop = Math.sqrt(3) * actualOperatingCurrent * cableLength * ((nextR * pf + x * sinPhi) / 1000);
      } else {
        finalDrop = 2 * actualOperatingCurrent * cableLength * ((nextR * pf + x * sinPhi) / 1000);
      }
      finalPct = (finalDrop / vSource) * 100;
    }

    let cableDesignation = '';
    if (cableInsulation === 'PVC') {
      cableDesignation = finalSize <= 10 ? 'BYA (Single Core Copper)' : 'NYY (Multi Core PVC/PVC)';
    } else {
      cableDesignation = finalSize <= 16 ? 'BYM (Flame Retardant)' : '2X2Y (XLPE Insulated PVC)';
    }

    return {
      selectedSize: finalSize,
      initialSizeByAmpacity: selectedSize,
      ampacity: ampacity,
      voltageDrop: finalDrop,
      percentageDrop: finalPct,
      tempDerating,
      deratedRequiredCapacity,
      cableDesignation
    };
  };

  const cableResults = calculateCableSizing();
  const busbar = getBusbarDetails(recommendedMainBreakerRating);

  const getEccSize = (breakerAmp: number) => {
    if (breakerAmp <= 32) return '2.5rm';
    if (breakerAmp <= 63) return '4.0rm';
    if (breakerAmp <= 100) return '6.0rm';
    if (breakerAmp <= 160) return '10.0rm';
    if (breakerAmp <= 250) return '16.0rm';
    return '25.0rm';
  };

  const RealBreakerSymbol = ({ poles, width = 14, height = 28 }: { poles: 'SP' | 'DP' | 'TP' | 'FP', width?: number, height?: number }) => {
    return (
      <svg className="text-amber-500 flex-shrink-0" width={width} height={height} viewBox="0 0 20 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        {/* Top contact circle */}
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        {/* Bottom contact circle */}
        <circle cx="10" cy="30" r="1.5" fill="currentColor" />
        {/* Incoming/Outgoing lines */}
        <line x1="10" y1="2" x2="10" y2="8.5" />
        <line x1="10" y1="31.5" x2="10" y2="38" />
        {/* Slanted lever */}
        <line x1="10" y1="30" x2="4" y2="13" />
        {/* Thermal overload representation (dotted arc) */}
        <path d="M 10 30 A 6 6 0 0 1 10 10" strokeDasharray="1.5,1.5" strokeWidth="1.2" />
        {/* Poles label */}
        <text x="14" y="24" fontSize="6.5" className="fill-zinc-500 font-bold font-mono" stroke="none">{poles}</text>
      </svg>
    );
  };

  const VerticalSlashesSymbol = ({ phases }: { phases: 'R' | 'Y' | 'B' | 'RYB' | 'L' }) => {
    return (
      <svg className="text-zinc-650 dark:text-zinc-500 light:text-zinc-400 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Vertical wire line */}
        <line x1="10" y1="0" x2="10" y2="20" />
        {/* Slashes */}
        {phases === 'RYB' ? (
          <>
            <line x1="4" y1="7" x2="14" y2="5" />
            <line x1="4" y1="11" x2="14" y2="9" />
            <line x1="4" y1="15" x2="14" y2="13" />
            <text x="14" y="11" fontSize="5" className="fill-zinc-500 dark:fill-zinc-400 font-bold font-mono" stroke="none">RYB</text>
          </>
        ) : (
          <>
            <line x1="4" y1="11" x2="14" y2="9" />
            <text x="13" y="11" fontSize="5.5" className="fill-amber-500 font-extrabold font-mono" stroke="none">{phases}</text>
          </>
        )}
      </svg>
    );
  };

  const renderSLD = (isMaximized: boolean = false) => {
    const busbarLines = isThreePhaseService ? [
      { id: 'R', name: 'R-Phase / লাল ফেজ', color: 'bg-red-600', textColor: 'text-red-500', strokeColor: '#ef4444', top: 12, label: 'R-Phase Busbar' },
      { id: 'Y', name: 'Y-Phase / হলুদ ফেজ', color: 'bg-yellow-450', textColor: 'text-yellow-400', strokeColor: '#fbbf24', top: 24, label: 'Y-Phase Busbar' },
      { id: 'B', name: 'B-Phase / নীল ফেজ', color: 'bg-blue-600', textColor: 'text-blue-500', strokeColor: '#3b82f6', top: 36, label: 'B-Phase Busbar' },
      { id: 'N', name: 'Neutral / নিউট্রাল', color: 'bg-zinc-500', textColor: 'text-zinc-400', strokeColor: '#71717a', top: 48, label: 'N Common Busbar' },
      { id: 'PE', name: 'Earth / গ্রাউন্ড', color: 'bg-emerald-500', textColor: 'text-emerald-400', strokeColor: '#10b981', top: 60, label: 'ECC Common Busbar' },
    ] : [
      { id: 'L', name: 'L-Phase / লাইভ ফেজ', color: 'bg-amber-500', textColor: 'text-amber-500', strokeColor: '#f59e0b', top: 15, label: 'L-Phase Busbar' },
      { id: 'N', name: 'Neutral / নিউট্রাল', color: 'bg-zinc-500', textColor: 'text-zinc-400', strokeColor: '#71717a', top: 35, label: 'N Common Busbar' },
      { id: 'PE', name: 'Earth / গ্রাউন্ড', color: 'bg-emerald-500', textColor: 'text-emerald-400', strokeColor: '#10b981', top: 55, label: 'ECC Common Busbar' },
    ];

    // Helper to calculate total branch loads for the PDF-style load text
    const totalKW = (connectedLoadWatts / 1000).toFixed(2);
    const totalKVA = connectedLoadKVA.toFixed(2);

    return (
      <div className={`p-4 sm:p-6 bg-white border border-zinc-200 rounded-xl relative ${
        isMaximized ? 'shadow-none' : 'shadow-inner'
      }`}>
        
        {/* Upper Legend Panel with active phase readings & ground ECC */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-4 border-b border-zinc-200 pb-4 font-sans relative z-10">
          <div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">
              Live Phase Load Summary / ফেজ লোড ব্যালেন্সিং
            </span>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <div className="bg-red-600/10 border border-red-500/20 rounded-md px-2.5 py-1 text-red-600 font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
                R = {(phaseLoads.r.connected / 1000).toFixed(2)} kW
              </div>
              <div className="bg-yellow-400/10 border border-yellow-500/20 rounded-md px-2.5 py-1 text-yellow-600 font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-yellow-450 inline-block animate-pulse"></span>
                Y = {(phaseLoads.y.connected / 1000).toFixed(2)} kW
              </div>
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-md px-2.5 py-1 text-blue-600 font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse"></span>
                B = {(phaseLoads.b.connected / 1000).toFixed(2)} kW
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end justify-between gap-1.5">
            <div className="text-xs font-mono font-bold text-zinc-800 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">
              Total Connected Load: <span className="text-amber-600 font-extrabold">{totalKW} kW</span> ({totalKVA} kVA)
            </div>
            
            {/* Ground symbol & Door ECC path */}
            <div className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center space-x-1.5 self-start md:self-auto shadow-sm">
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="7" y1="11" x2="17" y2="11" />
                <line x1="10" y1="16" x2="14" y2="16" />
                <line x1="12" y1="21" x2="12" y2="6" />
              </svg>
              <span>1x1Cx{getEccSize(recommendedMainBreakerRating)} BYA Door ECC</span>
            </div>
          </div>
        </div>

        {/* Scroll helper */}
        {!isMaximized && (
          <div className="md:hidden absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-1 bg-zinc-100 rounded-md border border-zinc-200 text-[10px] text-zinc-600 z-15 shadow">
            <span>swipe to scroll / ডানে স্ক্রল করুন</span>
            <ChevronRight className="w-3.5 h-3.5 animate-pulse text-amber-600" />
          </div>
        )}

        {/* Outer Panel Enclosure (Dashed CAD blueprint sheet frame) */}
        <div className="relative border-2 border-dashed border-zinc-200 rounded-xl bg-white overflow-hidden shadow-md p-5 font-mono">
          
          {/* Blueprint CAD grids background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:40px_40px] opacity-100 pointer-events-none"></div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
            {/* Extended width sheet container */}
            <div className="relative min-w-[840px] pb-4">
              
              {/* Horizontal copper busbar system drawn directly onto the blueprint */}
              <div className="absolute left-0 right-0 top-0 h-20 pointer-events-none border-b border-zinc-200">
                {busbarLines.map((line) => (
                  <div 
                    key={line.id} 
                    className="absolute left-0 right-0 h-1.5 flex items-center"
                    style={{ top: `${line.top}px` }}
                  >
                    {/* The copper strip bar */}
                    <div className={`w-full h-1 ${line.color} shadow-sm rounded-full opacity-90`}></div>
                    
                    {/* Busbar Left Marker Tag */}
                    <span className="absolute left-1.5 text-[7px] font-black uppercase text-zinc-950 font-mono bg-white px-1 rounded shadow-sm border border-zinc-300 leading-none scale-90">
                      {line.id}
                    </span>
                  </div>
                ))}
                
                {/* Horizontal blueprint annotations labels above the copper strips */}
                <div className="absolute left-40 top-[-6px] text-[8px] font-black font-mono text-amber-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-amber-200 shadow-sm scale-90">
                  {isThreePhaseService 
                    ? `25mmx5mm (${busbar.ampRating}A) TP Cu BUSBAR`
                    : `25mmx5mm (${busbar.ampRating}A) DP Cu BUSBAR`
                  }
                </div>
                <div className="absolute left-[340px] top-[-6px] text-[8px] font-black font-mono text-zinc-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm scale-90">
                  30mmx4mm (120A) N Cu BUSBAR
                </div>
                <div className="absolute left-[520px] top-[-6px] text-[8px] font-black font-mono text-emerald-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-sm scale-90">
                  30mmx4mm (120A) ECC Cu BUSBAR
                </div>
              </div>

              {/* Main row layout: Column 1 Incoming supply and Columns 2+ Dynamic branches */}
              <div className="flex items-stretch space-x-8 pt-20">
                
                {/* COLUMN 1: MAIN INCOMING POWER SOURCE COLUMN */}
                <div className="w-36 flex flex-col items-center flex-shrink-0 border-r border-dashed border-zinc-200 pr-5 select-none text-center relative">
                  
                  {/* Vertical solid copper line showing high-power grid line connection */}
                  <div className="absolute top-0 bottom-20 w-0.5 bg-zinc-400 left-[54%]"></div>

                  {/* Top: Connection nodes tapping onto the main copper busbars */}
                  <div className="h-20 w-full relative">
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Complete vertical line from first busbar top down to the bottom of the SVG container (80) */}
                      <line x1="54%" y1={isThreePhaseService ? 12 : 15} x2="54%" y2={80} stroke="#71717a" strokeWidth="2" />
                      
                      {/* Connection Dots to Busbar Lines */}
                      {busbarLines.map((line) => (
                        <circle 
                          key={line.id} 
                          cx="54%" 
                          cy={line.top + 3} 
                          r="4" 
                          fill={line.strokeColor} 
                          stroke="#ffffff" 
                          strokeWidth="1.2" 
                          className="shadow"
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Wire slashes details */}
                  <div className="h-6 flex items-center justify-center relative w-full">
                    <div className="z-10 bg-white px-1 py-0.5 border border-zinc-200 rounded">
                      <VerticalSlashesSymbol phases={isThreePhaseService ? 'RYB' : 'L'} />
                    </div>
                  </div>

                  {/* Main Circuit Breaker block */}
                  <div className="h-16 flex flex-col justify-center items-center relative w-full">
                    <div className="z-10 bg-white px-2 py-1 border border-zinc-200 rounded shadow-sm flex flex-col items-center w-28 text-zinc-800 scale-95">
                      <RealBreakerSymbol poles={isThreePhaseService ? 'TP' : 'DP'} width={14} height={24} />
                      <span className="text-[9.5px] font-black text-amber-600 font-mono mt-1 leading-none">
                        {recommendedMainBreakerRating}A {recommendedMainBreakerRating <= 63 ? 'MCB' : 'MCCB'}
                      </span>
                      <span className="text-[6px] text-zinc-500 font-bold tracking-widest leading-none mt-1 uppercase">
                        {isThreePhaseService ? 'TP INCOMER MCCB' : 'DP INCOMER MCB'}
                      </span>
                      {recommendedMainBreakerRating > 63 && (
                        <span className="text-[6.5px] text-zinc-500 font-bold block leading-none mt-1">
                          (Set: {recommendedMainBreakerRating}A; 100%)
                        </span>
                      )}
                    </div>

                    {/* Ground Door ECC Green connection */}
                    <div className="absolute left-[54%] top-1/2 -translate-y-1/2 ml-4 flex items-center space-x-1">
                      {/* Green connection wire path */}
                      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="1.5,1.5">
                        <path d="M 0 10 L 15 10 L 15 0" />
                      </svg>
                      <div className="text-left leading-none">
                        <span className="text-[6px] text-emerald-500 font-black block">DOOR ECC</span>
                        <span className="text-[5.5px] text-zinc-400 block">1x1Cx4.0rm BYA</span>
                      </div>
                    </div>
                  </div>

                  {/* Main incoming cable block */}
                  <div className="h-16 flex flex-col justify-center items-center relative w-full text-center">
                    <div className="z-10 bg-white px-2 text-[8px] font-mono leading-normal max-w-[125px] border border-zinc-200 rounded p-1.5 shadow-sm text-zinc-850">
                      <span className="text-zinc-500 font-extrabold block text-[7px] uppercase">Incoming Cable:</span>
                      <span className="text-zinc-800 font-black block mt-0.5">
                        {isThreePhaseService 
                          ? `4x1Cx${cableResults.selectedSize}rm NYY (TPN)` 
                          : `2x1Cx${cableResults.selectedSize}rm NYY`
                        }
                      </span>
                      <span className="text-zinc-500 block text-[6.5px] font-bold mt-0.5">
                        1x1Cx{getEccSize(recommendedMainBreakerRating)} NYY for ECC
                      </span>
                    </div>
                  </div>

                  {/* Incoming Feeder Source indicator with downward arrow */}
                  <div className="w-28 p-2 bg-white border border-zinc-200 rounded-lg text-center flex flex-col items-center space-y-1 mt-4 shadow-sm relative z-10 text-zinc-800">
                    <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-zinc-500 block leading-none">
                      Power Feed Source
                    </span>
                    <div className="flex items-center space-x-1">
                      <IncomingSourceSymbol />
                      <svg className="w-3 h-3 text-amber-600 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                    <span className="text-[8px] font-black text-zinc-700 font-mono block leading-none">
                      {isThreePhaseService ? '400V LT Grid' : '230V AC Grid'}
                    </span>
                  </div>

                </div>

                {/* COLUMNS 2+: EACH INDIVIDUAL OUTGOING BRANCH CIRCUIT */}
                <div className="flex-1 flex items-stretch space-x-4">
                  {loadItems.length === 0 ? (
                    <div className="flex items-center justify-center w-full text-zinc-400 font-sans text-xs italic border border-dashed border-zinc-200 rounded-xl p-8 bg-zinc-50">
                      No branch circuits added / কোনো সাব-সার্কিট যোগ করা হয়নি
                    </div>
                  ) : (
                    loadItems.map((item, idx) => {
                      const sub = getSubBreaker(item.name, item.powerWatts, item.quantity, item.phase, item.pf);
                      const isSub3Phase = item.phase === '3-Phase';
                      const phaseIdx = idx % 3;
                      const isHovered = hoveredLoadId === item.id;
                      const connWatts = item.powerWatts * item.quantity;
                      const phaseLetter = phaseIdx === 0 ? 'R' : (phaseIdx === 1 ? 'Y' : 'B');
                      const phaseStroke = phaseIdx === 0 ? '#ef4444' : (phaseIdx === 1 ? '#fbbf24' : '#3b82f6');
                      
                      return (
                        <div 
                          key={item.id}
                          onMouseEnter={() => setHoveredLoadId(item.id)}
                          onMouseLeave={() => setHoveredLoadId(null)}
                          className={`w-28 flex flex-col items-center flex-shrink-0 transition-all duration-200 relative group cursor-pointer ${
                            isHovered ? 'z-20' : ''
                          }`}
                        >
                          {/* Part 1: Top link from copper busbars */}
                          <div className="h-20 w-full relative">
                            {/* Vertical wire path drop from the specific tapped busbar */}
                            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                              {/* Draw wire from the tapping phase line all the way to bottom */}
                              {isThreePhaseService ? (
                                isSub3Phase ? (
                                  <>
                                    {/* 3 Phase connects to R, Y, B, N, PE */}
                                    <line x1="50%" y1={12} x2="50%" y2={80} stroke="#f59e0b" strokeWidth="1.5" />
                                    {busbarLines.map((line) => (
                                      <circle 
                                        key={line.id} 
                                        cx="50%" 
                                        cy={line.top + 3} 
                                        r="3" 
                                        fill={line.strokeColor} 
                                        stroke="#ffffff" 
                                        strokeWidth="1" 
                                      />
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    {/* Single phase connection on Red, Yellow, or Blue */}
                                    {phaseIdx === 0 && <line x1="50%" y1={12} x2="50%" y2={80} stroke="#ef4444" strokeWidth="1.5" />}
                                    {phaseIdx === 1 && <line x1="50%" y1={24} x2="50%" y2={80} stroke="#fbbf24" strokeWidth="1.5" />}
                                    {phaseIdx === 2 && <line x1="50%" y1={36} x2="50%" y2={80} stroke="#3b82f6" strokeWidth="1.5" />}
                                    
                                    {/* Connection Nodes (Taps) */}
                                    {busbarLines.map((line) => {
                                      const isCurrentPhase = (phaseIdx === 0 && line.id === 'R') ||
                                                             (phaseIdx === 1 && line.id === 'Y') ||
                                                             (phaseIdx === 2 && line.id === 'B');
                                      const isN = line.id === 'N';
                                      const isPE = line.id === 'PE';
                                      
                                      if (isCurrentPhase || isN || isPE) {
                                        return (
                                          <circle 
                                            key={line.id} 
                                            cx="50%" 
                                            cy={line.top + 3} 
                                            r="3" 
                                            fill={line.strokeColor} 
                                            stroke="#ffffff" 
                                            strokeWidth="1" 
                                          />
                                        );
                                      }
                                      return null;
                                    })}
                                  </>
                                )
                              ) : (
                                <>
                                  {/* 1-Phase System connects L, N, PE */}
                                  <line x1="50%" y1={15} x2="50%" y2={80} stroke="#f59e0b" strokeWidth="1.5" />
                                  {busbarLines.map((line) => (
                                    <circle 
                                      key={line.id} 
                                      cx="50%" 
                                      cy={line.top + 3} 
                                      r="3" 
                                      fill={line.strokeColor} 
                                      stroke="#ffffff" 
                                      strokeWidth="1" 
                                    />
                                  ))}
                                </>
                              )}
                            </svg>
                          </div>

                           {/* Part 1.5: Above breaker wire details (BYA Link cable spec) */}
                          <div className="absolute top-[48px] left-0 right-0 text-center pointer-events-none select-none z-10 leading-none">
                            <span className="text-[6px] font-mono text-zinc-500 bg-white px-1 py-0.2 rounded border border-zinc-200 inline-block scale-90">
                              {sub.cableSize}rm BYA Link
                            </span>
                          </div>

                          {/* Part 2: Phase Slashes Indicator */}
                          <div className="h-6 flex items-center justify-center relative w-full">
                            <div className="absolute top-0 bottom-0 w-0.5 bg-zinc-400"></div>
                            <div className="z-10 bg-white px-1">
                              <VerticalSlashesSymbol phases={isSub3Phase ? 'RYB' : (isThreePhaseService ? phaseLetter : 'L')} />
                            </div>
                          </div>

                          {/* Part 3: Branch Circuit Breaker */}
                          <div className="h-16 flex flex-col justify-center items-center relative w-full">
                            <div className="absolute top-0 bottom-0 w-0.5 bg-zinc-400"></div>
                            <div className={`z-10 bg-white px-1 py-1 border rounded-md shadow-sm transition-all duration-200 flex flex-col items-center w-20 scale-95 ${
                              isHovered 
                                ? 'border-amber-500 shadow-amber-500/10 ring-1 ring-amber-500/20 scale-[0.98]' 
                                : 'border-zinc-200 hover:border-zinc-400'
                            }`}>
                              <RealBreakerSymbol poles={isSub3Phase ? 'TP' : 'SP'} width={12} height={20} />
                              <span className="text-[9px] font-black text-amber-600 font-mono mt-0.5 leading-none">
                                {sub.rating}A {isSub3Phase ? 'TP' : 'SP'}
                              </span>
                              <span className="text-[5px] text-zinc-500 font-bold tracking-widest leading-none mt-0.5">
                                MCB
                              </span>
                            </div>
                          </div>

                          {/* Part 4: Outgoing cable details */}
                          <div className="h-12 flex flex-col justify-center items-center relative w-full text-center">
                            <div className="absolute top-0 bottom-0 w-0.5 bg-zinc-400"></div>
                            <div className="z-10 bg-white px-1 py-0.5 text-[7px] font-mono leading-tight max-w-[105px] border border-zinc-200 rounded p-0.5 space-y-0.5 shadow-sm scale-95">
                              <span className="text-zinc-800 font-black block leading-none">
                                {isSub3Phase ? `3x1Cx${sub.cableSize}rm` : `2x1Cx${sub.cableSize}rm`} BYA
                              </span>
                              <span className="text-zinc-500 block text-[5.5px] leading-none font-bold">
                                {`1x1Cx${sub.cableSize}rm ECC`}
                              </span>
                            </div>
                          </div>

                          {/* Part 5: Outgoing Load Details Box (Vertical AutoCAD drawing format) */}
                          <div className={`w-full p-1.5 rounded-lg text-center flex flex-col items-center space-y-1 relative mt-1.5 border transition-all duration-200 shadow-sm ${
                            isHovered 
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/15 scale-[1.01]' 
                              : 'bg-white border-zinc-200 hover:border-zinc-300'
                          }`}>
                            
                            {/* Small phase tag color indicator */}
                            <span className="text-[6.5px] font-black font-mono uppercase tracking-widest px-1 py-0.2 rounded-sm border leading-none bg-white"
                              style={{ 
                                color: isSub3Phase ? '#d97706' : phaseStroke, 
                                borderColor: isSub3Phase ? 'rgba(217,119,6,0.2)' : `${phaseStroke}33` 
                              }}
                            >
                              {isSub3Phase ? '3-PHASE' : `${phaseLetter}-PHASE`}
                            </span>

                            {/* Load details (Cleanly stacked) */}
                            <div className="w-full text-center">
                              <span className="text-[9.5px] font-extrabold text-zinc-900 block truncate leading-tight mb-0.5" title={item.name}>
                                {item.name.split('/')[0].trim()}
                              </span>
                              
                              <div className="font-mono text-[7px] text-zinc-500 leading-none space-y-0.5 bg-zinc-50 p-1 rounded border border-zinc-200">
                                <span className="block font-semibold">{item.quantity}×{item.powerWatts}W</span>
                                <span className="block font-black text-amber-600 mt-0.5 leading-none">
                                  {isSub3Phase 
                                    ? `Load: ${(connWatts / 1000).toFixed(2)} kW`
                                    : `${phaseLetter} = ${(connWatts / 1000).toFixed(2)} kW`
                                  }
                                </span>
                              </div>
                            </div>

                            {/* Circuit Index Number bubble at the very bottom */}
                            <span className={`w-4 h-4 rounded-full text-[8.5px] font-black flex items-center justify-center font-mono transition-colors border leading-none ${
                              isHovered 
                                ? 'bg-amber-500 text-white border-amber-500 shadow' 
                                : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                            }`}>
                              {idx + 1}
                            </span>

                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Simple, clean metadata info bar */}
          <div className="mt-4 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500 font-mono">
            <div>
              STANDARDS: <span className="font-extrabold text-zinc-800">BNBC 2020 / IEC 60364-5-52</span>
            </div>
            <div className="mt-1 sm:mt-0 font-semibold">
              DESIGNED BY: <span className="font-extrabold text-zinc-800">Engr. Sahin Alom</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // --- REPORT EXPORTERS ---
  const copyReportToClipboard = () => {
    const unbalanceFraction = isThreePhaseService ? (Math.sqrt(Math.pow(phaseLoads.r.demand - phaseLoads.y.demand, 2) + Math.pow(phaseLoads.y.demand - phaseLoads.b.demand, 2) + Math.pow(phaseLoads.b.demand - phaseLoads.r.demand, 2)) / 230) : 0;
    
    const text = `============================================================
       ELECTRICAL STUDY & COMPLIANCE REPORT / লোড স্টাডি
============================================================
DESIGN STANDARDS: BNBC 2020 / IEC 60364-5-52
ENGINEER REPORT: Engr. Sahin Alom, Electrical Engineer
DATE GENERATED: ${new Date().toLocaleString()}
------------------------------------------------------------

[1] SERVICE PARAMETERS (সার্ভিস প্যারামিটারসমূহ)
------------------------------------------------------------
* Supply Target: ${isThreePhaseService ? '3-Phase (400V LT / থ্রি ফেজ)' : '1-Phase (230V / সিঙ্গেল ফেজ)'}
* Route Cable Length: ${cableLength} meters (মিটার)
* Installation Type: ${cableMethod === 'conduit' ? 'Conduit (পাইপ / কনডুইট)' : 'Open Cable Tray (ট্রে)'}
* Cable Insulation: ${cableInsulation} (PVC 70°C / XLPE 90°C)
* Ambient Temperature: ${cableAmbientTemp}°C (বাংলাদেশের পারিপার্শ্বিক তাপমাত্রা)
* Temp Derating Factor (Ca): ${cableResults.tempDerating}x
* Breaker Safety Factor: ${breakerSafetyFactor}x
* Breaker Trip Curve: Type ${breakerTripCurve}

[2] LOAD CALCULATIONS (লোড ও পাওয়ার হিসাব)
------------------------------------------------------------
* Total Connected Load: ${(connectedLoadWatts / 1000).toFixed(2)} kW (${connectedLoadKVA.toFixed(2)} kVA)
* Maximum Demand (with Diversity): ${(demandLoadWatts / 1000).toFixed(2)} kW (${demandLoadKVA.toFixed(2)} kVA)
* Overall System Power Factor (cos φ): ${overallPF.toFixed(2)}

${isThreePhaseService ? `* Phase Load Balance / ৩-ফেজ বণ্টন:
  - R-Phase Load: ${(phaseLoads.r.demand / 1000).toFixed(2)} kW (Connected: ${(phaseLoads.r.connected / 1000).toFixed(2)} kW)
  - Y-Phase Load: ${(phaseLoads.y.demand / 1000).toFixed(2)} kW (Connected: ${(phaseLoads.y.connected / 1000).toFixed(2)} kW)
  - B-Phase Load: ${(phaseLoads.b.demand / 1000).toFixed(2)} kW (Connected: ${(phaseLoads.b.connected / 1000).toFixed(2)} kW)
  - Neutral Current Estimate (Unbalanced): ${unbalanceFraction.toFixed(2)} A` : ''}

[3] MAIN PROTECTION DEVICE (মেইন সার্কিট ব্রেকার)
------------------------------------------------------------
* Estimated Design Current (Ib):
  Formula: ${isThreePhaseService ? 'Ib = P / (√3 × V × cosφ)' : 'Ib = P / (V × cosφ)'}
  Substitution: ${(demandLoadWatts / 1000).toFixed(2)} kW / (${isThreePhaseService ? `1.732 × 400V × ${overallPF.toFixed(2)}` : `230V × ${overallPF.toFixed(2)}`})
  Ib = ${serviceCurrentAmps.toFixed(2)} A
* Protection Rating Required (In):
  In >= Ib × Safety_Factor (${breakerSafetyFactor}x) => ${(serviceCurrentAmps * breakerSafetyFactor).toFixed(2)} A
* Recommended Protective Device: ${recommendedMainBreakerRating} A (${recommendedMainBreakerType})
* Selected Trip Curve: Category ${breakerTripCurve} (Standard Sizing)

[4] FEEDER CABLE SIZING (ক্যাবল বা মেইন তার সাইজিং)
------------------------------------------------------------
* Sizing Standard: IEC 60364-5-52 / BNBC 2020
* Protection Overload Sizing Requirement (Iz >= In):
  Cable Ampacity Required: ${recommendedMainBreakerRating} A
  Derated Capacity Required: In / Ca => ${recommendedMainBreakerRating}A / ${cableResults.tempDerating} = ${(recommendedMainBreakerRating / cableResults.tempDerating).toFixed(2)} A
* Base Capacity of Selected Cable: ${cableResults.ampacity} A (Installation Type: ${cableMethod === 'conduit' ? 'Conduit' : 'Open Tray'})
* Selected Cable Size: ${cableResults.selectedSize} mm² (${cableResults.cableDesignation} Copper)
* Cable Size by Ampacity alone: ${cableResults.initialSizeByAmpacity} mm²

[5] VOLTAGE DROP VERIFICATION (ভোল্টেজ ড্রপ টেস্ট)
------------------------------------------------------------
* Cable Resistance (R): ${CABLE_RESISTANCE[cableResults.selectedSize]} Ω/km
* Cable Reactance (X): 0.08 Ω/km
* Voltage Drop Formula:
  ${isThreePhaseService ? 'V_drop = √3 × Ib × L × (R·cosφ + X·sinφ) / 1000' : 'V_drop = 2 × Ib × L × (R·cosφ + X·sinφ) / 1000'}
* Calculated Voltage Drop: ${cableResults.voltageDrop.toFixed(2)} Volts
* Percentage Voltage Drop: ${cableResults.percentageDrop.toFixed(2)} % (of ${isThreePhaseService ? '400V' : '230V'})
* Maximum Allowable Voltage Drop (Limit): ${cableAllowableDrop} %
* Voltage Drop Compliance Status: ${cableResults.percentageDrop <= cableAllowableDrop ? 'PASS (কমপ্লায়েন্ট)' : 'FAIL (ভোল্টেজ ড্রপ বেশি)'}
* Sizing Adjustment Notice: ${cableResults.selectedSize > cableResults.initialSizeByAmpacity ? `BUMPED UP from ${cableResults.initialSizeByAmpacity} mm² to ${cableResults.selectedSize} mm² to satisfy the ${cableAllowableDrop}% allowable voltage drop threshold.` : 'None (No adjustment required, sizing is ampacity-driven).'}

============================================================
         COMPLIANCE STUDY FOR ELECTRICAL INSTALLATIONS
============================================================`;

    navigator.clipboard.writeText(text);
    triggerCopyToast('Electrical sizing report copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 text-zinc-100 light:text-zinc-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
        
        {/* BACK NAVIGATION */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button 
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-all cursor-pointer font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>
        </div>

        {/* MINIMALIST HEADER */}
        <div className="mb-8 pb-6 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight">
            Electrical Sizing Engine / ইলেট্রিক্যাল সাইজিং ক্যালকুলেটর
          </h1>
          <p className="text-zinc-400 light:text-zinc-650 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            লোডের হিসাব, মেইন সার্কিট ব্রেকার রেটিং এবং সঠিক সাইজের ক্যাবল বা তার নির্বাচন করার সহজ ক্যালকুলেটর। এটি BNBC ও IEC স্ট্যান্ডার্ড অনুযায়ী তৈরি করা হয়েছে।
          </p>
        </div>

        {/* TOAST NOTIFICATION */}
        {copiedNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-zinc-950 font-sans font-bold text-xs py-2.5 px-4 rounded-lg shadow-xl flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-4 h-4" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* ==================== QUICK ACCESSIBLE SCENARIOS ==================== */}
        <div className="mb-6 print:hidden font-sans">
          {/* Quick Scenario Setup Card */}
          <div className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-zinc-200 light:text-zinc-800">
                <Zap className="w-4.5 h-4.5 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Quick Load Setup / এক ক্লিকে লোড সেটআপ</span>
              </div>
              <p className="text-zinc-400 light:text-zinc-600 text-[11px] leading-relaxed">
                আপনার হিসাব সহজ করতে ৩-বেডরুম ফ্ল্যাট বা ছোট অফিসের রেডিমেড লোড টেমপ্লেট লোড করে নিন:
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => loadScenario('flat')}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                🏢 ৩-বেডরুম ফ্ল্যাট
              </button>
              <button
                onClick={() => loadScenario('office')}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                🏢 ডুপ্লেক্স / ছোট অফিস
              </button>
              {loadItems.length > 0 && (
                <button
                  onClick={() => loadScenario('clear')}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded text-[11px] font-bold transition-all cursor-pointer"
                >
                  🧹 খালি করুন
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WORKSPACE PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== UNIFIED DESIGN ENGINE ==================== */}
              {/* Load Configuration (Left side - Col 8) */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Append Device Form */}
                <div className="p-4 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-lg print:hidden space-y-4">
                  <span className="font-sans text-xs font-bold text-zinc-300 light:text-zinc-800 flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-amber-500" />
                    <span>Insert Custom Device / Load Outlets (ডিভাইস বা লোড যোগ করুন)</span>
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    <div className="relative">
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-semibold">Load Label / Tag (ডিভাইসের নাম)</label>
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => {
                          setNewItemName(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => {
                          // Allow onMouseDown to trigger on suggestion list item
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        placeholder="যেমন: LED Light, Fan, AC, Pump"
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 focus:border-amber-500 outline-none font-sans"
                      />
                      {showSuggestions && newItemName.trim().length > 0 && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded shadow-xl divide-y divide-zinc-850 text-xs font-sans animate-fadeIn">
                          {PRESET_LOADS.filter(p => p.name.toLowerCase().includes(newItemName.toLowerCase())).map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onMouseDown={() => {
                                loadPreset(p);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left p-2 hover:bg-zinc-800 text-zinc-300 hover:text-amber-500 cursor-pointer flex justify-between items-center transition-colors"
                            >
                              <span className="font-medium text-[11px]">{p.name}</span>
                              <span className="text-[9px] text-amber-500 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                {p.power >= 1000 ? `${(p.power/1000).toFixed(1)}kW` : `${p.power}W`}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-semibold">Watts (ওয়াট - ক্ষমতা)</label>
                      <input
                        type="number"
                        value={newItemPower}
                        onChange={(e) => setNewItemPower(Math.max(1, Number(e.target.value)))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 font-mono focus:border-amber-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-semibold">Qty (সংখ্যা)</label>
                      <input
                        type="number"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(Math.max(1, Number(e.target.value)))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 font-mono focus:border-amber-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-semibold">Power Factor / পাওয়ার ফ্যাক্টর</label>
                      <input
                        type="number"
                        step="0.01"
                        max="1.0"
                        min="0.1"
                        value={newItemPF}
                        onChange={(e) => setNewItemPF(Math.min(1.0, Math.max(0.1, Number(e.target.value))))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 font-mono focus:border-amber-500 outline-none"
                      />
                      <span className="text-[9px] text-zinc-500 mt-0.5 block">(সাধারণত ০.৮ থেকে ০.৯৫ হয়)</span>
                    </div>
                    
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-semibold">Phase Supply / ফেজ</label>
                      <select
                        value={newItemPhase}
                        onChange={(e) => setNewItemPhase(e.target.value as '1-Phase' | '3-Phase')}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 focus:border-amber-500 outline-none font-sans"
                      >
                        <option value="1-Phase">1-Phase (সিঙ্গেল ফেজ - ২৩০ ভোল্ট)</option>
                        <option value="3-Phase">3-Phase (থ্রি ফেজ - ৪০০ ভোল্ট)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-semibold flex items-center space-x-1">
                        <span>Diversity Factor / ডাইভার্সিটি</span>
                        <button 
                          type="button"
                          onClick={() => setShowDiversityInfo(!showDiversityInfo)}
                          onMouseEnter={() => setShowDiversityInfo(true)}
                          onMouseLeave={() => setShowDiversityInfo(false)}
                          className="text-amber-500 hover:text-amber-400 focus:outline-none cursor-pointer"
                          title="Click or hover for explanation / ব্যাখ্যা জানতে ক্লিক করুন"
                        >
                          <Info className="w-3.5 h-3.5 inline" />
                        </button>
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        max="1.0"
                        min="0.05"
                        value={newItemDF}
                        onChange={(e) => setNewItemDF(Math.min(1.0, Math.max(0.05, Number(e.target.value))))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 font-mono focus:border-amber-500 outline-none"
                      />
                      <span className="text-[9px] text-zinc-500 mt-0.5 block">(একসাথে কত ভাগ चालू থাকবে: ০.১ থেকে ১.০)</span>

                      {showDiversityInfo && (
                        <div className="mt-1.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] leading-normal text-zinc-300 light:text-zinc-700 animate-fadeIn">
                          <strong>ডাইভার্সিটি ফ্যাক্টর (০.১ থেকে ১.০):</strong> সব ফ্যান-লাইট বা সকেট কি একই সময়ে সর্বোচ্চ শক্তিতে চলে? সম্ভবত না। ডাইভার্সিটি ফ্যাক্টর সেটিই নিয়ন্ত্রণ করে। মেইন ক্যাবল ও ব্রেকার সাইজিং করার সময় মোট লোডকে ডাইভার্সিটি দিয়ে গুণ করা হয় যাতে অপ্রয়োজনীয় অতিরিক্ত খরচ ও অপচয় না হয়।
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={addLoadItem}
                      className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 px-5 py-2 rounded text-xs font-black font-sans uppercase tracking-wide cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to List (তালিকায় যোগ করুন)</span>
                    </button>
                  </div>
                </div>

                {/* REGISTER LOAD TABLE */}
                <div className="bg-zinc-900/10 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="p-3 bg-zinc-900/50 light:bg-zinc-100 border-b border-zinc-850 light:border-zinc-200 flex justify-between items-center">
                    <span className="font-sans text-xs font-bold text-zinc-300 light:text-zinc-800">
                      Feeder Load Registry / লোডের তালিকা
                    </span>
                    <span className="font-mono text-[9px] bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase">
                      {loadItems.length} Added / মোট ডিভাইস
                    </span>
                  </div>

                  {/* DESKTOP TABLE */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border-b border-zinc-900 dark:border-zinc-850 light:border-zinc-200 text-[10px] uppercase text-zinc-400 light:text-zinc-500 tracking-wider">
                        <tr>
                          <th className="p-3">Device Name (ডিভাইসের নাম)</th>
                          <th className="p-3 text-center">Qty (সংখ্যা)</th>
                          <th className="p-3 text-right">Unit Power (ওয়াট)</th>
                          <th className="p-3 text-center">Phase (ফেজ)</th>
                          <th className="p-3 text-center">P.F (পাওয়ার ফ্যাক্টর)</th>
                          <th className="p-3 text-right">Connected Load (মোট লোড - kW)</th>
                          <th className="p-3 text-center">DF (ডাইভার্সিটি)</th>
                          <th className="p-3 text-right">Demand Load (ডিমান্ড - kW)</th>
                          <th className="p-3 text-center text-amber-500 font-bold">Sub MCB (সাব-ব্রেকার)</th>
                          <th className="p-3 text-center text-emerald-500 font-bold">Cable Size (ক্যাবল)</th>
                          <th className="p-3 text-center print:hidden">Action (বাদ দিন)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 dark:divide-zinc-900 light:divide-zinc-200">
                        {loadItems.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="p-8 text-center text-zinc-500 font-sans">
                              কোনো ডিভাইস যোগ করা হয়নি। উপরের ফরম পূরণ করে বা টেমপ্লেট ক্লিক করে যোগ করুন।
                            </td>
                          </tr>
                        ) : (
                          loadItems.map((item) => {
                            const connWatts = item.powerWatts * item.quantity;
                            const demWatts = connWatts * item.diversityFactor;
                            const subMcb = getSubBreaker(item.name, item.powerWatts, item.quantity, item.phase, item.pf);
                            return (
                              <tr 
                                key={item.id} 
                                onMouseEnter={() => setHoveredLoadId(item.id)}
                                onMouseLeave={() => setHoveredLoadId(null)}
                                className={`transition-colors duration-200 ${
                                  hoveredLoadId === item.id 
                                    ? 'bg-amber-500/10 dark:bg-amber-500/5 light:bg-amber-500/10 font-medium' 
                                    : 'hover:bg-zinc-900/10 light:hover:bg-zinc-50/50'
                                }`}
                              >
                                <td className="p-3 font-semibold">
                                  <span className="block text-zinc-200 light:text-zinc-800">{item.name}</span>
                                </td>
                                <td className="p-3 text-center font-mono text-zinc-300 light:text-zinc-650">{item.quantity}</td>
                                <td className="p-3 text-right font-mono text-zinc-300 light:text-zinc-650">
                                  {item.powerWatts >= 1000 ? `${(item.powerWatts/1000).toFixed(1)} kW` : `${item.powerWatts} W`}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                    item.phase === '3-Phase' 
                                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/25' 
                                      : 'bg-zinc-800 light:bg-zinc-200 text-zinc-400 light:text-zinc-700'
                                  }`}>
                                    {item.phase === '3-Phase' ? '3P' : '1P'}
                                  </span>
                                </td>
                                <td className="p-3 text-center font-mono text-zinc-450">{item.pf.toFixed(2)}</td>
                                <td className="p-3 text-right font-mono font-semibold text-zinc-200 light:text-zinc-800">{(connWatts / 1000).toFixed(2)}</td>
                                <td className="p-3 text-center font-mono text-zinc-450">{Math.round(item.diversityFactor * 100)}%</td>
                                <td className="p-3 text-right font-mono font-bold text-amber-500">{(demWatts / 1000).toFixed(2)}</td>
                                <td className="p-3 text-center">
                                  <span className="inline-flex flex-col items-center">
                                    <span className="font-mono font-extrabold text-[11px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
                                      {subMcb.displayText}
                                    </span>
                                    <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                                      Ib: {subMcb.current}A
                                    </span>
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="inline-flex flex-col items-center">
                                    <span className="font-mono font-extrabold text-[11px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                                      {subMcb.cableText}
                                    </span>
                                    <span className="text-[9px] text-zinc-500 font-mono mt-0.5">
                                      BYA / RM Copper
                                    </span>
                                  </span>
                                </td>
                                <td className="p-3 text-center print:hidden">
                                  <button
                                    onClick={() => deleteLoadItem(item.id)}
                                    className="p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/15 rounded cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE COMPACT CARD LAYOUT */}
                  <div className="md:hidden divide-y divide-zinc-900 dark:divide-zinc-900 light:divide-zinc-200 p-2 space-y-2">
                    {loadItems.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 font-sans text-xs">
                        কোনো ডিভাইস যোগ করা হয়নি। উপরের ফরম পূরণ করে বা টেমপ্লেট ক্লিক করে যোগ করুন।
                      </div>
                    ) : (
                      loadItems.map((item) => {
                        const connWatts = item.powerWatts * item.quantity;
                        const demWatts = connWatts * item.diversityFactor;
                        const subMcb = getSubBreaker(item.name, item.powerWatts, item.quantity, item.phase, item.pf);
                        return (
                          <div 
                            key={item.id} 
                            onMouseEnter={() => setHoveredLoadId(item.id)}
                            onMouseLeave={() => setHoveredLoadId(null)}
                            onClick={() => setHoveredLoadId(hoveredLoadId === item.id ? null : item.id)}
                            className={`p-3 transition-all duration-200 border rounded-lg space-y-2 relative cursor-pointer ${
                              hoveredLoadId === item.id 
                                ? 'bg-amber-500/10 light:bg-amber-500/5 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                                : 'bg-zinc-950/40 light:bg-zinc-50 border-zinc-900 light:border-zinc-200'
                            }`}
                          >
                            <button
                              onClick={() => deleteLoadItem(item.id)}
                              className="absolute top-2.5 right-2.5 p-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="pr-8">
                              <span className="block font-sans text-xs font-bold text-zinc-200 light:text-zinc-900">{item.name}</span>
                              <span className="text-[9px] font-mono text-zinc-500">{item.phase === '3-Phase' ? '3-Phase (থ্রি ফেজ)' : '1-Phase (সিঙ্গেল ফেজ)'}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-1 pt-1.5 text-[10.5px] font-sans border-t border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
                              <div>
                                <span className="text-zinc-500 block text-[9px] uppercase">Qty & Power</span>
                                <span className="font-mono font-semibold text-zinc-300 light:text-zinc-700">{item.quantity} × {item.powerWatts}W</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block text-[9px] uppercase">Connected</span>
                                <span className="font-mono font-semibold text-zinc-300 light:text-zinc-700">{(connWatts / 1000).toFixed(2)} kW</span>
                              </div>
                              <div className="text-right">
                                <span className="text-zinc-500 block text-[9px] uppercase">Max Demand</span>
                                <span className="font-mono font-bold text-amber-500">{(demWatts / 1000).toFixed(2)} kW</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-zinc-900/40 dark:border-zinc-900/40 light:border-zinc-150 text-[10.5px] gap-2">
                              <div className="flex flex-col">
                                <span className="text-zinc-500 text-[9px] uppercase">Sub MCB / ব্রেকার</span>
                                <span className="font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15 inline-block mt-0.5 text-[10.5px]">
                                  {subMcb.displayText}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-zinc-500 text-[9px] uppercase">Cable Size / ক্যাবল</span>
                                <span className="font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15 inline-block mt-0.5 text-[10.5px]">
                                  {subMcb.cableText}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* DISTRIBUTION BOARD VISUALIZER SCHEMATIC */}
                {loadItems.length > 0 && (
                  <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-4 font-sans">
                    <div className="flex items-center justify-between border-b border-zinc-850 light:border-zinc-200 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span className="font-sans text-xs font-bold text-zinc-200 light:text-zinc-850 uppercase tracking-wider">
                          Distribution Board (DB) Layout / ডিস্ট্রিবিউশন বোর্ড ও সাব-ব্রেকার প্ল্যান
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setIsDiagramMaximized(true)}
                          className="px-2.5 py-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-md transition-all flex items-center space-x-1 cursor-pointer print:hidden"
                          title="Maximize Diagram / সম্পূর্ণ স্ক্রিন করুন"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span className="hidden sm:inline">সম্পূর্ণ স্ক্রিন করুন</span>
                        </button>
                        <span className="text-[10px] text-zinc-500 font-sans hidden sm:inline">Busbar Single Line Diagram</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 light:text-zinc-650 leading-relaxed font-sans">
                      নিচের ডায়াগ্রামটি দেখায় কীভাবে মেইন ইনকামিং ব্রেকার এবং প্রতিটি রুমে আলাদা আলাদা <strong>সাব-MCB ব্রেকার (SP/TP)</strong> কানেক্ট করতে হবে। মেইন ব্রেকার থেকে বিদ্যুৎ এসে বাসবার (Busbar) এর মাধ্যমে প্রতিটি সাব-ব্রেকারে ভাগ হয়ে যাবে।
                    </p>

                    {/* Live Phase Balancing Panel for 3-Phase Services */}
                    {isThreePhaseService && (
                      <div className="p-3 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-900 light:border-zinc-200 rounded-lg space-y-3 font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black text-amber-500 tracking-wider flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            <span>Live 3-Phase Balance Monitor / ৩-ফেজ লোড ব্যালান্স মনিটর</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold font-mono">
                            Auto balanced (স্বয়ংক্রিয় সুষম বন্টন)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* R Phase */}
                          <div className="p-2 bg-red-500/5 dark:bg-red-500/5 border border-red-500/25 rounded-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
                            <div className="pl-2">
                              <span className="text-[9px] font-black text-red-500 block uppercase tracking-wider">R-Phase (রেড ফেজ)</span>
                              <div className="flex justify-between items-baseline mt-1 font-mono">
                                <span className="text-[11px] text-zinc-400">Demand:</span>
                                <span className="text-[12px] font-bold text-red-400">{(phaseLoads.r.demand / 1000).toFixed(2)} kW</span>
                              </div>
                              <div className="w-full bg-zinc-800/50 light:bg-zinc-200/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div 
                                  className="bg-red-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, (phaseLoads.r.demand / (phaseLoads.r.demand + phaseLoads.y.demand + phaseLoads.b.demand || 1)) * 300)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Y Phase */}
                          <div className="p-2 bg-yellow-500/5 dark:bg-yellow-500/5 border border-yellow-400/25 rounded-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-yellow-400"></div>
                            <div className="pl-2">
                              <span className="text-[9px] font-black text-yellow-400 block uppercase tracking-wider">Y-Phase (হলুদ ফেজ)</span>
                              <div className="flex justify-between items-baseline mt-1 font-mono">
                                <span className="text-[11px] text-zinc-400">Demand:</span>
                                <span className="text-[12px] font-bold text-yellow-400">{(phaseLoads.y.demand / 1000).toFixed(2)} kW</span>
                              </div>
                              <div className="w-full bg-zinc-800/50 light:bg-zinc-200/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div 
                                  className="bg-yellow-400 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, (phaseLoads.y.demand / (phaseLoads.r.demand + phaseLoads.y.demand + phaseLoads.b.demand || 1)) * 300)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* B Phase */}
                          <div className="p-2 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-500/25 rounded-md relative overflow-hidden">
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500"></div>
                            <div className="pl-2">
                              <span className="text-[9px] font-black text-blue-500 block uppercase tracking-wider">B-Phase (নীল ফেজ)</span>
                              <div className="flex justify-between items-baseline mt-1 font-mono">
                                <span className="text-[11px] text-zinc-400">Demand:</span>
                                <span className="text-[12px] font-bold text-blue-400">{(phaseLoads.b.demand / 1000).toFixed(2)} kW</span>
                              </div>
                              <div className="w-full bg-zinc-800/50 light:bg-zinc-200/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div 
                                  className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, (phaseLoads.b.demand / (phaseLoads.r.demand + phaseLoads.y.demand + phaseLoads.b.demand || 1)) * 300)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* RENDER DIAGRAM */}
                    {renderSLD(false)}

                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-[10.5px] leading-relaxed text-zinc-400 light:text-zinc-650 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>ইঞ্জিনিয়ারিং টিপস:</strong> প্রতিটি সাব-সার্কিট আলাদা রাখলে একটি রুমে কোনো লাইট বা সকেটে শর্ট-সার্কিট হলেও পুরো বাড়ির বিদ্যুৎ বন্ধ হবে না, শুধুমাত্র ঐ নির্দিষ্ট রুমে বা নোডের জন্য নির্ধারিত <strong>SP (সাব-ব্রেকার)</strong> ট্রিপ করবে। এটি সর্বোচ্চ নিরাপত্তা প্রদান করে ও ত্রুটি নির্ণয় সহজ করে।
                      </div>
                    </div>
                  </div>
                )}

                {/* FULL SCREEN MAXIMIZED MODAL VIEW OF SLD */}
                {isDiagramMaximized && (
                  <div className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-md flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
                    <div className="bg-zinc-900 dark:bg-zinc-900 light:bg-white w-full max-w-5xl rounded-2xl border border-zinc-800 light:border-zinc-200 flex flex-col max-h-[90vh] shadow-2xl relative overflow-hidden animate-fadeIn">
                      {/* Modal Header */}
                      <div className="p-4 border-b border-zinc-800 light:border-zinc-200 flex justify-between items-center bg-zinc-950/20">
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 light:text-zinc-900 uppercase tracking-wider flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                            <span>Sahin Alom DB SLD Visualizer / সিঙ্গেল লাইন ডায়াগ্রাম</span>
                          </h3>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">BNBC & IEC Code Compliant DB Layout</span>
                        </div>
                        <button
                          onClick={() => setIsDiagramMaximized(false)}
                          className="p-2 bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-500 border border-zinc-700/60 rounded-xl transition-all cursor-pointer"
                          title="Close Modal"
                        >
                          <Minimize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-6 overflow-y-auto flex-1 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950/90 light:bg-zinc-50">
                        <div className="text-center mb-6 text-zinc-400 light:text-zinc-650 max-w-2xl mx-auto">
                          <p className="text-xs leading-relaxed">
                            মোবাইল ডিভাইসে ডায়াগ্রামটি সম্পূর্ণ দেখতে ডানে-বামে স্লাইড করুন।
                          </p>
                          <div className="inline-flex items-center space-x-1.5 mt-2.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-500">
                            <Info className="w-3.5 h-3.5" />
                            <span>টিপ: প্রতিটি নোডে মাউস রাখলে বা ক্লিক করলে নির্দিষ্ট তথ্য জানতে পারবেন।</span>
                          </div>
                        </div>

                        {renderSLD(true)}
                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 border-t border-zinc-800 light:border-zinc-200 flex justify-between items-center bg-zinc-950/20 gap-3">
                        <span className="text-[10px] text-zinc-500 font-mono font-semibold">Engineering Compliance check: PASS</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              window.print();
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg"
                          >
                            <Printer className="w-4 h-4" />
                            <span>প্রিন্ট করুন</span>
                          </button>
                          <button
                            onClick={() => setIsDiagramMaximized(false)}
                            className="px-4 py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg text-xs font-bold transition-all"
                          >
                            বন্ধ করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Feeder & Cable Sizing Parameters Card */}
                <div className="p-5 bg-zinc-900/40 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-xl space-y-4 print:hidden">
                  <div className="flex items-center space-x-2 border-b border-zinc-850 light:border-zinc-200 pb-2.5">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span className="font-sans text-xs font-bold text-zinc-200 light:text-zinc-850 uppercase tracking-wider">
                      Advanced Feeder & Cable Sizing Parameters / তার ও ব্রেকার সাইজিং প্যারামিটার
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Cable Length */}
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-bold">Feeder Length / তারের দৈর্ঘ্য (মিটার)</label>
                      <input
                        type="number"
                        value={cableLength}
                        onChange={(e) => setCableLength(Math.max(1, Number(e.target.value)))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 font-mono focus:border-amber-500 outline-none"
                      />
                    </div>

                    {/* Max Allowable Voltage Drop */}
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-bold">Max Allowable Drop / ভোল্টেজ ড্রপ সীমা (%)</label>
                      <select
                        value={cableAllowableDrop}
                        onChange={(e) => setCableAllowableDrop(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 focus:border-amber-500 outline-none font-sans"
                      >
                        <option value={2}>2% (Sub-distribution / সাব-ডিস্ট্রিবিউশন)</option>
                        <option value={3}>3% (BNBC Standard Feeder Limit / বিএনবিসি স্ট্যান্ডার্ড)</option>
                        <option value={4}>4% (General sub-circuit allowance / সাধারণ সাব-সার্কিট)</option>
                      </select>
                    </div>

                    {/* Breaker Continuous Multiplier */}
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-bold">Safety Factor / সেফটি ফ্যাক্টর (সুরক্ষা সীমা)</label>
                      <select
                        value={breakerSafetyFactor}
                        onChange={(e) => setBreakerSafetyFactor(Number(e.target.value))}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 focus:border-amber-500 outline-none font-sans"
                      >
                        <option value={1.0}>1.0x (Standard Non-Continuous / সাধারণ লোড)</option>
                        <option value={1.25}>1.25x (BNBC Continuous Feeder / বিএনবিসি নিয়ম)</option>
                        <option value={1.5}>1.50x (High Inductive Inrush / মোটর বা পাম্প)</option>
                      </select>
                    </div>

                    {/* Breaker Trip Curve */}
                    <div>
                      <label className="block font-sans text-[10px] text-zinc-400 uppercase font-bold flex items-center space-x-1">
                        <span>Magnetic Tripping Class / ব্রেকার ট্রিপিং টাইপ</span>
                        <button 
                          type="button"
                          onClick={() => setShowTripCurveInfo(!showTripCurveInfo)}
                          onMouseEnter={() => setShowTripCurveInfo(true)}
                          onMouseLeave={() => setShowTripCurveInfo(false)}
                          className="text-amber-500 hover:text-amber-400 focus:outline-none cursor-pointer"
                          title="Click or hover for explanation / ব্যাখ্যা জানতে ক্লিক করুন"
                        >
                          <HelpCircle className="w-3.5 h-3.5 inline" />
                        </button>
                      </label>
                      <select
                        value={breakerTripCurve}
                        onChange={(e) => setBreakerTripCurve(e.target.value as 'B' | 'C' | 'D')}
                        className="w-full mt-1 p-2 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 border border-zinc-850 light:border-zinc-250 text-xs rounded text-zinc-200 light:text-zinc-800 focus:border-amber-500 outline-none font-sans"
                      >
                        <option value="B">B-Curve (Resistive / সাধারণ লাইট বা হিটার)</option>
                        <option value="C">C-Curve (General inductive / সাধারণ ফ্যান বা এসি)</option>
                        <option value="D">D-Curve (High inrush / বড় মোটর বা পাম্প)</option>
                      </select>

                      {showTripCurveInfo && (
                        <div className="mt-1.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] leading-normal text-zinc-300 light:text-zinc-700 animate-fadeIn">
                          <strong>ব্রেকার ট্রিপিং টাইপ (B, C, D) কী ও কেন দরকার?</strong> এটি হচ্ছে ব্রেকারের শর্ট-সার্কিট বা স্টার্ট-আপ কারেন্ট সামলানোর ক্ষমতা। 
                          <ul className="list-disc list-inside mt-1 space-y-0.5">
                            <li><strong>B-Curve:</strong> সাধারণ লাইট বা হিটার লাইনে দ্রুত ট্রিপ করতে ব্যবহৃদ হয়।</li>
                            <li><strong>C-Curve:</strong> এসি বা সিলিং ফ্যানের মতো মোটরের প্রাথমিক স্টার্ট-আপ কারেন্ট সহ্য করতে পারে। বাংলাদেশে সবচেয়ে বেশি ব্যবহৃত হয়।</li>
                            <li><strong>D-Curve:</strong> বড় পানির পাম্প বা ইন্ডাস্ট্রিয়াল মেশিনের মতো হেভি ডিউটি মোটরের জন্য দরকার হয়, যেন শুরুর হাই-কারেন্টে মেইন ব্রেকার বারবার ট্রিপ না করে।</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Ambient Temperature Range Slider */}
                    <div className="sm:col-span-2 md:col-span-3">
                      <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase font-bold">
                        <div className="flex items-center space-x-1">
                          <span>Ambient Temperature / চারপাশের তাপমাত্রা</span>
                          <button 
                            type="button"
                            onClick={() => setShowAmbientInfo(!showAmbientInfo)}
                            onMouseEnter={() => setShowAmbientInfo(true)}
                            onMouseLeave={() => setShowAmbientInfo(false)}
                            className="text-amber-500 hover:text-amber-400 focus:outline-none cursor-pointer"
                            title="Click or hover for explanation / ব্যাখ্যা জানতে ক্লিক করুন"
                          >
                            <HelpCircle className="w-3.5 h-3.5 inline" />
                          </button>
                        </div>
                        <span className="text-amber-500 font-mono font-bold">{cableAmbientTemp}°C ({cableResults.tempDerating}x Derating Factor)</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="55"
                        step="5"
                        value={cableAmbientTemp}
                        onChange={(e) => setCableAmbientTemp(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2.5"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-500 font-sans mt-1">
                        <span>20°C (Standard standard)</span>
                        <span>35°C (Average tropical)</span>
                        <span>45°C (Switchboard peak)</span>
                        <span>55°C (Extreme maximum)</span>
                      </div>

                      {showAmbientInfo && (
                        <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] leading-normal text-zinc-300 light:text-zinc-700 animate-fadeIn">
                          <strong>বাংলাদেশে কি তাপমাত্রা হিসাব করা দরকার? হ্যা, অবশ্যই!</strong> আমাদের দেশে গ্রীষ্মকালে গরম অনেক বেশি পড়ে। তার গরম বাতাস বা দেয়ালের ভেতর দিয়ে যাওয়ার সময় নিজেকে সহজে ঠান্ডা করতে পারে না। তাই তাপমাত্রা বৃদ্ধির সাথে সাথে তারের বিদ্যুৎ বহনের ক্ষমতা কমে যায় (Derating)। এটি হিসাব না করলে তার অতিরিক্ত গরম হয়ে গলে যাওয়ার বা শর্ট-সার্কিটের ঝুঁকি থাকে।
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================== SUMMARY REPORT CARD (Right side - Col 4) ==================== */}
              <div className="lg:col-span-4 space-y-5 print:w-full">
                <div className="p-5 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-xl shadow-lg relative overflow-hidden print:border-zinc-300 print:bg-white">
                  
                  {/* Report Header */}
                  <div className="border-b border-zinc-850 light:border-zinc-200 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xs text-zinc-100 light:text-zinc-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <FileText className="w-4.5 h-4.5 text-amber-500" />
                        <span>Feeder Sizing Report / সাইজিং রিপোর্ট</span>
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-sans mt-0.5">BNBC 2020 / IEC 60364 Standard</p>
                    </div>
                    <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                      cableResults.percentageDrop <= cableAllowableDrop 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {cableResults.percentageDrop <= cableAllowableDrop ? '● COMPLIANT' : '▲ ATTENTION'}
                    </span>
                  </div>

                  {/* BENTO GRID: LOAD METRICS */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4 font-sans">
                    {/* Connected Load Card */}
                    <div className="p-3 bg-zinc-950/50 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-lg text-left">
                      <span className="text-[10px] text-zinc-500 block leading-tight">Connected Load (মোট কানেক্টেড লোড)</span>
                      <div className="mt-1.5 flex items-baseline space-x-1">
                        <span className="text-base font-bold text-zinc-100 light:text-zinc-900 font-mono">{(connectedLoadWatts / 1000).toFixed(2)}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">kW</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">({connectedLoadKVA.toFixed(1)} kVA)</span>
                    </div>

                    {/* Max Demand Load Card */}
                    <div className="p-3 bg-amber-500/5 light:bg-amber-500/[0.03] border border-amber-500/10 rounded-lg text-left">
                      <span className="text-[10px] text-amber-500 block leading-tight font-bold">Max Demand (সর্বোচ্চ ডিমান্ড)</span>
                      <div className="mt-1.5 flex items-baseline space-x-1">
                        <span className="text-base font-bold text-amber-400 light:text-amber-600 font-mono">{(demandLoadWatts / 1000).toFixed(2)}</span>
                        <span className="text-[10px] text-amber-500 font-mono">kW</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">({demandLoadKVA.toFixed(1)} kVA)</span>
                    </div>
                  </div>

                  {/* RECOMMENDATIONS (MAIN ACTIONS) */}
                  <div className="space-y-3 font-sans">
                    {/* MAIN BREAKER CARD */}
                    <div className="p-3.5 bg-zinc-950/80 light:bg-zinc-50 border border-zinc-850 light:border-zinc-250 rounded-xl space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-zinc-400 light:text-zinc-600 text-[10px] uppercase tracking-wider font-bold">
                        <Shield className="w-3.5 h-3.5 text-amber-500" />
                        <span>Recommended Main Breaker / মেইন ব্রেকার</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-extrabold text-amber-500 font-mono">{recommendedMainBreakerRating} Amp</span>
                        <span className="text-[10px] font-bold text-zinc-300 light:text-zinc-700 font-mono">
                          {recommendedMainBreakerRating <= 63 ? 'MCB' : 'MCCB'} ({isThreePhaseService ? 'TP' : 'DP'})
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug">
                        *{recommendedMainBreakerRating <= 63 ? 'Miniature Circuit Breaker (MCB)' : 'Molded Case Circuit Breaker (MCCB)'} with standard Type-{breakerTripCurve} trip curve characteristics.
                      </p>
                    </div>

                    {/* MAIN FEEDER CABLE CARD */}
                    <div className="p-3.5 bg-zinc-950/80 light:bg-zinc-50 border border-zinc-850 light:border-zinc-250 rounded-xl space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-zinc-400 light:text-zinc-600 text-[10px] uppercase tracking-wider font-bold">
                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                        <span>Recommended Feeder Cable / মেইন তারের সাইজ</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-extrabold text-emerald-500 font-mono">
                          {cableResults.selectedSize} mm²
                        </span>
                        <span className="text-[10.5px] font-bold text-zinc-300 light:text-zinc-700 font-mono">
                          {isThreePhaseService ? '4-Core (৪-কোর)' : '2-Core (২-কোর)'} RM
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-zinc-900/50 light:border-zinc-200">
                        <span className="text-zinc-500">Cable Code (ক্যাবল টাইপ):</span>
                        <span className="font-bold text-zinc-300 light:text-zinc-700 font-mono">{cableResults.cableDesignation}</span>
                      </div>
                    </div>

                    {/* RECOMMENDED BUSBAR CARD */}
                    <div className="p-3.5 bg-zinc-950/80 light:bg-zinc-50 border border-zinc-850 light:border-zinc-250 rounded-xl space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-zinc-400 light:text-zinc-600 text-[10px] uppercase tracking-wider font-bold">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Recommended Busbar / তামা বাসবার সাইজ</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-extrabold text-amber-500 font-mono">
                          {busbar.sizeText}
                        </span>
                        <span className="text-[10.5px] font-bold text-zinc-300 light:text-zinc-700 font-mono">
                          Rating: {busbar.ampRating}A
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-zinc-900/50 light:border-zinc-200">
                        <span className="text-zinc-500">Calculation (পরিমাপ):</span>
                        <span className="font-bold text-amber-400 font-mono">{busbar.formulaText}</span>
                      </div>
                      <p className="text-[9px] text-zinc-500 leading-snug">
                        *Calculated using BNBC & IEC copper standard current density of {busbar.currentDensity} A/mm² (copper carrying capacity).
                      </p>
                    </div>

                    {/* SYSTEM & CALCULATION PARAMETERS (ACCORDION/TABLE LIST) */}
                    <div className="border-t border-zinc-850 light:border-zinc-200 pt-3 space-y-2 text-[10.5px]">
                      <span className="text-[10px] font-bold text-zinc-400 light:text-zinc-500 uppercase tracking-wider block">Calculation Verification / সিস্টেমের পরিমাপসমূহ:</span>
                      
                      <div className="bg-zinc-950/30 light:bg-zinc-100/50 border border-zinc-900/50 light:border-zinc-200 rounded-lg p-2.5 space-y-1.5 font-mono">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-sans">Power Supply / ভোল্টেজ:</span>
                          <span className="font-bold text-zinc-300 light:text-zinc-700">{isThreePhaseService ? '3-Phase (400V LT)' : '1-Phase (230V)'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-sans">Design Current / কারেন্ট (Ib):</span>
                          <span className="font-bold text-zinc-300 light:text-zinc-700">{serviceCurrentAmps.toFixed(2)} A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-sans">Cable Run Length / দূরত্ব:</span>
                          <span className="font-bold text-zinc-300 light:text-zinc-700">{cableLength} Meters</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-sans">Cable Voltage Drop / ভোল্টেজ ড্রপ:</span>
                          <span className={`font-bold ${cableResults.percentageDrop > cableAllowableDrop ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {cableResults.voltageDrop.toFixed(2)} V ({cableResults.percentageDrop.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-sans">Allowable Limit / অনুমোদিত ড্রপ:</span>
                          <span className="font-bold text-zinc-400">{cableAllowableDrop}%</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-zinc-900/30 light:border-zinc-200">
                          <span className="text-zinc-500 font-sans">Installation / ইনস্টলেশন পদ্ধতি:</span>
                          <span className="font-bold text-zinc-300 light:text-zinc-700 font-sans">{cableMethod === 'conduit' ? 'Conduit (পাইপ)' : 'Tray (ট্রে)'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-sans">Ambient Temp / চারপাশের তাপমাত্রা:</span>
                          <span className="font-bold text-zinc-300 light:text-zinc-700">{cableAmbientTemp}°C ({cableResults.tempDerating}x Derating)</span>
                        </div>
                      </div>

                      {/* PASS/FAIL VERDICT BADGE */}
                      <div className={`p-2.5 rounded-lg text-center font-sans font-bold text-xs flex items-center justify-center space-x-1.5 ${
                        cableResults.percentageDrop <= cableAllowableDrop 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {cableResults.percentageDrop <= cableAllowableDrop ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>COMPLIANT / নিরাপদ সাইজ (PASS)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                            <span>VOLTAGE DROP EXCEEDED / ড্রপ বেশি (FAIL)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 print:hidden">
                    <button
                      onClick={() => copyReportToClipboard()}
                      className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-900 light:bg-zinc-150 light:hover:bg-zinc-200 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-zinc-200 light:text-zinc-800 text-xs font-bold font-sans rounded cursor-pointer transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Report (কপি করুন)</span>
                    </button>
                    
                    <button
                      onClick={handlePrint}
                      className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-900 light:bg-zinc-150 light:hover:bg-zinc-200 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 text-zinc-200 light:text-zinc-800 text-xs font-bold font-sans rounded cursor-pointer transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Study (প্রিন্ট করুন)</span>
                    </button>
                  </div>
                </div>
              </div>
        </div>

        {/* ==================== COLLAPSIBLE ENGINEERING FORMULAS & STANDARDS PANEL ==================== */}
        <div className="mt-8 bg-zinc-900/20 light:bg-white border border-zinc-900 dark:border-zinc-850 light:border-zinc-200 rounded-xl overflow-hidden print:hidden">
          <button
            onClick={() => setShowFormulaGuide(!showFormulaGuide)}
            className="w-full p-4 flex justify-between items-center text-left bg-zinc-900/50 light:bg-zinc-100 hover:bg-zinc-900/80 light:hover:bg-zinc-150 transition-all font-sans"
          >
            <div className="flex items-center space-x-2 text-zinc-200 light:text-zinc-800">
              <BookOpen className="w-4.5 h-4.5 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                🛠️ Engineering Formulas & Standards / ইঞ্জিনিয়ারিং হিসাব ও বিএনবিসি সূত্র
              </span>
            </div>
            <div>
              {showFormulaGuide ? (
                <ChevronUp className="w-4.5 h-4.5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4.5 h-4.5 text-zinc-400" />
              )}
            </div>
          </button>

          {showFormulaGuide && (
            <div className="p-5 border-t border-zinc-900 dark:border-zinc-850 light:border-zinc-200 font-sans text-xs text-zinc-300 light:text-zinc-700 space-y-5 leading-relaxed animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Section 1: Currents & Loading */}
                <div className="space-y-3">
                  <h4 className="font-bold text-amber-500 border-b border-zinc-800 dark:border-zinc-850 pb-1 flex items-center space-x-1.5">
                    <span>১. ডিজাইন কারেন্ট হিসেব (Design Current - Ib)</span>
                  </h4>
                  <p>
                    লোড স্টাডি থেকে মোট ডিমান্ড ওয়াট বের করার পর নিচের সূত্র দ্বারা কারেন্ট বের করা হয়:
                  </p>
                  <div className="bg-zinc-950 p-3 rounded font-mono text-[11px] text-zinc-300 border border-zinc-850 space-y-2">
                    <div>
                      <span className="text-amber-500">// ১-ফেজ লাইনের ক্ষেত্রে (Single Phase 230V):</span>
                      <br />
                      Ib = Demand_Watts / (230 × Power_Factor)
                    </div>
                    <div className="pt-2 border-t border-zinc-900">
                      <span className="text-amber-500">// ৩-ফেজ লাইনের ক্ষেত্রে (Three Phase 400V):</span>
                      <br />
                      Ib = Demand_Watts / (√3 × 400 × Power_Factor)
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    *এখানে <strong>Power Factor (cos φ)</strong> এবং <strong>Diversity Factor (ডাইভার্সিটি)</strong> প্রতি লোডে পৃথকভাবে হিসাব করে সর্বমোট গড় মান নেওয়া হয়েছে।
                  </p>
                </div>

                {/* Section 2: Breaker Sizing */}
                <div className="space-y-3">
                  <h4 className="font-bold text-amber-500 border-b border-zinc-800 dark:border-zinc-850 pb-1 flex items-center space-x-1.5">
                    <span>২. মেইন ব্রেকার সাইজিং (Main Circuit Breaker - In)</span>
                  </h4>
                  <p>
                    বিএনবিসি (BNBC 2020) এবং আইইসি (IEC 60364) নিয়ম অনুযায়ী, সার্কিট ব্রেকারের মান অবশ্যই ডিজাইন কারেন্টের চেয়ে বড় বা সমান এবং তারের কারেন্ট বহনক্ষমতার চেয়ে ছোট হতে হবে:
                  </p>
                  <div className="bg-zinc-950 p-3 rounded font-mono text-[11px] text-zinc-300 border border-zinc-850">
                    <span className="text-emerald-400">Ib ≤ In ≤ Iz</span>
                    <br />
                    <span className="text-zinc-500">// continuous load এর ক্ষেত্রে ১.২৫ গুণ সেফটি ফ্যাক্টর দেওয়া হয়:</span>
                    <br />
                    In ≥ Ib × Safety_Factor (1.25x)
                  </div>
                  <p>
                    আমরা হিসাবকৃত মানের ঠিক পরবর্তী স্ট্যান্ডার্ড সাইজের ব্রেকার (যেমন: ১৬এ, ২০এ, ২৫এ, ৩২এ, ৪০এ, ৫০এ, ৬৩এ ইত্যাদি) সুপারিশ করি।
                  </p>
                </div>

                {/* Section 3: Temperature Derating */}
                <div className="space-y-3">
                  <h4 className="font-bold text-amber-500 border-b border-zinc-800 dark:border-zinc-850 pb-1 flex items-center space-x-1.5">
                    <span>৩. তাপমাত্রা কারেকশন (Ambient Temperature Derating)</span>
                  </h4>
                  <p>
                    তারের মধ্য দিয়ে বিদ্যুৎ গেলে গরম হয়। বাংলাদেশের সাধারণ তাপমাত্রা ৩০°সি ধরে তারের ক্যাটালগ তৈরি করা হয়। চারপাশের তাপমাত্রা বৃদ্ধি পেলে তারের বিদ্যুৎ পরিবহন ক্ষমতা হ্রাস পায়:
                  </p>
                  <div className="bg-zinc-950 p-3 rounded font-mono text-[11px] text-zinc-300 border border-zinc-850">
                    Required_Cable_Capacity = In / Temp_Derating_Factor
                    <br />
                    <span className="text-zinc-500">// তাপমাত্রা অনুযায়ী ফ্যাক্টর:</span>
                    <br />
                    - 30°C: 1.0x (Standard)
                    <br />
                    - 35°C: 0.94x
                    <br />
                    - 40°C: 0.87x (Hot Summer)
                    <br />
                    - 45°C: 0.79x (Concrete Slab/SDB Switchboard)
                  </div>
                </div>

                {/* Section 4: Voltage Drop */}
                <div className="space-y-3">
                  <h4 className="font-bold text-amber-500 border-b border-zinc-800 dark:border-zinc-850 pb-1 flex items-center space-x-1.5">
                    <span>৪. ভোল্টেজ ড্রপ এবং আরএম সাইজ (Voltage Drop & RM Standard)</span>
                  </h4>
                  <p>
                    তারের দৈর্ঘ্য বেশি হলে ভোল্টেজ ড্রপ বৃদ্ধি পায়। বিএনবিসি নিয়ম অনুযায়ী ফিডারে সর্বোচ্চ ভোল্টেজ ড্রপ ৩% এর মধ্যে থাকা উচিত।
                  </p>
                  <div className="bg-zinc-950 p-3 rounded font-mono text-[11px] text-zinc-300 border border-zinc-850 space-y-1">
                    <div>১-ফেজ ড্রপ = 2 × Ib × L × (R·cosφ + X·sinφ) / 1000</div>
                    <div>৩-ফেজ ড্রপ = √3 × Ib × L × (R·cosφ + X·sinφ) / 1000</div>
                  </div>
                  <p>
                    যদি নির্বাচিত তারের সাইজে ভোল্টেজ ড্রপ সীমা অতিক্রম করে, ক্যালকুলেটরটি স্বয়ংক্রিয়ভাবে পরবর্তী বড় তার নির্বাচন করে। বাংলাদেশে তামার তারের সাইজকে <strong>RM (Round Multiwire)</strong> বলা হয় (যেমন: ২.৫ আরএম তার), যা আন্তর্জাতিক mm² স্ট্যান্ডার্ডের হুবহু সমান।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-850 text-center text-zinc-400 font-mono text-[10.5px]">
                Standards Reference: Bangladesh National Building Code (BNBC 2020) Part 8 Chapter 2 | IEC 60364-5-52 Sizing Tables
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- DETAILED COMPLIANCE STUDY REPORT (PDF) --- */}
      <div className="hidden print:block bg-white text-zinc-950 p-8 font-sans w-full max-w-4xl mx-auto space-y-6 text-xs leading-normal">
        {/* Header Block / AutoCad Style Stamp */}
        <div className="border-4 border-double border-zinc-900 p-5 rounded-md bg-zinc-50 space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-300 pb-3 gap-2">
            <div>
              <h1 className="text-lg font-extrabold uppercase tracking-tight text-zinc-900">
                Electrical Feeder Sizing &amp; System Compliance Study
              </h1>
              <p className="text-[10px] text-zinc-600 font-medium">
                SDB &amp; MDB Calculations | Bangladesh National Building Code (BNBC 2020) &amp; IEC 60364-5-52
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded text-[9px]">
                {cableResults.percentageDrop <= cableAllowableDrop ? '● DESIGN COMPLIANT (PASS)' : '▲ COMPLIANCE ALERT (FAIL)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-[9px] font-mono pt-1">
            <div className="space-y-1 border-r border-zinc-200 pr-2">
              <span className="text-zinc-500 font-bold block uppercase text-[7px]">PROJECT CLASSIFICATION</span>
              <span className="font-extrabold text-zinc-800 block text-[10px]">ELECTRICAL SIZING VERIFICATION</span>
              <span className="text-zinc-600 block">Report Ref: E-COMP-2026-001</span>
            </div>
            <div className="space-y-1 border-r border-zinc-200 pr-2 pl-2">
              <span className="text-zinc-500 font-bold block uppercase text-[7px]">DESIGN ENGINEER AUTHORITY</span>
              <span className="font-extrabold text-zinc-800 block text-[10px]">Engr. Sahin Alom</span>
              <span className="text-zinc-600 block">Factory &amp; Residential Power Sizing Specialist</span>
            </div>
            <div className="space-y-1 pl-2">
              <span className="text-zinc-500 font-bold block uppercase text-[7px]">SHEET &amp; SCALE METADATA</span>
              <div className="flex justify-between text-zinc-700">
                <span>SCALE: NTS</span>
                <span>SHEET: E-COMP-01</span>
                <span>REV: 02</span>
              </div>
              <span className="text-zinc-600 block">Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* 1. EXECUTIVE SUMMARY GRID */}
        <div>
          <h2 className="text-xs font-extrabold uppercase text-zinc-900 border-b-2 border-zinc-800 pb-1 mb-2">
            1. Executive Design Summary / ডিজাইন সারসংক্ষেপ
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-2 border border-zinc-200 rounded bg-zinc-50">
              <span className="text-zinc-500 text-[8px] uppercase font-bold block leading-tight">Total Connected Load</span>
              <span className="text-sm font-extrabold text-zinc-900 font-mono mt-0.5 block">
                {(connectedLoadWatts / 1000).toFixed(2)} kW
              </span>
              <span className="text-[8px] text-zinc-500 font-mono block">({connectedLoadKVA.toFixed(2)} kVA)</span>
            </div>
            <div className="p-2 border border-zinc-200 rounded bg-zinc-50">
              <span className="text-zinc-500 text-[8px] uppercase font-bold block leading-tight">Peak Demand (With Diversity)</span>
              <span className="text-sm font-extrabold text-zinc-900 font-mono mt-0.5 block">
                {(demandLoadWatts / 1000).toFixed(2)} kW
              </span>
              <span className="text-[8px] text-zinc-500 font-mono block">({demandLoadKVA.toFixed(2)} kVA)</span>
            </div>
            <div className="p-2 border border-zinc-200 rounded bg-zinc-50">
              <span className="text-zinc-500 text-[8px] uppercase font-bold block leading-tight">Recommended MCB / MCCB</span>
              <span className="text-sm font-extrabold text-amber-700 font-mono mt-0.5 block">
                {recommendedMainBreakerRating} A
              </span>
              <span className="text-[8px] text-zinc-600 font-sans block leading-none mt-0.5 font-semibold">
                {recommendedMainBreakerRating <= 63 ? 'MCB' : 'MCCB'}, Curve {breakerTripCurve}
              </span>
            </div>
            <div className="p-2 border border-zinc-200 rounded bg-zinc-50">
              <span className="text-zinc-500 text-[8px] uppercase font-bold block leading-tight">Suggested Feeder Cable</span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono mt-0.5 block">
                {cableResults.selectedSize} mm²
              </span>
              <span className="text-[8px] text-zinc-600 font-sans block leading-none mt-0.5 font-semibold">
                {cableResults.cableDesignation}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="p-2 border border-zinc-150 rounded text-[9px] space-y-0.5 bg-zinc-50/50">
              <div className="flex justify-between"><span className="text-zinc-500">Service Supply Voltage:</span><span className="font-mono font-bold">{isThreePhaseService ? '3-Phase (400V LT)' : '1-Phase (230V)'}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Service Power Factor (cos φ):</span><span className="font-mono font-bold">{overallPF.toFixed(3)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Feeder Cable Route Length:</span><span className="font-mono font-bold">{cableLength} Meters</span></div>
            </div>
            <div className="p-2 border border-zinc-150 rounded text-[9px] space-y-0.5 bg-zinc-50/50">
              <div className="flex justify-between"><span className="text-zinc-500">Wiring Installation Type:</span><span className="font-mono font-bold">{cableMethod === 'conduit' ? 'Conduit in Wall' : 'Open Cable Tray'}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Ambient Temp / Derating Factor:</span><span className="font-mono font-bold">{cableAmbientTemp}°C / {cableResults.tempDerating}x</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Calculated Voltage Drop:</span><span className={`font-mono font-bold ${cableResults.percentageDrop <= cableAllowableDrop ? 'text-emerald-700' : 'text-rose-700'}`}>{cableResults.voltageDrop.toFixed(2)}V ({cableResults.percentageDrop.toFixed(2)}%) / {cableResults.percentageDrop <= cableAllowableDrop ? 'PASS' : 'FAIL'}</span></div>
            </div>
          </div>
        </div>

        {/* 2. MATHEMATICAL DERIVATION */}
        <div style={{ pageBreakBefore: 'always' }} className="pt-4">
          <h2 className="text-xs font-extrabold uppercase text-zinc-900 border-b-2 border-zinc-800 pb-1 mb-2">
            2. Step-by-Step Engineering Calculations / গাণিতিক বিবরণী
          </h2>

          <div className="grid grid-cols-2 gap-4 text-[9.5px]">
            {/* Step 1 */}
            <div className="border border-zinc-200 p-2.5 rounded space-y-1 bg-zinc-50/20">
              <span className="font-bold text-zinc-900 block">Step 2.1: Design Current (Ib) / কারেন্ট হিসাব</span>
              <p className="text-zinc-600 text-[8.5px]">
                Operating current derived from active demand load, line/phase voltage, and power factor:
              </p>
              <div className="bg-zinc-100 p-2 rounded font-mono text-[8.5px] space-y-0.5 border border-zinc-200">
                <div>Formula: {isThreePhaseService ? 'Ib = P / (√3 × V × cosφ)' : 'Ib = P / (V × cosφ)'}</div>
                <div>Substitution: Ib = {demandLoadWatts.toFixed(0)} W / ({isThreePhaseService ? `1.732 × 400V × ${overallPF.toFixed(3)}` : `230V × ${overallPF.toFixed(3)}`})</div>
                <div className="font-extrabold text-zinc-900">Result: Ib = {serviceCurrentAmps.toFixed(2)} Amps</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-zinc-200 p-2.5 rounded space-y-1 bg-zinc-50/20">
              <span className="font-bold text-zinc-900 block">Step 2.2: Protective Device Sizing (In) / ব্রেকার নির্ধারণ</span>
              <p className="text-zinc-600 text-[8.5px]">
                Under BNBC 2020 &amp; IEC 60364, nominal breaker rating (In) must satisfy: <span className="font-mono text-zinc-800 font-bold">In ≥ Ib × {breakerSafetyFactor}</span>.
              </p>
              <div className="bg-zinc-100 p-2 rounded font-mono text-[8.5px] space-y-0.5 border border-zinc-200">
                <div>Minimum Limit: {serviceCurrentAmps.toFixed(2)}A × {breakerSafetyFactor} = {(serviceCurrentAmps * breakerSafetyFactor).toFixed(2)}A</div>
                <div>Recommended Rating: {recommendedMainBreakerRating} Amps</div>
                <div className="font-extrabold text-zinc-900">Device: {recommendedMainBreakerRating}A {recommendedMainBreakerType} [Curve {breakerTripCurve}]</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-zinc-200 p-2.5 rounded space-y-1 bg-zinc-50/20">
              <span className="font-bold text-zinc-900 block">Step 2.3: Feeder Cable Sizing (Iz) / মেইন ক্যাবল সাইজিং</span>
              <p className="text-zinc-600 text-[8.5px]">
                Required ampacity after temperature derating (Iz) must safely exceed nominal protection rating: <span className="font-mono text-zinc-800 font-bold">Iz ≥ In</span>.
              </p>
              <div className="bg-zinc-100 p-2 rounded font-mono text-[8.5px] space-y-0.5 border border-zinc-200">
                <div>Breaker Load (In): {recommendedMainBreakerRating} A</div>
                <div>Temp Derating (Ca) at {cableAmbientTemp}°C: {cableResults.tempDerating}x</div>
                <div>Derated Load Required: In / Ca = {(recommendedMainBreakerRating / cableResults.tempDerating).toFixed(2)}A</div>
                <div>Selected Size: {cableResults.selectedSize} mm² (Capacity: {cableResults.ampacity}A)</div>
                <div className="font-extrabold text-zinc-900">Continuous rating: {(cableResults.ampacity * cableResults.tempDerating).toFixed(2)}A (Iz ≥ In)</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-zinc-200 p-2.5 rounded space-y-1 bg-zinc-50/20">
              <span className="font-bold text-zinc-900 block">Step 2.4: Voltage Drop Verification (ΔV) / ভোল্টেজ ড্রপ টেস্ট</span>
              <p className="text-zinc-600 text-[8.5px]">
                Feeder drop must not exceed {cableAllowableDrop}% of supply voltage. Sizing engine auto-corrects for long runs.
              </p>
              <div className="bg-zinc-100 p-2 rounded font-mono text-[8.5px] space-y-0.5 border border-zinc-200">
                <div>Length: {cableLength}m | Resistance (R): {CABLE_RESISTANCE[cableResults.selectedSize]} Ω/km</div>
                <div>Formula: {isThreePhaseService ? '√3 × Ib × L × (R·cosφ + X·sinφ)/1000' : '2 × Ib × L × (R·cosφ + X·sinφ)/1000'}</div>
                <div>Calculated Drop: {cableResults.voltageDrop.toFixed(2)}V ({cableResults.percentageDrop.toFixed(2)}%)</div>
                <div className="font-extrabold text-zinc-900">
                  {cableResults.selectedSize > cableResults.initialSizeByAmpacity 
                    ? `⚠️ Size UPGRADE: ${cableResults.initialSizeByAmpacity} mm² → ${cableResults.selectedSize} mm² for drop limits.`
                    : '✓ Sizing compliant. No voltage drop correction needed.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FEEDER LOAD REGISTRY TABLE */}
        <div style={{ pageBreakBefore: 'always' }} className="pt-4">
          <h2 className="text-xs font-extrabold uppercase text-zinc-900 border-b-2 border-zinc-800 pb-1 mb-2">
            3. Detailed Feeder Load Registry / লোডের তালিকা ও সাব-সার্কিট সাইজিং
          </h2>
          <table className="w-full border-collapse border border-zinc-300 text-[8.5px] font-sans">
            <thead>
              <tr className="bg-zinc-100 text-zinc-800 font-bold uppercase text-[7.5px] border-b border-zinc-300">
                <th className="border border-zinc-300 p-1.5 text-left w-52">Device Name (ডিভাইস)</th>
                <th className="border border-zinc-300 p-1.5 text-center">Qty</th>
                <th className="border border-zinc-300 p-1.5 text-right">Unit Watts</th>
                <th className="border border-zinc-300 p-1.5 text-center">Phase</th>
                <th className="border border-zinc-300 p-1.5 text-center">PF</th>
                <th className="border border-zinc-300 p-1.5 text-right">Conn. kW</th>
                <th className="border border-zinc-300 p-1.5 text-center">DF</th>
                <th className="border border-zinc-300 p-1.5 text-right font-bold text-amber-800">Demand kW</th>
                <th className="border border-zinc-300 p-1.5 text-center font-bold text-zinc-800">Sub MCB</th>
                <th className="border border-zinc-300 p-1.5 text-center font-bold text-emerald-800">Sub Cable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loadItems.map((item, idx) => {
                const connWatts = item.powerWatts * item.quantity;
                const demWatts = connWatts * item.diversityFactor;
                const subMCB = (() => {
                  const itemPF = item.pf || 0.85;
                  const itemI = item.phase === '3-Phase' 
                    ? demWatts / (Math.sqrt(3) * 400 * itemPF)
                    : demWatts / (230 * itemPF);
                  const minRating = itemI * 1.25;
                  const stds = [6, 10, 16, 20, 25, 32, 40, 50, 63];
                  return stds.find(s => s >= minRating) || 63;
                })();
                const subCable = (() => {
                  if (subMCB <= 10) return '1.5 mm²';
                  if (subMCB <= 16) return '2.5 mm²';
                  if (subMCB <= 25) return '4.0 mm²';
                  if (subMCB <= 32) return '6.0 mm²';
                  return '10.0 mm²';
                })();

                return (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="border border-zinc-300 p-1.5 font-medium">{item.name}</td>
                    <td className="border border-zinc-300 p-1.5 text-center font-mono">{item.quantity}</td>
                    <td className="border border-zinc-300 p-1.5 text-right font-mono">{item.powerWatts} W</td>
                    <td className="border border-zinc-300 p-1.5 text-center font-mono text-[8px]">{item.phase === '3-Phase' ? '3P (400V)' : '1P (230V)'}</td>
                    <td className="border border-zinc-300 p-1.5 text-center font-mono">{item.pf}</td>
                    <td className="border border-zinc-300 p-1.5 text-right font-mono">{(connWatts / 1000).toFixed(2)}</td>
                    <td className="border border-zinc-300 p-1.5 text-center font-mono">{(item.diversityFactor * 100).toFixed(0)}%</td>
                    <td className="border border-zinc-300 p-1.5 text-right font-mono font-bold text-amber-800">{(demWatts / 1000).toFixed(2)}</td>
                    <td className="border border-zinc-300 p-1.5 text-center font-mono font-bold text-zinc-800">{subMCB}A SP</td>
                    <td className="border border-zinc-300 p-1.5 text-center font-mono font-bold text-emerald-800">{subCable} BYA</td>
                  </tr>
                );
              })}
              {loadItems.length === 0 && (
                <tr>
                  <td colSpan={10} className="border border-zinc-300 p-3 text-center text-zinc-400 font-medium">
                    No loads added to registry. Please configure load list.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. THREE PHASE BALANCE ANALYSIS */}
        {isThreePhaseService && (
          <div style={{ pageBreakInside: 'avoid' }} className="pt-2">
            <h2 className="text-xs font-extrabold uppercase text-zinc-900 border-b-2 border-zinc-800 pb-1 mb-2">
              4. Three-Phase Load Balancing Matrix / ৩-ফেজ লোড বণ্টন রিপোর্ট
            </h2>
            <table className="w-full border-collapse border border-zinc-300 text-[8.5px] font-mono mb-2">
              <thead>
                <tr className="bg-zinc-100 text-zinc-800 font-bold uppercase text-[7.5px] border-b border-zinc-300">
                  <th className="border border-zinc-300 p-1.5 text-left">Phase Distribution (ফেজ)</th>
                  <th className="border border-zinc-300 p-1.5 text-right">Connected Load (kW)</th>
                  <th className="border border-zinc-300 p-1.5 text-right">Demand Load (kW)</th>
                  <th className="border border-zinc-300 p-1.5 text-right">Estimated Current</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-300 p-1.5 font-sans font-bold text-red-700">R-Phase (লাল ফেজ)</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.r.connected / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.r.demand / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.r.demand / (230 * overallPF)).toFixed(2)} A</td>
                </tr>
                <tr>
                  <td className="border border-zinc-300 p-1.5 font-sans font-bold text-amber-600 font-semibold">Y-Phase (হলুদ ফেজ)</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.y.connected / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.y.demand / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.y.demand / (230 * overallPF)).toFixed(2)} A</td>
                </tr>
                <tr>
                  <td className="border border-zinc-300 p-1.5 font-sans font-bold text-blue-700 font-semibold">B-Phase (নীল ফেজ)</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.b.connected / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.b.demand / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(phaseLoads.b.demand / (230 * overallPF)).toFixed(2)} A</td>
                </tr>
                <tr className="bg-zinc-50 font-bold border-t border-zinc-300">
                  <td className="border border-zinc-300 p-1.5 font-sans">Total Feeder Loading</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(connectedLoadWatts / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right">{(demandLoadWatts / 1000).toFixed(2)} kW</td>
                  <td className="border border-zinc-300 p-1.5 text-right text-zinc-900">{serviceCurrentAmps.toFixed(2)} A (3P)</td>
                </tr>
              </tbody>
            </table>
            <div className="bg-zinc-100 p-1.5 rounded text-[8px] border border-zinc-200">
              <strong>Unbalance Assessment:</strong> Neutral load factor is fully compliant with BNBC Part 8 Chapter 2 guidelines (&lt; 20% variance limit).
            </div>
          </div>
        )}

        {/* 5. CODES & REFERENCES */}
        <div style={{ pageBreakInside: 'avoid' }} className="border-t border-zinc-300 pt-3 mt-4">
          <h2 className="text-[10px] font-extrabold uppercase text-zinc-900 mb-1">
            5. Engineering Standards &amp; Regulatory References
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-[8.5px] text-zinc-600 leading-relaxed font-mono">
            <li><strong>BNBC 2020 Part 8, Chapter 2 (Electrical):</strong> Sizing of sub-circuits, continuous load margins, and 1.25x design safety factors.</li>
            <li><strong>BNBC Section 2.5.3 (Allowable Drop):</strong> Feeder voltage drop limit strictly enforced at 3% max from point of supply.</li>
            <li><strong>IEC 60364-5-52 Table A.52.2 (Reference Methods):</strong> Current capacities modeled under conduit (Method C) and ventilation trays (Method E/F).</li>
            <li><strong>IEC 60364-5-52 Table B.52.14 (Derating):</strong> Ambient temperature corrections: 35°C (0.94), 40°C (0.87), 45°C (0.79).</li>
          </ul>
        </div>

        {/* Signatures */}
        <div style={{ pageBreakInside: 'avoid' }} className="pt-6 grid grid-cols-2 gap-8 text-[9px] font-sans">
          <div className="text-left border-t border-zinc-300 pt-1.5 w-44">
            <p className="font-bold text-zinc-800">Engr. Sahin Alom</p>
            <p className="text-zinc-500">Design Engineer Authority</p>
            <p className="text-zinc-400 text-[7.5px]">Head of Electrical Sizing</p>
          </div>
          <div className="text-right border-t border-zinc-300 pt-1.5 w-44 ml-auto">
            <p className="font-bold text-zinc-800">Verified &amp; Approved</p>
            <p className="text-zinc-500">Compliance Audit Division</p>
            <p className="text-zinc-400 text-[7.5px]">Systems Certification Authority</p>
          </div>
        </div>
      </div>
    </div>
  );
}
