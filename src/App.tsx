import React, { useState, useEffect } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { Navbar } from './components/Navbar';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { EmergencySosModal } from './components/EmergencySosModal';
import { SoundAlertBanner } from './components/SoundAlertBanner';
import { AccessibilitySettingsModal } from './components/AccessibilitySettingsModal';
import { AiAssistantModal } from './components/modules/AiAssistantModal';

import { PersonalizedDashboard } from './components/modules/PersonalizedDashboard';
import { VisionAssistance } from './components/modules/VisionAssistance';
import { HearingAssistance } from './components/modules/HearingAssistance';
import { SpeechAssistance } from './components/modules/SpeechAssistance';
import { HealthCaregiving } from './components/modules/HealthCaregiving';
import { EducationLearning } from './components/modules/EducationLearning';
import { CommunityNavigation } from './components/modules/CommunityNavigation';

import { 
  Bot, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles, 
  Heart, 
  Keyboard, 
  ExternalLink 
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    disabilityType, 
    triggerSos, 
    preferences, 
    userProfile 
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Global Keyboard Accessibility Shortcuts (WCAG 2.2 AA requirement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S -> Trigger Emergency SOS
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerSos();
      }
      // Alt + A -> Open AI Assistant
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setShowAiModal(prev => !prev);
      }
      // Alt + P -> Open Preferences / Settings
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setShowSettingsModal(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSos]);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <PersonalizedDashboard 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onOpenAiAssistant={() => setShowAiModal(true)} 
          />
        );
      case 'vision':
        return <VisionAssistance />;
      case 'hearing':
        return <HearingAssistance />;
      case 'speech':
        return <SpeechAssistance />;
      case 'health':
        return <HealthCaregiving />;
      case 'education':
        return <EducationLearning />;
      case 'map':
        return <CommunityNavigation />;
      default:
        return (
          <PersonalizedDashboard 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onOpenAiAssistant={() => setShowAiModal(true)} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      
      {/* Skip to Main Content Link for Screen Readers (WCAG SC 2.4.1) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-700 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-hidden"
      >
        Skip directly to main content
      </a>

      {/* Persistent Accessibility Settings Toolbar */}
      <AccessibilityToolbar onOpenSettings={() => setShowSettingsModal(true)} />

      {/* Primary Accessible Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tabId: string) => setActiveTab(tabId)} 
        onOpenAiAssistant={() => setShowAiModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)} 
      />

      {/* Main Content Arena */}
      <main 
        id="main-content" 
        tabIndex={-1} 
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-hidden"
      >
        {renderActiveModule()}
      </main>

      {/* Floating AI Companion Launcher Button */}
      <aside aria-label="AI Assistant Quick Launch">
        <button
          id="btn-floating-ai"
          onClick={() => setShowAiModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition cursor-pointer border-2 border-white/20"
          aria-label="Open AccessAll AI Personal Companion (Shortcut: Alt + A)"
          title="Open AI Companion (Alt + A)"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline text-sm font-black tracking-wide">
            AI Companion
          </span>
          <span className="hidden md:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
            Alt+A
          </span>
        </button>
      </aside>

      {/* Environmental Sound Alert Banner (For Deaf/Hard-of-Hearing users) */}
      <SoundAlertBanner />

      {/* Emergency SOS Modal (Full-screen high-priority alert) */}
      <EmergencySosModal />

      {/* Accessibility & User Profile Customization Dialog */}
      <AccessibilitySettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />

      {/* AI Personal Assistant Dialog */}
      <AiAssistantModal 
        isOpen={showAiModal} 
        onClose={() => setShowAiModal(false)} 
      />

      {/* Accessible Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>AccessAll Platform</span>
            <span className="font-normal text-slate-400">|</span>
            <span className="font-medium text-slate-500">WCAG 2.2 AA Compliant</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Accessibility Options
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Shortcuts: Alt+S (SOS) • Alt+A (AI) • Alt+P (Settings)</span>
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Designed for Universal Inclusion
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <MainAppContent />
    </AccessibilityProvider>
  );
}
