import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { accessibleLocations } from '../../data/mockData';
import { AccessibleLocation } from '../../types';
import { 
  MapPin, 
  AlertTriangle, 
  Compass, 
  MessageSquare, 
  Star, 
  Plus, 
  ThumbsUp, 
  Accessibility, 
  Navigation, 
  CheckCircle, 
  Search, 
  Share2, 
  ShieldAlert 
} from 'lucide-react';

interface BarrierReport {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: string;
  reportedAt: string;
}

export const CommunityNavigation: React.FC = () => {
  const { speakText } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'map' | 'barriers' | 'community'>('map');
  const [selectedPlace, setSelectedPlace] = useState<AccessibleLocation>(accessibleLocations[0]);
  const [searchPlace, setSearchPlace] = useState('');

  // Barrier Reporting State
  const [barriersList, setBarriersList] = useState<BarrierReport[]>([
    {
      id: 'bar_1',
      title: 'Elevator Out of Order at Platform 2',
      type: 'broken_elevator',
      location: 'Central Station, East Concourse',
      description: 'Main lift to track 2 is undergoing hydraulic repair. Use the north ramp 80m ahead.',
      severity: 'high',
      status: 'In Progress (ETA 2 hrs)',
      reportedAt: '1 hour ago',
    },
    {
      id: 'bar_2',
      title: 'Sidewalk Trench & Construction Barrier',
      type: 'blocked_sidewalk',
      location: 'Corner of 4th Ave & Oak St',
      description: 'Utility maintenance blocking wheelchair pathway. Temporary steel plates are uneven.',
      severity: 'medium',
      status: 'Alternate Route Posted',
      reportedAt: '3 hours ago',
    },
    {
      id: 'bar_3',
      title: 'Audible Crosswalk Chirp Inaudible',
      type: 'audio_signal_down',
      location: 'Civic Library Pedestrian Crossing',
      description: 'Audible acoustic beeping signal not activating during green walk cycle.',
      severity: 'high',
      status: 'Reported to Public Works',
      reportedAt: 'Yesterday',
    },
  ]);

  const [showBarrierModal, setShowBarrierModal] = useState(false);
  const [barrierTitle, setBarrierTitle] = useState('');
  const [barrierLocation, setBarrierLocation] = useState('');
  const [barrierType, setBarrierType] = useState('broken_elevator');
  const [barrierDesc, setBarrierDesc] = useState('');

  // Community Forum State
  const [forumPosts, setForumPosts] = useState([
    {
      id: 'p1',
      author: 'Marcus K.',
      role: 'Wheelchair Commuter',
      title: 'North Station Platform 3 elevator is repaired today',
      content: 'Just checked this morning at 8:30 AM: the elevator from concourse to subway track 3 is back in full operation with clear audio cues.',
      likes: 14,
      replies: 3,
      date: '2 hours ago',
    },
    {
      id: 'p2',
      author: 'Elena R.',
      role: 'Blind Community Advocate',
      title: 'Tactile Paving installed along Main Library crosswalk',
      content: 'City public works just finished the raised yellow blister paving and audible pedestrian chirps at 5th and Main. Tested with guide cane and it is extremely safe.',
      likes: 22,
      replies: 5,
      date: '1 day ago',
    },
    {
      id: 'p3',
      author: 'David L.',
      role: 'AAC Device User',
      title: 'Coffee shop on Market St has picture menus now',
      content: 'The staff at Bean & Leaf added laminated AAC visual drink cards at checkout. Super friendly and patient baristas!',
      likes: 31,
      replies: 8,
      date: '3 days ago',
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  const handleReportBarrier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barrierTitle.trim() || !barrierLocation.trim()) return;

    const newBar: BarrierReport = {
      id: `b_${Date.now()}`,
      title: barrierTitle,
      type: barrierType,
      location: barrierLocation,
      description: barrierDesc || 'Reported by community user for safety review.',
      severity: 'high',
      status: 'Investigating',
      reportedAt: 'Just now',
    };

    setBarriersList(prev => [newBar, ...prev]);
    setBarrierTitle('');
    setBarrierLocation('');
    setBarrierDesc('');
    setShowBarrierModal(false);
    speakText('Barrier report submitted to local community navigation safety feed.');
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setForumPosts(prev => [
      {
        id: `post_${Date.now()}`,
        author: 'Alex Rivera (You)',
        role: 'Verified Community Member',
        title: newPostTitle,
        content: newPostContent,
        likes: 1,
        replies: 0,
        date: 'Just now',
      },
      ...prev,
    ]);

    setNewPostTitle('');
    setNewPostContent('');
    setShowPostModal(false);
  };

  const filteredPlaces = accessibleLocations.filter((p: AccessibleLocation) => 
    p.name.toLowerCase().includes(searchPlace.toLowerCase()) || 
    p.type.toLowerCase().includes(searchPlace.toLowerCase()) ||
    p.address.toLowerCase().includes(searchPlace.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Compass className="w-8 h-8 text-purple-600" />
              Community Navigation & Barrier Tracker
            </h1>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
              Pillar E
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Wheelchair accessible routes, obstacle alerts, verified physical accessibility reviews, and peer community forum.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'map' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Accessible Places Map
          </button>
          <button
            onClick={() => setActiveTab('barriers')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'barriers' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reported Barriers ({barriersList.length})
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'community' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Community Peer Forum
          </button>
        </div>
      </div>

      {/* 1. Accessible Places Map View */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Places List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchPlace}
                onChange={(e) => setSearchPlace(e.target.value)}
                placeholder="Search transit, clinics, libraries..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredPlaces.map((place: AccessibleLocation) => {
                const isSelected = selectedPlace.id === place.id;
                return (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected 
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs' 
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{place.name}</h4>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {place.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{place.address}</span>
                      <span>•</span>
                      <span className="text-purple-700 font-semibold">{place.distance}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {place.features.slice(0, 3).map((feat: string, i: number) => (
                        <span key={i} className="text-[10px] bg-purple-100/80 text-purple-800 font-semibold px-2 py-0.5 rounded-md">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Route & Feature Inspector (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Simulated Map Visual Canvas */}
              <div className="aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-800 p-4 flex flex-col justify-between text-white">
                
                {/* SVG Visual Map Layout */}
                <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="nav-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#nav-grid)" />
                  <path d="M 50 180 Q 200 80 400 120 T 600 200" fill="none" stroke="#a855f7" strokeWidth="6" strokeDasharray="8 4"/>
                  <circle cx="200" cy="115" r="10" fill="#22c55e" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="450" cy="140" r="10" fill="#a855f7" stroke="#ffffff" strokeWidth="3" />
                </svg>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs bg-purple-600/90 text-white font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    Verified Accessible Navigation Path
                  </span>
                  <span className="text-xs bg-slate-800/90 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                    {selectedPlace.distance}
                  </span>
                </div>

                <div className="relative z-10 p-3.5 bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300">Target: {selectedPlace.name}</span>
                    <span className="text-emerald-400 font-bold">100% Barrier-Free Path</span>
                  </div>
                  <p className="text-slate-400">
                    Smooth slope concrete, automatic sliding entrance doors, and elevator voice guidance verified.
                  </p>
                </div>
              </div>

              {/* Verified Features Checklist */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Accessibility Audit Features for {selectedPlace.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {selectedPlace.features.map((feat: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Notes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 block">Community Accessibility Notes:</span>
                <p className="text-slate-600 leading-relaxed">{selectedPlace.notes}</p>
                <div className="pt-2 flex items-center justify-between text-slate-500 border-t border-slate-200">
                  <span>Type: <strong className="capitalize text-slate-800">{selectedPlace.type}</strong></span>
                  <span className="text-emerald-700 font-bold">✓ Community Verified</span>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Need to notify others of an obstruction?</span>
              <button
                onClick={() => setShowBarrierModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Barrier Here</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 2. Reported Barriers Feed */}
      {activeTab === 'barriers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Live Obstacle & Barrier Reports
              </h2>
              <p className="text-xs text-slate-500">
                Crowdsourced notices for out-of-order elevators, sidewalk construction, or broken curb ramps.
              </p>
            </div>

            <button
              onClick={() => setShowBarrierModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Report New Barrier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barriersList.map((bar: BarrierReport) => (
              <div 
                key={bar.id}
                className="p-5 rounded-2xl border border-red-200 bg-red-50/30 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      {bar.severity} Hazard
                    </span>
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      Status: {bar.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-2">{bar.title}</h3>
                  <p className="text-xs font-bold text-red-700 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{bar.location}</span>
                  </p>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    {bar.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-red-200/60 text-xs text-slate-500">
                  <span>Reported: {bar.reportedAt}</span>
                  <span className="text-emerald-700 font-bold">City Crew Dispatched</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Community Peer Forum */}
      {activeTab === 'community' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Disability Community Peer Forum & Advice
              </h2>
              <p className="text-xs text-slate-500">
                Share transit hacks, assistive device tips, and connect with peers and caregivers.
              </p>
            </div>

            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post / Share Tip</span>
            </button>
          </div>

          <div className="space-y-4">
            {forumPosts.map((post) => (
              <div 
                key={post.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-purple-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                      {post.author[0]}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{post.author}</span>
                      <span className="text-[11px] text-purple-700 font-medium">{post.role}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">{post.title}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-200 text-xs font-bold text-slate-600">
                  <button 
                    onClick={() => {
                      setForumPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                    }}
                    className="flex items-center gap-1.5 hover:text-purple-600 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({post.likes})</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.replies} Replies</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Report Barrier */}
      {showBarrierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Report Accessibility Barrier
            </h3>
            <form onSubmit={handleReportBarrier} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Barrier Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken Elevator at Platform 2"
                  value={barrierTitle}
                  onChange={(e) => setBarrierTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street / Station Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 400 Main St Subway Entrance"
                  value={barrierLocation}
                  onChange={(e) => setBarrierLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Type of Obstacle</label>
                <select
                  value={barrierType}
                  onChange={(e) => setBarrierType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="broken_elevator">Broken Elevator / Lift</option>
                  <option value="no_ramp">Missing / Steep Ramp</option>
                  <option value="blocked_sidewalk">Blocked Sidewalk / Construction</option>
                  <option value="steep_curb">Uncut / Steep Curb</option>
                  <option value="audio_signal_down">Audible Crosswalk Chirp Down</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Details & Alternate Route</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Use the East ramp 50 meters down..."
                  value={barrierDesc}
                  onChange={(e) => setBarrierDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBarrierModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                >
                  Submit Barrier Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Forum Post */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Share Community Advice
            </h3>
            <form onSubmit={handleAddPost} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tip for traveling through Airport Terminal B"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content / Tip</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your accessibility insight, accessible restroom location, or peer advice..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
