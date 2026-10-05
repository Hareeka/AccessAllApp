import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  DisabilityType, 
  UserRole, 
  AccessibilityPreferences, 
  Medication, 
  MedicalAppointment, 
  HealthRecord, 
  AACCard, 
  CommunityPost, 
  VolunteerOpportunity,
  EmergencyContact 
} from '../types';
import { 
  initialUserProfile, 
  initialMedications, 
  initialAppointments, 
  initialHealthRecords, 
  aacCards as defaultAacCards, 
  initialCommunityPosts, 
  initialVolunteers 
} from '../data/mockData';

interface AccessibilityContextType {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  disabilityType: DisabilityType;
  setDisabilityType: (type: DisabilityType) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  
  // Audio & Speech
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  
  // Data management
  medications: Medication[];
  toggleMedicationDose: (medId: string, doseIndex: number) => void;
  addMedication: (med: Omit<Medication, 'id' | 'takenToday'>) => void;
  
  appointments: MedicalAppointment[];
  addAppointment: (apt: Omit<MedicalAppointment, 'id'>) => void;
  
  healthRecords: HealthRecord[];
  addHealthRecord: (rec: Omit<HealthRecord, 'id'>) => void;
  
  aacCardsList: AACCard[];
  addAacCard: (card: Omit<AACCard, 'id'>) => void;
  
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'repliesCount' | 'timestamp'>) => void;
  likeCommunityPost: (postId: string) => void;
  
  volunteers: VolunteerOpportunity[];
  addVolunteerRequest: (vol: Omit<VolunteerOpportunity, 'id' | 'status'>) => void;
  
  // Emergency SOS state
  isSosActive: boolean;
  triggerSos: () => void;
  cancelSos: () => void;
  sosLocation: { lat: number; lng: number; address: string } | null;
  sosAlertDispatched: boolean;
  
  // Sound Alerts for Hearing Impaired
  activeSoundAlert: { title: string; soundType: string; severity: 'low' | 'medium' | 'high' } | null;
  triggerSoundAlert: (title: string, soundType: string, severity?: 'low' | 'medium' | 'high') => void;
  clearSoundAlert: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved profile or default
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('accessall_user_profile');
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  const [role, setRoleState] = useState<UserRole>(userProfile.role);
  const [disabilityType, setDisabilityTypeState] = useState<DisabilityType>(userProfile.disabilityType);
  const [preferences, setPreferencesState] = useState<AccessibilityPreferences>(userProfile.preferences);
  
  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      const saved = localStorage.getItem('accessall_medications');
      return saved ? JSON.parse(saved) : initialMedications;
    } catch {
      return initialMedications;
    }
  });

  const [appointments, setAppointments] = useState<MedicalAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('accessall_appointments');
      return saved ? JSON.parse(saved) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    try {
      const saved = localStorage.getItem('accessall_health_records');
      return saved ? JSON.parse(saved) : initialHealthRecords;
    } catch {
      return initialHealthRecords;
    }
  });

  const [aacCardsList, setAacCardsList] = useState<AACCard[]>(() => {
    try {
      const saved = localStorage.getItem('accessall_aac_cards');
      return saved ? JSON.parse(saved) : defaultAacCards;
    } catch {
      return defaultAacCards;
    }
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('accessall_community_posts');
      return saved ? JSON.parse(saved) : initialCommunityPosts;
    } catch {
      return initialCommunityPosts;
    }
  });

  const [volunteers, setVolunteers] = useState<VolunteerOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem('accessall_volunteers');
      return saved ? JSON.parse(saved) : initialVolunteers;
    } catch {
      return initialVolunteers;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);
  const [sosLocation, setSosLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [sosAlertDispatched, setSosAlertDispatched] = useState(false);

  // Hearing sound alerts
  const [activeSoundAlert, setActiveSoundAlert] = useState<{ title: string; soundType: string; severity: 'low' | 'medium' | 'high' } | null>(null);

  // Sync profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accessall_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('accessall_medications', JSON.stringify(medications));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [medications]);

  useEffect(() => {
    try {
      localStorage.setItem('accessall_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('accessall_health_records', JSON.stringify(healthRecords));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [healthRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('accessall_aac_cards', JSON.stringify(aacCardsList));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [aacCardsList]);

  // Apply visual preference classes to html/body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Contrast modes
    root.classList.remove('high-contrast-mode', 'dark', 'warm-mode');
    if (preferences.contrastMode === 'high-contrast') {
      root.classList.add('high-contrast-mode');
    } else if (preferences.contrastMode === 'dark') {
      root.classList.add('dark');
    }

    // Dyslexic font
    if (preferences.dyslexicFont) {
      body.classList.add('font-accessible');
    } else {
      body.classList.remove('font-accessible');
    }

    // Text size
    root.classList.remove('text-size-large', 'text-size-xl');
    if (preferences.textSize === 'large') {
      root.style.fontSize = '18px';
    } else if (preferences.textSize === 'extra-large') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [preferences]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...updates };
      if (updates.role) setRoleState(updates.role);
      if (updates.disabilityType) setDisabilityTypeState(updates.disabilityType);
      if (updates.preferences) setPreferencesState(prevP => ({ ...prevP, ...updates.preferences }));
      return next;
    });
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUserProfile(prev => ({ ...prev, role: newRole }));
  };

  const setDisabilityType = (type: DisabilityType) => {
    setDisabilityTypeState(type);
    setUserProfile(prev => ({ ...prev, disabilityType: type }));
  };

  const updatePreferences = (updates: Partial<AccessibilityPreferences>) => {
    setPreferencesState(prev => {
      const next = { ...prev, ...updates };
      setUserProfile(u => ({ ...u, preferences: next }));
      return next;
    });
  };

  // Web Speech API Text-to-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }
    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = preferences.voiceSpeed || 1.0;
    utterance.pitch = 1.0;
    
    // Choose natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleMedicationDose = (medId: string, doseIndex: number) => {
    setMedications(prev => prev.map(m => {
      if (m.id === medId) {
        const nextTaken = [...m.takenToday];
        nextTaken[doseIndex] = !nextTaken[doseIndex];
        return {
          ...m,
          takenToday: nextTaken,
          lastTaken: nextTaken[doseIndex] ? `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : m.lastTaken,
          pillCount: nextTaken[doseIndex] ? Math.max(0, m.pillCount - 1) : m.pillCount + 1,
        };
      }
      return m;
    }));
  };

  const addMedication = (med: Omit<Medication, 'id' | 'takenToday'>) => {
    const newMed: Medication = {
      ...med,
      id: `med_${Date.now()}`,
      takenToday: med.times.map(() => false),
    };
    setMedications(prev => [newMed, ...prev]);
  };

  const addAppointment = (apt: Omit<MedicalAppointment, 'id'>) => {
    const newApt: MedicalAppointment = {
      ...apt,
      id: `apt_${Date.now()}`,
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  const addHealthRecord = (rec: Omit<HealthRecord, 'id'>) => {
    const newRec: HealthRecord = {
      ...rec,
      id: `rec_${Date.now()}`,
    };
    setHealthRecords(prev => [newRec, ...prev]);
  };

  const addAacCard = (card: Omit<AACCard, 'id'>) => {
    const newCard: AACCard = {
      ...card,
      id: `aac_${Date.now()}`,
    };
    setAacCardsList(prev => [...prev, newCard]);
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'likes' | 'repliesCount' | 'timestamp'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}`,
      timestamp: 'Just now',
      likes: 1,
      repliesCount: 0,
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const addVolunteerRequest = (vol: Omit<VolunteerOpportunity, 'id' | 'status'>) => {
    const newVol: VolunteerOpportunity = {
      ...vol,
      id: `vol_${Date.now()}`,
      status: 'open',
    };
    setVolunteers(prev => [newVol, ...prev]);
  };

  // SOS Activation
  const triggerSos = () => {
    setIsSosActive(true);
    setSosAlertDispatched(false);

    // Try HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSosLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: 'GPS Verified: Lat ' + pos.coords.latitude.toFixed(4) + ', Lng ' + pos.coords.longitude.toFixed(4) + ' (Metro Civic District)',
          });
          setSosAlertDispatched(true);
        },
        (err) => {
          console.warn('Geolocation error or denied:', err);
          setSosLocation({
            lat: 37.7749,
            lng: -122.4194,
            address: 'Approximate Location: Civic Center Plaza, Metro Area (Simulated fallback)',
          });
          setSosAlertDispatched(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setSosLocation({
        lat: 37.7749,
        lng: -122.4194,
        address: 'Current Street Address: 450 Civic Center Plaza, Downtown',
      });
      setSosAlertDispatched(true);
    }

    // Audible emergency voice confirmation
    speakText('Emergency SOS initiated. Alerting configured emergency contacts and sharing your GPS location.');
  };

  const cancelSos = () => {
    setIsSosActive(false);
    setSosAlertDispatched(false);
    speakText('Emergency SOS has been cancelled. Stand down signal sent to contacts.');
  };

  // Sound alert trigger
  const triggerSoundAlert = (title: string, soundType: string, severity: 'low' | 'medium' | 'high' = 'high') => {
    setActiveSoundAlert({ title, soundType, severity });
    // Flash or buzz if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  };

  const clearSoundAlert = () => {
    setActiveSoundAlert(null);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        disabilityType,
        setDisabilityType,
        role,
        setRole,
        preferences,
        updatePreferences,
        speakText,
        stopSpeaking,
        isSpeaking,
        medications,
        toggleMedicationDose,
        addMedication,
        appointments,
        addAppointment,
        healthRecords,
        addHealthRecord,
        aacCardsList,
        addAacCard,
        communityPosts,
        addCommunityPost,
        likeCommunityPost,
        volunteers,
        addVolunteerRequest,
        isSosActive,
        triggerSos,
        cancelSos,
        sosLocation,
        sosAlertDispatched,
        activeSoundAlert,
        triggerSoundAlert,
        clearSoundAlert,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
