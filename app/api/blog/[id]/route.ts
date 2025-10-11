import { config } from "@/config";
import { NextResponse } from "next/server";
import { convertToBlogPost } from "./structure";
import { BlogPostApiResponse } from "@/lib/types/blogs.types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const query = new URL(req.url).searchParams;
  const userId = query.get("user");
  try {
    const fetchRes = await fetch(
      `${config.serverBaseUrl}/items/blog/${id}?fields=*.*.*.*`,
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

    const { data: currentBlog }: { data: BlogPostApiResponse } =
      await fetchRes.json();
    const currentViews = currentBlog?.views || 0;

    const updateRes = await fetch(`${config.serverBaseUrl}/items/blog/${id}`, {
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
      const errorData = await updateRes.json();
      return NextResponse.json(
        {
          message: "Failed to update blog post views",
          details: errorData,
        },
        { status: updateRes.status }
      );
    }

    // Return the updated blog post data
    const { data: updatedData } = await updateRes.json();
    const structuredData = convertToBlogPost({
      ...currentBlog,
      is_reacted: userId
        ? (currentBlog.reactions || []).some(
            (reaction) => reaction.user.id === userId
          )
        : false,
      views: updatedData.views,
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
