'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Calendar,
  Bell,
  Sparkles,
  ChevronDown,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useFarm, DateFilterType } from '@/context/FarmContext';

export function TopBar() {
  const pathname = usePathname();
  const {
    farm,
    farmer,
    dateFilter,
    setDateFilter,
    dataMode,
    alerts,
    setIsSearchOpen,
    setIsNotificationDrawerOpen,
    setIsAiDrawerOpen,
    setIsProfileOpen,
  } = useFarm();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
      case '/':
        return 'Dashboard';
      case '/crop-health':
        return 'Crop and Health';
      case '/field-map':
        return 'Field Map';
      case '/irrigation':
        return 'Irrigation';
      case '/task':
        return 'Task Operations';
      case '/alert-insights':
        return 'Alert and Insights';
      case '/report-analysis':
        return 'Report and Analysis';
      case '/govt-scheme':
        return 'Govt Scheme';
      default:
        return 'Farm Overview';
    }
  };

  const unreadAlertsCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-[#111827] tracking-tight">
          {getPageTitle(pathname)}
        </h2>
        <span className="text-[#E5E7EB] hidden md:inline">|</span>

        {/* Center/Left: Farm Selector Card */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5E7EB] text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#16A34A]" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111827]">{farm.name}</span>
            <span className="text-[#9CA3AF]">•</span>
            <span className="text-[#6B7280]">{farm.totalArea} acres</span>
            <span className="text-[#9CA3AF]">•</span>
            <span className="text-[#6B7280]">{farm.location}</span>
            <span className="text-[#9CA3AF]">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded-md">
              Health {farm.farmHealth}%
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Data Mode Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] font-semibold text-[#166534]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>{dataMode} DATA</span>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F9F7] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs text-[#6B7280] transition-colors"
          title="Search farm objects (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="hidden md:inline">Search farm, crops, robot...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#9CA3AF] bg-white border border-[#E5E7EB] rounded">
            ⌘K
          </kbd>
        </button>

        {/* Date Filter Selector */}
        <div className="hidden sm:flex items-center bg-[#F7F9F7] border border-[#E5E7EB] rounded-xl p-0.5 text-xs font-medium">
          {(['Today', '7D', '30D', 'Season'] as DateFilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                dateFilter === filter
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9F7] border border-transparent hover:border-[#E5E7EB] transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white"></span>
          )}
        </button>

        {/* Ask Farm AI Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Farm AI</span>
        </button>

        {/* Farmer Avatar & Profile Popover Trigger */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[#F7F9F7] transition-colors"
          title="Farmer Profile & Settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#166534] text-white font-bold text-xs flex items-center justify-center shadow-sm">
            AP
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-xs font-semibold text-[#111827] leading-none">{farmer.name}</p>
            <p className="text-[10px] text-[#6B7280] leading-tight mt-0.5">{farmer.id}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
