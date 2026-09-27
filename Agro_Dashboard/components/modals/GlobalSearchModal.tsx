'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Sprout, Bot, AlertTriangle, Landmark, CheckSquare, FileText, ArrowRight } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

interface SearchResult {
  id: string;
  category: 'Field' | 'Plant' | 'Robot' | 'Disease' | 'Pest' | 'Task' | 'Scheme';
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
}

export function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    fields,
    plants,
    selectedPlant,
    agroBots,
    diseaseEvents,
    pestEvents,
    tasks,
    govtSchemes,
    openFieldPassportFor,
    openPlantPassportFor,
    setSelectedRobot,
    setIsRobotModalOpen,
  } = useFarm();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  // Build searchable items
  const allItems: SearchResult[] = [
    // Fields
    ...fields.map((f) => ({
      id: f.id,
      category: 'Field' as const,
      title: `${f.name} (${f.crop})`,
      subtitle: `${f.area} acres • Health ${f.health}% • Moisture ${f.soilMoisture}%`,
      badge: f.growthStage,
      onClick: () => {
        openFieldPassportFor(f.id);
        setIsSearchOpen(false);
      },
    })),
    // All Plants
    ...(plants || [selectedPlant]).map((p) => ({
      id: p.id,
      category: 'Plant' as const,
      title: `Plant #${p.plantId || p.id.replace('PLANT-', '')} (${p.cropName})`,
      subtitle: `${p.fieldName || p.fieldId} • Row ${p.rowNumber || 12} • Health ${p.currentHealth ?? p.health}%`,
      badge: p.growthStatus || p.status,
      onClick: () => {
        setIsSearchOpen(false);
        openPlantPassportFor(p.id);
      },
    })),
    // Robots
    ...agroBots.map((b) => ({
      id: b.id,
      category: 'Robot' as const,
      title: `${b.name} (${b.id})`,
      subtitle: `Battery ${b.battery}% • Mission: ${b.currentMission}`,
      badge: b.status,
      onClick: () => {
        setSelectedRobot(b);
        setIsRobotModalOpen(true);
        setIsSearchOpen(false);
      },
    })),
    // Diseases
    ...diseaseEvents.map((d) => ({
      id: d.id,
      category: 'Disease' as const,
      title: `${d.diseaseName} (${d.id})`,
      subtitle: `${d.fieldId} / ${d.zoneId} • Severity ${d.severity} • ${d.affectedPlants} plants`,
      badge: d.status,
      onClick: () => {
        openFieldPassportFor(d.fieldId);
        setIsSearchOpen(false);
      },
    })),
    // Pests
    ...pestEvents.map((p) => ({
      id: p.id,
      category: 'Pest' as const,
      title: `${p.species} (${p.id})`,
      subtitle: `${p.fieldId} / ${p.zoneId} • Trend ${p.trendPct > 0 ? '+' : ''}${p.trendPct}% • ${p.source}`,
      badge: p.status,
      onClick: () => {
        openFieldPassportFor(p.fieldId);
        setIsSearchOpen(false);
      },
    })),
    // Tasks
    ...tasks.map((t) => ({
      id: t.id,
      category: 'Task' as const,
      title: t.title,
      subtitle: `${t.assignedTo} • ${t.estimatedTimeMins} min • Priority ${t.priority}`,
      badge: t.status,
      onClick: () => {
        setIsSearchOpen(false);
        window.location.href = '/task';
      },
    })),
    // Schemes
    ...govtSchemes.map((s) => ({
      id: s.id,
      category: 'Scheme' as const,
      title: s.name,
      subtitle: s.benefit,
      badge: s.eligibilityStatus,
      onClick: () => {
        setIsSearchOpen(false);
        window.location.href = '/govt-scheme';
      },
    })),
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  const getCategoryIcon = (cat: SearchResult['category']) => {
    switch (cat) {
      case 'Field':
        return <MapPin className="w-4 h-4 text-[#16A34A]" />;
      case 'Plant':
        return <Sprout className="w-4 h-4 text-[#16A34A]" />;
      case 'Robot':
        return <Bot className="w-4 h-4 text-[#3B82F6]" />;
      case 'Disease':
      case 'Pest':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'Task':
        return <CheckSquare className="w-4 h-4 text-[#166534]" />;
      case 'Scheme':
        return <Landmark className="w-4 h-4 text-[#8B5CF6]" />;
      default:
        return <FileText className="w-4 h-4 text-[#6B7280]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-float border border-[#E5E7EB] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search farm, fields, crops, plants (e.g. C-0182), robots, tasks, schemes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[11px] font-semibold text-[#9CA3AF] bg-[#F7F9F7] border border-[#E5E7EB] rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#F3F4F6]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#6B7280]">
              No farm entities found for &quot;<span className="font-semibold">{query}</span>&quot;.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={`${item.category}-${item.id}`}
                onClick={item.onClick}
                className="w-full p-3 rounded-xl hover:bg-[#F7F9F7] flex items-center justify-between transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#6B7280] bg-[#F3F4F6] px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
                      {item.badge}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#9CA3AF]">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
