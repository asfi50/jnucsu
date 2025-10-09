import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

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
    const { title, content, category } = body;
    if (!title || !content || !category) {
      return NextResponse.json(
        { message: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${config.serverBaseUrl}/items/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify({
        user: info.profileId,
        ...body,
      }),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to create blog post", details: await res.text() },
        { status: res.status }
      );
    }
    const { data } = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
