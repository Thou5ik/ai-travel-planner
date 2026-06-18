import React, { useState, useEffect } from 'react';
import { TripParameters, Itinerary } from './types';
import ItineraryForm from './components/ItineraryForm';
import ItineraryView from './components/ItineraryView';
import HistoryList from './components/HistoryList';
import { 
  Sparkles, 
  Map, 
  Compass, 
  AlertCircle, 
  Info,
  ExternalLink,
  ChevronRight,
  Heart,
  Globe2,
  ListTodo
} from 'lucide-react';

const QUICK_PICKS = [
  { destination: 'Kyoto, Japan', style: 'Culture', season: 'Spring', interests: ['History', 'Food', 'Sights'], label: '🌸 Ancient Kyoto Walk', desc: 'Cherry blossoms, shrines & gourmet matcha' },
  { destination: 'Reykjavik, Iceland', style: 'Adventure', season: 'Winter', interests: ['Nature', 'Walking'], label: '❄️ Iceland Wilderness', desc: 'Glaciers, volcanic hot-springs & northern lights' },
  { destination: 'Paris, France', style: 'Balanced', season: 'Autumn', interests: ['Food', 'Museums', 'Shopping'], label: '🥐 Parisian Fine Arts', desc: 'Bistros, iconic galleries & riverside boutiques' },
  { destination: 'Amalfi Coast, Italy', style: 'Relaxing', season: 'Summer', interests: ['Food', 'Sights', 'Wellness'], label: '🍋 Amalfi Sunset Coast', desc: 'Cliffside views, delicious pasta & beach clubs' }
];

