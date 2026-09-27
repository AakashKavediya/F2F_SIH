'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Bot, AlertTriangle, Droplets, ExternalLink, ShieldCheck } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function DashboardMapPreview() {
  const { farm, fields, openFieldPassportFor, setSelectedRobot, setIsRobotModalOpen, agroBots } = useFarm();

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#16A34A]" />
            Farm Cadastral Preview
          </h3>
          <p className="text-[11px] text-[#6B7280]">{farm.name} • {farm.totalArea} Acres • {fields.length} Fields</p>
        </div>
        <Link
          href="/field-map"
          className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1 hover:underline"
        >
          <span>Full GIS Map</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive SVG Cadastral Map */}
      <div className="py-3 relative">
        <div className="w-full h-56 bg-[#F0FDF4]/50 rounded-2xl border border-[#DCFCE7] relative overflow-hidden p-3 select-none">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* 4 Field Parcels */}
          <div className="grid grid-cols-2 gap-3 w-full h-full relative z-10">
            {/* Field A */}
            <div
              onClick={() => openFieldPassportFor('FIELD-A')}
              className="rounded-xl border border-[#E5E7EB] bg-white/90 p-2.5 hover:border-[#16A34A] hover:bg-[#F0FDF4] cursor-pointer transition-all flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] group-hover:text-[#16A34A]">Field A</span>
                <span className="text-[10px] font-semibold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                  Tomato (91%)
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {fields[0]?.area ?? 1.5} ac • Fruiting
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                <span>Moisture 44%</span>
                <span className="text-[#F59E0B] font-semibold">Whitefly +18%</span>
              </div>
            </div>

            {/* Field B */}
            <div
              onClick={() => openFieldPassportFor('FIELD-B')}
              className="rounded-xl border border-amber-300 bg-amber-50/50 p-2.5 hover:border-[#F59E0B] hover:bg-amber-50 cursor-pointer transition-all flex flex-col justify-between shadow-xs group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] group-hover:text-[#F59E0B]">Field B</span>
                <span className="text-[10px] font-bold text-[#EF4444] bg-red-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Droplets className="w-2.5 h-2.5" /> 24% Dry
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {fields[1]?.area ?? 1.3} ac • Cotton
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                <span className="text-[#EF4444] font-semibold">Zone B2 Alert</span>
                <span>Health 84%</span>
              </div>
            </div>

            {/* Field C */}
            <div
              onClick={() => openFieldPassportFor('FIELD-C')}
              className="rounded-xl border border-red-300 bg-red-50/50 p-2.5 hover:border-[#EF4444] hover:bg-red-50 cursor-pointer transition-all flex flex-col justify-between shadow-xs group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] group-hover:text-[#EF4444]">Field C</span>
                <span className="text-[10px] font-bold text-[#EF4444] bg-red-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> Blight Hotspot
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {fields[2]?.area ?? 1.4} ac • Tomato (Flowering)
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#EF4444] font-semibold">Zone C4 (17 plants)</span>
                <span className="text-[#16A34A] font-semibold">Health 91%</span>
              </div>
            </div>

            {/* Field D */}
            <div
              onClick={() => openFieldPassportFor('FIELD-D')}
              className="rounded-xl border border-[#E5E7EB] bg-white/90 p-2.5 hover:border-[#16A34A] hover:bg-[#F0FDF4] cursor-pointer transition-all flex flex-col justify-between shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] group-hover:text-[#16A34A]">Field D</span>
                <span className="text-[10px] font-semibold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                  Wheat (92%)
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280]">
                {fields[3]?.area ?? 1.2} ac • Vegetative
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                <span>Moisture 48%</span>
                <span className="text-[#F59E0B] font-semibold">N-Deficit 72mg</span>
              </div>
            </div>
          </div>

          {/* Floating Robot Pins — Horizontally Aligned on Baseline */}
          <div className="absolute bottom-2.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRobot(agroBots[0]);
                setIsRobotModalOpen(true);
              }}
              className="pointer-events-auto flex items-center gap-1.5 bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform border border-[#10B981]/50"
              title="AgroBot AGB-01 (Field A)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <Bot className="w-3 h-3 text-[#10B981]" />
              <span>AGB-01 (78%)</span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRobot(agroBots[1]);
                setIsRobotModalOpen(true);
              }}
              className="pointer-events-auto flex items-center gap-1.5 bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform border border-[#3B82F6]/50"
              title="AgroBot AGB-02 (Field C)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              <Bot className="w-3 h-3 text-[#3B82F6]" />
              <span>AGB-02 (64%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 text-[11px] text-[#6B7280] flex flex-wrap items-center justify-between gap-2">
        <span>Click any field parcel to open instant Field Passport</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRobot(agroBots[0]);
              setIsRobotModalOpen(true);
            }}
            className="flex items-center gap-1 bg-[#111827] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs hover:bg-[#1f2937] transition-colors cursor-pointer"
          >
            <Bot className="w-3 h-3 text-[#10B981]" />
            <span>AGB-01</span>
          </button>
          <button
            onClick={() => {
              setSelectedRobot(agroBots[1]);
              setIsRobotModalOpen(true);
            }}
            className="flex items-center gap-1 bg-[#111827] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs hover:bg-[#1f2937] transition-colors cursor-pointer"
          >
            <Bot className="w-3 h-3 text-[#3B82F6]" />
            <span>AGB-02</span>
          </button>
        </div>
      </div>
    </div>
  );
}
