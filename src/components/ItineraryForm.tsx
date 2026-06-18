import React, { useState } from 'react';
import { TripParameters, TravelStyle } from '../types';
import { 
  MapPin, 
  Calendar, 
  Compass, 
  Sparkles, 
  Tags, 
  Sun, 
  ChevronRight, 
  FileText 
} from 'lucide-react';

interface ItineraryFormProps {
  onSubmit: (params: TripParameters) => void;
  isLoading: boolean;
}

const STYLES: { value: TravelStyle; label: string; icon: string; desc: string }[] = [
  { value: 'Budget', label: 'Budget-Friendly', icon: '💸', desc: 'Focus on free sights, local public transit, and delicious street food.' },
  { value: 'Balanced', label: 'Balanced', icon: '⚖️', desc: 'A perfect mix of popular landmarks, comfy hotels, and local dining.' },
  { value: 'Luxury', label: 'Luxury Class', icon: '✨', desc: 'High-end accommodation, private tours, fine dining, and bespoke experiences.' },
  { value: 'Adventure', label: 'Adventure / Active', icon: '🥾', desc: 'Hiking trails, nature explorations, thrilling heights, and sports.' },
  { value: 'Culture', label: 'Art & History', icon: '🏛️', desc: 'Diving into museums, heritage architecture, local galleries, and guided walks.' },
  { value: 'Relaxing', label: 'Relax & Wellness', icon: '🧘', desc: 'Slow pacing, thermal spas, beach strolls, cozy cafes, and park scenery.' },
  { value: 'Family', label: 'Family & Toddlers', icon: '🎈', desc: 'Kid-approved attractions, convenient transport, playgrounds, and easy spacing.' }
];

const INTERESTS = [
  { id: 'Food', label: 'Culinary & Dining', icon: '🍲' },
  { id: 'History', label: 'Ancient & Heritage', icon: '🏰' },
  { id: 'Nature', label: 'Parks & Sceneries', icon: '🌲' },
  { id: 'Museums', label: 'Arts & Museums', icon: '🎨' },
  { id: 'Shopping', label: 'Local Boutiques', icon: '🛍️' },
  { id: 'Nightlife', label: 'Bars & Evening Vibe', icon: '🍹' },
  { id: 'Sights', label: 'Iconic Landmarks', icon: '📸' },
  { id: 'Wellness', label: 'Spa & Relaxation', icon: '💆' },
  { id: 'Walking', label: 'Pedestrian Routes', icon: '👟' },
  { id: 'Music', label: 'Music & Shows', icon: '🎵' }
];

const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

export default function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Food', 'Sights']);
  const [season, setSeason] = useState('Spring');
  const [extraDetails, setExtraDetails] = useState('');

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({
      destination: destination.trim(),
      duration,
      style: selectedStyle,
      interests: selectedInterests,
      season,
      extraDetails: extraDetails.trim()
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Destination input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5" id="lbl-destination">
          <MapPin className="w-4 h-4 text-blue-600" />
          Where are you traveling?
        </label>
        <div className="relative">
          <input
            id="destination-input"
            type="text"
            required
            disabled={isLoading}
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="e.g., Kyoto, Japan or Rome, Italy"
            className="w-full px-4 py-2.5 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 transition"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Compass className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Duration slider */}
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center justify-between" id="lbl-duration">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            Trip Duration
          </span>
          <span className="font-mono text-blue-700 font-bold px-2.5 py-0.5 bg-blue-50 rounded-md text-xs border border-blue-100">
            {duration} {duration === 1 ? 'Day' : 'Days'}
          </span>
        </label>
        <div className="space-y-1">
          <input
            id="duration-slider"
            type="range"
            min="1"
            max="10"
            disabled={isLoading}
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-60"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>1 Day</span>
            <span>3 Days</span>
            <span>5 Days</span>
            <span>7 Days</span>
            <span>10 Days max</span>
          </div>
        </div>
      </div>

      {/* Season Selection & Custom details in clean grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5" id="lbl-season">
            <Sun className="w-4 h-4 text-blue-600" />
            Time of Year
          </label>
          <select
            id="season-select"
            disabled={isLoading}
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60 transition"
          >
            {SEASONS.map(s => (
              <option key={s} value={s}>{s} Season</option>
            ))}
          </select>
        </div>

        {/* Dynamic info note banner */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 text-xs text-slate-500 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Selecting matching seasons adapts cultural events, sightseeing suggestions & bespoke clothing advice.
          </div>
        </div>
      </div>

      {/* Travel style selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5" id="lbl-style">
          <Compass className="w-4 h-4 text-blue-600" />
          Choose Your Travel Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STYLES.map(style => {
            const isSelected = selectedStyle === style.value;
            return (
              <button
                key={style.value}
                id={`style-btn-${style.value}`}
                type="button"
                disabled={isLoading}
                onClick={() => setSelectedStyle(style.value)}
                className={`flex items-start text-left p-3 rounded-xl border transition relative select-none cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 text-slate-900 shadow-sm ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 bg-white'
                }`}
              >
                <span className="text-xl mr-3 select-none">{style.icon}</span>
                <div className="space-y-0.5">
                  <span className="font-semibold text-xs block">{style.label}</span>
                  <p className="text-[11px] leading-normal text-slate-500 line-clamp-2">
                    {style.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interests list tags */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5" id="lbl-interests">
          <Tags className="w-4 h-4 text-blue-600" />
          Select Specific Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(item => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                id={`interest-${item.id}`}
                type="button"
                disabled={isLoading}
                onClick={() => toggleInterest(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer select-none transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Extra Text details */}
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5" id="lbl-extra">
          <FileText className="w-4 h-4 text-blue-600" />
          Special Requests & Preferences (Optional)
        </label>
        <textarea
          id="extra-details-textarea"
          disabled={isLoading}
          value={extraDetails}
          onChange={e => setExtraDetails(e.target.value)}
          placeholder="e.g., Vegetarian restaurants, wheelchair accessibility, minimal walking distance, specific landmarks, baby stroller..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs disabled:opacity-60 transition"
        />
      </div>

      {/* Submit Button */}
      <button
        id="generate-submit"
        type="submit"
        disabled={isLoading || !destination.trim()}
        className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-colors mt-auto shadow-lg shadow-slate-200/80 cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        <span>
          {isLoading ? 'Assembling Custom Planner...' : 'Generate Personalized Itinerary'}
        </span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
