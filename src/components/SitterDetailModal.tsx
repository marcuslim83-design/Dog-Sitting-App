import React, { useState } from 'react';
import { X, Star, MapPin, Calendar, Heart, ShieldAlert, BadgeInfo, Check, Send, MessageSquare } from 'lucide-react';
import { SitterProfile, Review, Booking } from '../types';

interface SitterDetailModalProps {
  sitter: SitterProfile;
  reviews: Review[];
  onClose: () => void;
  onBook: () => void;
  onChat: () => void;
  userEmail: string;
}

export default function SitterDetailModal({
  sitter,
  reviews,
  onClose,
  onBook,
  onChat,
  userEmail
}: SitterDetailModalProps) {
  const sitterReviews = reviews.filter((r) => r.sitterId === sitter.id);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {/* Animated container */}
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-violet-100 flex flex-col transform transition-all duration-300">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-6 py-4 border-b border-violet-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🐾</span>
            <h2 className="text-sm font-extrabold uppercase text-violet-800 tracking-wider font-mono">Sitter Sits Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Contents Scroll Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-grow">
          {/* Header Card Profile Summary */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-violet-100 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                {sitter.avatar}
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-extrabold text-slate-800">{sitter.name}</h3>
                  {sitter.verified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">✓ Vetted</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
                    {sitter.rating.toFixed(1)} ({sitter.totalReviews} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 mr-0.5" />
                    {sitter.location}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Daily Service Rate</span>
              <span className="text-2xl font-black text-slate-800">${sitter.rate}</span>
              <span className="text-xs text-slate-400 block mt-0.5">per day</span>
            </div>
          </div>

          {/* About Bio Section */}
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">Sitter Bio</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {sitter.bio}
            </p>
          </div>

          {/* Two-Column details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column: Services & sizes */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-3.5 text-left border border-slate-100">
              <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Core Services</h5>
              <div className="space-y-1.5">
                {sitter.services.map((service) => (
                  <div key={service} className="flex items-center text-xs text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full mr-2.5"></span>
                    {service} Package
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono mb-1.5">Dog Preferences</h5>
                <span className="text-xs bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md inline-block font-medium">
                  🐶 Maximum size accepted: <span className="font-bold text-fuchsia-700">{sitter.maxDogSize.toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Right column: Specs & details */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-3.5 text-left border border-slate-100">
              <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider font-mono">Credentials & Specialties</h5>
              <div className="flex flex-wrap gap-1.5">
                {sitter.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="text-xs bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                <span>Member since {sitter.joinedDate}</span>
                <span className="text-emerald-600 font-bold">★ Certified Safe</span>
              </div>
            </div>
          </div>

          {/* Reviews & Feedbacks list */}
          <div className="space-y-4 pt-2 border-t border-slate-100 text-left">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">Reviews & Feedbacks</h4>
            
            {sitterReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews logged yet. You can be the first to book and rate them!</p>
            ) : (
              <div className="space-y-3">
                {sitterReviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-slate-100 p-4 rounded-2xl relative shadow-2xs">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-700">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex text-amber-400 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Booking Call-to-action) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-left hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Available Location</p>
            <p className="text-xs text-slate-700 font-bold">{sitter.location} and nearby areas</p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onChat}
              className="bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center space-x-1.5 shadow-3xs cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-violet-600" />
              <span>Chat & Enquire</span>
            </button>

            <button
              id="book-sitter-cta"
              onClick={onBook}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-black px-5 py-3 rounded-2xl transition hover:translate-y-[-1px] shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              Request Booking Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
