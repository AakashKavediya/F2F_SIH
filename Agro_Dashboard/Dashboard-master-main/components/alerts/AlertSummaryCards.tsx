'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function AlertSummaryCards() {
  const { alerts } = useFarm();

  const critical = alerts.filter((a) => a.severity === 'Critical').length;
  const warning = alerts.filter((a) => a.severity === 'Warning').length;
  const info = alerts.filter((a) => a.severity === 'Information').length;
  const resolved = 21; // historical verified resolved

  const cards = [
    { label: 'Critical Hazard Alerts', value: critical, sub: 'Immediate action needed', icon: AlertCircle, color: 'text-[#EF4444]', bg: 'bg-red-50', border: 'border-red-200' },
    { label: 'Warning Anomalies', value: warning, sub: 'Trend escalation', icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Informational Telemetry', value: info, sub: 'Routine system events', icon: Info, color: 'text-[#3B82F6]', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Resolved Interventions', value: resolved, sub: 'Verified & closed', icon: CheckCircle2, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]', border: 'border-[#DCFCE7]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`p-4 rounded-2xl bg-white border ${c.border} shadow-subtle flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">{c.label}</span>
              <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-extrabold text-[#111827]">{c.value}</span>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
