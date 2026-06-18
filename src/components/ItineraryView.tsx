import React, { useState } from 'react';
import { Itinerary, DayPlan, Activity } from '../types';
import { 
  Printer, 
  Download, 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  DollarSign, 
  Coffee, 
  CheckSquare, 
  Camera, 
  Heart, 
  Info, 
  Package, 
  Globe, 
  UtensilsCrossed, 
  Lightbulb, 
  Trash2,
  ChevronRight,
  Map,
  ShoppingBag,
  Navigation,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onSave?: (itinerary: Itinerary) => void;
  onDelete?: (id: string) => void;
  isSaved?: boolean;
}

export default function ItineraryView({ itinerary, onSave, onDelete, isSaved = false }: ItineraryViewProps) {
  const [activeTab, setActiveTab] = useState<number | 'all'>(1);
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  const [readTips, setReadTips] = useState<Record<string, boolean>>({});

  const togglePacked = (item: string) => {
    setPackedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleTip = (index: number) => {
    setReadTips(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getActivityIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'sightseeing':
        return <Camera className="w-4 h-4 text-sky-600" />;
      case 'culture':
        return <Globe className="w-4 h-4 text-violet-600" />;
      case 'relaxation':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'adventure':
        return <Compass className="w-4 h-4 text-blue-600" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-slate-600" />;
      case 'transit':
        return <Navigation className="w-4 h-4 text-indigo-500" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-550" />;
    }
  };

  const getActivityColor = (category: string) => {
    switch (category) {
      case 'food':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'sightseeing':
        return 'bg-sky-50 border-sky-200 text-sky-900';
      case 'culture':
        return 'bg-violet-50 border-violet-200 text-violet-900';
      case 'relaxation':
        return 'bg-rose-50 border-rose-200 text-rose-950';
      case 'adventure':
        return 'bg-blue-50 border-blue-200 text-blue-950';
      case 'shopping':
        return 'bg-slate-50 border-slate-200 text-slate-950';
      case 'transit':
        return 'bg-indigo-50 border-indigo-200 text-indigo-950';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  // Triggers native browser print stylesheets
  const handlePrint = () => {
    window.print();
  };

  // Downloads JSON scheme for advanced backup / power users
  const handleDownloadJSON = () => {
    const filename = `${itinerary.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.json`;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', filename);
    dlAnchorElem.click();
  };

  const displayedDays = activeTab === 'all' 
    ? itinerary.days 
    : itinerary.days.filter(d => d.dayNumber === activeTab);

  return (
    <div id={`itinerary-view-${itinerary.id}`} className="space-y-8 print:p-0 print:border-none">
      {/* 1. Header Hero Panel */}
      <div className="relative overflow-hidden rounded-2xl bg-white text-slate-900 p-6 md:p-8 shadow-sm border border-slate-200 print:bg-white print:text-slate-900 print:border-slate-200 print:shadow-none print:rounded-none">
        
        {/* Abstract design elements to eliminate AI placeholder images */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-50/40 rounded-full blur-3xl pointer-events-none print:hidden" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-medium tracking-wider text-blue-600 print:text-blue-700">
            <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 uppercase text-slate-600 font-semibold">
              {itinerary.style} Style
            </span>
            <span>•</span>
            <span className="bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase flex items-center gap-1 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              {itinerary.duration} {itinerary.duration === 1 ? 'Day' : 'Days'} ({itinerary.season})
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 max-w-4xl print:text-slate-900 leading-tight">
            {itinerary.title}
          </h1>

          <p className="text-slate-500 text-sm leading-relaxed max-w-3xl font-light print:text-slate-700">
            {itinerary.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 print:border-slate-200 no-print">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Created for <strong className="text-slate-800 print:text-slate-800">{itinerary.destination}</strong></span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {onSave && !isSaved && (
                <button
                  id={`btn-save-itinerary`}
                  onClick={() => onSave(itinerary)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Save to My Trips
                </button>
              )}
              {isSaved && (
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Saved to Trips
                </span>
              )}
              <button
                id={`btn-print-itinerary`}
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print / Print PDF
              </button>
              <button
                id={`btn-export-json`}
                onClick={handleDownloadJSON}
                className="bg-white hover:bg-slate-50 text-slate-755 border border-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer title-export text-slate-600"
                title="Download advanced JSON schema backup"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              {onDelete && isSaved && (
                <button
                  id={`btn-delete-itinerary`}
                  onClick={() => onDelete(itinerary.id)}
                  className="bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Remove itinerary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Highlights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {itinerary.highlights.map((highlight, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-start gap-3.5 print:border-slate-200"
          >
            <span className="bg-blue-50 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
              {idx + 1}
            </span>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Highlight {idx + 1}</span>
              <p className="text-xs font-medium leading-relaxed text-slate-700">{highlight}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Daily Guide Timeline & Day Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
        
        {/* Tab selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 no-print">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-bold text-slate-800">Day-by-Day Schedule</h2>
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                id={`day-tab-${day.dayNumber}`}
                onClick={() => setActiveTab(day.dayNumber)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition cursor-pointer ${
                  activeTab === day.dayNumber
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
            <button
              id={`day-tab-all`}
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Full View
            </button>
          </div>
        </div>

        {/* Timeline representation */}
        <div className="space-y-8">
          {displayedDays.map((dayPlan: DayPlan) => (
            <div 
              key={dayPlan.dayNumber} 
              id={`dayplan-section-${dayPlan.dayNumber}`} 
              className="space-y-4 print-page-break first:pt-0 border-l-2 border-blue-100 pl-4 md:pl-6 relative py-1"
            >
              {/* Vertical timeline knot marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-xs print:bg-black" />

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-blue-700 font-mono font-bold text-xs uppercase tracking-wider print:text-black">
                    Day {dayPlan.dayNumber}
                  </span>
                  <span className="text-slate-300 print:hidden text-xs">•</span>
                  <p className="text-slate-400 font-medium text-xs font-mono lowercase tracking-normal">
                    {dayPlan.theme}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">
                  {dayPlan.title}
                </h3>
              </div>

              {/* Bento sequence of activities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {dayPlan.activities.map((activity: Activity, key: number) => (
                  <div 
                    key={key} 
                    id={`day-${dayPlan.dayNumber}-activity-${activity.timeSlot}`}
                    className="p-5 bg-neutral-50/50 rounded-2xl border border-neutral-100 flex flex-col justify-between hover:shadow-xs transition hover:bg-white print:border-neutral-200"
                  >
                    <div className="space-y-3.5">
                      {/* Badge bar */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded uppercase font-semibold">
                          {activity.timeSlot}
                        </span>

                        <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md border flex items-center gap-1 ${getActivityColor(activity.category)}`}>
                          {getActivityIcon(activity.category)}
                          <span className="capitalize">{activity.category}</span>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-semibold text-neutral-900 text-sm leading-snug">
                          {activity.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                          <span className="truncate max-w-[200px]" title={activity.location}>
                            {activity.location}
                          </span>
                        </div>
                      </div>

                      <p className="text-neutral-600 text-xs leading-relaxed font-light">
                        {activity.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-neutral-100/50 flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-mono">Cost Indicator</span>
                      <span className="font-mono bg-neutral-100 font-bold px-2 py-0.5 text-[10px] rounded text-neutral-700">
                        {activity.costEstimate || 'Free'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Budget Breakdown & Culinary Highlights in grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-6">
        
        {/* Budget Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 p-2 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-800">Budget Estimator</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Accommodations</span>
                <p className="text-xs text-slate-700 leading-snug font-medium">{itinerary.budgetBreakdown.accommodation}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Dining Estimate</span>
                <p className="text-xs text-slate-700 leading-snug font-medium">{itinerary.budgetBreakdown.foodAndDrinks}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Passes & Tourism Fees</span>
                <p className="text-xs text-slate-700 leading-snug font-medium">{itinerary.budgetBreakdown.activities}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Transport Strategy</span>
                <p className="text-xs text-slate-700 leading-snug font-medium">{itinerary.budgetBreakdown.transport}</p>
              </div>
            </div>

            <div className="bg-blue-50/40 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-800 block">Est. Grand Total</span>
                <span className="text-xs text-slate-400 italic font-mono">Per-person average estimate</span>
              </div>
              <span className="text-base font-mono font-bold text-blue-900 px-3 py-1.5 bg-white border border-blue-200 rounded-lg shadow-xs">
                {itinerary.budgetBreakdown.estimatedTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Culinary Highlights Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <span className="bg-orange-50 text-orange-700 p-2 rounded-lg">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-slate-800">Local Dishes & Food Guide</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {itinerary.culinaryHighlights.map((dish, index) => (
              <div key={index} className="py-3 last:pb-0 flex items-start gap-3">
                <span className="mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 text-orange-850 bg-orange-50 border border-orange-100">
                  {dish.type}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-slate-800 text-xs">{dish.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{dish.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Smart Checklists: Packing Lists & Regional Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 no-print">
        
        {/* Seasonal packing guide with active checklist state */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 p-1.5 rounded-lg font-bold">
                <Package className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-800">Seasonal Packing Checklist</h3>
            </div>
            <span className="text-[10px] font-mono text-blue-700 uppercase font-bold tracking-wider bg-blue-50 px-2 py-0.5 rounded">
              {itinerary.season}
            </span>
          </div>

          <ul className="space-y-2">
            {itinerary.packingGuide.map((item, key) => {
              const packed = !!packedItems[item];
              return (
                <li key={key}>
                  <button
                    id={`packing-item-${key}`}
                    onClick={() => togglePacked(item)}
                    className="w-full text-left flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer select-none"
                  >
                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      packed 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {packed && <CheckSquare className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs text-slate-600 leading-snug transition-all ${
                      packed ? 'line-through text-slate-400 font-light' : 'font-medium'
                    }`}>
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Local Tips checklists */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 p-1.5 rounded-lg font-bold">
                <Lightbulb className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-800">Regional Travel Tips</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider bg-slate-50 px-2 py-0.5 rounded">
              Local Guidance
            </span>
          </div>

          <ul className="space-y-2">
            {itinerary.localTips.map((tip, index) => {
              const read = !!readTips[index];
              return (
                <li key={index}>
                  <button
                    id={`local-tip-item-${index}`}
                    onClick={() => toggleTip(index)}
                    className="w-full text-left flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer select-none"
                  >
                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      read 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {read && <CheckSquare className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs text-slate-600 leading-relaxed transition-all ${
                      read ? 'text-slate-400 font-light' : 'font-medium'
                    }`}>
                      {tip}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
