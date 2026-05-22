import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Phone, 
  Video, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Camera, 
  Image, 
  Loader2, 
  Sparkles, 
  CheckCheck,
  Volume2,
  VolumeX,
  AlertCircle,
  Clock,
  Heart
} from 'lucide-react';
import { SitterProfile, Message } from '../types';

// Let's import the cute dog assets to simulate sitter updates
import happyDogsHero from '../assets/images/happy_dogs_hero_1779420349432.png';
import rustyGolden from '../assets/images/rusty_golden_retriever_1779420380382.png';
import cutePoodleBuddy from '../assets/images/cute_poodle_buddy_1779420400102.png';

interface SitterChatViewProps {
  sitter: SitterProfile;
  userEmail: string;
  onClose: () => void;
  initialMessages?: Message[];
}

export default function SitterChatView({
  sitter,
  userEmail,
  onClose,
  initialMessages
}: SitterChatViewProps) {
  // Let's initialize conversations with high quality initial threads
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMessages && initialMessages.length > 0) {
      return initialMessages.filter(m => m.sitterId === sitter.id);
    }
    return [
      {
        id: 'init-1',
        sitterId: sitter.id,
        ownerEmail: userEmail,
        sender: 'sitter',
        text: `Hi Marcus! I am absolutely thrilled for the chance to sit and care for Buddy. Let me know if there are any specific routine requirements! 🐾`,
        timestamp: 'Yesterday, 3:15 PM'
      },
      {
        id: 'init-2',
        sitterId: sitter.id,
        ownerEmail: userEmail,
        sender: 'owner',
        text: `Great to meet you! Yes, he needs about 1 scoop of kibble in the afternoon, and he loves short sniff-walks around the block.`,
        timestamp: 'Yesterday, 3:30 PM'
      },
      {
        id: 'init-3',
        sitterId: sitter.id,
        ownerEmail: userEmail,
        sender: 'sitter',
        text: `Understood fully! Sniff-walks are his absolute favorite, I will keep a close eye and take plenty of photos!`,
        timestamp: 'Just now'
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);

  // For simulating attachments or photo updates
  const [simulatedPhotos, setSimulatedPhotos] = useState<string[]>([
    happyDogsHero,
    rustyGolden,
    cutePoodleBuddy
  ]);
  const [photoIndex, setPhotoIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest chats
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Video call count timer simulation
  useEffect(() => {
    let interval: any;
    if (videoCallActive) {
      interval = setInterval(() => {
        setVideoCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setVideoCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [videoCallActive]);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      // Small simulated sound using offline web audio synthesis
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      // fail silently if audio context is blocked
    }
  };

  const handleSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const newMsg: Message = {
      id: `m-owner-${Date.now()}`,
      sitterId: sitter.id,
      ownerEmail: userEmail,
      sender: 'owner',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    playChime();

    // Clear input
    setInputText('');

    // Trigger random sitter auto reply after 1.8 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        `That sounds absolutely perfect! I've noted that down in Buddy's active digital log file. 📝`,
        `No worries at all! He is currently playing happily right here on the soft rug. 🥰`,
        `Perfect! I will make sure he remains well hydrated and takes his favorite toy during our walk!`,
        `Got it! I am sending puppy updates regularly so you won't miss a single wag. 🐾`,
        `I will be here and fully prepped for your pickup. Let me know when you are nearby!`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const SitterMsg: Message = {
        id: `m-sitter-${Date.now()}`,
        sitterId: sitter.id,
        ownerEmail: userEmail,
        sender: 'sitter',
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, SitterMsg]);
      playChime();
    }, 1800);
  };

  // Helper to send a simulated photorealistic update
  const triggerSimulatedSitterPhotoUpdate = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const photoUrl = simulatedPhotos[photoIndex];
      // cycle photos index
      setPhotoIndex(prev => (prev + 1) % simulatedPhotos.length);

      const captions = [
        "📸 Buddy is making so many local friends today! Check out how happy everyone looks side-by-side! 😍",
        "📸 Look who is sitting majestically on the beautiful backyard grass! What an absolute sun worshiper!",
        "📸 Snuggle alert! This sweet apricot pup is looking straight into my eyes right on the cozy living room rug."
      ];

      const msgText = captions[photoIndex];

      const SitterMsg: Message = {
        id: `m-sitter-photo-${Date.now()}`,
        sitterId: sitter.id,
        ownerEmail: userEmail,
        sender: 'sitter',
        text: msgText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, SitterMsg]);
      // Also inject actual image placeholder indicator
      setMessages(prev => [
        ...prev,
        {
          id: `m-sitter-img-${Date.now()}`,
          sitterId: sitter.id,
          ownerEmail: userEmail,
          sender: 'sitter',
          text: `[IMAGE_ATTACHMENT]:${photoUrl}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playChime();
    }, 1500);
  };

  // Human friendly timer string
  const formatCallTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in">
      
      <div className="bg-white w-full max-w-5xl h-full md:h-[85vh] rounded-none md:rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden transform transition-all duration-300">
        
        {/* Left Section: Sitter Detail Snapshot Profile column */}
        <div className="w-full md:w-80 bg-slate-50/80 border-r border-slate-200/50 flex flex-col justify-between shrink-0 p-5">
          <div className="space-y-5 text-left">
            
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="md:hidden flex items-center text-xs font-bold text-violet-600 hover:text-violet-800 space-x-1"
              >
                <span>← Back</span>
              </button>
              
              <span className="text-[10px] bg-violet-100 text-violet-700 font-black uppercase font-mono px-2.5 py-0.5 rounded-md flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Live Channels</span>
              </span>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>

            {/* Sitter Micro Card */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center space-x-3.5">
                <div className="h-14 w-14 bg-gradient-to-tr from-violet-100 to-fuchsia-50 rounded-xl flex items-center justify-center text-3xl shadow-xs border border-violet-100 shrink-0">
                  {sitter.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">
                    {sitter.name.split(' ')[0]} 
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-100" />
                  </h4>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="text-[11px] text-amber-500 font-extrabold flex items-center">
                      ★ {sitter.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">• {sitter.location}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-medium leading-relaxed italic block border-t border-slate-100 pt-2.5">
                "{sitter.bio.slice(0, 100)}..."
              </div>

              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-2.5 text-[10px] font-mono font-bold text-slate-500">
                <span>ESTIMATED RATE:</span>
                <span className="text-slate-800 font-black">${sitter.rate}/day</span>
              </div>
            </div>

            {/* Simulated Live status tags */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-widest block">Environment Check</h5>
              <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Boarding
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Response Rate:</span>
                  <span className="text-violet-600">~5 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vet Connection:</span>
                  <span className="text-slate-700">Fully Verified ✓</span>
                </div>
              </div>
            </div>

            {/* Quick Map coordinate widget */}
            <div className="bg-gradient-to-tr from-indigo-50/50 to-violet-50/50 rounded-2xl p-3 border border-indigo-100/50 text-[11px] space-y-1.5">
              <p className="font-bold text-indigo-900 flex items-center">
                <MapPin className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                Sitter Home Safe-Zone
              </p>
              <p className="text-indigo-700/80 leading-snug">
                Located near {sitter.location}. Sitter has configured immediate emergency transport routes within 2.5km.
              </p>
            </div>

          </div>

          {/* Interactive Sitter Call Trigger Panel */}
          <div className="pt-4 border-t border-slate-200/60 hidden md:flex flex-col gap-2 mt-4 text-left">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-black uppercase text-slate-400 font-mono">Emergency Hotlines</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Simulated Voice Call */}
              <button
                onClick={() => {
                  playChime();
                  alert(`📞 Voice Ringing: Simulated live connection to ${sitter.name}'s cell line. (In full-stack staging, this routes via twilio mask)`);
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl py-2 px-1.5 text-[10px] font-bold text-slate-700 flex items-center justify-center space-x-1.5 transition"
              >
                <Phone className="h-3 w-3 text-emerald-600" />
                <span>Call Voice</span>
              </button>

              {/* Simulated Video Call */}
              <button
                onClick={() => {
                  playChime();
                  setVideoCallActive(true);
                }}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl py-2 px-1.5 text-[10px] font-bold text-slate-700 flex items-center justify-center space-x-1.5 transition"
              >
                <Video className="h-3 w-3 text-violet-600" />
                <span>Video Sync</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Section: Stream chat window body */}
        <div className="flex-grow flex flex-col justify-between h-full bg-slate-50 relative">
          
          {/* Active Chat Header */}
          <div className="bg-white border-b border-slate-200/60 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10 shrink-0">
            <div className="flex items-center space-x-3 text-left">
              <div className="text-2xl h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                {sitter.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-black text-slate-800 leading-none">{sitter.name}</h4>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Direct Secure Sitter Channel</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Simulated Direct Actions */}
              <button
                onClick={triggerSimulatedSitterPhotoUpdate}
                className="bg-violet-50 hover:bg-violet-100 text-violet-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-violet-100 transition flex items-center space-x-1"
                title="Ask Sitter for a sweet live photo of Buddy"
              >
                <Camera className="h-3 w-3 text-violet-600" />
                <span className="hidden sm:inline">Request Photo Snap</span>
              </button>

              <button
                onClick={onClose}
                className="p-1 px-2 text-xs font-bold text-slate-400 hover:text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl shadow-2xs transition"
              >
                Close screen
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES STREAM CONTAINER */}
          <div className="flex-grow overflow-y-auto p-5 space-y-4 max-h-full">
            
            {/* Safe Board Notice Banner */}
            <div className="mx-auto max-w-md bg-white border border-slate-200/60 rounded-2xl p-3.5 text-[11px] text-slate-500 leading-relaxed font-semibold shadow-2xs flex space-x-2 items-center">
              <Clock className="h-4 w-4 text-violet-600 shrink-0" />
              <p>
                🐕 <span className="text-slate-700">Care Boarding Session:</span> Let your sitter know when you are arriving, confirm dietary weight logs (in compliance with metric conversions), or track safety routines.
              </p>
            </div>

            {messages.map((msg, index) => {
              const isOwner = msg.sender === 'owner';
              const isImage = msg.text.startsWith('[IMAGE_ATTACHMENT]:');
              
              return (
                <div
                  key={msg.id}
                  className={`flex items-end space-x-2 ${isOwner ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Avatar left side */}
                  {!isOwner && (
                    <div className="h-7 w-7 rounded-full bg-white border border-slate-200 text-base flex items-center justify-center shadow-3xs shrink-0 select-none">
                      {sitter.avatar}
                    </div>
                  )}

                  <div className={`max-w-[75%] sm:max-w-md`}>
                    {isImage ? (
                      <div className="rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 aspect-[4/3] relative group">
                        <img
                          src={msg.text.split('[IMAGE_ATTACHMENT]:')[1]}
                          alt="Simulated Dog Update"
                          referrerPolicy="referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/40 text-white text-[8px] font-bold font-mono px-2 py-0.5 rounded-full backdrop-blur-xs">
                          Live Photo Up
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-2xl p-3.5 text-xs text-left shadow-2xs font-semibold leading-relaxed ${
                          isOwner
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200/40 text-slate-700 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    )}
                    
                    {/* Timestamp & read confirmation */}
                    <div className={`flex items-center space-x-1.5 mt-1 text-[9px] text-slate-400 font-bold font-mono ${isOwner ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {isOwner && (
                        <CheckCheck className="h-3 w-3 text-emerald-500 font-bold" />
                      )}
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Sitter Typing Indicator */}
            {isTyping && (
              <div className="flex items-end space-x-2 justify-start">
                <div className="h-7 w-7 rounded-full bg-white border border-slate-200 text-base flex items-center justify-center shadow-3xs shrink-0">
                  {sitter.avatar}
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1 text-xs text-slate-400 font-semibold shadow-2xs">
                  <Loader2 className="h-3.5 w-3.5 text-violet-500 animate-spin" />
                  <span>{sitter.name.split(' ')[0]} is writing a message...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick preset message response sliders */}
          <div className="px-5 py-2.5 bg-white border-t border-slate-200/30 flex flex-wrap gap-1.5 justify-start shrink-0">
            {[
              "Is Buddy behaving okay ? 🐾",
              "Food is at the front bag! 🍼",
              "Be there in 15 mins for pickup! 🚗",
              "Just checking in for updates! 😍"
            ].map((presetText) => (
              <button
                key={presetText}
                onClick={() => handleSend(presetText)}
                className="text-[10.5px] font-bold text-slate-600 hover:text-violet-700 bg-slate-50 hover:bg-violet-50/50 hover:border-violet-300 border border-slate-200 rounded-lg px-2.5 py-1.5 transition select-none cursor-pointer"
              >
                {presetText}
              </button>
            ))}
          </div>

          {/* MESSAGE INPUT CONSOLE */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
              className="flex items-center space-x-2 max-w-full"
            >
              
              {/* Attachment selector simulation */}
              <button
                type="button"
                onClick={() => {
                  playChime();
                  handleSend(`[IMAGE_ATTACHMENT]:${happyDogsHero}`);
                  setTimeout(() => {
                    handleSend("I uploaded a cute picture of Buddy's walking harness!");
                  }, 800);
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 transition shrink-0"
                title="Simulate sending a photo checklist attachment"
              >
                <Image className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Send an instant coordination message to ${sitter.name}...`}
                className="flex-grow bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:bg-white focus:border-violet-500 text-xs font-semibold rounded-xl px-4 py-3 outline-none transition text-slate-700"
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white p-3 rounded-xl transition shadow-md shadow-violet-600/10 shrink-0 flex items-center justify-center font-bold"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* OVERLAY PANEL: SIMULATED VIDEO SYNC SCREEN */}
      <AnimatePresence>
        {videoCallActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-slate-950/95 z-55 flex flex-col justify-between p-6 text-white text-center"
          >
            {/* Header */}
            <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
              <div className="flex items-center space-x-2 text-left">
                <span className="text-2xl animate-spin-slow">🎥</span>
                <div>
                  <h3 className="text-sm font-black text-white">{sitter.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Secure HD Video Stream</p>
                </div>
              </div>
              <div className="bg-red-600 text-white text-[9px] font-mono px-2.5 py-0.5 rounded-full animate-pulse uppercase tracking-widest font-black">
                Live Feed
              </div>
            </div>

            {/* Video center screen */}
            <div className="max-w-2xl mx-auto w-full aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 relative shadow-2xl flex items-center justify-center">
              
              {/* Stream Frame (Loads our photorealistic assets to simulate active video feeds!) */}
              <img
                src={poodleBuddyFeed()}
                alt="Puppy Cam Stream"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay graphics */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  {/* PiP box (owner view) */}
                  <div className="h-20 w-16 bg-slate-800 rounded-xl overflow-hidden border border-white/20 shadow-lg relative">
                    <div className="absolute text-[8px] bg-slate-900/70 p-0.5 text-white bottom-0 inset-x-0 font-mono text-center">Owner Web</div>
                    <span className="text-xl absolute inset-0 flex items-center justify-center">👨🏻‍💼</span>
                  </div>
                </div>

                <div className="flex justify-between items-end text-left">
                  <div>
                    <span className="bg-black/40 text-[9px] text-white px-2.5 py-0.5 rounded-md font-mono">
                      ⏱ {formatCallTime(videoCallTimer)}
                    </span>
                    <p className="text-xs font-black mt-2 text-white flex items-center gap-1">
                      <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" /> Buddy is enjoying afternoon story time!
                    </p>
                  </div>
                  <span className="text-2xl">⚡🦮</span>
                </div>
              </div>

            </div>

            {/* Controller row */}
            <div className="max-w-2xl mx-auto w-full pt-4">
              <button
                onClick={() => {
                  playChime();
                  setVideoCallActive(false);
                }}
                className="mx-auto bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-6 py-3 rounded-full shadow-lg shadow-rose-600/20 flex items-center space-x-1.5 transition"
              >
                <span>End Call Stream</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );

  // Fallback to supply cute webcam stream source representation
  function poodleBuddyFeed() {
    // Cycles video cam view based on active timer
    if (videoCallTimer % 12 < 4) {
      return cutePoodleBuddy;
    } else if (videoCallTimer % 12 < 8) {
      return happyDogsHero;
    } else {
      return rustyGolden;
    }
  }
}
