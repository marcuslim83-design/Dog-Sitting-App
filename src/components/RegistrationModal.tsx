import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  User, 
  Briefcase, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Dog, 
  Plus, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DogSize, ServiceType, SitterProfile } from '../types';
import { LOCATIONS } from '../mockData';

interface RegistrationModalProps {
  onClose: () => void;
  onRegisterSitter: (newSitter: SitterProfile) => void;
  onRegisterOwner: (ownerData: {
    name: string;
    email: string;
    dogName: string;
    dogSize: DogSize;
    dogBreed: string;
    dogBio: string;
    dogSpecialNeeds: string;
  }) => void;
  currentEmail: string;
}

const AVATAR_OPTIONS = ['👨‍💼', '👩‍💼', '🧑‍🤝‍🧑', '👨‍🌾', '👩‍⚕️', '🧑‍💻', '👩‍🍳', '🤵', '🦸', '🎨', '🦁', '🐻', '🐼', '🐨', '🦊'];

const SPECIALTY_PRESETS = [
  'Puppy Care',
  'Senior Dogs',
  'First Aid Trained',
  'Large Yard',
  'Medication Administration',
  'Constant Supervision',
  'Daily Photo Updates',
  'High Energy Dogs',
  'Behavioral Correction',
  'Trail Hiking',
  'Anxious Dogs',
  'Lap Snugglers',
  'Small Dog Expert',
  'Calm Environment',
  'Homemade Treats',
  'Oral Medication'
];

