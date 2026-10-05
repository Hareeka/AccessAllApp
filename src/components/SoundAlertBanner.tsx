import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { BellRing, Flame, Siren, AlertTriangle, X } from 'lucide-react';

export const SoundAlertBanner: React.FC = () => {
  const { activeSoundAlert, clearSoundAlert } = useAccessibility();

  if (!activeSoundAlert) return null;

  const getIcon = () => {
    switch (activeSoundAlert.soundType) {
      case 'fire_alarm':
        return <Flame className="w-8 h-8 text-red-500 animate-bounce" />;
      case 'siren':
        return <Siren className="w-8 h-8 text-amber-400 animate-spin" />;
      case 'doorbell':
        return <BellRing className="w-8 h-8 text-blue-400 animate-pulse" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-400 animate-bounce" />;
    }
  };

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in slide-in-from-bottom duration-300"
    >
      <div className="bg-slate-950 text-white border-2 border-red-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4 relative overflow-hidden">
        {/* Visual flashing border indicator for Deaf/Hard-of-Hearing users */}
        <div className="absolute inset-0 border-4 border-red-500 opacity-60 animate-ping pointer-events-none rounded-2xl" />

        <div className="bg-red-950/80 p-3 rounded-xl border border-red-600/50 shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-black uppercase px-2 py-0.5 rounded tracking-wider">
              Hearing Sound Alert
            </span>
            <span className="text-xs text-red-300 font-semibold">Sound Detected</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">
            {activeSoundAlert.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Visual sound alert active for hearing assistance. Check your physical environment or safety exits.
          </p>
        </div>

        <button
          onClick={clearSoundAlert}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer self-start"
          aria-label="Dismiss sound alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
