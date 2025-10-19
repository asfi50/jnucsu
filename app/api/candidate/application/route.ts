import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";
import { mapApiResponseToCandidateProfile } from "./structure";

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
    const isApplied = body.isApplied;

    // Validate required fields
    const requiredFields = {
      position: body.position,
      biography: body.biography,
      manifesto: body.manifesto,
      experience: body.experience,
      studentId: body.studentId,
      phone: body.phone,
      address: body.address,
      did: body.did,
      semester: body.semester,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || value.toString().trim() === "")
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const personal_payload = {
      student_id: body.studentId,
      phone: body.phone,
      address: body.address,
      department: body.did,
      academic_year: body.semester, // Map semester to academic_year field
      semester: body.semester,
    };

    const candidate_payload = {
      profile: info.profileId,
      position: body.position,
      panel: body.panel || null,
      biography: body.biography,
      manifesto: body.manifesto,
      experience: body.experience,
      achievements: body.achievements || "",
      isParticipating: body.isParticipating !== false, // Default to true
      status: "draft", // Start as draft in new system
    };

    const isAlreadyCandidate = await fetch(
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&sort=-date_updated&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!isAlreadyCandidate.ok) {
      console.error(
        "Error checking existing candidate:",
        await isAlreadyCandidate.text()
      );
      return NextResponse.json(
        { message: "Failed to check existing application" },
        { status: isAlreadyCandidate.status }
      );
    }

    const candidateData = await isAlreadyCandidate.json();

    if (candidateData.data.length > 0 && !isApplied) {
      return NextResponse.json(
        { message: "You have already applied for candidacy." },
        { status: 400 }
      );
    }

    if (candidateData.data.length > 0 && isApplied) {
      // Update existing application (works as draft editing)
      const existingCandidate = candidateData.data[0];

      const [updateProfileRes, updateCandidateRes] = await Promise.all([
        fetch(`${config.serverBaseUrl}/items/profile/${info.profileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify(personal_payload),
        }),
        fetch(
          `${config.serverBaseUrl}/items/candidate_page/${existingCandidate.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.adminToken}`,
            },
            body: JSON.stringify({
              ...candidate_payload,
              status: "draft", // Reset to draft when editing
            }),
          }
        ),
      ]);

      if (!updateProfileRes.ok) {
        const errorText = await updateProfileRes.text();
        console.error("Error updating profile:", errorText);
        return NextResponse.json(
          { message: "Failed to update profile data" },
          { status: updateProfileRes.status }
        );
      }

      if (!updateCandidateRes.ok) {
        const errorText = await updateCandidateRes.text();
        console.error("Error updating candidate:", errorText);
        return NextResponse.json(
          { message: "Failed to update candidate application" },
          { status: updateCandidateRes.status }
        );
      }

      const updatedCandidate = await updateCandidateRes.json();

      return NextResponse.json(
        {
          message:
            "Candidacy draft updated successfully. Submit for review when ready.",
          result: {
            status: "draft",
            success: true,
            data: updatedCandidate.data,
          },
        },
        { status: 200 }
      );
    } else {
      // Create new candidate application as draft
      const [updateProfileRes, createCandidateRes] = await Promise.all([
        fetch(`${config.serverBaseUrl}/items/profile/${info.profileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify(personal_payload),
        }),
        fetch(`${config.serverBaseUrl}/items/candidate_page`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify(candidate_payload),
        }),
      ]);

      if (!updateProfileRes.ok) {
        const errorText = await updateProfileRes.text();
        console.error("Error updating profile:", errorText);
        return NextResponse.json(
          { message: "Failed to update profile data" },
          { status: updateProfileRes.status }
        );
      }

      if (!createCandidateRes.ok) {
        const errorText = await createCandidateRes.text();
        console.error("Error creating candidate:", errorText);
        return NextResponse.json(
          { message: "Failed to create candidate application" },
          { status: createCandidateRes.status }
        );
      }

      const createdCandidate = await createCandidateRes.json();

      return NextResponse.json(
        {
          message:
            "Candidacy draft saved successfully. Submit for review when ready.",
          result: {
            status: "draft",
            success: true,
            data: createdCandidate.data,
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
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
    const applicationRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&fields=*,profile.department.*,position.*,panel.*&sort=-date_updated&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!applicationRes.ok) {
      const errorText = await applicationRes.text();
      console.error("Error fetching application:", errorText);
      return NextResponse.json(
        { message: "Failed to fetch application data" },
        { status: applicationRes.status }
      );
    }

    const applicationData = await applicationRes.json();

    if (applicationData.data.length === 0) {
      return NextResponse.json(
        { message: "No application found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      mapApiResponseToCandidateProfile(applicationData.data[0]),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching application data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
