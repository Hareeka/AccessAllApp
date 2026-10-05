import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { inclusiveJobs } from '../../data/mockData';
import { JobListing } from '../../types';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Send, 
  CheckCircle, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter, 
  RefreshCw,
  Search
} from 'lucide-react';

export const EducationLearning: React.FC = () => {
  const { disabilityType, speakText, stopSpeaking, isSpeaking, preferences } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'summarizer' | 'tutor' | 'jobs'>('summarizer');
  
  // Summarizer states
  const [textToSummarize, setTextToSummarize] = useState('');
  const [targetAudience, setTargetAudience] = useState<'dyslexia' | 'adhd' | 'general' | 'kids'>('dyslexia');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  // AI Tutor states
  const [tutorTopic, setTutorTopic] = useState('');
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutoring, setTutoring] = useState(false);
  const [tutorResponse, setTutorResponse] = useState<string | null>(null);

  // Job Board states
  const [jobSearch, setJobSearch] = useState('');
  const [accommodationFilter, setAccommodationFilter] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const handleSummarize = async () => {
    if (!textToSummarize.trim()) return;
    setSummarizing(true);
    setSummaryResult(null);

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSummarize,
          targetAudience,
        }),
      });

      const data = await res.json();
      const output = data.summary || 'Summary generated.';
      setSummaryResult(output);

      if (preferences.autoReadAloud) {
        speakText(output);
      }
    } catch (err) {
      console.error(err);
      setSummaryResult('Could not complete summarization. Please check connection and try again.');
    } finally {
      setSummarizing(false);
    }
  };

  const handleAskTutor = async () => {
    if (!tutorQuestion.trim()) return;
    setTutoring(true);
    setTutorResponse(null);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: tutorTopic || 'General Study Concept',
          question: tutorQuestion,
          disabilityType,
        }),
      });

      const data = await res.json();
      const output = data.explanation || 'Explanation generated.';
      setTutorResponse(output);

      if (preferences.autoReadAloud) {
        speakText(output);
      }
    } catch (err) {
      console.error(err);
      setTutorResponse('Tutor is currently offline. Please try again in a moment.');
    } finally {
      setTutoring(false);
    }
  };

  const toggleApplyJob = (jobId: string) => {
    if (appliedJobs.includes(jobId)) {
      setAppliedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      setAppliedJobs(prev => [...prev, jobId]);
      speakText('Application submitted with your AccessAll verified accessibility accommodations profile!');
    }
  };

  const filteredJobs = inclusiveJobs.filter((j: JobListing) => {
    const matchesSearch = j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
                          j.description.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesFilter = accommodationFilter === 'all' || 
                          j.accommodations.some((a: string) => a.toLowerCase().includes(accommodationFilter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              Education, Learning & Vocational Jobs
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
              Pillar D
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">
            Accessible text summarizer for cognitive processing, adaptive AI study tutor, and inclusive vocational job board.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('summarizer')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'summarizer' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Text Summarizer
          </button>
          <button
            onClick={() => setActiveTab('tutor')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'tutor' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Study Tutor
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inclusive Job Board
          </button>
        </div>
      </div>

      {/* 1. Smart Text Summarizer */}
      {activeTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Cognitive Content Simplifier & Summarizer
              </h2>
              <p className="text-xs text-slate-500">
                Paste long text, academic articles, or policy documents to translate them into plain bullet points.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Simplification Mode:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                {[
                  { id: 'dyslexia', label: 'Dyslexia Friendly' },
                  { id: 'adhd', label: 'ADHD Short Bullets' },
                  { id: 'kids', label: 'Grade 4 Simple' },
                  { id: 'general', label: 'Executive Brief' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTargetAudience(m.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition cursor-pointer ${
                      targetAudience === m.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Input Text to Simplify:
              </label>
              <textarea
                rows={6}
                value={textToSummarize}
                onChange={(e) => setTextToSummarize(e.target.value)}
                placeholder="Paste complex text here (e.g. scientific concepts, medical diagnoses, legal contracts, or lesson chapters)..."
                className="w-full p-3.5 border border-slate-300 rounded-2xl text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setTextToSummarize("Photosynthesis is a biological process utilized by plant organisms to transform photochemical energy sourced from solar radiation into chemical synthesized carbohydrates such as glucose. During light-dependent reactions, photolysis separates water molecules into protons and diatomic oxygen gas as byproducts.")}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Insert Sample Science Article
              </button>
              <button
                onClick={handleSummarize}
                disabled={!textToSummarize.trim() || summarizing}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                {summarizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{summarizing ? 'Simplifying...' : 'Simplify & Summarize'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">
                  Simplified Accessible Summary
                </h3>
                {summaryResult && (
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(summaryResult)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                  </button>
                )}
              </div>

              <div className="mt-4 min-h-[220px] p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm leading-relaxed overflow-y-auto max-h-[380px]">
                {summarizing ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-2">
                    <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
                    <p className="text-xs font-medium">Rephrasing into clear cognitive structures...</p>
                  </div>
                ) : summaryResult ? (
                  <div className="text-slate-900 whitespace-pre-wrap font-accessible leading-relaxed">
                    {summaryResult}
                  </div>
                ) : (
                  <div className="text-center py-14 text-slate-400 space-y-2">
                    <BookOpen className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
                    <p className="text-xs font-semibold text-slate-500">Summary will appear here</p>
                    <p className="text-[11px] text-slate-400">
                      Formatted with high contrast and readable line spacing.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-900">
              <span className="font-bold block">Cognitive Reading Tip:</span>
              <p className="text-indigo-800/80 mt-0.5">
                Use the top Accessibility toolbar to enable the Dyslexia-Friendly font or switch to High Contrast Mode if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. AI Study Tutor */}
      {activeTab === 'tutor' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Adaptive Study Companion & Tutor
            </h2>
            <p className="text-xs text-slate-500">
              Personalized explanations paced to your cognitive or visual preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Study Topic / Subject
              </label>
              <input
                type="text"
                value={tutorTopic}
                onChange={(e) => setTutorTopic(e.target.value)}
                placeholder="e.g. American History, Biology, Basic Finance..."
                className="w-full p-3 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Specific Question
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tutorQuestion}
                  onChange={(e) => setTutorQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                  placeholder="e.g. How does compound interest work?"
                  className="flex-1 p-3 border border-slate-300 rounded-xl text-sm font-medium"
                />
                <button
                  onClick={handleAskTutor}
                  disabled={!tutorQuestion.trim() || tutoring}
                  className="px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {tutoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick study prompts */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 py-1 font-semibold">Try asking:</span>
            {[
              "Explain the water cycle in 3 simple steps",
              "What is the difference between active and passive transport?",
              "Give me a memory tip to remember planets in order",
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTutorTopic('General Science');
                  setTutorQuestion(p);
                }}
                className="p-1.5 px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg transition border border-slate-200 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Tutor Response Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[160px]">
            {tutoring ? (
              <div className="flex items-center justify-center py-10 gap-2 text-slate-500 text-sm">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Your tutor is preparing a supportive explanation...</span>
              </div>
            ) : tutorResponse ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 text-sm">Tutor Response</span>
                  <button
                    onClick={() => speakText(tutorResponse)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </button>
                </div>
                <div className="text-slate-900 leading-relaxed text-sm whitespace-pre-wrap">
                  {tutorResponse}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Ask a question above to start your interactive tutoring session.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Inclusive Job Board & Vocational Training */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Inclusive & Disability-Friendly Careers
              </h2>
              <p className="text-xs text-slate-500">
                Verified employers offering accessible physical workstations, assistive tech software, and sensory-friendly arrangements.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {['all', 'Remote', 'Screen Reader', 'Ergonomic', 'Flexible'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAccommodationFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition cursor-pointer ${
                    accommodationFilter === filter 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Job Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              placeholder="Search by role title, company name, or accessibility keywords..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
            />
          </div>

          {/* Jobs Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job: JobListing) => {
              const isApplied = appliedJobs.includes(job.id);
              return (
                <div 
                  key={job.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{job.title}</h3>
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.company}</span>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location}</span>
                        </p>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                        {job.salary}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Accommodation tags */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Verified Accommodations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.accommodations.map((acc: string, i: number) => (
                          <span 
                            key={i}
                            className="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-semibold"
                          >
                            ✓ {acc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500 capitalize">{job.type} Position</span>
                    <button
                      onClick={() => toggleApplyJob(job.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isApplied 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isApplied && <CheckCircle className="w-3.5 h-3.5" />}
                      <span>{isApplied ? 'Application Sent' : 'Apply with Profile'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
