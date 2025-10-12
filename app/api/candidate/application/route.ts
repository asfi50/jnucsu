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
    const personal_payload = {
      student_id: body.studentId,
      phone: body.phone,
      address: body.address,
      department: body.did,
      academic_year: body.year,
      semester: body.semester,
    };
    const candidate_payload = {
      user: info.userId,
      profile: info.profileId,
      position: body.position,
      biography: body.biography,
      manifesto: body.manifesto,
      experience: body.experience,
      achievements: body.achievements,
      isParticipating: body.isParticipating || false,
    };
    const isAlreadyCandidate = await fetch(
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
        },
      }
    );
    const candidateData = await isAlreadyCandidate.json();
    if (candidateData.data.length > 0 && !isApplied) {
      return NextResponse.json(
        { message: "You have already applied for candidacy." },
        { status: 400 }
      );
    }
    if (candidateData.data.length > 0 && isApplied) {
      const [updateProfileRes, createCandidateRes] = await Promise.all([
        fetch(`${config.serverBaseUrl}/items/profile/${info.profileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify({ ...personal_payload }),
        }),
        fetch(
          `${config.serverBaseUrl}/items/candidate_page/${candidateData.data[0].id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.adminToken}`,
            },
            body: JSON.stringify(candidate_payload),
          }
        ),
      ]);

      if (!updateProfileRes.ok) {
        return NextResponse.json(
          { message: "Failed to update profile data" },
          { status: updateProfileRes.status }
        );
      }

      if (!createCandidateRes.ok) {
        return NextResponse.json(
          { message: "Failed to create candidate application" },
          { status: createCandidateRes.status }
        );
      }

      await updateProfileRes.json();
      await createCandidateRes.json();
    } else {
      const [updateProfileRes, createCandidateRes] = await Promise.all([
        fetch(`${config.serverBaseUrl}/items/profile/${info.profileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.adminToken}`,
          },
          body: JSON.stringify({ ...personal_payload }),
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
        return NextResponse.json(
          { message: "Failed to update profile data" },
          { status: updateProfileRes.status }
        );
      }

      if (!createCandidateRes.ok) {
        return NextResponse.json(
          { message: "Failed to create candidate application" },
          { status: createCandidateRes.status }
        );
      }

      await updateProfileRes.json();
      await createCandidateRes.json();
    }

    return NextResponse.json(
      {
        message: "Candidacy submitted successfully",
        result: {
          status: "pending",
          success: true,
        },
      },
      { status: 201 }
    );
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
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${info.profileId}&fields=*,user.*,profile.*.*,position.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );
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
    // return NextResponse.json(applicationData.data[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching application data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
