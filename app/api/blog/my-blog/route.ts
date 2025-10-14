import { NextResponse } from "next/server";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { config } from "@/config";

export async function GET(request: Request) {
  const authResult = await VerifyAuthToken(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  const { userId, profileId } = authResult.info;
  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  try {
    // Fetch user's blogs with their latest versions
    const fields = [
      "id",
      "title",
      "status",
      "views",
      "is_featured",
      "date_created",
      "date_updated",
      "author.id",
      "author.name",
      "current_published_version.*",
      "current_published_version.category.*",
      "versions.*",
      "versions.category.*",
      "reactions.id",
    ];

    const res = await fetch(
      `${config.serverBaseUrl}/items/blogs?fields=${fields.join(
        ","
      )}&filter[author][_eq]=${profileId}&sort=-date_created`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          message: "Failed to fetch blog posts",
          details: errorData,
        },
        { status: res.status }
      );
    }

    const { data } = await res.json();

    const blogs = data.map(
      (blog: {
        versions?: {
          date_created: string;
          status?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          category?: { text?: string };
          tags?: string[];
          thumbnail?: string;
          reject_reason?: string;
          id?: string;
        }[];
        current_published_version?: {
          date_created: string;
          approved_at?: string;
        };
        id?: string;
        title?: string;
        status?: string;
        views?: number;
        is_featured?: boolean;
        date_created?: string;
        date_updated?: string;
        author?: { id?: string; name?: string };
        reactions?: { id: string; user: { id: string } }[];
      }) => {
        // Get the latest version (draft/pending takes priority over published)
        const versions = blog.versions || [];
        const latestVersion = versions.sort(
          (a: { date_created: string }, b: { date_created: string }) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
        )[0];

        // Determine the status and version to display
        const displayVersion = latestVersion;
        const status = latestVersion?.status || "draft";
        let hasUnpublishedChanges = false;

        // If there's a published version and a newer draft/pending version
        if (blog.current_published_version && latestVersion) {
          const publishedDate = new Date(
            blog.current_published_version.date_created
          );
          const latestDate = new Date(latestVersion.date_created);

          if (
            latestDate > publishedDate &&
            latestVersion.status !== "published"
          ) {
            hasUnpublishedChanges = true;
          }
        }

        return {
          id: blog.id,
          title: displayVersion?.title || blog.title,
          excerpt: displayVersion?.excerpt || "",
          content: displayVersion?.content || "",
          status,
          category: displayVersion?.category?.text || "",
          tags: displayVersion?.tags || [],
          thumbnail: displayVersion?.thumbnail,
          createdAt: blog.date_created,
          updatedAt: blog.date_updated,
          publishedAt: blog.current_published_version?.approved_at,
          views: blog.views || 0,
          likes: blog.reactions?.length || 0,
          rejectionReason: displayVersion?.reject_reason,
          // Version control fields
          currentVersionId: displayVersion?.id,
          hasUnpublishedChanges,
          canEdit: true,
        };
      }
    );

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
