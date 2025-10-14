import { BlogPost } from "@/lib/types/blogs.types";

export interface ApiBlogResponse {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  date_published?: string;
  publishedAt?: string;
  tags: string[] | unknown;
  author: {
    id: string;
    name: string;
    avatar?: string;
    image?: string;
  };
  reactions: number | unknown[];
}

export const convertApiBlogToInterface = (
  apiData: ApiBlogResponse & { viewCount?: number }
): BlogPost => {
  // Handle the API response format from the featured blog endpoint
  return {
    id: apiData.id || "",
    title: apiData.title || "",
    content: "", // Not available in the featured API response
    excerpt: apiData.excerpt || "",
    author: {
      id: apiData.author?.id || "",
      name: apiData.author?.name || "",
      avatar: apiData.author?.image || apiData.author?.avatar || "",
      email: "", // Not available in the featured API response
    },
    coverImage: apiData.thumbnail || "",
    tags: Array.isArray(apiData.tags) ? apiData.tags : [],
    publishedAt:
      apiData.publishedAt || apiData.date_published || new Date().toISOString(),
    readTime: 5, // Default value since not available in API
    is_reacted: false, // Default value since not available in featured API
    likes: Array.isArray(apiData.reactions)
      ? apiData.reactions.length
      : apiData.reactions || 0,
    views: apiData.viewCount || 0,
    comments: [], // Default value since not available in featured API
  };
};
