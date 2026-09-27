'use client';

import React, { useState } from 'react';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const historicalPerformance = [
  { day: 'Day 1', health: 81, water: 82, robot: 65 },
  { day: 'Day 5', health: 82, water: 83, robot: 68 },
  { day: 'Day 10', health: 83, water: 85, robot: 70 },
  { day: 'Day 15', health: 84, water: 86, robot: 72 },
  { day: 'Day 20', health: 85, water: 86, robot: 73 },
  { day: 'Day 25', health: 85, water: 87, robot: 74 },
  { day: 'Day 30', health: 86, water: 87, robot: 74 },
];

export function FarmPerformanceCard() {
  const [range, setRange] = useState<'7D' | '30D' | '90D' | 'Season'>('30D');

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#16A34A]" />
            Historical Farm Performance Trajectory
          </h3>
          <p className="text-[11px] text-[#6B7280]">Aggregate indices tracked across the last 30 days</p>
        </div>

        <div className="flex items-center bg-[#F7F9F7] p-0.5 rounded-lg border border-[#E5E7EB] text-[11px]">
          {(['7D', '30D', '90D', 'Season'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                range === r ? 'bg-white font-semibold text-[#111827] shadow-xs' : 'text-[#6B7280]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-60 w-full py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} />
            <YAxis stroke="#9CA3AF" fontSize={11} domain={[60, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E7EB',
                borderRadius: '12px',
                fontSize: '11px',
              }}
            />
            <Line type="monotone" dataKey="health" stroke="#16A34A" strokeWidth={2.5} name="Farm Health (86)" />
            <Line type="monotone" dataKey="water" stroke="#3B82F6" strokeWidth={2} name="Water Efficiency (87)" />
            <Line type="monotone" dataKey="robot" stroke="#8B5CF6" strokeWidth={2} name="Robot Coverage (74)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#F3F4F6]">
        <span>Overall Health: <strong className="text-[#16A34A]">86 / 100</strong> (↑ 4.8%)</span>
        <span>Stable upward trend over Kharif vegetative window</span>
      </div>
    </div>
  );
}
