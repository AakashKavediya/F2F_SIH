'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  IndianRupee,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Info,
  TrendingDown,
  Percent,
} from 'lucide-react';

export default function SchemeCalculator() {
  const [selectedScheme, setSelectedScheme] = useState<'PMKSY' | 'KUSUM' | 'SMAM'>('PMKSY');
  const [areaAcres, setAreaAcres] = useState<number>(5.4);
  const [farmerCategory, setFarmerCategory] = useState<'SmallMarginal' | 'General' | 'SCST' | 'OBC'>('SmallMarginal');
  const [cropType, setCropType] = useState<'Horticulture' | 'CashCrop' | 'FieldCrop'>('Horticulture');
  const [pumpHp, setPumpHp] = useState<number>(5);

  // Dynamic calculations based on state norms (Maharashtra Gov & Central Ministry)
  let baseCost = 0;
  let subsidyPct = 0;
  let centralSharePct = 0;
  let stateSharePct = 0;
  let schemeTitle = '';
  let schemeSub = '';

  if (selectedScheme === 'PMKSY') {
    schemeTitle = 'PMKSY Micro-Irrigation (Drip / Sprinkler)';
    schemeSub = 'Department of Agriculture & Farmers Welfare, GoI + GoM';
    // Per acre drip installation baseline ~ ₹42,000 / acre
    baseCost = Math.round(areaAcres * 42000);
    subsidyPct = farmerCategory === 'SmallMarginal' || farmerCategory === 'SCST' ? 55 : 45;
    centralSharePct = Math.round(subsidyPct * 0.6);
    stateSharePct = subsidyPct - centralSharePct;
  } else if (selectedScheme === 'KUSUM') {
    schemeTitle = 'PM-KUSUM Component B (Standalone Solar Pump)';
    schemeSub = 'Ministry of New & Renewable Energy (MNRE) + MEDA';
    // Standalone 5HP AC/DC solar pump baseline ~ ₹2,80,000
    baseCost = pumpHp === 3 ? 195000 : pumpHp === 5 ? 275000 : 360000;
    subsidyPct = 60; // 30% Centre + 30% State
    centralSharePct = 30;
    stateSharePct = 30;
  } else {
    schemeTitle = 'SMAM - Sub-Mission on Agricultural Mechanization';
    schemeSub = 'Farm Robotics, Precision Sprayers & Machinery Grants';
    baseCost = 350000; // AgroBot or tractor mounted sprayer cost
    subsidyPct = farmerCategory === 'SCST' ? 50 : farmerCategory === 'SmallMarginal' || farmerCategory === 'OBC' ? 45 : 40;
    centralSharePct = Math.round(subsidyPct * 0.6);
    stateSharePct = subsidyPct - centralSharePct;
  }

  const totalSubsidyAmount = Math.round((baseCost * subsidyPct) / 100);
  const centralGrant = Math.round((baseCost * centralSharePct) / 100);
  const stateGrant = totalSubsidyAmount - centralGrant;
  const farmerShare = baseCost - totalSubsidyAmount;
  const loanEligible = Math.round(farmerShare * 0.75); // 75% KCC loan support
  const netCashRequired = farmerShare - loanEligible;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-green-50 text-green-700">
              <Calculator className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Government Subsidy & Financial Grant Calculator
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Simulate capital grants, central/state cost shares, and loan eligibility tailored for Palghar, Maharashtra.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
          {[
            { id: 'PMKSY', label: 'PMKSY Drip' },
            { id: 'KUSUM', label: 'Solar Pump' },
            { id: 'SMAM', label: 'AgroBot / Machinery' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedScheme(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedScheme === item.id
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs & Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">{schemeTitle}</span>
            <span className="text-[11px] text-gray-500">{schemeSub}</span>
          </div>

          {selectedScheme === 'PMKSY' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Land Parcel Area for Drip Grid (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="25"
                value={areaAcres}
                onChange={(e) => setAreaAcres(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Your farm total area: 5.4 acres (Krishi Vigyan Kendra)
              </span>
            </div>
          )}

          {selectedScheme === 'KUSUM' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Solar Pump Capacity
              </label>
              <select
                value={pumpHp}
                onChange={(e) => setPumpHp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value={3}>3 HP DC Submersible (Shallow wells)</option>
                <option value={5}>5 HP DC Submersible (Optimal for 5.4 ac)</option>
                <option value={7.5}>7.5 HP High Discharge (Deep borewells)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Farmer Category & Landholding Slab
            </label>
            <select
              value={farmerCategory}
              onChange={(e) => setFarmerCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="SmallMarginal">Small & Marginal Farmer (≤ 2 ha / 5 acres) — 55% Subsidy</option>
              <option value="OBC">OBC Category Farmer — Special Quota</option>
              <option value="SCST">SC / ST Farmer — Highest Central Grant (up to 60%)</option>
              <option value="General">Other / General Farmer — 45% Subsidy</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Target Crop Category
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="Horticulture">Horticulture & Vegetables (Tomato, Chili, Brinjal)</option>
              <option value="CashCrop">Commercial Cash Crops (Cotton, Sugarcane)</option>
              <option value="FieldCrop">Cereal & Oilseed Crops (Wheat, Mustard)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-[11px] text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Direct Benefit Transfer (DBT) is credited directly to your verified <strong>State Bank of India</strong> account seeded with Aadhaar.
            </span>
          </div>
        </div>

        {/* Right Financial Simulation Card */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] border border-[#BBF7D0] space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#BBF7D0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                  Estimated Government Grant
                </span>
                <p className="text-2xl font-black text-gray-900 mt-0.5">
                  ₹{totalSubsidyAmount.toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-extrabold text-white bg-green-700 px-3 py-1.5 rounded-xl shadow-xs">
                {subsidyPct}% Grant Share
              </span>
            </div>

            {/* Split row */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/80 border border-emerald-100">
                <span className="text-[10px] text-gray-500 block">Central Govt Grant ({centralSharePct}%)</span>
                <strong className="text-base font-bold text-emerald-800 mt-0.5 block">
                  ₹{centralGrant.toLocaleString()}
                </strong>
                <span className="text-[10px] text-gray-400">Via Ministry of Agriculture</span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-emerald-100">
                <span className="text-[10px] text-gray-500 block">Maharashtra State Grant ({stateSharePct}%)</span>
                <strong className="text-base font-bold text-emerald-800 mt-0.5 block">
                  ₹{stateGrant.toLocaleString()}
                </strong>
                <span className="text-[10px] text-gray-400">Via MahaDBT Portal</span>
              </div>
            </div>

            {/* Farmer Out-of-pocket & Loan breakups */}
            <div className="p-4 rounded-xl bg-white border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span>Total Benchmark Project Cost:</span>
                <strong className="text-gray-900">₹{baseCost.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between items-center text-green-700 font-semibold">
                <span>Total Direct Subsidy Deduction:</span>
                <span>- ₹{totalSubsidyAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-gray-900 font-bold">
                <span>Farmer Balance Share:</span>
                <span>₹{farmerShare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-blue-700 text-[11px]">
                <span>Eligible KCC / Institutional Loan (75%):</span>
                <span>₹{loanEligible.toLocaleString()}</span>
              </div>
              <div className="pt-1 flex justify-between items-center text-gray-900 font-bold text-xs bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span>Net Cash Upfront Payment Required:</span>
                <span className="text-amber-900 font-extrabold">₹{netCashRequired.toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Pre-sanction quotation upload supported
              </span>
              <button
                type="button"
                onClick={() => alert(`Subsidy estimate of ₹${totalSubsidyAmount.toLocaleString()} generated for your 5.4 acres at Palghar!`)}
                className="px-4 py-2 rounded-xl bg-green-700 text-white text-xs font-bold hover:bg-green-800 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download Subsidy Estimate
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
