'use client';

import React from 'react';
import {
  X,
  Sprout,
  Activity,
  Droplets,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function PlantPassportDrawer() {
  const { isPlantPassportOpen, setIsPlantPassportOpen, selectedPlant } = useFarm();

  if (!isPlantPassportOpen || !selectedPlant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-[2px] flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-[#F7F9F7] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                Individual Plant Passport
              </span>
              <span className="text-xs font-mono text-[#6B7280]">#{selectedPlant.id}</span>
            </div>
            <h2 className="text-lg font-bold text-[#111827] mt-1 flex items-center gap-2">
              {selectedPlant.cropName}
              <span className="text-sm font-normal text-[#6B7280]">({selectedPlant.variety})</span>
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {selectedPlant.fieldId} • {selectedPlant.zoneId} • {selectedPlant.rowId}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/crops-health/plant-passport/${selectedPlant.id}`}
              onClick={() => setIsPlantPassportOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Full Passport</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setIsPlantPassportOpen(false)}
              className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plant Metadata Cards */}
        <div className="p-4 bg-white border-b border-[#E5E7EB] grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Age</span>
            <div className="text-sm font-bold text-[#111827] mt-0.5">{selectedPlant.ageDays} days</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Health</span>
            <div className="text-sm font-bold text-[#16A34A] mt-0.5">{selectedPlant.health}%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Growth Stage</span>
            <div className="text-sm font-bold text-[#111827] mt-0.5">{selectedPlant.stage}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Status</span>
            <div className="text-sm font-bold text-[#166534] mt-0.5">{selectedPlant.status}</div>
          </div>
        </div>

        {/* Cumulative Stats Grid */}
        <div className="p-4 bg-[#FCFDFC] border-b border-[#E5E7EB] grid grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-center">
            <span className="text-[10px] text-[#6B7280]">Est. Water</span>
            <p className="text-xs font-bold text-[#111827] mt-0.5">{selectedPlant.stats.estimatedWaterLiters} L</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-center">
            <span className="text-[10px] text-[#6B7280]">Fertilizer Apps</span>
            <p className="text-xs font-bold text-[#111827] mt-0.5">{selectedPlant.stats.fertilizerApplications}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-center">
            <span className="text-[10px] text-[#6B7280]">Targeted Sprays</span>
            <p className="text-xs font-bold text-[#111827] mt-0.5">{selectedPlant.stats.sprays}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-center">
            <span className="text-[10px] text-[#6B7280]">AI Scans</span>
            <p className="text-xs font-bold text-[#16A34A] mt-0.5">{selectedPlant.stats.aiScans}</p>
          </div>
        </div>

        {/* AI "What Changed" Card */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            <h4 className="text-xs font-bold text-[#166534] uppercase tracking-wide">
              AI &quot;What Changed&quot; Delta
            </h4>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white border border-[#DCFCE7]">
              <span className="text-[10px] text-[#6B7280]">Health</span>
              <p className="text-xs font-bold text-[#16A34A] mt-0.5 flex items-center justify-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {selectedPlant.aiWhatChanged.healthDelta}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white border border-[#DCFCE7]">
              <span className="text-[10px] text-[#6B7280]">Symptoms</span>
              <p className="text-xs font-bold text-[#16A34A] mt-0.5 flex items-center justify-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {selectedPlant.aiWhatChanged.diseaseDelta}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white border border-[#DCFCE7]">
              <span className="text-[10px] text-[#6B7280]">Soil Moisture</span>
              <p className="text-xs font-bold text-[#3B82F6] mt-0.5 flex items-center justify-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {selectedPlant.aiWhatChanged.moistureDelta}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white border border-[#DCFCE7]">
              <span className="text-[10px] text-[#6B7280]">Robot Inspec.</span>
              <p className="text-xs font-bold text-[#111827] mt-0.5">
                {selectedPlant.aiWhatChanged.robotInspections}
              </p>
            </div>
          </div>
          <p className="text-xs text-[#166534] font-medium bg-white/70 p-2 rounded-lg border border-[#DCFCE7]">
            &quot;{selectedPlant.aiWhatChanged.summary}&quot;
          </p>
        </div>

        {/* Plant Journey Timeline */}
        <div className="flex-1 overflow-y-auto p-5">
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#16A34A]" />
            Plant Life Journey
          </h4>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
            {selectedPlant.timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-4 ring-white" />
                <div className="p-3 rounded-xl border border-[#E5E7EB] bg-white group-hover:border-[#16A34A]/50 transition-colors shadow-subtle text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#111827]">{step.event}</span>
                    <span className="text-[10px] font-medium text-[#6B7280]">{step.date}</span>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
