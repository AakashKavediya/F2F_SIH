'use client';

import React, { useState } from 'react';
import { Plant, PlantEventRecord } from '@/data/types';
import { useFarm } from '@/context/FarmContext';
import {
  X,
  Bot,
  Activity,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Camera,
  Play,
  RotateCcw,
} from 'lucide-react';

interface AgribotInspectionModalProps {
  plant: Plant;
  isOpen: boolean;
  onClose: () => void;
  onInspectionCompleted?: () => void;
}

type InspectionState = 'Ready' | 'Inspecting' | 'Analysis' | 'Completed';

export function AgribotInspectionModal({
  plant,
  isOpen,
  onClose,
  onInspectionCompleted,
}: AgribotInspectionModalProps) {
  const { updatePlant, addPlantEvent, showToast } = useFarm();
  const [state, setState] = useState<InspectionState>('Ready');
  const [progress, setProgress] = useState(0);
  const [scannedFrames, setScannedFrames] = useState(0);

  if (!isOpen) return null;

  const handleStartInspection = () => {
    setState('Inspecting');
    setProgress(15);
    setScannedFrames(1);

    // Phase 1: Inspecting & image acquisition
    setTimeout(() => {
      setProgress(45);
      setScannedFrames(3);
    }, 900);

    setTimeout(() => {
      setProgress(75);
      setScannedFrames(5);
      setState('Analysis');
    }, 1800);

    // Phase 2: Edge AI Analysis & completion
    setTimeout(() => {
      setProgress(100);
      setState('Completed');

      const now = new Date();
      const dateStr = 'Today';
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create new event record
      const newEvent: PlantEventRecord = {
        id: `EVT-AGB-${Date.now()}`,
        plantId: plant.id,
        eventType: 'agribot_inspection',
        date: dateStr,
        time: timeStr,
        title: 'Agribot Edge Inspection',
        description: 'AGB-02 scanned 5 multispectral frames. Lesion arrest verified, canopy vigor at 88%.',
        quantity: 5,
        unit: 'images',
        status: 'Completed',
        icon: 'Bot',
        severity: 'success',
        createdAt: now.toISOString(),
      };

      // Add event to plant
      addPlantEvent(plant.id, newEvent);

      // Update plant attributes
      const currentHealth = plant.currentHealth ?? plant.health ?? 86;
      const newHealth = Math.min(98, currentHealth + 2);
      const visitCount = (plant.agribotVisitCount ?? plant.stats?.agribotVisits ?? 2) + 1;
      const scanCount = (plant.aiScanCount ?? plant.stats?.aiScans ?? 42) + 5;

      updatePlant(plant.id, {
        health: newHealth,
        currentHealth: newHealth,
        agribotVisitCount: visitCount,
        aiScanCount: scanCount,
        lastInspection: `${dateStr}, ${timeStr}`,
        stats: {
          ...plant.stats,
          aiScans: scanCount,
          agribotVisits: visitCount,
        },
        aiWhatChanged: {
          healthDelta: '+8%',
          diseaseDelta: 'Decreased',
          moistureDelta: '+13%',
          robotInspections: visitCount,
          summary: 'Plant is recovering well with strong apical vigor. Post-spray leaf examination complete.',
        },
      });

      showToast('Inspection completed successfully. Plant passport updated.', 'success');
      onInspectionCompleted?.();
    }, 3200);
  };

  const handleReset = () => {
    setState('Ready');
    setProgress(0);
    setScannedFrames(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-[#F7F9F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  Autonomous Inspection
                </span>
                <span className="text-xs font-mono text-[#6B7280]">#{plant.id}</span>
              </div>
              <h3 className="text-base font-bold text-[#111827] mt-0.5">
                AgroBot Mission Dispatch
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Target Plant Summary Banner */}
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-emerald-50 border border-emerald-200 shrink-0">
                <img
                  src={plant.imageUrl || '/images/plants/tomato-passport.jpg'}
                  alt={plant.cropName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-[#111827]">
                  {plant.cropName} ({plant.variety})
                </span>
                <p className="text-[11px] text-[#6B7280]">
                  {plant.fieldName || plant.fieldId} • Row {plant.rowNumber || 12}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#6B7280] block">Current Health</span>
              <span className="text-sm font-bold text-[#16A34A]">
                {plant.currentHealth ?? plant.health}%
              </span>
            </div>
          </div>

          {/* Plant Telemetry Data Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                Latest Disease Status
              </span>
              <p className="text-xs font-bold text-[#111827] mt-1">
                {plant.diseaseStatus || 'No Symptoms'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                <Droplets className="w-3 h-3 text-[#2563EB]" />
                Latest Soil Moisture
              </span>
              <p className="text-xs font-bold text-[#111827] mt-1">
                {plant.soilMoisture || 41}% (Adequate)
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                <Bot className="w-3 h-3 text-[#16A34A]" />
                Last Inspection
              </span>
              <p className="text-xs font-bold text-[#111827] mt-1">
                {plant.lastInspection || '6 Sep'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB]">
              <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                <Camera className="w-3 h-3 text-[#7C3AED]" />
                Assigned Rover
              </span>
              <p className="text-xs font-bold text-[#111827] mt-1">
                AgroBot AGB-02 (Canopy Scout)
              </p>
            </div>
          </div>

          {/* State Workflow Machine */}
          {state === 'Ready' && (
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-[#166534] space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-[#16A34A]" />
                <span>Ready to Inspect</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#15803D]">
                AgroBot AGB-02 is in Standby mode near Field C Zone C4. Launching inspection will capture 5 multi-spectral frames and run Edge AI canopy diagnostics on leaf surface health.
              </p>
            </div>
          )}

          {state === 'Inspecting' && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#1E40AF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  Capturing Multispectral Imagery...
                </span>
                <span className="font-mono text-[11px] font-bold">{scannedFrames}/5 Frames</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-blue-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-blue-700">
                Rover AGB-02 positioning LiDAR optical lens along Row 12, canopy height 65cm.
              </p>
            </div>
          )}

          {state === 'Analysis' && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-[#6B21A8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#7C3AED] animate-spin" />
                  Running Edge AI Inference (YOLOv8-Agri)...
                </span>
                <span className="font-mono text-[11px] font-bold">14.8 ms</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-700">
                Segmenting leaf chlorophyll, verifying lesion perimeter, checking vegetative shoot vigor.
              </p>
            </div>
          )}

          {state === 'Completed' && (
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-[#166534] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-sm text-[#15803D]">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                <span>Inspection Complete & Verified!</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-[#DCFCE7] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Lesion Status:</span>
                  <strong className="text-[#16A34A]">Arrested / Inactive</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Health Index Updated:</span>
                  <strong className="text-[#16A34A]">{Math.min(98, (plant.currentHealth ?? plant.health) + 2)}% (+2%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Timeline Event:</span>
                  <strong className="text-[#111827]">Added to Plant Journey</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
          {state === 'Ready' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartInspection}
                className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Inspection</span>
              </button>
            </>
          )}

          {(state === 'Inspecting' || state === 'Analysis') && (
            <div className="text-xs text-[#6B7280] italic py-1">
              Please wait while AgroBot completes mission...
            </div>
          )}

          {state === 'Completed' && (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#4B5563] hover:bg-white transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Inspect</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close & View Passport
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
