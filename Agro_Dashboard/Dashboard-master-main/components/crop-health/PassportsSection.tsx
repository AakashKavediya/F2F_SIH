'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useFarm } from '@/context/FarmContext';
import {
  MapPin,
  Sprout,
  ArrowRight,
  ExternalLink,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Activity,
  Bot,
  Droplets,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { exportFieldPassportExcel, exportFieldPassportCsv } from '@/lib/exportExcel';

export function PassportsSection() {
  const { fields, plants, openFieldPassportFor, openPlantPassportFor, fieldPassportEvents } = useFarm();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Filtered plants list
  const filteredPlants = useMemo(() => {
    return plants.filter((p) => {
      // Field filter
      if (selectedFieldFilter !== 'ALL' && p.fieldId !== selectedFieldFilter) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter === 'HEALTHY' && (p.currentHealth ?? p.health) < 85) {
        return false;
      }
      if (selectedStatusFilter === 'RECOVERING' && p.growthStatus !== 'Recovering' && !p.diseaseStatus?.includes('Arrested')) {
        return false;
      }
      if (selectedStatusFilter === 'ATTENTION' && p.status !== 'Attention' && p.growthStatus !== 'Attention') {
        return false;
      }

      // Query search: ID, Field, Row, Crop type
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = p.id.toLowerCase().includes(q) || (p.plantId || '').toLowerCase().includes(q);
        const matchesCrop = p.cropName.toLowerCase().includes(q) || (p.cropType || '').toLowerCase().includes(q);
        const matchesField = (p.fieldName || p.fieldId).toLowerCase().includes(q);
        const matchesRow = `row ${p.rowNumber || 12}`.includes(q) || (p.rowId || '').toLowerCase().includes(q);
        return matchesId || matchesCrop || matchesField || matchesRow;
      }

      return true;
    });
  }, [plants, searchQuery, selectedFieldFilter, selectedStatusFilter]);

  return (
    <div className="space-y-8">
      {/* Featured Individual Plant Passport (Hero Highlight for Plant #C-0182) */}
      <div className="p-6 md:p-7 rounded-2xl bg-gradient-to-r from-[#F0FDF4] via-white to-[#F0FDF4] border border-[#DCFCE7] shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded border border-[#BBF7D0]">
              Featured Digital Identity
            </span>
            <span className="text-xs font-mono font-bold text-[#6B7280]">Target ID: PLANT-C-0182</span>
            <span className="text-[11px] font-bold text-[#166534] bg-white px-2 py-0.5 rounded border border-[#DCFCE7]">
              86% Healthy
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#111827]">
            Tomato #C-0182 (Row 12, Field C)
          </h3>
          <p className="text-xs text-[#4B5563] max-w-2xl leading-relaxed">
            Direct lifetime ledger tracking seedling transplanting (24 Jul), precision fertigation, Early Blight detection, targeted bio-spray by AgroBot AGB-02, and health rebound to 86%.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/crops-health/plant-passport/PLANT-C-0182"
            className="px-6 py-3 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Open Plant Passport</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Complete Plant Passport Directory & Search Section */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#16A34A]" />
              <span>Plant Passport Directory</span>
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Browse individual digital ledgers for {plants.length} monitored plants across your farm parcels.
            </p>
          </div>

          {/* Search Input (Plant ID, Field, Row, Crop type) */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (e.g. C-0182), Field, Row..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Filter Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F3F4F6] text-xs">
          {/* Field Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mr-1">
              Field:
            </span>
            <button
              onClick={() => setSelectedFieldFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedFieldFilter === 'ALL'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
              }`}
            >
              All Fields ({plants.length})
            </button>
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFieldFilter(f.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedFieldFilter === f.id
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-[#F9FAFB] text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mr-1">
              Status:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'HEALTHY', label: 'Healthy (85%+)' },
              { id: 'RECOVERING', label: 'Recovering' },
              { id: 'ATTENTION', label: 'Needs Attention' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedStatusFilter === st.id
                    ? 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] font-bold'
                    : 'bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {filteredPlants.map((p) => {
            const health = p.currentHealth ?? p.health;
            const isAttention = p.status === 'Attention' || p.growthStatus === 'Attention';
            const isFeatured = p.id === 'PLANT-C-0182';

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-subtle group hover:border-[#16A34A] ${
                  isFeatured ? 'ring-2 ring-[#16A34A]/30 border-[#16A34A]' : 'border-[#E5E7EB]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                      Plant #{p.plantId || p.id.replace('PLANT-', '')}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isAttention
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#DCFCE7] text-[#166534]'
                      }`}
                    >
                      {health}% Health
                    </span>
                  </div>

                  {/* Crop Info */}
                  <div>
                    <h4 className="text-sm font-bold text-[#111827]">
                      {p.cropName} <span className="text-xs font-normal text-[#6B7280]">({p.variety})</span>
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {p.fieldName || p.fieldId} • Row {p.rowNumber || 12}
                    </p>
                  </div>

                  {/* Telemetry Chips */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-[#F7F9F7] p-2 rounded-xl border border-[#E5E7EB]">
                    <div>
                      <span className="text-[#9CA3AF] block">Stage</span>
                      <strong className="text-[#111827]">{p.growthStage || p.stage}</strong>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF] block">Water</span>
                      <strong className="text-[#111827]">{p.waterTotal ?? p.stats?.estimatedWaterLiters ?? 24}L</strong>
                    </div>
                    <div>
                      <span className="text-[#9CA3AF] block">Scans</span>
                      <strong className="text-[#16A34A]">{p.aiScanCount ?? p.stats?.aiScans ?? 42}</strong>
                    </div>
                  </div>

                  {/* Condition Tag */}
                  {p.diseaseStatus && p.diseaseStatus !== 'None' && (
                    <div className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-[#F59E0B] shrink-0" />
                      <span className="truncate">{p.diseaseStatus}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 mt-3 border-t border-[#F3F4F6]">
                  <Link
                    href={`/crops-health/plant-passport/${p.id}`}
                    className="w-full py-2 rounded-xl bg-[#F0FDF4] hover:bg-[#16A34A] text-[#166534] hover:text-white border border-[#DCFCE7] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Open Plant Passport</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlants.length === 0 && (
          <div className="py-12 text-center text-xs text-[#6B7280] space-y-2">
            <Search className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-50" />
            <p className="font-semibold text-sm text-[#374151]">No plants matched your search.</p>
            <p className="text-[11px]">Try clearing the query or selecting &quot;All Fields&quot;.</p>
          </div>
        )}
      </div>

      {/* Field Passports Grid (Cadastral Parcels) */}
      <div>
        <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">
          Field Passports (Cadastral Parcels)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((f) => (
            <div
              key={f.id}
              onClick={() => openFieldPassportFor(f.id)}
              className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#16A34A] hover:bg-[#F0FDF4]/30 cursor-pointer transition-all shadow-subtle flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#111827] group-hover:text-[#16A34A]">
                    {f.name}
                  </span>
                  <span className="text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                    {f.health}%
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">{f.crop} ({f.variety})</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{f.area} acres • {f.plantCount} plants</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between text-xs font-semibold">
                <span className="text-[#16A34A] flex items-center gap-1">
                  <span>Passport Ledger</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title={`Download ${f.name} Passport as Excel (.xlsx)`}
                    onClick={(e) => {
                      e.stopPropagation();
                      exportFieldPassportExcel(f, fieldPassportEvents);
                    }}
                    className="p-1 rounded text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title={`Download ${f.name} Passport as CSV (.csv)`}
                    onClick={(e) => {
                      e.stopPropagation();
                      exportFieldPassportCsv(f, fieldPassportEvents);
                    }}
                    className="p-1 rounded text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
