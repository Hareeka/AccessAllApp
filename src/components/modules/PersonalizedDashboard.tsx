import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Pill, 
  Eye, 
  Ear, 
  Mic, 
  MapPin, 
  HeartHandshake, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Volume2
} from 'lucide-react';

interface Props {
  onNavigateTab: (tabId: string) => void;
  onOpenAiAssistant: () => void;
}

export const PersonalizedDashboard: React.FC<Props> = ({ onNavigateTab, onOpenAiAssistant }) => {
  const { 
    userProfile, 
    disabilityType, 
    medications, 
    toggleMedicationDose, 
    appointments, 
    speakText, 
    preferences 
  } = useAccessibility();

  // Focus Timer state (for Cognitive & ADHD accessibility)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(t => t - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      speakText('Focus timer complete! Time for a short relaxing break.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const pendingMedications = medications.filter(m => m.takenToday.some(t => !t));
  const completedMedsCount = medications.filter(m => m.takenToday.every(Boolean)).length;
  const adherenceRate = medications.length > 0 ? Math.round((completedMedsCount / medications.length) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome & Profile Adaptation Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Smart Adapted Profile: <strong className="capitalize text-white">{disabilityType}</strong> Assistance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {userProfile.name}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            {preferences.simplifiedUI 
              ? 'Here is your simple daily summary. All your important tasks are right below.' 
              : 'Your centralized assistive dashboard is active with synchronized medications, real-time sensory bridging, and personalized AI support.'
            }
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onOpenAiAssistant()}
              className="bg-white text-indigo-900 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Companion</span>
            </button>
            <button
              onClick={() => speakText(`Hello ${userProfile.name}. You have ${pendingMedications.length} pending medication doses today and your next appointment is on ${appointments[0]?.date || 'next week'}.`)}
              className="bg-indigo-800/80 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm border border-indigo-500/40 transition flex items-center gap-2 cursor-pointer"
              title="Read daily brief aloud"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Daily Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Assistive Quick Launch Grid (Dynamic based on disability type) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Primary Assistive Tools</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">
              Adapted for {disabilityType}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tool 1: Vision AI */}
          <div 
            onClick={() => onNavigateTab('vision')}
            className={`p-5 rounded-2xl border transition cursor-pointer group ${
              disabilityType === 'visual' || disabilityType === 'multiple' 
                ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/30 shadow-md' 
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition shadow-sm">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition">
              Vision AI & OCR
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              Read books, recognize currency notes, identify colors, and detect obstacles aloud.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition gap-1">
              <span>Open Vision Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 2: Hearing AI */}
          <div 
            onClick={() => onNavigateTab('hearing')}
            className={`p-5 rounded-2xl border transition cursor-pointer group ${
              disabilityType === 'hearing' 
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/30 shadow-md' 
                : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition shadow-sm">
              <Ear className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition">
              Hearing & Captions
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              Live speech-to-text captions, ambient sound detector (fire/doorbell), and ASL dictionary.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition gap-1">
              <span>Open Captions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 3: Speech & AAC */}
          <div 
            onClick={() => onNavigateTab('speech')}
            className={`p-5 rounded-2xl border transition cursor-pointer group ${
              disabilityType === 'speech' 
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/30 shadow-md' 
                : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition shadow-sm">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition">
              Speech & AAC Cards
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              Visual communication cards, phrase synthesizer, and audible voice for non-verbal users.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition gap-1">
              <span>Open AAC Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 4: Accessibility Map */}
          <div 
            onClick={() => onNavigateTab('map')}
            className={`p-5 rounded-2xl border transition cursor-pointer group ${
              disabilityType === 'mobility' 
                ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/30 shadow-md' 
                : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-700 transition">
              Accessible Routes
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              Find verified wheelchair ramps, elevators, accessible restrooms, and report transit barriers.
            </p>
            <div className="mt-3 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition gap-1">
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Two Column Layout: Daily Health / Meds & Cognitive Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Medication Schedule & Adherence (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Today's Medication Schedule
                </h3>
                <p className="text-xs text-slate-500">Adherence monitoring: {adherenceRate}% taken today</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('health')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {medications.map((med) => {
              const isAllTaken = med.takenToday.every(Boolean);
              return (
                <div 
                  key={med.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAllTaken ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{med.name}</span>
                      <span className="text-xs bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {med.frequency} • {med.purpose}
                    </p>
                    {med.pillCount <= med.refillThreshold && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        Refill needed soon ({med.pillCount} doses remaining)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {med.times.map((t, idx) => {
                      const taken = med.takenToday[idx];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleMedicationDose(med.id, idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            taken 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-300'
                          }`}
                          aria-label={`Mark ${med.name} at ${t} as ${taken ? 'not taken' : 'taken'}`}
                        >
                          {taken ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          <span>{t} {taken ? 'Taken' : 'Take'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upcoming Appointment Teaser */}
          {appointments.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Next Appointment: <strong>{appointments[0].doctorName}</strong> on {appointments[0].date} ({appointments[0].time})
              </span>
              <button 
                onClick={() => onNavigateTab('health')}
                className="text-indigo-600 font-bold hover:underline"
              >
                View
              </button>
            </div>
          )}
        </div>

        {/* Cognitive & Focus Routine Assistant (1 Column) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Accessible Focus Timer
                </h3>
                <p className="text-xs text-slate-500">Cognitive pacing & sensory rest interval</p>
              </div>
            </div>

            {/* Big readable timer */}
            <div className="text-center py-6">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 font-mono">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isTimerRunning ? 'Active focus block in progress' : 'Ready to start 25-minute calm session'}
              </p>

              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition cursor-pointer ${
                    isTimerRunning 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(25 * 60);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Caregiver Connection Status */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Caregiver Linked: {userProfile.caregiverName || 'Sarah Morgan'}</span>
            </div>
            <p className="text-indigo-800/80 leading-relaxed">
              Your medication adherence and emergency alerts are actively synced to your caregiver's dashboard.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
