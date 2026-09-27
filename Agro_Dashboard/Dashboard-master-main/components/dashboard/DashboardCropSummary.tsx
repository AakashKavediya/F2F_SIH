'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ChevronRight, AlertTriangle, Droplets } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function DashboardCropSummary() {
  const { openFieldPassportFor } = useFarm();

  const crops = [
    {
      name: 'Tomato',
      variety: 'Arka Rakshak & Abhinav',
      area: '2.9 ac (Field A & C)',
      plants: '4,430 plants',
      health: 91,
      healthClass: 'text-[#16A34A]',
      disease: 'Early Blight (Field C)',
      pest: 'Whitefly (+18%)',
      waterStress: 'Low',
      fieldId: 'FIELD-C',
    },
    {
      name: 'Cotton',
      variety: 'Phule Anmol',
      area: '1.3 ac (Field B)',
      plants: '1,850 plants',
      health: 84,
      healthClass: 'text-[#F59E0B]',
      disease: 'None detected',
      pest: 'Aphids (Low)',
      waterStress: 'High (Zone B2)',
      fieldId: 'FIELD-B',
    },
    {
      name: 'Wheat',
      variety: 'GW-496',
      area: '1.2 ac (Field D)',
      plants: '1,960 plants',
      health: 92,
      healthClass: 'text-[#16A34A]',
      disease: 'None detected',
      pest: 'None detected',
      waterStress: 'Low',
      fieldId: 'FIELD-D',
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <h3 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#16A34A]" />
            Active Crop Portfolios
          </h3>
          <p className="text-[11px] text-[#6B7280]">Total 8,240 plants under digital monitoring</p>
        </div>
        <Link
          href="/crop-health"
          className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] hover:underline flex items-center gap-0.5"
        >
          <span>All Crops</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Crop Rows */}
      <div className="py-3 space-y-3">
        {crops.map((crop) => (
          <div
            key={crop.name}
            onClick={() => openFieldPassportFor(crop.fieldId)}
            className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#16A34A] hover:bg-[#F0FDF4]/30 cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                  {crop.name}
                </span>
                <span className="text-[11px] text-[#6B7280] ml-2">({crop.variety})</span>
              </div>
              <span className={`text-sm font-extrabold ${crop.healthClass}`}>{crop.health}%</span>
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>{crop.area}</span>
              <span>{crop.plants}</span>
            </div>

            <div className="mt-2 pt-2 border-t border-[#F3F4F6] grid grid-cols-3 gap-1 text-[10px]">
              <div>
                <span className="text-[#9CA3AF]">Disease: </span>
                <span className="font-semibold text-[#111827]">{crop.disease}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF]">Pest: </span>
                <span className="font-semibold text-[#111827]">{crop.pest}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF]">Water Stress: </span>
                <span
                  className={`font-semibold ${
                    crop.waterStress.includes('High') ? 'text-[#EF4444]' : 'text-[#16A34A]'
                  }`}
                >
                  {crop.waterStress}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-[#9CA3AF] text-center">
        Click any crop to inspect its Field Passport and historical treatments
      </div>
    </div>
  );
}
