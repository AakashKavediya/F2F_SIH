'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/FarmContext';
import {
  ExternalLink,
  Download,
  FileSpreadsheet,
  ChevronDown,
  FileText,
} from 'lucide-react';
import {
  exportFieldPassportExcel,
  exportFieldPassportCsv,
  exportAllFieldsPortfolioExcel,
  exportAllFieldsPortfolioCsv,
} from '@/lib/exportExcel';

export function CropTable() {
  const { fields, openFieldPassportFor, fieldPassportEvents } = useFarm();
  const [activeMenuFieldId, setActiveMenuFieldId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-[#F3F4F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">Field & Crop Portfolio Ledger</h3>
          <p className="text-[11px] text-[#6B7280]">
            Click any row to open the complete chronological Field Passport or download ledgers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              exportAllFieldsPortfolioExcel(fields, fieldPassportEvents);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] transition-all shadow-xs cursor-pointer"
            title="Download full portfolio ledger as Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              exportAllFieldsPortfolioCsv(fields);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#374151] transition-all shadow-xs cursor-pointer"
            title="Download full portfolio ledger as CSV (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Export CSV</span>
          </button>
          <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
            {fields.length} Fields Active
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F9F7] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
            <tr>
              <th className="py-3 px-4">Field</th>
              <th className="py-3 px-4">Crop</th>
              <th className="py-3 px-4">Variety</th>
              <th className="py-3 px-4">Area</th>
              <th className="py-3 px-4">Plants</th>
              <th className="py-3 px-4">Health</th>
              <th className="py-3 px-4">Growth Stage</th>
              <th className="py-3 px-4">Disease Risk</th>
              <th className="py-3 px-4">Pest Risk</th>
              <th className="py-3 px-4">Weed</th>
              <th className="py-3 px-4">Water Stress</th>
              <th className="py-3 px-4">Nutrients</th>
              <th className="py-3 px-4">Last AI Scan</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {fields.map((f) => (
              <tr
                key={f.id}
                onClick={() => openFieldPassportFor(f.id)}
                className="hover:bg-[#F0FDF4]/50 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-[#111827] group-hover:text-[#16A34A]">
                  {f.name}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#111827]">{f.crop}</td>
                <td className="py-3.5 px-4 text-[#6B7280]">{f.variety}</td>
                <td className="py-3.5 px-4 text-[#111827]">{f.area} ac</td>
                <td className="py-3.5 px-4 text-[#111827]">{f.plantCount.toLocaleString()}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                      f.health >= 90
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : 'bg-amber-100 text-[#F59E0B]'
                    }`}
                  >
                    {f.health}%
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#F7F9F7] border border-[#E5E7EB] px-2 py-0.5 rounded-md font-medium text-[#4B5563]">
                    {f.growthStage}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-semibold ${
                      f.diseaseRisk > 50 ? 'text-[#EF4444]' : 'text-[#16A34A]'
                    }`}
                  >
                    {f.diseaseRisk}%
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-semibold ${
                      f.pestRisk > 30 ? 'text-[#F59E0B]' : 'text-[#6B7280]'
                    }`}
                  >
                    {f.pestRisk}%
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#6B7280]">{f.weedCoverage}%</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-medium ${
                      f.waterStress === 'High' ? 'text-[#EF4444] font-bold' : 'text-[#6B7280]'
                    }`}
                  >
                    {f.waterStress}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[11px] ${
                      f.nutrientStatus === 'Deficient'
                        ? 'text-[#F59E0B] font-semibold'
                        : 'text-[#166534]'
                    }`}
                  >
                    {f.nutrientStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#6B7280] text-[11px] whitespace-nowrap">
                  {f.lastAiScan}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1 relative">
                    {/* Quick Excel Download Icon */}
                    <button
                      type="button"
                      title={`Download ${f.name} Passport in Excel format (.xlsx)`}
                      onClick={(e) => {
                        e.stopPropagation();
                        exportFieldPassportExcel(f, fieldPassportEvents);
                      }}
                      className="p-1 rounded-md text-[#16A34A] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick CSV Download Icon */}
                    <button
                      type="button"
                      title={`Download ${f.name} Passport in CSV format (.csv)`}
                      onClick={(e) => {
                        e.stopPropagation();
                        exportFieldPassportCsv(f, fieldPassportEvents);
                      }}
                      className="p-1 rounded-md text-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Passport Action Menu Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuFieldId(activeMenuFieldId === f.id ? null : f.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] font-bold text-[#166534] hover:bg-[#DCFCE7] transition-all shadow-xs cursor-pointer"
                    >
                      <span>Passport</span>
                      <ChevronDown
                        className={`w-3 h-3 text-[#16A34A] transition-transform ${
                          activeMenuFieldId === f.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Passport Dropdown Menu */}
                    {activeMenuFieldId === f.id && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuFieldId(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-[#E5E7EB] z-40 p-1.5 text-left">
                          <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider border-b border-[#F3F4F6]">
                            {f.name} Passport Downloads
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportFieldPassportExcel(f, fieldPassportEvents);
                              setActiveMenuFieldId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F0FDF4] hover:text-[#166534] rounded-lg transition-colors cursor-pointer"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-[#16A34A] shrink-0" />
                            <div className="flex flex-col text-left">
                              <span>Download Excel (.xlsx)</span>
                              <span className="text-[10px] text-[#6B7280] font-normal">
                                Multi-sheet workbook & ledger
                              </span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportFieldPassportCsv(f, fieldPassportEvents);
                              setActiveMenuFieldId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-[#111827] hover:bg-[#EFF6FF] hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                            <div className="flex flex-col text-left">
                              <span>Download CSV (.csv)</span>
                              <span className="text-[10px] text-[#6B7280] font-normal">
                                Comma-separated events ledger
                              </span>
                            </div>
                          </button>
                          <div className="my-1 border-t border-[#F3F4F6]" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openFieldPassportFor(f.id);
                              setActiveMenuFieldId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] rounded-lg transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4 text-[#6B7280] shrink-0" />
                            <span>Open Digital Twin Drawer</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

