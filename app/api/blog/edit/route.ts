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
      blogId,
      title,
      content,
      excerpt,
      category,
      thumbnail,
      tags,
      status = "draft",
      keepExistingThumbnail = false,
    } = body;

    if (!blogId || !title || !content || !category) {
      return NextResponse.json(
        { message: "Blog ID, title, content, and category are required" },
        { status: 400 }
      );
    }

    // Verify the user owns this blog
    const blogRes = await fetch(
      `${config.serverBaseUrl}/items/blogs/${blogId}?fields=author.*`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!blogRes.ok) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const { data: blogData } = await blogRes.json();
    if (blogData.author.id !== info.profileId) {
      return NextResponse.json(
        { message: "You can only edit your own blogs" },
        { status: 403 }
      );
    }

    let thumbnailUrl = null;

    // Handle thumbnail upload
    if (thumbnail && !keepExistingThumbnail) {
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
    } else if (keepExistingThumbnail) {
      // Get the current thumbnail from the latest version
      const versionsRes = await fetch(
        `${config.serverBaseUrl}/items/blog_versions?fields=thumbnail&filter[blog][_eq]=${blogId}&sort=-date_created&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (versionsRes.ok) {
        const { data: versions } = await versionsRes.json();
        if (versions.length > 0) {
          thumbnailUrl = versions[0].thumbnail;
        }
      }
    }

    // Create a new blog version
    const versionData = {
      blog: blogId,
      title,
      excerpt: excerpt || "",
      content,
      thumbnail: thumbnailUrl,
      status: status === "pending" ? "pending" : "draft",
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
      return NextResponse.json(
        {
          error: "Failed to create blog version",
          details: await versionRes.text(),
        },
        { status: versionRes.status }
      );
    }

    const { data: versionEntry } = await versionRes.json();

    // Update the main blog's title if needed
    if (blogData.title !== title) {
      await fetch(`${config.serverBaseUrl}/items/blogs/${blogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({ title }),
      });
    }

    return NextResponse.json(
      {
        message: "Blog updated successfully",
        blogId,
        versionId: versionEntry.id,
        title: versionEntry.title,
        status: versionEntry.status,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch blog data for editing
export async function GET(request: Request) {
  const authResult = await VerifyAuthToken(request);
  if (authResult instanceof Response) return authResult;
  const { info } = authResult;

  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json(
      { message: "Blog ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the blog with its latest version
    const fields = [
      "id",
      "title",
      "author.id",
      "versions.*",
      "versions.category.*",
      "current_published_version.*",
      "current_published_version.category.*",
    ];

    const blogRes = await fetch(
      `${config.serverBaseUrl}/items/blogs/${blogId}?fields=${fields.join(
        ","
      )}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!blogRes.ok) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    const { data: blogData } = await blogRes.json();

    // Verify ownership
    if (blogData.author.id !== info.profileId) {
      return NextResponse.json(
        { message: "You can only edit your own blogs" },
        { status: 403 }
      );
    }

    // Get the latest version (draft/pending takes priority)
    const versions = blogData.versions || [];
    const latestVersion = versions.sort(
      (a: { date_created: string }, b: { date_created: string }) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    )[0];

    const versionToEdit = latestVersion || blogData.current_published_version;

    if (!versionToEdit) {
      return NextResponse.json(
        { message: "No version found to edit" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: blogData.id,
      title: versionToEdit.title,
      content: versionToEdit.content,
      excerpt: versionToEdit.excerpt,
      category: versionToEdit.category?.id?.toString() || "",
      tags: versionToEdit.tags || [],
      thumbnail: versionToEdit.thumbnail,
      status: versionToEdit.status,
      versionId: versionToEdit.id,
      canEdit: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch blog for editing",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
