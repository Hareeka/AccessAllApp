export type DisabilityType = 
  | 'visual' 
  | 'hearing' 
  | 'speech' 
  | 'mobility' 
  | 'cognitive' 
  | 'multiple' 
  | 'none';

export type UserRole = 'pwd' | 'caregiver' | 'admin';

export type TextSize = 'normal' | 'large' | 'extra-large';
export type ContrastMode = 'standard' | 'high-contrast' | 'dark' | 'warm';

export interface AccessibilityPreferences {
  textSize: TextSize;
  contrastMode: ContrastMode;
  simplifiedUI: boolean;
  dyslexicFont: boolean;
  autoReadAloud: boolean;
  screenReaderHints: boolean;
  voiceSpeed: number; // 0.8 to 1.3
  reduceMotion: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  disabilityType: DisabilityType;
  disabilityDetails: string;
  preferences: AccessibilityPreferences;
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalEmergencyInfo;
  caregiverId?: string;
  caregiverName?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notifyBySms: boolean;
  notifyByCall: boolean;
}

export interface MedicalEmergencyInfo {
  bloodType: string;
  primaryCondition: string;
  allergies: string[];
  currentMedications: string[];
  physicianName: string;
  physicianPhone: string;
  specialInstructions: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Twice daily with meals"
  times: string[]; // ["08:00", "20:00"]
  purpose: string;
  pillCount: number;
  refillThreshold: number;
  takenToday: boolean[]; // tracks adherence per time
  lastTaken?: string;
}

export interface MedicalAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  facility: string;
  date: string;
  time: string;
  notes: string;
  isVirtual: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'Blood Pressure' | 'Blood Glucose' | 'Mobility Score' | 'Therapy Progress' | 'General Note';
  value: string;
  notes: string;
}

export interface TherapySession {
  id: string;
  type: 'Physical Therapy' | 'Occupational Therapy' | 'Speech Therapy' | 'Cognitive Behavioral';
  therapist: string;
  date: string;
  durationMinutes: number;
  goalsMet: string;
  nextSessionDate: string;
}

export interface AACCard {
  id: string;
  label: string;
  phrase: string;
  category: 'needs' | 'feelings' | 'pain' | 'social' | 'emergency' | 'food';
  icon: string;
  color: string;
}

export interface SignLanguageCard {
  id: string;
  word: string;
  category: 'alphabet' | 'greetings' | 'emergency' | 'daily';
  description: string;
  instruction: string;
  imageUrl?: string;
}

export interface AccessibleLocation {
  id: string;
  name: string;
  type: 'hospital' | 'transit' | 'park' | 'restroom' | 'library' | 'mall';
  address: string;
  distance: string;
  features: string[]; // e.g., ["Wheelchair Ramp", "Elevator", "Tactile Paving", "Braille Signs", "Accessible Toilet"]
  rating: number; // 1-5
  verifiedByCommunity: boolean;
  notes: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  accommodations: string[]; // e.g. ["Screen Reader Certified", "Flexible Hours", "Wheelchair Accessible Office", "Neurodivergent Friendly"]
  description: string;
  requirements: string[];
}

export interface GovernmentScheme {
  id: string;
  title: string;
  category: 'Pension' | 'Certificate' | 'Scholarship' | 'Assistive Device' | 'Legal Rights';
  agency: string;
  eligibility: string;
  benefits: string;
  documentsNeeded: string[];
  applicationUrl?: string;
  simplifiedSummary: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  disabilityFocus: string;
  timestamp: string;
  title: string;
  content: string;
  likes: number;
  repliesCount: number;
  category: 'support' | 'tips' | 'advocacy' | 'meetups';
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  type: 'requesting_help' | 'offering_help';
  requesterOrVolunteer: string;
  assistanceType: 'Mobility/Travel' | 'Reading/OCR Assistance' | 'Companionship' | 'Tech Support' | 'Shopping';
  location: string;
  date: string;
  description: string;
  status: 'open' | 'matched';
}

export interface EducationalResource {
  id: string;
  title: string;
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'Audiobook' | 'Interactive Notes' | 'Visual Guide' | 'AI Tutor Module';
  estimatedMinutes: number;
  summary: string;
  keyPoints: string[];
}
