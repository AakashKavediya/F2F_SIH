'use client';

import React from 'react';
import { TaskSummaryKpis } from '@/components/task/TaskSummaryKpis';
import { ActiveMissionLiveCard } from '@/components/task/ActiveMissionLiveCard';
import { TaskCardList } from '@/components/task/TaskCardList';
import { MissionHistoryTable } from '@/components/task/MissionHistoryTable';
import { CheckSquare, Bot, ShieldCheck } from 'lucide-react';

export default function TaskPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Field Operations
            </span>
            <span className="text-xs text-[#6B7280]">Autonomous Robotics & Agronomic Action Center</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] mt-1.5">
            Farm Tasks & Robotics Mission Control
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Coordinate manual farmer interventions with autonomous scout, mapping, spraying, and NPK scanning missions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-2 rounded-xl text-xs font-semibold text-[#166534]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>AgroBot Safety Autonomy Active</span>
        </div>
      </div>

      {/* KPI Row (5 items) */}
      <TaskSummaryKpis />

      {/* Active Mission Live Telemetry Banner */}
      <ActiveMissionLiveCard />

      {/* Task Operations List */}
      <TaskCardList />

      {/* Mission History Table */}
      <MissionHistoryTable />
    </div>
  );
}
