import { config } from "@/config";
import { NextResponse } from "next/server";

// GET - Fetch all subscribers (admin only)
export async function GET() {
  try {
    const res = await fetch(
      `${config.serverBaseUrl}/items/subscribers?fields=id,email,date_created,status&sort=-date_created`,
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

    const { data } = await res.json();
    return NextResponse.json(data);
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

    // Create new subscriber
    const subscriberData = {
      email,
      status: "published",
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

      // Handle unique constraint violation (duplicate email)
      if (
        res.status === 400 &&
        errorData.errors?.[0]?.extensions?.code === "RECORD_NOT_UNIQUE"
      ) {
        return NextResponse.json(
          { message: "Email already subscribed" },
          { status: 409 }
        );
      }

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

// DELETE - Unsubscribe an email
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Find subscriber by email
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

    const subscriberId = data[0].id;

    // Delete subscriber
    const deleteRes = await fetch(
      `${config.serverBaseUrl}/items/subscribers/${subscriberId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!deleteRes.ok) {
      return NextResponse.json(
        { message: "Failed to unsubscribe" },
        { status: deleteRes.status }
      );
    }

    return NextResponse.json(
      { message: "Successfully unsubscribed!" },
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
