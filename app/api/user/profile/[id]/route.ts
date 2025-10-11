import { config } from "@/config";
import { NextResponse } from "next/server";
import { formatPublicProfile } from "./function";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const fetchRes = await fetch(
      `${config.serverBaseUrl}/items/profile/${id}?fields=*.*.*.*`,
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
          message: "Failed to fetch user profile",
          details: errorData,
        },
        { status: fetchRes.status }
      );
    }

    const { data: userProfile } = await fetchRes.json();
    return NextResponse.json(formatPublicProfile(userProfile), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching user profile",
        details: error,
      },
      { status: 500 }
    );
  }
}
