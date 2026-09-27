'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export function FullAlertsList() {
  const { alerts, acknowledgeAlert } = useFarm();
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Information'>('All');

  const filtered = alerts.filter((a) => {
    if (filter === 'All') return true;
    return a.severity === filter;
  });

  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-[#F3F4F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">
            Active Farm Alerts & Anomaly Registry
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Continuous threshold monitoring across Disease, Water, Weather, Robot, and Schemes
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F7F9F7] p-1 rounded-xl border border-[#E5E7EB] text-xs">
          {(['All', 'Critical', 'Warning', 'Information'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${filter === tab
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#F3F4F6]">
        {filtered.map((alert) => (
          <div key={alert.id} className="p-4 hover:bg-[#F0FDF4]/30 transition-colors flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${alert.severity === 'Critical'
                      ? 'bg-red-50 text-[#EF4444] border-red-200'
                      : alert.severity === 'Warning'
                        ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                        : 'bg-blue-50 text-[#3B82F6] border-blue-200'
                    }`}
                >
                  {alert.severity}
                </span>
                <span className="text-xs font-bold text-[#111827]">{alert.title}</span>
                <span className="text-[10px] text-[#6B7280]">({alert.category})</span>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed max-w-3xl">{alert.description}</p>
              {alert.actionPrompt && (
                <div className="text-[11px] text-[#166534] font-medium pt-0.5">
                  Action: {alert.actionPrompt}
                </div>
              )}
            </div>

            <div className="text-right shrink-0 space-y-1">
              <span className="text-[11px] text-[#9CA3AF] block">{alert.timestamp}</span>
              {alert.status === 'Active' ? (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F9F7] border border-[#E5E7EB] text-[11px] font-semibold text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
                >
                  Acknowledge
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
