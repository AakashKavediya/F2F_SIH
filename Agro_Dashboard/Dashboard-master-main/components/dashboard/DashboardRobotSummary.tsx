'use client';

import React from 'react';
import { Bot, BatteryCharging, Gauge, CheckCircle2, ChevronRight, Radio } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function DashboardRobotSummary() {
  const { agroBots, setSelectedRobot, setIsRobotModalOpen } = useFarm();

  const handleOpenRobot = (robot: typeof agroBots[0]) => {
    setSelectedRobot(robot);
    setIsRobotModalOpen(true);
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-[#8B5CF6]" />
            AgroBot Fleet Status
          </h3>
          <p className="text-[11px] text-[#6B7280]">Autonomous ground robotics & Edge AI telemetry</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
          2 Online
        </span>
      </div>

      {/* Fleet Cards */}
      <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {agroBots.map((robot) => (
          <div
            key={robot.id}
            onClick={() => handleOpenRobot(robot)}
            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A] hover:bg-[#F0FDF4]/30 cursor-pointer transition-all shadow-xs group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                  {robot.id}
                </span>
                <span className="text-[10px] text-[#6B7280] font-medium">{robot.name}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span className="truncate max-w-[150px]">Mission: <strong className="text-[#111827] font-semibold">{robot.currentMission}</strong></span>
              <span className="font-semibold text-[#16A34A]">{robot.coverage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#16A34A] transition-all duration-500"
                style={{ width: `${robot.coverage}%` }}
              />
            </div>

            {/* Subsystems Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
              {['GPS', 'SLAM', 'LiDAR', 'Camera', 'Edge AI'].map((sub) => (
                <span
                  key={sub}
                  className="px-1.5 py-0.5 rounded bg-[#F7F9F7] border border-[#E5E7EB] text-[#4B5563] font-medium flex items-center gap-0.5"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#16A34A]" /> {sub}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-[#16A34A]" /> {robot.battery}%
              </span>
              <span className="flex items-center gap-1 text-[#16A34A] font-semibold group-hover:underline">
                Inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-[#9CA3AF] text-center">
        Edge AI inference running at 24–26 FPS on-robot with local tensor cores
      </div>
    </div>
  );
}
