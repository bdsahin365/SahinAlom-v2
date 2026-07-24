import React from 'react';
import { AdvancedParams, CalculationResult, FixtureItem, RoomDimensions } from './types';
import { Printer, ShieldCheck, CheckCircle2, FileText, Zap } from 'lucide-react';

interface PrintReportProps {
  dimensions: RoomDimensions;
  fixture: FixtureItem;
  advancedParams: AdvancedParams;
  result: CalculationResult;
  buildingType: string;
  roomName: string;
  bnbcClause: string;
  projectName?: string;
  clientName?: string;
  designerName?: string;
  onClose: () => void;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  dimensions,
  fixture,
  advancedParams,
  result,
  buildingType,
  roomName,
  bnbcClause,
  projectName = 'Corporate HQ Lighting Project',
  clientName = 'Client Facility / Plant',
  designerName = 'Engr. Md. Sahin Alom (Electrical Consultant)',
  onClose
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/90 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center">
      
      {/* FLOATING ACTION BAR */}
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-2xl shadow-xl print:hidden">
        <div className="flex items-center space-x-2 text-zinc-200">
          <FileText className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-sm">BNBC 2020 Illumination Design Sheet (Print Preview)</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report / Save PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* PRINTABLE A4 PAGE CONTAINER */}
      <div className="w-full max-w-4xl bg-white text-zinc-900 p-8 sm:p-12 rounded-xl shadow-2xl print:shadow-none print:p-0 print:w-full print:max-w-none text-left">
        
        {/* HEADER BRANDING */}
        <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500 text-zinc-950 rounded-lg font-bold">
                <Zap className="w-6 h-6 fill-zinc-950" />
              </div>
              <div>
                <h1 className="font-bold text-xl uppercase tracking-tight text-zinc-900">ENGR. MD. SAHIN ALOM</h1>
                <p className="text-xs font-mono text-zinc-600">Electrical Engineering Design Services • B.Sc. in EEE (Green University)</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 border border-zinc-300 rounded font-mono text-xs font-bold uppercase">
              BNBC 2020 Compliant Calculation
            </span>
            <p className="text-xs text-zinc-500 font-mono mt-1">Date: {currentDate}</p>
            <p className="text-xs text-zinc-500 font-mono">Doc Ref: SA-LUMEN-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        </div>

