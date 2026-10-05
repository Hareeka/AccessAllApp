import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { DisabilityType, UserRole, TextSize, ContrastMode } from '../types';
import { 
  X, 
  Settings, 
  User, 
  Sliders, 
  Heart, 
  Phone, 
  Volume2, 
  Eye, 
  Check, 
  Save 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    userProfile, 
    updateUserProfile, 
    preferences, 
    updatePreferences, 
    speakText 
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'medical' | 'contacts'>('accessibility');

  // Form states
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [disabilityType, setDisabilityType] = useState<DisabilityType>(userProfile.disabilityType);
  const [disabilityDetails, setDisabilityDetails] = useState(userProfile.disabilityDetails);
  
  const [textSize, setTextSize] = useState<TextSize>(preferences.textSize);
  const [contrastMode, setContrastMode] = useState<ContrastMode>(preferences.contrastMode);
  const [simplifiedUI, setSimplifiedUI] = useState(preferences.simplifiedUI);
  const [dyslexicFont, setDyslexicFont] = useState(preferences.dyslexicFont);
  const [screenReaderHints, setScreenReaderHints] = useState(preferences.screenReaderHints);
  const [autoReadAloud, setAutoReadAloud] = useState(preferences.autoReadAloud);
  const [voiceSpeed, setVoiceSpeed] = useState(preferences.voiceSpeed);

  // Medical info
  const [bloodType, setBloodType] = useState(userProfile.medicalInfo.bloodType);
  const [primaryCondition, setPrimaryCondition] = useState(userProfile.medicalInfo.primaryCondition);
  const [allergiesText, setAllergiesText] = useState(userProfile.medicalInfo.allergies.join(', '));
  const [specialInstructions, setSpecialInstructions] = useState(userProfile.medicalInfo.specialInstructions);
  const [physicianName, setPhysicianName] = useState(userProfile.medicalInfo.physicianName);
  const [physicianPhone, setPhysicianPhone] = useState(userProfile.medicalInfo.physicianPhone);

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    updatePreferences({
      textSize,
      contrastMode,
      simplifiedUI,
      dyslexicFont,
      screenReaderHints,
      autoReadAloud,
      voiceSpeed,
    });

    updateUserProfile({
      name,
      email,
      phone,
      disabilityType,
      disabilityDetails,
      medicalInfo: {
        ...userProfile.medicalInfo,
        bloodType,
        primaryCondition,
        allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
        specialInstructions,
        physicianName,
        physicianPhone,
      },
    });

    setSavedSuccess(true);
    speakText('Accessibility preferences and profile updated successfully.');
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const testVoice = () => {
    speakText(`This is a voice preview speaking at speed ${voiceSpeed.toFixed(1)}.`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-xl font-bold text-slate-900">
                Accessibility & Profile Settings
              </h2>
              <p className="text-xs text-slate-500">Configure interface adaptations, voice rates, and emergency records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition"
            aria-label="Close settings dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-2 mt-4 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`pb-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'accessibility' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            Accessibility & UI
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Disability Profile
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`pb-3 px-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'medical' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            Medical ID Card
          </button>
        </div>

        {/* Tab 1: Accessibility & Display */}
        {activeTab === 'accessibility' && (
          <div className="py-5 space-y-5 text-sm">
            {/* Text Size */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Display Text Size</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'normal', label: 'Standard (16px)' },
                  { id: 'large', label: 'Large (18px)' },
                  { id: 'extra-large', label: 'Extra Large (20px)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTextSize(s.id as TextSize)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                      textSize === s.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Mode */}
            <div>
              <label className="block font-bold text-slate-800 mb-2">Visual Contrast Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'standard', label: 'Standard Light' },
                  { id: 'high-contrast', label: 'High Contrast (Yellow/Black)' },
                  { id: 'dark', label: 'Calm Dark Mode' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setContrastMode(c.id as ContrastMode)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-semibold transition cursor-pointer ${
                      contrastMode === c.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dyslexicFont}
                  onChange={(e) => setDyslexicFont(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold block text-slate-900">Dyslexia-Friendly Font</span>
                  <span className="text-xs text-slate-500">Enhanced character spacing for readability</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simplifiedUI}
                  onChange={(e) => setSimplifiedUI(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold block text-slate-900">Simplified Cognitive Mode</span>
                  <span className="text-xs text-slate-500">Reduces clutter and prioritizes key tasks</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={screenReaderHints}
                  onChange={(e) => setScreenReaderHints(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold block text-slate-900">Screen Reader ARIA Hints</span>
                  <span className="text-xs text-slate-500">Explicit vocal feedback for interactive controls</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoReadAloud}
                  onChange={(e) => setAutoReadAloud(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold block text-slate-900">Auto Read Aloud Results</span>
                  <span className="text-xs text-slate-500">Automatically speaks OCR and AI output</span>
                </div>
              </label>
            </div>

            {/* Voice Speed Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-800">Text-to-Speech Speed ({voiceSpeed.toFixed(1)}x)</label>
                <button
                  type="button"
                  onClick={testVoice}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Test Voice
                </button>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.7x (Slower)</span>
                <span>1.0x (Standard)</span>
                <span>1.5x (Faster)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Disability Profile */}
        {activeTab === 'profile' && (
          <div className="py-5 space-y-4 text-sm">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Primary Disability Focus</label>
              <select
                value={disabilityType}
                onChange={(e) => setDisabilityType(e.target.value as DisabilityType)}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
              >
                <option value="visual">Visual Disability (Blindness, Low Vision, Color Blindness)</option>
                <option value="hearing">Hearing Disability (Deaf, Hard of Hearing)</option>
                <option value="speech">Speech Disability (Non-verbal, Dysarthria, AAC)</option>
                <option value="mobility">Mobility Disability (Wheelchair, Motor, Tremor)</option>
                <option value="cognitive">Cognitive & Learning (Dyslexia, ADHD, Autism, Memory)</option>
                <option value="multiple">Multiple Disabilities</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Personal Notes & Accommodations</label>
              <textarea
                rows={3}
                value={disabilityDetails}
                onChange={(e) => setDisabilityDetails(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                placeholder="Specific accessibility cues (e.g. prefers high contrast, prefers audio announcements)..."
              />
            </div>
          </div>
        )}

        {/* Tab 3: Medical Emergency Card */}
        {activeTab === 'medical' && (
          <div className="py-5 space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Blood Type</label>
                <input
                  type="text"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                  placeholder="e.g. O Positive"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Primary Medical Condition</label>
                <input
                  type="text"
                  value={primaryCondition}
                  onChange={(e) => setPrimaryCondition(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                  placeholder="e.g. Glaucoma, Epilepsy, Neuropathy"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Known Allergies (comma separated)</label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                placeholder="e.g. Penicillin, Latex, Peanuts"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Primary Physician</label>
                <input
                  type="text"
                  value={physicianName}
                  onChange={(e) => setPhysicianName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Physician Phone</label>
                <input
                  type="text"
                  value={physicianPhone}
                  onChange={(e) => setPhysicianPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Emergency Instructions for Responders</label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                placeholder="Clear instructions when patient is in distress..."
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {savedSuccess ? 'Preferences saved to browser storage!' : 'Changes apply immediately across all modules.'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-save-settings"
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
