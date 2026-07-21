import React, { useState, useEffect } from 'react';
import { DEFAULT_PROFILE_DATA } from '../data';
import { ProfileData } from '../types';
import { Mail, Phone, MapPin, Printer, ArrowLeft, Heart, User, Users, GraduationCap, Shield } from 'lucide-react';

interface BiodataProps {
  onBack: () => void;
}

export default function Biodata({ onBack }: BiodataProps) {
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

  const personalInfo = profile.personalDetails || DEFAULT_PROFILE_DATA.personalDetails;

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
              <span>Print/Download Biodata</span>
            </button>
          </div>
        </div>

        {/* Biodata Sheet Canvas */}
        <div id="printable-biodata" className="bg-black dark:bg-black light:bg-white border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border-0 print:p-0 print:shadow-none">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 technical-grid opacity-[0.03] pointer-events-none print:hidden" />
          
          {/* Top Header Panel */}
          <div className="relative border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-8 mb-8 text-center">
            <div className="inline-flex items-center justify-center space-x-2 bg-amber-500/10 border border-amber-500/25 px-4 py-1.5 rounded-full mb-4">
              <Heart className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase text-amber-500 tracking-widest">
                PERSONAL BIODATA
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-zinc-100 light:text-zinc-900 tracking-tight uppercase">
              {profile.name}
            </h1>
            <p className="text-zinc-400 light:text-zinc-600 font-mono text-xs uppercase tracking-wider mt-1">
              {profile.title} • {profile.location}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs font-mono text-zinc-400 light:text-zinc-600">
              <div className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{profile.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Personal details */}
            <div className="space-y-6">
              
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-2">
                  <User className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>Personal Parameters</span>
                </h2>
                
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Date of Birth:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.dob}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Height:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.height}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Weight:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.weight}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Blood Group:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium text-amber-500">{personalInfo.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Religion:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.religion}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Marital Status:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.maritalStatus}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500">Nationality:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.nationality}</span>
                  </div>
                </div>
              </div>

              {/* Family Particulars */}
              <div className="space-y-3 pt-4">
                <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-2">
                  <Users className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>Family Particulars</span>
                </h2>
                
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500 block">Father's Name:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.fatherName}</span>
                  </div>
                  <div className="py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500 block">Father's Profession:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.fatherProfession}</span>
                  </div>
                  <div className="py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500 block">Mother's Name:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.motherName}</span>
                  </div>
                  <div className="py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500 block">Mother's Profession:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.motherProfession}</span>
                  </div>
                  <div className="py-1 border-b border-zinc-950/40 dark:border-zinc-950/40 light:border-zinc-100">
                    <span className="text-zinc-500 block">Siblings:</span>
                    <span className="text-zinc-200 light:text-zinc-800 font-medium">{personalInfo.siblings}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Education and Addresses */}
            <div className="space-y-6">
              
              {/* Address Details */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-2">
                  <MapPin className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>Residential Addresses</span>
                </h2>
                
                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <span className="font-mono text-zinc-500 uppercase text-[10px] block mb-1">Present Address:</span>
                    <p className="text-zinc-300 light:text-zinc-700 leading-relaxed bg-zinc-950/50 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-100 p-3 rounded">
                      {personalInfo.presentAddress}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-mono text-zinc-500 uppercase text-[10px] block mb-1">Permanent Address:</span>
                    <p className="text-zinc-300 light:text-zinc-700 leading-relaxed bg-zinc-950/50 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-100 p-3 rounded">
                      {personalInfo.permanentAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Credentials */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center border-b border-zinc-900 dark:border-zinc-900 light:border-zinc-200 pb-2">
                  <GraduationCap className="w-4 h-4 mr-2 text-zinc-500" />
                  <span>Academic Credentials</span>
                </h2>
                
                <div className="space-y-4 font-sans">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="bg-zinc-950/30 light:bg-zinc-50 border border-zinc-900 dark:border-zinc-900 light:border-zinc-200 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-zinc-100 light:text-zinc-900 block">{edu.degree}</span>
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{edu.passingYear}</span>
                      </div>
                      <span className="text-xs text-zinc-400 light:text-zinc-600 block mt-1">{edu.institution}</span>
                      {edu.result && (
                        <span className="text-[11px] font-mono text-amber-500 mt-1 block">{edu.result}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Substation Safety Verification Mark */}
          <div className="border-t border-zinc-900/80 dark:border-zinc-900/80 light:border-zinc-200 pt-8 mt-12 flex flex-col sm:flex-row sm:justify-between sm:items-center text-[10px] font-mono text-zinc-500">
            <span>DECLARATION: ALL PROVIDED DATA IS TRUE AND VERIFIED</span>
            <span className="text-right sm:text-right mt-1 sm:mt-0">SAHIN ALOM • INDUSTRIAL ELECTRICAL PORTFOLIO</span>
          </div>

        </div>

      </div>
    </div>
  );
}
