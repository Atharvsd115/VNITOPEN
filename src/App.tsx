import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveCityOverview } from './components/LiveCityOverview';
import { InteractiveMap } from './components/InteractiveMap';
import { TopVendorsSection } from './components/TopVendorsSection';
import { PeakHourAnalysis } from './components/PeakHourAnalysis';
import { TrafficIntelligence } from './components/TrafficIntelligence';
import { GovernmentDashboard } from './components/GovernmentDashboard';
import { VendorPortal } from './components/VendorPortal';
import { FilterPanel } from './components/FilterPanel';
import { VendorProfileModal } from './components/VendorProfileModal';
import { ReviewModal } from './components/ReviewModal';
import { ComplaintModal } from './components/ComplaintModal';
import { VendorApplicationModal } from './components/VendorApplicationModal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activeTab, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-amber-200 selection:text-slate-950">
      {/* Official Government Top Bar & Main Navigation */}
      <Navbar />

      {/* Main Container Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-8 pb-12">
            <HeroSection />
            <LiveCityOverview />
            <InteractiveMap />
            <TopVendorsSection />
            <PeakHourAnalysis />
            <TrafficIntelligence />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <FilterPanel />
            <InteractiveMap />
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <FilterPanel />
            <TopVendorsSection />
          </div>
        )}

        {activeTab === 'peak' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <PeakHourAnalysis />
          </div>
        )}

        {activeTab === 'traffic' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <TrafficIntelligence />
          </div>
        )}

        {activeTab === 'government' && (
          <div className="py-6">
            <GovernmentDashboard />
          </div>
        )}

        {activeTab === 'vendor-portal' && (
          <div className="py-6">
            <VendorPortal />
          </div>
        )}
      </main>

      {/* Global Interactive Modals */}
      <VendorProfileModal />
      <ReviewModal />
      <ComplaintModal />
      <VendorApplicationModal />
      <LoginModal />

      {/* Official Government Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
