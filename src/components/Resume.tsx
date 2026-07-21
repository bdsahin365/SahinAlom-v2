import React, { useState, useEffect } from 'react';
import { DEFAULT_PROFILE_DATA } from '../data';
import { ProfileData } from '../types';
import { Mail, Phone, MapPin, Printer, ArrowLeft, Download, Shield, Briefcase, GraduationCap, Code } from 'lucide-react';

interface ResumeProps {
  onBack: () => void;
}

export default function Resume({ onBack }: ResumeProps) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE_DATA);

  useEffect(() => {
    const saved = localStorage.getItem('sahin_profile_data');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading profile data', e);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-12 md:pt-16 pb-20 min-h-screen bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-50 text-zinc-100 light:text-zinc-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Navigation / Actions Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-4 print:hidden">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-zinc-400 hover:text-amber-500 text-sm font-mono transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>[Return to Base]</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-medium text-xs px-4 py-2 rounded transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print/Download PDF</span>
            </button>
          </div>
        </div>

        {/* The CV Sheet Canvas */}
        <div id="printable-resume" className="bg-black dark:bg-black light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border-0 print:p-0 print:shadow-none">
          
          {/* Subtle grid pattern background decorative */}
          <div className="absolute inset-0 technical-grid opacity-[0.03] pointer-events-none print:hidden" />
          
          {/* Top Header Panel */}
          <div className="relative border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-8 mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-zinc-100 light:text-zinc-900 tracking-tight uppercase">
                  {profile.name}
                </h1>
                <p className="text-amber-500 font-mono text-sm uppercase tracking-widest mt-1">
                  {profile.title}
                </p>
                <div className="flex items-center space-x-2 mt-3 text-xs text-zinc-400 light:text-zinc-600">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{profile.location}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-xs sm:text-right font-mono text-zinc-400 light:text-zinc-600">
                <div className="flex items-center md:justify-end space-x-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="hover:text-amber-500">{profile.email}</span>
                </div>
                <div className="flex items-center md:justify-end space-x-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{profile.phone}</span>
                </div>
                <div className="inline-block mt-2 bg-zinc-900/50 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 px-2 py-1 rounded text-[10px] text-emerald-500 uppercase font-bold tracking-wider">
                  ● BNBC Compliant Electrical Engineer
                </div>
              </div>
            </div>
          </div>

          {/* Core Summary */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>Professional Statement</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 light:text-zinc-700 leading-relaxed font-sans">
                {profile.summary}
              </p>
            </div>

            {/* Technical Skills Core Grid */}
            <div className="space-y-3 pt-4 border-t border-zinc-900/55 dark:border-zinc-900/55 light:border-zinc-200">
              <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center">
                <Code className="w-4 h-4 mr-2" />
                <span>Core Engineering Skills</span>
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.skills.split(',').map((skill, idx) => (
                  <span 
                    key={idx}
                    className="text-xs font-mono bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-zinc-800 dark:border-zinc-800 light:border-zinc-200 px-3 py-1 rounded text-zinc-300 light:text-zinc-700"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Work History */}
            <div className="space-y-4 pt-6 border-t border-zinc-900/55 dark:border-zinc-900/55 light:border-zinc-200">
              <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>Professional Field Experience</span>
              </h2>
              
              <div className="space-y-6">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-4 border-l border-zinc-800 dark:border-zinc-800 light:border-zinc-200 space-y-1">
                    <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[5px] top-1.5" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <h3 className="text-sm font-bold text-zinc-100 light:text-zinc-900">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 bg-zinc-900/40 light:bg-zinc-50 border border-zinc-800/40 light:border-zinc-200 px-1.5 py-0.5 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-amber-500/80 light:text-amber-700">
                      {exp.company}
                    </p>
                    <p className="text-xs text-zinc-400 light:text-zinc-600 leading-relaxed font-sans pt-1">
                      {exp.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education History */}
            <div className="space-y-4 pt-6 border-t border-zinc-900/55 dark:border-zinc-900/55 light:border-zinc-200">
              <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Academic background</span>
              </h2>
              
              <div className="space-y-4">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-4 border-l border-zinc-800 dark:border-zinc-800 light:border-zinc-200 space-y-1">
                    <div className="absolute w-2 h-2 rounded-full bg-zinc-700 -left-[5px] top-1.5" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <h3 className="text-sm font-bold text-zinc-100 light:text-zinc-900">
                        {edu.degree}
                      </h3>
                      <span className="text-xs font-mono text-zinc-400 light:text-zinc-600 bg-zinc-900/40 light:bg-zinc-50 border border-zinc-800/40 light:border-zinc-200 px-1.5 py-0.5 rounded">
                        {edu.passingYear}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 light:text-zinc-600">
                      {edu.institution}
                    </p>
                    {edu.result && (
                      <p className="text-xs font-mono text-amber-500/80 light:text-amber-700">
                        {edu.result}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Footer (Only Visible on printed resume or footer) */}
            <div className="border-t border-zinc-900/80 dark:border-zinc-900/80 light:border-zinc-200 pt-8 mt-12 flex flex-col sm:flex-row sm:justify-between sm:items-center text-[10px] font-mono text-zinc-500">
              <span>DESIGNATION: SENIOR MAINTENANCE ENGINEER</span>
              <span className="text-right sm:text-right">DOCUMENT AUTHENTICITY SECURED BY SIGNATURE</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
