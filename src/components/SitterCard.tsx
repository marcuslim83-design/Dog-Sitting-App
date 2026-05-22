import React from 'react';
import { Star, MapPin, ShieldCheck, ArrowRight, Dog } from 'lucide-react';
import { SitterProfile } from '../types';

interface SitterCardProps {
  key?: string | number;
  sitter: SitterProfile;
  isSelected: boolean;
  onSelect: () => void;
  onBook: (e: React.MouseEvent) => void;
}

export default function SitterCard({ sitter, isSelected, onSelect, onBook }: SitterCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group bg-white rounded-2xl p-5 border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-lg translate-x-1 lg:translate-x-0'
          : 'border-slate-100 hover:border-violet-200 hover:shadow-md'
      }`}
    >
      {/* Popular Tag or verified banner */}
      {sitter.verified && (
        <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 px-3 py-1 text-[10px] font-bold rounded-bl-xl border-l border-b border-emerald-100/30 flex items-center space-x-1">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          <span>Vetted Sitter</span>
        </div>
      )}

      <div>
        {/* Main Info */}
        <div className="flex items-start space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-3xl shadow-sm">
            {sitter.avatar}
          </div>
          <div className="flex-grow">
            <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-violet-700 transition-colors duration-200">
              {sitter.name}
            </h3>
            
            {/* Reviews & Location */}
            <div className="flex items-center space-x-2.5 mt-1">
              <span className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
                {sitter.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <MapPin className="h-3 w-3 text-slate-400 mr-0.5" />
                {sitter.location}
              </span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-slate-500 mt-3.5 line-clamp-2 leading-relaxed">
          {sitter.bio}
        </p>

        {/* Services & Dog size specification */}
        <div className="mt-4 flex flex-wrap gap-1">
          {sitter.services.map((svc) => (
            <span key={svc} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
              {svc}
            </span>
          ))}
          <span className="text-[10px] font-bold text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded-md flex items-center max-w-fit">
            <Dog className="h-2.5 w-2.5 mr-0.5 text-fuchsia-600" />
            Up to {sitter.maxDogSize === 'large' ? 'Large (23kg+)' : sitter.maxDogSize === 'medium' ? 'Med (11-23kg)' : 'Small (<11kg)'}
          </span>
        </div>

        {/* Specialties tags */}
        <div className="mt-4 pt-4 border-t border-slate-50">
          <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider mb-1.5">Specialties & Care</p>
          <div className="flex flex-wrap gap-1">
            {sitter.specialties.map((spec) => (
              <span key={spec} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Booking action bar */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Rate</p>
          <p className="text-lg font-black text-slate-800">
            ${sitter.rate}
            <span className="text-xs text-slate-400 font-semibold font-sans"> / day</span>
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(e);
          }}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all duration-200 hover:translate-x-0.5 shadow-md shadow-violet-600/15"
        >
          <span>Book Stay</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
