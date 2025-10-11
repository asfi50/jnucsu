import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

// GET: Fetch all positions
export async function GET() {
  try {
    const res = await fetch(
      `${config.serverBaseUrl}/items/positions?sort=order&fields=id,name,order,allocated_slots`,
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
        { error: "Failed to fetch positions" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch positions",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST: Create a new position (admin only)
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
    const { name, order, allocated_slots } = body;

    if (!name || order === undefined || allocated_slots === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, order, allocated_slots" },
        { status: 400 }
      );
    }

    if (allocated_slots < 1) {
      return NextResponse.json(
        { error: "allocated_slots must be at least 1" },
        { status: 400 }
      );
    }

    const res = await fetch(`${config.serverBaseUrl}/items/positions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({
        name,
        order,
        allocated_slots,
        user_created: info.userId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          error: "Failed to create position",
          details: errorData.errors?.[0]?.message || "Unknown error",
        },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create position",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT: Update a position (admin only)
export async function PUT(request: Request) {
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
    const { id, name, order, allocated_slots } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Position ID is required" },
        { status: 400 }
      );
    }

    const updateData: Partial<{
      user_updated: string;
      name: string;
      order: number;
      allocated_slots: number;
    }> = {};
    if (name !== undefined) updateData.name = name;
    if (order !== undefined) updateData.order = order;
    if (allocated_slots !== undefined) {
      if (allocated_slots < 1) {
        return NextResponse.json(
          { error: "allocated_slots must be at least 1" },
          { status: 400 }
        );
      }
      updateData.allocated_slots = allocated_slots;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const res = await fetch(`${config.serverBaseUrl}/items/positions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({ ...updateData, user_updated: info.userId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          error: "Failed to update position",
          details: errorData.errors?.[0]?.message || "Unknown error",
        },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update position",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a position (admin only)
export async function DELETE(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Position ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${config.serverBaseUrl}/items/positions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          error: "Failed to delete position",
          details: errorData.errors?.[0]?.message || "Unknown error",
        },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: "Position deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete position",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
