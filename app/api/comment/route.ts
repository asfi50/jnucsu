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
  if (!info.userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  try {
    const body = await req.json();
    const { content, blogId } = body;
    if (!content || !blogId) {
      return NextResponse.json(
        { message: "Content and blogId are required" },
        { status: 400 }
      );
    }

    const commentData = {
      content,
      blog: blogId,
      user: info.profileId,
      user_created: info.userId,
    };

    const res = await fetch(`${config.serverBaseUrl}/items/comment`, {
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
