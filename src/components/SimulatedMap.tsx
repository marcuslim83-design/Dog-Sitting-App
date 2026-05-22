import React, { useState } from 'react';
import { MapPin, Compass } from 'lucide-react';
import { SitterProfile } from '../types';

interface SimulatedMapProps {
  sitters: SitterProfile[];
  selectedSitterId: string | null;
  onSelectSitter: (id: string | null) => void;
  currentAreaFilter: string;
}

export default function SimulatedMap({
  sitters,
  selectedSitterId,
  onSelectSitter,
  currentAreaFilter
}: SimulatedMapProps) {
  const [hoveredSitterId, setHoveredSitterId] = useState<string | null>(null);

  // Define some map features coordinates
  const features = [
    { name: 'Greenwood Bark Park', x: 38, y: 35, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    { name: 'Downtown Vet Clinic', x: 48, y: 55, color: 'bg-sky-100 border-sky-300 text-sky-800' },
    { name: 'Riverside Walkway', x: 72, y: 72, color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { name: 'North Hills Play Ground', x: 18, y: 30, color: 'bg-green-100 border-green-300 text-green-800' },
    { name: 'Oakwood Shopping Hub', x: 28, y: 80, color: 'bg-yellow-100 border-yellow-200 text-yellow-800' }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative shadow-inner p-2 select-none h-[380px] lg:h-full min-h-[350px] flex flex-col">
      {/* Map Header details */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-100 flex items-center space-x-2.5 max-w-[85%]">
        <Compass className="h-4 w-4 text-fuchsia-600 animate-spin-slow" />
        <div className="text-left">
          <p className="text-xs font-bold text-slate-800">Neighborhood Sitter Map</p>
          <p className="text-[10px] text-slate-500 font-medium">
            {currentAreaFilter === 'All' ? 'Showing all regions' : `Centering on ${currentAreaFilter}`}
          </p>
        </div>
      </div>

      {/* Map legends */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-xs border border-slate-100 hidden sm:flex items-center space-x-3 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full inline-block animate-pulse"></span>
          <span>Sitter</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full inline-block"></span>
          <span>Dog Park / Area</span>
        </div>
      </div>

      {/* Actual Simulated Canvas Area */}
      <div className="w-full flex-grow bg-[#f5f2eb] rounded-xl border border-slate-100 relative overflow-hidden">
        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-40">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border-t border-l border-violet-800/10 h-full w-full"></div>
          ))}
        </div>

        {/* Decorative Water River winding down */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 10 0 Q 30 150 150 200 T 500 300 T 800 400"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 10 0 Q 30 150 150 200 T 500 300 T 800 400"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="10"
            strokeLinejoin="round"
          />
        </svg>

        {/* Beautiful Map Green & Sandy Zones */}
        <div className="absolute top-[10%] left-[25%] w-[35%] h-[25%] bg-emerald-700/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-fuchsia-800/5 rounded-full blur-xl pointer-events-none"></div>

        {/* Major Roads drawing simulated pathways */}
        <div className="absolute top-[48%] left-0 w-full h-4 bg-slate-100 border-y border-violet-900/5 pointer-events-none"></div>
        <div className="absolute left-[48%] top-0 h-full w-4 bg-slate-100 border-x border-violet-900/5 pointer-events-none"></div>

        {/* Dynamic Area highlights based on filter selection */}
        {LOCATIONS_COORDS[currentAreaFilter] && (
          <div
            className="absolute rounded-full border border-fuchsia-400 bg-fuchsia-400/10 pointer-events-none animate-pulse"
            style={{
              left: `${LOCATIONS_COORDS[currentAreaFilter].x - 15}%`,
              top: `${LOCATIONS_COORDS[currentAreaFilter].y - 15}%`,
              width: '30%',
              height: '30%',
            }}
          ></div>
        )}

        {/* Place feature markers */}
        {features.map((feat, idx) => (
          <div
            key={idx}
            className={`absolute px-2 py-1 rounded-md border text-[9px] font-semibold flex items-center space-x-1 shadow-xs pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ${feat.color}`}
            style={{ left: `${feat.x}%`, top: `${feat.y}%` }}
          >
            <span>🌳</span>
            <span>{feat.name}</span>
          </div>
        ))}

        {/* Sitter Markers mapping */}
        {sitters.map((sitter) => {
          const isSelected = selectedSitterId === sitter.id;
          const isHovered = hoveredSitterId === sitter.id;

          return (
            <div
              key={sitter.id}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ left: `${sitter.lng}%`, top: `${sitter.lat}%` }}
              onClick={() => onSelectSitter(isSelected ? null : sitter.id)}
              onMouseEnter={() => setHoveredSitterId(sitter.id)}
              onMouseLeave={() => setHoveredSitterId(null)}
            >
              {/* Highlight Pulsing Radar Ring */}
              {isSelected && (
                <span className="absolute flex h-11 w-11 -left-3.5 -top-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-11 w-11 bg-fuchsia-500/20"></span>
                </span>
              )}

              {/* Pin representation */}
              <div
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full shadow-md border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-white text-white scale-110 shadow-lg'
                    : isHovered
                    ? 'bg-fuchsia-50 border-fuchsia-500 text-slate-800 scale-105'
                    : 'bg-white border-violet-400 text-slate-800'
                }`}
              >
                <span className="text-sm">{sitter.avatar}</span>
                <div className="flex flex-col text-left max-w-[80px]">
                  <span className={`text-[10px] leading-tight font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {sitter.name.split(' ')[0]}
                  </span>
                  <span className={`text-[8px] font-mono leading-none ${isSelected ? 'text-fuchsia-200 font-bold' : 'text-fuchsia-600 font-semibold'}`}>
                    ${sitter.rate}/day
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Coordinates to center visual focus
const LOCATIONS_COORDS: Record<string, { x: number; y: number }> = {
  Greenwood: { x: 40, y: 35 },
  Downtown: { x: 50, y: 55 },
  Westside: { x: 55, y: 25 },
  'North Hills': { x: 20, y: 32 },
  Riverside: { x: 72, y: 72 },
  Oakwood: { x: 25, y: 78 }
};
