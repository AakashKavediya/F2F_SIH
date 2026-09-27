'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useFarm } from '@/context/FarmContext';

export function FloatingAiButton() {
  const { setIsAiDrawerOpen } = useFarm();

  return (
    <button
      onClick={() => setIsAiDrawerOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#16A34A] text-white shadow-float hover:bg-[#15803D] hover:shadow-xl transition-all duration-200 group"
      title="Ask Farm AI Assistant"
    >
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
      </div>
      <span className="text-xs font-semibold tracking-wide">Ask Farm AI</span>
    </button>
  );
}
