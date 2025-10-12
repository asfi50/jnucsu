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
  workGallery?: GalleryItem[];
  votes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  url: string;
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
export interface PublicProfileBlog {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
}
export interface PublicProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  studentId?: string;
  department?: string;
  year?: string;
  about?: string;
  address?: string;
  avatar?: string;
  links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  blogs?: PublicProfileBlog[];
}

export interface PublicProfileApiResponse {
  id: string;
  name: string;
  user?: {
    email: string;
  };
  phone?: string;
  student_id?: string;
  department?: {
    name: string;
  };
  academic_year?: string;
  about?: string;
  address?: string;
  image?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  blogs?: Array<{
    id: string;
    title: string;
    excerpt: string;
    status: string;
    date_published?: string;
    tags?: string[];
  }>;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  position: string;
  biography: string;
  manifesto: string;
  experience: string;
  achievements: string;
  phone: string;
  email: string;
  address: string;
  studentId: string;
  department: string;
  semester: string;
  isParticipating: boolean;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  votes: number;
  views: number;
  rejectionReason?: string;
  moderatorNotes?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}
