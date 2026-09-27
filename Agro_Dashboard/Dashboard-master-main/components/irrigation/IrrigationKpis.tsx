'use client';

import React from 'react';
import { Droplets, Activity, TrendingUp, ShieldCheck, Gauge } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function IrrigationKpis() {
  const { irrigation } = useFarm();

  const kpis = [
    { label: "Today's Consumption", value: `${irrigation.todayWaterLiters.toLocaleString()} L`, sub: 'Target 3,100 L (ETc)', icon: Droplets, color: 'text-[#3B82F6]', bg: 'bg-blue-50' },
    { label: 'Weekly Volume', value: `${irrigation.weeklyWaterLiters.toLocaleString()} L`, sub: 'Past 7 days delivery', icon: Activity, color: 'text-[#3B82F6]', bg: 'bg-blue-50' },
    { label: 'Monthly Volume', value: `${irrigation.monthlyWaterLiters.toLocaleString()} L`, sub: 'September Kharif cycle', icon: Activity, color: 'text-[#6366F1]', bg: 'bg-indigo-50' },
    { label: 'Water Efficiency', value: `${irrigation.waterEfficiencyPct}%`, sub: '↑ 5.4% improvement', icon: Gauge, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
    { label: 'Water Conserved', value: `${irrigation.waterSavedLiters.toLocaleString()} L`, sub: 'Saved vs flood irrigation', icon: ShieldCheck, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
    { label: 'Farm Soil Moisture', value: `${irrigation.farmAverageMoisture}%`, sub: 'Optimal (35–45%)', icon: Droplets, color: 'text-[#166534]', bg: 'bg-[#F0FDF4]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#6B7280]">{kpi.label}</span>
              <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-[#111827]">{kpi.value}</span>
              <p className="text-[10px] text-[#6B7280] mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
