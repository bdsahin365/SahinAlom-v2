export function setCookie(name: string, value: string, days = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export function getSubBreaker(name: string, powerWatts: number, quantity: number, phase: '1-Phase' | '3-Phase', pf: number) {
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

export function getBusbarDetails(mainBreakerAmp: number) {
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
