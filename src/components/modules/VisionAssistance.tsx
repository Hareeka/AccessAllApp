import React, { useState, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Eye, 
  Camera, 
  Upload, 
  FileText, 
  Banknote, 
  Palette, 
  Box, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const VisionAssistance: React.FC = () => {
  const { speakText, stopSpeaking, isSpeaking, preferences } = useAccessibility();

  const [activeTask, setActiveTask] = useState<'ocr' | 'currency' | 'object' | 'color' | 'all'>('ocr');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Preset sample images for quick testing
  const sampleScenarios = [
    {
      id: 'sample_rx',
      name: 'Prescription Label (OCR)',
      task: 'ocr' as const,
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f8fafc"/><rect x="20" y="20" width="260" height="160" rx="10" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="35" y="55" font-family="sans-serif" font-weight="bold" font-size="16" fill="%230f172a">METRO PHARMACY RX# 994821</text><text x="35" y="85" font-family="sans-serif" font-size="14" fill="%23334155">Take 1 tablet daily with food.</text><text x="35" y="115" font-family="sans-serif" font-size="13" fill="%2364748b">Lisinopril 10mg - Dr. E. Vance</text><text x="35" y="145" font-family="sans-serif" font-weight="bold" font-size="12" fill="%23dc2626">WARNING: May cause mild dizziness.</text></svg>',
    },
    {
      id: 'sample_bill',
      name: '$20 US Currency Bill',
      task: 'currency' as const,
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f1f5f9"/><rect x="20" y="30" width="260" height="140" rx="8" fill="%23dcfce7" stroke="%2316a34a" stroke-width="3"/><text x="40" y="80" font-family="serif" font-weight="bold" font-size="28" fill="%2314532d">$20</text><text x="40" y="115" font-family="sans-serif" font-weight="bold" font-size="14" fill="%23166534">FEDERAL RESERVE NOTE</text><text x="40" y="145" font-family="sans-serif" font-size="12" fill="%2315803d">TWENTY DOLLARS - SERIES 2021</text><circle cx="230" cy="100" r="30" fill="%23bbf7d0" stroke="%2315803d"/></svg>',
    },
    {
      id: 'sample_room',
      name: 'Living Room Path (Objects & Nav)',
      task: 'object' as const,
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23e2e8f0"/><rect x="40" y="80" width="80" height="90" rx="8" fill="%2364748b"/><text x="50" y="130" font-size="12" fill="white">Armchair</text><rect x="180" y="110" width="70" height="60" rx="6" fill="%2394a3b8"/><text x="190" y="145" font-size="12" fill="white">Coffee Table</text><line x1="140" y1="180" x2="140" y2="40" stroke="%233b82f6" stroke-width="4" stroke-dasharray="6"/><text x="110" y="30" font-weight="bold" font-size="12" fill="%231e3a8a">Clear Walking Path</text></svg>',
    },
    {
      id: 'sample_color',
      name: 'Clothing Garment (Color Check)',
      task: 'color' as const,
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f8fafc"/><rect x="40" y="30" width="100" height="140" rx="10" fill="%231e3a8a"/><text x="55" y="105" font-size="13" font-weight="bold" fill="white">Navy Blue</text><rect x="160" y="30" width="100" height="140" rx="10" fill="%23f59e0b"/><text x="175" y="105" font-size="13" font-weight="bold" fill="white">Warm Ochre</text></svg>',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultText(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable', err);
      alert('Camera access is not permitted or device has no camera. You can still test with image upload or the test samples below!');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(dataUrl);
      stopCamera();
      setResultText(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setResultText(null);

    try {
      const res = await fetch('/api/ai/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          task: activeTask,
        }),
      });

      const data = await res.json();
      const output = data.result || 'No visual description available.';
      setResultText(output);

      // Auto read aloud if preference enabled or in vision mode
      if (preferences.autoReadAloud || true) {
        speakText(output);
      }
    } catch (err: any) {
      console.error(err);
      setResultText('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Eye className="w-8 h-8 text-blue-600" />
              Vision AI & Environmental Reader
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Multimodal
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Optical Character Recognition (OCR), Currency identification, Obstacle and Object detection, and Color identification for visually impaired users.
          </p>
        </div>

        {/* Task Selection Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          {[
            { id: 'ocr', label: 'OCR & Documents', icon: FileText },
            { id: 'currency', label: 'Currency', icon: Banknote },
            { id: 'object', label: 'Objects & Scene', icon: Box },
            { id: 'color', label: 'Color Detection', icon: Palette },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTask === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTask(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  isSelected ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={isSelected}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera / Capture & Upload View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Source (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Visual Input Feed
            </h2>
            <div className="flex gap-2">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Stop Camera
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-300 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Active Viewport */}
          <div className="aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden relative flex items-center justify-center border-2 border-dashed border-slate-300">
            {cameraActive ? (
              <div className="w-full h-full relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full shadow-lg flex items-center gap-2 animate-pulse cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </button>
              </div>
            ) : selectedImage ? (
              <div className="w-full h-full relative group">
                <img
                  src={selectedImage}
                  alt="Captured input for visual AI processing"
                  className="w-full h-full object-contain bg-slate-950"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md">
                  Image Ready
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-300">No Image Selected</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Start your camera, upload an image from your device, or click one of the quick test scenarios below.
                </p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Task: <strong className="capitalize text-slate-800">{activeTask} Recognition</strong>
            </span>
            <button
              onClick={analyzeImage}
              disabled={!selectedImage || analyzing}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{analyzing ? 'Analyzing with Gemini...' : 'Analyze & Read Aloud'}</span>
            </button>
          </div>

          {/* Quick Preset Samples */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Or Try A Preset Assistive Sample:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sampleScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedImage(s.preview);
                    setActiveTask(s.task);
                    setResultText(null);
                  }}
                  className="p-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition cursor-pointer group"
                >
                  <div className="aspect-4/3 rounded-lg overflow-hidden mb-1.5 bg-slate-100 border border-slate-200">
                    <img src={s.preview} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-blue-700">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Accessible Analysis & Readout Result (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
                <h2 className="font-bold text-slate-900 text-base">
                  Accessible Readout
                </h2>
              </div>

              {resultText && (
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : speakText(resultText)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                </button>
              )}
            </div>

            {/* Content Display */}
            <div className="mt-4 min-h-[260px] p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm leading-relaxed overflow-y-auto max-h-[420px]">
              {analyzing ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="font-medium text-xs">Processing image through Vision AI neural model...</p>
                </div>
              ) : resultText ? (
                <div className="text-slate-900 space-y-2 whitespace-pre-wrap font-accessible">
                  {resultText}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-semibold text-slate-500">Awaiting visual input</p>
                  <p className="text-[11px] text-slate-400">
                    Results will automatically be spoken aloud and formatted in high-contrast text.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Accessibility Guidance Tip */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 space-y-1">
            <span className="font-bold block flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              Vision Tip for Low Vision Users
            </span>
            <p className="text-blue-800/80 leading-relaxed">
              Hold camera approximately 8 to 12 inches away from medication labels or currency notes with adequate lighting for optimal accuracy.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
