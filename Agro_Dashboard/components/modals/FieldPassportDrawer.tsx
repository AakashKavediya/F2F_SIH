'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Sprout,
  Activity,
  Droplets,
  AlertTriangle,
  Bot,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Filter,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { EventType } from '@/data/types';
import { exportFieldPassportExcel, exportFieldPassportCsv } from '@/lib/exportExcel';

const filterCategories = [
  'ALL',
  'WATER',
  'FERTILIZER',
  'SPRAY',
  'DISEASE',
  'PEST',
  'WEED',
  'ROBOT',
  'AI SCAN',
  'WEATHER',
  'SOIL',
  'HARVEST',
];

export function FieldPassportDrawer() {
  const {
    isFieldPassportOpen,
    setIsFieldPassportOpen,
    selectedField,
    fieldPassportEvents,
    openPlantPassportFor,
  } = useFarm();

  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!isFieldPassportOpen || !selectedField) return null;

  const filteredEvents = fieldPassportEvents.filter((e) => {
    const matchesField = !e.fieldId || e.fieldId === selectedField.id || e.fieldId === 'ALL';
    if (!matchesField) return false;
    if (activeFilter === 'ALL') return true;
    return e.tags.includes(activeFilter);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-[2px] flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-[#F7F9F7] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                Field Passport
              </span>
              <span className="text-xs text-[#9CA3AF]">ID: {selectedField.id}</span>
            </div>
            <h2 className="text-lg font-bold text-[#111827] mt-1 flex items-center gap-2">
              {selectedField.name}
              <span className="text-sm font-normal text-[#6B7280]">({selectedField.crop} • {selectedField.variety})</span>
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Comprehensive chronological ledger & digital twin record
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportFieldPassportExcel(selectedField, fieldPassportEvents)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#DCFCE7] bg-[#F0FDF4] hover:bg-[#DCFCE7] text-xs font-semibold text-[#166534] transition-colors cursor-pointer shadow-xs"
              title="Download this Field Passport as Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              type="button"
              onClick={() => exportFieldPassportCsv(selectedField, fieldPassportEvents)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#EFF6FF] text-xs font-semibold text-[#2563EB] transition-colors cursor-pointer shadow-xs"
              title="Download this Field Passport as CSV (.csv)"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFieldPassportOpen(false)}
              className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Quick KPI Ribbon */}
        <div className="p-4 bg-white border-b border-[#E5E7EB] grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Total Area</span>
            <div className="text-sm font-bold text-[#111827] mt-0.5">{selectedField.area} acres</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Plants Count</span>
            <div className="text-sm font-bold text-[#111827] mt-0.5">{selectedField.plantCount.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Health Score</span>
            <div className="text-sm font-bold text-[#16A34A] mt-0.5">{selectedField.health}%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
            <span className="text-[11px] text-[#6B7280]">Growth Stage</span>
            <div className="text-sm font-bold text-[#111827] mt-0.5">{selectedField.growthStage}</div>
          </div>
        </div>

        {/* Plant Passport Deep Link Banner */}
        <div className="px-5 py-3 bg-[#F0FDF4] border-b border-[#DCFCE7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#16A34A]" />
            <div className="text-xs">
              <span className="font-semibold text-[#166534]">Featured Plant C-0182</span>
              <span className="text-[#6B7280] ml-1.5">(Row C4-12, Early Blight verified)</span>
            </div>
          </div>
          <button
            onClick={() => openPlantPassportFor('PLANT-C-0182')}
            className="flex items-center gap-1 text-xs font-semibold text-[#16A34A] hover:text-[#15803D] hover:underline"
          >
            <span>Open Plant Passport</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-[#FCFDFC] border-b border-[#E5E7EB] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
          {filterCategories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === filter
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Timeline Events Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A]/50 transition-all shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#111827]">{evt.title}</span>
                    <span className="text-[10px] font-semibold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                      {evt.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mt-0.5">
                    <span>{evt.date} • {evt.timestamp}</span>
                    {evt.zoneId && <span>• {evt.zoneId}</span>}
                    {evt.robotId && (
                      <span className="flex items-center gap-1 text-[#3B82F6] font-medium">
                        <Bot className="w-3 h-3" /> {evt.robotId}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-mono">{evt.id}</span>
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">{evt.description}</p>

              {/* Before vs After comparison block for treatments */}
              {evt.effectivenessPct && (
                <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#166534]">Treatment Effectiveness</span>
                    <span className="font-bold text-[#16A34A] text-sm">{evt.effectivenessPct}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white border border-[#DCFCE7]">
                      <span className="text-[11px] text-[#6B7280]">Pre-Treatment</span>
                      <p className="text-sm font-bold text-[#EF4444] mt-0.5">17 affected</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-[#DCFCE7]">
                      <span className="text-[11px] text-[#6B7280]">Post-Treatment</span>
                      <p className="text-sm font-bold text-[#16A34A] mt-0.5">6 affected</p>
                    </div>
                  </div>
                  {evt.weatherSnippet && (
                    <div className="text-[11px] text-[#6B7280] text-center pt-1">
                      Weather conditions during spray: {evt.weatherSnippet}
                    </div>
                  )}
                </div>
              )}

              {evt.metricChange && !evt.effectivenessPct && (
                <div className="p-2 rounded-lg bg-[#F7F9F7] text-[11px] text-[#166534] font-medium flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Metric Delta: {evt.metricChange}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
