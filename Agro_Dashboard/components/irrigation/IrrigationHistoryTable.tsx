'use client';

import React from 'react';
import { useFarm } from '@/context/FarmContext';
import { Droplets, CheckCircle2 } from 'lucide-react';

export function IrrigationHistoryTable() {
  const { irrigation } = useFarm();

  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-[#F3F4F6] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">
            Irrigation & Fertigation Cycle History
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Automated log recorded via electromagnetic flow sensor and wireless valve relays
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
          {irrigation.history.length} Events Logged
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F9F7] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
            <tr>
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Field</th>
              <th className="py-3 px-4">Zone</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Flow Rate</th>
              <th className="py-3 px-4">Volume</th>
              <th className="py-3 px-4">Moisture Pre</th>
              <th className="py-3 px-4">Moisture Post</th>
              <th className="py-3 px-4">Pump</th>
              <th className="py-3 px-4">Valve</th>
              <th className="py-3 px-4 text-right">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {irrigation.history.map((h) => (
              <tr key={h.id} className="hover:bg-[#F0FDF4]/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-[#6B7280]">{h.id}</td>
                <td className="py-3.5 px-4 font-medium text-[#111827]">{h.date}</td>
                <td className="py-3.5 px-4 font-bold text-[#111827]">{h.fieldName}</td>
                <td className="py-3.5 px-4 text-[#6B7280]">{h.zoneId}</td>
                <td className="py-3.5 px-4 text-[#111827]">{h.durationMins} min</td>
                <td className="py-3.5 px-4 text-[#6B7280]">{h.flowRate} L/min</td>
                <td className="py-3.5 px-4 font-bold text-[#3B82F6]">{h.liters} L</td>
                <td className="py-3.5 px-4 text-[#EF4444] font-semibold">{h.moistureBefore}%</td>
                <td className="py-3.5 px-4 text-[#16A34A] font-semibold">{h.moistureAfter}%</td>
                <td className="py-3.5 px-4">
                  <span className="px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#166534] font-bold text-[10px]">
                    {h.pump}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold text-[10px]">
                    {h.valve}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#16A34A]">{h.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
