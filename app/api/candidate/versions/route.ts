import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";

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
    // Get current candidate application (latest draft/pending/rejected)
    const candidateRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&fields=*,position.*,panel.*&sort=-date_updated&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!candidateRes.ok) {
      console.error(
        "Error fetching candidate data:",
        await candidateRes.text()
      );
      return NextResponse.json(
        { message: "Failed to fetch candidate data" },
        { status: candidateRes.status }
      );
    }

    const candidateData = await candidateRes.json();

    // Get profile with approved candidate reference
    const profileRes = await fetch(
      `${config.serverBaseUrl}/items/profile/${info.profileId}?fields=*,candidate_profile.*,candidate_profile.position.*,candidate_profile.panel.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!profileRes.ok) {
      console.error("Error fetching profile data:", await profileRes.text());
      return NextResponse.json(
        { message: "Failed to fetch profile data" },
        { status: profileRes.status }
      );
    }

    const profileData = await profileRes.json();

    return NextResponse.json(
      {
        currentApplication:
          candidateData.data.length > 0 ? candidateData.data[0] : null,
        latestApproved: profileData.data?.candidate_profile || null,
        hasChanges:
          candidateData.data.length > 0 &&
          candidateData.data[0].status !== "approved",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidate profile versions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    if (action === "submit_for_review") {
      // Check if there's an existing candidate application
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
        console.error(
          "Error fetching existing application:",
          await existingRes.text()
        );
        return NextResponse.json(
          { message: "Failed to fetch existing application" },
          { status: existingRes.status }
        );
      }

      const existingData = await existingRes.json();

      if (existingData.data.length === 0) {
        return NextResponse.json(
          { message: "No candidate application found to submit" },
          { status: 404 }
        );
      }

      const currentApplication = existingData.data[0];

      // Validate required fields before submitting
      if (
        !currentApplication.biography ||
        !currentApplication.manifesto ||
        !currentApplication.experience ||
        !currentApplication.position
      ) {
        return NextResponse.json(
          { message: "Please complete all required fields before submitting" },
          { status: 400 }
        );
      }

      // Update status to pending for review
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
          }),
        }
      );

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error("Error submitting for review:", errorText);
        return NextResponse.json(
          { message: "Failed to submit for review" },
          { status: updateRes.status }
        );
      }

      return NextResponse.json(
        {
          message: "Successfully submitted for review",
          status: "pending",
        },
        { status: 200 }
      );
    } else if (action === "save_draft") {
      const {
        biography,
        manifesto,
        experience,
        achievements,
        position,
        panel,
        isParticipating,
      } = body;

      // Validate required fields
      if (!position) {
        return NextResponse.json(
          { message: "Position is required" },
          { status: 400 }
        );
      }

      // Check if there's an existing candidate application
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
        console.error(
          "Error fetching existing application:",
          await existingRes.text()
        );
        return NextResponse.json(
          { message: "Failed to check existing application" },
          { status: existingRes.status }
        );
      }

      const existingData = await existingRes.json();

      const candidatePayload = {
        biography: biography || "",
        manifesto: manifesto || "",
        experience: experience || "",
        achievements: achievements || "",
        position,
        panel: panel || null,
        isParticipating: isParticipating !== false, // Default to true
        status: "draft",
      };

      let candidateRes;

      if (existingData.data.length > 0) {
        // Update existing application
        candidateRes = await fetch(
          `${config.serverBaseUrl}/items/candidate_page/${existingData.data[0].id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.adminToken}`,
            },
            body: JSON.stringify(candidatePayload),
          }
        );
      } else {
        // Create new draft
        candidateRes = await fetch(
          `${config.serverBaseUrl}/items/candidate_page`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.adminToken}`,
            },
            body: JSON.stringify({
              ...candidatePayload,
              profile: info.profileId,
            }),
          }
        );
      }

      if (!candidateRes.ok) {
        const errorText = await candidateRes.text();
        console.error("Error saving draft:", errorText);
        return NextResponse.json(
          { message: "Failed to save draft" },
          { status: candidateRes.status }
        );
      }

      const savedData = await candidateRes.json();

      return NextResponse.json(
        {
          message: "Draft saved successfully",
          status: "draft",
          data: savedData.data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error handling candidate profile version:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
