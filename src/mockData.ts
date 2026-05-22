import { SitterProfile, Review, Booking } from './types';

export const LOCATIONS = [
  'Greenwood',
  'Downtown',
  'Westside',
  'North Hills',
  'Riverside',
  'Oakwood'
];

export const INITIAL_SITTERS: SitterProfile[] = [
  {
    id: 'sitter-1',
    name: 'Emily Henderson',
    avatar: '👩‍💼',
    bio: 'Certified pet lover with 6+ years of dog sitting experience. I have a spacious townhome near Greenwood Park with a fully fenced private yard. Your fur baby will receive undivided attention, daily walks, and endless belly rubs!',
    rate: 25,
    rating: 4.9,
    totalReviews: 24,
    location: 'Greenwood',
    services: ['Sitting', 'Walking', 'Overnight Boarding'],
    specialties: ['Senior Dogs', 'First Aid Trained', 'Large Yard', 'Medication Administration'],
    maxDogSize: 'large',
    lat: 35,
    lng: 40,
    verified: true,
    joinedDate: 'Jan 2024'
  },
  {
    id: 'sitter-2',
    name: 'Marcus & Chloe Lin',
    avatar: '🧑‍🤝‍🧑',
    bio: 'Double the love! Chloe and I are work-from-home dog parents who love hosting friendly pet guests. Your dog will never be left alone, and our golden retriever, Rusty, loves having playmates of all sizes.',
    rate: 35,
    rating: 4.8,
    totalReviews: 18,
    location: 'Westside',
    services: ['Sitting', 'Overnight Boarding'],
    specialties: ['Puppy Care', 'Socialization', 'Constant Supervision', 'Daily Photo Updates'],
    maxDogSize: 'medium',
    lat: 55,
    lng: 25,
    verified: true,
    joinedDate: 'Mar 2024'
  },
  {
    id: 'sitter-3',
    name: 'David Carter',
    avatar: '👨‍🌾',
    bio: 'Professional active dog walker and trainer. I live near the Riverside trials and specialize in high-energy dogs. If your companion loves long adventure hikes, agility play, and active mental exercises, I am your guy!',
    rate: 22,
    rating: 5.0,
    totalReviews: 32,
    location: 'Riverside',
    services: ['Walking', 'Sitting'],
    specialties: ['High Energy Dogs', 'Agility Training', 'Behavioral Correction', 'Trail Hiking'],
    maxDogSize: 'large',
    lat: 70,
    lng: 75,
    verified: true,
    joinedDate: 'Jul 2023'
  },
  {
    id: 'sitter-4',
    name: 'Sarah Jenkins',
    avatar: '👩‍⚕️',
    bio: 'Former veterinary assistant now doing pet sitting full-time! Safe, professional, and compassionate care is my ultimate promise. I am fully trained in dog rescue protocols and comfortable handling nervous or special-needs pets.',
    rate: 30,
    rating: 4.9,
    totalReviews: 41,
    location: 'Downtown',
    services: ['Sitting', 'Overnight Boarding', 'Walking'],
    specialties: ['Special Needs', 'Medication Administration', 'First Aid Trained', 'Anxious Dogs'],
    maxDogSize: 'small',
    lat: 48,
    lng: 52,
    verified: true,
    joinedDate: 'Nov 2022'
  },
  {
    id: 'sitter-5',
    name: 'Kevin Vance',
    avatar: '🧑‍💻',
    bio: 'Working from home in my cozy Oakwood apartment. I take frequent breaks for dog-park walks and light outdoor play. I cater exclusively to smaller dogs who love snuggling upright in laps while I work!',
    rate: 20,
    rating: 4.7,
    totalReviews: 12,
    location: 'Oakwood',
    services: ['Sitting', 'Walking'],
    specialties: ['Lap Snugglers', 'Small Dog Expert', 'Calm Environment'],
    maxDogSize: 'small',
    lat: 25,
    lng: 78,
    verified: false,
    joinedDate: 'Feb 2025'
  },
  {
    id: 'sitter-6',
    name: 'Olivia Martinez',
    avatar: '👩‍🍳',
    bio: 'Passionate dog baker and sitter in North Hills. I love baking fresh, single-ingredient healthy dog treats for all my guest pups (with your permission!). Spacious wrap-around deck and fully dog-proofed rooms.',
    rate: 28,
    rating: 5.0,
    totalReviews: 15,
    location: 'North Hills',
    services: ['Sitting', 'Overnight Boarding'],
    specialties: ['Homemade Treats', 'Puppy Care', 'Oral Medication'],
    maxDogSize: 'large',
    lat: 18,
    lng: 32,
    verified: true,
    joinedDate: 'Oct 2024'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'review-1',
    sitterId: 'sitter-1',
    author: 'Mark Rutherford',
    rating: 5,
    comment: 'Emily was absolutely wonderful with Max! Highly regular photo updates and transparent communication throughout the entire process. Will book again!',
    date: 'May 10, 2026'
  },
  {
    id: 'review-2',
    sitterId: 'sitter-1',
    author: 'Elena Rostova',
    rating: 4,
    comment: 'Great communication. Max came home happy, clean, and nicely tired out from walks. Recommendation is 10/10.',
    date: 'Apr 28, 2026'
  },
  {
    id: 'review-3',
    sitterId: 'sitter-2',
    author: 'Julian Thorne',
    rating: 5,
    comment: 'Rusty can be a handful, but Chloe and Marcus kept him safe and well-focused. Rusty actually seemed sad to leave! Absolute stars.',
    date: 'May 14, 2026'
  },
  {
    id: 'review-4',
    sitterId: 'sitter-3',
    author: 'Clarissa Finch',
    rating: 5,
    comment: 'David tire-tested my Border Collie! She usually has infinite energy, but David took her on a wonderful trail run. He is outstanding!',
    date: 'May 02, 2026'
  },
  {
    id: 'review-5',
    sitterId: 'sitter-4',
    author: 'Arthur Dent',
    rating: 5,
    comment: 'A true professional. Highly skilled regarding healthcare. Administered regular drops to Pip perfectly. Strongly recommended if your pup is elderly or recovering.',
    date: 'May 12, 2026'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    sitterId: 'sitter-1',
    sitterName: 'Emily Henderson',
    sitterAvatar: '👩‍💼',
    ownerName: 'Marcus Lim',
    ownerEmail: 'marcus.lim83@gmail.com',
    dogName: 'Buddy',
    dogSize: 'medium',
    serviceType: 'Sitting',
    startDate: '2026-05-24',
    endDate: '2026-05-25',
    notes: 'Buddy loves squeaky toys but is afraid of vacuum cleaners. He needs one drop of eye solution with breakfast.',
    totalCost: 50,
    status: 'confirmed',
    createdAt: '2026-05-21T14:30:00Z'
  },
  {
    id: 'booking-2',
    sitterId: 'sitter-4',
    sitterName: 'Sarah Jenkins',
    sitterAvatar: '👩‍⚕️',
    ownerName: 'Marcus Lim',
    ownerEmail: 'marcus.lim83@gmail.com',
    dogName: 'Buddy',
    dogSize: 'medium',
    serviceType: 'Overnight Boarding',
    startDate: '2026-05-28',
    endDate: '2026-05-30',
    notes: 'First overnight stay. Will supply his own bed and premium kibbles.',
    totalCost: 90,
    status: 'pending',
    createdAt: '2026-05-21T18:15:00Z'
  }
];
