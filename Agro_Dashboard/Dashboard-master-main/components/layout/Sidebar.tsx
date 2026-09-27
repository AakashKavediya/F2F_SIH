'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sprout,
  MapPin,
  Droplets,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Landmark,
  Bot,
  Bell,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

const primaryTabs = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Crop and Health', href: '/crop-health', icon: Sprout },
  { name: 'Field Map', href: '/field-map', icon: MapPin },
  { name: 'Irrigation', href: '/irrigation', icon: Droplets },
  { name: 'Task', href: '/task', icon: CheckSquare },
  { name: 'Alert and Insights', href: '/alert-insights', icon: AlertTriangle },
  { name: 'Report and Analysis', href: '/report-analysis', icon: BarChart3 },
  { name: 'Govt Scheme', href: '/govt-scheme', icon: Landmark },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    alerts,
    setIsAiDrawerOpen,
    setIsNotificationDrawerOpen,
    setIsProfileOpen,
    setIsSettingsOpen,
  } = useFarm();

  const unreadAlertsCount = alerts.filter((a) => a.status === 'Active').length;

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between flex-shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Top Header / Logo */}
      <div>
        <div className="h-16 px-5 border-b border-[#E5E7EB] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shadow-sm">
            <Sprout className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-[#111827] flex items-center gap-1.5">
              FarmerOS
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#166534]">
                Core
              </span>
            </h1>
            <p className="text-[11px] font-medium text-[#6B7280]">Farm Intelligence</p>
          </div>
        </div>

        {/* 8 Primary Navigation Tabs */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#9CA3AF] uppercase">
            Farm Operations
          </div>
          {primaryTabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href === '/dashboard' && pathname === '/');
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#F0FDF4] text-[#111827] font-semibold border border-[#DCFCE7] shadow-subtle'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9F7]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#16A34A]' : 'text-[#6B7280]'
                  }`}
                />
                <span className="truncate">{tab.name}</span>
                {tab.name === 'Alert and Insights' && unreadAlertsCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#EF4444] text-white">
                    {unreadAlertsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utilities (NOT Primary Tabs) */}
      <div className="p-3 border-t border-[#E5E7EB] space-y-1 bg-[#FCFDFC]">
        {/* Farm AI Quick Launch */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#166534] bg-[#F0FDF4] border border-[#DCFCE7] hover:bg-[#DCFCE7] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Farm AI Assistant</span>
          </div>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#DCFCE7] text-[#16A34A] font-semibold">
            Ask
          </span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9F7] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Notifications</span>
          </div>
          {unreadAlertsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
          )}
        </button>

        {/* Farmer Profile */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9F7] transition-colors text-left"
        >
          <User className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>Farmer Profile</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F9F7] transition-colors text-left"
        >
          <Settings className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
