import {
  BlogComment,
  BlogPost,
  BlogPostApiResponse,
} from "@/lib/types/blogs.types";

export function convertToBlogComment(
  raw: NonNullable<BlogPostApiResponse["comments"]>[number]
): BlogComment {
  return {
    id: raw.id,
    author: {
      id: raw.user?.id || "",
      name: raw.user?.name || "",
      avatar: raw.user?.image || "",
      email: raw.user?.user?.email || "",
    },
    content: raw.content,
    createdAt: raw.date_created,
    // If you want to handle replies, add logic here
  };
}

export function convertToBlogPost(response: BlogPostApiResponse): BlogPost {
  const comments = Array.isArray(response.comments)
    ? response.comments.map(convertToBlogComment)
    : [];
  return {
    id: response.id,
    title: response.title,
    content: response.content,
    excerpt: response.excerpt,
    author: {
      id: response.user?.id || "",
      name: response.user?.name || "",
      avatar: response.user?.image || "",
      email: response.user?.user?.email || "",
    },
    coverImage: response.thumbnail || response.cover_image || "",
    tags: response.tags,
    publishedAt: response.date_published,
    readTime:
      response.reading_time ||
      Math.ceil((response.content?.split(/\s+/).length || 0) / 200), // Approx. 200 words/min
    is_reacted: response.is_reacted || false,
    likes: Array.isArray(response.reactions) ? response.reactions.length : 0,
    views: response.views || 0,
    comments: comments,
  };
}
