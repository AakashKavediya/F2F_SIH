'use client';

import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function NutrientSection() {
  const { dataMode } = useFarm();
  const nutrients = [
    {
      name: 'Available Nitrogen (N)',
      current: 72,
      unit: 'mg/kg',
      optimal: '95–120 mg/kg',
      status: 'Deficient (Field D)',
      statusClass: 'text-[#EF4444] bg-red-50 border-red-200',
      trend: '-12% past 14 days',
      risk: 'Tillering stunt in wheat',
    },
    {
      name: 'Available Phosphorus (P)',
      current: 45,
      unit: 'mg/kg',
      optimal: '40–60 mg/kg',
      status: 'Optimal Band',
      statusClass: 'text-[#16A34A] bg-[#DCFCE7] border-[#DCFCE7]',
      trend: 'Stable',
      risk: 'Minimal risk',
    },
    {
      name: 'Available Potassium (K)',
      current: 180,
      unit: 'mg/kg',
      optimal: '150–220 mg/kg',
      status: 'Healthy Band',
      statusClass: 'text-[#16A34A] bg-[#DCFCE7] border-[#DCFCE7]',
      trend: '+4% balanced',
      risk: 'Sufficient stalk strength',
    },
  ];

  return (
    <div className="space-y-6">
      {/* NPK Triad Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nutrients.map((n) => (
          <div
            key={n.name}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#111827]">{n.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${n.statusClass}`}>
                {n.status}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#111827]">{n.current}</span>
              <span className="text-xs text-[#6B7280]">{n.unit}</span>
            </div>

            <div className="space-y-1 text-xs text-[#6B7280] pt-2 border-t border-[#F3F4F6]">
              <div className="flex justify-between">
                <span>Optimal Band:</span>
                <span className="font-semibold text-[#111827]">{n.optimal}</span>
              </div>
              <div className="flex justify-between">
                <span>Recent Trend:</span>
                <span className="font-semibold text-[#111827]">{n.trend}</span>
              </div>
              <div className="flex justify-between">
                <span>Crop Risk:</span>
                <span className="font-medium text-[#4B5563]">{n.risk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Fertilizer Recommendation Card */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">
                Field D — Nitrogen Top-Dressing Advisory
              </h3>
              <p className="text-[11px] text-[#6B7280]">GW-496 Wheat Vegetative Tillering Stage</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
            87% Confidence
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#166534]">Agronomic Prescriptive Insight:</span>
            <span className="text-[10px] font-bold text-[#166534] bg-white px-2 py-0.5 rounded border border-[#DCFCE7]">
              {dataMode} AGRONOMIC RECOMMENDATION
            </span>
          </div>
          <p className="text-[#4B5563] leading-relaxed">
            Optical NPK Spectrometer (SNS-NPK-D1) recorded available nitrogen at 72 mg/kg. Combined with wheat phenological stage (24 days after emergence), a split nitrogen replenishment is recommended prior to next irrigation to maximize spikelet count and grain filling potential.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#166534] pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Consult certified soil scientist or official package of practices for exact dosage.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
