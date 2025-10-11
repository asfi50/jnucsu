import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await VerifyAuthToken(req);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId || !info.profileId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    const body = await req.json();
    const isParticipating = body.isParticipating;
    if (typeof isParticipating !== "boolean") {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
    }

    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({ isParticipating }),
      }
    );
    if (!updateRes.ok) {
      return NextResponse.json(
        { message: "Failed to update application status" },
        { status: updateRes.status }
      );
    }

    return NextResponse.json(
      { message: "Application status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await VerifyAuthToken(req);
  if (authResult instanceof Response) return authResult;
  const { token, info } = authResult;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!info.userId || !info.profileId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
    const deleteRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page/${id}`,
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
        { message: "Failed to delete application" },
        { status: deleteRes.status }
      );
    }

    return NextResponse.json(
      { message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
