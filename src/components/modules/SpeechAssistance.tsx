import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { AACCard } from '../../types';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Plus, 
  Send, 
  Trash2, 
  Sparkles, 
  Layers, 
  Activity, 
  Droplets, 
  Utensils, 
  Heart, 
  Clock, 
  AlertTriangle, 
  PhoneCall, 
  Accessibility, 
  CheckCircle, 
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';

export const SpeechAssistance: React.FC = () => {
  const { aacCardsList, addAacCard, speakText, stopSpeaking, isSpeaking, preferences } = useAccessibility();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  
  // Custom Card Creator
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState<AACCard['category']>('needs');

  // Map icon strings to Lucide components
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Droplets': return <Droplets className="w-6 h-6" />;
      case 'Utensils': return <Utensils className="w-6 h-6" />;
      case 'Accessibility': return <Accessibility className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'PhoneCall': return <PhoneCall className="w-6 h-6" />;
      case 'CheckCircle': return <CheckCircle className="w-6 h-6" />;
      case 'XCircle': return <XCircle className="w-6 h-6" />;
      case 'Clock': return <Clock className="w-6 h-6" />;
      case 'Heart': return <Heart className="w-6 h-6" />;
      case 'Volume2': return <Volume2 className="w-6 h-6" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Cards' },
    { id: 'needs', label: 'Basic Needs' },
    { id: 'food', label: 'Food & Drink' },
    { id: 'feelings', label: 'Feelings' },
    { id: 'pain', label: 'Pain & Health' },
    { id: 'social', label: 'Social & Polite' },
    { id: 'emergency', label: 'Emergency' },
  ];

  const filteredCards = activeCategory === 'all' 
    ? aacCardsList 
    : aacCardsList.filter(c => c.category === activeCategory);

  const handleCardClick = (card: AACCard) => {
    // Speak single card
    speakText(card.phrase);
    // Add to sentence constructor
    setConstructedSentence(prev => [...prev, card.label]);
  };

  const speakConstructedSentence = () => {
    if (constructedSentence.length === 0) return;
    const fullSpeech = constructedSentence.join('. ') + '.';
    speakText(fullSpeech);
  };

  const handleSpeakCustom = () => {
    if (!customText.trim()) return;
    speakText(customText);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    addAacCard({
      label: newLabel,
      phrase: newPhrase || newLabel,
      category: newCategory,
      icon: 'Sparkles',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    });

    setNewLabel('');
    setNewPhrase('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Mic className="w-8 h-8 text-emerald-600" />
              Speech Assistance & Visual AAC Board
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Voice Synthesis
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Augmentative and Alternative Communication (AAC) cards, instant voice synthesis, and sentence construction for non-verbal and speech-impaired individuals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Card</span>
        </button>
      </div>

      {/* Sentence Constructor Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Active Message Builder (Tap cards to append)
          </span>
          {constructedSentence.length > 0 && (
            <button
              onClick={() => setConstructedSentence([])}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="min-h-[56px] p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-2">
          {constructedSentence.length > 0 ? (
            constructedSentence.map((word, idx) => (
              <span 
                key={idx}
                className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-1.5 rounded-xl text-sm sm:text-base font-bold flex items-center gap-1.5 animate-in zoom-in-90"
              >
                <span>{word}</span>
                <button
                  onClick={() => setConstructedSentence(prev => prev.filter((_, i) => i !== idx))}
                  className="hover:text-red-400 ml-1 text-xs"
                  aria-label="Remove word"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-sm italic">
              Tap any communication card below to build your phrase...
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {constructedSentence.length} card(s) selected
          </span>
          <button
            onClick={speakConstructedSentence}
            disabled={constructedSentence.length === 0}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black rounded-xl text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak Message Aloud</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
              activeCategory === c.id 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* AAC Card Grid (Big Tactile Touch Targets for Motor Accessibility) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`p-4 rounded-2xl border-2 text-center transition cursor-pointer flex flex-col items-center justify-between h-36 sm:h-40 hover:scale-102 active:scale-98 shadow-xs ${card.color}`}
            aria-label={`Say: ${card.label}`}
          >
            <div className="p-2.5 rounded-2xl bg-white/70 shadow-xs mb-2">
              {renderIcon(card.icon)}
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-extrabold text-sm sm:text-base leading-tight block">
                {card.label}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] opacity-75 font-semibold mt-1">
              <Volume2 className="w-3 h-3" />
              <span>Tap to Speak</span>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Text-to-Speech Synthesizer Input */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-600" />
          Quick Speech Synthesizer (Type Anything)
        </h3>
        <p className="text-xs text-slate-500">
          For non-verbal communication in stores, clinics, or social settings.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSpeakCustom()}
            placeholder="Type anything here to speak with clear synthetic voice..."
            className="flex-1 p-3.5 border border-slate-300 rounded-xl font-medium text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
          <button
            onClick={handleSpeakCustom}
            disabled={!customText.trim()}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak</span>
          </button>
        </div>
      </div>

      {/* Modal for adding custom card */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Custom AAC Card</h3>
            <form onSubmit={handleCreateCard} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turn down lights"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Spoken Sentence</label>
                <input
                  type="text"
                  placeholder="e.g. Could you please turn down the bright lights?"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="needs">Basic Needs</option>
                  <option value="feelings">Feelings</option>
                  <option value="pain">Pain & Health</option>
                  <option value="social">Social</option>
                  <option value="food">Food</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
