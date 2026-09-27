'use client';

import React from 'react';
import { Power, Radio, Gauge, Waves, Droplet, CheckCircle2 } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function FlowAndHardwareControls() {
  const { irrigation, togglePump, toggleValve } = useFarm();
  const { flowSensor } = irrigation;

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-[#3B82F6]" />
            Drip Automation & Pump Actuators
          </h3>
          <p className="text-[11px] text-[#6B7280]">Real-time electromagnetic flow meter & solenoid relays</p>
        </div>
        <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
          Telemetry Active
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#3B82F6]" /> Flow Rate
          </span>
          <p className="text-lg font-bold text-[#111827] mt-0.5">{flowSensor.rateLitersPerMin} L/min</p>
          <span className="text-[10px] text-[#6B7280]">{flowSensor.pressureBar} bar pressure</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[11px] text-[#6B7280] flex items-center justify-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-[#10B981]" /> Delivered
          </span>
          <p className="text-lg font-bold text-[#111827] mt-0.5">{flowSensor.totalDeliveredLiters} L</p>
          <span className="text-[10px] text-[#166534]">Cycle in progress</span>
        </div>
        <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
          <span className="text-[11px] text-[#6B7280]">Tank Level</span>
          <p className="text-lg font-bold text-[#111827] mt-0.5">{flowSensor.tankLevelPct}%</p>
          <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] mt-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B82F6]"
              style={{ width: `${flowSensor.tankLevelPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actuator Toggles */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Pump Toggle */}
        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#111827]">Solar Submersible Pump</span>
            <p className="text-[10px] text-[#6B7280]">Borewell 1 (5 HP)</p>
          </div>
          <button
            onClick={togglePump}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              flowSensor.pumpStatus === 'ON'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-gray-100 text-[#4B5563] hover:bg-gray-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{flowSensor.pumpStatus}</span>
          </button>
        </div>

        {/* Master Valve Toggle */}
        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#111827]">Master Solenoid Valve</span>
            <p className="text-[10px] text-[#6B7280]">Main Manifold Drip</p>
          </div>
          <button
            onClick={toggleValve}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              flowSensor.valveStatus === 'OPEN'
                ? 'bg-[#3B82F6] text-white shadow-xs'
                : 'bg-gray-100 text-[#4B5563] hover:bg-gray-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{flowSensor.valveStatus}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
