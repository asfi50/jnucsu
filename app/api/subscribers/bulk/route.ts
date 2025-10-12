import { config } from "@/config";
import { VerifyAdminToken } from "@/middleware/verify-admin";
import { NextResponse } from "next/server";

// POST - Bulk operations on subscribers (admin only)
export async function POST(req: Request) {
  // Verify admin authentication
  const authResult = await VerifyAdminToken(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await req.json();
    const { action, subscriber_ids, emails } = body;

    if (!action) {
      return NextResponse.json(
        { message: "Action is required" },
        { status: 400 }
      );
    }

    if (!subscriber_ids && !emails) {
      return NextResponse.json(
        { message: "Subscriber IDs or emails are required" },
        { status: 400 }
      );
    }

    let targetIds = subscriber_ids || [];

    // If emails provided, convert to IDs
    if (emails && emails.length > 0) {
      const emailFilter = emails
        .map(
          (email: string) => `filter[email][_eq]=${encodeURIComponent(email)}`
        )
        .join("&");

      const findRes = await fetch(
        `${config.serverBaseUrl}/items/subscribers?fields=id,email&${emailFilter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (findRes.ok) {
        const { data } = await findRes.json();
        const foundIds = data.map((subscriber: any) => subscriber.id);
        targetIds = [...targetIds, ...foundIds];
      }
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { message: "No valid subscribers found" },
        { status: 404 }
      );
    }

    // Prepare update data based on action
    const updateData: any = {
      date_updated: new Date().toISOString(),
    };

    switch (action) {
      case "activate":
        updateData.is_active = true;
        updateData.status = "published";
        break;
      case "deactivate":
        updateData.is_active = false;
        updateData.status = "archived";
        break;
      case "block":
        updateData.is_active = false;
        updateData.status = "draft";
        break;
      case "delete":
        // Permanent delete (use with caution)
        const deletePromises = targetIds.map((id: string) =>
          fetch(`${config.serverBaseUrl}/items/subscribers/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.adminToken}`,
            },
          })
        );

        const deleteResults = await Promise.allSettled(deletePromises);
        const successfulDeletes = deleteResults.filter(
          (result) =>
            result.status === "fulfilled" && (result.value as Response).ok
        ).length;

        return NextResponse.json(
          {
            message: `Successfully deleted ${successfulDeletes} of ${targetIds.length} subscribers`,
            deleted_count: successfulDeletes,
            total_count: targetIds.length,
            action: "deleted",
          },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          {
            message:
              "Invalid action. Use: activate, deactivate, block, or delete",
          },
          { status: 400 }
        );
    }

    // Perform bulk update
    const updatePromises = targetIds.map((id: string) =>
      fetch(`${config.serverBaseUrl}/items/subscribers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(updateData),
      })
    );

    const updateResults = await Promise.allSettled(updatePromises);
    const successfulUpdates = updateResults.filter(
      (result) => result.status === "fulfilled" && (result.value as Response).ok
    ).length;

    return NextResponse.json(
      {
        message: `Successfully ${action}d ${successfulUpdates} of ${targetIds.length} subscribers`,
        updated_count: successfulUpdates,
        total_count: targetIds.length,
        action: action,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to perform bulk operation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
