import React, { useState } from 'react';
import { NavTab } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';

// Dedicated Tab Components
import { ResumakerTab } from './components/ResumakerTab';
import { TailorTab } from './components/TailorTab';
import { CoachTab } from './components/CoachTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-950 font-sans selection:bg-amber-300 selection:text-slate-950">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center">
        {activeTab === 'home' && (
          <div className="w-full">
            <HeroSection
              onBuildClick={() => setActiveTab('resumaker')}
              onExploreClick={() => setActiveTab('tailor')}
              onCoachClick={() => setActiveTab('coach')}
            />
          </div>
        )}

        {/* Resumaker Tab */}
        {activeTab === 'resumaker' && (
          <ResumakerTab
            onBackToHome={() => setActiveTab('home')}
            onGoToTailor={() => setActiveTab('tailor')}
            onGoToCoach={() => setActiveTab('coach')}
          />
        )}

        {/* Tailor Tab */}
        {activeTab === 'tailor' && (
          <TailorTab
            onBackToHome={() => setActiveTab('home')}
            onGoToResumaker={() => setActiveTab('resumaker')}
            onGoToCoach={() => setActiveTab('coach')}
          />
        )}

        {/* Coach Tab */}
        {(activeTab === 'coach' || activeTab === 'prep') && (
          <CoachTab
            onBackToHome={() => setActiveTab('home')}
            onGoToResumaker={() => setActiveTab('resumaker')}
            onGoToTailor={() => setActiveTab('tailor')}
          />
        )}
      </main>

      {/* Footer - Only on non-home pages so home has no scroll */}
      {activeTab !== 'home' && <Footer setActiveTab={setActiveTab} />}
    </div>
  );
}
