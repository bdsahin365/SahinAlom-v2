import React, { useState, useMemo } from 'react';
import { CalculationResult, FixtureItem, RoomDimensions } from './types';
import { 
  Eye, Grid, Maximize2, Layers, Sparkles, Sun, CheckCircle2, AlertTriangle, 
  ShieldCheck, Zap, Sliders, Box, Move, Compass, HelpCircle, FileText, Download, 
  Check, Copy, RefreshCw, Info, Cpu, ArrowUpRight, Wrench, Shield, CheckSquare
} from 'lucide-react';

interface RoomGridVisualizerProps {
  dimensions: RoomDimensions;
  fixture: FixtureItem;
  result: CalculationResult;
  roomName: string;
}

export const RoomGridVisualizer: React.FC<RoomGridVisualizerProps> = ({
  dimensions,
  fixture,
  result,
  roomName
}) => {
  // Main View Mode
  const [activeTab, setActiveTab] = useState<'2D' | '3D' | 'electrician'>('2D');

  // 2D Layer Toggles
  const [showCadDimensions, setShowCadDimensions] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showBeamCones, setShowBeamCones] = useState<boolean>(true);
  const [showWiringCircuits, setShowWiringCircuits] = useState<boolean>(true);
  
  // Interactive Hover Probe State
  const [hoverCoord, setHoverCoord] = useState<{
    xMeters: number;
    yMeters: number;
    xFeet: number;
    yFeet: number;
    lux: number;
    distLeft: number;
    distTop: number;
  } | null>(null);

  const [selectedFixtureId, setSelectedFixtureId] = useState<number | null>(null);

  // 3D Rotation State
  const [azimuth3D, setAzimuth3D] = useState<number>(42); // degrees
  const [pitch3D, setPitch3D] = useState<number>(50); // degrees
  const [zoom3D, setZoom3D] = useState<number>(1.0);
  const [show3DFurniture, setShow3DFurniture] = useState<boolean>(true);

  // 3D Realism & Lighting Controls
  const [is3DLightsOn, setIs3DLightsOn] = useState<boolean>(true);
  const [dimmerLevel, setDimmerLevel] = useState<number>(100); // 0-100%
  const [cctTemp, setCctTemp] = useState<'3000K' | '4000K' | '6500K'>('4000K');
  const [isNightEnvironment, setIsNightEnvironment] = useState<boolean>(true);
  const [showVolumetricBeams, setShowVolumetricBeams] = useState<boolean>(true);

  // Color mapping for light renders
  const cctColors = {
    '3000K': {
      name: 'Warm White (3000K)',
      hex: '#f59e0b',
      glowRgb: '245, 158, 11',
      lightBg: 'bg-amber-300',
      lightBorder: 'border-amber-100',
      shadowColor: '#f59e0b',
      textCol: 'text-amber-400'
    },
    '4000K': {
      name: 'Neutral White (4000K)',
      hex: '#fef08a',
      glowRgb: '254, 240, 138',
      lightBg: 'bg-yellow-200',
      lightBorder: 'border-yellow-50',
      shadowColor: '#fef08a',
      textCol: 'text-yellow-300'
    },
    '6500K': {
      name: 'Cool Daylight (6500K)',
      hex: '#38bdf8',
      glowRgb: '56, 189, 248',
      lightBg: 'bg-sky-300',
      lightBorder: 'border-sky-100',
      shadowColor: '#38bdf8',
      textCol: 'text-sky-300'
    }
  };
  const activeCct = cctColors[cctTemp];

  // Copy success indicator for electrician sheet
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // --- DIMENSION CALCULATIONS ---
  const isFeet = dimensions.unit === 'feet';
  const roomL = dimensions.length || 10;
  const roomW = dimensions.width || 8;

  // Convert room dimensions to meters for physics calculation
  const roomLMeters = isFeet ? roomL * 0.3048 : roomL;
  const roomWMeters = isFeet ? roomW * 0.3048 : roomW;
  const roomLFeet = isFeet ? roomL : roomL * 3.28084;
  const roomWFeet = isFeet ? roomW : roomW * 3.28084;

  // SVG Canvas scale
  const padding = 65;
  const svgWidth = 680;
  const svgHeight = 440;

  const maxRoomDim = Math.max(roomLMeters, roomWMeters);
  const scale = Math.min((svgWidth - padding * 2) / roomLMeters, (svgHeight - padding * 2) / roomWMeters);

  const drawWidth = roomLMeters * scale;
  const drawHeight = roomWMeters * scale;

  const startX = (svgWidth - drawWidth) / 2;
  const startY = (svgHeight - drawHeight) / 2;

  // Grid Cols & Rows
  const gridX = result.gridCols;
  const gridY = result.gridRows;

  // Calculate Fixture Positions in relative meters & SVG coordinates
  const fixturePositions = useMemo(() => {
    const list: {
      id: number;
      row: number;
      col: number;
      relXMeters: number;
      relYMeters: number;
      relXFeet: number;
      relYFeet: number;
      svgX: number;
      svgY: number;
      circuitGroup: number; // 1 or 2
    }[] = [];

    let count = 1;
    for (let r = 0; r < gridY; r++) {
      for (let c = 0; c < gridX; c++) {
        const relXMeters = result.wallOffsetX + c * result.spacingX;
        const relYMeters = result.wallOffsetY + r * result.spacingY;
        const relXFeet = relXMeters * 3.28084;
        const relYFeet = relYMeters * 3.28084;

        const svgX = startX + relXMeters * scale;
        const svgY = startY + relYMeters * scale;

        // Group into alternating circuits for balanced dual-switch control
        const circuitGroup = (r + c) % 2 === 0 ? 1 : 2;

        list.push({
          id: count++,
          row: r + 1,
          col: c + 1,
          relXMeters,
          relYMeters,
          relXFeet,
          relYFeet,
          svgX,
          svgY,
          circuitGroup
        });
      }
    }
    return list;
  }, [gridX, gridY, result, startX, startY, scale]);

  // --- POINT-BY-POINT LUX GRID & UNIFORMITY ANALYSIS ---
  const uniformityAnalysis = useMemo(() => {
    const sampleRows = 12;
    const sampleCols = 16;
    const stepX = roomLMeters / sampleCols;
    const stepY = roomWMeters / sampleRows;

    let minLux = Infinity;
    let maxLux = -Infinity;
    let sumLux = 0;
    let count = 0;

    const matrix: { x: number; y: number; lux: number }[][] = [];

    const H = result.effectiveMountingHeight || 2.2;
    const beamAngleRad = ((fixture.beamAngle || 120) * Math.PI) / 180;
    const maxBeamRadius = Math.tan(beamAngleRad / 2) * H;

    // Approximate nadir intensity I0
    const I0 = (fixture.lumens / (2 * Math.PI * (1 - Math.cos(beamAngleRad / 2)))) * 0.85;

    for (let r = 0; r <= sampleRows; r++) {
      const rowList: { x: number; y: number; lux: number }[] = [];
      const yM = r * stepY;

      for (let c = 0; c <= sampleCols; c++) {
        const xM = c * stepX;

        // Sum direct illuminance from each fixture
        let totalDirectE = 0;
        fixturePositions.forEach(p => {
          const dx = xM - p.relXMeters;
          const dy = yM - p.relYMeters;
          const dist2D = Math.sqrt(dx * dx + dy * dy);
          const dist3D = Math.sqrt(dist2D * dist2D + H * H);
          const cosTheta = H / dist3D;

          if (dist2D <= maxBeamRadius * 1.6) {
            // Lambertian / Cosine cube law decay
            const intensityAtAngle = I0 * Math.pow(cosTheta, 1.8);
            totalDirectE += (intensityAtAngle * cosTheta) / (dist3D * dist3D);
          }
        });

        // Add ambient indirect bounced light
        const ambientLux = result.achievedLux * 0.32;
        const pointLux = Math.round(totalDirectE + ambientLux);

        if (pointLux < minLux) minLux = pointLux;
        if (pointLux > maxLux) maxLux = pointLux;
        sumLux += pointLux;
        count++;

        rowList.push({ x: xM, y: yM, lux: pointLux });
      }
      matrix.push(rowList);
    }

    const avgLux = Math.round(sumLux / Math.max(count, 1));
    const uniformityRatioU0 = Number((minLux / Math.max(avgLux, 1)).toFixed(2));
    const isUniformityGood = uniformityRatioU0 >= 0.60;
    const isUniformityAcceptable = uniformityRatioU0 >= 0.40;

    return {
      minLux: Math.max(minLux, Math.round(result.targetLux * 0.4)),
      maxLux: Math.min(maxLux, Math.round(result.achievedLux * 1.4)),
      avgLux,
      uniformityRatioU0,
      isUniformityGood,
      isUniformityAcceptable,
      matrix
    };
  }, [roomLMeters, roomWMeters, result, fixture, fixturePositions]);

  // Handle Mouse Hover over SVG Room
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseSvgX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const mouseSvgY = ((e.clientY - rect.top) / rect.height) * svgHeight;

    if (
      mouseSvgX >= startX &&
      mouseSvgX <= startX + drawWidth &&
      mouseSvgY >= startY &&
      mouseSvgY <= startY + drawHeight
    ) {
      const relXM = (mouseSvgX - startX) / scale;
      const relYM = (mouseSvgY - startY) / scale;
      const relXFt = relXM * 3.28084;
      const relYFt = relYM * 3.28084;

      // Calculate instant point lux
      let totalDirectE = 0;
      const H = result.effectiveMountingHeight || 2.2;
      const beamAngleRad = ((fixture.beamAngle || 120) * Math.PI) / 180;
      const I0 = (fixture.lumens / (2 * Math.PI * (1 - Math.cos(beamAngleRad / 2)))) * 0.85;

      fixturePositions.forEach(p => {
        const dx = relXM - p.relXMeters;
        const dy = relYM - p.relYMeters;
        const dist2D = Math.sqrt(dx * dx + dy * dy);
        const dist3D = Math.sqrt(dist2D * dist2D + H * H);
        const cosTheta = H / dist3D;
        if (dist2D <= Math.tan(beamAngleRad / 2) * H * 1.6) {
          totalDirectE += (I0 * Math.pow(cosTheta, 1.8) * cosTheta) / (dist3D * dist3D);
        }
      });

      const ambientLux = result.achievedLux * 0.32;
      const pointLux = Math.round(totalDirectE + ambientLux);

      setHoverCoord({
        xMeters: Number(relXM.toFixed(2)),
        yMeters: Number(relYM.toFixed(2)),
        xFeet: Number(relXFt.toFixed(1)),
        yFeet: Number(relYFt.toFixed(1)),
        lux: pointLux,
        distLeft: Number(relXFt.toFixed(1)),
        distTop: Number(relYFt.toFixed(1))
      });
    } else {
      setHoverCoord(null);
    }
  };

  // Helper formatting feet & inches
  const formatFeetInches = (feetVal: number) => {
    const totalInches = Math.round(feetVal * 12);
    const ft = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${ft}' ${inches}"`;
  };

  // Switch board location on West Wall
  const switchBoardSvgX = startX - 18;
  const switchBoardSvgY = startY + drawHeight / 2;

  // Copy Electrician Installation Table
  const copyElectricianTable = () => {
    let text = `======================================================\n`;
    text += `ENGR. MD. SAHIN ALOM - ELECTRICIAN MOUNTING & WIRING GUIDE\n`;
    text += `Project Room: ${roomName}\n`;
    text += `Room Size: ${dimensions.length} ${dimensions.unit} x ${dimensions.width} ${dimensions.unit}\n`;
    text += `Total Fixtures: ${result.roundedFixtureCount} Pcs (${gridX} Columns x ${gridY} Rows)\n`;
    text += `Fixture Model: ${fixture.manufacturer} ${fixture.model} (${fixture.powerWatts}W LED)\n`;
    text += `------------------------------------------------------\n`;
    text += `GRID SPACING (Center to Center):\n`;
    text += `- Wall Offset Left/Right (Sx/2): ${(result.wallOffsetX * (isFeet ? 3.28084 : 1)).toFixed(2)} ${dimensions.unit} (${formatFeetInches(result.wallOffsetX * 3.28084)})\n`;
    text += `- Wall Offset Top/Bottom (Sy/2): ${(result.wallOffsetY * (isFeet ? 3.28084 : 1)).toFixed(2)} ${dimensions.unit} (${formatFeetInches(result.wallOffsetY * 3.28084)})\n`;
    text += `- Fixture Spacing Row (Sx): ${(result.spacingX * (isFeet ? 3.28084 : 1)).toFixed(2)} ${dimensions.unit} (${formatFeetInches(result.spacingX * 3.28084)})\n`;
    text += `- Fixture Spacing Column (Sy): ${(result.spacingY * (isFeet ? 3.28084 : 1)).toFixed(2)} ${dimensions.unit} (${formatFeetInches(result.spacingY * 3.28084)})\n`;
    text += `------------------------------------------------------\n`;
    text += `FIXTURE PLACEMENT MATRIX:\n`;
    fixturePositions.forEach(p => {
      text += `Fix #${p.id} | Row ${p.row}, Col ${p.col} | From Left: ${p.relXFeet.toFixed(1)} ft (${p.relXMeters.toFixed(2)} m) | From Top: ${p.relYFeet.toFixed(1)} ft (${p.relYMeters.toFixed(2)} m) | Circuit: Switch ${p.circuitGroup}\n`;
    });
    text += `------------------------------------------------------\n`;
    text += `WIRING & BREAKER SPECIFICATIONS:\n`;
    text += `- Total Power Load: ${result.totalPowerWatts} Watts\n`;
    text += `- Current Draw (@220V): ${(result.totalPowerWatts / 220).toFixed(2)} Amps\n`;
    text += `- Recommended Cable: 1.5 sqmm BYA Copper Cable\n`;
    text += `- Recommended Circuit Breaker: 6A / 10A Type B SP MCB\n`;
    text += `======================================================\n`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="bg-zinc-900/80 light:bg-white border border-zinc-800 light:border-zinc-200 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-5">
      
      {/* TOOLBAR HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800 light:border-zinc-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl shadow-inner">
              <Eye className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-sans font-bold text-base text-zinc-100 light:text-zinc-900 flex items-center gap-2">
                Layout
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono px-2 py-0.5 rounded-full font-semibold uppercase">
                  CAD + BNBC 2020
                </span>
              </h3>
              <p className="text-xs text-zinc-400 light:text-zinc-500 mt-0.5 font-mono">
                {roomName} ({dimensions.length}{dimensions.unit === 'feet' ? 'ft' : 'm'} × {dimensions.width}{dimensions.unit === 'feet' ? 'ft' : 'm'}) • Grid: {gridX} Cols × {gridY} Rows ({result.roundedFixtureCount} Fixtures)
              </p>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION: 2D vs 3D vs MEASUREMENT */}
        <div className="flex items-center space-x-1.5 bg-zinc-950 light:bg-zinc-100 p-1.5 rounded-2xl border border-zinc-800 light:border-zinc-300 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('2D')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === '2D'
                ? 'bg-amber-500 text-zinc-950 shadow-lg'
                : 'text-zinc-400 light:text-zinc-600 hover:text-zinc-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>2D</span>
          </button>

          <button
            onClick={() => setActiveTab('3D')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === '3D'
                ? 'bg-amber-500 text-zinc-950 shadow-lg'
                : 'text-zinc-400 light:text-zinc-600 hover:text-zinc-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>

          <button
            onClick={() => setActiveTab('electrician')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'electrician'
                ? 'bg-amber-500 text-zinc-950 shadow-lg'
                : 'text-zinc-400 light:text-zinc-600 hover:text-zinc-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Measurement</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: 2D CAD FLOOR PLAN & HEATMAP */}
      {/* ======================================================== */}
      {activeTab === '2D' && (
        <div className="space-y-4">
          
          {/* LAYER TOGGLE BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-zinc-950/60 light:bg-zinc-50 p-2.5 rounded-2xl border border-zinc-800/80 light:border-zinc-200">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-amber-400 transition-colors">
                <input
                  type="checkbox"
                  checked={showCadDimensions}
                  onChange={e => setShowCadDimensions(e.target.checked)}
                  className="rounded accent-amber-500 bg-zinc-800 border-zinc-700"
                />
                <span className="flex items-center gap-1 text-[11px] text-zinc-300 light:text-zinc-700">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" /> CAD Dimension Lines
                </span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-amber-400 transition-colors">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={e => setShowHeatmap(e.target.checked)}
                  className="rounded accent-amber-500 bg-zinc-800 border-zinc-700"
                />
                <span className="flex items-center gap-1 text-[11px] text-zinc-300 light:text-zinc-700">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Lux Heatmap Grid
                </span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-amber-400 transition-colors">
                <input
                  type="checkbox"
                  checked={showBeamCones}
                  onChange={e => setShowBeamCones(e.target.checked)}
                  className="rounded accent-amber-500 bg-zinc-800 border-zinc-700"
                />
                <span className="flex items-center gap-1 text-[11px] text-zinc-300 light:text-zinc-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Photometric Cones ({fixture.beamAngle}°)
                </span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-amber-400 transition-colors">
                <input
                  type="checkbox"
                  checked={showWiringCircuits}
                  onChange={e => setShowWiringCircuits(e.target.checked)}
                  className="rounded accent-amber-500 bg-zinc-800 border-zinc-700"
                />
                <span className="flex items-center gap-1 text-[11px] text-zinc-300 light:text-zinc-700">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Wiring Loops & Switch Board
                </span>
              </label>
            </div>

            {/* HOVER LIVE PROBE READOUT */}
            {hoverCoord ? (
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 rounded-xl text-amber-400 text-[11px] font-mono flex items-center gap-2 animate-pulse">
                <span>📍 Probe: ({hoverCoord.xFeet}ft, {hoverCoord.yFeet}ft)</span>
                <span className="font-bold text-emerald-400">⚡ {hoverCoord.lux} Lux</span>
              </div>
            ) : (
              <span className="text-[10px] text-zinc-500 font-mono">
                💡 Room floor hover to inspect point Lux
              </span>
            )}
          </div>

          {/* 2D SVG CANVAS */}
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2 min-h-[380px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[460px] select-none cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverCoord(null)}
            >
              {/* DEFS & PATTERNS */}
              <defs>
                <pattern id="cad-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
                </pattern>

                <radialGradient id="fixture-aura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="photometric-beam" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.38" />
                  <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* BACKGROUND CAD GRID */}
              <rect width={svgWidth} height={svgHeight} fill="url(#cad-grid-pattern)" />

              {/* HEATMAP COLOR CELLS OVERLAY */}
              {showHeatmap && (
                <g className="opacity-40">
                  {uniformityAnalysis.matrix.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      if (rIdx >= uniformityAnalysis.matrix.length - 1 || cIdx >= row.length - 1) return null;
                      const cellX = startX + cell.x * scale;
                      const cellY = startY + cell.y * scale;
                      const cellW = (roomLMeters / 16) * scale;
                      const cellH = (roomWMeters / 12) * scale;

                      // Color map based on Lux ratio
                      const target = result.targetLux;
                      const ratio = cell.lux / target;
                      let fillColor = '#10b981'; // Green for target
                      if (ratio < 0.6) fillColor = '#3b82f6'; // Blue shadow
                      else if (ratio < 0.85) fillColor = '#06b6d4'; // Cyan
                      else if (ratio > 1.2) fillColor = '#f59e0b'; // Gold bright

                      return (
                        <rect
                          key={`hm-${rIdx}-${cIdx}`}
                          x={cellX}
                          y={cellY}
                          width={cellW}
                          height={cellH}
                          fill={fillColor}
                          opacity="0.25"
                        />
                      );
                    })
                  )}
                </g>
              )}

              {/* ROOM OUTLINE WALL BOUNDARY */}
              <rect
                x={startX}
                y={startY}
                width={drawWidth}
                height={drawHeight}
                fill="none"
                stroke="#3f3f46"
                strokeWidth="3"
                rx="2"
              />

              {/* ROOM CORNER CAD TICK MARKS */}
              {[[startX, startY], [startX + drawWidth, startY], [startX, startY + drawHeight], [startX + drawWidth, startY + drawHeight]].map((pt, idx) => (
                <g key={`corner-${idx}`}>
                  <line x1={pt[0] - 8} y1={pt[1]} x2={pt[0] + 8} y2={pt[1]} stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1={pt[0]} y1={pt[1] - 8} x2={pt[0]} y2={pt[1] + 8} stroke="#f59e0b" strokeWidth="1.5" />
                </g>
              ))}

              {/* WIRING LOOPS TO SWITCH BOARD */}
              {showWiringCircuits && (
                <g>
                  {/* Switch Board Icon on West Wall */}
                  <rect
                    x={switchBoardSvgX - 10}
                    y={switchBoardSvgY - 14}
                    width="14"
                    height="28"
                    fill="#0284c7"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    rx="3"
                  />
                  <text
                    x={switchBoardSvgX - 16}
                    y={switchBoardSvgY + 3}
                    fill="#38bdf8"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    SB (Switch Board)
                  </text>

                  {/* Wiring paths for Circuit Group 1 */}
                  {fixturePositions.filter(f => f.circuitGroup === 1).map((f, idx, arr) => {
                    const prev = idx === 0 ? { svgX: switchBoardSvgX, svgY: switchBoardSvgY } : arr[idx - 1];
                    return (
                      <line
                        key={`w1-${f.id}`}
                        x1={prev.svgX}
                        y1={prev.svgY}
                        x2={f.svgX}
                        y2={f.svgY}
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.8"
                      />
                    );
                  })}

                  {/* Wiring paths for Circuit Group 2 */}
                  {fixturePositions.filter(f => f.circuitGroup === 2).map((f, idx, arr) => {
                    const prev = idx === 0 ? { svgX: switchBoardSvgX, svgY: switchBoardSvgY } : arr[idx - 1];
                    return (
                      <line
                        key={`w2-${f.id}`}
                        x1={prev.svgX}
                        y1={prev.svgY}
                        x2={f.svgX}
                        y2={f.svgY}
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.8"
                      />
                    );
                  })}
                </g>
              )}

              {/* PHOTOMETRIC CONES OVERLAY */}
              {showBeamCones &&
                fixturePositions.map(p => {
                  const coneRadius = Math.max(Math.tan(((fixture.beamAngle / 2) * Math.PI) / 180) * result.effectiveMountingHeight * scale, 18);
                  const isTube = fixture.type === 'Tube' || fixture.model.toLowerCase().includes('tube') || fixture.model.toLowerCase().includes('batten');
                  const isPanel = fixture.type === 'LED Panel';

                  if (isTube) {
                    return (
                      <ellipse
                        key={`cone-${p.id}`}
                        cx={p.svgX}
                        cy={p.svgY}
                        rx={coneRadius * 1.3}
                        ry={coneRadius * 0.7}
                        fill="url(#photometric-beam)"
                      />
                    );
                  }

                  if (isPanel) {
                    return (
                      <rect
                        key={`cone-${p.id}`}
                        x={p.svgX - coneRadius * 0.9}
                        y={p.svgY - coneRadius * 0.9}
                        width={coneRadius * 1.8}
                        height={coneRadius * 1.8}
                        rx="12"
                        fill="url(#photometric-beam)"
                      />
                    );
                  }

                  return (
                    <circle
                      key={`cone-${p.id}`}
                      cx={p.svgX}
                      cy={p.svgY}
                      r={coneRadius}
                      fill="url(#photometric-beam)"
                    />
                  );
                })}

              {/* CAD DIMENSION EXTENSION LINES & LABELS */}
              {showCadDimensions && (
                <g className="font-mono text-[10px]">
                  {/* Top Length Dimension */}
                  <line x1={startX} y1={startY - 22} x2={startX + drawWidth} y2={startY - 22} stroke="#71717a" strokeWidth="1" />
                  <line x1={startX} y1={startY - 28} x2={startX} y2={startY - 16} stroke="#71717a" strokeWidth="1" />
                  <line x1={startX + drawWidth} y1={startY - 28} x2={startX + drawWidth} y2={startY - 16} stroke="#71717a" strokeWidth="1" />
                  <text x={startX + drawWidth / 2} y={startY - 26} fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">
                    Length (L): {dimensions.length} {dimensions.unit} ({roomLMeters.toFixed(2)}m)
                  </text>

                  {/* Left Width Dimension */}
                  <line x1={startX - 22} y1={startY} x2={startX - 22} y2={startY + drawHeight} stroke="#71717a" strokeWidth="1" />
                  <line x1={startX - 28} y1={startY} x2={startX - 16} y2={startY} stroke="#71717a" strokeWidth="1" />
                  <line x1={startX - 28} y1={startY + drawHeight} x2={startX - 16} y2={startY + drawHeight} stroke="#71717a" strokeWidth="1" />
                  <text
                    x={startX - 28}
                    y={startY + drawHeight / 2}
                    fill="#f59e0b"
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="bold"
                    transform={`rotate(-90 ${startX - 28} ${startY + drawHeight / 2})`}
                  >
                    Width (W): {dimensions.width} {dimensions.unit} ({roomWMeters.toFixed(2)}m)
                  </text>

                  {/* Bottom Wall Offset & Spacing Annotation */}
                  <line x1={startX} y1={startY + drawHeight + 16} x2={startX + result.wallOffsetX * scale} y2={startY + drawHeight + 16} stroke="#38bdf8" strokeWidth="1" />
                  <text
                    x={startX + (result.wallOffsetX * scale) / 2}
                    y={startY + drawHeight + 30}
                    fill="#38bdf8"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    Sx/2: {(result.wallOffsetX * (isFeet ? 3.28084 : 1)).toFixed(1)}{isFeet ? "'" : 'm'}
                  </text>

                  {gridX > 1 && (
                    <g>
                      <line
                        x1={startX + result.wallOffsetX * scale}
                        y1={startY + drawHeight + 16}
                        x2={startX + (result.wallOffsetX + result.spacingX) * scale}
                        y2={startY + drawHeight + 16}
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                      <text
                        x={startX + (result.wallOffsetX + result.spacingX / 2) * scale}
                        y={startY + drawHeight + 30}
                        fill="#f59e0b"
                        fontSize="9"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        Sx: {(result.spacingX * (isFeet ? 3.28084 : 1)).toFixed(1)}{isFeet ? "'" : 'm'}
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* FIXTURE ICONS & CROSSHAIR CROSS MARKS */}
              {fixturePositions.map(p => {
                const isSelected = selectedFixtureId === p.id;
                return (
                  <g
                    key={`fixture-${p.id}`}
                    onClick={() => setSelectedFixtureId(isSelected ? null : p.id)}
                    className="cursor-pointer group"
                  >
                    {/* Glowing Aura */}
                    <circle cx={p.svgX} cy={p.svgY} r={isSelected ? 16 : 12} fill="url(#fixture-aura)" />

                    {/* Crosshair Center Symbol */}
                    <line x1={p.svgX - 10} y1={p.svgY} x2={p.svgX + 10} y2={p.svgY} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1={p.svgX} y1={p.svgY - 10} x2={p.svgX} y2={p.svgY + 10} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Geometry representation */}
                    {(() => {
                      const isTube = fixture.type === 'Tube' || fixture.model.toLowerCase().includes('tube') || fixture.model.toLowerCase().includes('batten');
                      const isPanel = fixture.type === 'LED Panel';
                      const isSpot = fixture.type === 'Spotlight';

                      if (isTube) {
                        return (
                          <g>
                            <rect
                              x={p.svgX - 22}
                              y={p.svgY - 5}
                              width="44"
                              height="10"
                              rx="5"
                              fill="#18181b"
                              stroke={p.circuitGroup === 1 ? '#10b981' : '#f59e0b'}
                              strokeWidth="1.5"
                            />
                            <line
                              x1={p.svgX - 17}
                              y1={p.svgY}
                              x2={p.svgX + 17}
                              y2={p.svgY}
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            <rect x={p.svgX - 22} y={p.svgY - 3} width="3" height="6" fill="#a1a1aa" />
                            <rect x={p.svgX + 19} y={p.svgY - 3} width="3" height="6" fill="#a1a1aa" />
                          </g>
                        );
                      }

                      if (isPanel) {
                        return (
                          <g>
                            <rect
                              x={p.svgX - 10}
                              y={p.svgY - 10}
                              width="20"
                              height="20"
                              rx="2"
                              fill="#18181b"
                              stroke={p.circuitGroup === 1 ? '#10b981' : '#f59e0b'}
                              strokeWidth="1.5"
                            />
                            <rect
                              x={p.svgX - 7}
                              y={p.svgY - 7}
                              width="14"
                              height="14"
                              rx="1"
                              fill={p.circuitGroup === 1 ? '#10b981' : '#f59e0b'}
                              opacity="0.8"
                            />
                            <line x1={p.svgX - 7} y1={p.svgY} x2={p.svgX + 7} y2={p.svgY} stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                            <line x1={p.svgX} y1={p.svgY - 7} x2={p.svgX} y2={p.svgY + 7} stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                          </g>
                        );
                      }

                      if (isSpot) {
                        return (
                          <g>
                            <circle
                              cx={p.svgX}
                              cy={p.svgY}
                              r="8"
                              fill="#18181b"
                              stroke={p.circuitGroup === 1 ? '#10b981' : '#f59e0b'}
                              strokeWidth="1.5"
                            />
                            <circle
                              cx={p.svgX}
                              cy={p.svgY}
                              r="4"
                              fill={p.circuitGroup === 1 ? '#10b981' : '#f59e0b'}
                            />
                            <circle cx={p.svgX} cy={p.svgY} r="1.5" fill="#ffffff" />
                          </g>
                        );
                      }

                      return (
                        <circle
                          cx={p.svgX}
                          cy={p.svgY}
                          r="8"
                          fill={p.circuitGroup === 1 ? '#10b981' : '#f59e0b'}
                          stroke="#18181b"
                          strokeWidth="1.5"
                        />
                      );
                    })()}

                    {/* Fixture Number Tag */}
                    <text
                      x={p.svgX}
                      y={p.svgY - 12}
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="drop-shadow"
                    >
                      F{p.id}
                    </text>
                  </g>
                );
              })}

              {/* HOVER / PROBE TARGET RING */}
              {hoverCoord && (
                <g>
                  <circle
                    cx={startX + hoverCoord.xMeters * scale}
                    cy={startY + hoverCoord.yMeters * scale}
                    r="8"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                  <circle
                    cx={startX + hoverCoord.xMeters * scale}
                    cy={startY + hoverCoord.yMeters * scale}
                    r="3"
                    fill="#38bdf8"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* SELECTED FIXTURE CARD POPUP */}
          {selectedFixtureId && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between text-xs font-mono text-amber-200">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Selected Fixture <strong>#F{selectedFixtureId}</strong>: Assigned to Switch Group {selectedFixtureId % 2 === 0 ? '2' : '1'}. Distance from Left Wall: {(fixturePositions[selectedFixtureId - 1].relXFeet).toFixed(1)}ft ({(fixturePositions[selectedFixtureId - 1].relXMeters).toFixed(2)}m).
                </span>
              </div>
              <button
                onClick={() => setSelectedFixtureId(null)}
                className="text-amber-400 hover:text-white font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: 3D INTERACTIVE REALISTIC ROOM STUDIO */}
      {/* ======================================================== */}
      {activeTab === '3D' && (
        <div className="space-y-4">
          
          {/* 3D LIGHTING & ENVIRONMENT CONTROL BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-950/90 light:bg-zinc-50 rounded-2xl border border-zinc-800 light:border-zinc-200 text-xs font-mono">
            
            {/* LIGHT SWITCH & DIMMER SLIDER */}
            <div className="flex flex-wrap items-center gap-3">
              {/* ON/OFF TOGGLE */}
              <button
                onClick={() => setIs3DLightsOn(!is3DLightsOn)}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-md ${
                  is3DLightsOn
                    ? 'bg-amber-500 text-zinc-950 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${is3DLightsOn ? 'fill-zinc-950' : ''}`} />
                <span>{is3DLightsOn ? 'Lights: ON' : 'Lights: OFF'}</span>
              </button>

              {/* DIMMER SLIDER */}
              <div className="flex items-center space-x-2 bg-zinc-900 light:bg-zinc-200 px-3 py-1 rounded-xl border border-zinc-800 light:border-zinc-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-zinc-400 text-[11px]">Dimmer:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={is3DLightsOn ? dimmerLevel : 0}
                  disabled={!is3DLightsOn}
                  onChange={e => setDimmerLevel(Number(e.target.value))}
                  className="w-18 sm:w-24 accent-amber-500 disabled:opacity-40"
                />
                <span className="font-bold text-amber-400 text-[11px] min-w-[32px]">
                  {is3DLightsOn ? `${dimmerLevel}%` : '0%'}
                </span>
              </div>

              {/* CCT COLOR SELECTOR */}
              <div className="flex items-center space-x-1 bg-zinc-900 light:bg-zinc-200 p-1 rounded-xl border border-zinc-800 light:border-zinc-300">
                {(['3000K', '4000K', '6500K'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setCctTemp(k)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      cctTemp === k
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* DAY / NIGHT TOGGLE */}
              <button
                onClick={() => setIsNightEnvironment(!isNightEnvironment)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 transition-all cursor-pointer border ${
                  isNightEnvironment
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isNightEnvironment ? 'Night' : 'Day'}</span>
              </button>
            </div>

            {/* 3D CAMERA & FURNITURE TOGGLES */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-zinc-300 light:text-zinc-700">
                <input
                  type="checkbox"
                  checked={showVolumetricBeams}
                  onChange={e => setShowVolumetricBeams(e.target.checked)}
                  className="rounded accent-amber-500 bg-zinc-800"
                />
                <span>Light Beams</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-zinc-300 light:text-zinc-700">
                <input
                  type="checkbox"
                  checked={show3DFurniture}
                  onChange={e => setShow3DFurniture(e.target.checked)}
                  className="rounded accent-amber-500 bg-zinc-800"
                />
                <span>Furniture</span>
              </label>

              {/* PRESET VIEWS */}
              <div className="flex items-center space-x-1">
                {[
                  { name: 'Iso 3D', a: 42, p: 50 },
                  { name: 'Front', a: 0, p: 20 },
                  { name: 'Top', a: 0, p: 85 }
                ].map(p => (
                  <button
                    key={p.name}
                    onClick={() => { setAzimuth3D(p.a); setPitch3D(p.p); }}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* REALTIME LUX STATS BADGE IN 3D MODE */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono px-1 text-zinc-400">
            <span>
              Real-time Ambient Lux: <strong className={activeCct.textCol}>{is3DLightsOn ? Math.round(result.achievedLux * (dimmerLevel / 100)) : 10} Lux ({activeCct.name})</strong>
            </span>
            <span>
              Active Fixtures: <strong className="text-emerald-400">{is3DLightsOn ? result.roundedFixtureCount : 0} / {result.roundedFixtureCount} Pcs LED</strong>
            </span>
          </div>

          {/* 3D CANVAS STAGE */}
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-8 min-h-[460px] flex flex-col items-center justify-center select-none">
            
            {/* AMBIENT GLOW BACKDROP REFLECTION */}
            <div
              className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
              style={{
                background: is3DLightsOn
                  ? `radial-gradient(circle at 50% 30%, rgba(${activeCct.glowRgb}, ${0.22 * (dimmerLevel / 100)}), transparent 75%)`
                  : 'none'
              }}
            />

            {/* 3D ROOM CONTAINER WITH CSS ROTATION & PERSPECTIVE */}
            {(() => {
              const boxW = 380; // px
              const boxD = 280; // px
              const boxH = 150; // wall height px
              const isTopView = pitch3D >= 72;

              return (
                <div
                  className="relative transition-transform duration-200"
                  style={{
                    width: `${boxW}px`,
                    height: `${boxD}px`,
                    transform: `perspective(1000px) rotateX(${pitch3D}deg) rotateZ(${azimuth3D}deg) scale(${zoom3D})`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  
                  {/* === FLOOR PLAN SURFACE === */}
                  <div
                    className={`absolute inset-0 rounded-2xl border-2 transition-colors duration-500 shadow-2xl overflow-hidden ${
                      isNightEnvironment
                        ? 'bg-zinc-900 border-zinc-700'
                        : 'bg-zinc-200 border-zinc-300'
                    }`}
                    style={{
                      transform: 'translateZ(0px)',
                      boxShadow: is3DLightsOn
                        ? `0 0 ${45 * (dimmerLevel / 100)}px rgba(${activeCct.glowRgb}, ${0.35 * (dimmerLevel / 100)})`
                        : 'none'
                    }}
                  >
                    {/* FLOOR HARDWOOD TILE GRID LINES */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                      }}
                    />

                    {/* ILLUMINATION HOTSPOTS ON THE FLOOR BENEATH FIXTURES */}
                    {is3DLightsOn &&
                      fixturePositions.map(p => {
                        const isTube = fixture.type === 'Tube' || fixture.model.toLowerCase().includes('tube') || fixture.model.toLowerCase().includes('batten');
                        const isPanel = fixture.type === 'LED Panel';

                        return (
                          <div
                            key={`floor-spot-${p.id}`}
                            className="absolute pointer-events-none blur-md transition-opacity duration-300"
                            style={{
                              left: `${(p.relXMeters / roomLMeters) * 100}%`,
                              top: `${(p.relYMeters / roomWMeters) * 100}%`,
                              width: isTube ? '170px' : isPanel ? '130px' : '100px',
                              height: isTube ? '70px' : isPanel ? '130px' : '100px',
                              borderRadius: isTube ? '35px' : isPanel ? '20px' : '50%',
                              transform: 'translate(-50%, -50%)',
                              background: `radial-gradient(circle, rgba(${activeCct.glowRgb}, ${0.75 * (dimmerLevel / 100)}) 0%, rgba(${activeCct.glowRgb}, ${0.25 * (dimmerLevel / 100)}) 50%, transparent 100%)`
                            }}
                          />
                        );
                      })}

                    {/* WORK DESK & COMPUTER FURNITURE */}
                    {show3DFurniture && (
                      <div
                        className="absolute left-[20%] top-[25%] w-[38%] h-[42%] bg-amber-950/90 border-2 border-amber-800 rounded-xl shadow-2xl p-2 flex flex-col justify-between"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        {/* Desk Surface */}
                        <div className="flex justify-between items-center text-[8px] font-mono text-amber-200">
                          <span className="font-bold">Work Desk</span>
                          <span className="text-emerald-400 font-bold">{Math.round((result.achievedLux * dimmerLevel) / 100)} Lux</span>
                        </div>

                        {/* Laptop Screen & Keyboard */}
                        <div className="w-10 h-7 bg-zinc-950 border border-zinc-700 rounded mx-auto flex flex-col items-center justify-center p-0.5">
                          <div className="w-8 h-4 bg-sky-500/30 rounded text-[6px] text-center font-mono text-sky-200 flex items-center justify-center">
                            CAD PLAN
                          </div>
                        </div>

                        {/* Chair */}
                        <div className="w-7 h-7 bg-zinc-800 border border-zinc-600 rounded-full mx-auto shadow-md" />
                      </div>
                    )}
                  </div>

                  {/* === BACK WALL WITH WINDOW & BLUEPRINT ART === */}
                  <div
                    className="absolute left-0 right-0 bg-gradient-to-b from-zinc-800 via-zinc-850 to-zinc-900 border-t-2 border-x-2 border-zinc-700 rounded-t-xl p-3 flex items-center justify-around shadow-inner transition-all duration-300 pointer-events-none"
                    style={{
                      top: `-${boxH}px`,
                      height: `${boxH}px`,
                      transformOrigin: 'bottom center',
                      transform: isTopView ? 'rotateX(0deg) translateY(150px) opacity(0.2)' : 'rotateX(90deg)',
                      opacity: isTopView ? 0.2 : 0.95
                    }}
                  >
                    {/* Window to Outdoors */}
                    <div className="w-20 h-14 bg-sky-950 border-2 border-zinc-600 rounded-lg flex flex-col justify-between overflow-hidden relative shadow-lg">
                      <div className={`inset-0 absolute transition-colors ${isNightEnvironment ? 'bg-indigo-950' : 'bg-sky-400'}`}>
                        {isNightEnvironment ? (
                          <div className="text-[8px] text-amber-200 p-1 font-mono">🌙 Night Sky</div>
                        ) : (
                          <div className="text-[8px] text-amber-900 p-1 font-mono font-bold">☀️ Daylight</div>
                        )}
                      </div>
                      <div className="w-full h-1/2 border-b border-zinc-600 z-10" />
                      <div className="h-full w-1/2 border-r border-zinc-600 z-10 absolute left-0" />
                    </div>

                    {/* Wall Clock */}
                    <div className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-zinc-600 flex items-center justify-center text-[7px] font-mono text-amber-400 font-bold shadow">
                      12:00
                    </div>

                    {/* Wall Blueprint Poster */}
                    <div className="w-18 h-12 bg-sky-950/60 border border-sky-500/50 rounded-lg p-1 text-[7px] font-mono text-sky-300 shadow">
                      BNBC 2020
                      <br />
                      ILLUMINATION
                    </div>
                  </div>

                  {/* === LEFT WALL WITH DOOR & SWITCHBOARD === */}
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-zinc-800 via-zinc-850 to-zinc-900 border-l-2 border-y-2 border-zinc-700 rounded-l-xl p-2.5 flex flex-col justify-around shadow-inner transition-all duration-300 pointer-events-none"
                    style={{
                      left: `-${boxH}px`,
                      width: `${boxH}px`,
                      transformOrigin: 'right center',
                      transform: isTopView ? 'rotateY(0deg) translateX(150px) opacity(0.2)' : 'rotateY(-90deg)',
                      opacity: isTopView ? 0.2 : 0.95
                    }}
                  >
                    {/* Door Frame */}
                    {show3DFurniture && (
                      <div className="w-12 h-20 border-2 border-amber-800/80 bg-zinc-950/80 rounded-t-lg p-1 flex flex-col justify-between">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      </div>
                    )}

                    {/* Wall Mounted Switch Board */}
                    <div className="w-10 h-12 bg-zinc-950 border-2 border-sky-400 rounded-lg p-1 flex flex-col items-center justify-between shadow-xl">
                      <span className="text-[6px] font-mono text-sky-400 font-bold">SWITCH</span>
                      <button
                        onClick={() => setIs3DLightsOn(!is3DLightsOn)}
                        className={`w-6 h-4 rounded transition-colors pointer-events-auto cursor-pointer ${
                          is3DLightsOn ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-zinc-700'
                        }`}
                      />
                    </div>
                  </div>

                  {/* === RIGHT WALL WITH AC UNIT & CERTIFICATE === */}
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-l from-zinc-800 via-zinc-850 to-zinc-900 border-r-2 border-y-2 border-zinc-700 rounded-r-xl p-2.5 flex flex-col justify-around shadow-inner transition-all duration-300 pointer-events-none"
                    style={{
                      left: `${boxW}px`,
                      width: `${boxH}px`,
                      transformOrigin: 'left center',
                      transform: isTopView ? 'rotateY(0deg) translateX(-150px) opacity(0.2)' : 'rotateY(90deg)',
                      opacity: isTopView ? 0.2 : 0.95
                    }}
                  >
                    {/* AC Unit */}
                    <div className="w-20 h-7 bg-zinc-100 border border-zinc-400 rounded-lg p-1 flex items-center justify-between text-[7px] font-mono text-zinc-900 shadow">
                      <span className="font-bold">ENGINEERS</span>
                      <span className="bg-emerald-500 text-zinc-950 font-bold px-1 rounded">24°C</span>
                    </div>

                    {/* Decorative Frame */}
                    <div className="w-16 h-12 border-2 border-amber-500/40 bg-zinc-950/60 rounded p-1 text-[7px] font-mono text-amber-300">
                      LUX VERIFIED
                    </div>
                  </div>

                  {/* === VOLUMETRIC LIGHT BEAMS (CEILING TO FLOOR) === */}
                  {is3DLightsOn &&
                    showVolumetricBeams &&
                    fixturePositions.map(p => {
                      const leftPct = (p.relXMeters / roomLMeters) * 100;
                      const topPct = (p.relYMeters / roomWMeters) * 100;
                      const beamOpacity = 0.4 * (dimmerLevel / 100);
                      const isTube = fixture.type === 'Tube' || fixture.model.toLowerCase().includes('tube') || fixture.model.toLowerCase().includes('batten');

                      return (
                        <div
                          key={`beam-3d-${p.id}`}
                          className="absolute pointer-events-none transition-opacity duration-300"
                          style={{
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            width: '0px',
                            height: '0px'
                          }}
                        >
                          {/* 3D Beam Gradient Mesh */}
                          <div
                            className={`${isTube ? 'w-36 sm:w-44 h-[200px] rounded-b-2xl' : 'w-28 h-[200px] rounded-b-full'} shadow-lg`}
                            style={{
                              transform: 'translate(-50%, -100%) rotateX(-90deg)',
                              transformOrigin: 'bottom center',
                              opacity: beamOpacity,
                              background: `linear-gradient(to bottom, rgba(${activeCct.glowRgb}, 0.85), rgba(${activeCct.glowRgb}, 0.15) 70%, transparent 100%)`
                            }}
                          />
                        </div>
                      );
                    })}

                  {/* === CEILING PLANE WITH RECESSED FIXTURES === */}
                  <div
                    className={`absolute inset-0 border-2 rounded-2xl p-2 transition-all duration-300 flex items-center justify-center ${
                      isTopView
                        ? 'bg-amber-500/5 border-amber-500/30'
                        : 'bg-zinc-900/40 backdrop-blur-[1px] border-amber-500/40 shadow-2xl'
                    }`}
                    style={{
                      transform: `translateZ(${boxH}px)`
                    }}
                  >
                    {/* Ceiling Grid Tiles */}
                    <div
                      className="absolute inset-0 rounded-xl grid gap-2 p-2"
                      style={{
                        gridTemplateColumns: `repeat(${gridX}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${gridY}, minmax(0, 1fr))`
                      }}
                    >
                      {fixturePositions.map(p => {
                        const isTube = fixture.type === 'Tube' || fixture.model.toLowerCase().includes('tube') || fixture.model.toLowerCase().includes('batten');
                        const isPanel = fixture.type === 'LED Panel';
                        const isSpot = fixture.type === 'Spotlight' || fixture.type === 'Downlight';

                        return (
                          <div
                            key={`ceil-fix-${p.id}`}
                            className="flex flex-col items-center justify-center relative group cursor-pointer"
                            onClick={() => setSelectedFixtureId(p.id)}
                          >
                            {isTube ? (
                              /* Tube Light Fixture: Long Batten bar */
                              <div
                                className={`w-14 sm:w-18 h-4 sm:h-5 rounded-full border-2 px-1 py-0.5 flex items-center justify-between transition-all duration-300 ${
                                  is3DLightsOn
                                    ? `${activeCct.lightBg} ${activeCct.lightBorder}`
                                    : 'bg-zinc-800 border-zinc-600'
                                }`}
                                style={{
                                  boxShadow: is3DLightsOn
                                    ? `0 0 ${20 * (dimmerLevel / 100)}px ${activeCct.hex}`
                                    : 'none'
                                }}
                              >
                                <div className={`w-full h-1.5 sm:h-2 rounded-full transition-colors ${is3DLightsOn ? 'bg-white shadow-[0_0_8px_#ffffff]' : 'bg-zinc-600'}`} />
                                <span className={`text-[7px] font-mono font-bold ml-1 ${is3DLightsOn ? 'text-zinc-950' : 'text-zinc-400'}`}>
                                  F{p.id}
                                </span>
                              </div>
                            ) : isPanel ? (
                              /* Square Panel Tile */
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 p-0.5 flex items-center justify-center transition-all duration-300 ${
                                  is3DLightsOn
                                    ? `${activeCct.lightBg} ${activeCct.lightBorder}`
                                    : 'bg-zinc-800 border-zinc-600'
                                }`}
                                style={{
                                  boxShadow: is3DLightsOn
                                    ? `0 0 ${22 * (dimmerLevel / 100)}px ${activeCct.hex}`
                                    : 'none'
                                }}
                              >
                                <div className={`w-full h-full rounded border border-dashed flex items-center justify-center ${is3DLightsOn ? 'bg-white/80 border-amber-300' : 'bg-zinc-700 border-zinc-600'}`}>
                                  <span className={`text-[8px] font-mono font-bold ${is3DLightsOn ? 'text-zinc-950' : 'text-zinc-400'}`}>
                                    F{p.id}
                                  </span>
                                </div>
                              </div>
                            ) : isSpot ? (
                              /* Round Downlight / Spotlight */
                              <div
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 p-1 flex items-center justify-center transition-all duration-300 ${
                                  is3DLightsOn
                                    ? `${activeCct.lightBg} ${activeCct.lightBorder}`
                                    : 'bg-zinc-800 border-zinc-600'
                                }`}
                                style={{
                                  boxShadow: is3DLightsOn
                                    ? `0 0 ${20 * (dimmerLevel / 100)}px ${activeCct.hex}`
                                    : 'none'
                                }}
                              >
                                <div className={`w-3 h-3 rounded-full ${is3DLightsOn ? 'bg-white' : 'bg-zinc-600'}`} />
                              </div>
                            ) : (
                              /* Default / High Bay Fixture Box */
                              <div
                                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                                  is3DLightsOn
                                    ? `${activeCct.lightBg} ${activeCct.lightBorder}`
                                    : 'bg-zinc-800 border-zinc-600'
                                }`}
                                style={{
                                  boxShadow: is3DLightsOn
                                    ? `0 0 ${22 * (dimmerLevel / 100)}px ${activeCct.hex}`
                                    : 'none'
                                }}
                              >
                                <span className={`text-[8px] font-mono font-bold ${is3DLightsOn ? 'text-zinc-950' : 'text-zinc-400'}`}>
                                  F{p.id}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* ROTATION SLIDERS FOOTER */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400 bg-zinc-900/80 p-2.5 rounded-2xl border border-zinc-800">
              <div className="flex items-center space-x-2">
                <span>Orbit Rotate:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={azimuth3D}
                  onChange={e => setAzimuth3D(Number(e.target.value))}
                  className="w-28 accent-amber-500"
                />
                <span className="font-bold text-amber-400">{azimuth3D}°</span>
              </div>

              <div className="flex items-center space-x-2">
                <span>Tilt Elevation:</span>
                <input
                  type="range"
                  min="10"
                  max="85"
                  value={pitch3D}
                  onChange={e => setPitch3D(Number(e.target.value))}
                  className="w-28 accent-amber-500"
                />
                <span className="font-bold text-amber-400">{pitch3D}°</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ELECTRICIAN MOUNTING & WIRING GUIDE */}
      {/* ======================================================== */}
      {activeTab === 'electrician' && (
        <div className="space-y-5">
          
          {/* HEADER & COPY BUTTON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl">
            <div>
              <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <Wrench className="w-4 h-4" /> ইলেকট্রিশিয়ান ইনস্টলেশন ব্লুপ্রিন্ট (Site Mounting Sheet)
              </h4>
              <p className="text-xs text-zinc-300 mt-1">
                ভবনের যেকোনো ইলেকট্রিশিয়ান এই সিট দেখে দেয়ালে দাগ কেটে নিখুঁতভাবে ড্রিল করে লাইট ফিটিং করতে পারবেন।
              </p>
            </div>

            <button
              onClick={copyElectricianTable}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'কপি হয়েছে!' : 'মেজারমেন্ট কপি করুন'}</span>
            </button>
          </div>

          {/* CRITICAL GRID SPACING SUMMARY BOXES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3.5 bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">বাম/ডান দেয়াল থেকে দূরত্ব (Sx/2)</span>
              <div className="text-lg font-mono font-black text-amber-400 mt-1">
                {formatFeetInches(result.wallOffsetX * 3.28084)}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5 font-semibold">
                ({(result.wallOffsetX * (isFeet ? 3.28084 : 1)).toFixed(2)} {dimensions.unit})
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">উপর/নিচ দেয়াল থেকে দূরত্ব (Sy/2)</span>
              <div className="text-lg font-mono font-black text-amber-400 mt-1">
                {formatFeetInches(result.wallOffsetY * 3.28084)}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5 font-semibold">
                ({(result.wallOffsetY * (isFeet ? 3.28084 : 1)).toFixed(2)} {dimensions.unit})
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">পরপর দুই লাইটের দূরত্ব (Sx)</span>
              <div className="text-lg font-mono font-black text-emerald-400 mt-1">
                {formatFeetInches(result.spacingX * 3.28084)}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5 font-semibold">
                ({(result.spacingX * (isFeet ? 3.28084 : 1)).toFixed(2)} {dimensions.unit})
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">সারি থেকে সারির দূরত্ব (Sy)</span>
              <div className="text-lg font-mono font-black text-emerald-400 mt-1">
                {formatFeetInches(result.spacingY * 3.28084)}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block mt-0.5 font-semibold">
                ({(result.spacingY * (isFeet ? 3.28084 : 1)).toFixed(2)} {dimensions.unit})
              </span>
            </div>

          </div>

          {/* DETAILED FIXTURE PLACEMENT MATRIX TABLE */}
          <div className="overflow-x-auto bg-zinc-950 light:bg-zinc-50 border border-zinc-800 light:border-zinc-200 rounded-2xl p-2">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 light:border-zinc-300 text-zinc-400 light:text-zinc-600 bg-zinc-900/60 light:bg-zinc-200">
                  <th className="p-2.5">Fixture #</th>
                  <th className="p-2.5">Grid (Col × Row)</th>
                  <th className="p-2.5">From Left Wall (ft & in)</th>
                  <th className="p-2.5">From Top Wall (ft & in)</th>
                  <th className="p-2.5">Metric (m)</th>
                  <th className="p-2.5">Switch Loop Group</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 light:divide-zinc-200 text-zinc-200 light:text-zinc-800">
                {fixturePositions.map(p => (
                  <tr key={`el-row-${p.id}`} className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-2.5 font-bold text-amber-400">#F{p.id}</td>
                    <td className="p-2.5">Col {p.col}, Row {p.row}</td>
                    <td className="p-2.5 font-bold text-emerald-400">{formatFeetInches(p.relXFeet)} ({p.relXFeet.toFixed(1)} ft)</td>
                    <td className="p-2.5 font-bold text-emerald-400">{formatFeetInches(p.relYFeet)} ({p.relYFeet.toFixed(1)} ft)</td>
                    <td className="p-2.5 text-zinc-400">({p.relXMeters.toFixed(2)}m, {p.relYMeters.toFixed(2)}m)</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.circuitGroup === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        Switch Group {p.circuitGroup}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* WIRING & ELECTRICAL SAFETY SPECIFICATION */}
          <div className="p-4 bg-zinc-950 light:bg-zinc-100 border border-zinc-800 light:border-zinc-300 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            
            <div className="space-y-1">
              <span className="text-zinc-400 block font-bold">বিদ্যুৎ লোড ও কারেন্ট (Load & Amps):</span>
              <div className="text-amber-400 font-bold">
                {result.totalPowerWatts} Watts • {(result.totalPowerWatts / 220).toFixed(2)} Amps (@220V AC)
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-400 block font-bold">সুপারিশকৃত ক্যাবল সাইজ (Cable Size):</span>
              <div className="text-emerald-400 font-bold">
                1.5 sqmm BYA Copper Cable (BRB / BBS / Eastern Cables)
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-400 block font-bold">সার্কিট ব্রেকার (Circuit Breaker):</span>
              <div className="text-sky-400 font-bold">
                6A / 10A Type B Single Pole MCB
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* LUX UNIFORMITY RATIO & BNBC COMPLIANCE BAR */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/80 light:border-zinc-200 font-mono">
        
        <div className="p-3 bg-zinc-950/60 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold">Min Lux (E-min)</span>
          <div className="text-base font-black text-amber-400 mt-0.5">
            {uniformityAnalysis.minLux} Lux
          </div>
          <span className="text-[9px] text-zinc-500 block">রুমের কোণায় সর্বনিম্ন</span>
        </div>

        <div className="p-3 bg-zinc-950/60 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold">Max Lux (E-max)</span>
          <div className="text-base font-black text-amber-400 mt-0.5">
            {uniformityAnalysis.maxLux} Lux
          </div>
          <span className="text-[9px] text-zinc-500 block">লাইটের নিচে সর্বোচ্চ</span>
        </div>

        <div className="p-3 bg-zinc-950/60 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold">Average Lux (E-avg)</span>
          <div className="text-base font-black text-emerald-400 mt-0.5">
            {uniformityAnalysis.avgLux} Lux
          </div>
          <span className="text-[9px] text-zinc-500 block">টার্গেট: {result.targetLux} Lux</span>
        </div>

        <div className="p-3 bg-zinc-950/60 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-2xl">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold">Uniformity Ratio (U0)</span>
          <div className={`text-base font-black mt-0.5 flex items-center gap-1 ${uniformityAnalysis.isUniformityGood ? 'text-emerald-400' : 'text-amber-400'}`}>
            {uniformityAnalysis.uniformityRatioU0}
            {uniformityAnalysis.isUniformityGood ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
          </div>
          <span className="text-[9px] text-zinc-500 block">BNBC standard: ≥ 0.60</span>
        </div>

      </div>

    </div>
  );
};
