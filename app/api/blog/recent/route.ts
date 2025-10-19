import { config } from "@/config";
import { NextResponse } from "next/server";

interface RecentBlogData {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  current_published_version: {
    id: string;
    title: string;
    excerpt?: string;
    thumbnail?: string;
    tags?: string[];
    category?: {
      id: string;
      text: string;
    };
    approved_at: string;
  };
  reactions: Array<{
    id: string;
    value: string;
  }>;
  views: number;
  date_updated: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "6";

    const fields = [
      "id",
      "title",
      "views",
      "date_updated",
      "author.id",
      "author.name",
      "author.image",
      "current_published_version.id",
      "current_published_version.title",
      "current_published_version.excerpt",
      "current_published_version.thumbnail",
      "current_published_version.tags",
      "current_published_version.category.id",
      "current_published_version.category.text",
      "current_published_version.approved_at",
      "reactions.id",
      "reactions.value",
    ];

    const res = await fetch(
      `${
        config.serverBaseUrl
      }/items/blogs?filter[status][_eq]=published&filter[current_published_version][_nnull]=true&sort=-date_updated&limit=${limit}&fields=${fields.join(
        ","
      )}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch recent blogs");
    }

    const { data } = await res.json();

    const recentBlogs = data
      .filter((blog: RecentBlogData) => blog.current_published_version)
      .map((blog: RecentBlogData) => {
        // Calculate reaction counts
        const reactionCounts =
          blog.reactions?.reduce((acc, reaction) => {
            acc[reaction.value] = (acc[reaction.value] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {};

        return {
          id: blog.id,
          title: blog.current_published_version.title || blog.title,
          excerpt: blog.current_published_version.excerpt || "",
          thumbnail: blog.current_published_version.thumbnail
            ? `${config.serverBaseUrl}/assets/${blog.current_published_version.thumbnail}`
            : null,
          author: {
            id: blog.author.id,
            name: blog.author.name,
            avatar: blog.author.image
              ? `${config.serverBaseUrl}/assets/${blog.author.image}`
              : null,
          },
          category: blog.current_published_version.category?.text || "General",
          tags: blog.current_published_version.tags || [],
          publishedAt: blog.current_published_version.approved_at,
          views: blog.views || 0,
          likes: reactionCounts.like || 0,
          loves: reactionCounts.love || 0,
          totalReactions: blog.reactions?.length || 0,
        };
      });

    return NextResponse.json(recentBlogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch recent blogs",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
