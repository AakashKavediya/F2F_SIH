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
  ReferenceLine,
  Cell,
} from 'recharts';
import { Bug, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { diseaseEventsData, pestEventsData, weedEventsData } from '@/data/farmData';

const eventBarData = [
  { name: 'Early Blight', category: 'Disease', count: 17, unit: 'plants', field: 'Field C (Zone C4)', severity: 'Severe', color: '#EF4444' },
  { name: 'Leaf Spot', category: 'Disease', count: 4, unit: 'plants', field: 'Field A (Zone A2)', severity: 'Low', color: '#F59E0B' },
  { name: 'Bacterial Blight', category: 'Disease', count: 3, unit: 'plants', field: 'Field B (Zone B1)', severity: 'Low', color: '#10B981' },
  { name: 'Whitefly Surge', category: 'Pest', count: 14, unit: 'density/m²', field: 'Field A (Zone A1)', severity: 'Medium', color: '#F59E0B' },
  { name: 'Aphid Colony', category: 'Pest', count: 8, unit: 'density/m²', field: 'Field B (Zone B2)', severity: 'Low', color: '#10B981' },
  { name: 'Parthenium Weed', category: 'Weed', count: 12, unit: 'density/m²', field: 'Field C (Zone C4)', severity: 'Medium', color: '#F59E0B' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = eventBarData.find((e) => e.name === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label} ({item?.category})</p>
        <p className="text-[11px] text-[#64748B] mb-1.5">{item?.field}</p>
        <div className="space-y-1">
          <p className="text-[#334155]">
            Infestation Index: <span className="font-mono font-bold text-[#0F172A]">{item?.count} {item?.unit}</span>
          </p>
          <p className="text-[#64748B]">
            Severity Grade: <span className="font-bold">{item?.severity}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function PathologyEventsReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              Crop Protection
            </span>
            <span className="text-xs text-[#6B7280]">Real-Time Pathology Log</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Bug className="w-4 h-4 text-[#F59E0B]" />
            Disease, Pest & Weed Biological Events
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Pathological events flagged by AgroBot multispectral vision, acoustic microphones, and camera traps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Resolved: 64.7% Treated
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={eventBarData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={10} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Action Threshold (10)', fill: '#B45309', fontSize: 10, position: 'right' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="count" name="Symptomatic Count / Density Index" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {eventBarData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F3F4F6]">
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
          <span className="text-[10px] font-bold text-[#64748B] uppercase">Fungal Diseases</span>
          <p className="font-bold text-[#0F172A] mt-0.5">17 Early Blight lesions in Zone C4</p>
          <p className="text-[11px] text-[#166534] mt-0.5">Copper Oxychloride spray scheduled</p>
        </div>
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
          <span className="text-[10px] font-bold text-[#64748B] uppercase">Insect Vectors</span>
          <p className="font-bold text-[#0F172A] mt-0.5">142 Whiteflies along Field A border</p>
          <p className="text-[11px] text-[#166534] mt-0.5">24 yellow sticky cards + NSKE deployed</p>
        </div>
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
          <span className="text-[10px] font-bold text-[#64748B] uppercase">Weed Density</span>
          <p className="font-bold text-[#0F172A] mt-0.5">8.4% Parthenium in Field C</p>
          <p className="text-[11px] text-[#166534] mt-0.5">Mechanical rotary weeding complete</p>
        </div>
      </div>
    </div>
  );
}
