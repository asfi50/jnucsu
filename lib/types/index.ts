// Position types
export interface Position {
  id: number;
  name: string;
  order: number;
  allocated_slots: number;
}

// Category types
export interface Category {
  id: number;
  text: string;
}

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
    type: "blog" | "candidate";
    title: string;
    url: string;
  };
}

// User types
export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

// Vote types
export interface Vote {
  id: string;
  userId: string;
  leaderId: string;
  type: "upvote" | "downvote";
  createdAt: string;
}

// Notification types
export interface Notification {
  id: string;
  type: "blog_comment" | "candidate_comment" | "message_reply" | "mention";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  actor?: User; // The user who triggered the notification
}

export interface NotificationSettings {
  blogComments: boolean;
  candidateComments: boolean;
  messageReplies: boolean;
  mentions: boolean;
}
