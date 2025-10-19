import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

// Helper function to check existing reactions
async function checkExistingReaction(blogId: string, userId: string) {
  const res = await fetch(
    `${config.serverBaseUrl}/items/reaction?filter[blogs][_eq]=${blogId}&filter[user][_eq]=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.adminToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to check existing reaction: ${res.status}`);
  }

  const { data: existingReactions } = await res.json();
  return existingReactions;
}

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

    // Validate reaction type
    if (!["like", "unlike"].includes(reactionType)) {
      return NextResponse.json(
        { message: "Invalid reaction type. Must be 'like' or 'unlike'" },
        { status: 400 }
      );
    }
    if (reactionType === "like") {
      // Check if user already has a reaction on this blog
      try {
        const existingReactions = await checkExistingReaction(
          blogId,
          info.profileId
        );

        // If user already has a reaction on this blog, return error
        if (existingReactions.length > 0) {
          return NextResponse.json(
            { message: "You have already reacted to this blog" },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            message: "Failed to check existing reaction",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      } // Proceed with creating the reaction
      const res = await fetch(`${config.serverBaseUrl}/items/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          blogs: blogId, // Updated to use 'blogs' field as per new schema
          user: info.profileId,
          value: "like", // Use 'value' field instead of 'reaction_type'
          status: "published",
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
      let existingReactions;
      try {
        existingReactions = await checkExistingReaction(blogId, info.profileId);
      } catch (error) {
        return NextResponse.json(
          {
            message: "Failed to fetch existing reaction",
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }

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
