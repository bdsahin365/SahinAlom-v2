export const PRESET_LOADS = [
  { name: 'LED Tube Light', power: 18, pf: 0.9, phase: '1-Phase', df: 0.9 },
  { name: 'Ceiling Fan', power: 80, pf: 0.85, phase: '1-Phase', df: 0.85 },
  { name: 'General Outlets 5A', power: 100, pf: 0.8, phase: '1-Phase', df: 0.4 },
  { name: 'Power Outlet 13A/15A', power: 1000, pf: 0.8, phase: '1-Phase', df: 0.4 },
  { name: 'Split AC 1.5 Ton', power: 1800, pf: 0.88, phase: '1-Phase', df: 0.7 },
  { name: 'Split AC 2.0 Ton', power: 2400, pf: 0.88, phase: '1-Phase', df: 0.7 },
  { name: 'Water Pump 1 HP', power: 746, pf: 0.82, phase: '1-Phase', df: 0.8 },
  { name: 'Water Pump 3 HP', power: 2238, pf: 0.82, phase: '3-Phase', df: 0.8 },
  { name: 'Industrial Motor 10 HP', power: 7460, pf: 0.85, phase: '3-Phase', df: 0.8 },
  { name: 'Water Heater / Geyser', power: 2000, pf: 1.0, phase: '1-Phase', df: 0.8 },
  { name: 'Microwave Oven', power: 1200, pf: 0.95, phase: '1-Phase', df: 0.8 },
  { name: 'Desktop Workstation', power: 250, pf: 0.9, phase: '1-Phase', df: 0.8 }
];

export const CABLE_RESISTANCE: Record<number, number> = {
  1.5: 12.1, 2.5: 7.41, 4.0: 4.61, 6.0: 3.08, 10.0: 1.83, 16.0: 1.15,
  25.0: 0.727, 35.0: 0.524, 50.0: 0.387, 70.0: 0.268, 95.0: 0.193,
  120.0: 0.153, 150.0: 0.124, 185.0: 0.0991, 240.0: 0.0754, 300.0: 0.0601
};

export const CURRENT_CAPACITY_CONDUIT: Record<number, { singlePhase: number; threePhase: number }> = {
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

export const CURRENT_CAPACITY_TRAY: Record<number, { singlePhase: number; threePhase: number }> = {
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
