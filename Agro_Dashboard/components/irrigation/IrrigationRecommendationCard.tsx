'use client';

import React from 'react';
import { AlertCircle, Clock, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function IrrigationRecommendationCard() {
  const { irrigation, openFieldPassportFor, dataMode } = useFarm();
  const rec = irrigation.recommendations[0]; // Zone B2

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#EF4444] border border-red-200 px-2 py-0.5 rounded">
              High Priority Irrigation
            </span>
            <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
              {dataMode} AI RECOMMENDATION
            </span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1.5">
            Field B / Zone B2 — Irrigation Required
          </h3>
          <p className="text-xs text-[#6B7280]">Cotton Vegetative Growth • Root depth 30 cm</p>
        </div>
        <span className="text-xs font-bold text-[#EF4444] bg-red-50 px-2.5 py-1 rounded-lg">
          24% Moisture (Low)
        </span>
      </div>

      {/* Decision Metric Badges */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Suggested Window</span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">{rec.suggestedWindow}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Prescribed Volume</span>
          <p className="text-xs font-bold text-[#16A34A] mt-0.5">{rec.expectedWaterLiters} L</p>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Target Moisture</span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">{rec.optimalMoisture}</p>
        </div>
      </div>

      {/* Rationale explanation */}
      <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs space-y-1.5">
        <span className="font-bold text-[#166534]">Decision Rationale:</span>
        <p className="text-[#4B5563] leading-relaxed">
          {rec.reason} Evapotranspiration demand is highest between 1:00-3:00 PM; applying water at 4:00 PM minimizes evaporative loss while replenishing the root zone before overnight stomatal closure.
        </p>
      </div>

      <button
        onClick={() => openFieldPassportFor('FIELD-B')}
        className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>Open Field B Passport & Schedule Valve</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
