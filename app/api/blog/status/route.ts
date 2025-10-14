import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { VerifyAdminToken } from "@/middleware/verify-admin";
import { NextResponse } from "next/server";

// Submit for review (Author only)
export async function POST(request: Request) {
  const authResult = await VerifyAuthToken(request);
  if (authResult instanceof Response) return authResult;
  const { info } = authResult;

  try {
    const { versionId } = await request.json();

    if (!versionId) {
      return NextResponse.json(
        { message: "Version ID is required" },
        { status: 400 }
      );
    }

    // Verify the user owns this blog version
    const versionRes = await fetch(
      `${config.serverBaseUrl}/items/blog_versions/${versionId}?fields=blog.author.id,status`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!versionRes.ok) {
      return NextResponse.json(
        { message: "Blog version not found" },
        { status: 404 }
      );
    }

    const { data: versionData } = await versionRes.json();

    if (versionData.blog.author.id !== info.profileId) {
      return NextResponse.json(
        { message: "You can only submit your own blogs for review" },
        { status: 403 }
      );
    }

    if (versionData.status !== "draft") {
      return NextResponse.json(
        { message: "Only draft versions can be submitted for review" },
        { status: 400 }
      );
    }

    // Update status to pending
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/blog_versions/${versionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          status: "pending",
          submitted_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { error: "Failed to submit for review" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Blog submitted for review successfully",
      status: "pending",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to submit blog for review",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Approve/Reject blog (Admin only)
export async function PATCH(request: Request) {
  const adminResult = await VerifyAdminToken(request);
  if (adminResult instanceof Response) return adminResult;

  try {
    const { versionId, action, rejectionReason } = await request.json();

    if (!versionId || !action) {
      return NextResponse.json(
        { message: "Version ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        { message: "Rejection reason is required when rejecting" },
        { status: 400 }
      );
    }

    // Get the version data
    const versionRes = await fetch(
      `${config.serverBaseUrl}/items/blog_versions/${versionId}?fields=blog,status,title`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!versionRes.ok) {
      return NextResponse.json(
        { message: "Blog version not found" },
        { status: 404 }
      );
    }

    const { data: versionData } = await versionRes.json();

    if (versionData.status !== "pending") {
      return NextResponse.json(
        { message: "Only pending versions can be approved or rejected" },
        { status: 400 }
      );
    }

    const updateData: {
      reviewed_at: string;
      status?: string;
      published_at?: string;
      reject_reason?: string;
      rejection_reason?: string;
    } = {
      reviewed_at: new Date().toISOString(),
    };

    if (action === "approve") {
      updateData.status = "published";
      updateData.published_at = new Date().toISOString();
    } else {
      updateData.status = "rejected";
      updateData.rejection_reason = rejectionReason;
    }

    // Update the version
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/blog_versions/${versionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { error: `Failed to ${action} blog` },
        { status: 500 }
      );
    }

    // If approved, update the main blog's current_published_version
    if (action === "approve") {
      await fetch(`${config.serverBaseUrl}/items/blogs/${versionData.blog}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          current_published_version: versionId,
          title: versionData.title, // Update main blog title
        }),
      });
    }

    return NextResponse.json({
      message: `Blog ${action}d successfully`,
      status: updateData.status,
      ...(action === "reject" && { rejectionReason }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update blog status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Get pending blogs for review (Admin only)
export async function GET(request: Request) {
  const adminResult = await VerifyAdminToken(request);
  if (adminResult instanceof Response) return adminResult;

  try {
    const fields = [
      "id",
      "title",
      "excerpt",
      "thumbnail",
      "status",
      "submitted_at",
      "blog.id",
      "blog.title",
      "blog.author.id",
      "blog.author.first_name",
      "blog.author.last_name",
      "blog.author.email",
      "category.id",
      "category.name",
      "tags",
    ];

    const res = await fetch(
      `${config.serverBaseUrl}/items/blog_versions?fields=${fields.join(
        ","
      )}&filter[status][_eq]=pending&sort=-submitted_at`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch pending blogs" },
        { status: 500 }
      );
    }

    const { data } = await res.json();

    const pendingBlogs = data.map(
      (version: {
        id: string;
        blog: {
          id: string;
          author: {
            id: string;
            name: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            image?: string;
          };
        };
        title: string;
        excerpt: string;
        thumbnail?: string;
        status: string;
        submitted_at: string;
        category?: {
          id: string;
          name: string;
        };
        tags?: string[];
      }) => ({
        versionId: version.id,
        blogId: version.blog.id,
        title: version.title,
        excerpt: version.excerpt,
        thumbnail: version.thumbnail,
        status: version.status,
        submittedAt: version.submitted_at,
        author: {
          id: version.blog.author.id,
          name: `${version.blog.author.first_name} ${version.blog.author.last_name}`,
          email: version.blog.author.email,
        },
        category: version.category
          ? {
              id: version.category.id,
              name: version.category.name,
            }
          : null,
        tags: version.tags || [],
      })
    );

    return NextResponse.json({
      pendingBlogs,
      count: pendingBlogs.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch pending blogs",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
