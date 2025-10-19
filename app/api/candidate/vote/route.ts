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
    const { candidateProfileId, voteType } = body;

    if (!candidateProfileId || !voteType) {
      return NextResponse.json(
        { message: "Candidate profile ID and vote type are required" },
        { status: 400 }
      );
    }

    // Validate vote type
    if (!["upvote", "unvote"].includes(voteType)) {
      return NextResponse.json(
        { message: "Invalid vote type. Must be 'upvote' or 'unvote'" },
        { status: 400 }
      );
    }

    const res_vote = await fetch(
      `${config.serverBaseUrl}/items/vote?filter[candidate][_eq]=${candidateProfileId}&filter[user][_eq]=${info.profileId}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res_vote.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch existing votes",
          details: await res_vote.text(),
        },
        { status: res_vote.status }
      );
    }
    const { data } = await res_vote.json();
    if (data.length > 0 && voteType === "upvote") {
      return NextResponse.json(
        { message: "You have already upvoted this candidate" },
        { status: 400 }
      );
    }
    if (data.length === 0 && voteType === "unvote") {
      return NextResponse.json(
        { message: "You have not upvoted this candidate yet" },
        { status: 400 }
      );
    }

    if (voteType === "upvote") {
      // Create a new vote
      const createRes = await fetch(`${config.serverBaseUrl}/items/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify({
          candidate: candidateProfileId,
          user: info.profileId,
        }),
      });

      if (!createRes.ok) {
        return NextResponse.json(
          { message: "Failed to create vote" },
          { status: createRes.status }
        );
      }
    } else if (voteType === "unvote") {
      // Delete the existing vote
      const voteId = data[0].id;
      const deleteRes = await fetch(
        `${config.serverBaseUrl}/items/vote/${voteId}`,
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
          { message: "Failed to delete vote" },
          { status: deleteRes.status }
        );
      }
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error handling vote:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
