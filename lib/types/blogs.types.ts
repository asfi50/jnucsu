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
  is_featured?: boolean;
}

export interface MyBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "pending" | "published" | "rejected";
  category: string;
  tags: string[];
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  likes: number;
  rejectionReason?: string;
  currentVersionId?: string;
  hasUnpublishedChanges?: boolean;
  canEdit?: boolean;
}

export interface BlogEditData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  thumbnail: string;
  status: "draft" | "pending" | "published" | "rejected";
  versionId: string;
  canEdit: boolean;
}

export interface PendingBlog {
  versionId: string;
  blogId: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  status: "pending";
  submittedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
  };
  tags: string[];
}

export interface BlogStatusResponse {
  message: string;
  status: "draft" | "pending" | "published" | "rejected";
  rejectionReason?: string;
}

// New interfaces for version-controlled blogs
export interface BlogVersion {
  id: string;
  blogId: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  status: "draft" | "pending" | "published" | "rejected";
  category: {
    id: string;
    text: string;
  };
  tags: string[];
  rejectionReason?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Blog Page API Response Types
export interface BlogPageApiResponse {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  date_published: string;
  thumbnail?: string;
  category?: string;
  is_featured: boolean;
  views?: number;
  reactions: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface BlogPageData {
  featuredBlogs: BlogPageApiResponse[];
  regularBlogs: BlogPageApiResponse[];
  allBlogs: BlogPageApiResponse[];
}

// API Response types for new blog structure
export interface BlogsApiResponse {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  author: {
    id: string;
    name: string;
    image?: string;
  };
  current_published_version?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    thumbnail?: string;
    status: string;
    category?: {
      id: string;
      text: string;
    };
    tags: string[];
    approved_at?: string;
  };
  views: number;
  is_featured: boolean;
  date_created: string;
  date_updated: string;
  comments?: Array<{
    id: string;
    content: string;
    user: {
      id: string;
      name: string;
      image?: string;
    };
    date_created: string;
  }>;
  reactions?: Array<{
    id: string;
    value: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

export interface BlogVersionApiResponse {
  id: string;
  blog: {
    id: string;
    title: string;
    author: {
      id: string;
      name: string;
    };
  };
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  status: "draft" | "pending" | "published" | "rejected";
  category?: {
    id: string;
    text: string;
  };
  tags: string[];
  reject_reason?: string;
  submitted_at?: string;
  approved_at?: string;
  created_by: {
    id: string;
    name: string;
  };
  date_created: string;
  date_updated: string;
}

// Legacy API Response type (for backward compatibility)
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
