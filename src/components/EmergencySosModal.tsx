import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  X, 
  Heart, 
  AlertOctagon, 
  User, 
  PhoneCall 
} from 'lucide-react';

export const EmergencySosModal: React.FC = () => {
  const { 
    isSosActive, 
    cancelSos, 
    userProfile, 
    sosLocation, 
    sosAlertDispatched,
    speakText 
  } = useAccessibility();

  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isSosActive, countdown]);

  if (!isSosActive) return null;

  const toggleSiren = () => {
    setSirenPlaying(!sirenPlaying);
    if (!sirenPlaying) {
      speakText('Attention! Emergency assistance required for this individual immediately!');
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md overflow-y-auto ${
        strobeActive ? 'animate-pulse' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-red-600 text-slate-900 my-8">
        
        {/* Header with High-Contrast Alert Banner */}
        <div className="flex items-start justify-between gap-4 border-b border-red-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-red-600 uppercase bg-red-100 px-2.5 py-0.5 rounded-full">
                EMERGENCY SOS ACTIVE
              </span>
              <h2 id="sos-modal-title" className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Help Signal Triggered
              </h2>
            </div>
          </div>

          <button
            id="btn-cancel-sos"
            onClick={cancelSos}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5"
            aria-label="Cancel Emergency SOS"
          >
            <X className="w-4 h-4" />
            <span>Cancel SOS</span>
          </button>
        </div>

        {/* GPS Location Card */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Live GPS Location Sharing</span>
            <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Transmitted
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-1.5">
            {sosLocation?.address || 'Detecting exact GPS coordinates via satellite...'}
          </p>
          {sosLocation && (
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Coordinates: {sosLocation.lat.toFixed(6)}, {sosLocation.lng.toFixed(6)}
            </p>
          )}
        </div>

        {/* Emergency Contacts Alert Status */}
        <div className="mt-5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-600" />
            Emergency Contacts Notified:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {userProfile.emergencyContacts.map((contact) => (
              <div 
                key={contact.id}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.relationship} • {contact.phone}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Sent
                  </span>
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                    title={`Call ${contact.name}`}
                    aria-label={`Direct Call ${contact.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Medical ID Card for Responders */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black flex items-center gap-1.5 text-amber-900">
              <Heart className="w-4 h-4 text-red-600" />
              Medical Emergency Card (For First Responders)
            </h3>
            <span className="text-xs font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
              Blood: {userProfile.medicalInfo.bloodType}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-xs">
            <div>
              <span className="text-slate-500 block font-semibold">Primary Condition:</span>
              <span className="font-bold text-slate-900">{userProfile.medicalInfo.primaryCondition}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Known Allergies:</span>
              <span className="font-bold text-red-700">{userProfile.medicalInfo.allergies.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Physician Contact:</span>
              <span className="font-bold text-slate-900">{userProfile.medicalInfo.physicianName}</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-amber-200/60 text-xs">
            <span className="font-semibold text-slate-700">Special Responder Note: </span>
            <span className="text-slate-900 font-medium">{userProfile.medicalInfo.specialInstructions}</span>
          </div>
        </div>

        {/* Quick Audible & Visual Siren Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSiren}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                sirenPlaying ? 'bg-amber-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {sirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{sirenPlaying ? 'Mute Audio Alarm' : 'Loud Audio Siren'}</span>
            </button>

            <button
              onClick={() => setStrobeActive(!strobeActive)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                strobeActive ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <span>{strobeActive ? 'Strobe Flasher: ON' : 'Visual Strobe Flasher'}</span>
            </button>
          </div>

          <a
            href="tel:911"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 911 / EMS</span>
          </a>
        </div>

      </div>
    </div>
  );
};
