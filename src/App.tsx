import React, { useState, useEffect, useRef } from 'react';
import { supabase, saveEntry, getEntries, safeParse, isSupabaseConfigured } from './lib/supabaseClient';
import { DiscussionEmbed } from 'disqus-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Heart,
  BadgeInfo,
  ShieldCheck,
  Dog,
  Users,
  ChevronDown,
  Compass,
  ArrowUpDown,
  BookOpen,
  ArrowRightCircle,
  HelpCircle
} from 'lucide-react';

import { SitterProfile, Booking, Review, DogSize, ServiceType } from './types';
import { LOCATIONS, INITIAL_SITTERS, INITIAL_REVIEWS, INITIAL_BOOKINGS } from './mockData';

// Component Imports
import Header from './components/Header';
import SimulatedMap from './components/SimulatedMap';
import SitterCard from './components/SitterCard';
import SitterDetailModal from './components/SitterDetailModal';
import BookingModal from './components/BookingModal';
import SitterDashboard from './components/SitterDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import PersonalityMatcher from './components/PersonalityMatcher';
import SitterChatView from './components/SitterChatView';
import RegistrationModal from './components/RegistrationModal';

// Cute Dog Image Assets
import happyDogsHero from './assets/images/happy_dogs_hero_1779420349432.png';
import rustyGolden from './assets/images/rusty_golden_retriever_1779420380382.png';
import cutePoodleBuddy from './assets/images/cute_poodle_buddy_1779420400102.png';

const USER_EMAIL = 'marcus.lim83@gmail.com';

class DisqusForum extends React.Component<any> {
  // @ts-ignore
  props: any;

  render() {
    return (
      <DiscussionEmbed
        shortname='dog-sitting-1'
        config={
          {
            url: this.props.article.url,
            identifier: this.props.article.id,
            title: this.props.article.title,
            language: 'zh_TW' //e.g. for Traditional Chinese (Taiwan)
          }
        }
      />
    );
  }
}

