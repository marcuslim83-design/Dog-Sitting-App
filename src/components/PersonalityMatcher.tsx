import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dog, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Moon, 
  Activity, 
  Smile, 
  Heart, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  UserCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { SitterProfile, DogSize } from '../types';

interface PersonalityMatcherProps {
  sitters: SitterProfile[];
  onApplyFilter: (keyword: string, maxSize: DogSize | 'All') => void;
  onBookSitter: (sitterId: string) => void;
}

type ArchetypeId = 'adventurer' | 'socialite' | 'serene' | 'pampered';

interface Archetype {
  id: ArchetypeId;
  title: string;
  emoji: string;
  colorClass: string;
  bgGradient: string;
  description: string;
  recommendedKeywords: string[];
  maxSizeFilter: DogSize;
}

const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  adventurer: {
    id: 'adventurer',
    title: 'High-Energy Wild Adventurer',
    emoji: '⚡🐕',
    colorClass: 'text-violet-700 bg-violet-100 border-violet-200',
    bgGradient: 'from-violet-50 to-indigo-50/50',
    description: 'This dog has infinite batteries! They love long pack trail hikes, chasing agility obstacles, and running endless yard zoomies. They need an active caregiver who can keep up with their stamina and provide intense outdoor activities.',
    recommendedKeywords: ['High Energy', 'Agility', 'Yard', 'Hiking'],
    maxSizeFilter: 'large',
  },
  socialite: {
    id: 'socialite',
    title: 'Playful Social Butterfly',
    emoji: '🎉🐾',
    colorClass: 'text-fuchsia-700 bg-fuchsia-100 border-fuchsia-200',
    bgGradient: 'from-fuchsia-50 to-pink-50/50',
    description: 'A friendly pet companion who absolutely adores meeting other dogs and humans! They thrive under constant supervision and love social settings, active playmates, and getting daily photos taken to show off their happy grin.',
    recommendedKeywords: ['Socialization', 'Puppy Care', 'Photo Updates', 'Constant Supervision'],
    maxSizeFilter: 'medium',
  },
  serene: {
    id: 'serene',
    title: 'Sensitive & Quiet Gentle Soul',
    emoji: '🌸🧸',
    colorClass: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    bgGradient: 'from-emerald-50 to-teal-50/50',
    description: 'A peaceful companion who prefers a quiet environment, soft voices, and gentle lap cuddles. They might be a bit anxious or elderly, requiring specialized care, medicated eye runs, or vet-trained attention to feel secure.',
    recommendedKeywords: ['Anxious Dogs', 'Special Needs', 'Medication', 'Lap Snugglers'],
    maxSizeFilter: 'small',
  },
  pampered: {
    id: 'pampered',
    title: 'Pampered Royal Couch Potato',
    emoji: '👑🍔',
    colorClass: 'text-amber-700 bg-amber-100 border-amber-200',
    bgGradient: 'from-amber-50 to-orange-50/50',
    description: 'A majestic companion whose favorite sport is sleeping in sunbeams and munching on healthy homemade single-ingredient dog pastries. They require standard comfort and premium treat curation with plenty of naps.',
    recommendedKeywords: ['Homemade Treats', 'Calm Environment', 'Spacious', 'Sits'],
    maxSizeFilter: 'medium',
  },
};

