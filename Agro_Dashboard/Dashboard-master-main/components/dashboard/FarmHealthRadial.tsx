'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck, TrendingUp, Calendar } from 'lucide-react';

const healthBreakdown = [
  { name: 'Crop Health', score: 89, color: 'bg-[#16A34A]' },
  { name: 'Water & Irrigation', score: 84, color: 'bg-[#3B82F6]' },
  { name: 'Soil & Nutrients', score: 82, color: 'bg-[#F59E0B]' },
  { name: 'Disease Suppression', score: 91, color: 'bg-[#10B981]' },
  { name: 'Pest Containment', score: 87, color: 'bg-[#6366F1]' },
  { name: 'Environmental Stability', score: 78, color: 'bg-[#EC4899]' },
  { name: 'Robot Fleet Readiness', score: 95, color: 'bg-[#166534]' },
];

const filterDates: Record<'7D' | '30D' | '90D' | 'Season', string> = {
  '7D': '19 Sep 2026 – 26 Sep 2026',
  '30D': '27 Aug 2026 – 26 Sep 2026',
  '90D': '28 Jun 2026 – 26 Sep 2026',
  'Season': '01 Jun 2026 – 31 Oct 2026 (Kharif)',
};

export function FarmHealthRadial() {
  const [filter, setFilter] = useState<'7D' | '30D' | '90D' | 'Season'>('30D');

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6] gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#16A34A]" />
              Overall Farm Health
            </h3>
            <span className="text-[10px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#16A34A]" />
              {filterDates[filter]}
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280]">Multidimensional weighted composite index</p>
        </div>
        <div className="flex items-center bg-[#F7F9F7] p-0.5 rounded-lg border border-[#E5E7EB] text-[11px]">
          {(['7D', '30D', '90D', 'Season'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              title={filterDates[t]}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                filter === t ? 'bg-white font-semibold text-[#111827] shadow-xs' : 'text-[#6B7280]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Radial + Breakdown Area */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radial Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#E5E7EB]"
                strokeWidth="9"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#16A34A] transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 86 / 100)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#111827] tracking-tight">86</span>
              <span className="text-[11px] text-[#6B7280] font-medium">/ 100</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> Highly Resilient
            </span>
          </div>
        </div>

        {/* Horizontal Factor Bars */}
        <div className="md:col-span-8 space-y-2.5">
          {healthBreakdown.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#4B5563]">{item.name}</span>
                <span className="font-bold text-[#111827]">{item.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
        <span>Aggregated from 4 fields & 12 sensor clusters</span>
        <span className="font-semibold text-[#16A34A] flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> +4.8% ({filter}: {filterDates[filter]})
        </span>
      </div>
    </div>
  );
}
