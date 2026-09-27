'use client';

import React from 'react';
import { AlertSummaryCards } from '@/components/alerts/AlertSummaryCards';
import { RiskEngineSection } from '@/components/alerts/RiskEngineSection';
import { PredictVerifyUpdateWorkflow } from '@/components/alerts/PredictVerifyUpdateWorkflow';
import { ImdSankalpWeatherSection } from '@/components/alerts/ImdSankalpWeatherSection';
import { FarmerAdvisorySection } from '@/components/alerts/FarmerAdvisorySection';
import { FullAlertsList } from '@/components/alerts/FullAlertsList';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AlertInsightsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Risk & Intelligence
            </span>
            <span className="text-xs text-[#6B7280]">IMD Agromet Advisory & Robotics Verification</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] mt-1.5">
            Alerts, Risk Engine & Decision Support
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Real-time hazard detection, environmental climatology, multi-factor attribution, and Predict-Verify-Update cycle.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-2 rounded-xl text-xs font-semibold text-[#166534]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Continuous Sensor & Telemetry Guard</span>
        </div>
      </div>

      {/* Alert KPI Summary Cards */}
      <AlertSummaryCards />

      {/* Predict -> Verify -> Update Ground Truth Process Visualizer */}
      <PredictVerifyUpdateWorkflow />

      {/* Risk Engine with Factor Contribution Bars */}
      <RiskEngineSection />

      {/* IMD / Mausam SANKALP Agromet Climatology Section */}
      <ImdSankalpWeatherSection />

      {/* Farmer Decision Support Advisory */}
      <FarmerAdvisorySection />

      {/* Comprehensive Alerts List */}
      <FullAlertsList />
    </div>
  );
}
