// Shared types for Panel API responses

export interface PanelMember {
  id: string; // This will be profile.id (candidate reference)
  name?: string;
  studentId?: string;
  image?: string;
  department?: string;
  positionName?: string;
  biography?: string;
  manifesto?: string;
  experience?: string;
  achievements?: string;
  status: string;
  isParticipating: boolean;
  approvedAt?: string;
}

export interface Panel {
  id: string;
  name: string;
  status: string;
  logo?: string;
  banner?: string;
  mission?: string;
  vision?: string;
  createdAt: string;
  updatedAt: string;
  members: PanelMember[];
}

// Raw response from Directus (for internal API use)
export interface DirectusMember {
  id: string;
  status: string;
  isParticipating: boolean;
  approved_at?: string;
  biography?: string;
  manifesto?: string;
  experience?: string;
  achievements?: string;
  profile?: {
    id?: string;
    name?: string;
    student_id?: string;
    image?: string;
    department?: {
      name?: string;
    };
  };
  position?: {
    name?: string;
  };
}

export interface DirectusPanelData {
  id: string;
  name: string;
  status: string;
  logo?: string;
  banner?: string;
  mission?: string;
  vision?: string;
  date_created: string;
  date_updated: string;
  members?: DirectusMember[];
}
