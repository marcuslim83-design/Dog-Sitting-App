import React, { useState } from 'react';
import { ShieldCheck, Compass, Smile, Star, CheckCircle, TrendingUp, Sparkles, DollarSign, ListOrdered, ClipboardList, PenTool } from 'lucide-react';
import { SitterProfile, Booking, DogSize, ServiceType } from '../types';
import { LOCATIONS } from '../mockData';

interface SitterDashboardProps {
  mySitterProfile: SitterProfile;
  onUpdateProfile: (profile: SitterProfile) => void;
  bookings: Booking[];
  onAcceptBooking: (id: string) => void;
  onDeclineBooking: (id: string) => void;
  onCompleteBooking: (id: string) => void;
}

export default function SitterDashboard({
  mySitterProfile,
  onUpdateProfile,
  bookings,
  onAcceptBooking,
  onDeclineBooking,
  onCompleteBooking
}: SitterDashboardProps) {
  // Local form state for sitter listing details
  const [name, setName] = useState(mySitterProfile.name);
  const [bio, setBio] = useState(mySitterProfile.bio);
  const [rate, setRate] = useState(mySitterProfile.rate);
  const [location, setLocation] = useState(mySitterProfile.location);
  const [maxDogSize, setMaxDogSize] = useState<DogSize>(mySitterProfile.maxDogSize);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [specialties, setSpecialties] = useState<string[]>(mySitterProfile.specialties);
  const [successMsg, setSuccessMsg] = useState(false);

  // Sitter core bookings list
  const sitterBookings = bookings.filter((b) => b.sitterId === mySitterProfile.id);
  const pendingRequests = sitterBookings.filter((b) => b.status === 'pending');
  const activeBookings = sitterBookings.filter((b) => b.status === 'confirmed');
  const historicalSits = sitterBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  // Calculates financial stats
  const completedSits = sitterBookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedSits.reduce((acc, curr) => acc + curr.totalCost, 0);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...mySitterProfile,
      name,
      bio,
      rate,
      location,
      maxDogSize,
      specialties
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleAddSpecialty = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && specialtyInput.trim()) {
      e.preventDefault();
      if (!specialties.includes(specialtyInput.trim())) {
        setSpecialties([...specialties, specialtyInput.trim()]);
      }
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (indexToRemove: number) => {
    setSpecialties(specialties.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Sitter Profile Overview / Greetings */}
      <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-violet-600/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-violet-500/30 blur-2xl pointer-events-none"></div>
        
        <div>
          <span className="bg-white/15 text-white text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full">Sitter Mode Dashboard</span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">Welcome, {mySitterProfile.name}!</h2>
          <p className="text-xs text-violet-100/90 mt-1.5 font-medium max-w-md">
            Manage incoming local pet sitting reservations, evaluate your dashboard growth, or customize your advertised services details.
          </p>
        </div>

        {/* Rapid Overview Stats Widget */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 font-mono text-center">
          <div className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition rounded-2xl p-3 border border-white/10">
            <p className="text-[10px] font-bold tracking-wider text-violet-100 uppercase">Total Sits</p>
            <p className="text-xl font-black mt-0.5">{completedSits.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition rounded-2xl p-3 border border-white/10">
            <p className="text-[10px] font-bold tracking-wider text-violet-100 uppercase">Rating</p>
            <p className="text-xl font-black mt-0.5 flex items-center justify-center">
              <Star className="h-4 w-4 fill-current text-yellow-300 mr-0.5" />
              {mySitterProfile.rating.toFixed(1)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition rounded-2xl p-3 border border-white/10">
            <p className="text-[10px] font-bold tracking-wider text-fuchsia-100 uppercase">Earnings</p>
            <p className="text-xl font-black text-violet-50 mt-0.5">${totalEarnings}</p>
          </div>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Booking Actions and Live Stats Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Incoming Pending Requests Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-slate-400 font-mono tracking-widest">
                Pending Invites ({pendingRequests.length})
              </h3>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-500">
                <Smile className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No pending requests at the moment</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your listing is active. New owners will request stays here.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {pendingRequests.map((b) => (
                  <div key={b.id} className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-violet-200 transition">
                    <div className="flex justify-between items-start gap-3">
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-800">{b.ownerName}</span>
                          <span className="text-[9px] font-mono text-slate-400">({b.ownerEmail})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          wants sitting for <span className="font-bold text-violet-700">"{b.dogName}"</span> ({b.dogSize} size)
                        </p>
                        <p className="text-xs font-semibold text-slate-700 mt-1.5 flex items-center">
                          📅 {b.startDate} to {b.endDate}
                        </p>
                        {b.notes && (
                          <div className="mt-2.5 bg-slate-50/80 border border-slate-100 p-2.5 rounded-xl text-xs flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Owner Message:</span>
                            <span className="text-slate-600 font-medium italic">"{b.notes}"</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimate Value</p>
                        <p className="text-base font-black text-slate-800">${b.totalCost}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 pt-3.5 border-t border-slate-50">
                      <button
                        onClick={() => onAcceptBooking(b.id)}
                        className="bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => onDeclineBooking(b.id)}
                        className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition border border-transparent hover:border-rose-100"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Confirmed Dog Sitting Plans */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-400 font-mono tracking-widest">
              Upcoming Active Jobs ({activeBookings.length})
            </h3>

            {activeBookings.length === 0 ? (
              <p className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-xs text-slate-400 italic text-center">
                No active or confirmed jobs ready. Start accepting bookings from owners.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <div key={b.id} className="bg-white border-l-4 border-violet-500 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-3xs">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-violet-700">{b.serviceType} Package</span>
                        <span className="bg-violet-50 text-violet-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono">Confirmed</span>
                      </div>
                      
                      <p className="text-sm font-black text-slate-800 mt-2">Dog: {b.dogName}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium flex items-center">
                        📅 {b.startDate} to {b.endDate}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Owner: {b.ownerName}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-sm font-mono font-black text-slate-800">${b.totalCost}</span>
                      <button
                        onClick={() => onCompleteBooking(b.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simple Dynamic SVG Earnings Performance Graph */}
          <div className="bg-white border border-slate-100 p-5 rounded-3xl space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 font-mono tracking-widest flex items-center">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-2" />
              Sitter Activity Trend
            </h4>
            
            <div className="h-28 flex items-end justify-between px-2 pt-3">
              {/* March */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 bg-slate-100 rounded-t-md h-12 flex items-center justify-center text-[10px] font-bold text-slate-500 font-mono">$120</div>
                <span className="text-[10px] text-slate-400 font-bold mt-2">March</span>
              </div>
              {/* April */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 bg-slate-100 rounded-t-md h-16 flex items-center justify-center text-[10px] font-bold text-slate-500 font-mono">$240</div>
                <span className="text-[10px] text-slate-400 font-bold mt-2">April</span>
              </div>
              {/* May */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 bg-violet-600 rounded-t-md h-24 flex items-center justify-center text-[10px] font-bold text-white font-mono">${totalEarnings > 0 ? totalEarnings + 200 : 200}</div>
                <span className="text-[10px] text-violet-700 font-bold mt-2">May (Current)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Sitter listing details form creator */}
        <div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center space-x-2">
              <PenTool className="h-5 w-5 text-fuchsia-600" />
              <h3 className="text-base font-bold text-slate-800">Review Sitter Listing</h3>
            </div>
            
            <p className="text-xs text-slate-400 font-medium">
              Update these fields and click Update. Your updated listing instantly updates the public dog parent catalog pool!
            </p>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-bold leading-tight animate-fade-in flex items-center">
                <span>✨ Service Profile Updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Display Sitter Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-semibold text-slate-700"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Serving Area</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-700"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Service Rate ($ / Day)</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-semibold text-slate-700 font-mono"
                />
              </div>

              {/* Max Dog Size */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Maximum Dog Size</label>
                <select
                  value={maxDogSize}
                  onChange={(e) => setMaxDogSize(e.target.value as DogSize)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-700"
                >
                  <option value="small">Small Dogs Only (&lt;25 lbs)</option>
                  <option value="medium">Medium Size Acceptable (&lt;50 lbs)</option>
                  <option value="large">Large Sizes Welcome (50+ lbs)</option>
                </select>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Catchy Advertisement Bio</label>
                <textarea
                  required
                  value={bio}
                  rows={3}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-medium text-slate-700 leading-relaxed resize-none"
                ></textarea>
              </div>

              {/* Specialties */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Specialties Tags & Skills</label>
                <p className="text-[9px] text-slate-400">Type a specialty and press enter</p>
                <input
                  type="text"
                  placeholder="e.g. Free Puppy treats, Certified Vet"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={handleAddSpecialty}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-semibold text-slate-700"
                />
                
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {specialties.map((spec, sidx) => (
                    <span key={sidx} className="bg-violet-50 text-violet-800 text-[10px] font-bold border border-violet-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(sidx)}
                        className="text-violet-500 hover:text-violet-800 text-[9px] ml-1 font-extrabold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-extrabold py-3 rounded-2xl transition hover:shadow-lg shadow-violet-600/10"
              >
                Update Advertised Listing
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
