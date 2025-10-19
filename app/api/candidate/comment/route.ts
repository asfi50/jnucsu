import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    const formData = await req.formData();
    const content = formData.get("content") as string;
    const profileId = formData.get("profileId") as string;

    if (!content || !profileId) {
      return NextResponse.json(
        { message: "Content and profileId are required" },
        { status: 400 }
      );
    }

    const commentData = {
      content,
      profile: profileId,
      user: info.profileId,
      status: "published",
    };

    const res = await fetch(`${config.serverBaseUrl}/items/page_comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
      body: JSON.stringify(commentData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          message: "Failed to post comment",
          details: errorData,
        },
        { status: res.status }
      );
    }

    await res.json();
    return NextResponse.json(
      {
        message: "Comment posted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
