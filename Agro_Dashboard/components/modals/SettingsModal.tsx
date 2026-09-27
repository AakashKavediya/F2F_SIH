'use client';

import React from 'react';
import { X, Settings, Database, Wifi, Shield, Sliders, CheckCircle2 } from 'lucide-react';
import { useFarm, DataModeType } from '@/context/FarmContext';

export function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, dataMode, setDataMode, farm } = useFarm();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-float border border-[#E5E7EB] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F9F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">System Settings</h3>
              <p className="text-[11px] text-[#6B7280]">Telemetry architecture & data source modes</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Data Mode Selection */}
          <div>
            <label className="text-xs font-semibold text-[#111827] flex items-center gap-1.5 mb-2">
              <Database className="w-3.5 h-3.5 text-[#16A34A]" />
              Data Source Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['DEMO', 'LIVE', 'CACHED', 'OFFLINE'] as DataModeType[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDataMode(mode)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    dataMode === mode
                      ? 'border-[#16A34A] bg-[#F0FDF4] shadow-xs'
                      : 'border-[#E5E7EB] bg-white hover:bg-[#F7F9F7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#111827]">{mode}</span>
                    {dataMode === mode && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1">
                    {mode === 'DEMO' && 'Local deterministic relational simulation.'}
                    {mode === 'LIVE' && 'Stream real AgroBot & MQTT telemetry.'}
                    {mode === 'CACHED' && 'Indexed local offline cache.'}
                    {mode === 'OFFLINE' && 'Standby field tablet mode.'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* MQTT Broker & Edge AI status */}
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FCFDFC] space-y-2 text-xs">
            <div className="font-semibold text-[#111827] flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-[#3B82F6]" />
              MQTT Telemetry Pipeline
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>Topic:</span>
              <code className="text-[#111827] bg-[#F3F4F6] px-1.5 py-0.5 rounded">{`farmeros/${farm.id}/#`}</code>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>Edge AI Model:</span>
              <span className="font-semibold text-[#166534]">Edge Vision v1.4 (Active)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>LiDAR Rate:</span>
              <span className="font-semibold text-[#111827]">10 Hz / 150k pts/sec</span>
            </div>
          </div>

          {/* Language & Unit System */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-[#E5E7EB] bg-white">
              <span className="text-[11px] text-[#6B7280]">Display Language</span>
              <p className="font-semibold text-[#111827] mt-1">English (with Marathi & Hindi terms)</p>
            </div>
            <div className="p-3 rounded-xl border border-[#E5E7EB] bg-white">
              <span className="text-[11px] text-[#6B7280]">Units of Measure</span>
              <p className="font-semibold text-[#111827] mt-1">Acres, Litres, °C, mg/kg</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F9F7] border-t border-[#E5E7EB] flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-semibold hover:bg-[#15803D] transition-colors"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
