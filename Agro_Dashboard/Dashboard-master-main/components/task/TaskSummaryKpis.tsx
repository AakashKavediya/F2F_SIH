'use client';

import React from 'react';
import { CheckSquare, CheckCircle2, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function TaskSummaryKpis() {
  const { tasks } = useFarm();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const aiRec = tasks.filter((t) => t.aiRecommended).length;

  const kpis = [
    { label: 'Total Scheduled Tasks', value: total, sub: 'Farmer + Robot', icon: CheckSquare, color: 'text-[#111827]', bg: 'bg-[#F7F9F7]' },
    { label: 'In Progress / Active', value: inProgress, sub: 'Currently executing', icon: Clock, color: 'text-[#3B82F6]', bg: 'bg-blue-50' },
    { label: 'Pending Action', value: pending, sub: 'Awaiting dispatch', icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
    { label: 'Completed Today', value: completed, sub: 'Verified on-ground', icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
    { label: 'AI Recommended', value: aiRec, sub: 'Telemetry triggered', icon: Sparkles, color: 'text-[#166534]', bg: 'bg-[#F0FDF4]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
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
              <p className="text-[10px] text-[#6B7280] mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
