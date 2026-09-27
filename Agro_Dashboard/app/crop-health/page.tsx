'use client';

import React, { useState } from 'react';
import { CropHealthKpis } from '@/components/crop-health/CropHealthKpis';
import { CropTable } from '@/components/crop-health/CropTable';
import { DiseaseSection } from '@/components/crop-health/DiseaseSection';
import { PestSection } from '@/components/crop-health/PestSection';
import { WeedSection } from '@/components/crop-health/WeedSection';
import { NutrientSection } from '@/components/crop-health/NutrientSection';
import { GrowthSection } from '@/components/crop-health/GrowthSection';
import { PassportsSection } from '@/components/crop-health/PassportsSection';
import { Sprout, AlertTriangle, Bug, Flower2, Sparkles, TrendingUp, BookOpen } from 'lucide-react';

const subTabs = [
  { id: 'Overview', label: 'Overview', icon: Sprout },
  { id: 'Disease', label: 'Disease Detection', icon: AlertTriangle },
  { id: 'Pest', label: 'Pest & Acoustic', icon: Bug },
  { id: 'Weed', label: 'Weed Management', icon: Flower2 },
  { id: 'Nutrients', label: 'Nutrient & Fertilizer', icon: Sparkles },
  { id: 'Growth', label: 'Growth Phenology', icon: TrendingUp },
  { id: 'Passports', label: 'Field & Plant Passports', icon: BookOpen },
];

export default function CropHealthPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Crop Intelligence
              </span>
              <span className="text-xs text-[#6B7280]">Edge Vision v1.4 & LiDAR Diagnostics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827] mt-1.5">
              Crop & Plant Health Center
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Multi-spectral imaging, acoustic pest monitoring, weed competition, and individual plant passports.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#166534] shrink-0 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            <span>Active Plant Diagnostics</span>
          </div>
        </div>

        {/* Sub Navigation Bar - Dedicated Full Width Row */}
        <div className="pt-3 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-1.5 bg-[#F7F9F7] p-1.5 rounded-xl border border-[#E5E7EB] overflow-x-auto">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#111827] shadow-xs border border-[#E5E7EB] font-bold'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#16A34A]' : 'text-[#6B7280]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>


      {/* Top 6 KPI summary */}
      <CropHealthKpis />

      {/* Dynamic Sub-tab Content */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <CropTable />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <DiseaseSection />
            </div>
            <div className="lg:col-span-6">
              <PestSection isCompact />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Disease' && <DiseaseSection />}
      {activeTab === 'Pest' && <PestSection />}
      {activeTab === 'Weed' && <WeedSection />}
      {activeTab === 'Nutrients' && <NutrientSection />}
      {activeTab === 'Growth' && <GrowthSection />}
      {activeTab === 'Passports' && <PassportsSection />}
    </div>
  );
}