export default function App() {
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);
  const [activeItinerary, setActiveItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse local storage records on startup
  useEffect(() => {
    try {
      const cached = localStorage.getItem('saved_itineraries');
      if (cached) {
        setSavedItineraries(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to parse cached itineraries:', e);
    }
  }, []);

  // Save changes to cache whenever history updates
  const saveToLocalCache = (list: Itinerary[]) => {
    try {
      localStorage.setItem('saved_itineraries', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to write travel cache:', e);
    }
  };

  const handleGenerate = async (params: TripParameters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to communicate with our custom planner service.');
      }

      const generated = await response.json();
      
      // Inject standard client tracking metadata
      const fullItinerary: Itinerary = {
        ...generated,
        id: `itinerary_${Date.now()}`,
        createdAt: Date.now(),
        destination: params.destination,
        style: params.style,
        interests: params.interests,
        season: params.season,
        extraDetails: params.extraDetails
      };

      setActiveItinerary(fullItinerary);
    } catch (err: any) {
      console.error('Generation failure:', err);
      setError(err.message || 'An unexpected server error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPickClick = (pick: typeof QUICK_PICKS[number]) => {
    handleGenerate({
      destination: pick.destination,
      duration: 3,
      style: pick.style as any,
      interests: pick.interests,
      season: pick.season,
      extraDetails: 'Instantiated via quick explorer picks'
    });
  };

  const saveItinerary = (itinerary: Itinerary) => {
    if (savedItineraries.some(item => item.id === itinerary.id)) return;
    const updated = [...savedItineraries, itinerary];
    setSavedItineraries(updated);
    saveToLocalCache(updated);
  };

  const deleteItinerary = (id: string) => {
    const updated = savedItineraries.filter(item => item.id !== id);
    setSavedItineraries(updated);
    saveToLocalCache(updated);
    if (activeItinerary?.id === id) {
      setActiveItinerary(null);
    }
  };

  const renameItinerary = (id: string, newTitle: string) => {
    const updated = savedItineraries.map(item => 
      item.id === id ? { ...item, title: newTitle } : item
    );
    setSavedItineraries(updated);
    saveToLocalCache(updated);
    if (activeItinerary?.id === id) {
      setActiveItinerary(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };

  const isCurrentActiveSaved = activeItinerary 
    ? savedItineraries.some(it => it.id === activeItinerary.id) 
    : false;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col print:bg-white text-slate-900 font-sans">
      
      {/* Navbar Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-4 md:px-8 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
              <Compass className="w-5 h-5 text-neutral-50" />
            </div>
            <div>
              <span className="text-blue-600 font-mono text-[9px] font-bold tracking-widest uppercase block">NomadAI</span>
              <h1 className="text-md font-bold tracking-tight text-slate-900 select-none leading-none">
                Bespoke Travel Planner
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 font-mono">
            <span>Powered by Gemini 3.5</span>
            <span className="text-slate-300">|</span>
            <span className="font-sans font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              Full-Stack Suite
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
        
        {/* Error notification banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm text-rose-900 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold block">Failed to Assemble Journey</strong>
              <p className="font-light">{error}</p>
            </div>
          </div>
        )}

        {/* Fallback warning banner */}
        {!isLoading && activeItinerary?.isFallback && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm text-amber-900 text-sm print:hidden animate-fade-in animate-duration-300">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <strong className="font-semibold block text-amber-950">Meticulously Prepared Fallback Guide</strong>
              <p className="font-light text-amber-800">
                {activeItinerary.fallbackReason || 'The live AI planner is under exceptional load. We immediately prepared this beautifully featured and fully tailored interactive guide so you can continue planning with zero interruption.'}
              </p>
            </div>
          </div>
        )}

        {/* Double-column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Inputs and saved record history) */}
          <div className="lg:col-span-4 space-y-6 print:hidden">
            
            {/* Travel planner Parameters card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700 font-mono">Customize Parameters</span>
                <h2 className="text-sm font-bold text-slate-800">Configure Trip</h2>
              </div>
              
              <ItineraryForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Historic lists of saved voyages */}
            <HistoryList 
              savedItineraries={savedItineraries}
              activeId={activeItinerary?.id || null}
              onSelect={setActiveItinerary}
              onDelete={deleteItinerary}
              onRename={renameItinerary}
            />
          </div>

          {/* Right Column (Dynamic results rendering) */}
          <div className="lg:col-span-8">
            
            {/* Processing States */}
            {isLoading ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 md:p-16 shadow-xs text-center space-y-6 flex flex-col items-center justify-center min-h-[460px]">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
                  <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                
                <div className="space-y-2 max-w-sm">
                  <span className="text-xs uppercase tracking-widest text-blue-800 font-bold font-mono">Consolidating Guides</span>
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    Generating your bespoke experience...
                  </p>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Consulting local safety records, neighborhood culinary reviews, seasonal packing guidelines, and mapping optimized travel structures. This may take about 10-15 seconds.
                  </p>
                </div>
              </div>
            ) : activeItinerary ? (
              /* High fidelity Itinerary view */
              <div className="space-y-6">
                <ItineraryView 
                  itinerary={activeItinerary} 
                  onSave={saveItinerary}
                  onDelete={deleteItinerary}
                  isSaved={isCurrentActiveSaved}
                />
              </div>
            ) : (
              /* Pre-generated Call to Action & Quick Picks */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-xs space-y-8 min-h-[500px] flex flex-col justify-center">
                
                {/* Brand overview welcome statement */}
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-blue-50 text-blue-700 border border-blue-100 gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide inline-flex items-center">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bespoke Travel Planner
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                    No template vacation plans. <br />
                    <span className="text-blue-600">Perfect travel matching.</span>
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed font-light">
                    Enter any hamlet, city, or coast in the world, choose your custom budget style, outline your specific interest categories, and let our generative engine draft a day-by-day vacation itinerary featuring:
                  </p>
                </div>

                {/* 3 Columns detailing system values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5 p-1">
                    <span className="font-mono text-xs uppercase font-bold text-slate-400">01 / Dynamic Slots</span>
                    <h4 className="font-bold text-slate-900 text-xs">Morning, Afternoon & Nights</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">Realistic scheduling with neighborhoods, meal recommendations & specific regional activities.</p>
                  </div>
                  <div className="space-y-1.5 p-1">
                    <span className="font-mono text-xs uppercase font-bold text-slate-400">02 / Financial Strategy</span>
                    <h4 className="font-bold text-slate-900 text-xs">Localized Budget Breakouts</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">Custom budget advice regarding recommended properties, travel passes, and meals in local currency.</p>
                  </div>
                  <div className="space-y-1.5 p-1">
                    <span className="font-mono text-xs uppercase font-bold text-slate-400">03 / Packing & Checklist</span>
                    <h4 className="font-bold text-slate-900 text-xs">Seasonal Packing Wisdom</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">Interactive lists mapping precise gear or outfits for the season alongside cultural etiquette guidelines.</p>
                  </div>
                </div>

                {/* Quick-Pick Inspiration Shortcuts section */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
                    Need Inspiration? Choose a Quick-Explorer Pick
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUICK_PICKS.map((pick, i) => (
                      <button
                        key={i}
                        id={`quick-pick-btn-${i}`}
                        onClick={() => handleQuickPickClick(pick)}
                        className="p-4 text-left border border-slate-200 rounded-xl bg-slate-50 hover:bg-blue-50/20 hover:border-blue-500/40 transition duration-200 flex flex-col justify-between cursor-pointer select-none group"
                      >
                        <div className="space-y-1">
                          <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-900 flex items-center justify-between">
                            {pick.label}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-350 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-700 font-medium block">
                            {pick.destination} • {pick.style} Style
                          </span>
                          <p className="text-[11px] text-slate-500 leading-normal font-light">
                            {pick.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500 font-light print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NomadAI Travel Guide. Offline-First Storage Activated.</p>
          <div className="flex gap-4">
            <a href="https://google.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 flex items-center gap-1 text-slate-600">
              Google AI Studio
              <ExternalLink className="w-3 h-3 text-slate-350" />
            </a>
            <span>•</span>
            <span>Vite + React Core Runtime</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
