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
import { Sparkles, Layers, Activity, CheckCircle2 } from 'lucide-react';
import { fieldsData } from '@/data/farmData';

const npkData: any[] = [];
fieldsData.forEach((f) => {
  f.zones.slice(0, 1).forEach((z) => {
    npkData.push({
      zone: `${f.name.replace('Field ', 'F-')} (${z.name})`,
      field: f.name,
      crop: f.crop,
      nitrogen: z.npk.n,
      phosphorus: z.npk.p,
      potassium: z.npk.k,
      moisture: z.soilMoisture,
      temp: z.soilTemperature,
      score: z.healthScore,
    });
  });
});

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = npkData.find((n) => n.zone === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label} — {item?.crop}</p>
        <p className="text-[11px] text-[#64748B] mb-2">Moisture: {item?.moisture}% • Temp: {item?.temp}°C</p>
        <div className="space-y-1">
          {payload.map((p: any) => (
            <div key={p.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[#475569]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}:
              </span>
              <span className="font-mono font-bold text-[#0F172A]">{p.value} mg/kg</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function NutrientSoilReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Soil Chemistry
            </span>
            <span className="text-xs text-[#6B7280]">Macro-Nutrient Spectrometry (NPK)</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            Nutrient & Soil Macro-Element Profile (N-P-K)
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Available Nitrogen, Phosphorus, and Potassium in mg/kg compared against optimal growth benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Soil Health Index: 90.2 / 100
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={npkData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="zone" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} unit=" mg/kg" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={95} stroke="#16A34A" strokeDasharray="3 3" label={{ value: 'Target N (95)', fill: '#16A34A', fontSize: 10, position: 'right' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="nitrogen" name="Available Nitrogen (N)" fill="#16A34A" radius={[5, 5, 0, 0]} maxBarSize={28} />
            <Bar dataKey="phosphorus" name="Phosphorus (P)" fill="#0284C7" radius={[5, 5, 0, 0]} maxBarSize={28} />
            <Bar dataKey="potassium" name="Potassium (K)" fill="#F59E0B" radius={[5, 5, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F3F4F6]">
        {npkData.map((d) => (
          <div key={d.zone} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0F172A]">
              <span>{d.zone}</span>
              <span className="text-[#16A34A]">{d.score} / 100</span>
            </div>
            <p className="text-[11px] text-[#64748B]">{d.crop}</p>
            <div className="text-[11px] text-[#475569] pt-1">
              <span>N: <strong>{d.nitrogen}</strong> • P: <strong>{d.phosphorus}</strong> • K: <strong>{d.potassium}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
