import React, { useState, useEffect } from 'react';
import { X, Calendar, Calculator, Check, ArrowRight, Sparkles, Footprints } from 'lucide-react';
import { SitterProfile, Booking, DogSize, ServiceType } from '../types';

interface BookingModalProps {
  sitter: SitterProfile;
  onClose: () => void;
  onConfirmBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  userEmail: string;
}

export default function BookingModal({
  sitter,
  onClose,
  onConfirmBooking,
  userEmail
}: BookingModalProps) {
  // Input states
  const [dogName, setDogName] = useState('Buddy');
  const [dogSize, setDogSize] = useState<DogSize>('medium');
  const [serviceType, setServiceType] = useState<ServiceType>(sitter.services[0] || 'Sitting');
  
  // Dates: set default start to tomorrow, end to day after tomorrow
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTomorrow());
  const [endDate, setEndDate] = useState(getDayAfterTomorrow());
  const [notes, setNotes] = useState('');
  
  // Cost breakdown calculation
  const [daysCount, setDaysCount] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setDaysCount(diffDays);
    } else {
      setDaysCount(1);
    }
  }, [startDate, endDate]);

  const platformFee = 5.00;
  
  useEffect(() => {
    setTotalCost((sitter.rate * daysCount) + platformFee);
  }, [sitter.rate, daysCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking({
      sitterId: sitter.id,
      sitterName: sitter.name,
      sitterAvatar: sitter.avatar,
      ownerName: 'Marcus Lim',
      ownerEmail: userEmail,
      dogName,
      dogSize,
      serviceType,
      startDate,
      endDate,
      notes,
      totalCost,
      status: 'pending' // pending approval from the sitter
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-violet-100 flex flex-col transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-violet-100 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 flex justify-between items-center text-left">
          <div className="flex items-center space-x-2">
            <Footprints className="h-5 w-5 text-violet-700" />
            <h3 className="text-sm font-extrabold uppercase text-violet-800 font-mono tracking-wider">Book {sitter.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-left flex-grow">
          {/* Quick summary line */}
          <div className="bg-violet-50/40 rounded-2xl p-4 border border-violet-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">{sitter.avatar}</span>
              <div>
                <p className="font-extrabold text-slate-800">{sitter.name}</p>
                <p className="text-slate-400 font-medium">{sitter.location} Region</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-violet-700">${sitter.rate}/day</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Dog Name */}
            <div className="space-y-1.5Col">
              <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block tracking-wider">Dog Name</label>
              <input
                type="text"
                required
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="Buddy/Charlie"
                className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-sm rounded-xl px-3.5 py-2.5 outline-none font-medium text-slate-800 transition"
              />
            </div>

            {/* Dog Size */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block tracking-wider">Dog Size</label>
              <select
                value={dogSize}
                onChange={(e) => setDogSize(e.target.value as DogSize)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-sm rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-700 transition"
              >
                <option value="small">Small (&lt;11 kg)</option>
                <option value="medium">Medium (11-23 kg)</option>
                <option value="large">Large (23+ kg)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block tracking-wider">Select Package Service</label>
            <div className="grid grid-cols-3 gap-2">
              {sitter.services.map((service) => (
                <button
                  type="button"
                  key={service}
                  onClick={() => setServiceType(service)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition flex flex-col items-center justify-center space-y-1 ${
                    serviceType === service
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{service === 'Sitting' ? '🏡' : service === 'Walking' ? '🐕' : '🛏️'}</span>
                  <span>{service}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block tracking-wider">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-700 transition"
              />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block tracking-wider">End Date (Pickup)</label>
              <input
                type="date"
                required
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-700 transition"
              />
            </div>
          </div>

          {/* Care details/Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block tracking-wider">Special Care Notes & Routines</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="List medical conditions, eating cycles, activity favorites, or allergy notices..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3 py-2.5 outline-none font-medium text-slate-700 transition resize-none"
            ></textarea>
          </div>

          {/* Cost breakdown */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-2 text-xs">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Pricing Summary</h4>
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Sitter rate (${sitter.rate} × {daysCount} {daysCount === 1 ? 'day' : 'days'})</span>
              <span className="font-mono font-semibold text-slate-700">${sitter.rate * daysCount}.00</span>
            </div>
            
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Bark Protection & Platform Fee</span>
              <span className="font-mono font-semibold text-slate-700">${platformFee.toFixed(2)}</span>
            </div>

            <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
              <span className="text-slate-800 font-extrabold uppercase tracking-wide">Grand Total</span>
              <span className="text-base font-black text-violet-700 font-mono">${totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-black py-4 rounded-2xl transition hover:translate-y-[-1px] shadow-lg shadow-violet-600/20 flex items-center justify-center space-x-2"
          >
            <span>Confirm Booking Invitation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
