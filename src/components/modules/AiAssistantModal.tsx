import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Check, 
  RefreshCw,
  HelpCircle,
  Clock,
  Heart
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    disabilityType, 
    userProfile, 
    preferences, 
    speakText, 
    stopSpeaking, 
    isSpeaking,
    medications 
  } = useAccessibility();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello ${userProfile.name}! I am AccessAll AI, your personal companion. I can help organize your day, explain things in simple terms, remind you about your medication (${medications.filter(m => !m.takenToday[0]).length} doses pending), or guide you through any assistive feature. How can I support you right now?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(preferences.simplifiedUI);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech API speech-to-text
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-text is not supported by your current browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          disabilityType: disabilityType,
          simplifiedMode: simplifiedMode,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I am here to assist you. Could you please specify how I can help?";

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If user has auto read aloud enabled, speak it
      if (preferences.autoReadAloud) {
        speakText(replyText);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: "I am having trouble connecting to the network right now, but remember you can always access your offline medication schedule, emergency SOS, and visual AAC cards right away.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickPrompts = [
    "What medications do I need to take today?",
    "Give me positive words of encouragement",
    "Explain my medical appointment in simple words",
    "How do I use the Vision OCR tool?",
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[700px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-assistant-title" className="font-bold text-base sm:text-lg">
                  AccessAll AI Assistant
                </h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-semibold px-2 py-0.5 rounded-full">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Personal companion adapted for {disabilityType} disability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimplifiedMode(!simplifiedMode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                simplifiedMode ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Toggle Simplified Language Mode"
            >
              Simple: {simplifiedMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    AI
                  </div>
                )}
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-sm sm:text-base leading-relaxed ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  
                  <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isUser ? 'border-indigo-500/50 text-indigo-200' : 'border-slate-100 text-slate-400'} text-[11px]`}>
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="flex items-center gap-1 font-semibold hover:text-indigo-600 transition cursor-pointer"
                        title="Read message aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-sm italic py-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <span>AccessAll AI is formulating an accessible response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition border border-slate-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl transition cursor-pointer ${
              isListening 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Voice input (Speech to Text)"
            aria-label={isListening ? 'Stop listening' : 'Start voice dictation'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isListening ? 'Listening to speech...' : 'Type or speak a question for AI companion...'}
            className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
