'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThreeFieldView } from '@/components/field-map/ThreeFieldView';
import { HierarchyPanel } from '@/components/field-map/HierarchyPanel';
import { RobotTelemetryOverlay } from '@/components/field-map/RobotTelemetryOverlay';
import {
  MapPin,
  Layers,
  Bot,
  Droplets,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

// Dynamically import Leaflet map with SSR disabled
const LeafletFieldMap = dynamic(
  () => import('@/components/field-map/LeafletFieldMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[620px] rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center gap-3 text-sm text-[#6B7280] shadow-subtle">
        <div className="w-8 h-8 rounded-full border-2 border-[#16A34A] border-t-transparent animate-spin" />
        <span className="font-medium">Loading Leaflet Cadastral GIS Map...</span>
      </div>
    ),
  }
);

export default function FieldMapPage() {
  const { farm, fields, plants, setSelectedPlant, openPlantPassportFor } = useFarm();
  const [mapMode, setMapMode] = useState<'2D' | 'SATELLITE' | 'TERRAIN' | '3D'>('2D');
  const [selectedZoneId, setSelectedZoneId] = useState<string | 'ALL'>('ALL');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('FIELD-A');
  const [focusedPlantId, setFocusedPlantId] = useState<string | undefined>(undefined);

  // Automatically focus plant if navigated from "View on Field Map" (?plantId=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const pId = urlParams.get('plantId');
      if (pId) {
        setFocusedPlantId(pId);
        const target = plants.find((p) => p.id === pId || p.plantId === pId);
        if (target) {
          setSelectedPlant(target);
          if (target.fieldId === 'FIELD-C') {
            setSelectedFieldId('FIELD-C');
            setSelectedZoneId('ZONE-3');
          } else if (target.fieldId === 'FIELD-A') {
            setSelectedFieldId('FIELD-A');
            setSelectedZoneId('ZONE-1');
          } else if (target.fieldId === 'FIELD-B') {
            setSelectedFieldId('FIELD-B');
            setSelectedZoneId('ZONE-2');
          }
        }
      }
    }
  }, [plants, setSelectedPlant]);

  // Layer toggles (SLAM removed)
  const [activeLayers, setActiveLayers] = useState({
    boundaries: true,
    zones: true,
    robots: true,
    sensors: true,
    diseaseRisk: true,
  });

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleSelectZone = (zoneId: string | 'ALL') => {
    setSelectedZoneId(zoneId);
    if (zoneId === 'ZONE-1') setSelectedFieldId('FIELD-A');
    else if (zoneId === 'ZONE-2') setSelectedFieldId('FIELD-B');
    else if (zoneId === 'ZONE-3') setSelectedFieldId('FIELD-C');
  };

  const handleSelectEntity = (
    type: 'field' | 'zone' | 'plant' | 'sensor' | 'robot',
    id: string
  ) => {
    if (type === 'field') {
      setSelectedFieldId(id);
      if (id === 'FIELD-A') setSelectedZoneId('ZONE-1');
      else if (id === 'FIELD-B') setSelectedZoneId('ZONE-2');
      else if (id === 'FIELD-C') setSelectedZoneId('ZONE-3');
    } else if (type === 'plant') {
      openPlantPassportFor(id);
    } else if (type === 'zone') {
      setSelectedZoneId(id);
      if (id === 'ZONE-1') setSelectedFieldId('FIELD-A');
      else if (id === 'ZONE-2') setSelectedFieldId('FIELD-B');
      else if (id === 'ZONE-3') setSelectedFieldId('FIELD-C');
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Top Control Bar: Farm Metadata & 4 Map Mode Tabs (SLAM Removed) */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
              Krishi Vigyan Kendra • Palghar
            </span>
            <span className="text-xs text-[#6B7280]">
              Kosbad Hill Experimental Farm • Total Area: {farm.totalArea} Acres
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#111827] mt-1.5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#16A34A]" />
            Cadastral GIS & Digital Twin Map
          </h1>
        </div>

        {/* 4 Clean Map Options: 2D, Satellite, Terrain, 3D Terrain */}
        <div className="flex items-center gap-1.5 bg-[#F9FAFB] p-1.5 rounded-xl border border-[#E5E7EB] overflow-x-auto whitespace-nowrap self-start lg:self-center">
          {[
            { id: '2D', label: '2D Cadastral' },
            { id: 'SATELLITE', label: 'Satellite' },
            { id: 'TERRAIN', label: 'Terrain' },
            { id: '3D', label: '⚡ 3D Terrain' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setMapMode(mode.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapMode === mode.id
                  ? 'bg-white text-[#111827] shadow-xs border border-[#E5E7EB]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Sub-Ribbon: 3 Separate Zones Filter (Equally Aligned 1.8 ac each) & Layer Toggles */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* 3 Zones Separately Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mr-1">
            Zones:
          </span>
          <button
            onClick={() => handleSelectZone('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              selectedZoneId === 'ALL'
                ? 'bg-[#111827] text-white shadow-xs font-bold'
                : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            All 3 Zones (5.4 ac)
          </button>
          <button
            onClick={() => handleSelectZone('ZONE-1')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              selectedZoneId === 'ZONE-1'
                ? 'bg-[#059669] text-white shadow-xs font-bold'
                : 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Zone 1: Tomato (1.8 ac)</span>
          </button>
          <button
            onClick={() => handleSelectZone('ZONE-2')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              selectedZoneId === 'ZONE-2'
                ? 'bg-[#D97706] text-white shadow-xs font-bold'
                : 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Zone 2: Cotton (1.8 ac)</span>
          </button>
          <button
            onClick={() => handleSelectZone('ZONE-3')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              selectedZoneId === 'ZONE-3'
                ? 'bg-[#7C3AED] text-white shadow-xs font-bold'
                : 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span>Zone 3: Polyhouse (1.8 ac)</span>
          </button>
        </div>

        {/* Dynamic Layer Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pt-2 md:pt-0 border-t md:border-t-0 border-[#F3F4F6]">
          <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>
          <button
            onClick={() => toggleLayer('boundaries')}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
              activeLayers.boundaries
                ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]'
                : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'
            }`}
          >
            Boundary
          </button>
          <button
            onClick={() => toggleLayer('zones')}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
              activeLayers.zones
                ? 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]'
                : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'
            }`}
          >
            3 Zones
          </button>
          <button
            onClick={() => toggleLayer('robots')}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
              activeLayers.robots
                ? 'bg-blue-50 text-[#1D4ED8] border-blue-200'
                : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'
            }`}
          >
            AgroBots
          </button>
          <button
            onClick={() => toggleLayer('sensors')}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
              activeLayers.sensors
                ? 'bg-purple-50 text-[#7C3AED] border-purple-200'
                : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'
            }`}
          >
            Sensors
          </button>
          <button
            onClick={() => toggleLayer('diseaseRisk')}
            className={`px-2.5 py-1 rounded-lg font-medium border transition-colors ${
              activeLayers.diseaseRisk
                ? 'bg-red-50 text-[#B91C1C] border-red-200'
                : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'
            }`}
          >
            Risk Cluster
          </button>
        </div>
      </div>

      {/* 3. Main Map & Contextual Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proper Leaflet GIS Map or 3D Canvas */}
        <div className="lg:col-span-8">
          {mapMode === '3D' ? (
            <ThreeFieldView />
          ) : (
            <LeafletFieldMap
              mapMode={mapMode}
              activeLayers={activeLayers}
              selectedZoneId={selectedZoneId}
              focusedPlantId={focusedPlantId}
              onSelectZone={handleSelectZone}
              onSelectEntity={handleSelectEntity}
            />
          )}
        </div>

        {/* Right Column: Contextual Hierarchy & Robot Telemetry Panels */}
        <div className="lg:col-span-4 space-y-4">
          <HierarchyPanel
            selectedFieldId={selectedFieldId}
            onSelectField={(id) => {
              setSelectedFieldId(id);
              if (id === 'FIELD-A') setSelectedZoneId('ZONE-1');
              else if (id === 'FIELD-B') setSelectedZoneId('ZONE-2');
              else if (id === 'FIELD-C') setSelectedZoneId('ZONE-3');
            }}
          />
          <RobotTelemetryOverlay />
        </div>
      </div>
    </div>
  );
}
