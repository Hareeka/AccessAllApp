import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Type, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Eye, 
  Settings, 
  AlertCircle
} from 'lucide-react';

interface Props {
  onOpenSettings: () => void;
}

export const AccessibilityToolbar: React.FC<Props> = ({ onOpenSettings }) => {
  const { 
    preferences, 
    updatePreferences, 
    speakText, 
    stopSpeaking, 
    isSpeaking, 
    disabilityType,
    triggerSos 
  } = useAccessibility();

  const cycleTextSize = () => {
    if (preferences.textSize === 'normal') updatePreferences({ textSize: 'large' });
    else if (preferences.textSize === 'large') updatePreferences({ textSize: 'extra-large' });
    else updatePreferences({ textSize: 'normal' });
  };

  const toggleContrast = () => {
    if (preferences.contrastMode === 'standard') updatePreferences({ contrastMode: 'high-contrast' });
    else if (preferences.contrastMode === 'high-contrast') updatePreferences({ contrastMode: 'dark' });
    else updatePreferences({ contrastMode: 'standard' });
  };

  const readPageOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`Welcome to AccessAll. Current profile: ${disabilityType} disability support. You are viewing the unified accessibility platform. Press the SOS button for immediate emergency assistance, or navigate between Vision, Hearing, Speech, Health, Education, and Community modules.`);
    }
  };

  return (
    <aside 
      aria-label="Accessibility quick controls"
      className="bg-slate-900 text-white px-3 py-2 border-b border-slate-800 text-xs sm:text-sm sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-indigo-400 flex items-center gap-1.5" id="accessibility-toolbar-title">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Accessibility Controls:</span>
          </span>

          {/* Text Size Cycle */}
          <button
            id="btn-cycle-text-size"
            onClick={cycleTextSize}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition border border-slate-700 font-medium cursor-pointer"
            title="Cycle Text Size (Normal, Large, Extra Large)"
            aria-label={`Text size current: ${preferences.textSize}. Click to change`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Size: {preferences.textSize === 'normal' ? 'A' : preferences.textSize === 'large' ? 'A+' : 'A++'}</span>
          </button>

          {/* Contrast Mode */}
          <button
            id="btn-toggle-contrast"
            onClick={toggleContrast}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition border border-slate-700 font-medium cursor-pointer"
            title="Toggle Contrast Mode (Standard, High Contrast Yellow/Black, Dark)"
            aria-label={`Contrast mode: ${preferences.contrastMode}`}
          >
            {preferences.contrastMode === 'high-contrast' ? (
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
            ) : preferences.contrastMode === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            )}
            <span className="capitalize">{preferences.contrastMode.replace('-', ' ')}</span>
          </button>

          {/* Dyslexic Font Toggle */}
          <button
            id="btn-toggle-dyslexic-font"
            onClick={() => updatePreferences({ dyslexicFont: !preferences.dyslexicFont })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition border cursor-pointer ${
              preferences.dyslexicFont ? 'bg-indigo-600 border-indigo-500 font-bold' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Dyslexia-Friendly Readable Font"
            aria-pressed={preferences.dyslexicFont}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dyslexia Font:</span>
            <span>{preferences.dyslexicFont ? 'ON' : 'OFF'}</span>
          </button>

          {/* Simplified UI Mode Toggle */}
          <button
            id="btn-toggle-simplified-ui"
            onClick={() => updatePreferences({ simplifiedUI: !preferences.simplifiedUI })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition border cursor-pointer ${
              preferences.simplifiedUI ? 'bg-emerald-600 border-emerald-500 font-bold' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Simplified Cognitive Mode (less clutter, bigger buttons)"
            aria-pressed={preferences.simplifiedUI}
          >
            <span>Simple Mode: {preferences.simplifiedUI ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Read Page Out Loud */}
          <button
            id="btn-read-page-overview"
            onClick={readPageOverview}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition cursor-pointer ${
              isSpeaking ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse' : 'bg-indigo-700 hover:bg-indigo-600 text-white'
            }`}
            aria-label={isSpeaking ? 'Stop reading page overview' : 'Read page overview aloud'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
          </button>

          {/* Full Settings Modal trigger */}
          <button
            id="btn-open-accessibility-settings"
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
            aria-label="Open full accessibility configuration"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preferences</span>
          </button>

          {/* Quick SOS Trigger */}
          <button
            id="btn-quick-sos-top"
            onClick={triggerSos}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide shadow-sm hover:shadow transition animate-pulse cursor-pointer"
            aria-label="Activate Emergency SOS immediately"
          >
            <AlertCircle className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
