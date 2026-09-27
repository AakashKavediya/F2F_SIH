'use client';

import React from 'react';
import { Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export function SoilMoistureGrid() {
  const { fields } = useFarm();

  const chartData = fields.map((f) => ({
    name: f.name,
    moisture: f.soilMoisture,
    crop: f.crop,
    fill: f.soilMoisture < 30 ? '#EF4444' : '#16A34A',
  }));

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-[#3B82F6]" />
            Soil Moisture Gradient by Field Parcel
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Capacitance probes reading at 15cm & 30cm root depth
          </p>
        </div>
        <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
          Optimal Band: 35% – 45%
        </span>
      </div>

      {/* Bar Chart with Optimal Reference Band */}
      <div className="h-56 w-full py-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
            <YAxis stroke="#9CA3AF" fontSize={11} domain={[0, 60]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E7EB',
                borderRadius: '12px',
                fontSize: '11px',
              }}
              formatter={(value: any) => [`${value}% Volumetric Water Content`, 'Soil Moisture']}
            />
            <ReferenceLine y={35} stroke="#16A34A" strokeDasharray="3 3" label={{ value: 'Min (35%)', fill: '#16A34A', fontSize: 10 }} />
            <ReferenceLine y={45} stroke="#16A34A" strokeDasharray="3 3" label={{ value: 'Max (45%)', fill: '#16A34A', fontSize: 10 }} />
            <Bar dataKey="moisture" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Field Cards Mini Status */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#F3F4F6] text-xs text-center">
        {fields.map((f) => (
          <div
            key={f.id}
            className={`p-2 rounded-xl border ${
              f.soilMoisture < 30
                ? 'bg-red-50 border-red-200 text-[#EF4444]'
                : 'bg-[#F7F9F7] border-[#E5E7EB] text-[#111827]'
            }`}
          >
            <span className="text-[10px] text-[#6B7280]">{f.name} ({f.crop})</span>
            <p className="text-sm font-bold mt-0.5">{f.soilMoisture}%</p>
            <span className="text-[10px] font-semibold">
              {f.soilMoisture < 30 ? 'CRITICAL DRY' : 'OPTIMAL'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
