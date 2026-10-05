import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { signLanguageDictionary } from '../../data/mockData';
import { SignLanguageCard } from '../../types';
import { 
  Ear, 
  Mic, 
  MicOff, 
  BellRing, 
  Flame, 
  Siren, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Check, 
  RefreshCw,
  HandMetal,
  HelpCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';

export const HearingAssistance: React.FC = () => {
  const { triggerSoundAlert } = useAccessibility();

  const [isLiveCaptioning, setIsLiveCaptioning] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'captions' | 'sound_alerts' | 'asl_learning'>('captions');
  
  // ASL dictionary state
  const [selectedAsl, setSelectedAsl] = useState<SignLanguageCard>(signLanguageDictionary[0]);
  const [aslCategory, setAslCategory] = useState<string>('all');
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Setup Web Speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript.trim();
            if (finalTranscript) {
              setLiveTranscript(prev => [...prev, `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${finalTranscript}`]);
            }
          } else {
            currentText += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveTranscript]);

  const toggleCaptions = () => {
    if (!recognitionRef.current) {
      alert('Live speech recognition is not supported natively by this browser. You can still test ambient sound alerts and ASL learning!');
      return;
    }

    if (isLiveCaptioning) {
      recognitionRef.current.stop();
      setIsLiveCaptioning(false);
    } else {
      setLiveTranscript(prev => [...prev, '--- Started Live Speech-to-Text Session ---']);
      recognitionRef.current.start();
      setIsLiveCaptioning(true);
    }
  };

  const clearTranscript = () => {
    setLiveTranscript([]);
  };

  // Sound Alert Simulation
  const ambientSounds = [
    { title: 'Emergency Fire Alarm Sounding', type: 'fire_alarm', desc: 'Loud high-frequency continuous siren detected nearby', severity: 'high' as const },
    { title: 'Front Entrance Doorbell Chime', type: 'doorbell', desc: 'Two-tone visitor chime detected at primary door', severity: 'medium' as const },
    { title: 'Emergency Vehicle Siren Approaching', type: 'siren', desc: 'Rapid wail/yelp acoustic signature detected outside', severity: 'high' as const },
    { title: 'Loud Door Knocking', type: 'knocking', desc: 'Repeated physical impact detected on entry door', severity: 'medium' as const },
  ];

  const filteredAsl = aslCategory === 'all' 
    ? signLanguageDictionary 
    : signLanguageDictionary.filter(c => c.category === aslCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Ear className="w-8 h-8 text-amber-600" />
              Hearing Assistance & Live Captions
            </h1>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
              Voice AI & Vision
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Real-time speech-to-text captions, visual ambient alert detection, and American Sign Language (ASL) learning hub.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('captions')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'captions' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Speech Captions
          </button>
          <button
            onClick={() => setActiveTab('sound_alerts')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'sound_alerts' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visual Sound Alerts
          </button>
          <button
            onClick={() => setActiveTab('asl_learning')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'asl_learning' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Language (ASL)
          </button>
        </div>
      </div>

      {/* 1. Live Captions Tab */}
      {activeTab === 'captions' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                isLiveCaptioning ? 'bg-red-600 animate-pulse' : 'bg-amber-600'
              }`}>
                {isLiveCaptioning ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Real-Time Speech-to-Text Stream</span>
                  {isLiveCaptioning && (
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      Listening
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500">
                  Transcribes conversation, lectures, and meetings instantly into high-legibility text.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearTranscript}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Clear Log
              </button>
              <button
                onClick={toggleCaptions}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition cursor-pointer ${
                  isLiveCaptioning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isLiveCaptioning ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isLiveCaptioning ? 'Stop Captions' : 'Start Live Captions'}</span>
              </button>
            </div>
          </div>

          {/* Transcript Display Box */}
          <div className="min-h-[300px] max-h-[460px] overflow-y-auto p-5 rounded-2xl bg-slate-950 text-white font-mono text-base sm:text-lg leading-relaxed space-y-3 border-2 border-slate-800">
            {liveTranscript.length > 0 ? (
              liveTranscript.map((line, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-amber-200">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500 space-y-2 font-sans">
                <Mic className="w-10 h-10 mx-auto opacity-30 text-amber-400" />
                <p className="font-semibold text-sm">Microphone is inactive</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "Start Live Captions" above. Any spoken words nearby will be automatically transcribed here in large, high-contrast text.
                </p>
              </div>
            )}
            <div ref={transcriptBottomRef} />
          </div>

          {/* Preset Test Utterances */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Simulator: Click to simulate incoming speech for testing:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Doctor: Your prescription is ready, take one tablet before bed.",
                "Colleague: The team standup is beginning in conference room 3.",
                "Transit Announcement: Train 402 arriving on platform two.",
                "Teacher: Please turn to chapter four for our group discussion.",
              ].map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => setLiveTranscript(prev => [...prev, `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ${phrase}`])}
                  className="text-xs bg-white hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg transition"
                >
                  "{phrase.split(':')[0]}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Visual Sound Alerts Tab */}
      {activeTab === 'sound_alerts' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Ambient Environmental Sound Detector
            </h2>
            <p className="text-xs text-slate-500">
              Converts loud physical acoustic alarms into high-visibility screen flashes, haptic vibration, and visual banners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ambientSounds.map((snd, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                      snd.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {snd.severity} Priority
                    </span>
                    {snd.type === 'fire_alarm' ? (
                      <Flame className="w-5 h-5 text-red-600" />
                    ) : snd.type === 'doorbell' ? (
                      <BellRing className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Siren className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{snd.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{snd.desc}</p>
                </div>

                <button
                  onClick={() => triggerSoundAlert(snd.title, snd.type, snd.severity)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-amber-600 hover:text-white border border-slate-300 font-bold text-xs text-slate-800 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Sound Detection</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sign Language (ASL) Learning Tab */}
      {activeTab === 'asl_learning' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HandMetal className="w-5 h-5 text-amber-600" />
                Sign Language Learning Support (ASL)
              </h2>
              <p className="text-xs text-slate-500">
                Interactive sign vocabulary, anatomical hand positioning, and retention practice.
              </p>
            </div>

            {/* Category filter */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['all', 'greetings', 'emergency', 'daily'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAslCategory(cat)}
                  className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                    aslCategory === cat ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Word Cards List (5 cols) */}
            <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredAsl.map((sign) => {
                const isSelected = selectedAsl.id === sign.id;
                return (
                  <button
                    key={sign.id}
                    onClick={() => setSelectedAsl(sign)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{sign.word}</span>
                      <span className="text-xs text-slate-500 capitalize">{sign.category} Sign</span>
                    </div>
                    <span className="text-xs text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded-md">
                      View Sign
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Sign Demonstration Panel (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
                    ASL Instruction
                  </span>
                  <span className="text-xs text-slate-500">Sign #{selectedAsl.id}</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Sign for "{selectedAsl.word}"
                </h3>

                {/* Illustrated representation placeholder */}
                <div className="my-4 aspect-16/9 rounded-xl bg-amber-100/60 border border-amber-200 flex flex-col items-center justify-center p-6 text-center text-amber-900">
                  <HandMetal className="w-16 h-16 text-amber-600 mb-2" />
                  <p className="font-bold text-sm max-w-sm">{selectedAsl.description}</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
                  <strong className="block text-slate-900 font-bold">Step-by-Step Movement:</strong>
                  <p className="leading-relaxed">{selectedAsl.instruction}</p>
                </div>
              </div>

              {/* Quick Self-Check Quiz */}
              <div className="pt-3 border-t border-amber-200/60">
                <p className="text-xs font-bold text-slate-700 mb-2">Practice Check: Did you replicate the sign?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuizScore((quizScore || 0) + 1)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mastered It! (+1 Score)</span>
                  </button>
                  {quizScore !== null && (
                    <span className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-emerald-800">
                      Mastered: {quizScore}
                    </span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
