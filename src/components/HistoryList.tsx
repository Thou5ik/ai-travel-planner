import React, { useState } from 'react';
import { Itinerary } from '../types';
import { 
  History, 
  MapPin, 
  Calendar, 
  Search, 
  Trash2, 
  ChevronRight, 
  Heart, 
  Edit2, 
  Check, 
  X 
} from 'lucide-react';

interface HistoryListProps {
  savedItineraries: Itinerary[];
  activeId: string | null;
  onSelect: (itinerary: Itinerary) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export default function HistoryList({ 
  savedItineraries, 
  activeId, 
  onSelect, 
  onDelete,
  onRename
}: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameTitleInput, setRenameTitleInput] = useState('');

  const handleStartRename = (e: React.MouseEvent, it: Itinerary) => {
    e.stopPropagation();
    setEditingId(it.id);
    setRenameTitleInput(it.title);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (renameTitleInput.trim() && renameTitleInput.trim() !== '') {
      onRename(id, renameTitleInput.trim());
    }
    setEditingId(null);
  };

  const filtered = savedItineraries.filter(it => 
    it.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    it.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    it.style.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Search Header widget */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold tracking-tight text-slate-800">Saved Journeys</h2>
          <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full ml-auto">
            {savedItineraries.length}
          </span>
        </div>

        {savedItineraries.length > 0 && (
          <div className="relative">
            <input
              id="history-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by city, title, or style..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {savedItineraries.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <Heart className="w-5 h-5 text-slate-300 mx-auto" />
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[200px] mx-auto">
            No saved itineraries yet.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs font-light">
          No matches found for "{searchTerm}"
        </div>
      ) : (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filtered.map(it => {
            const isActive = activeId === it.id;
            const isEditing = editingId === it.id;

            return (
              <div
                key={it.id}
                id={`history-item-row-${it.id}`}
                onClick={() => !isEditing && onSelect(it)}
                className={`group p-3 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50/20 text-slate-900 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-normal'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  {/* Destination & Indicators line */}
                  <div className="flex items-center justify-between gap-1 w-full persistent-hdr">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      {it.destination}
                    </span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-normal shrink-0">
                      {it.duration} Days
                    </span>
                  </div>

                  {/* Editable Active Custom Titles */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 pt-1 w-full" onClick={e => e.stopPropagation()}>
                      <input
                        id={`input-rename-${it.id}`}
                        type="text"
                        value={renameTitleInput}
                        onChange={e => setRenameTitleInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 px-2 py-1 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="New title..."
                        autoFocus
                      />
                      <button
                        id={`btn-save-rename-${it.id}`}
                        onClick={(e) => handleSaveRename(e, it.id)}
                        className="p-1 text-blue-600 hover:bg-slate-100 rounded"
                        title="Save new title"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-cancel-rename-${it.id}`}
                        onClick={handleCancelRename}
                        className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 pt-0.5 w-full">
                      <span className="font-semibold text-xs leading-normal text-slate-900 group-hover:text-blue-900 break-words max-w-[85%]">
                        {it.title}
                      </span>
                      <button
                        id={`btn-trigger-rename-${it.id}`}
                        onClick={(e) => handleStartRename(e, it)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded shrink-0 self-start no-print"
                        title="Rename custom journey title"
                      >
                        <Edit2 className="w-3 h-3 text-slate-300 hover:text-slate-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-bar showing creation style and delete command */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-slate-100 text-[10px] text-slate-400 font-mono">
                  <span>{it.style} Style</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition no-print" onClick={e => e.stopPropagation()}>
                    <button
                      id={`btn-row-delete-${it.id}`}
                      onClick={() => onDelete(it.id)}
                      className="text-red-500 hover:text-red-700 p-0.5 rounded transition"
                      title="Delete saved record"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
