'use client';

import React from 'react';
import { Bot, BatteryCharging, Gauge, Compass, Radio, ExternalLink } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function RobotTelemetryOverlay() {
  const { agroBots, setSelectedRobot, setIsRobotModalOpen } = useFarm();
  const robot = agroBots[1]; // AGB-02 (Precision robot in Field C)

  const handleInspect = () => {
    setSelectedRobot(robot);
    setIsRobotModalOpen(true);
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#111827]">{robot.name}</h4>
            <span className="text-[10px] text-[#6B7280]">{robot.id} • RTK-GPS Fixed</span>
          </div>
        </div>
        <button
          onClick={handleInspect}
          className="text-[11px] font-semibold text-[#16A34A] hover:underline flex items-center gap-0.5"
        >
          <span>Live HUD</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl bg-[#F7F9F7]">
          <span className="text-[10px] text-[#6B7280]">Battery</span>
          <p className="text-xs font-bold text-[#16A34A] mt-0.5">{robot.battery}%</p>
        </div>
        <div className="p-2 rounded-xl bg-[#F7F9F7]">
          <span className="text-[10px] text-[#6B7280]">Speed</span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">{robot.speed} m/s</p>
        </div>
        <div className="p-2 rounded-xl bg-[#F7F9F7]">
          <span className="text-[10px] text-[#6B7280]">Heading</span>
          <p className="text-xs font-bold text-[#111827] mt-0.5">{robot.heading}°</p>
        </div>
      </div>

      <div className="space-y-1 text-[11px] text-[#6B7280] p-2.5 rounded-xl bg-[#FCFDFC] border border-[#E5E7EB]">
        <div className="flex justify-between">
          <span>Mission:</span>
          <span className="font-semibold text-[#111827]">{robot.currentMission}</span>
        </div>
        <div className="flex justify-between">
          <span>SLAM Pose (X, Y):</span>
          <span className="font-mono text-[#111827]">({robot.slam.slamX}, {robot.slam.slamY}) m</span>
        </div>
        <div className="flex justify-between">
          <span>Localization Confidence:</span>
          <span className="font-semibold text-[#166534]">{robot.slam.localizationConfidence}%</span>
        </div>
      </div>
    </div>
  );
}
