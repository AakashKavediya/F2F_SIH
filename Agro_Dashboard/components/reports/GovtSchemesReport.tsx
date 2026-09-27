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
import { Landmark } from 'lucide-react';
import { govtSchemesData } from '@/data/farmData';

const schemeValueData = [
  { scheme: 'PMKSY Drip', name: 'Micro-Irrigation (55%)', eligibleValue: 124000, matchScore: 94, status: 'Documents Pending' },
  { scheme: 'SMAM Robot', name: 'Robotics & Drone (40%)', eligibleValue: 180000, matchScore: 90, status: 'Under Review' },
  { scheme: 'PMFBY Crop', name: 'Crop Insurance Cover', eligibleValue: 85000, matchScore: 98, status: 'Active Enrolled' },
  { scheme: 'PM-KISAN', name: 'Direct Income Support', eligibleValue: 6000, matchScore: 100, status: 'Active Enrolled' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = schemeValueData.find((s) => s.scheme === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs max-w-xs">
        <p className="font-bold text-[#0F172A]">{label} — {item?.name}</p>
        <p className="text-[11px] text-[#64748B] mb-1.5">Status: <strong className="text-[#166534]">{item?.status}</strong></p>
        <div className="space-y-1">
          <p className="text-[#0284C7]">
            Eligible Subsidy Value: <span className="font-mono font-bold">₹{item?.eligibleValue.toLocaleString()}</span>
          </p>
          <p className="text-[#16A34A]">
            Eligibility Match: <span className="font-mono font-bold">{item?.matchScore}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function GovtSchemesReport() {
  const totalEligibleValue = schemeValueData.reduce((acc, s) => acc + s.eligibleValue, 0);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
              Financial Direct Benefits
            </span>
            <span className="text-xs text-[#6B7280]">Central & State Agricultural Schemes</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#0284C7]" />
            Government Scheme Subsidies & Eligibility Scores
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Dossier status, eligible grant values, and document verification compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Total Subsidy Value: ₹{totalEligibleValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={schemeValueData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="scheme" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis
              yAxisId="left"
              stroke="#0284C7"
              fontSize={11}
              tickFormatter={(v) => `₹${v / 1000}k`}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#16A34A"
              fontSize={11}
              domain={[0, 100]}
              unit="%"
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar yAxisId="left" dataKey="eligibleValue" name="Subsidy Grant Value (₹)" fill="#0284C7" radius={[5, 5, 0, 0]} maxBarSize={32} />
            <Bar yAxisId="right" dataKey="matchScore" name="Eligibility Match %" fill="#16A34A" radius={[5, 5, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scheme Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#F3F4F6]">
        {govtSchemesData.map((scheme) => (
          <div key={scheme.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#0F172A]">
              <span className="truncate">{scheme.shortName}</span>
              <span className="text-[#16A34A]">{scheme.eligibilityScore}%</span>
            </div>
            <p className="text-[11px] text-[#64748B] line-clamp-1">{scheme.benefit}</p>
            <div className="flex items-center justify-between text-[10px] text-[#475569] pt-1">
              <span className="px-2 py-0.5 rounded bg-white border border-[#E2E8F0] font-medium text-[#166534]">
                {scheme.applicationStatus}
              </span>
              <span>{scheme.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
