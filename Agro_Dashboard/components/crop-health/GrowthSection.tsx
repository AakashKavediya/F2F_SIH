'use client';

import React from 'react';
import { Sprout, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const growthStages = [
  { name: 'Seedling', days: '1–15', completed: true },
  { name: 'Vegetative', days: '16–35', completed: true },
  { name: 'Flowering', days: '36–55', current: true },
  { name: 'Fruiting', days: '56–75', future: true },
  { name: 'Maturity', days: '76–90', future: true },
  { name: 'Harvest-ready', days: '91+', future: true },
];

const growthData = [
  { week: 'W1', height: 8, canopy: 12, health: 94 },
  { week: 'W2', height: 16, canopy: 24, health: 93 },
  { week: 'W3', height: 28, canopy: 42, health: 91 },
  { week: 'W4', height: 42, canopy: 64, health: 88 },
  { week: 'W5', height: 56, canopy: 82, health: 86 },
  { week: 'W6 (Now)', height: 68, canopy: 94, health: 91 },
  { week: 'W7 (Proj)', height: 78, canopy: 105, health: 92 },
];

export function GrowthSection() {
  return (
    <div className="space-y-6">
      {/* Phenological Stage Progress Ribbon */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">
            Tomato Phenological Trajectory (Field C — Abhinav)
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Age: 47 days • Stage: Flowering (Day 12 of stage) • Expected Transition: 8 days
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {growthStages.map((stage) => (
            <div
              key={stage.name}
              className={`p-3 rounded-xl border text-center text-xs space-y-1 transition-all ${
                stage.current
                  ? 'border-[#16A34A] bg-[#F0FDF4] shadow-xs'
                  : stage.completed
                  ? 'border-[#DCFCE7] bg-[#DCFCE7]/40'
                  : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF]'
              }`}
            >
              <div className="flex items-center justify-center">
                {stage.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                ) : stage.current ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D1D5DB]" />
                )}
              </div>
              <p className={`font-semibold ${stage.current ? 'text-[#166534]' : 'text-[#111827]'}`}>
                {stage.name}
              </p>
              <span className="text-[10px] text-[#6B7280]">Days: {stage.days}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Metrics Line Chart */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
          <div>
            <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#16A34A]" />
              Plant Height & Canopy Expansion
            </h4>
            <p className="text-[11px] text-[#6B7280]">Weekly AgroBot photogrammetry tracking</p>
          </div>
          <span className="text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
            Height: 68 cm (Optimal)
          </span>
        </div>

        <div className="h-64 w-full py-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="week" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              />
              <Line type="monotone" dataKey="height" stroke="#16A34A" strokeWidth={2.5} name="Height (cm)" />
              <Line type="monotone" dataKey="canopy" stroke="#3B82F6" strokeWidth={2.5} name="Canopy (cm)" />
              <Line type="monotone" dataKey="health" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" name="Health %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
