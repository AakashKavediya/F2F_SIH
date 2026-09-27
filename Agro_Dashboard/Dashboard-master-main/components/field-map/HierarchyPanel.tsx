'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import {
  MapPin,
  Sprout,
  Bot,
  AlertTriangle,
  Droplets,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface HierarchyPanelProps {
  selectedFieldId: string;
  onSelectField: (id: string) => void;
}

export function HierarchyPanel({ selectedFieldId, onSelectField }: HierarchyPanelProps) {
  const {
    fields,
    plants,
    selectedPlant,
    setSelectedPlant,
    openFieldPassportFor,
    openPlantPassportFor,
    setSelectedRobot,
    setIsRobotModalOpen,
    agroBots,
  } = useFarm();

  const currentField = fields.find((f) => f.id === selectedFieldId) || fields[2];
  const fieldPlants = (plants || []).filter((p) => p.fieldId === currentField.id);
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    currentField.id === 'FIELD-C' ? 'ZONE-C4' : currentField.zones[0].id
  );
  const [selectedRow, setSelectedRow] = useState<number>(12);

  const currentZone = currentField.zones.find((z) => z.id === selectedZoneId) || currentField.zones[0];

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between space-y-4">
      {/* Hierarchy Breadcrumb Steps */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] pb-3 border-b border-[#F3F4F6] overflow-x-auto whitespace-nowrap">
        <span className="text-[#16A34A]">{currentField.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
        <span className="text-[#111827]">{currentZone.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
        <span className="text-[#111827]">Row {selectedRow}</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
        <span className="text-[#16A34A]">Plant {selectedPlant.id}</span>
      </div>

      {/* Field Selector Pill Tabs */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5 block">
          Select Field Parcel
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {fields.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                onSelectField(f.id);
                setSelectedZoneId(f.zones[0].id);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                f.id === currentField.id
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-[#F7F9F7] text-[#4B5563] hover:bg-[#F3F4F6]'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Zone Selector */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5 block">
          Zone in {currentField.name}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {currentField.zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZoneId(z.id)}
              className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                z.id === selectedZoneId
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-[#F7F9F7] text-[#4B5563] hover:bg-[#F3F4F6]'
              }`}
            >
              {z.name}
              {z.hasActiveIssue && <span className="text-[#EF4444] ml-1">●</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Active Zone & Plant Context Details */}
      <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#111827]">{currentZone.name} Overview</span>
          <span className="font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
            Health {currentZone.healthScore}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
            <span className="text-[10px] text-[#6B7280]">Soil Moisture</span>
            <p className="text-sm font-bold text-[#111827] mt-0.5">{currentZone.soilMoisture}%</p>
          </div>
          <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
            <span className="text-[10px] text-[#6B7280]">Soil Temp</span>
            <p className="text-sm font-bold text-[#111827] mt-0.5">{currentZone.soilTemperature}°C</p>
          </div>
        </div>

        {currentZone.issueDescription && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-[#EF4444] font-medium flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{currentZone.issueDescription}</span>
          </div>
        )}
      </div>

      {/* Individual Plant Drilldown Feature */}
      <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#166534]">Selected: Plant #{selectedPlant.plantId || selectedPlant.id.replace('PLANT-', '')}</span>
          <span className="text-[10px] font-semibold text-[#166534] bg-white px-2 py-0.5 rounded border border-[#DCFCE7]">
            Row {selectedPlant.rowNumber || selectedRow}
          </span>
        </div>

        {/* Quick Plant Switcher in this field */}
        {fieldPlants.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {fieldPlants.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPlant(p);
                  if (p.rowNumber) setSelectedRow(p.rowNumber);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all shrink-0 ${
                  selectedPlant.id === p.id
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#DCFCE7] hover:bg-[#DCFCE7]/40'
                }`}
              >
                #{p.plantId || p.id.replace('PLANT-', '')}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-[#4B5563]">
          {selectedPlant.cropName} ({selectedPlant.variety}) • Age {selectedPlant.ageDays} days • Health {selectedPlant.currentHealth ?? selectedPlant.health}%
        </p>

        <button
          onClick={() => openPlantPassportFor(selectedPlant.id)}
          className="w-full py-2 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Open Plant Passport</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Direct Field Passport Action */}
      <button
        onClick={() => openFieldPassportFor(currentField.id)}
        className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-xs font-semibold text-[#111827] flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>Open {currentField.name} Passport Ledger</span>
        <ExternalLink className="w-3.5 h-3.5 text-[#6B7280]" />
      </button>
    </div>
  );
}
