'use client';

import React from 'react';
import { Sun, Droplets, Info, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function EtAnalyticsCard() {
  const { irrigation } = useFarm();
  const { etAnalytics } = irrigation;

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#F59E0B]" />
            Evapotranspiration (ET) Analytics
          </h3>
          <p className="text-[11px] text-[#6B7280]">FAO-56 Penman-Monteith agro-climatic model</p>
        </div>
        <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
          Kc = {etAnalytics.cropCoefficient}
        </span>
      </div>

      {/* Main ET numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">ET0 (Reference)</span>
          <p className="text-base font-bold text-[#111827] mt-0.5">{etAnalytics.et0} mm/d</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">ETc (Crop Need)</span>
          <p className="text-base font-bold text-[#3B82F6] mt-0.5">{etAnalytics.etc} mm/d</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Crop Coeff (Kc)</span>
          <p className="text-base font-bold text-[#16A34A] mt-0.5">{etAnalytics.cropCoefficient}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Daily Target</span>
          <p className="text-base font-bold text-[#111827] mt-0.5">{etAnalytics.dailyRequirementLiters} L</p>
        </div>
      </div>

      {/* Farmer friendly explanation banner */}
      <div className="p-3 rounded-xl bg-[#FCFDFC] border border-[#E5E7EB] text-xs space-y-1">
        <span className="font-semibold text-[#111827] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#3B82F6]" />
          Farmer-Friendly Summary:
        </span>
        <p className="text-[#4B5563] leading-relaxed">
          &quot;Today your crops need approximately 3.8 mm of water ({etAnalytics.dailyRequirementLiters} Litres across all parcels). With 2,840 L delivered and forecasted humidity at 72%, your irrigation schedule is within 91% of optimal moisture balance.&quot;
        </p>
      </div>
    </div>
  );
}
