import { config } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fields = [
      "id",
      "title",
      "status",
      "is_featured",
      "views",
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
      "reactions.user.id",
      "reactions.user.name",
    ];

    const res = await fetch(
      `${
        config.serverBaseUrl
      }/items/blogs?filter[status][_eq]=published&filter[current_published_version][_nnull]=true&sort=-date_updated&fields=${fields.join(
        ","
      )}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const { data } = await res.json();

    const enhancedData = data
      .filter(
        (blog: {
          current_published_version?: {
            title: string;
            excerpt: string;
            approved_at: string;
          };
        }) => blog.current_published_version
      ) // Only include blogs with published versions
      .map(
        (blog: {
          id: string;
          current_published_version: {
            title: string;
            excerpt: string;
            tags?: string[];
            approved_at: string;
            thumbnail?: string;
            category?: { text: string };
          };
          is_featured?: boolean;
          views?: number;
          author?: { name: string; id?: string; image?: string };
          reactions?: { id: string; user: { id: string } }[];
        }) => {
          const publishedVersion = blog.current_published_version;
          return {
            id: blog.id,
            title: publishedVersion.title,
            excerpt: publishedVersion.excerpt,
            tags: publishedVersion.tags || [],
            date_published: publishedVersion.approved_at,
            thumbnail: publishedVersion.thumbnail,
            category: publishedVersion.category?.text,
            is_featured: blog.is_featured || false,
            views: blog.views || 0,
            reactions: blog.reactions?.length || 0,
            author: {
              id: blog.author?.id,
              name: blog.author?.name,
              avatar: blog.author?.image,
            },
          };
        }
      );

    return NextResponse.json(enhancedData);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch blog posts." },
      { status: 500 }
    );
  }
}