export default function RegistrationModal({
  onClose,
  onRegisterSitter,
  onRegisterOwner,
  currentEmail
}: RegistrationModalProps) {
  const [regType, setRegType] = useState<'select' | 'owner' | 'sitter'>('select');
  
  // COMMON STATE
  const [step, setStep] = useState(1);

  // OWNER REGISTRATION FIELDS
  const [ownerName, setOwnerName] = useState('Marcus Lim');
  const [ownerEmail, setOwnerEmail] = useState(currentEmail);
  const [dogName, setDogName] = useState('');
  const [dogSize, setDogSize] = useState<DogSize>('medium');
  const [dogBreed, setDogBreed] = useState('');
  const [dogBio, setDogBio] = useState('');
  const [dogSpecialNeeds, setDogSpecialNeeds] = useState('');

  // SITTER REGISTRATION FIELDS
  const [sitterName, setSitterName] = useState('');
  const [sitterAvatar, setSitterAvatar] = useState('👩‍💼');
  const [sitterBio, setSitterBio] = useState('');
  const [sitterRate, setSitterRate] = useState<number>(25);
  const [sitterLocation, setSitterLocation] = useState(LOCATIONS[0]);
  const [sitterServices, setSitterServices] = useState<ServiceType[]>(['Sitting']);
  const [sitterSpecialties, setSitterSpecialties] = useState<string[]>(['Puppy Care']);
  const [sitterMaxDogSize, setSitterMaxDogSize] = useState<DogSize>('medium');
  const [customSpecialty, setCustomSpecialty] = useState('');

  // Sitter Map position coordinates
  const [lat, setLat] = useState<number>(Math.floor(Math.random() * 50) + 25);
  const [lng, setLng] = useState<number>(Math.floor(Math.random() * 50) + 25);

  const toggleService = (srv: ServiceType) => {
    if (sitterServices.includes(srv)) {
      if (sitterServices.length > 1) {
        setSitterServices(sitterServices.filter(s => s !== srv));
      }
    } else {
      setSitterServices([...sitterServices, srv]);
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (sitterSpecialties.includes(spec)) {
      setSitterSpecialties(sitterSpecialties.filter(s => s !== spec));
    } else {
      setSitterSpecialties([...sitterSpecialties, spec]);
    }
  };

  const addCustomSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSpecialty.trim() && !sitterSpecialties.includes(customSpecialty.trim())) {
      setSitterSpecialties([...sitterSpecialties, customSpecialty.trim()]);
      setCustomSpecialty('');
    }
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !dogName.trim() || !dogBreed.trim()) return;

    onRegisterOwner({
      name: ownerName,
      email: ownerEmail,
      dogName,
      dogSize,
      dogBreed,
      dogBio,
      dogSpecialNeeds
    });
  };

  const handleSitterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sitterName.trim() || !sitterBio.trim()) return;

    const newSitter: SitterProfile = {
      id: `sitter-custom-${Date.now()}`,
      name: sitterName,
      avatar: sitterAvatar,
      bio: sitterBio,
      rate: sitterRate,
      rating: 5.0,
      totalReviews: 0,
      location: sitterLocation,
      services: sitterServices,
      specialties: sitterSpecialties.length > 0 ? sitterSpecialties : ['All-Round Care'],
      maxDogSize: sitterMaxDogSize,
      lat,
      lng,
      verified: true,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    onRegisterSitter(newSitter);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col relative overflow-hidden transform transition-all duration-300">
        
        {/* Modal Top Banner Decor */}
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 h-2 w-full shrink-0" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 text-left">
            <div className="p-2 bg-violet-50 rounded-xl text-violet-700">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 leading-tight">
                {regType === 'select' && 'Join the BarkSitter Trust Network'}
                {regType === 'owner' && 'Owner Registration Portal'}
                {regType === 'sitter' && 'Become a Certified Sitter'}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold">
                {regType === 'select' && 'Select your access pathway and join our local pet network'}
                {regType === 'owner' && 'Register your pup’s unique schedule, medication & breed'}
                {regType === 'sitter' && 'Set your rates, specialties range, and define your home hub'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl shadow-2xs transition"
          >
            Cancel
          </button>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="p-6 overflow-y-auto max-h-[70vh] text-left">
          
          {/* TYPE SELECTION PATHWAY */}
          {regType === 'select' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4 text-xs font-semibold text-slate-600 leading-relaxed border border-slate-100">
                ⭐ <span className="text-violet-700 font-extrabold">Instant Integration:</span> Join 200+ local pet sitters and companion owners in your neighbourhood. Registered accounts gain active dashboard modules, instant message coordination and metric checkups.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pathway Card: Owner */}
                <button
                  id="reg-opt-owner"
                  onClick={() => {
                    setRegType('owner');
                    setStep(1);
                  }}
                  className="p-6 rounded-2xl border-2 border-slate-150 hover:border-violet-500 bg-white text-left hover:shadow-md transition flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 bg-violet-50 text-violet-700 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      🐕
                    </div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">I am a Dog Parent (Owner)</h4>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                      Register your pup, create booking stays, find custom matching caretakers, and write live coordination notes.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-violet-600 inline-flex items-center space-x-1">
                    <span>Register Pup</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>

                {/* Pathway Card: Sitter */}
                <button
                  id="reg-opt-sitter"
                  onClick={() => {
                    setRegType('sitter');
                    setStep(1);
                  }}
                  className="p-6 rounded-2xl border-2 border-slate-150 hover:border-fuchsia-500 bg-white text-left hover:shadow-md transition flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="h-10 w-10 bg-fuchsia-100 text-fuchsia-700 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      💼
                    </div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">I am a Care Provider (Sitter)</h4>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                      List your services, manage bookings, customize pet size limits, choose a mascot emoji, and choose your spot on the map.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-fuchsia-600 inline-flex items-center space-x-1">
                    <span>Apply as Sitter</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>

              </div>
            </div>
          )}

          {/* OWNER REGISTRATION FORM */}
          {regType === 'owner' && (
            <form onSubmit={handleOwnerSubmit} className="space-y-5">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Step {step} of 2 • {step === 1 ? 'Parent Credentials' : 'Dog Profile Card'}
                </span>
                <div className="flex space-x-1">
                  <div className={`h-1.5 w-6 rounded-full ${step >= 1 ? 'bg-violet-600' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-6 rounded-full ${step >= 2 ? 'bg-violet-600' : 'bg-slate-200'}`} />
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4 animate-fade-in animate-duration-200">
                  <div className="bg-violet-50 text-violet-800 text-xs font-semibold p-3.5 rounded-xl border border-violet-100">
                    💡 <span className="font-extrabold">Setup Profile:</span> Let local caregivers know a little bit about you. All communications are bound securely.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Owner Full Name</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Marcus Lim"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Registered Contact Email</label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      disabled
                      placeholder="marcus.lim83@gmail.com"
                      className="w-full bg-slate-100/80 border border-slate-200 text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-500"
                    />
                    <span className="text-[9px] text-slate-400 block font-medium">Synced with verified active Google email credentials</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in animate-duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Dog’s Name</label>
                      <input
                        type="text"
                        required
                        value={dogName}
                        onChange={(e) => setDogName(e.target.value)}
                        placeholder="Buddy / Bailey"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Dog Breed</label>
                      <input
                        type="text"
                        required
                        value={dogBreed}
                        onChange={(e) => setDogBreed(e.target.value)}
                        placeholder="e.g. Toy Poodle"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Weight size class in KG */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Size Group Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as DogSize[]).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setDogSize(size)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                            dogSize === size
                              ? 'bg-violet-600 border-violet-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                          }`}
                        >
                          <span className={`text-lg transition opacity-90 ${size === 'large' ? 'scale-110' : size === 'small' ? 'scale-90' : 'scale-100'}`}>
                            🦮
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider block font-mono">
                            {size === 'small' ? 'Small (<11kg)' : size === 'medium' ? 'Med (11-23kg)' : 'Large (23kg+)'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Pup Bio Description & Likes</label>
                    <textarea
                      value={dogBio}
                      onChange={(e) => setDogBio(e.target.value)}
                      placeholder="e.g. High energy, friendly, loves fetch and sits, enjoys meeting other mini dogs."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Special Needs / Care Notes (Optional)</label>
                    <input
                      type="text"
                      value={dogSpecialNeeds}
                      onChange={(e) => setDogSpecialNeeds(e.target.value)}
                      placeholder="e.g. Needs medication twice daily, picky eater, gets anxious around loud trucks"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* Action Rows */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6 shrink-0">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRegType('select')}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Change Account Type
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition flex items-center space-x-1"
                  >
                    <span>Define Dog Profile</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-black px-6 py-2.5 rounded-xl transition shadow-md shadow-violet-600/10 flex items-center space-x-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Complete Owner Registration</span>
                  </button>
                )}
              </div>

            </form>
          )}

          {/* SITTER REGISTRATION FORM */}
          {regType === 'sitter' && (
            <form onSubmit={handleSitterSubmit} className="space-y-5">
              
              {/* Step indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Step {step} of 3 • {step === 1 ? 'Caregiver Details' : step === 2 ? 'Experience & Limitations' : 'Map Your Spot'}
                </span>
                <div className="flex space-x-1">
                  <div className={`h-1.5 w-6 rounded-full ${step >= 1 ? 'bg-fuchsia-600' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-6 rounded-full ${step >= 2 ? 'bg-fuchsia-600' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-6 rounded-full ${step >= 3 ? 'bg-fuchsia-600' : 'bg-slate-200'}`} />
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Sitter Profile Bio Pitch</label>
                    <textarea
                      required
                      value={sitterBio}
                      onChange={(e) => setSitterBio(e.target.value)}
                      placeholder="Write 2-3 sentences to pitch yourself. Let clients know where you sits, if you have a fenced yard, your history with dogs, etc."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Sitter Business / Full Name</label>
                      <input
                        type="text"
                        required
                        value={sitterName}
                        onChange={(e) => setSitterName(e.target.value)}
                        placeholder="e.g. Sophie Turner"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Daily / Hourly Rate ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="number"
                          required
                          min="5"
                          max="150"
                          value={sitterRate}
                          onChange={(e) => setSitterRate(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:bg-white text-xs rounded-xl pl-8 pr-3.5 py-3 outline-none font-mono font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sitter Avatar selector */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Choose Mascot Avatar Emoji</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl max-h-[100px] overflow-y-auto">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSitterAvatar(av)}
                          className={`h-10 w-10 text-xl flex items-center justify-center rounded-xl border transition ${
                            sitterAvatar === av 
                              ? 'bg-fuchsia-600 border-fuchsia-600 text-white scale-110 shadow-xs' 
                              : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                          } cursor-pointer`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in text-left">
                  
                  {/* Select Neighborhood */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Primary Neighborhood Location</label>
                    <select
                      value={sitterLocation}
                      onChange={(e) => setSitterLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:bg-white text-xs rounded-xl px-3.5 py-3 outline-none font-semibold text-slate-700 cursor-pointer"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Weight size class limit */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Maximum Dog Size Welcomed</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as DogSize[]).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSitterMaxDogSize(size)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                            sitterMaxDogSize === size
                              ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                          }`}
                        >
                          <span className="text-sm font-bold uppercase tracking-wider block font-mono">
                            {size === 'small' ? 'Small (<11kg)' : size === 'medium' ? 'Med (11-23kg)' : 'Large (23kg+)'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Services offered checkboxes */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Services You Offer</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Sitting', 'Walking', 'Overnight Boarding'] as ServiceType[]).map((srv) => {
                        const isSel = sitterServices.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => toggleService(srv)}
                            className={`p-2.5 rounded-xl border text-[10px] font-bold transition cursor-pointer leading-tight text-center ${
                              isSel 
                                ? 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-300' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specialties checklist */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Select Specialties & Trust Tags</label>
                    <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      {SPECIALTY_PRESETS.map((spec) => {
                        const isSel = sitterSpecialties.includes(spec);
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => toggleSpecialty(spec)}
                            className={`px-2.5 py-1.5 rounded-lg text-[9.5px] font-bold transition cursor-pointer select-none leading-none ${
                              isSel 
                                ? 'bg-fuchsia-600 text-white shadow-3xs' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {spec}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-fade-in text-left">
                  <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-4 text-xs font-semibold text-indigo-900 leading-relaxed flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="font-extrabold text-indigo-950">Set Your Map Safe Zone Coordinate</p>
                      <p className="text-indigo-800 text-[11px] font-medium leading-normal mt-1">
                        Tap anywhere within the coordinate zone mapping canvas below to indicate where your boarding neighborhood is. This determines your relative grid center point in search vectors!
                      </p>
                    </div>
                  </div>

                  {/* Interactive mock map targeter */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                      const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                      setLng(Math.max(10, Math.min(90, Math.floor(clickX))));
                      setLat(Math.max(10, Math.min(90, Math.floor(clickY))));
                    }}
                    className="w-full h-48 bg-teal-50/70 border-2 border-dashed border-indigo-200 rounded-3xl relative overflow-hidden cursor-crosshair hover:bg-teal-50 transition"
                  >
                    {/* Simulated visual layout decorations of map */}
                    <div className="absolute inset-4 bg-emerald-100/40 rounded-full blur-xl" />
                    <div className="absolute right-8 top-6 bg-blue-100/40 w-24 h-24 rounded-full blur-lg" />
                    
                    {/* Rivers or parks lines */}
                    <div className="absolute left-0 right-0 h-4 bg-teal-100/30 rotate-12 top-20" />
                    <div className="absolute left-1/4 top-0 bottom-0 w-3.5 bg-slate-200/50 -rotate-45" />

                    {/* Zone markers */}
                    <span className="absolute top-4 left-6 text-[9px] font-black uppercase text-slate-400 font-mono">NORTH ZONE</span>
                    <span className="absolute bottom-4 right-6 text-[9px] font-black uppercase text-slate-400 font-mono">SOUTH HILLS</span>

                    {/* Sitter coordinate interactive pin feedback */}
                    <div 
                      style={{ left: `${lng}%`, top: `${lat}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center tracking-none transform transition-all duration-300 z-10"
                    >
                      <div className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white text-xs font-black p-2 rounded-xl shadow-lg flex items-center space-x-1 border border-white/20 select-none animate-bounce">
                        <span>📍 {sitterAvatar} {sitterName || 'My Hub'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-500 font-mono font-bold uppercase">
                    <span>COORDINATES RETRIEVED:</span>
                    <span>LAT DEG: {lat}% • LNG DEG: {lng}%</span>
                  </div>
                </div>
              )}

              {/* Action Rows */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6 shrink-0 font-sans">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRegType('select')}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Change Account Type
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition flex items-center space-x-1"
                  >
                    <span>{step === 1 ? 'Configure Service Specs' : 'Select Location Coordinate'}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white text-xs font-black px-6 py-2.5 rounded-xl transition shadow-md shadow-fuchsia-600/10 flex items-center space-x-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Go Live On Directory</span>
                  </button>
                )}
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
