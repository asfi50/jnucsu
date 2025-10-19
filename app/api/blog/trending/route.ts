import { config } from "@/config";
import { NextResponse } from "next/server";

interface TrendingBlogData {
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

interface BlogWithScore extends TrendingBlogData {
  trendingScore: number;
}

function calculateTrendingScore(blog: TrendingBlogData): number {
  const now = new Date();
  const publishedDate = new Date(blog.current_published_version.approved_at);
  const daysSincePublished = Math.max(
    1,
    (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Trending score formula: (reactions * 2 + views) / age_in_days
  const reactions = blog.reactions?.length || 0;
  const views = blog.views || 0;

  return (reactions * 2 + views) / Math.pow(daysSincePublished, 1.2);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "4";

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

    // Fetch recent blogs (last 30 days) for trending calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const res = await fetch(
      `${
        config.serverBaseUrl
      }/items/blogs?filter[status][_eq]=published&filter[current_published_version][_nnull]=true&filter[current_published_version][approved_at][_gte]=${thirtyDaysAgo.toISOString()}&sort=-date_updated&limit=50&fields=${fields.join(
        ","
      )}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch blogs for trending calculation");
    }

    const { data } = await res.json();

    const blogsWithScores: BlogWithScore[] = data
      .filter((blog: TrendingBlogData) => blog.current_published_version)
      .map((blog: TrendingBlogData) => ({
        ...blog,
        trendingScore: calculateTrendingScore(blog),
      }))
      .sort(
        (a: BlogWithScore, b: BlogWithScore) =>
          b.trendingScore - a.trendingScore
      )
      .slice(0, parseInt(limit));

    const trendingBlogs = blogsWithScores.map((blog: BlogWithScore) => {
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
          ? blog.current_published_version.thumbnail
          : null,
        author: {
          id: blog.author.id,
          name: blog.author.name,
          avatar: blog.author.image ? blog.author.image : null,
        },
        category: blog.current_published_version.category?.text || "General",
        tags: blog.current_published_version.tags || [],
        publishedAt: blog.current_published_version.approved_at,
        views: blog.views || 0,
        likes: reactionCounts.like || 0,
        loves: reactionCounts.love || 0,
        totalReactions: blog.reactions?.length || 0,
        trendingScore: blog.trendingScore,
      };
    });

    return NextResponse.json(trendingBlogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch trending blogs",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
