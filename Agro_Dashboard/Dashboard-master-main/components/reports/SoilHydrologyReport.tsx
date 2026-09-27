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
import { Droplets } from 'lucide-react';
import { irrigationData } from '@/data/farmData';

const zoneMoistureData = [
  { zone: 'Zone A1', crop: 'Tomato', moisture: 45, target: 40, critical: 30, waterDelivered: 580 },
  { zone: 'Zone A2', crop: 'Tomato', moisture: 43, target: 40, critical: 30, waterDelivered: 490 },
  { zone: 'Zone B1', crop: 'Cotton', moisture: 26, target: 38, critical: 30, waterDelivered: 380 },
  { zone: 'Zone B2', crop: 'Cotton', moisture: 24, target: 38, critical: 30, waterDelivered: 620 },
  { zone: 'Zone C1', crop: 'Tomato', moisture: 43, target: 40, critical: 30, waterDelivered: 420 },
  { zone: 'Zone D1', crop: 'Wheat', moisture: 38, target: 35, critical: 25, waterDelivered: 390 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = zoneMoistureData.find((z) => z.zone === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label} ({item?.crop})</p>
        <div className="space-y-1 mt-1.5">
          <p className="text-[#475569]">
            Soil Moisture: <span className="font-mono font-bold text-[#0F172A]">{item?.moisture}%</span>
          </p>
          <p className="text-[#64748B]">
            Target Benchmark: <span className="font-mono font-bold">{item?.target}%</span>
          </p>
          <p className="text-[#0284C7]">
            Water Delivered: <span className="font-mono font-bold">{item?.waterDelivered} L</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function SoilHydrologyReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
              Hydrology Telemetry
            </span>
            <span className="text-xs text-[#6B7280]">Capacitive Soil Probes & Automated Valves</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#0284C7]" />
            Soil Moisture vs Target & Water Delivered
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Volumetric soil water content across production zones with critical stress thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Efficiency: {irrigationData.waterEfficiencyPct}%
          </span>
          <span className="px-2.5 py-1 bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg text-[#1D4ED8] font-semibold">
            Today: {irrigationData.todayWaterLiters} L
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={zoneMoistureData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="zone" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} domain={[0, 60]} unit="%" tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={30} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Critical Min (30%)', fill: '#B45309', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={40} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Optimal (40%)', fill: '#059669', fontSize: 10, position: 'right' }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="moisture" name="Current Soil Moisture %" radius={[5, 5, 0, 0]} maxBarSize={32}>
              {zoneMoistureData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.moisture < entry.critical ? '#F59E0B' : '#0284C7'} />
              ))}
            </Bar>
            <Bar dataKey="target" name="Target Benchmark %" fill="#CBD5E1" radius={[5, 5, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F3F4F6]">
        <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-xs">
          <p className="text-[11px] text-[#166534] font-semibold">AI Water Conserved</p>
          <p className="text-base font-bold text-[#166534] mt-0.5">23.6 mm (~₹18,400)</p>
          <p className="text-[10px] text-[#475569] mt-0.5">Reduced unnecessary pump cycles</p>
        </div>

        <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs">
          <p className="text-[11px] text-amber-800 font-semibold">Moisture Deficit Flag</p>
          <p className="text-base font-bold text-amber-900 mt-0.5">Zone B2 (24%)</p>
          <p className="text-[10px] text-[#475569] mt-0.5">35-min drip cycle scheduled</p>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
          <p className="text-[11px] text-[#475569] font-semibold">Pump Flow & Pressure</p>
          <p className="text-base font-bold text-[#0F172A] mt-0.5">14.2 L/min @ 1.8 bar</p>
          <p className="text-[10px] text-[#64748B] mt-0.5">Main storage tank at 82%</p>
        </div>
      </div>
    </div>
  );
}
