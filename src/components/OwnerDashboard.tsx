import React, { useState } from 'react';
import { Star, MessageSquare, ClipboardCheck, Trash2, CheckCircle2, ChevronRight, X, AlertTriangle, Send, Footprints } from 'lucide-react';
import { Booking, Review, SitterProfile, Message } from '../types';

// Cute Pup Asset
import cutePoodleBuddy from '../assets/images/cute_poodle_buddy_1779420400102.png';

interface OwnerDashboardProps {
  bookings: Booking[];
  sitters: SitterProfile[];
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onCancelBooking: (id: string) => void;
  userEmail: string;
  onChatWithSitter?: (sitterId: string) => void;
  registeredOwner?: any;
}

export default function OwnerDashboard({
  bookings,
  sitters,
  reviews,
  onAddReview,
  onCancelBooking,
  userEmail,
  onChatWithSitter,
  registeredOwner
}: OwnerDashboardProps) {
  // Inbox / Chat simulation state
  const [activeChatSitterId, setActiveChatSitterId] = useState<string | null>(null);
  const [chatMessageText, setChatMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sitterId: 'sitter-1',
      ownerEmail: 'marcus.lim83@gmail.com',
      sender: 'sitter',
      text: 'Hello Marcus! Buddy looks so excited for the upcoming sit block! Is there anything specific regarding food weights I should know?',
      timestamp: 'Yesterday, 4:00 PM'
    },
    {
      id: 'msg-2',
      sitterId: 'sitter-1',
      ownerEmail: 'marcus.lim83@gmail.com',
      sender: 'owner',
      text: 'Thanks Emily! Yes, he gets exactly 1 scoop of raw dehydrated kibbles with a splash of warm goat milk.',
      timestamp: 'Yesterday, 4:30 PM'
    },
    {
      id: 'msg-3',
      sitterId: 'sitter-1',
      ownerEmail: 'marcus.lim83@gmail.com',
      sender: 'sitter',
      text: 'Perfect, got it! Dehydrated raw food is perfect. Looking forward to Sunday!',
      timestamp: 'Today, 9:20 AM'
    },
    {
      id: 'msg-4',
      sitterId: 'sitter-4',
      ownerEmail: 'marcus.lim83@gmail.com',
      sender: 'sitter',
      text: 'Hello, thanks for your booking request! I am reviewing my schedule and will let you know shortly.',
      timestamp: 'Today, 11:00 AM'
    }
  ]);

  // Review submission state
  const [reviewingSitterId, setReviewingSitterId] = useState<string | null>(null);
  const [reviewingSitterName, setReviewingSitterName] = useState('');
  const [starRating, setStarRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter owner relevant bookings
  const ownerBookings = bookings.filter((b) => b.ownerEmail === userEmail);

  // Care packing list (interactive checklist)
  const [todos, setTodos] = useState([
    { id: 1, text: 'Confirm key physical handover details with sitter', done: true },
    { id: 2, text: 'Provide premium chicken liver treats bag', done: false },
    { id: 3, text: 'Pack favorite squeaky hedgehog toy to ease transition', done: false },
    { id: 4, text: 'Leave vet clinic phone card and vaccination logs', done: true }
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeChatSitterId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sitterId: activeChatSitterId,
      ownerEmail: userEmail,
      sender: 'owner',
      text: chatMessageText,
      timestamp: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setChatMessageText('');

    // Simulate Sitter Auto Reply in 1.5 seconds for incredible premium interaction!
    setTimeout(() => {
      const activeSitter = sitters.find(s => s.id === activeChatSitterId);
      const sitterReplyText = activeSitter 
        ? `Woof! Thanks for coordinating. I have marked that detail down for Buddy immediately! 🐾` 
        : `Got it! Thanks for letting me know. I'll make sure to double check.`;
        
      setMessages(prev => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sitterId: activeChatSitterId,
          ownerEmail: userEmail,
          sender: 'sitter',
          text: sitterReplyText,
          timestamp: 'Just now'
        }
      ]);
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSitterId) return;

    onAddReview({
      sitterId: reviewingSitterId,
      author: 'Marcus Lim',
      rating: starRating,
      comment: reviewComment
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewingSitterId(null);
      setReviewComment('');
      setStarRating(5);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Owner Stays / Bookings */}
        <div className="lg:col-span-2 space-y-7">
          
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-400 font-mono tracking-widest">
              My Dog Sitting Stays ({ownerBookings.length})
            </h3>

            {ownerBookings.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-500">
                <Footprints className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">No bookings registered yet</p>
                <p className="text-xs text-slate-400 mt-0.5">Explore dog sitters in your area in the search tab to find a sitter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ownerBookings.map((b) => {
                  const statusColors = {
                    pending: 'bg-rose-50 text-rose-700 border-rose-100',
                    confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-100',
                    completed: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                    cancelled: 'bg-slate-50 text-slate-500 border-slate-100'
                  };

                  return (
                    <div key={b.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between">
                      
                      {/* Top bar details */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3 text-left">
                          <span className="text-2xl">{b.sitterAvatar}</span>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-800">{b.sitterName}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">Requested {b.serviceType}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[b.status] || 'bg-slate-50'}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Main staying details */}
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 text-xs">
                        <div className="text-left">
                          <p className="text-[9px] text-slate-400 font-bold font-mono uppercase">Dog Name</p>
                          <p className="font-extrabold text-violet-700">{b.dogName}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] text-slate-400 font-bold font-mono uppercase">Dates Range</p>
                          <p className="font-semibold text-slate-700 shrink-0 truncate">{b.startDate} to {b.endDate}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] text-slate-400 font-bold font-mono uppercase">Total Paid</p>
                          <p className="font-bold text-slate-800 font-mono">${b.totalCost}.00</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[9px] text-slate-400 font-bold font-mono uppercase">Dog Weight</p>
                          <p className="font-semibold text-slate-600 capitalize">{b.dogSize}</p>
                        </div>
                      </div>

                      {/* Msg coordinates with Sitter */}
                      <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between">
                        
                        {/* Instant chat link */}
                        <button
                          onClick={() => {
                            if (onChatWithSitter) {
                              onChatWithSitter(b.sitterId);
                            } else {
                              setActiveChatSitterId(b.sitterId);
                            }
                          }}
                          className="flex items-center text-xs font-bold text-violet-600 hover:text-violet-800 space-x-1.5 cursor-pointer"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Chat with Sitter</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          {/* Cancel option */}
                          {b.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to cancel this booking request?')) {
                                  onCancelBooking(b.id);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50/50 transition"
                              title="Cancel Request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}

                          {/* Write Review Option (If booking is completed) */}
                          {b.status === 'completed' && (
                            <button
                              onClick={() => {
                                setReviewingSitterId(b.sitterId);
                                setReviewingSitterName(b.sitterName);
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                            >
                              <Star className="h-3 w-3 fill-current" />
                              <span>Leave Review</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Live Chat Inbox Component */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 font-mono tracking-widest flex items-center">
              <MessageSquare className="h-4 w-4 text-fuchsia-500 mr-2" />
              Sitter Coordination Inbox
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[350px]">
              {/* Sitter Threads sidebar */}
              <div className="border-r border-slate-100 pr-2 space-y-1.5 max-h-full overflow-y-auto">
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Threads</p>
                {sitters.map((s) => {
                  const hasMsgObj = messages.some(msg => msg.sitterId === s.id);
                  if (!hasMsgObj) return null;

                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (onChatWithSitter) {
                          onChatWithSitter(s.id);
                        } else {
                          setActiveChatSitterId(s.id);
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center space-x-2 text-left transition ${
                        activeChatSitterId === s.id ? 'bg-fuchsia-50/50 border-l-4 border-fuchsia-500 font-bold' : 'hover:bg-slate-50/50'
                      } cursor-pointer`}
                    >
                      <span className="text-xl">{s.avatar}</span>
                      <div className="truncate">
                        <p className="text-xs font-black text-slate-800">{s.name.split(' ')[0]}</p>
                        <p className="text-[9px] text-slate-400 truncate">{s.location}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Chat Panel Box */}
              <div className="md:col-span-2 flex flex-col justify-between max-h-full h-full relative">
                {activeChatSitterId ? (
                  <>
                    {/* Chat Header */}
                    <div className="border-b border-slate-100 pb-2 mb-2 flex items-center space-x-2">
                      <span className="text-xl">{sitters.find(s => s.id === activeChatSitterId)?.avatar}</span>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">
                          {sitters.find(s => s.id === activeChatSitterId)?.name}
                        </p>
                        <p className="text-[9px] text-emerald-600 font-semibold">• Sitter Online</p>
                      </div>
                    </div>

                    {/* Conversation thread list */}
                    <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 max-h-[200px] flex flex-col">
                      {messages
                        .filter((msg) => msg.sitterId === activeChatSitterId)
                        .map((msg) => {
                          const isMe = msg.sender === 'owner';
                          return (
                            <div
                              key={msg.id}
                              className={`max-w-[85%] p-2.5 rounded-2xl text-xs text-left ${
                                isMe
                                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white self-end rounded-tr-none'
                                  : 'bg-slate-100 text-slate-700 self-start rounded-tl-none'
                              }`}
                            >
                              <p className="font-medium leading-relaxed">{msg.text}</p>
                              <span className={`text-[8px] font-mono block mt-1 ${isMe ? 'text-violet-100' : 'text-slate-400'}`}>
                                {msg.timestamp}
                              </span>
                            </div>
                          );
                        })}
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSendChat} className="mt-3 flex items-center space-x-1.5">
                      <input
                        type="text"
                        required
                        value={chatMessageText}
                        onChange={(e) => setChatMessageText(e.target.value)}
                        placeholder="Type a coordination notice to Sitter..."
                        className="bg-slate-50 flex-grow border border-slate-200 focus:bg-white focus:border-violet-500 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-xl transition"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4">
                    <MessageSquare className="h-8 w-8 text-slate-300 animate-bounce mb-2" />
                    <p className="text-xs font-semibold">Select a thread on the left to coordinate</p>
                    <p className="text-[10px] text-slate-400 text-center">Chat with sitters directly to schedule drop-offs, feeds, and routines.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Dog care packing and guide check list */}
        <div>
          {/* Active Pup Profile Card */}
          <div className="bg-gradient-to-tr from-violet-600/5 to-fuchsia-600/5 border border-violet-100 rounded-3xl p-5 mb-5 space-y-4 text-left shadow-xs">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-white shrink-0 border border-violet-200/60 shadow-md relative flex items-center justify-center">
                {registeredOwner ? (
                  <span className="text-3xl">🐕</span>
                ) : (
                  <img
                    src={cutePoodleBuddy}
                    alt="My Dog Buddy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-left flex-grow">
                <span className="bg-fuchsia-100 text-fuchsia-700 text-[8px] font-black uppercase font-mono tracking-widest px-2 py-0.5 rounded-lg inline-block">
                  Your Vetted Pup
                </span>
                <h4 className="text-base font-black text-slate-800 mt-1">
                  {registeredOwner ? registeredOwner.dogName : 'Buddy Lim'}
                </h4>
                <p className="text-[11px] text-slate-500 font-bold">
                  {registeredOwner ? `${registeredOwner.dogBreed} • Size: ${registeredOwner.dogSize}` : 'Toy Poodle • Apricot Fur'}
                </p>
                {registeredOwner && registeredOwner.dogSpecialNeeds && (
                  <p className="text-[10px] text-violet-650 font-extrabold mt-1 leading-tight">
                    ⚠️ {registeredOwner.dogSpecialNeeds}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase font-mono pt-3 border-t border-slate-100">
              <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 text-left">
                <span className="text-[8px] text-slate-400 block shrink-0 leading-none mb-1">HEALTH CERT</span>
                <span className="text-emerald-600 font-extrabold flex items-center">
                  ● Fully Vetted
                </span>
              </div>
              <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 text-left">
                <span className="text-[8px] text-slate-400 block shrink-0 leading-none mb-1">EMERGENCY LINE</span>
                <span className="text-slate-700 font-extrabold">
                  (555) BARK-911
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center space-x-2">
              <ClipboardCheck className="h-5 w-5 text-fuchsia-600" />
              <h3 className="text-base font-bold text-slate-800">Sitter Handover Kit</h3>
            </div>
            
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Ensure you prepare these crucial steps before giving Buddy over to the sitter to ensure a completely safe stay context.
            </p>

            <div className="space-y-2.5">
              {todos.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTodo(t.id)}
                  className={`p-3 rounded-xl border text-xs flex items-center space-x-2.5 cursor-pointer select-none transition ${
                    t.done
                      ? 'bg-slate-50 border-slate-100 text-slate-400 line-through'
                      : 'bg-white border-violet-100 text-slate-700 hover:border-violet-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {}} // toggled on container tap
                    className="rounded border-violet-300 accent-violet-600 cursor-pointer pointer-events-none"
                  />
                  <span className="font-semibold text-left leading-snug">{t.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-tr from-violet-50 to-fuchsia-50/20 border border-violet-100 rounded-2xl p-4 text-xs text-violet-800">
              <span className="font-extrabold flex items-center space-x-1 uppercase tracking-wider text-[10px] text-violet-800 font-mono mb-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-violet-700" />
                <span>Urgent Care Support</span>
              </span>
              <p className="leading-relaxed font-medium">
                Our 24/7 Bark Protection Support line handles key emergencies automatically! Sitter safety vetting guidelines prevent unverified interactions.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Write rating and reviews modal */}
      {reviewingSitterId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-violet-100 text-left shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-800">Write stay review for {reviewingSitterName}</h3>
              <button
                onClick={() => setReviewingSitterId(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-bold font-mono text-center animate-fade-in my-6">
                ✨ Successfully saved Stay Review feedback! Sitter reputation pool updated.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Stars selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Give Stars Rating</label>
                  <div className="flex text-amber-400 space-x-1 text-2xl">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setStarRating(starValue)}
                        className="hover:scale-110 transition"
                      >
                        <Star className={`h-8 w-8 ${starValue <= starRating ? 'fill-current' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold uppercase text-slate-400 font-mono block">Review Comments</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe how well your dog was treated, feeding intervals, updates intensity, overall pet warmth..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 focus:bg-white text-xs rounded-xl p-3 outline-none leading-relaxed resize-none font-medium text-slate-700"
                  ></textarea>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition shadow-md shadow-violet-600/10"
                  >
                    Post Stay Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewingSitterId(null)}
                    className="bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold px-5 py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
