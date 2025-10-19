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
    const body = await req.json();
    const { action } = body;

    if (action === "withdraw_application") {
      // Find current application
      const existingRes = await fetch(
        `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&sort=-date_updated&limit=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (!existingRes.ok) {
        return NextResponse.json(
          { message: "Failed to check existing application" },
          { status: existingRes.status }
        );
      }

      const existingData = await existingRes.json();

      if (existingData.data.length === 0) {
        return NextResponse.json(
          { message: "No application found to withdraw" },
          { status: 404 }
        );
      }

      const currentApplication = existingData.data[0];

      // Only allow withdrawal of pending applications
      if (currentApplication.status !== "pending") {
        return NextResponse.json(
          { message: "Only pending applications can be withdrawn" },
          { status: 400 }
        );
      }

      // Update status to draft (essentially withdrawing)
      const updateRes = await fetch(
        `${config.serverBaseUrl}/items/candidate_page/${currentApplication.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify({
            status: "draft",
          }),
        }
      );

      if (!updateRes.ok) {
        return NextResponse.json(
          { message: "Failed to withdraw application" },
          { status: updateRes.status }
        );
      }

      return NextResponse.json(
        {
          message:
            "Application withdrawn successfully. You can edit and resubmit.",
          status: "draft",
        },
        { status: 200 }
      );
    }

    if (action === "resubmit_application") {
      // Find current application
      const existingRes = await fetch(
        `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&sort=-date_updated&limit=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (!existingRes.ok) {
        return NextResponse.json(
          { message: "Failed to check existing application" },
          { status: existingRes.status }
        );
      }

      const existingData = await existingRes.json();

      if (existingData.data.length === 0) {
        return NextResponse.json(
          { message: "No application found to resubmit" },
          { status: 404 }
        );
      }

      const currentApplication = existingData.data[0];

      // Allow resubmission of draft or rejected applications
      if (!["draft", "rejected"].includes(currentApplication.status)) {
        return NextResponse.json(
          { message: "Only draft or rejected applications can be resubmitted" },
          { status: 400 }
        );
      }

      // Validate required fields
      if (
        !currentApplication.biography ||
        !currentApplication.manifesto ||
        !currentApplication.experience ||
        !currentApplication.position
      ) {
        return NextResponse.json(
          {
            message: "Please complete all required fields before resubmitting",
          },
          { status: 400 }
        );
      }

      // Update status to pending
      const updateRes = await fetch(
        `${config.serverBaseUrl}/items/candidate_page/${currentApplication.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify({
            status: "pending",
            rejectionReason: null, // Clear rejection reason on resubmit
          }),
        }
      );

      if (!updateRes.ok) {
        return NextResponse.json(
          { message: "Failed to resubmit application" },
          { status: updateRes.status }
        );
      }

      return NextResponse.json(
        {
          message: "Application resubmitted successfully",
          status: "pending",
        },
        { status: 200 }
      );
    }

    if (action === "get_version_history") {
      // Get all versions of candidate applications for this profile
      const versionsRes = await fetch(
        `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&fields=*,position.name,panel.name&sort=-date_updated`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
        }
      );

      if (!versionsRes.ok) {
        return NextResponse.json(
          { message: "Failed to fetch version history" },
          { status: versionsRes.status }
        );
      }

      const versionsData = await versionsRes.json();

      return NextResponse.json(
        {
          versions: versionsData.data.map(
            (version: {
              id: string;
              status: string;
              position?: { name: string };
              panel?: { name: string };
              date_created: string;
              date_updated: string;
              approved_at?: string;
              rejectionReason?: string;
              isParticipating: boolean;
            }) => ({
              id: version.id,
              status: version.status,
              position: version.position?.name || "Not specified",
              panel: version.panel?.name || "Not specified",
              dateCreated: version.date_created,
              dateUpdated: version.date_updated,
              approvedAt: version.approved_at,
              rejectionReason: version.rejectionReason,
              isParticipating: version.isParticipating,
            })
          ),
          total: versionsData.data.length,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling candidate management action:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
