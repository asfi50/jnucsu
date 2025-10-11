import { User } from ".";
// Blog Comment types

export interface BlogComment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  content: string;
  createdAt: string;
  replies?: BlogComment[];
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
  is_reacted: boolean;
  likes: number;
  views?: number;
  comments?: BlogComment[];
}

export interface MyBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "pending" | "published" | "rejected";
  category: string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  likes: number;
  rejectionReason?: string;
}

// API Response types
export interface BlogApiResponse {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "pending" | "published" | "rejected";
  category: {
    text: string;
  };
  tags: string[];
  thumbnail?: string;
  date_created: string;
  date_updated: string;
  date_published?: string;
  views?: number;
  reactions?: Array<{ user: { id: string } }>;
  rejection_reason?: string;
}

export interface BlogPostApiResponse {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  user?: {
    id: string;
    name: string;
    image?: string;
    user?: {
      email: string;
    };
  };
  thumbnail?: string;
  cover_image?: string;
  tags: string[];
  date_published: string;
  reading_time?: number;
  is_reacted?: boolean;
  reactions?: Array<{
    user: {
      id: string;
    };
  }>;
  views?: number;
  comments?: Array<{
    id: string;
    user?: {
      id: string;
      name: string;
      image?: string;
      user?: {
        email: string;
      };
    };
    content: string;
    date_created: string;
  }>;
}
