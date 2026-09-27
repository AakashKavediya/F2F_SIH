import type { Metadata } from 'next';
import './globals.css';
import { FarmProvider } from '@/context/FarmContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { GlobalSearchModal } from '@/components/modals/GlobalSearchModal';
import { FarmAiSheet } from '@/components/modals/FarmAiSheet';
import { NotificationDrawer } from '@/components/modals/NotificationDrawer';
import { FarmerProfileModal } from '@/components/modals/FarmerProfileModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { FieldPassportDrawer } from '@/components/modals/FieldPassportDrawer';
import { PlantPassportDrawer } from '@/components/modals/PlantPassportDrawer';
import { AgroBotModal } from '@/components/modals/AgroBotModal';
import { FloatingAiButton } from '@/components/ui/FloatingAiButton';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'FarmerOS — Farm Intelligence & Agricultural Robotics',
  description: 'Precision agricultural operating system, farm digital twin, IoT, and Edge AI robotics platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F7F9F7] text-[#111827] min-h-screen flex antialiased selection:bg-[#DCFCE7] selection:text-[#166534]">
        <FarmProvider>
          {/* Persistent Sidebar (Strictly 8 primary navigation tabs) */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
            <TopBar />
            <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
              {children}
            </main>
          </div>

          {/* Floating AI Button */}
          <FloatingAiButton />

          {/* Global Drawers & Modals (NOT primary tabs) */}
          <GlobalSearchModal />
          <FarmAiSheet />
          <NotificationDrawer />
          <FarmerProfileModal />
          <SettingsModal />
          <FieldPassportDrawer />
          <PlantPassportDrawer />
          <AgroBotModal />
          <ToastContainer />
        </FarmProvider>
      </body>
    </html>
  );
}
