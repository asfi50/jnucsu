import { config } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fields = [
      "id",
      "title",
      "is_featured",
      "current_published_version.id",
      "current_published_version.title",
      "current_published_version.excerpt",
      "current_published_version.thumbnail",
      "current_published_version.approved_at",
      "current_published_version.tags",
      "current_published_version.category.id",
      "current_published_version.category.text",
      "author.id",
      "author.name",
      "author.image",
      "views",
      "reactions.id",
    ];

    const res = await fetch(
      `${config.serverBaseUrl}/items/blogs?fields=${fields.join(
        ","
      )}&filter[is_featured][_eq]=true&filter[current_published_version][_nnull]=true&sort=-current_published_version.approved_at`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch featured blogs", error: await res.text() },
        { status: res.status }
      );
    }

    const { data } = await res.json();

    if (data.length === 0) {
      return NextResponse.json({}, { status: 200 });
    }

    const blogData = data[0];
    const version = blogData.current_published_version;

    if (!version) {
      return NextResponse.json({}, { status: 200 });
    }

    const featured = {
      id: blogData.id,
      versionId: version.id,
      title: version.title,
      excerpt: version.excerpt || "",
      thumbnail: version.thumbnail || "",
      tags: version.tags || [],
      category: {
        id: version.category?.id || null,
        name: version.category?.text || "",
      },
      author: {
        id: blogData.author.id,
        name: blogData.author.name || "",
        image: blogData.author.image || "",
      },
      publishedAt: version.approved_at,
      viewCount: blogData.views || 0,
      reactions: blogData.reactions || [],
      isFeatured: blogData.is_featured,
    };

    return NextResponse.json(featured, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
