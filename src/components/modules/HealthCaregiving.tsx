import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { initialTherapySessions } from '../../data/mockData';
import { TherapySession, Medication } from '../../types';
import { 
  HeartPulse, 
  Pill, 
  Calendar, 
  Activity, 
  HeartHandshake, 
  Plus, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Hospital, 
  Clock, 
  FileText, 
  ShieldCheck, 
  User, 
  Phone 
} from 'lucide-react';

export const HealthCaregiving: React.FC = () => {
  const { 
    medications, 
    toggleMedicationDose, 
    addMedication, 
    appointments, 
    addAppointment, 
    healthRecords, 
    addHealthRecord, 
    userProfile, 
    role, 
    setRole 
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'meds' | 'appointments' | 'records' | 'therapy' | 'caregiver'>('meds');
  
  // Modals
  const [showAddMed, setShowAddMed] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTimes, setMedTimes] = useState('09:00');
  const [medPurpose, setMedPurpose] = useState('');

  const [showAddApt, setShowAddApt] = useState(false);
  const [docName, setDocName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('');
  const [facility, setFacility] = useState('');

  const [therapyList, setTherapyList] = useState<TherapySession[]>(initialTherapySessions);

  // Adherence calculation
  const completedMedsCount = medications.filter(m => m.takenToday.every(Boolean)).length;
  const adherenceRate = medications.length > 0 ? Math.round((completedMedsCount / medications.length) * 100) : 100;

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    addMedication({
      name: medName,
      dosage: medDosage || 'Standard dose',
      frequency: 'Daily',
      times: [medTimes || '09:00'],
      purpose: medPurpose || 'Health support',
      pillCount: 30,
      refillThreshold: 5,
    });

    setMedName('');
    setMedDosage('');
    setMedPurpose('');
    setShowAddMed(false);
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addAppointment({
      doctorName: docName,
      specialty: specialty || 'Specialist',
      facility: facility || 'Metro Health Center',
      date: aptDate || '2026-10-01',
      time: aptTime || '10:00 AM',
      notes: 'Scheduled via AccessAll Portal',
      isVirtual: false,
      status: 'upcoming',
    });

    setDocName('');
    setSpecialty('');
    setAptDate('');
    setShowAddApt(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title & Caregiver Switch Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <HeartPulse className="w-8 h-8 text-emerald-600" />
              Health Management & Caregiving
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              Pillar C
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Medication schedules, appointment tracking, clinical vitals, therapy progress, and authorized caregiver oversight.
          </p>
        </div>

        {/* View Switcher: Individual vs Caregiver Dashboard */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              setRole('caregiver');
              setActiveTab('caregiver');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              role === 'caregiver' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Caregiver Portal</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 text-xs sm:text-sm font-bold">
        {[
          { id: 'meds', label: 'Medication Schedule', icon: Pill },
          { id: 'appointments', label: 'Medical Appointments', icon: Calendar },
          { id: 'records', label: 'Health Records & Vitals', icon: Activity },
          { id: 'therapy', label: 'Therapy Sessions', icon: FileText },
          { id: 'caregiver', label: 'Caregiver Dashboard', icon: HeartHandshake },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                isSelected 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Medication Scheduling & Adherence Monitoring */}
      {activeTab === 'meds' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Daily Medication & Dose Log
              </h2>
              <p className="text-xs text-slate-500">
                Current adherence: <strong className="text-emerald-700">{adherenceRate}%</strong> of today's doses recorded.
              </p>
            </div>

            <button
              onClick={() => setShowAddMed(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.map((med) => (
              <div 
                key={med.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{med.name}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{med.dosage} • {med.frequency}</p>
                    <p className="text-xs text-indigo-700 font-semibold mt-1">Target: {med.purpose}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    med.pillCount <= med.refillThreshold 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {med.pillCount} remaining
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold">Today's Times:</span>
                  {med.times.map((time, idx) => {
                    const taken = med.takenToday[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleMedicationDose(med.id, idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          taken 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-white hover:bg-emerald-50 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {taken ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                        <span>{time} {taken ? 'Done' : 'Mark Taken'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Medical Appointment Tracking */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Medical & Specialist Appointments
              </h2>
              <p className="text-xs text-slate-500">
                Schedule consultations, therapy check-ins, and transport reminders.
              </p>
            </div>

            <button
              onClick={() => setShowAddApt(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book / Add Appointment</span>
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{apt.doctorName}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                      {apt.specialty}
                    </span>
                    {apt.isVirtual && (
                      <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                        Virtual Telehealth
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Hospital className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.facility}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1 italic">
                    Note: {apt.notes}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                  <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{apt.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Health Records & Vitals */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Personal Health Records & Vitals Tracker
            </h2>
            <p className="text-xs text-slate-500">
              Monitors vital clinical signs, glucose, blood pressure, and rehabilitation scores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthRecords.map((rec) => (
              <div 
                key={rec.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>{rec.type}</span>
                  <span>{rec.date}</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {rec.value}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Therapy Sessions */}
      {activeTab === 'therapy' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Therapy & Rehabilitation Tracking
            </h2>
            <p className="text-xs text-slate-500">
              Physical Therapy, Occupational Therapy, and Speech Rehabilitation records.
            </p>
          </div>

          <div className="space-y-3">
            {therapyList.map((th) => (
              <div 
                key={th.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{th.type}</span>
                    <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                      {th.durationMinutes} mins
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Therapist: {th.therapist} • Session: {th.date}</p>
                  <p className="text-xs text-slate-700 mt-2 font-medium">
                    Milestone: {th.goalsMet}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Next Scheduled:</span>
                  <span className="text-xs font-bold text-indigo-700">{th.nextSessionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Dedicated Caregiver Dashboard (FR-15 & Use Case 8.5) */}
      {activeTab === 'caregiver' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-black text-emerald-400">
                    Caregiver Oversight Mode
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Authorized
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Monitoring: {userProfile.name}
                </h2>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Primary Caregiver: <strong className="text-white">{userProfile.caregiverName || 'Sarah Morgan'}</strong>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400">Medication Adherence</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{adherenceRate}%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Updated in real time</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400">Emergency SOS Status</span>
              <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Normal</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">0 unresolved emergency alerts</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs text-slate-400">Next Medical Check</span>
              <div className="text-xl font-bold text-white mt-1">Sept 24, 10:30 AM</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Dr. Evelyn Vance (Ophthalmology)</p>
            </div>
          </div>

          {/* Remote Caregiver Notes & Direct Link */}
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-3">
            <h3 className="font-bold text-sm text-slate-200">Caregiver Action & Incident History</h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Morning Gabapentin 300mg logged as taken at 08:15 AM today.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Routine GPS safety zone check verified at Metro Civic Center.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Refill reminder scheduled for Latanoprost eye drops in 5 days.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Medication Reminder</h3>
            <form onSubmit={handleAddMedication} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg tablet"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheduled Time</label>
                <input
                  type="time"
                  value={medTimes}
                  onChange={(e) => setMedTimes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condition / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Blood Sugar Regulation"
                  value={medPurpose}
                  onChange={(e) => setMedPurpose(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMed(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Add Medical Appointment</h3>
            <form onSubmit={handleAddAppointment} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                <input
                  type="text"
                  placeholder="e.g. Audiologist / Physical Therapist"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddApt(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
