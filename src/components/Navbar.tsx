import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { DisabilityType, UserRole } from '../types';
import { 
  ShieldAlert, 
  Bot, 
  HeartHandshake, 
  UserCheck, 
  Menu, 
  X, 
  Eye, 
  Ear, 
  Mic, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  Landmark, 
  MapPin, 
  Users, 
  BarChart3, 
  Home
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<Props> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenAiAssistant, 
  onOpenSettings 
}) => {
  const { 
    userProfile, 
    role, 
    setRole, 
    disabilityType, 
    setDisabilityType, 
    triggerSos,
    preferences 
  } = useAccessibility();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'vision', label: 'Vision AI', icon: Eye },
    { id: 'hearing', label: 'Hearing AI', icon: Ear },
    { id: 'speech', label: 'Speech & AAC', icon: Mic },
    { id: 'health', label: 'Health & Care', icon: HeartPulse },
    { id: 'sos', label: 'Emergency SOS', icon: ShieldAlert, highlight: true },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'employment', label: 'Jobs & Resume', icon: Briefcase },
    { id: 'schemes', label: 'Govt Schemes', icon: Landmark },
    { id: 'map', label: 'Access Map', icon: MapPin },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const disabilityOptions: { id: DisabilityType; label: string }[] = [
    { id: 'visual', label: 'Visual Support' },
    { id: 'hearing', label: 'Hearing Support' },
    { id: 'speech', label: 'Speech Support' },
    { id: 'mobility', label: 'Mobility Support' },
    { id: 'cognitive', label: 'Cognitive Support' },
    { id: 'multiple', label: 'Multiple Needs' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[41px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
              id="app-logo-btn"
              aria-label="AccessAll Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm font-black text-xl group-hover:scale-105 transition">
                A
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  AccessAll
                  <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                    AI Assist
                  </span>
                </span>
                <p className="text-xs text-slate-700 hidden sm:block">Universal Disability Platform</p>
              </div>
            </button>
          </div>

          {/* Quick Disability Context Filter & Role Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <label htmlFor="disability-select" className="text-slate-700 font-semibold px-2">Focus Mode:</label>
              <select
                id="disability-select"
                value={disabilityType}
                onChange={(e) => setDisabilityType(e.target.value as DisabilityType)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                aria-label="Filter application interface to specific disability profile"
              >
                {disabilityOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Role Switcher (PWD vs Caregiver vs Admin) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                id="btn-role-pwd"
                onClick={() => setRole('pwd')}
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                  role === 'pwd' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-pressed={role === 'pwd'}
              >
                Individual (PWD)
              </button>
              <button
                id="btn-role-caregiver"
                onClick={() => {
                  setRole('caregiver');
                  setActiveTab('health');
                }}
                className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 cursor-pointer ${
                  role === 'caregiver' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-pressed={role === 'caregiver'}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                Caregiver
              </button>
              <button
                id="btn-role-admin"
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 cursor-pointer ${
                  role === 'admin' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
                aria-pressed={role === 'admin'}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {/* Action Buttons: AI Assistant & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-ai-assistant"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium px-3.5 py-2 rounded-lg text-sm shadow-xs transition cursor-pointer"
              aria-label="Open AI Personal Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Companion</span>
            </button>

            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Desktop Navigation Tabs Scrollable Bar */}
        <nav 
          className="hidden lg:flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-sm font-medium"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                  item.highlight
                    ? isActive 
                      ? 'bg-red-600 text-white font-bold' 
                      : 'bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200'
                    : isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-red-600' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-3 bg-white">
            <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-lg">
              <span className="text-xs font-bold text-slate-700">Active Profile & Role:</span>
              <div className="flex gap-2">
                <select
                  value={disabilityType}
                  onChange={(e) => setDisabilityType(e.target.value as DisabilityType)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-1/2"
                >
                  {disabilityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-1/2"
                >
                  <option value="pwd">PWD User</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-left text-sm font-medium transition ${
                      item.highlight
                        ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                        : isActive
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
