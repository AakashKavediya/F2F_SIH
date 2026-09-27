'use client';

import React, { useState } from 'react';
import { CloudRain, Wind, Droplets, Sun, Calendar, Thermometer, ShieldCheck, ExternalLink } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function DashboardWeather() {
  const { weather, farm, dataMode } = useFarm();
  const [tab, setTab] = useState<'Today' | 'Tomorrow' | '7Days'>('Today');

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-[#3B82F6]" />
              Agromet Weather
            </h3>
            <a
              href="https://mausamsankalp.imd.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#166534] hover:bg-[#bbf7d0] transition-colors inline-flex items-center gap-1"
              title="Official IMD Mausam SANKALP Portal"
            >
              <span>IMD / SANKALP</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <p className="text-[11px] text-[#6B7280]">Microclimate & precipitation advisory</p>
        </div>
        <div className="flex items-center bg-[#F7F9F7] p-0.5 rounded-lg border border-[#E5E7EB] text-[11px]">
          {(['Today', 'Tomorrow', '7Days'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                tab === t ? 'bg-white font-semibold text-[#111827] shadow-xs' : 'text-[#6B7280]'
              }`}
            >
              {t === '7Days' ? '7 Days' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Metric Box */}
      {tab === 'Today' && (
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3B82F6] flex items-center justify-center">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#111827]">{weather.current.temp}°C</span>
                  <span className="text-xs text-[#6B7280]">{farm.district}</span>
                </div>
                <p className="text-xs font-medium text-[#4B5563]">{weather.current.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#3B82F6] bg-blue-50 px-2 py-1 rounded-lg">
                Rain: {weather.current.rainProbability}%
              </span>
              <p className="text-[11px] text-[#6B7280] mt-1">{weather.current.expectedRainMm} mm expected</p>
            </div>
          </div>

          {/* Sub Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3 text-[#3B82F6]" /> Humidity
              </span>
              <p className="text-sm font-bold text-[#111827] mt-0.5">{weather.current.humidity}%</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <Wind className="w-3 h-3 text-[#10B981]" /> Wind
              </span>
              <p className="text-sm font-bold text-[#111827] mt-0.5">{weather.current.windSpeedKmH} km/h</p>
              <span className="text-[10px] text-[#9CA3AF]">{weather.current.windDirection}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <Sun className="w-3 h-3 text-[#F59E0B]" /> UV Index
              </span>
              <p className="text-sm font-bold text-[#111827] mt-0.5">{weather.current.uvIndex} (Mod)</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'Tomorrow' && (
        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <div>
              <span className="text-xs font-bold text-[#111827]">{weather.forecast[1].condition}</span>
              <p className="text-[11px] text-[#6B7280]">Expected Temp: {weather.forecast[1].tempMin}° - {weather.forecast[1].tempMax}°C</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#EF4444] bg-red-50 px-2 py-1 rounded-lg">
                Rain: {weather.forecast[1].rainProb}%
              </span>
            </div>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Thunderstorm advisory: Delay foliar sprays. Ensure drainage gates are clear in Cotton (Field B) and Tomato (Field C).
          </p>
        </div>
      )}

      {tab === '7Days' && (
        <div className="py-2 divide-y divide-[#F3F4F6] text-xs">
          {weather.forecast.map((day) => (
            <div key={day.day} className="py-1.5 flex items-center justify-between">
              <span className="font-semibold text-[#111827] w-16">{day.day}</span>
              <span className="text-[#6B7280] truncate flex-1">{day.condition}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#3B82F6] font-medium">{day.rainProb}% rain</span>
                <span className="font-bold text-[#111827]">{day.tempMin}° / {day.tempMax}°</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#9CA3AF]">
        <span>Source: {weather.source}</span>
        <span className="font-semibold text-[#166534]">● {dataMode} WEATHER DATA</span>
      </div>
    </div>
  );
}
