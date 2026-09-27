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
import { Activity } from 'lucide-react';
import { riskItemsData } from '@/data/farmData';

const riskData = riskItemsData.map((r) => ({
  id: r.id,
  name: r.riskType.replace(' Risk', ''),
  field: `${r.affectedField} (${r.affectedZone})`,
  probability: r.probability,
  confidence: r.confidence,
  trend: r.trend,
  action: r.action,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = riskData.find((r) => r.name === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs max-w-xs">
        <p className="font-bold text-[#0F172A]">{label} Risk</p>
        <p className="text-[11px] text-[#64748B] mb-2">{item?.field} • Trend: {item?.trend}</p>
        <div className="space-y-1 mb-2">
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
        <p className="text-[11px] text-[#166534] bg-[#F0FDF4] p-1.5 rounded-lg border border-[#DCFCE7]">
          <strong>Action: </strong>{item?.action}
        </p>
      </div>
    );
  }
  return null;
};

export function RiskEngineReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              Predictive Diagnostics
            </span>
            <span className="text-xs text-[#6B7280]">Multi-Factor Environmental & Disease Attribution</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#F59E0B]" />
            Agronomic Hazard Probability & AI Confidence
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Probabilities computed from satellite indices, capacitive probes, and IMD agromet forecasts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Loss Prevented: ₹24,600
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={50} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Warning: 50%', fill: '#B45309', fontSize: 10, position: 'right' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="probability" name="Hazard Probability %" fill="#F59E0B" radius={[5, 5, 0, 0]} maxBarSize={32} />
            <Bar dataKey="confidence" name="Model Confidence %" fill="#10B981" radius={[5, 5, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hazard Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#F3F4F6]">
        {riskData.map((r) => (
          <div key={r.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0F172A]">
              <span>{r.name}</span>
              <span className={r.probability > 60 ? 'text-amber-800' : 'text-slate-700'}>
                {r.probability}%
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">{r.field}</p>
            <p className="text-[11px] text-[#166534] font-medium pt-1 line-clamp-2">
              Action: {r.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
