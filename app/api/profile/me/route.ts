import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";
import { mapApiResponseToUserProfile } from "./structured";

export async function GET(request: Request) {
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
    const res = await fetch(
      `${config.serverBaseUrl}/items/profile/${info.profileId}?fields=*.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    return NextResponse.json(mapApiResponseToUserProfile(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
