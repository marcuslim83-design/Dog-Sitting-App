export type DogSize = 'small' | 'medium' | 'large';

export type ServiceType = 'Sitting' | 'Walking' | 'Overnight Boarding';

export interface SitterProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  rate: number; // rate per hour or per day
  rating: number;
  totalReviews: number;
  location: string; // e.g., "Greenwood", "Downtown", "Westside", "North Hills"
  services: ServiceType[];
  specialties: string[]; // e.g., ["Puppy Care", "Senior Dogs", "First Aid Trained", "Large Yard"]
  maxDogSize: DogSize;
  lat: number; // simple coordinate percentage for local HTML map representation (0 to 100)
  lng: number; // coordinate percentage for map (0 to 100)
  verified: boolean;
  joinedDate: string;
}

export interface Booking {
  id: string;
  sitterId: string;
  sitterName: string;
  sitterAvatar: string;
  ownerName: string;
  ownerEmail: string;
  dogName: string;
  dogSize: DogSize;
  serviceType: ServiceType;
  startDate: string;
  endDate: string;
  notes: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  sitterId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  sitterId: string;
  ownerEmail: string;
  sender: 'owner' | 'sitter';
  text: string;
  timestamp: string;
}
