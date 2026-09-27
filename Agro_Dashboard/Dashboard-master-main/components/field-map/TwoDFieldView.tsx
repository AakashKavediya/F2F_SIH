'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import { Bot, MapPin, Droplets, AlertTriangle, Bug, Sparkles, Radio, CheckCircle2 } from 'lucide-react';

interface TwoDFieldViewProps {
  mapMode: '2D' | 'SATELLITE' | 'TERRAIN' | 'SLAM';
  activeLayers: Record<string, boolean>;
  onSelectEntity: (type: 'field' | 'zone' | 'plant' | 'sensor' | 'robot', id: string) => void;
}

export function TwoDFieldView({ mapMode, activeLayers, onSelectEntity }: TwoDFieldViewProps) {
  const { fields, agroBots, openFieldPassportFor, openPlantPassportFor } = useFarm();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  // Background style based on map mode
  const getMapBg = () => {
    switch (mapMode) {
      case 'SATELLITE':
        return 'bg-[#27382B] text-white'; // Deep aerial vegetation green
      case 'TERRAIN':
        return 'bg-[#EDE8DC] text-[#3E2723]'; // Contoured topo cream
      case 'SLAM':
        return 'bg-[#0F172A] text-white'; // High-contrast LiDAR SLAM grid
      default:
        return 'bg-[#F7F9F7] text-[#111827]';
    }
  };

  return (
    <div className={`relative w-full h-[600px] rounded-2xl overflow-hidden border border-[#E5E7EB] ${getMapBg()} shadow-subtle select-none transition-colors duration-200`}>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Cadastral Boundary Line */}
      <div className="absolute inset-4 rounded-3xl border-2 border-dashed border-[#16A34A]/50 pointer-events-none z-10" />

      {/* Fields Grid Layout */}
      <div className="absolute inset-8 grid grid-cols-2 gap-4 z-10">
        {fields.map((field) => (
          <div
            key={field.id}
            onClick={() => onSelectEntity('field', field.id)}
            className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
              field.id === 'FIELD-C'
                ? 'bg-red-50/40 border-red-300 hover:border-red-500'
                : field.id === 'FIELD-B'
                ? 'bg-amber-50/40 border-amber-300 hover:border-amber-500'
                : 'bg-white/80 border-[#E5E7EB] hover:border-[#16A34A]'
            }`}
          >
            {/* Field Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                  {field.name}
                </span>
                <p className="text-xs text-[#6B7280]">
                  {field.crop} • {field.variety} ({field.area} ac)
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  field.health >= 90 ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-amber-100 text-[#F59E0B]'
                }`}
              >
                {field.health}% Health
              </span>
            </div>

            {/* Zone Division Sub-Grids */}
            {activeLayers.zones && (
              <div className="my-2 grid grid-cols-3 gap-1.5">
                {field.zones.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEntity('zone', zone.id);
                    }}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    className={`p-2 rounded-lg text-center text-[10px] border transition-all ${
                      zone.hasActiveIssue
                        ? 'bg-red-100/70 border-red-300 text-[#EF4444] font-bold animate-pulse'
                        : 'bg-white/90 border-[#E5E7EB] text-[#4B5563] hover:border-[#16A34A]'
                    }`}
                  >
                    <span>{zone.name}</span>
                    <div className="text-[9px] text-[#6B7280]">
                      {zone.soilMoisture}% moist
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Crop Rows & Plant C-0182 in Field C */}
            {field.id === 'FIELD-C' && activeLayers.rows && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                  <span>Rows 01–20</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEntity('plant', 'PLANT-C-0182');
                    }}
                    className="font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full hover:bg-[#16A34A] hover:text-white transition-colors"
                  >
                    ★ Plant C-0182 (Row 12)
                  </button>
                </div>
              </div>
            )}

            {/* Footer Metrics */}
            <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1 border-t border-[#F3F4F6]">
              <span>Moisture: <strong className="text-[#111827]">{field.soilMoisture}%</strong></span>
              {field.diseaseRisk > 50 && (
                <span className="text-[#EF4444] font-bold flex items-center gap-0.5">
                  <AlertTriangle className="w-3 h-3" /> Blight Risk {field.diseaseRisk}%
                </span>
              )}
              {field.id === 'FIELD-B' && (
                <span className="text-[#F59E0B] font-bold flex items-center gap-0.5">
                  <Droplets className="w-3 h-3" /> Zone B2 Irrigation
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SLAM Trajectory Path (Rendered in SLAM or 2D mode when active) */}
      {activeLayers.slam && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          <polyline
            points="120,420 160,390 220,380 280,360 320,330 360,300"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          <polyline
            points="580,180 620,160 670,180 720,200"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>
      )}

      {/* Floating Robot Pins — Horizontally Aligned */}
      {activeLayers.robots && (
        <div className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
          {/* AGB-01 in Field A */}
          <div
            onClick={() => onSelectEntity('robot', 'AGB-01')}
            className="pointer-events-auto flex items-center gap-1.5 bg-[#111827] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-float cursor-pointer hover:scale-105 transition-transform border border-[#10B981]/60"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <Bot className="w-3.5 h-3.5 text-[#10B981]" />
            <span>AGB-01 (78%)</span>
            <span className="text-[10px] text-[#9CA3AF]">• 1.1 m/s</span>
          </div>

          {/* AGB-02 in Field C */}
          <div
            onClick={() => onSelectEntity('robot', 'AGB-02')}
            className="pointer-events-auto flex items-center gap-1.5 bg-[#111827] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-float cursor-pointer hover:scale-105 transition-transform border border-[#3B82F6]/60"
          >
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <Bot className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>AGB-02 (64%)</span>
            <span className="text-[10px] text-[#93C5FD]">• 0.9 m/s</span>
          </div>
        </div>
      )}

      {/* Sensor Probes */}
      {activeLayers.sensors && (
        <>
          <div
            onClick={() => onSelectEntity('sensor', 'SNS-SM-C4')}
            className="absolute bottom-28 left-56 z-25 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer hover:scale-110 transition-transform"
            title="Soil Moisture Sensor C4 (42%)"
          >
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <div
            onClick={() => onSelectEntity('sensor', 'SNS-NPK-D1')}
            className="absolute bottom-28 right-56 z-25 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer hover:scale-110 transition-transform"
            title="NPK Sensor D1 (72 mg/kg N)"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </>
      )}

      {/* Central Water Pump House Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 bg-blue-600 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md flex items-center gap-1">
        <Droplets className="w-3 h-3 text-white" />
        <span>Pump Station & 68% Tank</span>
      </div>

      {/* Mode Overlay Badge */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]">
        Mode: {mapMode} • Map Quality: 98%
      </div>
    </div>
  );
}
