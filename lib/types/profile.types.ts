export interface UserProfile {
  id: string;
  name: string;
  image?: string;
  phone?: string;
  email?: string;
  address?: string;
  studentId?: string;
  department?: string;
  did?: string;
  year?: number;
  semester?: string;
  about?: string;
  links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  workGallery?: string[];
  votes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: number;
  name: string;
  order: number;
  allocated_slots: number;
}

export interface ElectionProfile {
  id: string;
  personal: UserProfile;
  position: string;
  positionDetails?: Position; // Reference to the position details
  biography: string;
  manifesto: string;
  experience?: string;
  achievements?: string;
  isParticipating: boolean;
  goals?: string;
  campaignImage?: string;
  campaignVideo?: string;
  votes: number;
  createdAt: string;
  updatedAt: string;
}
