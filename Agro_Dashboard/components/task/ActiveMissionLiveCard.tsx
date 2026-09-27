'use client';

import React, { useState } from 'react';
import { Bot, BatteryCharging, Gauge, Compass, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function ActiveMissionLiveCard() {
  const { agroBots, setSelectedRobot, setIsRobotModalOpen } = useFarm();
  const robot = agroBots[1]; // AGB-02
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#111827]">
                Live Autonomous Mission — MISSION-028
              </h3>
              <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#86EFAC]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                ACTIVE RUN
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Assigned to {robot.name} ({robot.id}) • Disease Inspection Field C (Zone 3)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedRobot(robot);
            setIsRobotModalOpen(true);
          }}
          className="text-xs font-semibold text-[#16A34A] hover:underline"
        >
          View Full Telemetry
        </button>
      </div>

      {/* Progress & Live Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Mission Coverage</span>
          <p className="text-lg font-bold text-[#16A34A] mt-0.5">{robot.coverage}%</p>
          <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] mt-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#16A34A]"
              style={{ width: `${robot.coverage}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Plants Scanned</span>
          <p className="text-lg font-bold text-[#111827] mt-0.5">412 / 520</p>
          <span className="text-[10px] text-[#6B7280]">Row C4-10 to C4-15</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Detections Found</span>
          <p className="text-lg font-bold text-[#EF4444] mt-0.5">17 Blight</p>
          <span className="text-[10px] text-[#EF4444]">Conf: 94%</span>
        </div>

        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[10px] text-[#6B7280]">Battery & Speed</span>
          <p className="text-lg font-bold text-[#111827] mt-0.5">{robot.battery}%</p>
          <span className="text-[10px] text-[#6B7280]">{robot.speed} m/s • 42° Hdg</span>
        </div>
      </div>

      {/* Simulated Mission Control Buttons */}
      <div className="p-3 rounded-xl bg-[#FCFDFC] border border-[#E5E7EB] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#6B7280]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
          <span>Autonomous row navigation active via RTK-GPS guidance (±1.5cm)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F3F4F6] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-colors"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Pause Mission' : 'Resume Mission'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
