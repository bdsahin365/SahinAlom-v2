import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, Zap, Layers, Sparkles, Sliders, Info, Printer, Plus, Search, 
  CheckCircle2, CheckCircle, Building, AlertTriangle, ShieldCheck, Sun, Grid, Calculator, HelpCircle,
  X, RotateCcw, Copy, Check, ChevronRight, ChevronDown, ChevronUp, FileSpreadsheet
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
  const [showQuickPresets, setShowQuickPresets] = useState<boolean>(false);

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
  const [fixtureBrandFilter, setFixtureBrandFilter] = useState<string>('All');
  const [fixturePage, setFixturePage] = useState<number>(1);
  const [showAllFixtures, setShowAllFixtures] = useState<boolean>(false);
  const FIXTURES_PER_PAGE = 6;
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
      const matchesBrand = fixtureBrandFilter === 'All' || f.manufacturer.toLowerCase().includes(fixtureBrandFilter.toLowerCase());
      return matchesSearch && matchesType && matchesBrand;
    });
  }, [fixtureLibrary, fixtureSearchQuery, fixtureTypeFilter, fixtureBrandFilter]);

  const totalFixturePages = Math.ceil(filteredFixtures.length / FIXTURES_PER_PAGE) || 1;
  const paginatedFixtures = useMemo(() => {
    if (showAllFixtures) return filteredFixtures;
    const start = (fixturePage - 1) * FIXTURES_PER_PAGE;
    return filteredFixtures.slice(start, start + FIXTURES_PER_PAGE);
  }, [filteredFixtures, showAllFixtures, fixturePage]);

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
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-zinc-800 light:bg-zinc-200 text-zinc-300 light:text-zinc-700 border border-zinc-700 light:border-zinc-300">
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
                <span>How It Works</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'planner' ? (
          /* ================= PLANNER WORKSPACE ================= */
          <div className="space-y-6">
            
            {/* PROFESSIONAL UX STEPPER WITH CONNECTOR PROGRESS LINE & CIRCLED NODES */}
            <div className="bg-zinc-900/90 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-2.5 sm:p-5 shadow-xl">
              <div className="relative">
                {/* Connector Progress Line Behind Circles */}
                <div className="absolute top-3.5 sm:top-4 left-[8%] right-[8%] h-0.5 bg-zinc-800 light:bg-zinc-200 z-0">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                  />
                </div>

                {/* Step Nodes Container */}
                <div className="relative z-10 flex items-center justify-between">
                  {[
                    { num: 1, label: "Space & Lux", mobileLabel: "Space", sub: "Space & Lux" },
                    { num: 2, label: "Room Size", mobileLabel: "Size", sub: "Dimensions" },
                    { num: 3, label: "Fixtures", mobileLabel: "Fixtures", sub: "Fixtures" },
                    { num: 4, label: "Environment", mobileLabel: "Params", sub: "Environment" },
                    { num: 5, label: "Results", mobileLabel: "Results", sub: "Results" },
                  ].map((step) => {
                    const isCompleted = currentStep > step.num;
                    const isActive = currentStep === step.num;

                    return (
                      <button
                        key={step.num}
                        onClick={() => setCurrentStep(step.num)}
                        className="flex flex-col items-center group cursor-pointer focus:outline-none"
                      >
                        {/* Circle Node */}
                        <div
                          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono font-bold text-[11px] sm:text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-amber-500 text-zinc-950 ring-2 sm:ring-4 ring-amber-500/25 shadow-lg scale-105 sm:scale-110'
                              : isCompleted
                              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md'
                              : 'bg-zinc-800 light:bg-zinc-100 text-zinc-400 light:text-zinc-500 border border-zinc-700 light:border-zinc-300 group-hover:border-amber-500/50'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5]" /> : step.num}
                        </div>

                        {/* Label & Subtitle */}
                        <div className="text-center mt-1.5 sm:mt-2.5">
                          <span
                            className={`block text-[9px] sm:text-xs font-semibold sm:font-bold leading-tight transition-colors ${
                              isActive
                                ? 'text-amber-400 light:text-amber-600 font-bold'
                                : isCompleted
                                ? 'text-zinc-200 light:text-zinc-800'
                                : 'text-zinc-500 light:text-zinc-400'
                            }`}
                          >
                            <span className="sm:hidden">{step.mobileLabel}</span>
                            <span className="hidden sm:inline">{step.label}</span>
                          </span>
                          <span
                            className={`hidden sm:block text-[10px] font-mono mt-0.5 ${
                              isActive
                                ? 'text-amber-500/90 light:text-amber-600 font-semibold'
                                : isCompleted
                                ? 'text-emerald-400 light:text-emerald-600'
                                : 'text-zinc-600 light:text-zinc-400'
                            }`}
                          >
                            {isCompleted ? 'Done' : isActive ? 'Active' : step.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MAIN WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: ACTIVE STEP PANEL */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* STEP 1: MERGED BUILDING TYPE & ROOM SELECTION CARD */}
                {currentStep === 1 && (
                  <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xl space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 light:border-zinc-200">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                            Space & Lux Selection
                          </h2>
                          <p className="text-[11px] text-zinc-400 light:text-zinc-500">
                            Select building category and specific room type (BNBC 2020 Standard)
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-500 font-semibold hidden sm:inline-block px-2 py-0.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        {selectedRoomPreset.bnbcClause}
                      </span>
                    </div>

                    {/* Building Type Category Chips */}
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 light:text-zinc-600 mb-2 font-bold">
                        1. Building Category:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {BUILDING_TYPES.map(bType => (
                          <button
                            key={bType}
                            onClick={() => handleBuildingTypeChange(bType)}
                            className={`px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer ${
                              selectedBuildingType === bType
                                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                                : 'bg-zinc-950/60 light:bg-zinc-100 text-zinc-400 hover:text-zinc-200 light:text-zinc-700 border border-zinc-800 light:border-zinc-200'
                            }`}
                          >
                            {bType}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Room Dropdown & Target Lux Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 light:text-zinc-600 mb-1 font-bold">
                          2. Room Type:
                        </label>
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
                              {room.roomName} — {room.recommendedLux} Lux
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 light:text-zinc-600 mb-1 font-bold">
                          3. Target Lux Standard:
                        </label>
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

                    {/* Lux Benchmark Summary Badges */}
                    <div className="p-3 bg-zinc-950/60 light:bg-zinc-50 rounded-xl border border-zinc-800/80 light:border-zinc-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block">Recommended (BNBC):</span>
                        <strong className="text-emerald-400 font-mono">{selectedRoomPreset.recommendedLux} Lux</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block">Minimum Required:</span>
                        <strong className="text-amber-400 font-mono">{selectedRoomPreset.minLux} Lux</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block">Max LPD:</span>
                        <strong className="text-zinc-200 light:text-zinc-800 font-mono">{selectedRoomPreset.maxAllowableLPD} W/m²</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block">Desk Height:</span>
                        <strong className="text-zinc-200 light:text-zinc-800 font-mono">{selectedRoomPreset.standardWorkingPlaneHeight}m</strong>
                      </div>
                    </div>

                    {/* Step Navigation Footer (Desktop Only - Mobile uses fixed bottom bar) */}
                    <div className="pt-3 border-t border-zinc-800 light:border-zinc-200 hidden lg:flex items-center justify-end">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <span>Next: Room Dimensions (Step 2)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

            {/* STEP 2: ROOM DIMENSIONS & MOUNTING HEIGHT */}
            {currentStep === 2 && (
              <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-5 shadow-xl space-y-4">
                
                {/* HEADER & UNIT SELECTOR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 light:border-zinc-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
                      <Grid className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                        Room Dimensions & Heights
                      </h2>
                      <p className="text-[11px] text-zinc-400 light:text-zinc-500">
                        Set room length, width, ceiling height & work plane height
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
                      Feet (ft) <span className="text-[9px] opacity-75 font-normal">(Std)</span>
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

                {/* QUICK ROOM PRESET COLLAPSIBLE TOGGLE */}
                <div className="p-2 bg-zinc-950/40 light:bg-zinc-100/70 rounded-xl border border-zinc-800/80 light:border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setShowQuickPresets(!showQuickPresets)}
                    className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 hover:text-amber-400 light:text-zinc-600 font-semibold cursor-pointer py-0.5 px-1 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Quick Size Presets</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <span>{showQuickPresets ? 'Hide' : 'Show'}</span>
                      {showQuickPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {showQuickPresets && (
                    <div className="flex flex-wrap gap-1.5 pt-2 mt-1 border-t border-zinc-800/60 light:border-zinc-200">
                      {[
                        { name: "12' × 10' (Small)", l: 12, w: 10 },
                        { name: "15' × 12' (Standard)", l: 15, w: 12 },
                        { name: "20' × 15' (Conference)", l: 20, w: 15 },
                        { name: "30' × 20' (Large Hall)", l: 30, w: 20 },
                        { name: "50' × 30' (Factory)", l: 50, w: 30 },
                      ].map(p => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => applyRoomSizePreset(p.l, p.w)}
                          className="px-2 py-1 text-[11px] font-mono rounded-md bg-zinc-900 light:bg-white border border-zinc-800 light:border-zinc-300 text-zinc-300 light:text-zinc-700 hover:border-amber-500 hover:text-amber-400 transition-all cursor-pointer active:scale-95"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* INTERACTIVE INPUT CONTROLS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                  
                  {/* LENGTH (L) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        Length (L)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.length * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.length / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => adjustDimension('length', dimensions.unit === 'feet' ? -0.5 : -0.2)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Decrease Length"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-xl px-3 h-11 shadow-inner focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                        <input
                          type="number"
                          step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                          min="1"
                          value={dimensions.length}
                          onChange={e => setDimensions(p => ({ ...p, length: Math.max(0.1, Number(e.target.value)) }))}
                          className="w-full bg-transparent text-center font-mono font-black text-base sm:text-lg text-amber-400 light:text-amber-600 focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-zinc-400 light:text-zinc-500 ml-1 shrink-0">
                          {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustDimension('length', dimensions.unit === 'feet' ? 0.5 : 0.2)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Increase Length"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* WIDTH (W) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        Width (W)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.width * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.width / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => adjustDimension('width', dimensions.unit === 'feet' ? -0.5 : -0.2)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Decrease Width"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-xl px-3 h-11 shadow-inner focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                        <input
                          type="number"
                          step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                          min="1"
                          value={dimensions.width}
                          onChange={e => setDimensions(p => ({ ...p, width: Math.max(0.1, Number(e.target.value)) }))}
                          className="w-full bg-transparent text-center font-mono font-black text-base sm:text-lg text-amber-400 light:text-amber-600 focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-zinc-400 light:text-zinc-500 ml-1 shrink-0">
                          {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustDimension('width', dimensions.unit === 'feet' ? 0.5 : 0.2)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Increase Width"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* TOTAL HEIGHT (H) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        Ceiling Height (H)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.height * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.height / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => adjustDimension('height', dimensions.unit === 'feet' ? -0.5 : -0.1)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Decrease Ceiling Height"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-xl px-3 h-11 shadow-inner focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                        <input
                          type="number"
                          step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                          min="1"
                          value={dimensions.height}
                          onChange={e => setDimensions(p => ({ ...p, height: Math.max(0.1, Number(e.target.value)) }))}
                          className="w-full bg-transparent text-center font-mono font-black text-base sm:text-lg text-amber-400 light:text-amber-600 focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-zinc-400 light:text-zinc-500 ml-1 shrink-0">
                          {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustDimension('height', dimensions.unit === 'feet' ? 0.5 : 0.1)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Increase Ceiling Height"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-400 light:text-zinc-500 block">
                      Floor-to-ceiling total height
                    </span>
                  </div>

                  {/* WORK PLANE HEIGHT (hw) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        Work Plane Height (hw)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.workingPlaneHeight * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.workingPlaneHeight / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => adjustDimension('workingPlaneHeight', dimensions.unit === 'feet' ? -0.25 : -0.1)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Decrease Work Plane Height"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-xl px-3 h-11 shadow-inner focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                        <input
                          type="number"
                          step={dimensions.unit === 'feet' ? '0.25' : '0.05'}
                          min="0"
                          value={dimensions.workingPlaneHeight}
                          onChange={e => setDimensions(p => ({ ...p, workingPlaneHeight: Math.max(0, Number(e.target.value)) }))}
                          className="w-full bg-transparent text-center font-mono font-black text-base sm:text-lg text-amber-400 light:text-amber-600 focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-zinc-400 light:text-zinc-500 ml-1 shrink-0">
                          {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustDimension('workingPlaneHeight', dimensions.unit === 'feet' ? 0.25 : 0.1)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Increase Work Plane Height"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-400 light:text-zinc-500 block">
                      Desk/Table height (2.5 ft std)
                    </span>
                  </div>

                  {/* MOUNTING HEIGHT (hm) */}
                  <div className="bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-zinc-200 light:text-zinc-800">
                        Mounting Height (hm)
                      </label>
                      <span className="text-[10px] font-mono text-amber-400/90 light:text-amber-700 font-semibold">
                        {dimensions.unit === 'feet' 
                          ? `≈ ${(dimensions.mountingHeight * 0.3048).toFixed(2)} m`
                          : `≈ ${(dimensions.mountingHeight / 0.3048).toFixed(1)} ft`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => adjustDimension('mountingHeight', dimensions.unit === 'feet' ? -0.5 : -0.1)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Decrease Mounting Height"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center bg-zinc-900 light:bg-white border border-zinc-700 light:border-zinc-300 rounded-xl px-3 h-11 shadow-inner focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                        <input
                          type="number"
                          step={dimensions.unit === 'feet' ? '0.5' : '0.1'}
                          min="0.5"
                          value={dimensions.mountingHeight}
                          onChange={e => setDimensions(p => ({ ...p, mountingHeight: Math.max(0.1, Number(e.target.value)) }))}
                          className="w-full bg-transparent text-center font-mono font-black text-base sm:text-lg text-amber-400 light:text-amber-600 focus:outline-none"
                        />
                        <span className="text-xs font-mono font-bold text-zinc-400 light:text-zinc-500 ml-1 shrink-0">
                          {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustDimension('mountingHeight', dimensions.unit === 'feet' ? 0.5 : 0.1)}
                        className="w-12 h-11 shrink-0 bg-zinc-800 light:bg-zinc-200 hover:bg-amber-500 hover:text-zinc-950 light:hover:bg-amber-500 light:hover:text-zinc-950 text-zinc-100 light:text-zinc-900 font-black text-xl rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm border border-zinc-700/60 light:border-zinc-300"
                        aria-label="Increase Mounting Height"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-400 light:text-zinc-500 block">
                      Fixture mounting height from floor
                    </span>
                  </div>

                  {/* AREA SUMMARY & DUAL UNIT DISPLAY */}
                  <div className="bg-amber-500/10 light:bg-amber-50 border border-amber-500/30 light:border-amber-200 rounded-xl p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-500 light:text-amber-700 font-bold block">
                        Total Floor Area
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
                      <Layers className="w-4 h-4" /> Vertical Height Profile Diagram
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 light:text-zinc-500">
                      Effective Cavity Height (hr)
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
                          Ceiling (H = {dimensions.height} {dimensions.unit === 'feet' ? 'ft' : 'm'})
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
                                Work Desk (hw = {dimensions.workingPlaneHeight} {dimensions.unit === 'feet' ? 'ft' : 'm'})
                              </text>

                              {/* Floor line */}
                              <line x1="20" y1={yFloor} x2="300" y2={yFloor} stroke="#71717a" strokeWidth="3" />
                              <text x="25" y={yFloor + 12} fill="#71717a" fontSize="9" fontFamily="monospace">
                                Floor (0.0)
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
                          Effective Mounting Height (hr):
                        </span>
                        <div className="text-sm font-bold text-blue-400 light:text-blue-700">
                          hr = hm - hw = {(results.effectiveMountingHeight * (dimensions.unit === 'feet' ? 3.28084 : 1)).toFixed(2)} {dimensions.unit === 'feet' ? 'ft' : 'm'}
                        </div>
                        <p className="text-[10px] text-zinc-400 light:text-zinc-600 font-sans">
                          Distance light beam travels to reach the desk work plane.
                        </p>
                      </div>

                      {/* Warnings if mounting height invalid */}
                      {dimensions.mountingHeight > dimensions.height && (
                        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-[11px] text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Warning: Mounting height exceeds ceiling height!
                        </div>
                      )}

                      {dimensions.workingPlaneHeight >= dimensions.mountingHeight && (
                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Warning: Work plane height must be lower than mounting height!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STEP NAVIGATION FOOTER (Desktop Only) */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 hidden lg:flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 light:bg-zinc-200 light:hover:bg-zinc-300 text-zinc-300 light:text-zinc-800 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Space & Lux (Step 1)</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Next: Light Fixtures (Step 3)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: FIXTURE SELECTION */}
            {currentStep === 3 && (
              <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                
                {/* STEP HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800 light:border-zinc-200">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/20 shadow-inner">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-base text-zinc-100 light:text-zinc-900">
                        Select Light Fixtures
                      </h2>
                      <p className="text-xs text-zinc-400 light:text-zinc-500 mt-0.5">
                        Super Star (SSG), Philips, Walton, Energypac, Opple, Schneider & custom catalog
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCustomFixtureModalOpen(true)}
                    className="self-start sm:self-auto px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Fixture</span>
                  </button>
                </div>

                {/* CURRENTLY SELECTED FIXTURE SPEC HIGHLIGHT BANNER */}
                {selectedFixture && (
                  <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-950 light:from-amber-50 light:via-white light:to-amber-50/30 border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 shadow-md relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded bg-amber-500 text-zinc-950">
                            Selected Light
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-800 light:bg-zinc-200 text-zinc-300 light:text-zinc-800">
                            {selectedFixture.manufacturer}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {selectedFixture.type}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-zinc-100 light:text-zinc-900">
                          {selectedFixture.model}
                        </h3>

                        {/* QUICK SPECS ROW */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-300 light:text-zinc-700 pt-1">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <strong>{selectedFixture.powerWatts}W</strong>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-400 light:text-amber-600 font-bold">
                            <Sun className="w-3.5 h-3.5" />
                            <strong>{selectedFixture.lumens} Lumens</strong>
                          </span>
                          <span>•</span>
                          <span>Efficacy: <strong>{Math.round(selectedFixture.lumens / selectedFixture.powerWatts)} lm/W</strong></span>
                          <span>•</span>
                          <span>CCT: <strong>{selectedFixture.cct}K</strong> ({selectedFixture.cct >= 6000 ? 'Daylight' : selectedFixture.cct >= 4000 ? 'Cool White' : 'Warm White'})</span>
                        </div>
                      </div>

                      {/* ESTIMATED FIXTURE COUNT BADGE */}
                      <div className="bg-zinc-950/80 light:bg-white/80 backdrop-blur-sm border border-amber-500/30 rounded-xl p-2.5 sm:p-3 text-center shrink-0">
                        <span className="text-[10px] font-mono text-zinc-400 block font-semibold uppercase">
                          Estimated Quantity
                        </span>
                        <div className="text-xl sm:text-2xl font-mono font-black text-amber-400 mt-0.5">
                          ~{results.roundedFixtureCount} <span className="text-xs font-normal">Pcs</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                          {results.achievedLux} Lux (Target: {results.targetLux} Lx)
                        </span>
                      </div>

                    </div>
                  </div>
                )}

                {/* SEARCH & FILTERS BAR */}
                <div className="space-y-3 pt-1">
                  
                  {/* SEARCH INPUT & BRAND FILTER ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    
                    {/* Search bar */}
                    <div className="sm:col-span-7 relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search model, brand (Super Star, Philips, Walton, 36W, Panel)..."
                        value={fixtureSearchQuery}
                        onChange={e => setFixtureSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-amber-500"
                      />
                      {fixtureSearchQuery && (
                        <button
                          onClick={() => setFixtureSearchQuery('')}
                          className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Brand Dropdown filter */}
                    <div className="sm:col-span-5">
                      <select
                        value={fixtureBrandFilter}
                        onChange={e => setFixtureBrandFilter(e.target.value)}
                        className="w-full bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-amber-500"
                      >
                        <option value="All">All Brands</option>
                        <option value="Super Star">Super Star Group (SSG)</option>
                        <option value="Philips">Philips Lighting</option>
                        <option value="Walton">Walton Micro-Tech</option>
                        <option value="Energypac">Energypac Electronics</option>
                        <option value="Transtec">Transtec Electrical</option>
                        <option value="Opple">Opple Lighting</option>
                        <option value="Schneider">Schneider Electric</option>
                        <option value="Osram">Osram / LEDVANCE</option>
                      </select>
                    </div>

                  </div>

                  {/* CATEGORY TABS PILLS (Horizontal Scroll on Mobile) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                      { id: 'All', label: 'All Fixtures' },
                      { id: 'LED Panel', label: 'LED Panels' },
                      { id: 'Downlight', label: 'Downlights' },
                      { id: 'Tube', label: 'T8/T5 Tube Lights' },
                      { id: 'High Bay', label: 'High Bays' },
                      { id: 'Flood Light', label: 'Flood Lights' },
                      { id: 'Spotlight', label: 'Spotlights' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFixtureTypeFilter(cat.id)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-xl whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                          fixtureTypeFilter === cat.id
                            ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                            : 'bg-zinc-950/80 light:bg-zinc-100 text-zinc-400 hover:text-zinc-200 light:text-zinc-700 border border-zinc-800 light:border-zinc-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                </div>

                {/* FIXTURE GRID CARDS SELECTOR (No Inner Scroll Box Trap) */}
                <div>
                  {filteredFixtures.length === 0 ? (
                    <div className="p-8 text-center bg-zinc-950/40 rounded-2xl border border-zinc-800/60">
                      <p className="text-xs font-mono text-zinc-400">No matching light fixtures found.</p>
                      <button
                        type="button"
                        onClick={() => { setFixtureSearchQuery(''); setFixtureTypeFilter('All'); setFixtureBrandFilter('All'); setFixturePage(1); }}
                        className="mt-2.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* CARDS GRID (Ultra-Compact Mobile-Friendly Design) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {paginatedFixtures.map(fix => {
                          const isSelected = selectedFixtureId === fix.id;
                          const efficacy = Math.round(fix.lumens / fix.powerWatts);
                          
                          let cctBadgeClass = 'bg-amber-400/15 text-amber-300 border-amber-500/30';
                          let cctLabel = 'Cool White';
                          if (fix.cct >= 6000) {
                            cctBadgeClass = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
                            cctLabel = 'Daylight';
                          } else if (fix.cct <= 3000) {
                            cctBadgeClass = 'bg-orange-500/15 text-orange-300 border-orange-500/30';
                            cctLabel = 'Warm';
                          }

                          return (
                            <div
                              key={fix.id}
                              onClick={() => setSelectedFixtureId(fix.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between group active:scale-[0.99] ${
                                isSelected
                                  ? 'bg-amber-500/15 light:bg-amber-100/70 border-amber-500 ring-2 ring-amber-500/40 text-amber-300 shadow-md'
                                  : 'bg-zinc-950/70 light:bg-zinc-50 hover:bg-zinc-900 light:hover:bg-zinc-100 border-zinc-800/90 light:border-zinc-200/90 text-zinc-300 hover:border-amber-500/50'
                              }`}
                            >
                              {/* TOP ROW: BRAND, TYPE & SELECTED BADGE */}
                              <div className="flex items-center justify-between gap-1.5 mb-1">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-black uppercase rounded bg-zinc-800 light:bg-zinc-200 text-zinc-200 light:text-zinc-900 border border-zinc-700/60 light:border-zinc-300 shrink-0">
                                    {fix.manufacturer}
                                  </span>
                                  <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 truncate">
                                    {fix.type}
                                  </span>
                                </div>

                                {isSelected ? (
                                  <span className="px-2 py-0.5 text-[9px] font-mono font-black rounded-full bg-amber-500 text-zinc-950 flex items-center gap-1 shrink-0 shadow-xs">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>SELECTED</span>
                                  </span>
                                ) : (
                                  <span className={`px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded-md border shrink-0 ${cctBadgeClass}`}>
                                    {fix.cct}K {cctLabel}
                                  </span>
                                )}
                              </div>

                              {/* MODEL TITLE */}
                              <h4 className="font-bold text-xs text-zinc-100 light:text-zinc-900 group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
                                {fix.model}
                              </h4>

                              {/* INLINE SPECS BADGES ROW */}
                              <div className="mt-2 pt-2 border-t border-zinc-800/80 light:border-zinc-200/80 flex items-center justify-between gap-2 text-[11px] font-mono">
                                
                                <div className="flex items-center gap-1.5 text-amber-400 light:text-amber-600 font-bold">
                                  <Sun className="w-3.5 h-3.5 shrink-0" />
                                  <span>{fix.lumens} lm</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-zinc-200 light:text-zinc-800">
                                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>{fix.powerWatts}W</span>
                                </div>

                                <div className="text-[10px] text-zinc-400 light:text-zinc-500">
                                  {efficacy} lm/W
                                </div>

                              </div>

                            </div>
                          );
                        })}
                      </div>

                      {/* PAGINATION & VIEW ALL TOGGLE BAR */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800 light:border-zinc-200">
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400 light:text-zinc-600">
                            Showing {showAllFixtures ? filteredFixtures.length : paginatedFixtures.length} of {filteredFixtures.length} fixtures
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => setShowAllFixtures(!showAllFixtures)}
                            className="text-xs font-mono text-amber-400 hover:underline cursor-pointer ml-1"
                          >
                            {showAllFixtures ? 'Paginated View' : 'Show All on One Page'}
                          </button>
                        </div>

                        {!showAllFixtures && totalFixturePages > 1 && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={fixturePage === 1}
                              onClick={() => setFixturePage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 text-xs font-mono rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Prev</span>
                            </button>

                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalFixturePages }, (_, i) => i + 1).map(p => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setFixturePage(p)}
                                  className={`w-7 h-7 text-xs font-mono font-bold rounded-xl cursor-pointer transition-all ${
                                    fixturePage === p
                                      ? 'bg-amber-500 text-zinc-950 shadow-md'
                                      : 'bg-zinc-900 light:bg-zinc-200 text-zinc-400 hover:text-zinc-100'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              disabled={fixturePage === totalFixturePages}
                              onClick={() => setFixturePage(p => Math.min(totalFixturePages, p + 1))}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 text-xs font-mono rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                      </div>

                    </div>
                  )}
                </div>

                {/* STEP NAVIGATION FOOTER (Desktop Only) */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 hidden lg:flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 light:bg-zinc-200 light:hover:bg-zinc-300 text-zinc-300 light:text-zinc-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Room Dimensions (Step 2)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next: Environment & Tariff (Step 4)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 4: ADVANCED PARAMETERS (UF & MF) */}
            {currentStep === 4 && (
              <div className="bg-zinc-900/50 light:bg-white border border-zinc-900 light:border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 light:border-zinc-200">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/20">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-zinc-100 light:text-zinc-900">
                        Environment & Electricity Tariff
                      </h2>
                      <p className="text-[11px] text-zinc-400 light:text-zinc-500">
                        Maintenance Factor (MF), Utilization Factor (UF) & electricity rate
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline-block">Loss Factors</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold">Maintenance Factor (MF):</label>
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
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                      0.80 Clean Office • 0.70 Medium Industry • 0.60 Dusty Environment
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-zinc-400 light:text-zinc-600 font-semibold">Utilization Factor (UF):</label>
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

                {/* STEP NAVIGATION FOOTER (Desktop Only) */}
                <div className="pt-4 border-t border-zinc-800 light:border-zinc-200 hidden lg:flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 light:bg-zinc-200 light:hover:bg-zinc-300 text-zinc-300 light:text-zinc-800 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: Light Fixtures (Step 3)</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Next: Results & 3D Plan (Step 5)</span>
                    <ArrowRight className="w-4 h-4" />
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
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="font-bold text-sm sm:text-base text-zinc-100 light:text-zinc-900">
                          Calculation Results & Layout
                        </h2>
                        <p className="text-[11px] text-zinc-400">BNBC 2020 lumen method calculation summary and 3D layout</p>
                      </div>
                    </div>
                  </div>

                  {/* METRICS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    
                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">Required Fixtures</span>
                      <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                        {results.roundedFixtureCount} <span className="text-xs font-normal">Pcs</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        ({results.gridCols} cols × {results.gridRows} rows)
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">Achieved Lux</span>
                      <div className={`text-3xl font-mono font-black mt-1 ${results.isLuxSufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {results.achievedLux} <span className="text-xs font-normal">Lux</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        Target: {results.targetLux} Lux
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">Total Power Load</span>
                      <div className="text-3xl font-mono font-black text-zinc-100 light:text-zinc-900 mt-1">
                        {results.totalPowerWatts} <span className="text-xs font-normal">W</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        LPD: {results.actualLPD.toFixed(1)} W/m²
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl text-center">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">Monthly Power Cost</span>
                      <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                        ৳ {Math.round(results.monthlyCostBDT).toLocaleString('en-US')}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        ({advancedParams.dailyOperatingHours} hrs/day)
                      </span>
                    </div>

                  </div>

                </div>

                {/* 2D/3D VISUALIZER */}
                <RoomGridVisualizer
                  dimensions={dimensions}
                  fixture={selectedFixture}
                  result={results}
                  roomName={selectedRoomPreset.roomName}
                />

                {/* PRINT / EXPORT PDF REPORT CARD (Positioned underneath results for mobile friendliness) */}
                <div className="bg-zinc-900/60 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                      <Printer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-zinc-100 light:text-zinc-900">
                        Print / Export Official Specification Report
                      </h3>
                      <p className="text-xs text-zinc-400 light:text-zinc-500 mt-0.5">
                        Generate a BNBC 2020 compliant PDF report with luminaire specs & grid layout
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print PDF Report</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT COLUMN: DESKTOP LIVE PREVIEW SIDEBAR (STEPS 1-4) */}
          {currentStep < 5 && (
            <div className="hidden lg:block lg:col-span-4 sticky top-6 space-y-4">
              <div className="bg-zinc-900/80 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-4 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 light:border-zinc-200 pb-2.5">
                  <span className="text-xs font-mono font-bold text-amber-400 light:text-amber-600 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Live Preview Summary
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase">
                    Live
                  </span>
                </div>

                {/* QUICK FIXTURE COUNT */}
                <div className="p-3 bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl text-center">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Total Fixtures Required:</span>
                  <div className="text-3xl font-mono font-black text-amber-400 mt-0.5">
                    {results.roundedFixtureCount} <span className="text-sm font-bold text-zinc-300">Pcs</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-300 block mt-1">
                    Layout: <strong>{results.gridCols}</strong> Cols × <strong>{results.gridRows}</strong> Rows
                  </span>
                </div>

                {/* LUX STATUS */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Target Lux:</span>
                    <strong className="text-amber-400">{results.targetLux} Lux</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Achieved Lux:</span>
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
                    <span className="text-[10px] text-zinc-400 block">Total Power:</span>
                    <strong className="text-zinc-200">{results.totalPowerWatts} W</strong>
                  </div>
                  <div className="bg-zinc-950 light:bg-zinc-50 p-2 rounded-lg border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block">Monthly Cost:</span>
                    <strong className="text-amber-400">৳{Math.round(results.monthlyCostBDT)}</strong>
                  </div>
                </div>

                {/* MINI 2D GRID PREVIEW */}
                <div className="pt-2 border-t border-zinc-800 light:border-zinc-200">
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1.5 font-bold">
                    Lighting Grid Preview ({results.gridCols} × {results.gridRows}):
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
                  <span>View 3D Plan & Full Report (Step 5)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          )}

          </div>

          {/* MOBILE FLOATING STICKY BOTTOM DRAWER */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 light:bg-white/95 backdrop-blur-md border-t border-zinc-800 light:border-zinc-200 p-3 shadow-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 block">Required Lights:</span>
              <div className="text-base font-mono font-black text-amber-400">
                {results.roundedFixtureCount} Pcs <span className="text-xs font-normal text-zinc-400">({results.achievedLux} Lux)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(p => Math.max(1, p - 1))}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
              )}
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(p => Math.min(5, p + 1))}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>Step {currentStep + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ================= HOW IT WORKS & CALCULATION LOGIC ================= */
          <div className="max-w-4xl mx-auto space-y-6 text-left">
            
            {/* HEADER BANNER */}
            <div className="bg-zinc-900/60 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 light:border-zinc-200 pb-5">
                <div>
                  <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-block mb-2">
                    Md. Sahin Alom, EEE • Illumination Engineering Suite
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 light:text-zinc-900">
                    এই টুলটি যেভাবে কাজ করে (How It Works & Calculation Logic)
                  </h2>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 mt-1">
                    BNBC 2020 কোড অনুযায়ী লুমেন মেথড (Lumen Method) ব্যবহার করে নিখুঁত লাইটিং সাইজিং ও গ্রিড প্ল্যানিং।
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="self-start sm:self-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Calculator className="w-4 h-4" />
                  <span>লাইটিং প্ল্যান শুরু করুন</span>
                </button>
              </div>

              {/* 4 STEP USER FLOW */}
              <div className="mt-6">
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-4">
                  ব্যবহারকারীর ৪টি সহজ ধাপ (4 Simple Steps)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 light:border-zinc-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-mono font-black text-xs flex items-center justify-center shrink-0">1</span>
                      <h4 className="font-bold text-sm text-zinc-200 light:text-zinc-800">স্পেস ও লাক্স নির্বাচন (Space & Standard Lux)</h4>
                    </div>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 pl-8 leading-relaxed">
                      অফিস, ক্লাসরুম, হাসপাতাল বা রেস্টুরেন্টের টাইপ সিলেক্ট করলে BNBC 2020 নির্ধারিত কাজের প্রয়োজনীয় Lux (যেমন: অফিসে ৩০০-৫০০ Lux) অটো-সেট হয়।
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 light:border-zinc-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-mono font-black text-xs flex items-center justify-center shrink-0">2</span>
                      <h4 className="font-bold text-sm text-zinc-200 light:text-zinc-800">রুমের পরিমাপ (Room Dimensions)</h4>
                    </div>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 pl-8 leading-relaxed">
                      ঘরের দৈর্ঘ্য, প্রস্থ ও সিলিংয়ের উচ্চতা ইনপুট দিলে সিস্টেম স্বয়ংক্রিয়ভাবে Floor Area ($m^2$) এবং Room Index ($K$) গণনা করে।
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 light:border-zinc-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-mono font-black text-xs flex items-center justify-center shrink-0">3</span>
                      <h4 className="font-bold text-sm text-zinc-200 light:text-zinc-800">লাইট ফিটিংস নির্বাচন (Select Light Fixture)</h4>
                    </div>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 pl-8 leading-relaxed">
                      Super Star, Philips, Walton সহ স্থানীয় ও আন্তর্জাতিক ব্র্যান্ডের টিউবলাইট, প্যানেল বা ডাউনলাইটের Wattage ও Lumens দেখে আপনার পছন্দের আলো সিলেক্ট করুন।
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800/80 light:border-zinc-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-mono font-black text-xs flex items-center justify-center shrink-0">4</span>
                      <h4 className="font-bold text-sm text-zinc-200 light:text-zinc-800">পরিবেশ ও ৩ডি ফলাফল (Environment & 3D Plan)</h4>
                    </div>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 pl-8 leading-relaxed">
                      দেয়ালের রঙ, কাজের টেবিলের উচ্চতা ও Maintenance Factor ইনপুট দিলে ৩ডি সিমুলেশন, বিপিডিবি ট্যারিফ বিল এবং PDF রিপোর্ট প্রস্তুত হয়ে যায়।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORMULA & CALCULATION DETAILS CARD */}
            <div className="bg-zinc-900/60 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-zinc-100 light:text-zinc-900 flex items-center gap-2 border-b border-zinc-800 light:border-zinc-200 pb-3">
                <Calculator className="w-5 h-5 text-amber-500" />
                গাণিতিক সূত্রের বিশদ ব্যাখ্যা (Calculation Formulas)
              </h3>

              {/* MAIN LUMEN FORMULA BOX */}
              <div className="p-5 bg-zinc-950 light:bg-zinc-50 border border-amber-500/30 rounded-2xl space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                  ১. লুমেন মেথড সূত্র (Lumen Method Formula)
                </span>
                <div className="text-center py-2 bg-zinc-900 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-xl">
                  <span className="text-lg sm:text-xl font-mono font-bold text-amber-400 light:text-amber-600">
                    N = (E × A) ÷ (F × UF × MF)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-300 light:text-zinc-700 pt-1">
                  <div><strong className="text-amber-400">N:</strong> প্রয়োজনীয় মোট ফিটিংসের সংখ্যা (Total Fixtures)</div>
                  <div><strong className="text-amber-400">E:</strong> প্রয়োজনীয় আলোর মাত্রা (Target Lux)</div>
                  <div><strong className="text-amber-400">A:</strong> ঘরের ক্ষেত্রফল (m² Area = L × W)</div>
                  <div><strong className="text-amber-400">F:</strong> ১টি ফিটিংয়ের আলো উৎপাদন (Lumens Output)</div>
                  <div><strong className="text-amber-400">UF:</strong> Utilization Factor (ব্যবহার ক্ষমতা, ০.৫০ - ০.৮০)</div>
                  <div><strong className="text-amber-400">MF:</strong> Maintenance Factor (অবক্ষয় গুণাঙ্ক, ০.৭০ - ০.৮৫)</div>
                </div>
              </div>

              {/* SECONDARY FORMULAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">২. রুম ইনডেক্স (Room Index K)</span>
                  <p className="font-mono text-amber-400 font-bold">K = (L × W) ÷ [Hm × (L + W)]</p>
                  <p className="text-[11px] text-zinc-400 light:text-zinc-600">ঘরের সিলিং ও কাজের টেবিলের দূরত্বের সাপেক্ষে অনুপাত।</p>
                </div>

                <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">৩. মোট পাওয়ার (Power)</span>
                  <p className="font-mono text-amber-400 font-bold">kW = (N × Wattage) ÷ 1000</p>
                  <p className="text-[11px] text-zinc-400 light:text-zinc-600">মোট কত কিলোওয়াট বিদ্যুৎ শক্তি ব্যবহৃত হবে।</p>
                </div>

                <div className="p-4 bg-zinc-950/60 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">৪. মাসিক বিদ্যুৎ বিল (Energy Cost)</span>
                  <p className="font-mono text-amber-400 font-bold">Cost = kW × Hours × 30 × Rate</p>
                  <p className="text-[11px] text-zinc-400 light:text-zinc-600">BPDB/DESCO বাংলাদেশ ট্যারিফ রেট দিয়ে মাসিক খরচের হিসাব।</p>
                </div>
              </div>

              {/* LUX VS LUMEN QUICK COMPARISON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-800/80 light:border-zinc-200 rounded-xl">
                  <strong className="text-amber-400 light:text-amber-600 font-mono text-xs block mb-1">লুমেন (Lumen - lm) কী?</strong>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed">
                    একটি বাল্ব বা ফিটিং চারদিকে মোট কতটুকু আলো ছড়ায় তাকে লুমেন বলে। যেমন: ৪০ ওয়াটের একটি এলইডি প্যানেল প্রায় ৩৬০০ লুমেন আলো তৈরি করে।
                  </p>
                </div>

                <div className="p-4 bg-zinc-950/40 light:bg-zinc-50 border border-zinc-800/80 light:border-zinc-200 rounded-xl">
                  <strong className="text-emerald-400 light:text-emerald-600 font-mono text-xs block mb-1">লাক্স (Lux - lx) কী?</strong>
                  <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed">
                    আপনার টেবিল বা মেঝের প্রতি বর্গমিটারে ঠিক কতখানি আলো এসে পড়ছে তাকে লাক্স বলে (1 Lux = 1 Lumen / m²)।
                  </p>
                </div>
              </div>

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
