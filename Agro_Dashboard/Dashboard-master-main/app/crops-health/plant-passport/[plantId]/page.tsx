'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFarm } from '@/context/FarmContext';
import { findPlantById } from '@/data/plantsData';
import { PlantPassportView } from '@/components/crop-health/PlantPassportView';
import { Sprout, ArrowLeft } from 'lucide-react';

export default function PlantPassportDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const { plants, getPlantById } = useFarm();

  const plantId = (params?.plantId as string) || 'PLANT-C-0182';
  const plant = getPlantById(plantId) || findPlantById(plants, plantId) || plants[0];

  if (!plant) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E7EB] shadow-subtle max-w-lg mx-auto mt-12 space-y-4">
        <Sprout className="w-12 h-12 text-[#16A34A] mx-auto opacity-60" />
        <h2 className="text-lg font-bold text-[#111827]">Plant Passport Not Found</h2>
        <p className="text-xs text-[#6B7280]">
          Could not locate plant record for ID &quot;{plantId}&quot;.
        </p>
        <button
          onClick={() => router.push('/crop-health')}
          className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold inline-flex items-center gap-2 hover:bg-[#15803D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Crops & Health</span>
        </button>
      </div>
    );
  }

  return <PlantPassportView plant={plant} />;
}
