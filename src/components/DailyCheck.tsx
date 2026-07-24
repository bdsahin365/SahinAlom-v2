import React, { useState } from 'react';
import { TIMELINE_STEPS, INITIAL_READINGS } from '../data';
import { ReadingItem, HomepageContent } from '../types';
import { Clock, RefreshCw, Thermometer, Gauge, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

interface DailyCheckProps {
  homepageContent?: HomepageContent;
}

export default function DailyCheck({ homepageContent }: DailyCheckProps) {
  const [readings, setReadings] = useState<ReadingItem[]>(INITIAL_READINGS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string>('All systems operating within acceptable tolerances.');

  const tagline = homepageContent?.dailyCheckTagline || homepageContent?.journalTagline || '01 — Operations Journal';
  const title = homepageContent?.dailyCheckTitle || homepageContent?.journalHeading || 'The daily check';
  const desc = homepageContent?.dailyCheckDesc || homepageContent?.journalDesc || 'Every morning starts the same way. I walk the floor before the machines start, reading the boards, logging the numbers, listening for what sounds wrong. This is how you catch problems before they become downtime.';

  // Simulation handler to simulate grid fluctuation and safety system response
  const handleSimulateFault = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setSimulationLog('WARNING: Initiating short-circuit simulation on Knitting Line 3 feeder...');

    // Step 1: Raise temperature and lower frequency slightly (simulating overload/fault state)
    setTimeout(() => {
      setReadings(prev => prev.map(item => {
        if (item.label.includes('Line 3 Motor')) {
          return { ...item, value: '92', status: 'critical' };
        }
        if (item.label.includes('Grid Frequency')) {
          return { ...item, value: '49.12', status: 'warning' };
        }
        return item;
      }));
      setSimulationLog('CRITICAL: Motor over-temp detected (92°C). Soil path surge current detected.');
    }, 1000);

    // Step 2: Trip isolation sequence (breking downstream SDB-1 protection)
    setTimeout(() => {
      setReadings(prev => prev.map(item => {
        if (item.label.includes('Line 3 Motor')) {
          return { ...item, value: '0', status: 'normal' };
        }
        if (item.label.includes('Total Industrial Load')) {
          return { ...item, value: '267', status: 'normal' }; // dropped load
        }
        if (item.label.includes('Grid Frequency')) {
          return { ...item, value: '50.01', status: 'normal' }; // restored
        }
        return item;
      }));
      setSimulationLog('SUCCESS: SDB protection tripped. Knitting Line 3 isolated safely. Main MDB load stabilized at 267 kW.');
      setIsSimulating(false);
    }, 3500);
  };

  const resetReadings = () => {
    setReadings(INITIAL_READINGS);
    setSimulationLog('All systems operating within acceptable tolerances.');
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'critical':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse';
    }
  };

  return (
    <section 
      id="daily-check" 
      className="py-20 md:py-28 bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest block mb-2">
            {tagline}
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-zinc-100 light:text-zinc-900 tracking-tight">
            {title}
          </h2>
          <div className="h-0.5 w-12 bg-amber-500 mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <p className="text-base text-zinc-400 light:text-zinc-600 leading-relaxed max-w-xl">
              {desc}
            </p>

            <div className="relative border-l border-zinc-800 dark:border-zinc-800 light:border-zinc-300 ml-4 pl-6 sm:pl-8 space-y-10 py-2">
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Timeline marker node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 bg-zinc-950 dark:bg-zinc-950 light:bg-white group-hover:border-amber-500 transition-colors">
                    <Clock className="w-3 h-3 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        {step.time}
                      </span>
                      <h3 className="font-display font-bold text-base text-zinc-200 light:text-zinc-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-400 light:text-zinc-600 leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Data Readings Panel */}
          <div className="lg:col-span-5">
            <div className="p-5 bg-zinc-900/60 dark:bg-zinc-900/60 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 rounded-lg">
              
              <div className="flex items-center justify-between border-b border-zinc-800 dark:border-zinc-800 light:border-zinc-200 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-display font-medium text-xs text-zinc-300 light:text-zinc-800 tracking-wider uppercase">
                    This Morning's Readings
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={resetReadings} 
                    className="p-1 rounded border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    title="Reset Readings"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid of values */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {readings.map((reading, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-zinc-950 dark:bg-zinc-950 light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded"
                  >
                    <span className="block text-[10px] font-mono text-zinc-500 light:text-zinc-400 uppercase tracking-wide truncate">
                      {reading.label}
                    </span>
                    <div className="flex items-baseline space-x-1 mt-1.5">
                      <span className="font-mono text-xl font-bold text-zinc-100 light:text-zinc-900">
                        {reading.value}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 font-medium uppercase">
                        {reading.unit}
                      </span>
                    </div>
                    
                    {/* Status badge */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded border ${getStatusColor(reading.status)}`}>
                        {reading.status.toUpperCase()}
                      </span>
                      {reading.label.includes('Line 3 Motor') && reading.status === 'warning' && (
                        <span className="text-[9px] text-amber-500 font-mono animate-pulse">Needs check</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulation Log Screen */}
              <div className="bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-200 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded p-3 mb-4 font-mono text-[11px]">
                <div className="text-zinc-500 uppercase tracking-widest font-bold text-[9px] mb-1.5">
                  Protective Controller Relay Log
                </div>
                <p className={`${
                  isSimulating 
                    ? 'text-amber-400' 
                    : simulationLog.includes('SUCCESS') 
                    ? 'text-emerald-400' 
                    : 'text-zinc-400 light:text-zinc-700'
                }`}>
                  {simulationLog}
                </p>
              </div>

              {/* Trigger simulation action */}
              <button
                onClick={handleSimulateFault}
                disabled={isSimulating}
                className={`w-full py-2.5 rounded text-xs font-mono font-medium border transition-colors flex items-center justify-center space-x-2 ${
                  isSimulating 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 cursor-not-allowed'
                    : 'bg-zinc-950 dark:bg-zinc-950 light:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-900 light:hover:bg-zinc-50 border-zinc-800 dark:border-zinc-800 light:border-zinc-300 hover:border-amber-500/40 text-zinc-300 light:text-zinc-800 cursor-pointer'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Interlocking Logic...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Run Line 3 Fault & Trip Simulation</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
