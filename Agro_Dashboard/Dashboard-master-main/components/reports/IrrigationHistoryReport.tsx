'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Droplets, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { irrigationData } from '@/data/farmData';

const historyData = irrigationData.history.map((h) => ({
  name: `${h.fieldName.replace('Field ', 'F-')} (${h.zoneId.replace('ZONE-', 'Z-')})`,
  date: h.date,
  liters: h.liters,
  durationMins: h.durationMins,
  flowRate: h.flowRate,
  moistureBefore: h.moistureBefore,
  moistureAfter: h.moistureAfter,
  efficiency: h.efficiency,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = historyData.find((h) => h.name === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label} — {item?.date}</p>
        <div className="space-y-1 mt-1.5">
          <p className="text-[#0284C7]">
            Water Delivered: <span className="font-mono font-bold">{item?.liters} Liters</span>
          </p>
          <p className="text-[#64748B]">
            Duration: <span className="font-bold">{item?.durationMins} minutes</span>
          </p>
          <p className="text-[#166534]">
            Soil Moisture: <span className="font-mono font-bold">{item?.moistureBefore}% → {item?.moistureAfter}%</span>
          </p>
          <p className="text-[#475569]">
            Cycle Efficiency: <span className="font-bold">{item?.efficiency}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function IrrigationHistoryReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
              Solenoid Run Log
            </span>
            <span className="text-xs text-[#6B7280]">Pressure & Moisture Delta History</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#0284C7]" />
            Irrigation Execution History & Water Volumes
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Liters delivered, run durations, and verified pre/post soil moisture replenishment.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Avg Delivery Accuracy: 94.2%
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historyData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} unit=" L" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="liters" name="Water Delivered (Liters)" fill="#0284C7" radius={[5, 5, 0, 0]} maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Moisture Delta Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-[#F1F5F9] text-[#64748B]">
              <th className="pb-2 font-semibold">Run Date</th>
              <th className="pb-2 font-semibold">Field / Zone</th>
              <th className="pb-2 font-semibold">Duration</th>
              <th className="pb-2 font-semibold">Flow Rate</th>
              <th className="pb-2 font-semibold">Volume</th>
              <th className="pb-2 font-semibold">Moisture Δ</th>
              <th className="pb-2 font-semibold">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {irrigationData.history.map((h) => (
              <tr key={h.id} className="hover:bg-[#F8FAFC]">
                <td className="py-2 text-[#64748B]">{h.date}</td>
                <td className="py-2 font-medium text-[#0F172A]">{h.fieldName} • {h.zoneId}</td>
                <td className="py-2 text-[#475569]">{h.durationMins} min</td>
                <td className="py-2 text-[#475569]">{h.flowRate} L/min</td>
                <td className="py-2 font-bold text-[#0284C7]">{h.liters} L</td>
                <td className="py-2 font-mono text-[#166534]">{h.moistureBefore}% → {h.moistureAfter}%</td>
                <td className="py-2 font-medium text-[#166534]">{h.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
