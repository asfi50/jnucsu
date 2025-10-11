import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

interface Info {
  userId: string;
  profileId: string;
}

export async function VerifyAuthToken(
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

    // Validate payload has all Info properties
    const { userId, profileId } = payload as Partial<Info>;

    return {
      token,
      info: {
        userId: userId || "",
        profileId: profileId || "",
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
