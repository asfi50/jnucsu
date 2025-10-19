import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
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
    const body = await req.json();
    const { status, candidateId, rejectionReason, moderatorNotes } = body;

    // Validate status
    const validStatuses = ["draft", "pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          message:
            "Invalid status. Must be one of: draft, pending, approved, rejected",
        },
        { status: 400 }
      );
    }

    // Get the candidate application to verify ownership or admin rights
    const candidateRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page/${candidateId}?fields=*,profile.id`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!candidateRes.ok) {
      return NextResponse.json(
        { message: "Candidate application not found" },
        { status: 404 }
      );
    }

    const candidateData = await candidateRes.json();
    const candidate = candidateData.data;

    // Check if user owns this application or is admin
    if (candidate.profile.id !== info.profileId) {
      // TODO: Add admin role check here
      return NextResponse.json(
        { message: "You can only update your own application" },
        { status: 403 }
      );
    }

    // Build update payload
    const updatePayload: {
      status: string;
      approved_at?: string;
      rejectionReason?: string;
      moderatorNotes?: string;
    } = {
      status,
    };

    // Add timestamp for approved status
    if (status === "approved") {
      updatePayload.approved_at = new Date().toISOString();

      // Link approved candidate to profile
      const profileUpdateRes = await fetch(
        `${config.serverBaseUrl}/items/profile/${candidate.profile.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify({
            candidate_profile: candidateId,
          }),
        }
      );

      if (!profileUpdateRes.ok) {
        console.error(
          "Error linking candidate to profile:",
          await profileUpdateRes.text()
        );
      }
    }

    // Add rejection reason for rejected status
    if (status === "rejected" && rejectionReason) {
      updatePayload.rejectionReason = rejectionReason;
    }

    // Add moderator notes if provided
    if (moderatorNotes) {
      updatePayload.moderatorNotes = moderatorNotes;
    }

    // Update candidate application
    const updateRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page/${candidateId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("Error updating candidate status:", errorText);
      return NextResponse.json(
        { message: "Failed to update candidate status" },
        { status: updateRes.status }
      );
    }

    const updatedData = await updateRes.json();

    return NextResponse.json(
      {
        message: `Candidate status updated to ${status}`,
        data: updatedData.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating candidate status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
    const url = new URL(req.url);
    const candidateId = url.searchParams.get("candidateId");

    if (!candidateId) {
      return NextResponse.json(
        { message: "Candidate ID is required" },
        { status: 400 }
      );
    }

    // Get candidate with full details
    const candidateRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page/${candidateId}?fields=*,profile.*,position.*,panel.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!candidateRes.ok) {
      return NextResponse.json(
        { message: "Candidate application not found" },
        { status: 404 }
      );
    }

    const candidateData = await candidateRes.json();
    const candidate = candidateData.data;

    // Check if user owns this application
    if (candidate.profile.id !== info.profileId) {
      return NextResponse.json(
        { message: "You can only view your own application status" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        status: candidate.status,
        approvedAt: candidate.approved_at,
        rejectionReason: candidate.rejectionReason,
        moderatorNotes: candidate.moderatorNotes,
        lastUpdated: candidate.date_updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidate status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
