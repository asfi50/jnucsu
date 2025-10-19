import { config } from "@/config";
import { BlogPageApiResponse, BlogPost } from "@/lib/types/blogs.types";
import { generateAvatar, generatePlaceholderImage } from "@/lib/utils";

/**
 * Get proper image URL for blog cover image
 */
function getBlogCoverImage(
  thumbnail: string | undefined,
  title: string
): string {
  if (thumbnail) {
    // If it's already a full URL, return as is
    if (thumbnail.startsWith("http")) {
      return thumbnail;
    }
    // If it's a relative path, construct the full URL
    if (thumbnail.startsWith("/")) {
      return `${config.clientUrl || "http://localhost:3000"}${thumbnail}`;
    }
    // If it's a Directus asset ID, construct the asset URL
    return `${
      process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:3000"
    }/assets/${thumbnail}`;
  }

  // Fallback to placeholder image
  return generatePlaceholderImage(800, 400, title);
}

/**
 * Transform API response to BlogPost format expected by BlogCard component
 */
export function transformApiBlogToBlogPost(
  apiBlog: BlogPageApiResponse
): BlogPost {
  return {
    id: apiBlog.id,
    title: apiBlog.title,
    content: apiBlog.excerpt, // Using excerpt as content for list view
    excerpt: apiBlog.excerpt,
    author: {
      id: apiBlog.author.id,
      name: apiBlog.author.name,
      avatar: apiBlog.author.avatar || generateAvatar(apiBlog.author.name),
      email: `${apiBlog.author.name
        .toLowerCase()
        .replace(/\s+/g, ".")}@jnu.ac.bd`, // Generate placeholder email
    },
    coverImage: getBlogCoverImage(apiBlog.thumbnail, apiBlog.title),
    tags: apiBlog.tags || [],
    publishedAt: apiBlog.date_published,
    readTime: Math.max(1, Math.ceil((apiBlog.excerpt?.length || 0) / 200)), // Estimate reading time
    is_reacted: false, // Default to false, will be updated based on user reaction
    likes: apiBlog.reactions || 0,
    views: apiBlog.views || 0,
    is_featured: apiBlog.is_featured,
  };
}
