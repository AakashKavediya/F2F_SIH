'use client';

import React from 'react';
import { Flower2, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function WeedSection() {
  const { weedEvents, dataMode } = useFarm();

  return (
    <div className="space-y-6">
      {/* Top Weed KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">Total Weed Coverage</span>
          <p className="text-2xl font-bold text-[#111827] mt-1">8.4%</p>
          <span className="text-[10px] text-[#F59E0B] font-medium">Moderate competition threshold</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">Average Density</span>
          <p className="text-2xl font-bold text-[#111827] mt-1">12 plants / m²</p>
          <span className="text-[10px] text-[#6B7280]">Concentrated in inter-rows</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-subtle">
          <span className="text-xs text-[#6B7280]">Affected Parcel Footprint</span>
          <p className="text-2xl font-bold text-[#111827] mt-1">1.2 acres</p>
          <span className="text-[10px] text-[#16A34A] font-medium">Isolated to Zone C4 & B3</span>
        </div>
      </div>

      {/* Weed Events List & Interventions */}
      <div className="space-y-4">
        {weedEvents.map((w) => (
          <div
            key={w.id}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <div>
                <span className="text-sm font-bold text-[#111827]">{w.species}</span>
                <p className="text-xs text-[#6B7280]">
                  {w.fieldId} • {w.zoneId} • Detected: {w.detectedAt}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200">
                {w.competitionRisk} Risk
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-[#F7F9F7]">
                <span className="text-[10px] text-[#6B7280]">Coverage</span>
                <p className="text-sm font-bold text-[#111827] mt-0.5">{w.coveragePct}%</p>
              </div>
              <div className="p-2 rounded-xl bg-[#F7F9F7]">
                <span className="text-[10px] text-[#6B7280]">Density</span>
                <p className="text-sm font-bold text-[#111827] mt-0.5">{w.densityPerSqM} plants/m²</p>
              </div>
              <div className="p-2 rounded-xl bg-[#F7F9F7]">
                <span className="text-[10px] text-[#6B7280]">Footprint</span>
                <p className="text-sm font-bold text-[#111827] mt-0.5">{w.affectedAreaAcres} ac</p>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#166534]">Recommended Agronomic Intervention:</span>
                <span className="text-[10px] font-bold text-[#166534] bg-white px-2 py-0.5 rounded border border-[#DCFCE7]">
                  {dataMode} AGRONOMIC RECOMMENDATION
                </span>
              </div>
              <p className="text-xs text-[#4B5563]">{w.recommendedIntervention}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
