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
} from 'recharts';
import { Leaf } from 'lucide-react';

const fieldHealthComparison = [
  { field: 'Field A', crop: 'Tomato (Arka Rakshak)', health: 92, diseaseRisk: 22, weedCoverage: 5.2, area: '1.8 ac' },
  { field: 'Field B', crop: 'Cotton (Phule Anmol)', health: 84, diseaseRisk: 15, weedCoverage: 7.8, area: '1.8 ac' },
  { field: 'Field C', crop: 'Tomato (Abhinav)', health: 91, diseaseRisk: 78, weedCoverage: 8.4, area: '1.8 ac' },
  { field: 'Field D', crop: 'Wheat (GW-496)', health: 88, diseaseRisk: 12, weedCoverage: 6.1, area: '1.8 ac' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = fieldHealthComparison.find((f) => f.field === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label}</p>
        <p className="text-[11px] text-[#64748B] mb-2">{item?.crop} • {item?.area}</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[#475569]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}:
              </span>
              <span className="font-mono font-bold text-[#0F172A]">{p.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function CropHealthReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Crop Analytics
            </span>
            <span className="text-xs text-[#6B7280]">Multi-Field Comparative Diagnostic</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#16A34A]" />
            Field Health & Pathology Comparison
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Canopy vegetative vigor (NDVI) benchmarked against disease risk and weed coverage.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Avg Health: 88.8%
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fieldHealthComparison} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="field" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#16A34A" strokeDasharray="3 3" label={{ value: 'Target: 80%', fill: '#16A34A', fontSize: 10, position: 'right' }} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Bar dataKey="health" name="Canopy Health %" fill="#16A34A" radius={[5, 5, 0, 0]} maxBarSize={32} />
            <Bar dataKey="diseaseRisk" name="Disease Risk %" fill="#F59E0B" radius={[5, 5, 0, 0]} maxBarSize={32} />
            <Bar dataKey="weedCoverage" name="Weed Coverage %" fill="#94A3B8" radius={[5, 5, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F3F4F6]">
        {fieldHealthComparison.map((f) => (
          <div key={f.field} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0F172A]">
              <span>{f.field}</span>
              <span className="text-[#16A34A]">{f.health}%</span>
            </div>
            <p className="text-[11px] text-[#64748B] truncate">{f.crop}</p>
            <div className="flex items-center justify-between text-[11px] text-[#475569] pt-1">
              <span>Risk: <strong className={f.diseaseRisk > 50 ? 'text-amber-800' : 'text-slate-700'}>{f.diseaseRisk}%</strong></span>
              <span>Weeds: <strong>{f.weedCoverage}%</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
