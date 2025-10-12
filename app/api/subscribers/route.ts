import { config } from "@/config";
import { VerifyAdminToken } from "@/middleware/verify-admin";
import { NextResponse } from "next/server";

// GET - Fetch all subscribers (admin only)
export async function GET(request: Request) {
  // Verify admin authentication
  const authResult = await VerifyAdminToken(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    // Build filter query
    let filterQuery = "";
    const filters: string[] = [];

    if (status && status !== "all") {
      filters.push(`filter[status][_eq]=${status}`);
    }

    if (search) {
      filters.push(`filter[email][_icontains]=${encodeURIComponent(search)}`);
    }

    if (filters.length > 0) {
      filterQuery = `&${filters.join("&")}`;
    }

    const res = await fetch(
      `${config.serverBaseUrl}/items/subscribers?fields=id,email,date_created,date_updated,status,is_active&sort=-date_created&limit=${limit}&offset=${offset}${filterQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: res.status }
      );
    }

    const { data, meta } = await res.json();

    return NextResponse.json({
      subscribers: data,
      meta: {
        total: meta?.total_count || data.length,
        filtered: meta?.filter_count || data.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch subscribers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Subscribe a new email
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingRes = await fetch(
      `${
        config.serverBaseUrl
      }/items/subscribers?filter[email][_eq]=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (existingRes.ok) {
      const { data } = await existingRes.json();

      if (data && data.length > 0) {
        const existingSubscriber = data[0];

        // If subscriber exists but is disabled, re-enable them
        if (
          !existingSubscriber.is_active ||
          existingSubscriber.status !== "published"
        ) {
          const updateRes = await fetch(
            `${config.serverBaseUrl}/items/subscribers/${existingSubscriber.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.adminToken}`,
              },
              body: JSON.stringify({
                is_active: true,
                status: "published",
                date_updated: new Date().toISOString(),
              }),
            }
          );

          if (updateRes.ok) {
            const { data: updatedData } = await updateRes.json();
            return NextResponse.json(
              {
                message: "Successfully re-subscribed!",
                subscriber: updatedData,
                action: "reactivated",
              },
              { status: 200 }
            );
          }
        }

        // If already active, return existing subscription
        return NextResponse.json(
          {
            message: "Email is already subscribed",
            subscriber: existingSubscriber,
            action: "existing",
          },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    const subscriberData = {
      email,
      status: "published",
      is_active: true,
      date_created: new Date().toISOString(),
    };

    const res = await fetch(`${config.serverBaseUrl}/items/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify(subscriberData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          message: "Failed to subscribe",
          details: errorData,
        },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(
      {
        message: "Successfully subscribed!",
        subscriber: data,
        action: "created",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to subscribe",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete (disable) a subscriber
// PATCH - Update subscriber status (admin only)
export async function PATCH(req: Request) {
  // Verify admin authentication
  const authResult = await VerifyAdminToken(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const body = await req.json();
    const { id, email, status, is_active, action } = body;

    if (!id && !email) {
      return NextResponse.json(
        { message: "Subscriber ID or email is required" },
        { status: 400 }
      );
    }

    let subscriberId = id;

    // If email provided, find subscriber by email
    if (email && !id) {
      const findRes = await fetch(
        `${
          config.serverBaseUrl
        }/items/subscribers?filter[email][_eq]=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (!findRes.ok) {
        return NextResponse.json(
          { message: "Failed to find subscriber" },
          { status: findRes.status }
        );
      }

      const { data } = await findRes.json();
      if (!data || data.length === 0) {
        return NextResponse.json(
          { message: "Subscriber not found" },
          { status: 404 }
        );
      }

      subscriberId = data[0].id;
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      date_updated: new Date().toISOString(),
    };

    // Handle different actions
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
      default:
        // Manual status updates
        if (status !== undefined) updateData.status = status;
        if (is_active !== undefined) updateData.is_active = is_active;
    }

    // Update subscriber
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/subscribers/${subscriberId}`,
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
        { message: "Failed to update subscriber" },
        { status: updateRes.status }
      );
    }

    const { data } = await updateRes.json();

    return NextResponse.json(
      {
        message: "Subscriber updated successfully!",
        subscriber: data,
        action: action || "updated",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update subscriber",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete (disable) a subscriber
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { message: "Email or ID parameter is required" },
        { status: 400 }
      );
    }

    let subscriberId = id;

    // If email provided, find subscriber by email
    if (email && !id) {
      const findRes = await fetch(
        `${
          config.serverBaseUrl
        }/items/subscribers?filter[email][_eq]=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (!findRes.ok) {
        return NextResponse.json(
          { message: "Failed to find subscriber" },
          { status: findRes.status }
        );
      }

      const { data } = await findRes.json();
      if (!data || data.length === 0) {
        return NextResponse.json(
          { message: "Email not found in subscribers" },
          { status: 404 }
        );
      }

      subscriberId = data[0].id;
    }

    // Soft delete - mark as inactive and archived instead of deleting
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/subscribers/${subscriberId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          is_active: false,
          status: "archived",
          date_updated: new Date().toISOString(),
        }),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { message: "Failed to unsubscribe" },
        { status: updateRes.status }
      );
    }

    const { data } = await updateRes.json();

    return NextResponse.json(
      {
        message: "Successfully unsubscribed!",
        subscriber: data,
        action: "deactivated",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to unsubscribe",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
