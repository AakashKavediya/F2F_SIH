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
import { User, MapPin, Award, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';
import { farmerData, farmData } from '@/data/farmData';

const coreIndicesData = [
  { name: 'Farm Health Index', value: farmData.farmHealth, target: 90, color: '#16A34A' },
  { name: 'Crop Health Index', value: farmData.cropHealth, target: 85, color: '#10B981' },
  { name: 'Water Efficiency', value: farmData.waterEfficiency, target: 85, color: '#0284C7' },
  { name: 'Autonomous Coverage', value: farmData.robotCoverage, target: 70, color: '#7C3AED' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = coreIndicesData.find((c) => c.name === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label}</p>
        <div className="space-y-1 mt-1.5">
          <p className="text-[#166534]">
            Current Index: <span className="font-mono font-bold text-sm">{item?.value}%</span>
          </p>
          <p className="text-[#64748B]">
            Season Benchmark: <span className="font-bold">{item?.target}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function FarmOverviewReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Dossier Master
            </span>
            <span className="text-xs text-[#6B7280]">Verified Land Records & Telemetry Baseline</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <User className="w-4 h-4 text-[#16A34A]" />
            Farm & Farmer Master Overview
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Operational baseline, legal land parcels, eKYC status, and high-level performance indices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Status: {farmerData.eKYC}
          </span>
        </div>
      </div>

      {/* Bar Chart comparing core indices */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={coreIndicesData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#16A34A" strokeDasharray="3 3" label={{ value: 'Target: 80%', fill: '#16A34A', fontSize: 10, position: 'right' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="value" name="Current Performance Score %" radius={[5, 5, 0, 0]} maxBarSize={38}>
              {coreIndicesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Bar dataKey="target" name="Season Benchmark Target %" fill="#E2E8F0" radius={[5, 5, 0, 0]} maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Operator & Land Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#F3F4F6]">
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
          <span className="text-[10px] text-[#64748B] font-semibold uppercase">Farmer Details</span>
          <p className="font-bold text-[#0F172A]">{farmerData.name}</p>
          <p className="text-[11px] text-[#64748B]">ID: {farmerData.id} • {farmerData.mobile}</p>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
          <span className="text-[10px] text-[#64748B] font-semibold uppercase">Land Holding</span>
          <p className="font-bold text-[#0F172A]">{farmData.totalArea} Acres ({farmData.cultivableArea} ac Cultivable)</p>
          <p className="text-[11px] text-[#64748B]">{farmData.location} ({farmerData.taluka})</p>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
          <span className="text-[10px] text-[#64748B] font-semibold uppercase">Credit & Scheme</span>
          <p className="font-bold text-[#166534]">KCC: {farmerData.kccLimit}</p>
          <p className="text-[11px] text-[#64748B]">Policy: {farmerData.insuranceStatus}</p>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
          <span className="text-[10px] text-[#64748B] font-semibold uppercase">Harvest Revenue</span>
          <p className="font-bold text-[#0284C7]">₹5.20 Lakh Expected</p>
          <p className="text-[11px] text-[#64748B]">4.6t projected across 3 crops</p>
        </div>
      </div>
    </div>
  );
}