export default function App() {
  // Global React States synced with client localStorage for instant persistence!
  const [role, setRole] = useState<'owner' | 'sitter' | 'social'>('owner');

  const [loading, setLoading] = useState(true);
  const [sitters, setSitters] = useState<SitterProfile[]>(INITIAL_SITTERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showRegistration, setShowRegistration] = useState(false);
  const [customPups, setCustomPups] = useState<any[]>([]);
  const [registeredOwner, setRegisteredOwner] = useState<any>(null);

  // Robust Supabase error & fallback states
  const [supabaseError, setSupabaseError] = useState<any>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [showSupabaseSetupModal, setShowSupabaseSetupModal] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const remoteUpdateRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    async function initSupabaseData() {
      const result = await getEntries();
      if (!active) return;

      if (result.success) {
        const dbData = result.data;
        
        // Populate or initialize pool entries
        if (dbData['barksitter_sitters_pool'] !== undefined) {
          setSitters(dbData['barksitter_sitters_pool']);
        } else {
          await saveEntry('barksitter_sitters_pool', INITIAL_SITTERS);
        }

        if (dbData['barksitter_bookings_pool'] !== undefined) {
          setBookings(dbData['barksitter_bookings_pool']);
        } else {
          await saveEntry('barksitter_bookings_pool', INITIAL_BOOKINGS);
        }

        if (dbData['barksitter_reviews_pool'] !== undefined) {
          setReviews(dbData['barksitter_reviews_pool']);
        } else {
          await saveEntry('barksitter_reviews_pool', INITIAL_REVIEWS);
        }

        if (dbData['barksitter_custom_pups_pool'] !== undefined) {
          setCustomPups(dbData['barksitter_custom_pups_pool']);
        } else {
          await saveEntry('barksitter_custom_pups_pool', []);
        }

        if (dbData['barksitter_registered_owner'] !== undefined) {
          setRegisteredOwner(dbData['barksitter_registered_owner']);
        } else {
          await saveEntry('barksitter_registered_owner', null);
        }
      } else {
        console.warn('Failed to load initial Supabase entries. Falling back to Local Storage client sandbox.', result.error);
        setSupabaseError(result.error);
        setIsUsingFallback(true);

        // Load values from Local Storage
        const savedSitters = localStorage.getItem('barksitter_sitters_pool');
        if (savedSitters) {
          setSitters(safeParse(savedSitters));
        }

        const savedBookings = localStorage.getItem('barksitter_bookings_pool');
        if (savedBookings) {
          setBookings(safeParse(savedBookings));
        }

        const savedReviews = localStorage.getItem('barksitter_reviews_pool');
        if (savedReviews) {
          setReviews(safeParse(savedReviews));
        }

        const savedPups = localStorage.getItem('barksitter_custom_pups_pool');
        if (savedPups) {
          setCustomPups(safeParse(savedPups));
        }

        const savedOwner = localStorage.getItem('barksitter_registered_owner');
        if (savedOwner) {
          setRegisteredOwner(safeParse(savedOwner));
        }
      }
      setLoading(false);
    }

    initSupabaseData();

    // Subscribe with .channel().on() so the UI updates with real-time events (if configured)
    let channel: any = null;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('entries_realtime_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'entries' },
          (payload) => {
            if (!active) return;
            console.log('Real-time database payload received:', payload);
            const newRow = payload.new as any;
            if (newRow) {
              const key = newRow.id || newRow.key;
              const val = newRow.value !== undefined ? newRow.value : newRow.data;
              if (key) {
                const parsedVal = safeParse(val);
                remoteUpdateRef.current[key] = true;
                
                if (key === 'barksitter_sitters_pool') {
                  setSitters(parsedVal);
                } else if (key === 'barksitter_bookings_pool') {
                  setBookings(parsedVal);
                } else if (key === 'barksitter_reviews_pool') {
                  setReviews(parsedVal);
                } else if (key === 'barksitter_custom_pups_pool') {
                  setCustomPups(parsedVal || []);
                } else if (key === 'barksitter_registered_owner') {
                  setRegisteredOwner(parsedVal);
                }
              }
            }
          }
        )
        .subscribe();
    }

    return () => {
      active = false;
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, []);

  // State Persistence watchers to Supabase & LocalStorage (keeps data safe both ways)
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('barksitter_sitters_pool', JSON.stringify(sitters));
    if (isUsingFallback) return;
    if (remoteUpdateRef.current['barksitter_sitters_pool']) {
      remoteUpdateRef.current['barksitter_sitters_pool'] = false;
      return;
    }
    saveEntry('barksitter_sitters_pool', sitters);
  }, [sitters, loading, isUsingFallback]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('barksitter_bookings_pool', JSON.stringify(bookings));
    if (isUsingFallback) return;
    if (remoteUpdateRef.current['barksitter_bookings_pool']) {
      remoteUpdateRef.current['barksitter_bookings_pool'] = false;
      return;
    }
    saveEntry('barksitter_bookings_pool', bookings);
  }, [bookings, loading, isUsingFallback]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('barksitter_reviews_pool', JSON.stringify(reviews));
    if (isUsingFallback) return;
    if (remoteUpdateRef.current['barksitter_reviews_pool']) {
      remoteUpdateRef.current['barksitter_reviews_pool'] = false;
      return;
    }
    saveEntry('barksitter_reviews_pool', reviews);
  }, [reviews, loading, isUsingFallback]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('barksitter_custom_pups_pool', JSON.stringify(customPups));
    if (isUsingFallback) return;
    if (remoteUpdateRef.current['barksitter_custom_pups_pool']) {
      remoteUpdateRef.current['barksitter_custom_pups_pool'] = false;
      return;
    }
    saveEntry('barksitter_custom_pups_pool', customPups);
  }, [customPups, loading, isUsingFallback]);

  useEffect(() => {
    if (loading) return;
    localStorage.setItem('barksitter_registered_owner', JSON.stringify(registeredOwner));
    if (isUsingFallback) return;
    if (remoteUpdateRef.current['barksitter_registered_owner']) {
      remoteUpdateRef.current['barksitter_registered_owner'] = false;
      return;
    }
    saveEntry('barksitter_registered_owner', registeredOwner);
  }, [registeredOwner, loading, isUsingFallback]);

  // Search/Filters states
  const [searchArea, setSearchArea] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [dogSizeFilter, setDogSizeFilter] = useState<string>('All');
  const [maxRate, setMaxRate] = useState<number>(40);
  const [keywordQuery, setKeywordQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rate-asc' | 'rate-desc' | 'rating'>('rating');

  // Modal / Selection Interactivity
  const [selectedSitterId, setSelectedSitterId] = useState<string | null>(null);
  const [detailSitterId, setDetailSitterId] = useState<string | null>(null);
  const [bookingSitterId, setBookingSitterId] = useState<string | null>(null);
  const [chattingSitterId, setChattingSitterId] = useState<string | null>(null);

  // Quick reservation success highlight overlay
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  // Extract Sitter Profile for current user (Emily Henderson) when they switch to Sitter Mode
  const MY_SITTER_ID = 'sitter-1';
  const mySitterProfile = sitters.find((s) => s.id === MY_SITTER_ID) || sitters[0];

  // Callback to update Sitter list
  const handleUpdateSitterProfile = (updatedProfile: SitterProfile) => {
    setSitters((prev) => prev.map((s) => (s.id === updatedProfile.id ? updatedProfile : s)));
  };

  const handleRegisterSitter = (newSitter: SitterProfile) => {
    setSitters((prev) => [newSitter, ...prev]);
    setShowRegistration(false);
    // Auto highlight/select the new sitter to let user see their work instantly!
    setSelectedSitterId(newSitter.id);
    setDetailSitterId(newSitter.id);
    alert(`🎉 Congratulations! Sitter profile "${newSitter.name}" has been successfully verified & listed live on the caregiving marketplace map and board!`);
  };

  const handleRegisterOwner = (ownerData: any) => {
    setRegisteredOwner(ownerData);
    const newDogObj = {
      id: `pup-custom-${Date.now()}`,
      name: ownerData.dogName,
      breed: ownerData.dogBreed,
      size: ownerData.dogSize,
      bio: ownerData.dogBio || 'A highly loved registered pup companion.',
      specialNeeds: ownerData.dogSpecialNeeds
    };
    setCustomPups((prev) => [newDogObj, ...prev]);
    setShowRegistration(false);
    alert(`🐶 Congratulations! Owner profile "${ownerData.name}" and your pup "${ownerData.dogName}" have been registered successfully! Buddy is now accompanied by your newly registered pup.`);
  };

  // Create Stay Booking request
  const handleConfirmNewBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBookings((prev) => [newBooking, ...prev]);
    setBookingSitterId(null);
    setDetailSitterId(null);
    setShowBookingSuccess(true);
    setTimeout(() => setShowBookingSuccess(false), 4000);
  };

  // Edit status of Booking acts
  const handleAcceptBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'confirmed' as const } : b))
    );
  };

  const handleDeclineBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const handleCompleteBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'completed' as const } : b))
    );
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // Add Stay review
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: `review-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
    };

    const newReviewsPool = [newReview, ...reviews];
    setReviews(newReviewsPool);

    // Dynamic Recalculation: Update sitter average rating & total counts reactive in sitters pool!
    setSitters((prevSitters) =>
      prevSitters.map((sitter) => {
        if (sitter.id === newReviewData.sitterId) {
          const profileReviews = newReviewsPool.filter((r) => r.sitterId === sitter.id);
          const average = profileReviews.reduce((sum, r) => sum + r.rating, 0) / profileReviews.length;
          return {
            ...sitter,
            rating: average,
            totalReviews: profileReviews.length
          };
        }
        return sitter;
      })
    );
  };

  // Sitter Search Filters Logic
  const filteredSitters = sitters
    .filter((sitter) => {
      // Area match
      if (searchArea !== 'All' && sitter.location !== searchArea) return false;
      // Service match
      if (serviceFilter !== 'All' && !sitter.services.includes(serviceFilter as ServiceType)) return false;
      // Dog size match
      if (dogSizeFilter !== 'All') {
        const sizeImportance: Record<DogSize, number> = { small: 1, medium: 2, large: 3 };
        const sitterAllowedLevel = sizeImportance[sitter.maxDogSize];
        const requestedLevel = sizeImportance[dogSizeFilter as DogSize];
        if (sitterAllowedLevel < requestedLevel) return false;
      }
      // Rate match
      if (sitter.rate > maxRate) return false;
      // Keywords text match
      if (keywordQuery.trim()) {
        const q = keywordQuery.toLowerCase();
        const matchesName = sitter.name.toLowerCase().includes(q);
        const matchesBio = sitter.bio.toLowerCase().includes(q);
        const matchesSpecs = sitter.specialties.some((spec) => spec.toLowerCase().includes(q));
        if (!matchesName && !matchesBio && !matchesSpecs) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rate-asc') return a.rate - b.rate;
      if (sortBy === 'rate-desc') return b.rate - a.rate;
      return b.rating - a.rating; // Default Rating high
    });

  // Keep track of which sitter details modal to open
  const detailSitter = sitters.find((s) => s.id === detailSitterId);
  const bookingSitter = sitters.find((s) => s.id === bookingSitterId);
  const chattingSitter = sitters.find((s) => s.id === chattingSitterId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col items-center justify-center font-sans antialiased">
        <div className="text-center space-y-4 animate-pulse">
          <div className="relative inline-flex mb-2">
            <span className="flex h-10 w-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-10 w-10 bg-fuchsia-100 border border-fuchsia-200 items-center justify-center text-xl">🐶</span>
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-700 tracking-tight font-mono uppercase">Connecting to Database...</h3>
          <p className="text-xs text-slate-400 max-w-xs leading-normal">Fetching secure, real-time sitter records &amp; active bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-fuchsia-100 selection:text-fuchsia-900 leading-normal antialiased">
      
      {/* Brand Header */}
      <Header currentRole={role} setRole={setRole} userEmail={USER_EMAIL} onOpenRegister={() => setShowRegistration(true)} />

      {/* Database Warning Banner */}
      {isUsingFallback && (
        <div className="bg-amber-50 border-b border-amber-200/80 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-2 text-amber-700">
              <span className="text-base text-amber-600">⚠️</span>
              <p className="text-xs font-semibold">
                <span className="font-bold">Database Config:</span> The Supabase <code className="bg-amber-100/90 px-1.5 py-0.5 rounded font-mono text-[10px]">entries</code> table was not found or failed to load. Running in local sandbox mode.
              </p>
            </div>
            <button
              id="btn-show-sql-guide"
              onClick={() => setShowSupabaseSetupModal(true)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-xs whitespace-nowrap"
            >
              Get SQL Setup Query
            </button>
          </div>
        </div>
      )}

      {/* Main Content View with transition constraints */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Booking success banners overlay indicator */}
        <AnimatePresence>
          {showBookingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-emerald-600 text-white rounded-2xl p-5 mb-8 shadow-lg shadow-emerald-600/10 flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-lg">
                  🐕
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">Stay Booking Invitation Dispatched Successfully!</h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Your pet sitter booking is marked. Go to "Owner Profile &gt; My Dog Sitting Stays" to monitor progress.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingSuccess(false)}
                className="text-white hover:text-emerald-100 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg ml-4"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OWNER PROFILE / BROWSE SCREEN */}
        {role === 'owner' ? (
          <div className="space-y-8">
            
            {/* Interactive Section Selector: Book vs Manage */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Sitter Discovery (Cards list + filters search) */}
              <div className="md:col-span-12 lg:col-span-7 space-y-6">
                
                {/* Beautiful Dog Hero Card Builder */}
                <div className="bg-gradient-to-tr from-violet-50/75 to-fuchsia-50/75 rounded-3xl p-6 border border-violet-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                  <div className="text-left space-y-3 md:max-w-[55%]">
                    <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] uppercase font-mono font-black tracking-widest px-2.5 py-1 rounded-full inline-block">
                      🐕 Trusted Neighborhood Sits
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                      Find and book trusted <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">dog sitters</span> near you
                    </h2>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Say goodbye to sitter hunting hurdles. Connect directly with verified, loving neighborhood pet caregivers offering customized sitting environment options.
                    </p>
                  </div>
                  <div className="w-full md:w-[40%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-white/60 shrink-0 relative group">
                    <img
                      src={happyDogsHero}
                      alt="Adorable Happy Dogs"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Highly Polished Advanced Search & Filter Board */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
                  
                  {/* Search and Area dropdown row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    {/* Search Field */}
                    <div className="sm:col-span-7 relative">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={keywordQuery}
                        onChange={(e) => setKeywordQuery(e.target.value)}
                        placeholder="Search sitters by name, bio keywords, or specialties..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-violet-500 rounded-2xl text-xs outline-none font-medium text-slate-700 transition"
                      />
                    </div>

                    {/* Area Select Dropdown */}
                    <div className="sm:col-span-5 relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                      <div className="flex-grow text-left">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Location/Region</span>
                        <select
                          value={searchArea}
                          onChange={(e) => {
                            setSearchArea(e.target.value);
                            setSelectedSitterId(null);
                          }}
                          className="w-full bg-transparent border-none text-xs font-bold text-slate-700 outline-none p-0 cursor-pointer"
                        >
                          <option value="All">All Neighborhoods</option>
                          {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Secondary filters row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-2 border-t border-slate-50">
                    {/* Service filter */}
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest mr-1.5 block">Service Package</span>
                      <select
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        className="mt-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl w-full text-slate-600 outline-none cursor-pointer"
                      >
                        <option value="All">Any Package</option>
                        <option value="Sitting">Sitting</option>
                        <option value="Walking">Walking</option>
                        <option value="Overnight Boarding">Overnight Boarding</option>
                      </select>
                    </div>

                    {/* Dog size */}
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest mr-1.5 block">My Dog's Size</span>
                      <select
                        value={dogSizeFilter}
                        onChange={(e) => setDogSizeFilter(e.target.value)}
                        className="mt-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-xl w-full text-slate-600 outline-none cursor-pointer"
                      >
                        <option value="All">Any Size Class</option>
                        <option value="small">Small (&lt;11 kg)</option>
                        <option value="medium">Medium (11-23 kg)</option>
                        <option value="large">Large (23+ kg)</option>
                      </select>
                    </div>

                    {/* Max Rate slider */}
                    <div className="text-left sm:col-span-2">
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest">
                        <span>Max rate: <span className="text-fuchsia-600 text-xs font-black">${maxRate}/day</span></span>
                        <span>$40 max</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="40"
                        value={maxRate}
                        onChange={(e) => setMaxRate(Number(e.target.value))}
                        className="mt-2.5 h-1.5 w-full bg-slate-150 rounded-lg appearance-none cursor-pointer accent-fuchsia-600"
                      />
                    </div>
                  </div>

                  {/* Sorter and summary counts bar */}
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium font-sans">
                    <div>
                      Found <span className="font-extrabold text-slate-800">{filteredSitters.length}</span> verified dog sitters
                    </div>
                    
                    <div className="flex items-center space-x-1.5">
                      <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent border-none text-xs font-bold text-slate-600 outline-none cursor-pointer"
                      >
                        <option value="rating">Sort by Rating</option>
                        <option value="rate-asc">Price: Low to High</option>
                        <option value="rate-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Interactive dog "Personality Matcher" */}
                <div className="mt-6 mb-8">
                  <PersonalityMatcher
                    sitters={sitters}
                    onApplyFilter={(keyword, maxSize) => {
                      setKeywordQuery(keyword);
                      if (maxSize !== 'All') {
                        setDogSizeFilter(maxSize);
                      }
                    }}
                    onBookSitter={(sitterId) => {
                      setBookingSitterId(sitterId);
                    }}
                  />
                </div>

                {/* Sitter Listing grid cards list */}
                <div id="sitters-heading" className="scroll-mt-24 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider">
                      Explore Local Caregivers Live Listing
                    </h3>
                  </div>
                  {filteredSitters.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 flex flex-col items-center">
                      <Dog className="h-12 w-12 text-slate-300 animate-pulse mb-3" />
                      <p className="text-sm font-extrabold text-slate-700">No sitters match your criteria</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        Try widening your neighborhood area, service types, or max daily price filters.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredSitters.map((sitter) => (
                        <SitterCard
                          key={sitter.id}
                          sitter={sitter}
                          isSelected={selectedSitterId === sitter.id}
                          onSelect={() => {
                            setSelectedSitterId(sitter.id);
                            setDetailSitterId(sitter.id);
                          }}
                          onBook={() => setBookingSitterId(sitter.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Community Certified Packs Gallery */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-left mt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
                      <span>🐶</span> Happy Neighborhood Pack Gallery
                    </h4>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      Meet some local furry regular companions looked after and boarded by vetted BarkSitters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Golden Retriever Rusty */}
                    <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-150 flex items-center space-x-3.5 hover:shadow-xs transition duration-200">
                      <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                        <img
                          src={rustyGolden}
                          alt="Rusty Golden Retriever"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h5 className="text-xs font-extrabold text-slate-800">Rusty</h5>
                        <p className="text-[9px] text-fuchsia-600 font-mono tracking-wider font-extrabold uppercase">Golden Retriever</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium leading-snug">Chloe & Marcus's playful pet host</p>
                      </div>
                    </div>

                    {/* Toy Poodle Buddy */}
                    <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-150 flex items-center space-x-3.5 hover:shadow-xs transition duration-200">
                      <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white">
                        <img
                          src={cutePoodleBuddy}
                          alt="Buddy Apricot Toy Poodle"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h5 className="text-xs font-extrabold text-slate-800">Buddy</h5>
                        <p className="text-[9px] text-violet-600 font-mono tracking-wider font-extrabold uppercase">Toy Poodle</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium leading-snug">Marcus's sweet lap adventurer</p>
                      </div>
                    </div>

                    {/* Custom Registered Pups */}
                    {customPups.map((pup) => (
                      <div key={pup.id} className="bg-gradient-to-tr from-violet-50/40 to-fuchsia-50/40 rounded-2xl p-3.5 border border-violet-150 flex items-center space-x-3.5 hover:shadow-xs transition duration-200 animate-fade-in">
                        <div className="h-14 w-14 rounded-xl shrink-0 shadow-sm border border-white bg-white flex items-center justify-center text-3xl">
                          🐕
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-1.5">
                            <h5 className="text-xs font-extrabold text-slate-800 leading-none">{pup.name}</h5>
                            <span className="text-[8px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold font-mono uppercase tracking-wider block leading-none">Vetted Pup</span>
                          </div>
                          <p className="text-[9px] text-violet-600 font-mono tracking-wider font-extrabold uppercase mt-1">{pup.breed}</p>
                          <p className="text-[10px] text-slate-550 mt-1 font-medium leading-snug italic truncate max-w-[180px]">{pup.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Simulated Map (collapsible/visible depending on layout) */}
              <div className="md:col-span-12 lg:col-span-5 h-[400px] lg:h-[720px] sticky top-24">
                <SimulatedMap
                  sitters={filteredSitters}
                  selectedSitterId={selectedSitterId}
                  onSelectSitter={(id) => {
                    setSelectedSitterId(id);
                    if (id) {
                      setDetailSitterId(id);
                    }
                  }}
                  currentAreaFilter={searchArea}
                />
              </div>

            </div>

            {/* LOWER PORTION: Parent's Dashboard (Track stays, messaging Coordination) */}
            <hr className="border-t border-slate-200/65 my-12" />
            
            <div className="space-y-4">
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Active Owner Management</h3>
                <p className="text-xs text-slate-400 font-medium">Coordinate ongoing visits, message with your sitter, or evaluate finalized stay reviews.</p>
              </div>
              
              <OwnerDashboard
                bookings={bookings}
                sitters={sitters}
                reviews={reviews}
                onAddReview={handleAddReview}
                onCancelBooking={handleCancelBooking}
                userEmail={USER_EMAIL}
                onChatWithSitter={setChattingSitterId}
                registeredOwner={registeredOwner}
              />
            </div>

          </div>
        ) : role === 'sitter' ? (
          /* SITTER MODE DASHBOARD */
          <SitterDashboard
            mySitterProfile={mySitterProfile}
            onUpdateProfile={handleUpdateSitterProfile}
            bookings={bookings}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            onCompleteBooking={handleCompleteBooking}
          />
        ) : (
          /* SOCIAL BOARD WITH DISQUS EMBED FORUM */
          <div className="space-y-8 text-left">
            {/* Header / Hero */}
            <div className="bg-gradient-to-tr from-fuchsia-50 to-violet-50 rounded-3xl p-6 sm:p-8 border border-fuchsia-100/80 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="space-y-3 md:max-w-[65%]">
                <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white text-[10px] uppercase font-mono font-black tracking-widest px-2.5 py-1 rounded-full inline-block">
                  💬 BarkSitter Social Board
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Welcome to our <span className="bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent font-sans">Pet Community</span> Discussion
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Join our Traditional Chinese (Taiwan - zh_TW) moderated Disqus forum board! Discuss dog nutrition, best dog walking parks, share funny puppy pictures, or establish matches with active local pet parents and pet sitters.
                </p>
              </div>
              <div className="text-6xl p-4 bg-white/80 rounded-2xl shadow-xs border border-white/60 select-none animate-bounce">
                💬
              </div>
            </div>

            {/* Core Community Hot Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:border-violet-200 transition">
                <span className="text-2xl">🧸</span>
                <h4 className="text-sm font-bold text-slate-800 mt-3">Anxiety Tips in New Stays</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  How do you deal when a puppy cries the first night? Read community solutions and tips on calming strategies.
                </p>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:border-violet-200 transition">
                <span className="text-2xl">🥕</span>
                <h4 className="text-sm font-bold text-slate-800 mt-3">Healthy Homemade Treats</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Quick recipes for dog biscuits with sweet potato and pumpkin! Safe and verified by neighborhood dog sitters.
                </p>
              </div>
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:border-violet-200 transition">
                <span className="text-2xl">🌳</span>
                <h4 className="text-sm font-bold text-slate-800 mt-3">Great Dog Parks</h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Find fully fenced spaces with water fountains and agility courses. Connect with other dog walkers in the area.
                </p>
              </div>
            </div>

            {/* Disqus Discussion Thread Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-base font-extrabold text-slate-800 font-sans tracking-tight">Community Forum Feed (Disqus Board)</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Please sign in to Disqus or use your local thread to post questions and make friend requests.</p>
              </div>
              <div className="min-h-[400px]">
                <DisqusForum
                  article={{
                    url: typeof window !== 'undefined' ? window.location.href : 'https://barksitter-local-sit.example.com',
                    id: 'barksitter-social-forum-main',
                    title: 'BarkSitter Pet Community Forum Board'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Disqus Discussion Section at the bottom of the web page */}
        <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs text-left">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-base font-extrabold text-slate-800 font-sans tracking-tight">Community Discussion Board (Disqus)</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Have questions or want to connect with other neighborhood pet owners and sitters? Start typing below!</p>
          </div>
          <div className="min-h-[300px]">
            <DisqusForum
              article={{
                url: typeof window !== 'undefined' ? window.location.href : 'https://barksitter-local-sit.example.com',
                id: 'barksitter-global-forum-bottom',
                title: 'BarkSitter Pet Community Global Board'
              }}
            />
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-20 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🐾</span>
            <span className="font-extrabold text-white text-sm">BarkSitter Sits Inc.</span>
          </div>
          <p className="font-medium text-slate-500">
            © 2226 BarkSitter Marketplace. Providing safe, neighborhood pet trust matches. Checked and vetted.
          </p>
          <div className="flex space-x-4 font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">Vetting Standards</a>
          </div>
        </div>
      </footer>

      {/* DYNAMIC MODALS PORTS */}

      {/* Sitter detail modal */}
      {detailSitter && (
        <SitterDetailModal
          sitter={detailSitter}
          reviews={reviews}
          onClose={() => setDetailSitterId(null)}
          onBook={() => {
            setBookingSitterId(detailSitter.id);
            setDetailSitterId(null);
          }}
          onChat={() => {
            setChattingSitterId(detailSitter.id);
            setDetailSitterId(null);
          }}
          userEmail={USER_EMAIL}
        />
      )}

      {/* Sitter booking calculator modal */}
      {bookingSitter && (
        <BookingModal
          sitter={bookingSitter}
          onClose={() => setBookingSitterId(null)}
          onConfirmBooking={handleConfirmNewBooking}
          userEmail={USER_EMAIL}
        />
      )}

      {/* Secure interactive premium chat screen view */}
      {chattingSitter && (
        <SitterChatView
          sitter={chattingSitter}
          userEmail={USER_EMAIL}
          onClose={() => setChattingSitterId(null)}
        />
      )}

      {showRegistration && (
        <RegistrationModal
          onClose={() => setShowRegistration(false)}
          onRegisterSitter={handleRegisterSitter}
          onRegisterOwner={handleRegisterOwner}
          currentEmail={USER_EMAIL}
        />
      )}

      {showSupabaseSetupModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100/80 my-8 text-left">
            <button
              id="close-sql-guide"
              onClick={() => setShowSupabaseSetupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-violet-100 text-violet-700 p-2 rounded-xl text-lg">
                🔌
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">Supabase Database Setup Guide</h3>
                <p className="text-xs text-slate-500 font-medium">Create your database table to unlock production persistence &amp; real-time feeds!</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Copy the SQL block below and run it in the <span className="font-bold text-violet-700">SQL Editor</span> of your Supabase project dashboard to generate the corresponding <code className="bg-slate-100 font-mono text-[10px] px-1 py-0.5 rounded">entries</code> table:
              </p>

              <div className="relative">
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-[10px] overflow-x-auto max-h-[300px] leading-relaxed border border-slate-800">
{`-- Create table
CREATE TABLE IF NOT EXISTS public.entries (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) and allow public/anonymous reads & updates
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select" ON public.entries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.entries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.entries FOR DELETE USING (true);

