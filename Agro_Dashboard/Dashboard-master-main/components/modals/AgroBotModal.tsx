'use client';

import React from 'react';
import {
  X,
  Bot,
  BatteryCharging,
  Gauge,
  Compass,
  Cpu,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function AgroBotModal() {
  const { isRobotModalOpen, setIsRobotModalOpen, selectedRobot } = useFarm();

  if (!isRobotModalOpen || !selectedRobot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-float border border-[#E5E7EB] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F9F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shadow-sm">
              <Bot className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2">
                {selectedRobot.name}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                  {selectedRobot.status}
                </span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                {selectedRobot.id} • Mission: {selectedRobot.currentMission} ({selectedRobot.coverage}% coverage)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRobotModalOpen(false)}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Top Telemetry KPI Row */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-[#16A34A]" /> Battery
              </span>
              <p className="text-base font-bold text-[#111827] mt-1">{selectedRobot.battery}%</p>
              <span className="text-[10px] text-[#6B7280]">{selectedRobot.telemetry.batteryVoltage} V</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-[#3B82F6]" /> Speed
              </span>
              <p className="text-base font-bold text-[#111827] mt-1">{selectedRobot.speed} m/s</p>
              <span className="text-[10px] text-[#6B7280]">{selectedRobot.heading}° Heading</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" /> Edge AI
              </span>
              <p className="text-base font-bold text-[#111827] mt-1">{selectedRobot.telemetry.inferenceFps} FPS</p>
              <span className="text-[10px] text-[#166534]">Vision v1.4</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#F59E0B]" /> Motor Temp
              </span>
              <p className="text-base font-bold text-[#111827] mt-1">{selectedRobot.telemetry.motorTemp}°C</p>
              <span className="text-[10px] text-[#6B7280]">{selectedRobot.telemetry.motorRpm} RPM</span>
            </div>
          </div>

          {/* SLAM & Positioning Box */}
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FCFDFC] space-y-2 text-xs">
            <h4 className="font-semibold text-[#111827] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#16A34A]" />
              LiDAR SLAM Odometry & RTK-GPS
            </h4>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1 text-[#6B7280]">
                <div>GPS Position: <span className="text-[#111827] font-semibold">{selectedRobot.gps.latitude.toFixed(6)}, {selectedRobot.gps.longitude.toFixed(6)}</span></div>
                <div>Satellites Locked: <span className="text-[#111827] font-semibold">{selectedRobot.gps.satellites} (HDOP {selectedRobot.gps.hdop})</span></div>
                <div>Localization Accuracy: <span className="text-[#166534] font-semibold">±{(selectedRobot.gps.accuracy * 100).toFixed(0)} cm</span></div>
              </div>
              <div className="space-y-1 text-[#6B7280]">
                <div>SLAM Pose (X, Y): <span className="text-[#111827] font-semibold">({selectedRobot.slam.slamX}, {selectedRobot.slam.slamY}) m</span></div>
                <div>SLAM Map Confidence: <span className="text-[#166534] font-semibold">{selectedRobot.slam.localizationConfidence}%</span></div>
                <div>LiDAR Cloud Points: <span className="text-[#111827] font-semibold">{(selectedRobot.telemetry.lidarPoints / 1000).toFixed(0)}k pts/s</span></div>
              </div>
            </div>
          </div>

          {/* Subsystems Health Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">Subsystems Diagnostics</h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {Object.entries(selectedRobot.subsystems).map(([sys, status]) => {
                if (sys === 'emergencyStop') return null;
                return (
                  <div key={sys} className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between">
                    <span className="capitalize text-[#6B7280]">{sys}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-[#166534]">
                      <CheckCircle2 className="w-3 h-3 text-[#16A34A]" /> Normal
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F9F7] border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="text-xs text-[#6B7280]">
            Emergency Stop: <span className="font-semibold text-[#166534]">DISENGAGED (Safe)</span>
          </div>
          <button
            onClick={() => setIsRobotModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F3F4F6]"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