export default function PersonalityMatcher({ sitters, onApplyFilter, onBookSitter }: PersonalityMatcherProps) {
  const [step, setStep] = useState<number>(0);
  const [dogName, setDogName] = useState<string>('');
  const [dogSize, setDogSize] = useState<DogSize>('medium');
  const [energyLevel, setEnergyLevel] = useState<number>(2); // 1 = Low (Couch Potato), 2 = Med (Moderate), 3 = High (Zoomies)
  const [sociability, setSociability] = useState<number>(2); // 1 = Reserved, 2 = Friendly, 3 = Bark Party
  const [specialNeed, setSpecialNeed] = useState<string>('cuddling'); // cuddling, medication, active, treats
  const [matchedArchetype, setMatchedArchetype] = useState<Archetype | null>(null);
  const [recommendedSitters, setRecommendedSitters] = useState<SitterProfile[]>([]);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  // Restart Quiz
  const handleRestart = () => {
    setStep(0);
    setMatchedArchetype(null);
    setRecommendedSitters([]);
    setFilterApplied(false);
  };

  // Skip / Continue Step 1
  const handleFirstStepNext = () => {
    if (!dogName.trim()) {
      setDogName('Buddy'); // default placeholder if blank
    }
    setStep(1);
  };

  // Match Calculation Logic
  const handleCalculateMatch = () => {
    let archetypeKey: ArchetypeId = 'pampered';

    // Core branching pathways
    if (energyLevel === 3) {
      if (specialNeed === 'active') {
        archetypeKey = 'adventurer';
      } else {
        archetypeKey = 'socialite';
      }
    } else if (sociability === 1 || specialNeed === 'medication') {
      archetypeKey = 'serene';
    } else if (specialNeed === 'treats') {
      archetypeKey = 'pampered';
    } else if (energyLevel === 1) {
      archetypeKey = 'serene';
    } else {
      // Balanced default case
      archetypeKey = 'socialite';
    }

    const arch = ARCHETYPES[archetypeKey];
    setMatchedArchetype(arch);

    // Dynamic Sitter score ranking based on matched keywords and specialties
    const ranked = sitters.map(sitter => {
      let score = 0;
      
      // Match size
      const maxAllowedSizeOrder = sitter.maxDogSize === 'large' ? 3 : sitter.maxDogSize === 'medium' ? 2 : 1;
      const requestedDogSizeOrder = dogSize === 'large' ? 3 : dogSize === 'medium' ? 2 : 1;
      
      if (maxAllowedSizeOrder >= requestedDogSizeOrder) {
        score += 3; // base score if sitter accepts their size
      } else {
        score -= 10; // penalty if pet is too large
      }

      // Specialty alignment
      arch.recommendedKeywords.forEach(keyword => {
        // check specialties
        const hasSpecialty = sitter.specialties.some(spec => 
          spec.toLowerCase().includes(keyword.toLowerCase())
        );
        if (hasSpecialty) score += 4;

        // check bio text
        if (sitter.bio.toLowerCase().includes(keyword.toLowerCase())) {
          score += 2;
        }
      });

      // Rating bonus
      score += sitter.rating;

      return { sitter, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.sitter)
    .slice(0, 2); // Best 2 caregivers matching

    setRecommendedSitters(ranked);
    setStep(2);
  };

  const handleApplyFilterToScreen = () => {
    if (!matchedArchetype) return;
    // Apply primary matched keyword to filter results
    const filterKeyword = matchedArchetype.recommendedKeywords[0];
    onApplyFilter(filterKeyword, dogSize);
    setFilterApplied(true);
    
    // Quick auto scroll to sitters list section
    const elm = document.getElementById('sitters-heading');
    if (elm) {
      elm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full text-left">
      
      {/* Brand Mini-Header Banner */}
      <div className="bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Pawsome Personality Matcher</h3>
            <p className="text-[9px] text-slate-400 font-semibold">Match your dog’s spirit to the exact perfect sitter</p>
          </div>
        </div>
        {step > 0 && (
          <button 
            onClick={handleRestart} 
            className="flex items-center space-x-1 text-[10px] bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 font-extrabold px-2 py-1 rounded-lg transition"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: DOG PROFILE INITIALIZATION */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4 flex-grow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="bg-gradient-to-tr from-violet-50 via-slate-50 to-white rounded-2xl p-4 border border-violet-100 text-xs text-slate-600 leading-relaxed font-semibold">
                  🐶 <span className="text-violet-800">New Feature:</span> Not sure which sitter meets your companion's pace? Decode your dog's distinct behavioral archetype and let AI highlight matching local caregivers.
                </div>

                {/* Input Dog Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Dog’s Name</label>
                  <input
                    type="text"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    placeholder="Buddy / Bailey"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-semibold text-slate-700"
                  />
                </div>

                {/* Select Dog Size */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Size Group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['small', 'medium', 'large'] as DogSize[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setDogSize(size)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                          dogSize === size
                            ? 'bg-violet-600 border-violet-600 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-lg transition opacity-90 ${size === 'large' ? 'scale-115' : size === 'small' ? 'scale-85' : 'scale-100'}`}>
                          🦮
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider block font-mono">
                          {size === 'small' ? 'Small (<11kg)' : size === 'medium' ? 'Med (11-23kg)' : 'Large (23kg+)'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 text-right">
                <button
                  onClick={handleFirstStepNext}
                  className="w-full sm:w-auto ml-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-md shadow-violet-600/15 flex items-center justify-center space-x-1.5"
                >
                  <span>Introduce {dogName || 'Your Pup'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: BEHAVIORAL QUESTIONS */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4 flex-grow flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Sliders / Questions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                    <span>⚡ Daily Energy Level</span>
                    <span className="text-violet-700 font-semibold font-sans">
                      {energyLevel === 1 ? '😴 Couch Sloth' : energyLevel === 2 ? '🐕 Playful Ambler' : '⚡ Zoomie Champion'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3.5 py-1">
                    <Moon className={`h-4 w-4 ${energyLevel === 1 ? 'text-violet-600' : 'text-slate-300'}`} />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(Number(e.target.value))}
                      className="flex-grow h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <Zap className={`h-4 w-4 ${energyLevel === 3 ? 'text-violet-600 animate-pulse' : 'text-slate-300'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                    <span>🤝 Social Butterfly Scale</span>
                    <span className="text-fuchsia-700 font-semibold font-sans">
                      {sociability === 1 ? '🫣 Reserved / Shy' : sociability === 2 ? '🤝 Friendly Pal' : '🎉 Dog-Park Hostess'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3.5 py-1">
                    <ShieldAlert className={`h-4 w-4 ${sociability === 1 ? 'text-fuchsia-600' : 'text-slate-300'}`} />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={sociability}
                      onChange={(e) => setSociability(Number(e.target.value))}
                      className="flex-grow h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-fuchsia-600"
                    />
                    <Smile className={`h-4 w-4 ${sociability === 3 ? 'text-fuchsia-600 animate-bounce' : 'text-slate-300'}`} />
                  </div>
                </div>

                {/* Specialty Care Target */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Primary Pamper Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'cuddling', text: '🥰 Endorping Snuggle Fests', icon: Heart },
                      { key: 'medication', text: '🩺 Senior care / Meds', icon: Award },
                      { key: 'active', text: '🏃 Agility agility & trails', icon: Activity },
                      { key: 'treats', text: '🍪 Gourmet custom treats', icon: Sparkles },
                    ].map((pref) => {
                      const Icon = pref.icon;
                      return (
                        <div
                          key={pref.key}
                          onClick={() => setSpecialNeed(pref.key)}
                          className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 cursor-pointer transition select-none ${
                            specialNeed === pref.key
                              ? 'bg-fuchsia-500/5 border-fuchsia-400 font-bold text-fuchsia-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon className={`h-3.5 w-3.5 shrink-0 ${specialNeed === pref.key ? 'text-fuchsia-600 animate-pulse' : 'text-slate-400'}`} />
                          <span className="leading-tight text-[10px] font-semibold">{pref.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between space-x-3.5">
                <button
                  onClick={() => setStep(0)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs font-black px-4 py-2.5 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCalculateMatch}
                  className="flex-grow bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-black py-2.5 rounded-xl transition shadow-lg shadow-violet-600/10 flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="h-4 w-4 animate-spin-slow" />
                  <span>Reveal Personality Archetype</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: REVEAL RESULTS AND RECOMMENDED SITTERS */}
          {step === 2 && matchedArchetype && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4 flex-grow"
            >
              {/* Dynamic Badge Display */}
              <div className={`rounded-2xl p-4 border text-left flex flex-col space-y-2 bg-gradient-to-r ${matchedArchetype.bgGradient} border-slate-100`}>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{matchedArchetype.emoji}</span>
                  <div>
                    <span className="text-[8px] font-bold text-fuchsia-600 tracking-wider uppercase font-mono block">Decoded Spirit</span>
                    <h4 className="text-sm font-black text-slate-800 leading-tight">
                      {dogName} is an <span className="bg-gradient-to-r from-violet-700 to-fuchsia-700 bg-clip-text text-transparent font-black">{matchedArchetype.title}</span>!
                    </h4>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                  {matchedArchetype.description}
                </p>
              </div>

              {/* Match Highlights */}
              <div className="space-y-2.5 text-left">
                <div className="flex items-center justify-between">
                  <h5 className="text-[9px] font-bold uppercase text-slate-400 font-mono tracking-wider">Top Vetted Match Caregivers</h5>
                  <span className="text-[9px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md font-mono">Expert Alignment</span>
                </div>

                {recommendedSitters.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center font-medium py-3">No sitters currently match this size/energy perfectly.</p>
                ) : (
                  <div className="space-y-2">
                    {recommendedSitters.map((sitter) => (
                      <div 
                        key={sitter.id} 
                        className="bg-slate-50/60 border border-slate-150 rounded-xl p-3 flex items-center justify-between hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="h-10 w-10 bg-white border border-slate-200 text-2xl rounded-lg flex items-center justify-center shadow-xs">
                            {sitter.avatar}
                          </div>
                          <div className="text-left text-xs">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-extrabold text-slate-800 leading-none">{sitter.name}</span>
                              <span className="bg-emerald-50 text-emerald-700 text-[8px] px-1 rounded font-extrabold">{sitter.rating.toFixed(1)} ★</span>
                            </div>
                            <span className="text-[9px] text-slate-400 leading-none font-mono block mt-1">{sitter.location} • ${sitter.rate}/day</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onBookSitter(sitter.id)}
                          className="bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shrink-0"
                        >
                          <span>Reserve</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Map filters Integration Option */}
              <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
                <button
                  onClick={handleApplyFilterToScreen}
                  disabled={filterApplied}
                  className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition ${
                    filterApplied
                      ? 'bg-emerald-50 text-emerald-800 border-2 border-dashed border-emerald-200'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-md shadow-violet-600/10'
                  }`}
                >
                  {filterApplied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Matching Sitter Filter Applied!</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      <span>Filter main list of sitters for "{matchedArchetype.recommendedKeywords[0]}" matches</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="text-center text-[10px] text-slate-400 font-extrabold hover:text-slate-600 py-1"
                >
                  Test another pup vibe
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