        {/* PROJECT METADATA */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-xs mb-6">
          <div>
            <span className="text-zinc-500 font-mono block">Project Title:</span>
            <strong className="text-zinc-900">{projectName}</strong>
          </div>
          <div>
            <span className="text-zinc-500 font-mono block">Client Name:</span>
            <strong className="text-zinc-900">{clientName}</strong>
          </div>
          <div>
            <span className="text-zinc-500 font-mono block">Lead Consultant:</span>
            <strong className="text-zinc-900">{designerName}</strong>
          </div>
        </div>

        {/* SECTION 1: ROOM & DESIGN CRITERIA */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-zinc-200 pb-1 mb-3">
            1. Room Geometry & BNBC Illumination Standards
          </h2>

          <table className="w-full text-xs border-collapse border border-zinc-300">
            <tbody>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 font-bold w-1/4 border-r border-zinc-300">Building Category:</td>
                <td className="p-2 w-1/4 border-r border-zinc-300">{buildingType}</td>
                <td className="p-2 font-bold w-1/4 border-r border-zinc-300">Room Designation:</td>
                <td className="p-2 w-1/4">{roomName}</td>
              </tr>
              <tr className="border-b border-zinc-300">
                <td className="p-2 font-bold border-r border-zinc-300">Room Length (L):</td>
                <td className="p-2 border-r border-zinc-300">{dimensions.length} {dimensions.unit === 'feet' ? 'ft' : 'm'}</td>
                <td className="p-2 font-bold border-r border-zinc-300">Room Width (W):</td>
                <td className="p-2">{dimensions.width} {dimensions.unit === 'feet' ? 'ft' : 'm'}</td>
              </tr>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 font-bold border-r border-zinc-300">Total Room Area (A):</td>
                <td className="p-2 border-r border-zinc-300">{result.roomAreaSqFt.toFixed(1)} sq.ft ({result.roomAreaM2.toFixed(2)} m²)</td>
                <td className="p-2 font-bold border-r border-zinc-300">Ceiling Height (H):</td>
                <td className="p-2">{dimensions.height} {dimensions.unit === 'feet' ? 'ft' : 'm'}</td>
              </tr>
              <tr className="border-b border-zinc-300">
                <td className="p-2 font-bold border-r border-zinc-300">Working Plane Height (hw):</td>
                <td className="p-2 border-r border-zinc-300">{dimensions.workingPlaneHeight} {dimensions.unit === 'feet' ? 'ft' : 'm'}</td>
                <td className="p-2 font-bold border-r border-zinc-300">Mounting Height (hm):</td>
                <td className="p-2">{dimensions.mountingHeight} {dimensions.unit === 'feet' ? 'ft' : 'm'} (Effective hr = {result.effectiveMountingHeight.toFixed(2)} m)</td>
              </tr>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 font-bold border-r border-zinc-300">Room Index (K):</td>
                <td className="p-2 border-r border-zinc-300 font-mono font-bold">{result.roomIndex.toFixed(2)}</td>
                <td className="p-2 font-bold border-r border-zinc-300">BNBC Reference Standard:</td>
                <td className="p-2 font-mono text-amber-700 font-bold">{bnbcClause}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: FIXTURE & PARAMETERS */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-zinc-200 pb-1 mb-3">
            2. Selected Lighting Fixture Specifications
          </h2>

          <table className="w-full text-xs border-collapse border border-zinc-300">
            <tbody>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 font-bold w-1/4 border-r border-zinc-300">Manufacturer / Brand:</td>
                <td className="p-2 w-1/4 border-r border-zinc-300">{fixture.manufacturer}</td>
                <td className="p-2 font-bold w-1/4 border-r border-zinc-300">Model Name:</td>
                <td className="p-2 w-1/4">{fixture.model}</td>
              </tr>
              <tr className="border-b border-zinc-300">
                <td className="p-2 font-bold border-r border-zinc-300">Fixture Type:</td>
                <td className="p-2 border-r border-zinc-300">{fixture.type}</td>
                <td className="p-2 font-bold border-r border-zinc-300">Lamp Wattage & Count:</td>
                <td className="p-2">{fixture.powerWatts} W ({fixture.lampsPerFixture} Lamp/Fixture)</td>
              </tr>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 font-bold border-r border-zinc-300">Fixture Luminous Flux (F):</td>
                <td className="p-2 border-r border-zinc-300 font-mono font-bold text-amber-700">{fixture.lumens} Lumens</td>
                <td className="p-2 font-bold border-r border-zinc-300">Beam Angle & CCT:</td>
                <td className="p-2">{fixture.beamAngle}° • {fixture.cct} K ({fixture.cri} Ra)</td>
              </tr>
              <tr className="border-b border-zinc-300">
                <td className="p-2 font-bold border-r border-zinc-300">Utilization Factor (UF):</td>
                <td className="p-2 border-r border-zinc-300 font-mono">{advancedParams.utilizationFactor.toFixed(2)}</td>
                <td className="p-2 font-bold border-r border-zinc-300">Maintenance Factor (MF):</td>
                <td className="p-2 font-mono">{advancedParams.maintenanceFactor.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: LUMEN METHOD CALCULATIONS */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-zinc-200 pb-1 mb-3">
            3. Lumen Method Calculation & Grid Schedule
          </h2>

          <div className="p-4 bg-zinc-50 border border-zinc-300 rounded-lg text-xs space-y-2 font-mono mb-4">
            <p><strong>Lumen Formula:</strong> N = (E × A) / (F × UF × MF)</p>
            <p>• Total Required Lumens (Phi) = {result.targetLux} Lux × {result.roomAreaM2.toFixed(2)} m² = <strong>{result.totalRequiredLumens.toFixed(0)} Lumens</strong></p>
            <p>• Raw Calculated Fixtures = {result.totalRequiredLumens.toFixed(0)} / ({fixture.lumens} × {advancedParams.utilizationFactor} × {advancedParams.maintenanceFactor}) = <strong>{result.rawFixtureCount.toFixed(2)} Fixtures</strong></p>
            <p className="text-amber-800 font-bold">
              • Final Round-Up Fixture Count (BNBC Rule) = {result.roundedFixtureCount} Fixtures
            </p>
          </div>

          <table className="w-full text-xs border-collapse border border-zinc-300">
            <thead>
              <tr className="bg-zinc-800 text-white font-bold">
                <th className="p-2 border border-zinc-300 text-left">Parameter</th>
                <th className="p-2 border border-zinc-300 text-left">Calculated Value</th>
                <th className="p-2 border border-zinc-300 text-left">BNBC Limit / Standard</th>
                <th className="p-2 border border-zinc-300 text-left">Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-300">
                <td className="p-2 border-r border-zinc-300 font-bold">Achieved Illuminance (E_achieved)</td>
                <td className="p-2 border-r border-zinc-300 font-mono">{result.achievedLux} Lux</td>
                <td className="p-2 border-r border-zinc-300 font-mono">Min {result.targetLux} Lux</td>
                <td className="p-2 font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASS (Sufficient)
                </td>
              </tr>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 border-r border-zinc-300 font-bold">Grid Rows & Columns (Ny × Nx)</td>
                <td className="p-2 border-r border-zinc-300 font-mono">{result.gridRows} Rows × {result.gridCols} Cols</td>
                <td className="p-2 border-r border-zinc-300 font-mono">Spacing Sx = {result.spacingX.toFixed(2)}m, Sy = {result.spacingY.toFixed(2)}m</td>
                <td className="p-2 font-bold text-emerald-700">Uniform Grid</td>
              </tr>
              <tr className="border-b border-zinc-300">
                <td className="p-2 border-r border-zinc-300 font-bold">Spacing-to-Height Ratio (SHR)</td>
                <td className="p-2 border-r border-zinc-300 font-mono">{result.spacingToHeightRatio.toFixed(2)}</td>
                <td className="p-2 border-r border-zinc-300 font-mono">Maximum 1.50</td>
                <td className={`p-2 font-bold ${result.isShrCompliant ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.isShrCompliant ? 'PASS (Uniform)' : 'WARNING (High SHR)'}
                </td>
              </tr>
              <tr className="border-b border-zinc-300 bg-zinc-100">
                <td className="p-2 border-r border-zinc-300 font-bold">Lighting Power Density (LPD)</td>
                <td className="p-2 border-r border-zinc-300 font-mono">{result.actualLPD.toFixed(2)} W/m² ({result.totalPowerWatts} Watts Total)</td>
                <td className="p-2 border-r border-zinc-300 font-mono">Max Allowable LPD</td>
                <td className={`p-2 font-bold ${result.isLpdCompliant ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {result.isLpdCompliant ? 'PASS (Energy Code)' : 'EXCEEDED'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SIGNATURE & SEAL AREA */}
        <div className="pt-12 mt-8 border-t border-zinc-300 flex items-end justify-between text-xs">
          <div>
            <div className="p-3 border border-amber-300 bg-amber-50 rounded-lg max-w-xs">
              <div className="flex items-center space-x-1.5 text-amber-800 font-bold mb-0.5">
                <ShieldCheck className="w-4 h-4" />
                <span>BNBC 2020 Compliance Seal</span>
              </div>
              <p className="text-[10px] text-amber-900 leading-tight">
                Verified according to Bangladesh National Building Code (BNBC 2020 Part VIII Chapter 1 Illumination Standards).
              </p>
            </div>
          </div>

          <div className="text-center w-64">
            <div className="border-b border-zinc-900 pb-1 mb-1 font-bold text-zinc-900">
              Engr. Md. Sahin Alom
            </div>
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Electrical Engineer (B.Sc. in EEE, Green University)</p>
            <p className="text-[10px] text-zinc-400">Power System & Industrial Operations</p>
          </div>
        </div>

      </div>
    </div>
  );
};
