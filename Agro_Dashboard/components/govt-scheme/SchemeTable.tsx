'use client';

import { useState, useMemo } from 'react';
import { Search, ExternalLink, ChevronUp, ChevronDown, Calendar, BadgeIndianRupee, ChevronRight } from 'lucide-react';
import { GovtSchemeItem } from '@/data/types';

interface Props {
  schemes: GovtSchemeItem[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const categories = ['All', 'Direct Benefit', 'Irrigation', 'Insurance', 'Subsidy', 'Soil & Inputs'];

const statusBadge: Record<string, { label: string; classes: string }> = {
  'Approved':          { label: 'Approved ✓',     classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Documents Pending': { label: 'Docs Pending',   classes: 'bg-amber-50 text-amber-700 border-amber-200'     },
  'Under Review':      { label: 'Under Review',   classes: 'bg-blue-50 text-blue-700 border-blue-200'        },
  'Submitted':         { label: 'Submitted',      classes: 'bg-indigo-50 text-indigo-700 border-indigo-200'  },
  'Not Started':       { label: 'Not Started',    classes: 'bg-gray-50 text-gray-600 border-gray-200'        },
};

const categoryColors: Record<string, string> = {
  'Direct Benefit': 'bg-green-100 text-green-800',
  'Irrigation':     'bg-blue-100 text-blue-800',
  'Insurance':      'bg-purple-100 text-purple-800',
  'Subsidy':        'bg-amber-100 text-amber-800',
  'Soil & Inputs':  'bg-orange-100 text-orange-800',
};

type SortKey = 'name' | 'eligibilityScore' | 'deadline' | 'benefit';

export default function SchemeTable({ schemes, onSelect, selectedId }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('eligibilityScore');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    const result = schemes.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.ministry ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      return matchSearch && matchCat;
    });

    result.sort((a, b) => {
      const aVal = sortKey === 'eligibilityScore' ? a.eligibilityScore ?? 0 : a[sortKey];
      const bVal = sortKey === 'eligibilityScore' ? b.eligibilityScore ?? 0 : b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const aNumber = Number(aVal ?? 0);
      const bNumber = Number(bVal ?? 0);
      return sortAsc ? aNumber - bNumber : bNumber - aNumber;
    });

    return result;
  }, [schemes, search, activeCategory, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return <ChevronUp className="w-3 h-3 text-gray-300" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-gray-600" /> : <ChevronDown className="w-3 h-3 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes or ministry…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 bg-gray-50"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-900">
                  Scheme <SortIcon col="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                <button onClick={() => handleSort('benefit')} className="flex items-center gap-1 hover:text-gray-900">
                  Benefit <SortIcon col="benefit" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                <button onClick={() => handleSort('eligibilityScore')} className="flex items-center gap-1 hover:text-gray-900">
                  Eligibility <SortIcon col="eligibilityScore" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                <button onClick={() => handleSort('deadline')} className="flex items-center gap-1 hover:text-gray-900">
                  Deadline <SortIcon col="deadline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  No schemes match your filters
                </td>
              </tr>
            )}
            {filtered.map((scheme) => {
              const status = statusBadge[scheme.applicationStatus] || { label: scheme.applicationStatus, classes: 'bg-gray-50 text-gray-600 border-gray-200' };
              const score = scheme.eligibilityScore ?? 75;
              const isSelected = scheme.id === selectedId;

              return (
                <tr
                  key={scheme.id}
                  onClick={() => onSelect(scheme.id)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-green-50/60' : 'hover:bg-gray-50'}`}
                >
                  {/* Name */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{scheme.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{scheme.ministry}</p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-700'}`}>
                      {scheme.category}
                    </span>
                  </td>

                  {/* Benefit */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-gray-800 font-medium text-xs">
                      <BadgeIndianRupee className="w-3.5 h-3.5 text-gray-500" />
                      {scheme.benefit}
                    </div>
                  </td>

                  {/* Eligibility score */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${score}%`, background: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444' }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-800">{score}%</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        scheme.applicationStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {scheme.applicationStatus === 'Approved' ? 'Enrolled' : 'Potentially Eligible'}
                      </span>
                    </div>
                  </td>

                  {/* Status & Docs */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${status.classes}`}>
                        {status.label}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {scheme.documents?.length || 4} Docs Required
                      </span>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-4">
                    {scheme.deadline ? (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{scheme.deadline}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onSelect(scheme.id)}
                      className="inline-flex items-center gap-1 text-xs text-[#166534] hover:text-[#14532D] font-bold bg-[#F0FDF4] hover:bg-[#DCFCE7] px-2.5 py-1 rounded-lg border border-[#BBF7D0] transition-colors"
                    >
                      Checklist <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
        <span>Showing {filtered.length} of {schemes.length} schemes</span>
        <span>Click any row to view document checklist →</span>
      </div>
    </div>
  );
}
