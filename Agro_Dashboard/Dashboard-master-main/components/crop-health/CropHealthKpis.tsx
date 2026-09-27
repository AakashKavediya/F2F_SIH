'use client';

import React from 'react';
import { Sprout, CheckCircle2, AlertTriangle, Bug, Flower2, Sparkles } from 'lucide-react';

export function CropHealthKpis() {
  const kpis = [
    { label: 'Total Monitored Plants', value: '18,642', icon: Sprout, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
    { label: 'Healthy Plants', value: '16,201', sub: '86.9% optimal', icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
    { label: 'Disease Affected', value: '347', sub: '17 in C4 hotspot', icon: AlertTriangle, color: 'text-[#EF4444]', bg: 'bg-red-50' },
    { label: 'Pest Affected', value: '284', sub: 'Whitefly +18%', icon: Bug, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
    { label: 'Weed Competing', value: '512', sub: '8.4% coverage', icon: Flower2, color: 'text-[#6366F1]', bg: 'bg-indigo-50' },
    { label: 'Nutrient Stressed', value: '186', sub: 'Field D N-deficit', icon: Sparkles, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
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
              <span className="text-2xl font-bold text-[#111827]">{kpi.value}</span>
              {kpi.sub && <p className="text-[10px] text-[#6B7280] mt-0.5">{kpi.sub}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
