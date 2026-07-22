import { FixtureItem } from './types';

export const DEFAULT_FIXTURE_LIBRARY: FixtureItem[] = [
  // --- LED PANELS ---
  {
    id: 'fix-panel-36w',
    manufacturer: 'Super Star Group (SSG)',
    model: '600x600 Ultra-Slim LED Panel 36W',
    type: 'LED Panel',
    powerWatts: 36,
    lumens: 3600,
    beamAngle: 120,
    cct: 6500,
    cri: 82,
    ugr: 18.5,
    ipRating: 'IP20',
    lampsPerFixture: 1
  },
  {
    id: 'fix-panel-40w-philips',
    manufacturer: 'Philips Lighting',
    model: 'SmartBright LED Panel RC091V 40W',
    type: 'LED Panel',
    powerWatts: 40,
    lumens: 4000,
    beamAngle: 120,
    cct: 6500,
    cri: 85,
    ugr: 17.8,
    ipRating: 'IP20',
    lampsPerFixture: 1
  },
  {
    id: 'fix-panel-48w-transtec',
    manufacturer: 'Transtec Electrical',
    model: 'ProLine Recessed LED Panel 48W 2x2',
    type: 'LED Panel',
    powerWatts: 48,
    lumens: 4800,
    beamAngle: 120,
    cct: 6500,
    cri: 80,
    ugr: 19.0,
    ipRating: 'IP20',
    lampsPerFixture: 1
  },

  // --- DOWNLIGHTS ---
  {
    id: 'fix-downlight-12w',
    manufacturer: 'Walton Micro-Tech',
    model: 'Slim Recessed Downlight 12W',
    type: 'Downlight',
    powerWatts: 12,
    lumens: 1080,
    beamAngle: 90,
    cct: 6500,
    cri: 80,
    ugr: 21.0,
    ipRating: 'IP20',
    lampsPerFixture: 1
  },
  {
    id: 'fix-downlight-18w-ssg',
    manufacturer: 'Super Star Group',
    model: 'Architectural COB Downlight 18W',
    type: 'Downlight',
    powerWatts: 18,
    lumens: 1800,
    beamAngle: 60,
    cct: 4000,
    cri: 90,
    ugr: 16.5,
    ipRating: 'IP44',
    lampsPerFixture: 1
  },
  {
    id: 'fix-downlight-24w-osram',
    manufacturer: 'Osram / LEDVANCE',
    model: 'DL Comfort 24W Anti-Glare Downlight',
    type: 'Downlight',
    powerWatts: 24,
    lumens: 2400,
    beamAngle: 100,
    cct: 6500,
    cri: 85,
    ugr: 18.0,
    ipRating: 'IP44',
    lampsPerFixture: 1
  },

  // --- HIGH BAYS ---
  {
    id: 'fix-highbay-100w',
    manufacturer: 'Philips Lighting',
    model: 'BY698P GreenPerform LED HighBay 100W',
    type: 'High Bay',
    powerWatts: 100,
    lumens: 13000,
    beamAngle: 90,
    cct: 6500,
    cri: 80,
    ugr: 22.0,
    ipRating: 'IP65',
    lampsPerFixture: 1
  },
  {
    id: 'fix-highbay-150w-ssg',
    manufacturer: 'Super Star Group',
    model: 'Industrial UFO LED High Bay 150W',
    type: 'High Bay',
    powerWatts: 150,
    lumens: 19500,
    beamAngle: 120,
    cct: 6500,
    cri: 80,
    ugr: 24.0,
    ipRating: 'IP65',
    lampsPerFixture: 1
  },

  // --- TUBES & BATTENS ---
  {
    id: 'fix-tube-18w-t8',
    manufacturer: 'Energypac Electronics',
    model: 'T8 Integrated LED Tube Batten 18W (4 Feet)',
    type: 'Tube',
    powerWatts: 18,
    lumens: 1900,
    beamAngle: 140,
    cct: 6500,
    cri: 80,
    ugr: 20.0,
    ipRating: 'IP20',
    lampsPerFixture: 1
  },
  {
    id: 'fix-tube-twin-36w',
    manufacturer: 'Super Star Group',
    model: 'Double T8 Waterproof Batten 2x18W (36W Total)',
    type: 'Tube',
    powerWatts: 36,
    lumens: 3800,
    beamAngle: 140,
    cct: 6500,
    cri: 80,
    ugr: 21.0,
    ipRating: 'IP65',
    lampsPerFixture: 2
  },

  // --- FLOOD LIGHTS ---
  {
    id: 'fix-flood-50w',
    manufacturer: 'Transtec Electrical',
    model: 'Outdoor IP66 LED Flood Light 50W',
    type: 'Flood Light',
    powerWatts: 50,
    lumens: 5500,
    beamAngle: 110,
    cct: 6500,
    cri: 80,
    ugr: 25.0,
    ipRating: 'IP66',
    lampsPerFixture: 1
  },
  {
    id: 'fix-flood-100w-osram',
    manufacturer: 'Osram / LEDVANCE',
    model: 'Floodlight Performance 100W',
    type: 'Flood Light',
    powerWatts: 100,
    lumens: 11500,
    beamAngle: 100,
    cct: 6500,
    cri: 80,
    ugr: 26.0,
    ipRating: 'IP66',
    lampsPerFixture: 1
  }
];
