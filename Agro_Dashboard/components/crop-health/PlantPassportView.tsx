'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plant, PlantEventRecord } from '@/data/types';
import { useFarm } from '@/context/FarmContext';
import {
  generatePlantStory,
  calculateWhatChanged,
  getPrevPlantInField,
  getNextPlantInField,
} from '@/data/plantsData';
import { AgribotInspectionModal } from './AgribotInspectionModal';
import { PlantPhotoGalleryModal } from './PlantPhotoGalleryModal';
import {
  ChevronRight,
  ChevronLeft,
  Sprout,
  Droplets,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Bot,
  Activity,
  Scan,
  Calendar,
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Quote,
} from 'lucide-react';

interface PlantPassportViewProps {
  plant: Plant;
}

export function PlantPassportView({ plant }: PlantPassportViewProps) {
  const router = useRouter();
  const { plants, setSelectedPlant, showToast } = useFarm();

  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);
  const [timelineViewAll, setTimelineViewAll] = useState(false);

  // Previous and next plants within the SAME field
  const prevPlant = getPrevPlantInField(plants, plant.id);
  const nextPlant = getNextPlantInField(plants, plant.id);
  const fieldPlants = plants.filter(
    (p) => (p.fieldName && p.fieldName === plant.fieldName) || (p.fieldId && p.fieldId === plant.fieldId)
  );
  const currentPlantIndex = fieldPlants.findIndex((p) => p.id === plant.id);

  // Dynamic story and AI insights
  const plantStory = generatePlantStory(plant);
  const whatChanged = calculateWhatChanged(plant);

  // Navigate to adjacent plant in same field
  const handleNavigatePlant = (targetPlant: Plant | null) => {
    if (!targetPlant) return;
    setSelectedPlant(targetPlant);
    router.push(`/crops-health/plant-passport/${targetPlant.id}`);
  };

  // Navigate to Field Map with this plant focused
  const handleViewOnFieldMap = () => {
    showToast(`Centering Field Map on ${plant.id}...`, 'info');
    router.push(`/field-map?plantId=${plant.id}`);
  };

  // Determine timeline items to display
  const eventsList: PlantEventRecord[] = plant.events && plant.events.length > 0
    ? plant.events
    : (plant.timeline || []).map((t, idx) => ({
        id: `gen-evt-${idx}`,
        plantId: plant.id,
        eventType: 'note',
        date: t.date,
        title: t.event,
        description: t.details,
        status: 'Completed',
        createdAt: t.date,
      }));

  const displayedEvents = timelineViewAll ? eventsList : eventsList.slice(0, 6);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'irrigation':
        return <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'fertilizer':
        return <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />;
      case 'spray':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />;
      case 'disease_detected':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />;
      case 'agribot_inspection':
        return <Bot className="w-3.5 h-3.5 text-[#059669]" />;
      case 'health_check':
        return <Activity className="w-3.5 h-3.5 text-[#16A34A]" />;
      case 'plant_added':
        return <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[#6B7280]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Top Bar: Breadcrumb & Scoped Field Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Link
            href="/crop-health"
            className="text-[#6B7280] hover:text-[#16A34A] transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Back to Crops & Health</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="text-[#111827] font-bold">Plant Passport</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="text-[#16A34A] font-mono font-bold">#{plant.plantId || plant.id}</span>
        </div>

        {/* Previous Plant / Next Plant Navigation (Scoped to Field) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleNavigatePlant(prevPlant)}
            disabled={!prevPlant}
            className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title={prevPlant ? `Previous Plant in ${plant.fieldName || plant.fieldId} (#${prevPlant.plantId || prevPlant.id})` : 'No previous plant'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[11px] font-medium text-[#6B7280] px-2.5 py-1 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs hidden sm:inline-block">
            {plant.fieldName || plant.fieldId} ({currentPlantIndex >= 0 ? currentPlantIndex + 1 : 1} of {fieldPlants.length || 1})
          </span>

          <button
            onClick={() => handleNavigatePlant(nextPlant)}
            disabled={!nextPlant}
            className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] hover:text-[#111827] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title={nextPlant ? `Next Plant in ${plant.fieldName || plant.fieldId} (#${nextPlant.plantId || nextPlant.id})` : 'No next plant'}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. PLANT HEADER / HERO SECTION */}
      <div className="p-6 md:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-6 relative overflow-hidden">
        {/* Top Control Strip: Tag + Location & Actions Aligned */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F3F4F6]">
          {/* Left: Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
              {plant.cropType || plant.cropName}
            </span>
            <span className="text-xs font-mono font-bold text-[#374151] bg-[#F3F4F6] px-2.5 py-0.5 rounded border border-[#E5E7EB]">
              Plant #{plant.plantId || plant.id.replace('PLANT-', '')}
            </span>
            <span className="text-xs font-semibold text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#DCFCE7] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#16A34A]" />
              <span>{plant.fieldName || plant.fieldId} • Row {plant.rowNumber || 12}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Monitored by Agribot</span>
            </span>
          </div>

          {/* Right: Actions Aligned */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsInspectionModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Agribot to Inspect</span>
            </button>

            <button
              type="button"
              onClick={handleViewOnFieldMap}
              className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] hover:text-[#111827] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#16A34A]" />
              <span>View on Field Map</span>
            </button>
          </div>
        </div>

        {/* Main Hero Body: Image + Information + Quote Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Photo (lg:col-span-3) */}
          <div className="lg:col-span-3 flex justify-center sm:justify-start">
            <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-gradient-to-b from-[#F0FDF4] to-[#DCFCE7]/40 border border-[#DCFCE7] shadow-sm shrink-0 group">
              <img
                src={plant.imageUrl || '/images/plants/tomato-passport.jpg'}
                alt={plant.cropName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={() => setIsPhotoGalleryOpen(true)}
                className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[11px] font-bold text-[#111827] shadow-md border border-[#E5E7EB] flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer backdrop-blur-xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>View Photos ({plant.photos?.length || 3})</span>
              </button>
            </div>
          </div>

          {/* Center Column: Plant Title & Status Badges (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
                {plant.cropName}{' '}
                <span className="text-lg md:text-xl font-normal text-[#6B7280]">({plant.variety})</span>
              </h1>
              <p className="text-xs text-[#6B7280] font-medium mt-1">
                Planted on {plant.plantedDate || '24 Jul 2024'} • Row {plant.rowNumber || 12} • {plant.fieldName || plant.fieldId}
              </p>
            </div>

            {/* 4 Status Badges in a clean 2x2 grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Health */}
              <div className="px-3 py-2 rounded-xl bg-[#DCFCE7]/70 text-[#166534] border border-[#BBF7D0] flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#16A34A] shrink-0" />
                <div>
                  <div className="text-[10px] text-[#15803D] uppercase font-bold tracking-wide">Health</div>
                  <div className="text-xs font-extrabold text-[#166534]">{plant.currentHealth ?? plant.health}% Healthy</div>
                </div>
              </div>

              {/* Growth stage */}
              <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2.5">
                <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-emerald-600 uppercase font-bold tracking-wide">Stage</div>
                  <div className="text-xs font-bold text-emerald-900">{plant.growthStage || plant.stage}</div>
                </div>
              </div>

              {/* Plant age */}
              <div className="px-3 py-2 rounded-xl bg-[#F7F9F7] text-[#374151] border border-[#E5E7EB] flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#6B7280] shrink-0" />
                <div>
                  <div className="text-[10px] text-[#6B7280] uppercase font-bold tracking-wide">Plant Age</div>
                  <div className="text-xs font-bold text-[#111827]">{plant.ageDays} Days</div>
                </div>
              </div>

              {/* Growth status */}
              <div className={`px-3 py-2 rounded-xl flex items-center gap-2.5 border ${
                plant.growthStatus === 'Attention' || plant.status === 'Attention'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-green-50 text-green-800 border-green-200'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <div>
                  <div className="text-[10px] text-[#15803D] uppercase font-bold tracking-wide">Condition</div>
                  <div className="text-xs font-bold text-[#166534]">{plant.growthStatus || plant.status}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Card (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]/30 border border-[#DCFCE7] min-h-[160px]">
            <div className="space-y-2">
              <Quote className="w-5 h-5 text-[#16A34A] opacity-60" />
              <p className="text-xs md:text-sm font-semibold italic text-[#166534] leading-relaxed">
                &quot;A healthy plant today, a better harvest tomorrow.&quot;
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[#DCFCE7]/70 text-[11px] font-bold text-[#15803D]">
              <Sprout className="w-4 h-4 text-[#16A34A]" />
              <span>FarmerOS Plant Care Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN PAGE LAYOUT: 3-COLUMN DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* COLUMN 1: PLANT PASSPORT SUMMARY (lg:col-span-4) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                Plant Passport
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                A complete care record for this plant
              </p>
            </div>

            {/* 6 Compact Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5">
              {/* 1. Water */}
              <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#2563EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Water</span>
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <div className="text-lg font-extrabold text-[#111827]">
                    {plant.waterTotal ?? plant.stats?.estimatedWaterLiters ?? 24.6} L
                  </div>
                  <div className="text-[11px] font-medium text-[#166534]">Estimated</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Total received</div>
                </div>
              </div>

              {/* 2. Fertilizer */}
              <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#8B5CF6]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Fertilizer</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <div className="text-lg font-extrabold text-[#111827]">
                    {plant.fertilizerApplications ?? plant.stats?.fertilizerApplications ?? 3}
                  </div>
                  <div className="text-[11px] font-medium text-[#166534]">applications</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Total applied</div>
                </div>
              </div>

              {/* 3. Sprays */}
              <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#F59E0B]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Sprays</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <div className="text-lg font-extrabold text-[#111827]">
                    {plant.sprayApplications ?? plant.stats?.sprays ?? 1}
                  </div>
                  <div className="text-[11px] font-medium text-[#166534]">treatment</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Targeted treatment</div>
                </div>
              </div>

              {/* 4. AI Scans */}
              <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#16A34A]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">AI Scans</span>
                  <Scan className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <div className="text-lg font-extrabold text-[#111827]">
                    {plant.aiScanCount ?? plant.stats?.aiScans ?? 42}
                  </div>
                  <div className="text-[11px] font-medium text-[#166534]">scans</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Images analyzed</div>
                </div>
              </div>

              {/* 5. Health Score */}
              <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#16A34A]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Health Score</span>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <div className="text-lg font-extrabold text-[#16A34A]">
                    {plant.currentHealth ?? plant.health}%
                  </div>
                  <div className="text-[11px] font-medium text-[#166534]">Healthy</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Vigor index</div>
                </div>
              </div>

              {/* 6. Agribot Visits */}
              <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#0D9488]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Agribot Visits</span>
                  <Bot className="w-4 h-4" />
                </div>
                <div className="mt-2">
                  <div className="text-lg font-extrabold text-[#111827]">
                    {plant.agribotVisitCount ?? plant.stats?.agribotVisits ?? 2}
                  </div>
                  <div className="text-[11px] font-medium text-[#166534]">visits</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Last inspection</div>
                </div>
              </div>
            </div>

            {/* Plant Story Section */}
            <div className="pt-4 border-t border-[#F3F4F6] space-y-2">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#16A34A]" />
                <span>Plant Story</span>
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                {plantStory}
              </p>
            </div>

            {/* Small Quote Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]/40 border border-[#DCFCE7] flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 text-[#16A34A] shadow-xs">
                <Sprout className="w-4 h-4" />
              </div>
              <p className="text-xs italic font-semibold text-[#166534]">
                &quot;Every care you give today, builds a stronger tomorrow.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: PLANT JOURNEY TIMELINE (lg:col-span-5) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#16A34A]" />
                  <span>Plant Journey</span>
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  A timeline of everything that has happened to this plant
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTimelineViewAll(!timelineViewAll)}
                className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] text-[11px] font-semibold text-[#16A34A] hover:bg-[#F0FDF4] transition-colors cursor-pointer"
              >
                {timelineViewAll ? 'Show Recent' : 'View All'}
              </button>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
              {displayedEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#16A34A] group-hover:scale-125 transition-transform" />

                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#FCFDFC] group-hover:border-[#16A34A]/50 group-hover:bg-white transition-all shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-[#F0FDF4] text-[#166534]">
                          {getEventIcon(evt.eventType)}
                        </span>
                        <span className="text-xs font-bold text-[#111827]">{evt.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#6B7280] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {evt.date}
                      </span>
                    </div>

                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {evt.description}
                    </p>

                    {(evt.value || evt.quantity || evt.status) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-semibold">
                        {evt.value && (
                          <span className="text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                            {evt.value} {evt.unit || ''}
                          </span>
                        )}
                        {evt.quantity && (
                          <span className="text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {evt.quantity} {evt.unit || ''}
                          </span>
                        )}
                        {evt.status && (
                          <span className="text-[#4B5563] bg-gray-100 px-2 py-0.5 rounded">
                            Status: {evt.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: WHAT CHANGED? / AI INSIGHTS (lg:col-span-3) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#111827]">
                What changed?
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                AI Analysis
              </span>
            </div>

            {/* Headline */}
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-semibold text-[#166534]">
              &quot;{whatChanged.headline}&quot;
            </div>

            {/* Metric Comparisons */}
            <div className="space-y-2.5">
              {/* 1. Health */}
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">Health</span>
                  <span className="text-xs font-bold text-[#16A34A] flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{whatChanged.health.value}</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  {whatChanged.health.description}
                </p>
              </div>

              {/* 2. Disease risk */}
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">Disease risk</span>
                  <span className="text-xs font-bold text-[#16A34A] flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{whatChanged.diseaseRisk.value}</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  {whatChanged.diseaseRisk.description}
                </p>
              </div>

              {/* 3. Soil moisture */}
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">Soil moisture</span>
                  <span className="text-xs font-bold text-[#2563EB] flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{whatChanged.soilMoisture.value}</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  {whatChanged.soilMoisture.description}
                </p>
              </div>

              {/* 4. Agribot inspections */}
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111827]">Agribot inspections</span>
                  <span className="text-xs font-bold text-[#111827] flex items-center gap-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{whatChanged.inspections.value}</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  {whatChanged.inspections.description}
                </p>
              </div>
            </div>

            {/* Quick Action Prompt Card */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsInspectionModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask Agribot to Inspect</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AgribotInspectionModal
        plant={plant}
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
      />

      <PlantPhotoGalleryModal
        plant={plant}
        isOpen={isPhotoGalleryOpen}
        onClose={() => setIsPhotoGalleryOpen(false)}
      />
    </div>
  );
}
