export interface ElectionCandidate {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  university: string;
  department: string;
  year: string;
  studentId: string;
  futurePlans: string; // manifesto
  workGallery: WorkGalleryItem[];
  votes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  phone?: string;
  email?: string;
  address?: string;
  achievements?: string;
  candidateComments?: Comment[];
  blogs?: BlogItem[];
  commentProfile?: CommentProfile[];
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  date_created?: string;
  context: "blog" | "profile";
  contextId?: string;
  contextTitle?: string;
  replies?: Comment[];
}

export interface CommentProfile {
  id: string;
  content: string;
  date_created?: string;
  name: string;
  avatar: string;
  userId: string;
}

// User types
export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

// Work Gallery Item types
export interface WorkGalleryItem {
  id?: string;
  title: string;
  description: string;
  url: string;
}

export interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  date_published: string;
  tags: string[];
}
