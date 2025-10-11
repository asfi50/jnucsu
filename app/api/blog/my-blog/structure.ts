import { MyBlogPost, BlogApiResponse } from "@/lib/types/blogs.types";

export function mapApiResponseToBlogPost(
  apiResponse: BlogApiResponse
): MyBlogPost {
  return {
    id: apiResponse.id,
    title: apiResponse.title,
    excerpt: apiResponse.excerpt,
    content: apiResponse.content,
    status: apiResponse.status,
    category: apiResponse.category.text,
    tags: apiResponse.tags,
    thumbnail: apiResponse.thumbnail,
    createdAt: apiResponse.date_created,
    updatedAt: apiResponse.date_updated,
    publishedAt: apiResponse.date_published,
    views: apiResponse.views || 0,
    likes: apiResponse.reactions?.length || 0,
    rejectionReason: apiResponse.rejection_reason || undefined,
  };
}
