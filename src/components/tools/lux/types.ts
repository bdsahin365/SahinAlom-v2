export type BuildingType = 
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Educational'
  | 'Healthcare'
  | 'Warehouse'
  | 'Shopping Mall'
  | 'Factory'
  | 'Hotel'
  | 'Restaurant'
  | 'Office';

export type FixtureCategory = 
  | 'LED Panel'
  | 'Downlight'
  | 'Flood Light'
  | 'High Bay'
  | 'Tube'
  | 'Street Light';

export interface RoomPreset {
  id: string;
  buildingType: BuildingType;
  roomName: string;
  roomNameBn: string;
  recommendedLux: number;
  minLux: number;
  maxAllowableLPD: number; // Watts / m^2 under BNBC 2020 Energy Code
  standardWorkingPlaneHeight: number; // in meters (e.g. 0.75m for desk, 0 for floor)
  bnbcClause: string;
  description: string;
}

export interface FixtureItem {
  id: string;
  manufacturer: string;
  model: string;
  type: FixtureCategory;
  powerWatts: number;
  lumens: number;
  beamAngle: number; // degrees
  cct: number; // Kelvin (e.g. 6500, 4000, 3000)
  cri: number; // Ra (e.g. 80, 90)
  ugr: number; // Discomfort Glare Rating (e.g. 19)
  ipRating: string; // e.g. IP20, IP65
  lampsPerFixture: number;
  isCustom?: boolean;
}

export interface RoomDimensions {
  length: number; // meters
  width: number; // meters
  height: number; // meters
  workingPlaneHeight: number; // meters (e.g. 0.75m)
  mountingHeight: number; // meters (height of fixture above floor)
  unit: 'meters' | 'feet';
}

export interface AdvancedParams {
  maintenanceFactor: number; // MF (0.5 - 0.95, default 0.80)
  utilizationFactor: number; // UF (0.3 - 0.9, auto or manual)
  isUfAuto: boolean; // Auto-calculate from Room Index
  reflectanceCeiling: number; // e.g., 70%
  reflectanceWalls: number; // e.g., 50%
  reflectanceFloor: number; // e.g., 20%
  dailyOperatingHours: number; // hours/day for energy cost calculation
  electricityTariffBDT: number; // BDT per kWh (default ~9.5 BDT)
}

export interface CalculationResult {
  roomAreaM2: number;
  roomAreaSqFt: number;
  roomIndex: number;
  effectiveMountingHeight: number; // h_m - h_w
  targetLux: number;
  totalRequiredLumens: number;
  rawFixtureCount: number;
  roundedFixtureCount: number;
  achievedLux: number;
  isLuxSufficient: boolean;
  totalPowerWatts: number;
  totalPowerKW: number;
  actualLPD: number; // W / m^2
  isLpdCompliant: boolean;
  gridRows: number; // N_y
  gridCols: number; // N_x
  spacingX: number; // m
  spacingY: number; // m
  wallOffsetX: number; // m
  wallOffsetY: number; // m
  spacingToHeightRatio: number; // SHR
  isShrCompliant: boolean;
  monthlyEnergyKWh: number;
  monthlyCostBDT: number;
}
