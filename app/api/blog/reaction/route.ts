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
    const { blogId, reactionType } = body;
    if (!blogId || !reactionType) {
      return NextResponse.json(
        { message: "Blog ID and reaction type are required" },
        { status: 400 }
      );
    }
    if (reactionType === "like") {
      console.log("like reaction received");
      const res = await fetch(`${config.serverBaseUrl}/items/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          blog: blogId,
          user: info.profileId,
          user_created: info.userId,
          reaction_type: reactionType,
        }),
      });
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = "Unknown error";
        }
        return NextResponse.json(
          {
            message: "Failed to add reaction",
            details: errorData,
          },
          { status: res.status }
        );
      }
      // Successfully created reaction, response may or may not have JSON content
      try {
        await res.json();
      } catch {
        // Ignore JSON parsing errors for successful responses
      }
    } else if (reactionType === "unlike") {
      const res = await fetch(
        `${config.serverBaseUrl}/items/reaction?filter[blog][_eq]=${blogId}&filter[user][_eq]=${info.profileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = "Unknown error";
        }
        return NextResponse.json(
          {
            message: "Failed to fetch existing reaction",
            details: errorData,
          },
          { status: res.status }
        );
      }
      const { data: existingReactions } = await res.json();
      if (existingReactions.length === 0) {
        return NextResponse.json(
          { message: "No existing reaction to remove" },
          { status: 400 }
        );
      }
      const reactionId = existingReactions[0].id;
      const deleteRes = await fetch(
        `${config.serverBaseUrl}/items/reaction/${reactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );
      if (!deleteRes.ok) {
        let errorData;
        try {
          errorData = await deleteRes.json();
        } catch {
          errorData = "Unknown error";
        }
        return NextResponse.json(
          {
            message: "Failed to remove reaction",
            details: errorData,
          },
          { status: deleteRes.status }
        );
      }
      // DELETE responses typically don't have JSON content, so we don't parse them
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error handling reaction:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