-- Enable Realtime so live changes broadcast across all browser sessions instantly
ALTER TABLE public.entries REPLICA IDENTITY FULL;

-- Setup publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;`}
                </pre>
                
                <button
                  id="btn-copy-sql"
                  onClick={() => {
                    const sqlText = `CREATE TABLE IF NOT EXISTS public.entries (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select" ON public.entries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.entries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete" ON public.entries FOR DELETE USING (true);

ALTER TABLE public.entries REPLICA IDENTITY FULL;

DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;`;
                    navigator.clipboard.writeText(sqlText);
                    setSqlCopied(true);
                    setTimeout(() => setSqlCopied(false), 2000);
                  }}
                  className="absolute top-2 right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-bold shadow-md cursor-pointer transition active:scale-95"
                >
                  {sqlCopied ? '✓ Copied SQL!' : '📋 Copy SQL Query'}
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-violet-100 text-xs space-y-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🚀</span> Why is this needed?
                </h4>
                <p className="text-slate-600 leading-normal">
                  In order to replace temporary local storages, your Supabase project needs a key-value style JSON table called <code className="bg-slate-200/50 px-1 py-0.5 rounded text-[10px] text-slate-800">entries</code>. If you haven't run the SQL script above, the applet automatically falls back to Local Storage so you don't lose anything.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                id="btn-dismiss-sql-guide"
                onClick={() => setShowSupabaseSetupModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Done / Use Sandbox Backing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
