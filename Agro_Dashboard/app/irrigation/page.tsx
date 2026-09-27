'use client';

import React from 'react';
import { IrrigationKpis } from '@/components/irrigation/IrrigationKpis';
import { SoilMoistureGrid } from '@/components/irrigation/SoilMoistureGrid';
import { FlowAndHardwareControls } from '@/components/irrigation/FlowAndHardwareControls';
import { IrrigationRecommendationCard } from '@/components/irrigation/IrrigationRecommendationCard';
import { EtAnalyticsCard } from '@/components/irrigation/EtAnalyticsCard';
import { IrrigationHistoryTable } from '@/components/irrigation/IrrigationHistoryTable';
import { Droplets, ShieldCheck, Waves } from 'lucide-react';

export default function IrrigationPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Water Intelligence
            </span>
            <span className="text-xs text-[#6B7280]">Micro-Drip & Submersible Solar Automation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] mt-1.5">
            Irrigation & Water Conservation Hub
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Real-time soil capacitance monitoring, ETc modeling, flow meters, and smart valve scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-2 rounded-xl text-xs font-semibold text-[#166534]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>8,240 Litres Conserved This Month</span>
        </div>
      </div>

      {/* KPI Row (6 items) */}
      <IrrigationKpis />

      {/* Grid 1: Soil Moisture Bar Comparison & Actuator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SoilMoistureGrid />
        </div>
        <div className="lg:col-span-5">
          <FlowAndHardwareControls />
        </div>
      </div>

      {/* Grid 2: Recommendation & ET Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <IrrigationRecommendationCard />
        </div>
        <div className="lg:col-span-6">
          <EtAnalyticsCard />
        </div>
      </div>

      {/* Historical Cycles Table */}
      <IrrigationHistoryTable />
    </div>
  );
}
