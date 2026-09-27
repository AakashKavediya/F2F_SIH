'use client';

import React from 'react';
import { Bot, CheckCircle2 } from 'lucide-react';

const missionHistory = [
  { id: 'M-028', date: '25 Sep 2026', robot: 'AGB-02', mission: 'Disease Inspection', field: 'Field C (Zone C4)', duration: '28 min', coverage: '81%', result: '17 Early Blight lesions flagged' },
  { id: 'M-027', date: '25 Sep 2026', robot: 'AGB-01', mission: 'Perimeter SLAM Mapping', field: 'Field A', duration: '35 min', coverage: '68%', result: 'Boundary point cloud updated' },
  { id: 'M-026', date: '24 Sep 2026', robot: 'AGB-02', mission: 'Soil Moisture Scan', field: 'Field B (Zone B2)', duration: '22 min', coverage: '100%', result: 'Verified dry zone at 24%' },
  { id: 'M-025', date: '23 Sep 2026', robot: 'AGB-01', mission: 'Weed Canopy Scan', field: 'Field C', duration: '40 min', coverage: '100%', result: '8.4% Parthenium colony identified' },
  { id: 'M-024', date: '22 Sep 2026', robot: 'AGB-02', mission: 'Targeted Bio-Spray', field: 'Field C (Zone C4)', duration: '18 min', coverage: '100%', result: '18 m² treated (Copper hydroxide)' },
];

export function MissionHistoryTable() {
  return (
    <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-[#F3F4F6] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">
            Historical Robot Mission Register
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Autonomous sorties verified via RTK GNSS and IMU loggers
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
          {missionHistory.length} Missions Logged
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F9F7] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
            <tr>
              <th className="py-3 px-4">Mission ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Robot</th>
              <th className="py-3 px-4">Objective</th>
              <th className="py-3 px-4">Target Parcel</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Coverage</th>
              <th className="py-3 px-4 text-right">Ground Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {missionHistory.map((m) => (
              <tr key={m.id} className="hover:bg-[#F0FDF4]/40 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-[#6B7280]">{m.id}</td>
                <td className="py-3.5 px-4 text-[#111827]">{m.date}</td>
                <td className="py-3.5 px-4 font-bold text-[#166534] flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> {m.robot}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#111827]">{m.mission}</td>
                <td className="py-3.5 px-4 text-[#6B7280]">{m.field}</td>
                <td className="py-3.5 px-4 text-[#111827]">{m.duration}</td>
                <td className="py-3.5 px-4 font-bold text-[#16A34A]">{m.coverage}</td>
                <td className="py-3.5 px-4 text-right font-medium text-[#4B5563]">{m.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
