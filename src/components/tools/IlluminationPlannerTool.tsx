import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Zap, Layers, Sparkles, Sliders, Info, Printer, Plus, Search, 
  CheckCircle2, AlertTriangle, ShieldCheck, Sun, Grid, Calculator, HelpCircle,
  X, RotateCcw, Copy, Check, ChevronRight, FileSpreadsheet
} from 'lucide-react';
import { 
  BuildingType, RoomPreset, FixtureItem, RoomDimensions, AdvancedParams, CalculationResult 
} from './lux/types';
import { BNBC_ROOM_PRESETS, BUILDING_TYPES, calculateAutoUF } from './lux/bnbcData';
import { DEFAULT_FIXTURE_LIBRARY } from './lux/fixtureLibrary';
import { RoomGridVisualizer } from './lux/RoomGridVisualizer';
import { PrintReport } from './lux/PrintReport';

interface IlluminationPlannerToolProps {
  onBack: () => void;
}

export default function IlluminationPlannerTool({ onBack }: IlluminationPlannerToolProps) {
  // Navigation State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Building Type
  const [selectedBuildingType, setSelectedBuildingType] = useState<BuildingType>('Office');

  // Filter room options dynamically based on selected building type
  const availableRooms = useMemo(() => {
    return BNBC_ROOM_PRESETS.filter(p => p.buildingType === selectedBuildingType || p.buildingType === 'Office');
  }, [selectedBuildingType]);

  // Step 2: Room Preset Selection
  const [selectedRoomPreset, setSelectedRoomPreset] = useState<RoomPreset>(availableRooms[0] || BNBC_ROOM_PRESETS[7]);

  // Handle building type change
  const handleBuildingTypeChange = (bType: BuildingType) => {
    setSelectedBuildingType(bType);
    const rooms = BNBC_ROOM_PRESETS.filter(p => p.buildingType === bType);
    if (rooms.length > 0) {
      setSelectedRoomPreset(rooms[0]);
      setDesignLux(rooms[0].recommendedLux);
      const wpHeight = dimensions.unit === 'feet' 
        ? Number((rooms[0].standardWorkingPlaneHeight / 0.3048).toFixed(1))
        : rooms[0].standardWorkingPlaneHeight;
      setDimensions(prev => ({ ...prev, workingPlaneHeight: wpHeight }));
    }
  };

  // Step 3: Lux Selection
  const [designLux, setDesignLux] = useState<number>(selectedRoomPreset.recommendedLux);

  // When room preset changes
  const handleRoomChange = (preset: RoomPreset) => {
    setSelectedRoomPreset(preset);
    setDesignLux(preset.recommendedLux);
    const wpHeight = dimensions.unit === 'feet' 
      ? Number((preset.standardWorkingPlaneHeight / 0.3048).toFixed(1))
      : preset.standardWorkingPlaneHeight;
    setDimensions(prev => ({ ...prev, workingPlaneHeight: wpHeight }));
  };

  // Step 4: Room Dimensions (Default: Feet for Bangladesh standard)
  const [dimensions, setDimensions] = useState<RoomDimensions>({
    length: 15,
    width: 12,
    height: 10,
    workingPlaneHeight: 2.5,
    mountingHeight: 9.5,
    unit: 'feet'
  });

  // Toggle unit with precise seamless conversion
  const handleUnitToggle = (targetUnit: 'meters' | 'feet') => {
    if (dimensions.unit === targetUnit) return;
    if (targetUnit === 'meters') {
      // Feet to Meters (1 ft = 0.3048 m)
      setDimensions(prev => ({
        length: Number((prev.length * 0.3048).toFixed(2)),
        width: Number((prev.width * 0.3048).toFixed(2)),
        height: Number((prev.height * 0.3048).toFixed(2)),
        workingPlaneHeight: Number((prev.workingPlaneHeight * 0.3048).toFixed(2)),
        mountingHeight: Number((prev.mountingHeight * 0.3048).toFixed(2)),
        unit: 'meters'
      }));
    } else {
      // Meters to Feet (1 m = 3.28084 ft)
      setDimensions(prev => ({
        length: Number((prev.length / 0.3048).toFixed(1)),
        width: Number((prev.width / 0.3048).toFixed(1)),
        height: Number((prev.height / 0.3048).toFixed(1)),
        workingPlaneHeight: Number((prev.workingPlaneHeight / 0.3048).toFixed(1)),
        mountingHeight: Number((prev.mountingHeight / 0.3048).toFixed(1)),
        unit: 'feet'
      }));
    }
  };

  // Preset Bangladesh room dimension helpers
  const applyRoomSizePreset = (presetLengthFt: number, presetWidthFt: number) => {
    if (dimensions.unit === 'feet') {
      setDimensions(prev => ({
        ...prev,
        length: presetLengthFt,
        width: presetWidthFt
      }));
    } else {
      setDimensions(prev => ({
        ...prev,
        length: Number((presetLengthFt * 0.3048).toFixed(2)),
        width: Number((presetWidthFt * 0.3048).toFixed(2))
      }));
    }
  };

  // Stepper increment/decrement
  const adjustDimension = (key: keyof Omit<RoomDimensions, 'unit'>, delta: number) => {
    setDimensions(prev => {
      const currentVal = prev[key] as number;
      const newVal = Math.max(0, Number((currentVal + delta).toFixed(2)));
      return { ...prev, [key]: newVal };
    });
  };

  // Step 5: Fixture Selection & Custom Fixtures
  const [fixtureLibrary, setFixtureLibrary] = useState<FixtureItem[]>(DEFAULT_FIXTURE_LIBRARY);
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>(DEFAULT_FIXTURE_LIBRARY[0].id);
  const [fixtureSearchQuery, setFixtureSearchQuery] = useState<string>('');
  const [fixtureTypeFilter, setFixtureTypeFilter] = useState<string>('All');
  const [isCustomFixtureModalOpen, setIsCustomFixtureModalOpen] = useState<boolean>(false);

  // Custom fixture form
  const [customFixtureForm, setCustomFixtureForm] = useState<Partial<FixtureItem>>({
    manufacturer: 'Custom Brand',
    model: 'Custom LED Fixture',
    type: 'LED Panel',
    powerWatts: 40,
    lumens: 4200,
    beamAngle: 120,
    cct: 6500,
    cri: 85,
    ugr: 18,
    ipRating: 'IP20',
    lampsPerFixture: 1
  });

  const selectedFixture = useMemo(() => {
    return fixtureLibrary.find(f => f.id === selectedFixtureId) || fixtureLibrary[0];
  }, [fixtureLibrary, selectedFixtureId]);

  // Filtered Fixtures
  const filteredFixtures = useMemo(() => {
    return fixtureLibrary.filter(f => {
      const matchesSearch = 
        f.manufacturer.toLowerCase().includes(fixtureSearchQuery.toLowerCase()) ||
        f.model.toLowerCase().includes(fixtureSearchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(fixtureSearchQuery.toLowerCase());
      const matchesType = fixtureTypeFilter === 'All' || f.type === fixtureTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [fixtureLibrary, fixtureSearchQuery, fixtureTypeFilter]);

  // Step 6: Advanced Parameters
  const [advancedParams, setAdvancedParams] = useState<AdvancedParams>({
    maintenanceFactor: 0.80,
    utilizationFactor: 0.65,
    isUfAuto: true,
    reflectanceCeiling: 70,
    reflectanceWalls: 50,
    reflectanceFloor: 20,
    dailyOperatingHours: 10,
    electricityTariffBDT: 9.5
  });

  // Print Report modal trigger
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'educational'>('planner');

  // --- CALCULATION ENGINE ---
  const results: CalculationResult = useMemo(() => {
    // Convert dimensions if feet
    const L = dimensions.unit === 'feet' ? dimensions.length * 0.3048 : dimensions.length;
    const W = dimensions.unit === 'feet' ? dimensions.width * 0.3048 : dimensions.width;
    const H = dimensions.unit === 'feet' ? dimensions.height * 0.3048 : dimensions.height;
    const Hw = dimensions.unit === 'feet' ? dimensions.workingPlaneHeight * 0.3048 : dimensions.workingPlaneHeight;
    const Hm = dimensions.unit === 'feet' ? dimensions.mountingHeight * 0.3048 : dimensions.mountingHeight;

    const roomAreaM2 = L * W;
    const roomAreaSqFt = roomAreaM2 * 10.7639;

    // Effective suspension height above working plane
    const effectiveMountingHeight = Math.max(Hm - Hw, 0.5);

    // Room Index K = (L * W) / (effectiveMountingHeight * (L + W))
    const roomIndex = (L * W) / (effectiveMountingHeight * (L + W));

    // Calculate or use UF
    const uf = advancedParams.isUfAuto ? calculateAutoUF(roomIndex) : advancedParams.utilizationFactor;
    const mf = advancedParams.maintenanceFactor;

    // Total Lumens = (E * A) / (UF * MF)
    const targetLux = designLux || selectedRoomPreset.recommendedLux;
    const totalRequiredLumens = (targetLux * roomAreaM2) / Math.max(uf * mf, 0.01);

    // Fixture count raw & rounded up
    const fixtureLumens = selectedFixture.lumens * (selectedFixture.lampsPerFixture || 1);
    const rawFixtureCount = totalRequiredLumens / Math.max(fixtureLumens, 1);
    const roundedFixtureCount = Math.max(Math.ceil(rawFixtureCount), 1);

    // Achieved Lux with rounded count
    const achievedLux = Math.round((roundedFixtureCount * fixtureLumens * uf * mf) / Math.max(roomAreaM2, 0.1));
    const isLuxSufficient = achievedLux >= targetLux * 0.95;

    // Grid Rows & Columns Layout
    // Aspect Ratio L / W
    const aspectRatio = L / Math.max(W, 0.1);
    let cols = Math.round(Math.sqrt(roundedFixtureCount * aspectRatio));
    cols = Math.max(cols, 1);
    let rows = Math.ceil(roundedFixtureCount / cols);

    const spacingX = L / cols;
    const spacingY = W / rows;
    const wallOffsetX = spacingX / 2;
    const wallOffsetY = spacingY / 2;

    // Spacing to Height Ratio (SHR)
    const maxSpacing = Math.max(spacingX, spacingY);
    const spacingToHeightRatio = maxSpacing / effectiveMountingHeight;
    const isShrCompliant = spacingToHeightRatio <= 1.5;

    // Power & Energy Load
    const totalPowerWatts = roundedFixtureCount * selectedFixture.powerWatts;
    const totalPowerKW = totalPowerWatts / 1000;
    const actualLPD = totalPowerWatts / Math.max(roomAreaM2, 0.1); // W/m^2
    const isLpdCompliant = actualLPD <= selectedRoomPreset.maxAllowableLPD;

    // Monthly Electricity Cost
    const dailyKWh = totalPowerKW * advancedParams.dailyOperatingHours;
    const monthlyEnergyKWh = dailyKWh * 30;
    const monthlyCostBDT = monthlyEnergyKWh * advancedParams.electricityTariffBDT;

    return {
      roomAreaM2,
      roomAreaSqFt,
      roomIndex,
      effectiveMountingHeight,
      targetLux,
      totalRequiredLumens,
      rawFixtureCount,
      roundedFixtureCount,
      achievedLux,
      isLuxSufficient,
      totalPowerWatts,
      totalPowerKW,
      actualLPD,
      isLpdCompliant,
      gridRows: rows,
      gridCols: cols,
      spacingX,
      spacingY,
      wallOffsetX,
      wallOffsetY,
      spacingToHeightRatio,
      isShrCompliant,
      monthlyEnergyKWh,
      monthlyCostBDT
    };
  }, [
    dimensions,
    designLux,
    selectedRoomPreset,
    selectedFixture,
    advancedParams
  ]);

  // Handle Custom Fixture Submission
  const handleCreateCustomFixture = (e: React.FormEvent) => {
    e.preventDefault();
    const newFix: FixtureItem = {
      id: `custom-fix-${Date.now()}`,
      manufacturer: customFixtureForm.manufacturer || 'Custom Manufacturer',
      model: customFixtureForm.model || 'Custom Model',
      type: (customFixtureForm.type as any) || 'LED Panel',
      powerWatts: Number(customFixtureForm.powerWatts) || 40,
      lumens: Number(customFixtureForm.lumens) || 4000,
      beamAngle: Number(customFixtureForm.beamAngle) || 120,
      cct: Number(customFixtureForm.cct) || 6500,
      cri: Number(customFixtureForm.cri) || 80,
      ugr: Number(customFixtureForm.ugr) || 19,
      ipRating: customFixtureForm.ipRating || 'IP20',
      lampsPerFixture: Number(customFixtureForm.lampsPerFixture) || 1,
      isCustom: true
    };

    setFixtureLibrary(prev => [newFix, ...prev]);
    setSelectedFixtureId(newFix.id);
    setIsCustomFixtureModalOpen(false);
  };

  return (
    <div className="pt-8 pb-16 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 text-zinc-100 light:text-zinc-900 transition-colors">
      
      {/* FLOATING HEADER & BACK BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-900 light:border-zinc-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded-xl border border-zinc-800 transition-all cursor-pointer"
              title="Return to Tools"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  BNBC 2020 Part VIII
                </span>
                <span className="text-xs font-mono text-zinc-400">Illumination Engineering Suite</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight mt-0.5">
                Illumination Sizing & Lux Planner
              </h1>
            </div>
          </div>

          {/* RIGHT TOP ACTIONS */}
          <div className="flex items-center space-x-3">
            <div className="flex bg-zinc-900/80 light:bg-zinc-100 p-1 rounded-xl border border-zinc-800 light:border-zinc-300">
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'planner'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 light:text-zinc-600'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Planner Workspace</span>
              </button>
              <button
                onClick={() => setActiveTab('educational')}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'educational'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 light:text-zinc-600'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Lumen Guide (বাংলায়)</span>
              </button>
            </div>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF / Report</span>
            </button>
          </div>
        </div>

        {activeTab === 'planner' ? (
          /* ================= PLANNER WORKSPACE ================= */
          <div className="space-y-6">
            
            {/* STEPPER CONTROL BAR & VIEW MODE SWITCHER */}
            <div className="bg-zinc-900/60 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-zinc-800 light:border-zinc-200">
                
                {/* STEP PROGRESS SUMMARY */}
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 font-mono font-bold text-sm flex items-center justify-center shadow-lg">
                    {currentStep}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-amber-400 light:text-amber-600">
                        ধাপ {currentStep} / ৫ ({currentStep * 20}%)
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs font-mono text-zinc-400">
                        {currentStep === 1 && 'স্পেস ও লাক্স নির্ধারণ (Space & Lux)'}
                        {currentStep === 2 && 'রুমের সাইজ ও উচ্চতা (Size & Height)'}
                        {currentStep === 3 && 'লাইটিং ফিক্সচার নির্বাচন (Fixture Selection)'}
                        {currentStep === 4 && 'পরিবেশ ও বিদ্যুতের ট্যারিফ (Environment & Tariff)'}
                        {currentStep === 5 && 'পূর্ণাঙ্গ ফলাফল ও ৩ডি প্ল্যান (Results & 3D Plan)'}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-zinc-100 light:text-zinc-900">
                      {currentStep === 1 && '১. ভবন ও রুমের ধরন সিলেক্ট করুন'}
                      {currentStep === 2 && '২. রুমের দৈর্ঘ্য, প্রস্থ ও ছাদের উচ্চতা দিন'}
                      {currentStep === 3 && '৩. আপনার পছন্দমতো লাইট বাল্ব / ফিক্সচার বাছাই করুন'}
                      {currentStep === 4 && '৪. দেয়াল/ছাদের রঙ ও প্রতি ইউনিট বিদ্যুৎ বিল নির্ধারণ করুন'}
                      {currentStep === 5 && '৫. লাইটিং গ্রিড লেআউট, ৩ডি ডায়ালুক্স স্টাইল সিমুলেশন ও রিপোর্ট'}
                    </h2>
                  </div>
                </div>

                {/* DIRECT RESULTS BUTTON */}
                {currentStep < 5 && (
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 self-start md:self-auto"
                  >
                    <span>ফলাফল দেখুন →</span>
                  </button>
                )}

              </div>

              {/* INTERACTIVE STEP PILLS HEADER */}
              <div className="grid grid-cols-5 gap-1.5 mt-3">
                {[
                  { num: 1, label: "১. স্পেস ও লাক্স" },
                  { num: 2, label: "২. রুমের মাপ" },
                  { num: 3, label: "৩. লাইট ফিক্সচার" },
                  { num: 4, label: "৪. পরিবেশ ও বিল" },
                  { num: 5, label: "৫. ফলাফল ও ৩ডি" },
                ].map(step => (
                  <button
                    key={step.num}
                    onClick={() => setCurrentStep(step.num)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      currentStep === step.num
                        ? 'bg-amber-500 text-zinc-950 font-bold border-amber-500 shadow-md'
                        : currentStep > step.num
                        ? 'bg-zinc-900 light:bg-zinc-100 border-emerald-500/40 text-emerald-400 light:text-emerald-700 font-medium'
                        : 'bg-zinc-950/40 light:bg-zinc-50 border-zinc-800 light:border-zinc-200 text-zinc-400 light:text-zinc-600'
                    }`}
                  >
                    <div className="text-[11px] font-mono truncate">
                      {currentStep > step.num ? `✓ ${step.label}` : step.label}
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* MAIN WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: ACTIVE STEP PANEL */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* STEP 1: BUILDING TYPE & ROOM DESIGNATION */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold flex items-center justify-center">
                            1
                          </span>
                          <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                            Step 1: Select Building Category
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">BNBC Building Code</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {BUILDING_TYPES.map(bType => (
                          <button
                            key={bType}
                            onClick={() => handleBuildingTypeChange(bType)}
                            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer ${
                              selectedBuildingType === bType
                                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md scale-105'
                                : 'bg-zinc-950/60 light:bg-zinc-100 text-zinc-400 hover:text-zinc-200 light:text-zinc-700 border border-zinc-800 light:border-zinc-200'
                            }`}
                          >
                            {bType}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* STEP 1 PART 2: ROOM TYPE & AUTO LUX SELECTION */}
                    <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                      Step 2 & 3: Room Type & BNBC Lux Auto-Selection
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 font-semibold">{selectedRoomPreset.bnbcClause}</span>
                </div>

                {/* ROOM DROPDOWN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Select Room Designation:</label>
                    <select
                      value={selectedRoomPreset.id}
                      onChange={e => {
                        const found = BNBC_ROOM_PRESETS.find(r => r.id === e.target.value);
                        if (found) handleRoomChange(found);
                      }}
                      className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-2 text-xs font-medium text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-amber-500"
                    >
                      {availableRooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.roomName} ({room.roomNameBn}) — {room.recommendedLux} Lux
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Design Target Lux (Editable Override):</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="20"
                        max="5000"
                        value={designLux}
                        onChange={e => setDesignLux(Number(e.target.value))}
                        className="w-full bg-zinc-950 light:bg-zinc-100 border border-amber-500/40 light:border-amber-500 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 light:text-amber-600 focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-2 text-xs font-mono text-zinc-500">Lux</span>
                    </div>
                  </div>
                </div>

                {/* LUX BENCHMARK SUMMARY BADGES */}
                <div className="p-3 bg-zinc-950/60 light:bg-zinc-50 rounded-xl border border-zinc-800/80 light:border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block">Recommended (BNBC):</span>
                    <strong className="text-emerald-400 font-mono">{selectedRoomPreset.recommendedLux} Lux</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block">Minimum Allowed:</span>
                    <strong className="text-amber-400 font-mono">{selectedRoomPreset.minLux} Lux</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block">Max Allowable LPD:</span>
                    <strong className="text-zinc-200 font-mono">{selectedRoomPreset.maxAllowableLPD} W/m²</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block">Std Work Plane Desk:</span>
                    <strong className="text-zinc-200 font-mono">{selectedRoomPreset.standardWorkingPlaneHeight}m</strong>
                  </div>
                </div>

                {/* STEP NAVIGATION FOOTER */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 flex items-center justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: রুমের মাপ →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

            {/* STEP 2: ROOM DIMENSIONS & MOUNTING HEIGHT */}
            {currentStep === 2 && (
              <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl space-y-4">
                
                {/* HEADER & UNIT SELECTOR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 light:border-zinc-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900 flex items-center gap-1.5">
                        <Grid className="w-4 h-4 text-amber-500" /> Step 4: Room Dimensions & Mounting Height
                      </h2>
                      <p className="text-[11px] text-zinc-400 light:text-zinc-500">
                        রুমের সাইজ ও মাউন্টিং হাইট নির্ধারণ করুন (বাংলাদেশে ফিট একক প্রচলিত)
                      </p>
                    </div>
                  </div>

                  {/* UNIT TOGGLE SWITCH */}
                  <div className="flex items-center space-x-1.5 bg-zinc-950 light:bg-zinc-100 p-1 rounded-xl border border-zinc-800 light:border-zinc-300 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('feet')}
                      className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        dimensions.unit === 'feet'
                          ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                          : 'text-zinc-400 light:text-zinc-600 hover:text-zinc-200'
                      }`}
                    >
                      Feet (ft) <span className="text-[9px] opacity-75 font-normal">(BD Std)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('meters')}
                      className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        dimensions.unit === 'meters'
                          ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                          : 'text-zinc-400 light:text-zinc-600 hover:text-zinc-200'
                      }`}
                    >
                      Meters (m)
                    </button>
                  </div>
                </div>

                {/* QUICK ROOM PRESET BADGES */}
                <div>
                  <div className="text-[11px] font-mono text-zinc-400 light:text-zinc-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> দ্রুত রুমের সাইজ সিলেক্ট করুন (Quick BD Presets):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "12' × 10' (ছোট রুম)", l: 12, w: 10 },
                      { name: "15' × 12' (স্ট্যান্ডার্ড অফিস)", l: 15, w: 12 },
                      { name: "20' × 15' (কনফারেন্স / ল্যাব)", l: 20, w: 15 },
                      { name: "30' × 20' (বড় হল / শোরুম)", l: 30, w: 20 },
                      { name: "50' × 30' (ফ্যাক্টরি / গুদাম)", l: 50, w: 30 },
                    ].map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => applyRoomSizePreset(p.l, p.w)}
                        className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 text-zinc-300 light:text-zinc-800 hover:border-amber-500/50 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* INTERACTIVE INPUT CONTROLS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  
                  {/* LENGTH (L) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        দৈর্ঘ্য / Length (L)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.length * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.length / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => adjustDimension('length', dimensions.unit === 'feet' ? -0.5 : -0.2)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                        min="1"
                        value={dimensions.length}
                        onChange={e => setDimensions(p => ({ ...p, length: Math.max(0.1, Number(e.target.value)) }))}
                        className="flex-1 bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-zinc-100 light:text-zinc-900 text-center focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => adjustDimension('length', dimensions.unit === 'feet' ? 0.5 : 0.2)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        +
                      </button>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold w-6">
                        {dimensions.unit === 'feet' ? 'ft' : 'm'}
                      </span>
                    </div>
                  </div>

                  {/* WIDTH (W) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        প্রস্থ / Width (W)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.width * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.width / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => adjustDimension('width', dimensions.unit === 'feet' ? -0.5 : -0.2)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                        min="1"
                        value={dimensions.width}
                        onChange={e => setDimensions(p => ({ ...p, width: Math.max(0.1, Number(e.target.value)) }))}
                        className="flex-1 bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-zinc-100 light:text-zinc-900 text-center focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => adjustDimension('width', dimensions.unit === 'feet' ? 0.5 : 0.2)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        +
                      </button>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold w-6">
                        {dimensions.unit === 'feet' ? 'ft' : 'm'}
                      </span>
                    </div>
                  </div>

                  {/* TOTAL HEIGHT (H) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        ছাদের উচ্চতা / Ceiling Height (H)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.height * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.height / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => adjustDimension('height', dimensions.unit === 'feet' ? -0.5 : -0.1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                        min="1"
                        value={dimensions.height}
                        onChange={e => setDimensions(p => ({ ...p, height: Math.max(0.1, Number(e.target.value)) }))}
                        className="flex-1 bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-zinc-100 light:text-zinc-900 text-center focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => adjustDimension('height', dimensions.unit === 'feet' ? 0.5 : 0.1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        +
                      </button>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold w-6">
                        {dimensions.unit === 'feet' ? 'ft' : 'm'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 light:text-zinc-500 block">
                      মেঝে থেকে সিলিং পর্যন্ত মোট উচ্চতা
                    </span>
                  </div>

                  {/* WORK PLANE HEIGHT (hw) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        কাজের তলের উচ্চতা / Work Plane (hw)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.workingPlaneHeight * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.workingPlaneHeight / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => adjustDimension('workingPlaneHeight', dimensions.unit === 'feet' ? -0.25 : -0.1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={dimensions.unit === 'feet' ? '0.25' : '0.05'}
                        min="0"
                        value={dimensions.workingPlaneHeight}
                        onChange={e => setDimensions(p => ({ ...p, workingPlaneHeight: Math.max(0, Number(e.target.value)) }))}
                        className="flex-1 bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-zinc-100 light:text-zinc-900 text-center focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => adjustDimension('workingPlaneHeight', dimensions.unit === 'feet' ? 0.25 : 0.1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        +
                      </button>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold w-6">
                        {dimensions.unit === 'feet' ? 'ft' : 'm'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 light:text-zinc-500 block">
                      ডেস্ক বা টেবিলের উচ্চতা (২.৫ ফিট std)
                    </span>
                  </div>

                  {/* MOUNTING HEIGHT (hm) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        লাইটের উচ্চতা / Mounting Height (hm)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.mountingHeight * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.mountingHeight / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => adjustDimension('mountingHeight', dimensions.unit === 'feet' ? -0.5 : -0.1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                        min="0.5"
                        value={dimensions.mountingHeight}
                        onChange={e => setDimensions(p => ({ ...p, mountingHeight: Math.max(0.1, Number(e.target.value)) }))}
                        className="flex-1 bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-zinc-100 light:text-zinc-900 text-center focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => adjustDimension('mountingHeight', dimensions.unit === 'feet' ? 0.5 : 0.1)}
                        className="w-8 h-8 rounded-lg bg-zinc-800 light:bg-zinc-200 hover:bg-zinc-700 text-zinc-200 light:text-zinc-800 font-mono font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      >
                        +
                      </button>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold w-6">
                        {dimensions.unit === 'feet' ? 'ft' : 'm'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 light:text-zinc-500 block">
                      মেঝে থেকে লাইট পর্যন্ত ঝোলানো উচ্চতা
                    </span>
                  </div>

                  {/* AREA SUMMARY & DUAL UNIT DISPLAY */}
                  <div className="bg-amber-500/10 light:bg-amber-50 border border-amber-500/30 light:border-amber-200 rounded-xl p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-500 light:text-amber-700 font-bold block">
                        রুমের মোট ক্ষেত্রফল (Floor Area)
                      </span>
                      <div className="text-xl font-mono font-black text-amber-400 light:text-amber-800 mt-1">
                        {results.roomAreaSqFt.toFixed(1)} <span className="text-xs font-semibold text-zinc-400 light:text-zinc-600">sq.ft</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-medium">
                        (= {results.roomAreaM2.toFixed(2)} m²)
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-amber-400/80 light:text-amber-800 border-t border-amber-500/20 pt-1.5">
                      Room Index (K): <strong>{results.roomIndex.toFixed(2)}</strong>
                    </div>
                  </div>

                </div>

                {/* INTERACTIVE ELEVATION / HEIGHT PROFILE DIAGRAM */}
                <div className="mt-4 pt-3 border-t border-zinc-800 light:border-zinc-200 bg-zinc-950/80 light:bg-zinc-50 rounded-2xl p-4 border border-zinc-800/80 light:border-zinc-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 light:text-amber-700 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> কাজের তলের কার্যকর উচ্চতা ডায়াগ্রাম (BNBC Vertical Height Profile)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 light:text-zinc-500">
                      Effective Cavity Height ($h_r$) Diagram
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* SVG Graphic */}
                    <div className="md:col-span-7 bg-zinc-900 light:bg-white rounded-xl p-3 border border-zinc-800 light:border-zinc-300 relative overflow-hidden flex justify-center">
                      <svg width="100%" height="180" viewBox="0 0 320 180" className="max-w-md">
                        {/* Background grid */}
                        <defs>
                          <pattern id="diag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" className="text-zinc-800/30 light:text-zinc-200" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="320" height="180" fill="url(#diag-grid)" />

                        {/* Ceiling line */}
                        <line x1="20" y1="20" x2="300" y2="20" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 2" />
                        <text x="25" y="15" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          ছাদ (Ceiling H = {dimensions.height} {dimensions.unit === 'feet' ? 'ft' : 'm'})
                        </text>

                        {/* Light Fixture line & glow */}
                        {(() => {
                          const maxH = Math.max(dimensions.height, 1);
                          const yCeiling = 20;
                          const yFloor = 160;
                          const usableH = yFloor - yCeiling;

                          const yMount = Math.min(yFloor - 5, Math.max(yCeiling + 5, yFloor - (dimensions.mountingHeight / maxH) * usableH));
                          const yWork = Math.min(yFloor - 2, Math.max(yCeiling + 10, yFloor - (dimensions.workingPlaneHeight / maxH) * usableH));

                          return (
                            <>
                              {/* Light Cone beam */}
                              <polygon
                                points={`160,${yMount} 80,${yWork} 240,${yWork}`}
                                fill="url(#lightBeamGrad)"
                                opacity="0.6"
                              />
                              <defs>
                                <linearGradient id="lightBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                                </linearGradient>
                              </defs>

                              {/* Fixture icon at yMount */}
                              <rect x="140" y={yMount - 6} width="40" height="8" rx="2" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
                              <text x="185" y={yMount + 3} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                Light (hm = {dimensions.mountingHeight} {dimensions.unit === 'feet' ? 'ft' : 'm'})
                              </text>

                              {/* Work plane desk line */}
                              <line x1="40" y1={yWork} x2="280" y2={yWork} stroke="#10b981" strokeWidth="2.5" />
                              <text x="45" y={yWork - 5} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                কাজের তল / Desk (hw = {dimensions.workingPlaneHeight} {dimensions.unit === 'feet' ? 'ft' : 'm'})
                              </text>

                              {/* Floor line */}
                              <line x1="20" y1={yFloor} x2="300" y2={yFloor} stroke="#71717a" strokeWidth="3" />
                              <text x="25" y={yFloor + 12} fill="#71717a" fontSize="9" fontFamily="monospace">
                                মেঝে (Floor = 0.0)
                              </text>

                              {/* Effective Cavity Height Arrow (hr = hm - hw) */}
                              <line x1="30" y1={yMount} x2="30" y2={yWork} stroke="#3b82f6" strokeWidth="2" />
                              <polygon points={`30,${yMount} 27,${yMount + 6} 33,${yMount + 6}`} fill="#3b82f6" />
                              <polygon points={`30,${yWork} 27,${yWork - 6} 33,${yWork - 6}`} fill="#3b82f6" />
                              <text x="35" y={(yMount + yWork) / 2 + 3} fill="#60a5fa" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                hr = {results.effectiveMountingHeight.toFixed(2)} m
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>

                    {/* Explanatory text & formula badges */}
                    <div className="md:col-span-5 space-y-2 text-xs font-mono">
                      <div className="p-2.5 bg-zinc-900 light:bg-white rounded-xl border border-zinc-800 light:border-zinc-300 space-y-1">
                        <span className="text-[10px] text-zinc-400 light:text-zinc-600 block uppercase font-bold">
                          BNBC কার্যকর ঝুলন্ত উচ্চতা (Effective Height $h_r$):
                        </span>
                        <div className="text-sm font-bold text-blue-400 light:text-blue-700">
                          hr = hm - hw = {(results.effectiveMountingHeight * (dimensions.unit === 'feet' ? 3.28084 : 1)).toFixed(2)} {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </div>
                        <p className="text-[10px] text-zinc-400 light:text-zinc-600 font-sans">
                          আলোর বিম ডেস্কে এসে পৌঁছানোর কার্যকর দূরত্ব। সকল রুম ইনডেক্স ও লাক্স গণনা এই $h_r$ এর ওপর নির্ভর করে।
                        </p>
                      </div>

                      {/* Warnings if mounting height invalid */}
                      {dimensions.mountingHeight > dimensions.height && (
                        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-[11px] text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          সতর্কতা: লাইটের উচ্চতা ছাদের মোট উচ্চতার চেয়ে বেশি!
                        </div>
                      )}

                      {dimensions.workingPlaneHeight >= dimensions.mountingHeight && (
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          সতর্কতা: কাজের তলের উচ্চতা লাইটের উচ্চতার চেয়ে কম হতে হবে!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STEP NAVIGATION FOOTER */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    ← পূর্ববর্তী ধাপ
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: লাইটিং ফিক্সচার →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: FIXTURE SELECTION */}
            {currentStep === 3 && (
              <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                      Step 5: Search & Select Light Fixture
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsCustomFixtureModalOpen(true)}
                    className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom Fixture</span>
                  </button>
                </div>

                {/* SEARCH & CATEGORY FILTERS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search Super Star, Philips, Osram, LED Panel..."
                      value={fixtureSearchQuery}
                      onChange={e => setFixtureSearchQuery(e.target.value)}
                      className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={fixtureTypeFilter}
                    onChange={e => setFixtureTypeFilter(e.target.value)}
                    className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="All">All Types (Panels, Downlights, High Bays...)</option>
                    <option value="LED Panel">LED Panels (600x600, 2x2)</option>
                    <option value="Downlight">Recessed / COB Downlights</option>
                    <option value="High Bay">Industrial High Bays</option>
                    <option value="Tube">T8/T5 Tubes & Battens</option>
                    <option value="Flood Light">Flood Lights</option>
                  </select>
                </div>

                {/* FIXTURE GRID SELECTOR */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredFixtures.map(fix => (
                    <div
                      key={fix.id}
                      onClick={() => setSelectedFixtureId(fix.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedFixtureId === fix.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md'
                          : 'bg-zinc-950/40 hover:bg-zinc-950 light:bg-zinc-50 border-zinc-800/80 light:border-zinc-200 text-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-zinc-100 light:text-zinc-900">{fix.model}</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-zinc-800 text-zinc-400 rounded">
                            {fix.manufacturer}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                          {fix.type} • {fix.powerWatts}W • {fix.lumens} Lumens • Beam: {fix.beamAngle}° • {fix.cct}K • CRI &gt; {fix.cri}
                        </p>
                      </div>

                      <div className="text-right font-mono text-xs font-bold text-amber-400">
                        {fix.lumens} lm
                      </div>
                    </div>
                  ))}
                </div>

                {/* STEP NAVIGATION FOOTER */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    ← পূর্ববর্তী ধাপ
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: পরিবেশ ও বিল →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 4: ADVANCED PARAMETERS (UF & MF) */}
            {currentStep === 4 && (
              <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono text-xs font-bold flex items-center justify-center">
                      5
                    </span>
                    <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                      Step 6: Maintenance (MF) & Utilization (UF) Factors
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Photometric Losses</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-zinc-400">Maintenance Factor (MF):</label>
                      <span className="font-mono font-bold text-xs text-amber-400">{advancedParams.maintenanceFactor}</span>
                    </div>
                    <input
                      type="range"
                      min="0.50"
                      max="0.95"
                      step="0.05"
                      value={advancedParams.maintenanceFactor}
                      onChange={e => setAdvancedParams(p => ({ ...p, maintenanceFactor: Number(e.target.value) }))}
                      className="w-full accent-amber-500 bg-zinc-800"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      0.80 Clean Office • 0.70 Medium Industrial • 0.60 Dusty Environment
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-zinc-400">Utilization Factor (UF):</label>
                      <span className="font-mono font-bold text-xs text-amber-400">{results.roomIndex ? calculateAutoUF(results.roomIndex).toFixed(2) : advancedParams.utilizationFactor}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-1.5 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={advancedParams.isUfAuto}
                          onChange={e => setAdvancedParams(p => ({ ...p, isUfAuto: e.target.checked }))}
                          className="rounded accent-amber-500 bg-zinc-800"
                        />
                        <span className="font-mono text-[11px]">Auto (Room Index K={results.roomIndex.toFixed(2)})</span>
                      </label>
                    </div>

                    {!advancedParams.isUfAuto && (
                      <input
                        type="number"
                        step="0.02"
                        min="0.2"
                        max="0.9"
                        value={advancedParams.utilizationFactor}
                        onChange={e => setAdvancedParams(p => ({ ...p, utilizationFactor: Number(e.target.value) }))}
                        className="w-full mt-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1 text-xs font-mono text-amber-400"
                      />
                    )}
                  </div>
                </div>

                {/* STEP NAVIGATION FOOTER */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    ← পূর্ববর্তী ধাপ
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: ফলাফল ও ৩ডি প্ল্যান →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STEP 5: FULL RESULTS & 3D VISUALIZER */}
            {currentStep === 5 && (
              <div className="space-y-6">
                
                {/* RESULTS SUMMARY CARD */}
                <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 light:border-zinc-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 font-mono text-xs font-bold flex items-center justify-center shadow-md">
                        5
                      </span>
                      <div>
                        <h2 className="font-bold text-sm sm:text-base text-zinc-100 light:text-zinc-900">
                          Step 5: গণনা ফলাফল ও লাইটিং লেআউট (Calculation Results)
                        </h2>
                        <p className="text-[11px] text-zinc-400">BNBC ২০২০ ম্যানুফ্যাকচারার টেস্টে পাস ও লাইট লেআউট</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPrintModalOpen(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> PDF রিপোর্ট প্রিন্ট
                    </button>
                  </div>

                  {/* METRICS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">প্রয়োজনীয় লাইট সংখ্যা</span>
                      <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                        {results.roundedFixtureCount} <span className="text-xs font-normal">টি</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        ({results.gridCols} কলাম × {results.gridRows} সারিতে)
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">প্রাপ্ত লাক্স (Achieved Lux)</span>
                      <div className={`text-3xl font-mono font-black mt-1 ${results.isLuxSufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {results.achievedLux} <span className="text-xs font-normal">Lux</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        টার্গেট: {results.targetLux} Lux
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">মোট বিদ্যুৎ লোড</span>
                      <div className="text-3xl font-mono font-black text-zinc-100 light:text-zinc-900 mt-1">
                        {results.totalPowerWatts} <span className="text-xs font-normal">W</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        LPD: {results.actualLPD.toFixed(1)} W/m²
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">মাসিক বিদ্যুৎ বিল</span>
                      <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                        ৳ {Math.round(results.monthlyCostBDT).toLocaleString('bn-BD')}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        ({advancedParams.dailyOperatingHours} ঘন্টা/দিন)
                      </span>
                    </div>

                  </div>

                  {/* PREVIOUS STEP BUTTON */}
                  <div className="pt-3 border-t border-zinc-800 light:border-zinc-200">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ← পূর্ববর্তী ধাপ (পরিবেশ ও বিল)
                    </button>
                  </div>

                </div>

                {/* 2D/3D VISUALIZER */}
                <RoomGridVisualizer
                  dimensions={dimensions}
                  fixture={selectedFixture}
                  result={results}
                  roomName={selectedRoomPreset.roomName}
                />

              </div>
            )}

          </div>

          {/* RIGHT COLUMN: SWITCHES BETWEEN ALL-IN-ONE (5 COLS) AND WIZARD PREVIEW (4 COLS) */}
          {viewMode === 'all' ? (
              <div className="lg:col-span-5 space-y-6">
                
                {/* PRIMARY CALCULATION HERO CARD */}
                <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 light:from-white light:via-amber-500/5 light:to-amber-500/10 border-2 border-amber-500/40 light:border-amber-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-zinc-800 light:border-amber-500/20 pb-3 mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 light:text-amber-600 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Lumen Method Output
                    </span>
                    <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500/20 light:bg-amber-500/15 text-amber-300 light:text-amber-700 rounded-full border border-amber-500/30">
                      BNBC 2020 Compliant
                    </span>
                  </div>

                  {/* NUMBER OF FIXTURES (BIG STAT) */}
                  <div className="text-center py-4 bg-zinc-950/80 light:bg-white/80 rounded-2xl border border-zinc-800 light:border-amber-500/30 shadow-inner mb-5">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 light:text-zinc-600 tracking-wider">Required Light Fixtures</span>
                    <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400 light:text-amber-600 mt-1">
                      {results.roundedFixtureCount} <span className="text-sm font-normal text-zinc-400 light:text-zinc-600">Fixtures</span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400 light:text-zinc-500 mt-1">
                      Raw Formula: {results.rawFixtureCount.toFixed(2)} → Round-Up ({results.gridRows} Rows × {results.gridCols} Cols)
                    </p>
                  </div>

                  {/* SUMMARY STATS GRID */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-950/50 light:bg-white rounded-xl border border-zinc-800 light:border-zinc-200 shadow-sm">
                      <span className="text-[10px] font-mono text-zinc-400 light:text-zinc-500 block">Achieved Lux:</span>
                      <strong className={`text-base font-mono font-bold ${results.isLuxSufficient ? 'text-emerald-400 light:text-emerald-600' : 'text-amber-400 light:text-amber-600'}`}>
                        {results.achievedLux} Lux
                      </strong>
                      <span className="text-[9px] text-zinc-500 light:text-zinc-500 block">Target: {results.targetLux} Lux</span>
                    </div>

                    <div className="p-3 bg-zinc-950/50 light:bg-white rounded-xl border border-zinc-800 light:border-zinc-200 shadow-sm">
                      <span className="text-[10px] font-mono text-zinc-400 light:text-zinc-500 block">Total Power Load:</span>
                      <strong className="text-base font-mono font-bold text-zinc-100 light:text-zinc-900">
                        {results.totalPowerWatts} W <span className="text-xs font-normal text-zinc-400 light:text-zinc-600">({results.totalPowerKW.toFixed(2)} kW)</span>
                      </strong>
                      <span className="text-[9px] text-zinc-500 light:text-zinc-500 block">Energy Load</span>
                    </div>

                    <div className="p-3 bg-zinc-950/50 light:bg-white rounded-xl border border-zinc-800 light:border-zinc-200 shadow-sm">
                      <span className="text-[10px] font-mono text-zinc-400 light:text-zinc-500 block">Lighting Power Density (LPD):</span>
                      <strong className={`text-sm font-mono font-bold ${results.isLpdCompliant ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'}`}>
                        {results.actualLPD.toFixed(2)} W/m²
                      </strong>
                      <span className="text-[9px] text-zinc-500 light:text-zinc-500 block">Limit: {selectedRoomPreset.maxAllowableLPD} W/m²</span>
                    </div>

                    <div className="p-3 bg-zinc-950/50 light:bg-white rounded-xl border border-zinc-800 light:border-zinc-200 shadow-sm">
                      <span className="text-[10px] font-mono text-zinc-400 light:text-zinc-500 block">Est. Monthly Bill:</span>
                      <strong className="text-sm font-mono font-bold text-amber-400 light:text-amber-600">
                        ৳ {Math.round(results.monthlyCostBDT).toLocaleString('bn-BD')} BDT
                      </strong>
                      <span className="text-[9px] text-zinc-500 light:text-zinc-500 block">{advancedParams.dailyOperatingHours} hrs/day @ ৳{advancedParams.electricityTariffBDT}/kWh</span>
                    </div>
                  </div>

                  {/* COMPLIANCE CHECK BADGES */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 light:border-zinc-200 space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-emerald-400 light:text-emerald-600">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Illuminance Level ({results.achievedLux} Lux)
                      </span>
                      <strong>{results.isLuxSufficient ? 'PASS' : 'MARGINAL'}</strong>
                    </div>

                    <div className={`flex items-center justify-between ${results.isShrCompliant ? 'text-emerald-400 light:text-emerald-600' : 'text-amber-400 light:text-amber-600'}`}>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Spacing-to-Height Ratio (SHR={results.spacingToHeightRatio.toFixed(2)})
                      </span>
                      <strong>{results.isShrCompliant ? 'UNIFORM' : 'HIGH SHR'}</strong>
                    </div>

                    <div className={`flex items-center justify-between ${results.isLpdCompliant ? 'text-emerald-400 light:text-emerald-600' : 'text-rose-400 light:text-rose-600'}`}>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> BNBC Energy Conservation Code
                      </span>
                      <strong>{results.isLpdCompliant ? 'COMPLIANT' : 'EXCEEDED'}</strong>
                    </div>
                  </div>

                </div>

                {/* INTERACTIVE 2D/3D ROOM VISUALIZER */}
                <RoomGridVisualizer
                  dimensions={dimensions}
                  fixture={selectedFixture}
                  result={results}
                  roomName={selectedRoomPreset.roomName}
                />

              </div>
            ) : (
              /* WIZARD MODE: 4 COLS DESKTOP LIVE PREVIEW SIDEBAR */
              <div className="hidden lg:block lg:col-span-4 sticky top-6 space-y-4">
                <div className="bg-zinc-900/80 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-4 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 light:border-zinc-200 pb-2.5">
                    <span className="text-xs font-mono font-bold text-amber-400 light:text-amber-600 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> লাইভ সামারি (Live Preview)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                      লাইভ
                    </span>
                  </div>

                  {/* QUICK FIXTURE COUNT */}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">মোট লাইট লাগবে:</span>
                    <div className="text-3xl font-mono font-black text-amber-400 mt-0.5">
                      {results.roundedFixtureCount} <span className="text-sm font-bold text-zinc-300">টি</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-300 block mt-1">
                      লেআউট: <strong>{results.gridCols}টি</strong> কলাম × <strong>{results.gridRows}টি</strong> সারি
                    </span>
                  </div>

                  {/* LUX STATUS */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">টার্গেট লাক্স:</span>
                      <strong className="text-amber-400">{results.targetLux} Lux</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">প্রাপ্ত লাক্স:</span>
                      <strong className={results.isLuxSufficient ? 'text-emerald-400' : 'text-rose-400'}>
                        {results.achievedLux} Lux {results.isLuxSufficient ? '✓' : '⚠️'}
                      </strong>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full transition-all ${results.isLuxSufficient ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (results.achievedLux / results.targetLux) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* POWER & COST */}
                  <div className="pt-2 border-t border-zinc-800 light:border-zinc-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-zinc-950 light:bg-zinc-50 p-2 rounded-lg border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">মোট ওয়াট:</span>
                      <strong className="text-zinc-200">{results.totalPowerWatts} W</strong>
                    </div>
                    <div className="bg-zinc-950 light:bg-zinc-50 p-2 rounded-lg border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">মাসিক বিল:</span>
                      <strong className="text-amber-400">৳{Math.round(results.monthlyCostBDT)}</strong>
                    </div>
                  </div>

                  {/* MINI 2D GRID PREVIEW */}
                  <div className="pt-2 border-t border-zinc-800 light:border-zinc-200">
                    <span className="text-[10px] font-mono text-zinc-400 block mb-1.5 font-bold">
                      লাইটিং গ্রিড মিনি রিভিউ ({results.gridCols} × {results.gridRows}):
                    </span>
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 aspect-video flex items-center justify-center relative overflow-hidden">
                      <div
                        className="grid gap-2 w-full h-full p-2 border border-amber-500/30 rounded bg-zinc-900/50"
                        style={{
                          gridTemplateColumns: `repeat(${results.gridCols}, minmax(0, 1fr))`,
                          gridTemplateRows: `repeat(${results.gridRows}, minmax(0, 1fr))`
                        }}
                      >
                        {Array.from({ length: results.roundedFixtureCount }).map((_, idx) => (
                          <div
                            key={idx}
                            className="bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] border border-amber-200 flex items-center justify-center text-[8px] font-bold text-zinc-950"
                          >
                            💡
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* JUMP TO STEP 5 BUTTON */}
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>৩ডি প্ল্যান ও রিপোর্ট দেখুন (Step 5)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            )}

          </div>

          {/* MOBILE FLOATING STICKY BOTTOM DRAWER */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 light:bg-white/95 backdrop-blur-md border-t border-amber-500/30 p-3 shadow-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">প্রয়োজনীয় লাইট:</span>
              <div className="text-base font-mono font-black text-amber-400">
                {results.roundedFixtureCount} টি <span className="text-xs font-normal text-zinc-400">({results.achievedLux} Lux)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                  className="px-3 py-2 bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  ← পূর্ববর্তী
                </button>
              )}
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(p => Math.min(5, p + 1))}
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1 cursor-pointer"
                >
                  <span>পরবর্তী (ধাপ {currentStep + 1}) →</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>রিপোর্ট প্রিন্ট</span>
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ================= EDUCATIONAL LUMEN METHOD GUIDE ================= */
          /* ================= EDUCATIONAL LUMEN METHOD GUIDE ================= */
          <div className="max-w-4xl mx-auto bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-left space-y-6 leading-relaxed">
            
            <div className="border-b border-zinc-800 pb-4">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                BNBC 2020 Part VIII Chapter 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-100 light:text-zinc-900 mt-2">
                Chapter 3: Lumen Method – কতগুলো Light লাগবে? Step-by-Step Calculation শিখুন
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Author: Engr. Sahin Alom • BNBC Lighting Design Guide Series
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 light:text-zinc-700">
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                <h3 className="font-bold text-sm mb-1">Lumen Method Formula:</h3>
                <p className="font-mono text-sm font-bold">
                  N = (E × A) / (F × UF × MF)
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-xs text-amber-200">
                  <li><strong>N</strong> = Required Number of Light Fixtures (লাইটের সংখ্যা)</li>
                  <li><strong>E</strong> = Required Illuminance in Lux (BNBC লাক্স মান)</li>
                  <li><strong>A</strong> = Room Area in m² (দৈর্ঘ্য × প্রস্থ)</li>
                  <li><strong>F</strong> = Lumen Output of One Fixture (একটি লাইটের লুমেন)</li>
                  <li><strong>UF</strong> = Utilization Factor (ইউটিলাইজেশন ফ্যাক্টর)</li>
                  <li><strong>MF</strong> = Maintenance Factor (মেইনটেন্যান্স ফ্যাক্টর)</li>
                </ul>
              </div>

              <h3 className="font-bold text-base text-zinc-100 light:text-zinc-900 border-b border-zinc-800 pb-1">
                Lumen (lm) এবং Lux (lx)-এর মধ্যে সুনির্দিষ্ট পার্থক্য
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
                <div className="p-3 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl">
                  <strong className="text-amber-400 light:text-amber-600 font-mono block">Lumen (lm):</strong>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1">
                    একটি লাইট বাল্ব থেকে প্রতি সেকেন্ডে চারদিকে উৎপন্ন মোট আলোর পরিমাণ। (যেমন: 40W LED Panel = 3600 Lumens)।
                  </p>
                </div>

                <div className="p-3 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl">
                  <strong className="text-emerald-400 light:text-emerald-600 font-mono block">Lux (lx):</strong>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1">
                    কাজের তলে বা ডেস্কে এসে পড়া আলোর তীব্রতা (1 Lux = 1 Lumen / m²)।
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-base text-zinc-100 light:text-zinc-900 border-b border-zinc-800 light:border-zinc-200 pb-1">
                BNBC 2020 Golden Rule for Light Rounding Up
              </h3>

              <p>
                লাইটিং ডিজাইনের গাণিতিক সমীকরণে দশমিক সংখ্যা আসলে (যেমন: ১৩.৮৮ টি লাইট), কখনোই নিচের পূর্ণ সংখ্যায় (১৩ টি) নামানো যাবে না। **সবসময় পরবর্তী পূর্ণ সংখ্যায় (১৪ টি) Round Up করতে হবে।**
              </p>

            </div>

          </div>
        )}

      </div>

      {/* CUSTOM FIXTURE CREATION MODAL */}
      {isCustomFixtureModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 light:bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 light:border-zinc-200 mb-4">
              <h3 className="font-bold text-sm text-zinc-100 light:text-zinc-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" /> Create Custom Light Fixture
              </h3>
              <button
                onClick={() => setIsCustomFixtureModalOpen(false)}
                className="p-1 hover:bg-zinc-800 light:hover:bg-zinc-100 text-zinc-400 light:text-zinc-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomFixture} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 light:text-zinc-600 font-mono mb-1">Manufacturer Name:</label>
                <input
                  type="text"
                  required
                  value={customFixtureForm.manufacturer}
                  onChange={e => setCustomFixtureForm(p => ({ ...p, manufacturer: e.target.value }))}
                  className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 text-zinc-200 light:text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-400 light:text-zinc-600 font-mono mb-1">Model Name / Description:</label>
                <input
                  type="text"
                  required
                  value={customFixtureForm.model}
                  onChange={e => setCustomFixtureForm(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 text-zinc-200 light:text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 light:text-zinc-600 font-mono mb-1">Power Wattage (W):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={customFixtureForm.powerWatts}
                    onChange={e => setCustomFixtureForm(p => ({ ...p, powerWatts: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 font-mono text-zinc-200 light:text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 light:text-zinc-600 font-mono mb-1">Lumens Output (lm):</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={customFixtureForm.lumens}
                    onChange={e => setCustomFixtureForm(p => ({ ...p, lumens: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 font-mono text-amber-400 light:text-amber-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 light:text-zinc-600 font-mono mb-1">Beam Angle (°):</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={customFixtureForm.beamAngle}
                    onChange={e => setCustomFixtureForm(p => ({ ...p, beamAngle: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 font-mono text-zinc-200 light:text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 light:text-zinc-600 font-mono mb-1">CCT (Kelvin):</label>
                  <select
                    value={customFixtureForm.cct}
                    onChange={e => setCustomFixtureForm(p => ({ ...p, cct: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-1.5 font-mono text-zinc-200 light:text-zinc-800"
                  >
                    <option value={6500}>6500K (Daylight)</option>
                    <option value={4000}>4000K (Cool White)</option>
                    <option value={3000}>3000K (Warm White)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCustomFixtureModalOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 light:bg-zinc-200 text-zinc-300 light:text-zinc-800 hover:bg-zinc-700 light:hover:bg-zinc-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-xl shadow-md"
                >
                  Save & Use Fixture
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* PRINT REPORT MODAL */}
      {isPrintModalOpen && (
        <PrintReport
          dimensions={dimensions}
          fixture={selectedFixture}
          advancedParams={advancedParams}
          result={results}
          buildingType={selectedBuildingType}
          roomName={selectedRoomPreset.roomName}
          bnbcClause={selectedRoomPreset.bnbcClause}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

    </div>
  );
}
