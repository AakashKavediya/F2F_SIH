'use client';

import React from 'react';
import { CloudRain, Wind, Droplets, Thermometer, ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function ImdSankalpWeatherSection() {
  const { weather, dataMode, farm } = useFarm();
  const { climatology, current, forecast } = weather;

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F3F4F6] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#111827]">
                IMD & Mausam SANKALP Agromet Intelligence
              </h3>
              <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                ● {dataMode} AGROMET FEED
              </span>
              <a
                href="https://mausamsankalp.imd.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 hover:underline ml-1"
                title="Open Official IMD Mausam SANKALP Portal"
              >
                <span>mausamsankalp.imd.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              India Meteorological Department • {farm.district} Agromet Advisory Service • Ministry of Earth Sciences
            </p>
          </div>
        </div>

        <div className="text-right sm:self-center">
          <span className="text-xs font-semibold text-[#111827]">Station: {farm.district} Centre</span>
          <p className="text-[10px] text-[#9CA3AF]">Agromet Bulletin #42/2026</p>
        </div>
      </div>

      {/* Official Advisory Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-[#1E3A8A] space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Info className="w-4 h-4 text-[#3B82F6]" />
          <span>Official Agromet Crop Advisory ({farm.location}):</span>
        </div>
        <p className="text-[#1E40AF] leading-relaxed">
          Moderate rain (18 mm) and scattered coastal thunderstorms expected across {farm.district} rural block over next 36 hours. Cotton and vegetable growers should delay non-essential irrigation and ensure drainage paths are unobstructed to prevent waterlogging. Tomato growers must monitor for Early Blight spore dispersal under current 72% relative humidity.
        </p>
      </div>

      {/* Climatology & 30-Year Rainfall Comparison */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">30-Year Normal Rain</span>
          <p className="text-base font-bold text-[#111827] mt-0.5">{climatology.thirtyYearMeanRainfallMm} mm</p>
          <span className="text-[10px] text-[#6B7280]">Seasonal average</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Cumulative Recorded</span>
          <p className="text-base font-bold text-[#3B82F6] mt-0.5">{climatology.cumulativeRainfallMm} mm</p>
          <span className="text-[10px] font-semibold text-[#16A34A]">+{climatology.anomalyPct}% Anomaly</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Extreme 95th %ile</span>
          <p className="text-base font-bold text-[#EF4444] mt-0.5">{climatology.percentiles.p95} mm/day</p>
          <span className="text-[10px] text-[#6B7280]">99th: {climatology.percentiles.p99} mm</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Consecutive Dry Spell</span>
          <p className="text-base font-bold text-[#111827] mt-0.5">{climatology.drySpellDays} days</p>
          <span className="text-[10px] text-[#6B7280]">Rain forecast breaks spell</span>
        </div>
      </div>
    </div>
  );
}
