import React, { useState } from 'react';
import { NavTab } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { HomeTeasersSection } from './components/HomeTeasersSection';
import { WhyStudentsLoveIt } from './components/WhyStudentsLoveIt';
import { WhatsInsideSection } from './components/WhatsInsideSection';
import { FaqSection } from './components/FaqSection';
import { BottomCtaSection } from './components/BottomCtaSection';
import { Footer } from './components/Footer';

// Dedicated Tab Components
import { ResumakerTab } from './components/ResumakerTab';
import { TailorTab } from './components/TailorTab';
import { CoachTab } from './components/CoachTab';
import { AboutTab } from './components/AboutTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  const jumpToAnchor = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setActiveTab('resumaker');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-slate-50 text-emerald-950 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCtaClick={handleCtaClick}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="space-y-12 sm:space-y-20">
            {/* 1. Hero Section */}
            <HeroSection
              onBuildClick={() => setActiveTab('resumaker')}
              onExploreClick={() => setActiveTab('tailor')}
              onCoachClick={() => setActiveTab('coach')}
            />

            {/* 2. Three Step How It Works Overview */}
            <HowItWorksSection
              onGoToResumaker={() => setActiveTab('resumaker')}
              onGoToTailor={() => setActiveTab('tailor')}
            />

            {/* 3. Sampling Teasers for Resumaker, Tailor & Coach */}
            <HomeTeasersSection
              onGoToResumaker={() => setActiveTab('resumaker')}
              onGoToTailor={() => setActiveTab('tailor')}
              onGoToCoach={() => setActiveTab('coach')}
            />

            {/* 4. Why Students Love It */}
            <WhyStudentsLoveIt />

            {/* 5. What's Inside & Template Showcase */}
            <WhatsInsideSection
              onBuildClick={() => setActiveTab('resumaker')}
            />

            {/* 6. FAQ Section */}
            <FaqSection />

            {/* 7. Bottom Call to Action */}
            <BottomCtaSection
              onGoToResumaker={() => setActiveTab('resumaker')}
              onGoToTailor={() => setActiveTab('tailor')}
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

        {/* About Tab */}
        {activeTab === 'about' && (
          <AboutTab
            onGoToResumaker={() => setActiveTab('resumaker')}
            onGoToTailor={() => setActiveTab('tailor')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
