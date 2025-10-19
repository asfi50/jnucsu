import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { uploadImageFromBase64 } from "@/lib/utils/image-upload";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authResult = await VerifyAuthToken(request);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    const body = await request.json();
    const {
      title,
      content,
      category,
      thumbnail,
      excerpt,
      tags,
      status = "draft",
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { message: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    let thumbnailUrl = null;

    // Upload thumbnail if provided (base64 format)
    if (thumbnail) {
      try {
        thumbnailUrl = await uploadImageFromBase64(
          thumbnail,
          "blog-thumbnails"
        );
      } catch (uploadError) {
        console.error("Thumbnail upload failed:", uploadError);
        return NextResponse.json(
          {
            error: "Failed to upload thumbnail",
            details:
              uploadError instanceof Error
                ? uploadError.message
                : String(uploadError),
          },
          { status: 500 }
        );
      }
    }

    // Step 1: Create the main blog entry
    const blogData = {
      title,
      author: info.profileId,
      status: "draft", // Main blog status is always draft initially
      views: 0,
      is_featured: false,
    };

    const blogRes = await fetch(`${config.serverBaseUrl}/items/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify(blogData),
    });

    if (!blogRes.ok) {
      return NextResponse.json(
        { error: "Failed to create blog entry", details: await blogRes.text() },
        { status: blogRes.status }
      );
    }

    const { data: blogEntry } = await blogRes.json();

    // Step 2: Create the blog version
    const versionData = {
      blog: blogEntry.id,
      title,
      excerpt: excerpt || "",
      content,
      thumbnail: thumbnailUrl,
      status: status === "pending" ? "pending" : "draft", // Support draft or pending
      category: parseInt(category),
      tags: tags || [],
      created_by: info.profileId,
      submitted_at: status === "pending" ? new Date().toISOString() : null,
    };

    const versionRes = await fetch(
      `${config.serverBaseUrl}/items/blog_versions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(versionData),
      }
    );

    if (!versionRes.ok) {
      // Cleanup: delete the blog entry if version creation fails
      await fetch(`${config.serverBaseUrl}/items/blogs/${blogEntry.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      });

      return NextResponse.json(
        {
          error: "Failed to create blog version",
          details: await versionRes.text(),
        },
        { status: versionRes.status }
      );
    }

    const { data: versionEntry } = await versionRes.json();

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        blogId: blogEntry.id,
        versionId: versionEntry.id,
        title: versionEntry.title,
        status: versionEntry.status,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
