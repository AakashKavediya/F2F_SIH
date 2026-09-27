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
import { Bot } from 'lucide-react';
import { agroBotsData } from '@/data/farmData';

const missionDistributionData = [
  { type: 'Canopy Scouting', missions: 62, hours: 124, coverageHa: 4.2, color: '#3B82F6' },
  { type: 'Precision Spraying', missions: 38, hours: 76, coverageHa: 2.1, color: '#10B981' },
  { type: 'SLAM Grid Mapping', missions: 24, hours: 48, coverageHa: 1.8, color: '#8B5CF6' },
  { type: 'NPK Soil Sampling', missions: 19, hours: 36, coverageHa: 0.9, color: '#F59E0B' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = missionDistributionData.find((m) => m.type === label);
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A]">{label}</p>
        <div className="space-y-1 mt-1.5">
          <p className="text-[#3B82F6]">
            Total Missions: <span className="font-mono font-bold">{item?.missions}</span>
          </p>
          <p className="text-[#10B981]">
            Operating Hours: <span className="font-mono font-bold">{item?.hours}h</span>
          </p>
          <p className="text-[#64748B]">
            Hectares Covered: <span className="font-mono font-bold">{item?.coverageHa} ha</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function RoboticsMissionReport() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
              Fleet Operations
            </span>
            <span className="text-xs text-[#6B7280]">Autonomous AgroBot Mission Log</span>
          </div>
          <h3 className="text-base font-bold text-[#111827] mt-1 flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#7C3AED]" />
            Robotics Mission Distribution & Hours Logged
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Operational hours, mission breakdown, and edge localization confidence across fleet.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#F5F3FF] border border-[#DDD6FE] rounded-lg text-[#6D28D9] font-semibold">
            Fleet: 2 Active AgroBots
          </span>
          <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] font-semibold">
            Labor Saved: ₹32,000
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={missionDistributionData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="type" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
            <Bar dataKey="missions" name="Completed Missions" fill="#3B82F6" radius={[5, 5, 0, 0]} maxBarSize={32} />
            <Bar dataKey="hours" name="Autonomous Operating Hours" fill="#8B5CF6" radius={[5, 5, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fleet Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F3F4F6]">
        {agroBotsData.map((bot) => (
          <div key={bot.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F172A]">{bot.id} • {bot.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#DCFCE7] text-[#166534]">
                {bot.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-[#475569] pt-1">
              <div>
                <span className="text-[#64748B] block text-[10px]">Battery:</span>
                <strong className="text-[#0F172A]">{bot.battery}%</strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px]">SLAM Conf:</span>
                <strong className="text-[#16A34A]">{bot.slam.localizationConfidence}%</strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px]">Coverage:</span>
                <strong className="text-[#0F172A]">{bot.coverage}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
