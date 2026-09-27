'use client';

import React from 'react';
import { useFarm } from '@/context/FarmContext';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { FarmHealthRadial } from '@/components/dashboard/FarmHealthRadial';
import { TodaysPriorities } from '@/components/dashboard/TodaysPriorities';
import { DashboardWeather } from '@/components/dashboard/DashboardWeather';
import { DashboardMapPreview } from '@/components/dashboard/DashboardMapPreview';
import { DashboardRobotSummary } from '@/components/dashboard/DashboardRobotSummary';
import { DashboardCropSummary } from '@/components/dashboard/DashboardCropSummary';
import { DashboardAdvisory } from '@/components/dashboard/DashboardAdvisory';
import { DashboardActivityTimeline } from '@/components/dashboard/DashboardActivityTimeline';
import { Building2, Clock, MapPin, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { farmer, farm, dataMode } = useFarm();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              Farm Master Control
            </span>
            <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Last updated: 2 minutes ago
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] mt-1.5">
            Good Morning, {farmer.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Here&apos;s what&apos;s happening across your farm today.
          </p>
        </div>

        {/* Farm Meta Pill */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-[#F7F9F7] p-3 rounded-xl border border-[#E5E7EB]">
          <div>
            <span className="text-[10px] text-[#6B7280]">Farm:</span>
            <p className="font-semibold text-[#111827]">{farm.name}</p>
          </div>
          <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block" />
          <div>
            <span className="text-[10px] text-[#6B7280]">Location:</span>
            <p className="font-semibold text-[#111827]">{farm.location}</p>
          </div>
          <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block" />
          <div>
            <span className="text-[10px] text-[#6B7280]">Total Area:</span>
            <p className="font-semibold text-[#111827]">{farm.totalArea} acres</p>
          </div>
          <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block" />
          <div>
            <span className="text-[10px] text-[#6B7280]">Status:</span>
            <p className="font-bold text-[#166534]">{dataMode} DATA</p>
          </div>
        </div>
      </div>

      {/* KPI Row (6 items) */}
      <DashboardKpis />

      {/* Grid 1: Farm Health Radial & Today's Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <FarmHealthRadial />
        </div>
        <div className="lg:col-span-5">
          <TodaysPriorities />
        </div>
      </div>

      {/* Grid 2: Weather & Cadastral Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <DashboardWeather />
        </div>
        <div className="lg:col-span-6">
          <DashboardMapPreview />
        </div>
      </div>

      {/* Grid 3: Robot Summary & Crop Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <DashboardRobotSummary />
        </div>
        <div className="lg:col-span-6">
          <DashboardCropSummary />
        </div>
      </div>

      {/* Grid 4: AI Farm Advisory & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DashboardAdvisory />
        </div>
        <div className="lg:col-span-5">
          <DashboardActivityTimeline />
        </div>
      </div>
    </div>
  );
}
