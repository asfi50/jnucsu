import { config } from "@/config";
import { NextResponse } from "next/server";
import { convertToBlogPost } from "./structure";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const query = new URL(req.url).searchParams;
  const userId = query.get("user");

  try {
    const fields = [
      "id",
      "title",
      "status",
      "views",
      "is_featured",
      "author.id",
      "author.name",
      "author.image",
      "author.user.email",
      "current_published_version.*",
      "current_published_version.category.*",
      "current_published_version.created_by.*",
      "comments.id",
      "comments.content",
      "comments.date_created",
      "comments.user.id",
      "comments.user.name",
      "comments.user.image",
      "comments.user.user.email",
      "reactions.id",
      "reactions.value",
      "reactions.user.id",
      "reactions.user.name",
    ];

    const fetchRes = await fetch(
      `${config.serverBaseUrl}/items/blogs/${id}?fields=${fields.join(",")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!fetchRes.ok) {
      const errorData = await fetchRes.json();
      return NextResponse.json(
        {
          message: "Failed to fetch blog post",
          details: errorData,
        },
        { status: fetchRes.status }
      );
    }

    const { data: blogData } = await fetchRes.json();

    // Check if blog has a published version
    if (!blogData.current_published_version) {
      return NextResponse.json(
        {
          message: "Blog post not published or not found",
        },
        { status: 404 }
      );
    }

    // Update view count
    const currentViews = blogData.views || 0;
    const updateRes = await fetch(`${config.serverBaseUrl}/items/blogs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({
        views: currentViews + 1,
      }),
    });

    if (!updateRes.ok) {
      console.warn("Failed to update view count, but continuing...");
    }

    const publishedVersion = blogData.current_published_version;

    // Convert to the expected format
    const structuredData = convertToBlogPost({
      id: blogData.id,
      title: publishedVersion.title,
      content: publishedVersion.content,
      excerpt: publishedVersion.excerpt,
      user: blogData.author,
      thumbnail: publishedVersion.thumbnail,
      cover_image: publishedVersion.thumbnail,
      tags: publishedVersion.tags || [],
      date_published: publishedVersion.approved_at,
      reading_time: Math.ceil((publishedVersion.content?.length || 0) / 1000), // Rough estimate
      is_reacted: userId
        ? (blogData.reactions || []).some(
            (reaction: { user: { id: string } }) => reaction.user.id === userId
          )
        : false,
      reactions: blogData.reactions || [],
      views: currentViews + 1,
      comments: blogData.comments || [],
    });

    return NextResponse.json(structuredData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
