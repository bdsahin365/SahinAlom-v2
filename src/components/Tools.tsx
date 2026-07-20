import React, { useState } from 'react';
import { 
  ArrowLeft, Zap, Layers, BookOpen, Activity, ChevronRight, Settings
} from 'lucide-react';
import ElectricalSizingTool from './tools/ElectricalSizingTool';

interface ToolsProps {
  onBack: () => void;
}

export default function Tools({ onBack }: ToolsProps) {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  if (selectedToolId === 'electrical') {
    return <ElectricalSizingTool onBack={() => setSelectedToolId(null)} />;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 text-zinc-100 light:text-zinc-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK NAVIGATION */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-all cursor-pointer font-bold animate-pulse"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio / হোমপেইজে ফেরত</span>
          </button>
        </div>

        {/* MAIN HEADER */}
        <div className="mb-10 pb-6 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-amber-500/15 rounded-xl border border-amber-500/25">
              <Settings className="w-6 h-6 text-amber-500 animate-[spin_8s_linear_infinite]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 light:text-zinc-900 tracking-tight">
                Engineering Tools Directory
              </h1>
              <p className="text-[10px] sm:text-xs font-mono text-amber-500 font-semibold uppercase mt-0.5 tracking-wider">
                Sahin Alom - Engineering Utility Suite
              </p>
            </div>
          </div>
          <p className="text-zinc-400 light:text-zinc-650 text-xs sm:text-sm mt-3 max-w-3xl leading-relaxed">
            বাংলাদেশ ন্যাশনাল বিল্ডিং কোড (BNBC 2020) এবং আন্তর্জাতিক ইঞ্জিনিয়ারিং স্ট্যান্ডার্ড মেনে তৈরি পেশাদার ডিজাইনিং ও ক্যালকুলেশন ইউটিলিটিসমূহ। আপনার কাঙ্ক্ষিত টুলটি নির্বাচন করুন:
          </p>
        </div>

        {/* GRID LIST OF TOOLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Electrical Sizing Sld Generator */}
          <div 
            onClick={() => setSelectedToolId('electrical')}
            className="group relative p-6 bg-zinc-900/40 hover:bg-zinc-900/80 light:bg-white light:hover:bg-zinc-50 border border-zinc-900 hover:border-amber-500/50 light:border-zinc-200 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg overflow-hidden flex flex-col justify-between min-h-[220px]"
          >
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-300" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5.5 h-5.5" />
                </div>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                  প্রস্তুত / Ready to Use
                </span>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-sm text-zinc-100 light:text-zinc-900 group-hover:text-amber-500 transition-colors">
                  BNBC 2020 Electrical Sizing & SLD Generator
                </h3>
                <p className="text-zinc-400 light:text-zinc-600 text-xs mt-1.5 leading-relaxed">
                  লোডের হিসাব, মেইন সার্কিট ব্রেকার রেটিং, ক্যাবল বা মেইন তারের সাইজ এবং ভোল্টেজ ড্রপ টেস্ট করার নির্ভরযোগ্য টুল। স্বয়ংক্রিয়ভাবে একটি Single Line Diagram (SLD) ডিজাইন করে দেয়।
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-900/40 dark:border-zinc-900/40 light:border-zinc-150">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Category: Electrical Design</span>
              <span className="inline-flex items-center text-xs font-mono text-amber-500 font-bold group-hover:translate-x-1.5 transition-transform">
                Launch Tool <ChevronRight className="w-4 h-4 ml-0.5" />
              </span>
            </div>
          </div>

          {/* 2. Earthing & Lightning Protection System Sizer */}
          <div className="relative p-6 bg-zinc-900/10 light:bg-zinc-100/30 border border-zinc-900/40 light:border-zinc-200 rounded-2xl opacity-65 select-none min-h-[220px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-zinc-850 light:bg-zinc-200 rounded-xl text-zinc-500">
                  <Layers className="w-5.5 h-5.5" />
                </div>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-zinc-800 text-zinc-500">
                  শীঘ্রই আসছে / Coming Soon
                </span>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-sm text-zinc-400 light:text-zinc-700">
                  Earthing & Lightning Protection Sizer
                </h3>
                <p className="text-zinc-500 light:text-zinc-500 text-xs mt-1.5 leading-relaxed">
                  বিল্ডিংয়ের সঠিক আর্থিং রেজিস্ট্যান্স এবং বজ্রপাত নিরোধক ব্যবস্থার (LPS) প্রয়োজনীয় ক্যাবল ও রডের সাইজ নির্ধারণের টুল। (BNBC 2020 Part 8 Chapter 2 অনুযায়ী ডিজাইন করা হচ্ছে)।
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-900/20 light:border-zinc-150">
              <span className="text-[10px] font-mono text-zinc-600 uppercase">Category: Electrical Safety</span>
              <span className="text-[10px] font-mono text-zinc-500">Locked</span>
            </div>
          </div>

          {/* 3. Illumination Layout */}
          <div className="relative p-6 bg-zinc-900/10 light:bg-zinc-100/30 border border-zinc-900/40 light:border-zinc-200 rounded-2xl opacity-65 select-none min-h-[220px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-zinc-850 light:bg-zinc-200 rounded-xl text-zinc-500">
                  <BookOpen className="w-5.5 h-5.5" />
                </div>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-zinc-800 text-zinc-500">
                  শীঘ্রই আসছে / Coming Soon
                </span>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-sm text-zinc-400 light:text-zinc-700">
                  Illumination Sizing & Lux Planner
                </h3>
                <p className="text-zinc-500 light:text-zinc-500 text-xs mt-1.5 leading-relaxed">
                  কারখানা, বাণিজ্যিক অফিস বা বাসাবাড়ির জন্য প্রয়োজনীয় আলোর লাক্স (Lux) লেভেল হিসাব করে এলইডি লাইট বা টিউবের সংখ্যা ও বিন্যাস নির্ধারণ করার ক্যালকুলেটর।
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-900/20 light:border-zinc-150">
              <span className="text-[10px] font-mono text-zinc-600 uppercase">Category: Lighting Design</span>
              <span className="text-[10px] font-mono text-zinc-500">Locked</span>
            </div>
          </div>

          {/* 4. Solar PV system */}
          <div className="relative p-6 bg-zinc-900/10 light:bg-zinc-100/30 border border-zinc-900/40 light:border-zinc-200 rounded-2xl opacity-65 select-none min-h-[220px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-zinc-850 light:bg-zinc-200 rounded-xl text-zinc-500">
                  <Activity className="w-5.5 h-5.5" />
                </div>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-zinc-800 text-zinc-500">
                  শীঘ্রই আসছে / Coming Soon
                </span>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-sm text-zinc-400 light:text-zinc-700">
                  Net-Metered Solar PV System Sizer
                </h3>
                <p className="text-zinc-500 light:text-zinc-500 text-xs mt-1.5 leading-relaxed">
                  গ্রিড-টাইড ছাদ সোলার সিস্টেমের জন্য প্রয়োজনীয় সোলার প্যানেল এবং ইনভার্টার সাইজিংয়ের পূর্ণাঙ্গ হিসাব ও পেব্যাক পিরিয়ড ক্যালকুলেটর।
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-zinc-900/20 light:border-zinc-150">
              <span className="text-[10px] font-mono text-zinc-600 uppercase">Category: Renewable Energy</span>
              <span className="text-[10px] font-mono text-zinc-500">Locked</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
