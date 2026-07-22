import React, { useState } from 'react';
import { CalculationResult, FixtureItem, RoomDimensions } from './types';
import { Eye, Grid, Maximize2, Layers, Sparkles, Sun, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [showBeamCones, setShowBeamCones] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; lux: number } | null>(null);

  // Canvas bounds
  const padding = 50;
  const svgWidth = 600;
  const svgHeight = 400;

  const roomL = dimensions.length || 10;
  const roomW = dimensions.width || 8;

  // Scale factor to fit inside SVG canvas
  const maxRoomDim = Math.max(roomL, roomW);
  const scale = (Math.min(svgWidth - padding * 2, svgHeight - padding * 2)) / maxRoomDim;

  const drawWidth = roomL * scale;
  const drawHeight = roomW * scale;

  const startX = (svgWidth - drawWidth) / 2;
  const startY = (svgHeight - drawHeight) / 2;

  // Generate fixture grid points
  const gridX = result.gridCols;
  const gridY = result.gridRows;

  const fixturePositions: { x: number; y: number; relX: number; relY: number }[] = [];

  for (let r = 0; r < gridY; r++) {
    for (let c = 0; c < gridX; c++) {
      const relX = result.wallOffsetX + c * result.spacingX;
      const relY = result.wallOffsetY + r * result.spacingY;
      const x = startX + relX * scale;
      const y = startY + relY * scale;
      fixturePositions.push({ x, y, relX, relY });
    }
  }

  // Handle mouse move over room floor to calculate instant point Lux
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseSvgX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const mouseSvgY = ((e.clientY - rect.top) / rect.height) * svgHeight;

    // Check if within room boundary
    if (
      mouseSvgX >= startX &&
      mouseSvgX <= startX + drawWidth &&
      mouseSvgY >= startY &&
      mouseSvgY <= startY + drawHeight
    ) {
      const roomRelX = (mouseSvgX - startX) / scale; // in meters
      const roomRelY = (mouseSvgY - startY) / scale; // in meters

      // Calculate approximate Lux at (roomRelX, roomRelY) summing point sources
      let totalE = 0;
      const H = result.effectiveMountingHeight || 2.2;
      const I0 = (fixture.lumens / (2 * Math.PI * (1 - Math.cos((fixture.beamAngle * Math.PI) / 360)))) * 0.8;

      fixturePositions.forEach(p => {
        const dx = roomRelX - p.relX;
        const dy = roomRelY - p.relY;
        const dist2D = Math.sqrt(dx * dx + dy * dy);
        const dist3D = Math.sqrt(dist2D * dist2D + H * H);
        const cosTheta = H / dist3D;
        if (dist2D <= Math.tan(((fixture.beamAngle / 2) * Math.PI) / 180) * H * 1.5) {
          totalE += (I0 * Math.pow(cosTheta, 3)) / (dist3D * dist3D);
        }
      });

      // Factor in indirect ambient reflection
      const ambientLux = result.achievedLux * 0.35;
      const estimatedPointLux = Math.min(Math.round(totalE + ambientLux), Math.round(result.achievedLux * 1.4));

      setHoverCoord({
        x: Number(roomRelX.toFixed(2)),
        y: Number(roomRelY.toFixed(2)),
        lux: estimatedPointLux
      });
    } else {
      setHoverCoord(null);
    }
  };

  return (
    <div className="bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-white border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 light:border-zinc-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
              <Eye className="w-4 h-4" />
            </span>
            <h3 className="font-sans font-bold text-sm text-zinc-100 light:text-zinc-900">
              2D & 3D Interactive Room Layout & Lux Uniformity Grid
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 light:text-zinc-500 mt-0.5">
            {roomName} ({dimensions.length}{dimensions.unit === 'feet' ? 'ft' : 'm'} × {dimensions.width}{dimensions.unit === 'feet' ? 'ft' : 'm'}) • Grid: {gridX} Columns × {gridY} Rows ({result.roundedFixtureCount} Fixtures)
          </p>
        </div>

        {/* ARC / LINEAR TOGGLES */}
        <div className="flex items-center space-x-2 bg-zinc-950/80 light:bg-zinc-100 p-1 rounded-xl border border-zinc-800 light:border-zinc-300">
          <button
            onClick={() => setViewMode('2D')}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === '2D'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 light:text-zinc-600'
            }`}
          >
            2D Floor Plan
          </button>
          <button
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === '3D'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200 light:text-zinc-600'
            }`}
          >
            3D Isometric Concept
          </button>
        </div>
      </div>

      {/* TOOLBAR FOR VISUAL LAYERS */}
      {viewMode === '2D' && (
        <div className="flex items-center justify-between mt-3 text-xs text-zinc-400 light:text-zinc-600">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer hover:text-zinc-200">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={e => setShowHeatmap(e.target.checked)}
                className="rounded accent-amber-500 bg-zinc-800 border-zinc-700"
              />
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Lux Heatmap Gradient
              </span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer hover:text-zinc-200">
              <input
                type="checkbox"
                checked={showBeamCones}
                onChange={e => setShowBeamCones(e.target.checked)}
                className="rounded accent-amber-500 bg-zinc-800 border-zinc-700"
              />
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Photometric Beam Cones ({fixture.beamAngle}°)
              </span>
            </label>
          </div>

          {hoverCoord ? (
            <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-mono text-[11px] animate-pulse">
              Point ({hoverCoord.x}m, {hoverCoord.y}m) → <strong>{hoverCoord.lux} Lux</strong>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-zinc-500">Hover over floor to probe Lux</span>
          )}
        </div>
      )}

      {/* SVG CANVAS CONTAINER */}
      <div className="relative mt-4 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-2 min-h-[360px]">
        
        {viewMode === '2D' ? (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto max-h-[420px] select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
          >
            {/* SVG DEFS FOR GRADIENTS AND PATTERNS */}
            <defs>
              <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>

              <radialGradient id="fixture-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="beam-cone-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* CANVAS BACKGROUND GRID */}
            <rect width={svgWidth} height={svgHeight} fill="url(#grid-pattern)" />

            {/* ROOM WALL BOUNDARY */}
            <rect
              x={startX}
              y={startY}
              width={drawWidth}
              height={drawHeight}
              fill={showHeatmap ? 'rgba(245, 158, 11, 0.03)' : 'rgba(24, 24, 27, 0.9)'}
              stroke="#3f3f46"
              strokeWidth="2.5"
              rx="4"
            />

            {/* DIMENSION ANNOTATIONS */}
            {/* Top dimension L */}
            <line x1={startX} y1={startY - 15} x2={startX + drawWidth} y2={startY - 15} stroke="#71717a" strokeWidth="1" />
            <line x1={startX} y1={startY - 20} x2={startX} y2={startY - 10} stroke="#71717a" strokeWidth="1" />
            <line x1={startX + drawWidth} y1={startY - 20} x2={startX + drawWidth} y2={startY - 10} stroke="#71717a" strokeWidth="1" />
            <text x={startX + drawWidth / 2} y={startY - 20} fill="#f59e0b" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Length: {dimensions.length}{dimensions.unit === 'feet' ? 'ft' : 'm'}
            </text>

            {/* Left dimension W */}
            <line x1={startX - 15} y1={startY} x2={startX - 15} y2={startY + drawHeight} stroke="#71717a" strokeWidth="1" />
            <line x1={startX - 20} y1={startY} x2={startX - 10} y2={startY} stroke="#71717a" strokeWidth="1" />
            <line x1={startX - 20} y1={startY + drawHeight} x2={startX - 10} y2={startY + drawHeight} stroke="#71717a" strokeWidth="1" />
            <text
              x={startX - 22}
              y={startY + drawHeight / 2}
              fill="#f59e0b"
              fontSize="11"
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight="bold"
              transform={`rotate(-90 ${startX - 22} ${startY + drawHeight / 2})`}
            >
              Width: {dimensions.width}{dimensions.unit === 'feet' ? 'ft' : 'm'}
            </text>

            {/* WALL SPACING GUIDELINES */}
            {/* X-axis spacing lines */}
            {fixturePositions.length > 0 && (
              <>
                {/* Wall offset X indicator */}
                <line
                  x1={startX}
                  y1={startY + drawHeight + 15}
                  x2={startX + result.wallOffsetX * scale}
                  y2={startY + drawHeight + 15}
                  stroke="#a1a1aa"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x={startX + (result.wallOffsetX * scale) / 2}
                  y={startY + drawHeight + 28}
                  fill="#a1a1aa"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  Sx/2: {result.wallOffsetX.toFixed(2)}m
                </text>

                {/* Fixture spacing X indicator */}
                {gridX > 1 && (
                  <>
                    <line
                      x1={startX + result.wallOffsetX * scale}
                      y1={startY + drawHeight + 15}
                      x2={startX + (result.wallOffsetX + result.spacingX) * scale}
                      y2={startY + drawHeight + 15}
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      x={startX + (result.wallOffsetX + result.spacingX / 2) * scale}
                      y={startY + drawHeight + 28}
                      fill="#f59e0b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Sx: {result.spacingX.toFixed(2)}m
                    </text>
                  </>
                )}
              </>
            )}

            {/* PHOTOMETRIC LIGHT CONES OVERLAY */}
            {showBeamCones &&
              fixturePositions.map((p, idx) => {
                const coneRadius = Math.tan(((fixture.beamAngle / 2) * Math.PI) / 180) * result.effectiveMountingHeight * scale;
                return (
                  <circle
                    key={`cone-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r={Math.max(coneRadius, 15)}
                    fill="url(#beam-cone-gradient)"
                  />
                );
              })}

            {/* FIXTURE ICON & POSITION DOTS */}
            {fixturePositions.map((p, idx) => (
              <g key={`fix-${idx}`} className="group hover:opacity-100">
                {/* Glowing Aura */}
                <circle cx={p.x} cy={p.y} r="12" fill="url(#fixture-glow)" />

                {/* Fixture Geometry symbol based on category */}
                {fixture.type === 'LED Panel' || fixture.type === 'Tube' ? (
                  <rect
                    x={p.x - 7}
                    y={p.y - 7}
                    width="14"
                    height="14"
                    fill="#fbbf24"
                    stroke="#78350f"
                    strokeWidth="1.5"
                    rx="2"
                  />
                ) : (
                  <circle cx={p.x} cy={p.y} r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                )}

                {/* Center emitter LED star */}
                <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />

                {/* Fixture Label on hover */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  fill="#fef3c7"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="opacity-80 group-hover:opacity-100"
                >
                  F{idx + 1} ({p.relX.toFixed(1)}m, {p.relY.toFixed(1)}m)
                </text>
              </g>
            ))}

            {/* PROBE POINTER */}
            {hoverCoord && (
              <g>
                <circle
                  cx={startX + hoverCoord.x * scale}
                  cy={startY + hoverCoord.y * scale}
                  r="5"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="animate-ping"
                />
                <circle
                  cx={startX + hoverCoord.x * scale}
                  cy={startY + hoverCoord.y * scale}
                  r="3"
                  fill="#38bdf8"
                />
              </g>
            )}
          </svg>
        ) : (
          /* 3D ISOMETRIC CONCEPTUAL CANVAS */
          <div className="relative w-full h-[360px] flex flex-col items-center justify-center p-4">
            <div className="relative w-80 h-52 bg-zinc-900 border-2 border-amber-500/40 rounded-xl shadow-[0_20px_50px_rgba(245,158,11,0.15)] transform rotate-x-60 rotate-z-45 transition-transform duration-700 hover:rotate-x-50 hover:rotate-z-40">
              
              {/* Working plane Desk layer */}
              <div
                className="absolute inset-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center"
                style={{ transform: `translateZ(${dimensions.workingPlaneHeight * 20}px)` }}
              >
                <span className="text-[10px] font-mono text-amber-300 bg-zinc-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Working Plane Desk (h = {dimensions.workingPlaneHeight}{dimensions.unit === 'feet' ? 'ft' : 'm'}) • Target: {result.targetLux} Lux
                </span>
              </div>

              {/* Ceiling Fixture Matrix */}
              <div className="absolute inset-2 grid gap-2 p-2 border-b border-zinc-700" style={{ gridTemplateColumns: `repeat(${gridX}, minmax(0, 1fr))` }}>
                {Array.from({ length: result.roundedFixtureCount }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center justify-center">
                    <div className="w-4 h-4 bg-amber-400 rounded-sm shadow-[0_0_12px_#f59e0b] animate-pulse" />
                    {/* Beam projection down */}
                    <div className="w-8 h-16 bg-gradient-to-b from-amber-400/30 to-transparent clip-triangle" />
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs font-mono text-zinc-400 text-center">
              3D Conceptual Illumination Volume • Mounting Height: {dimensions.mountingHeight}{dimensions.unit === 'feet' ? 'ft' : 'm'} above floor ({result.effectiveMountingHeight.toFixed(2)}m above work plane)
            </p>
          </div>
        )}
      </div>

      {/* METRIC BADGES & COMPLIANCE SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-zinc-800/80 light:border-zinc-200">
        
        <div className="p-2.5 bg-zinc-950/50 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-400 light:text-zinc-600">BNBC Target Lux</span>
          <div className="text-sm font-bold font-mono text-zinc-100 light:text-zinc-900 mt-0.5">
            {result.targetLux} Lux
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950/50 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-400 light:text-zinc-600">Achieved Lux</span>
          <div className={`text-sm font-bold font-mono mt-0.5 flex items-center gap-1 ${result.isLuxSufficient ? 'text-emerald-400 light:text-emerald-700' : 'text-amber-400 light:text-amber-700'}`}>
            {result.achievedLux} Lux
            {result.isLuxSufficient ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950/50 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-400 light:text-zinc-600">Spacing-to-Height Ratio (SHR)</span>
          <div className={`text-sm font-bold font-mono mt-0.5 flex items-center gap-1 ${result.isShrCompliant ? 'text-emerald-400 light:text-emerald-700' : 'text-amber-400 light:text-amber-700'}`}>
            {result.spacingToHeightRatio.toFixed(2)}
            <span className="text-[9px] font-normal text-zinc-400 light:text-zinc-500">(Max 1.5)</span>
          </div>
        </div>

        <div className="p-2.5 bg-zinc-950/50 light:bg-zinc-100 border border-zinc-800 light:border-zinc-200 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-400 light:text-zinc-600">LPD Energy Code</span>
          <div className={`text-sm font-bold font-mono mt-0.5 flex items-center gap-1 ${result.isLpdCompliant ? 'text-emerald-400 light:text-emerald-700' : 'text-rose-400 light:text-rose-700'}`}>
            {result.actualLPD.toFixed(2)} W/m²
            {result.isLpdCompliant ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          </div>
        </div>

      </div>
    </div>
  );
};
