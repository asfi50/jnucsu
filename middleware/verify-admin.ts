import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { config } from "@/config";

interface Info {
  userId: string;
  profileId: string;
  role?: string;
}

export async function VerifyAdminToken(
  request: Request
): Promise<{ token: string; info: Info } | Response> {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const payload = verifyJWT(token);
    if (typeof payload === "string") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { userId, profileId } = payload as Partial<Info>;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Fetch user role from Directus to verify admin access
    const userResponse = await fetch(
      `${config.serverBaseUrl}/users/${userId}?fields=role.name`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { message: "Failed to verify user permissions" },
        { status: 403 }
      );
    }

    const userData = await userResponse.json();
    const userRole = userData.data?.role?.name;

    // Check if user has admin role (adjust role name as needed)
    if (userRole !== "Administrator" && userRole !== "Admin") {
      return NextResponse.json(
        { message: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    return {
      token,
      info: {
        userId: userId || "",
        profileId: profileId || "",
        role: userRole,
      },
    };
  } catch (error) {
    return NextResponse.json(
      {
        message: "Token verification failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 401 }
    );
  }
}
