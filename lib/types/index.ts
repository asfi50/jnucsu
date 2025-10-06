// Student Leader types
export interface StudentLeader {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  university: string;
  department: string;
  year: number;
  studentId: string;
  futurePlans: string;
  workGallery: string[];
  votes: number;
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  phone?: string;
  email?: string;
  address?: string;
  achievements?: string;
  candidateComments?: Comment[]; // Comments made by the candidate
}

// Comment types
export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  replies: Comment[];
  context?: {
    type: 'blog' | 'candidate';
    title: string;
    url: string;
  };
}

// User types
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  likes: number;
}

// Vote types
export interface Vote {
  id: string;
  userId: string;
  leaderId: string;
  type: 'upvote' | 'downvote';
  createdAt: string;
}