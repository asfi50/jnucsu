import { config } from "@/config";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { NextResponse } from "next/server";
import { mapApiResponseToCandidateProfile } from "./structure";

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
    const profileRes = await fetch(
      `${config.serverBaseUrl}/items/profile/${info.profileId}?fields=*,candidate_profile.*,candidate_profile.position.name,candidate_profile.panel.name,user.email,department.name,profile.profile_votes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      console.error("Directus API error:", errorText);
      return NextResponse.json(
        { message: "Failed to fetch profile", details: errorText },
        { status: profileRes.status }
      );
    }

    const profileData = await profileRes.json();

    if (!profileData.data) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    // If approved candidate profile exists, return it
    if (profileData.data.candidate_profile) {
      const responseData = {
        ...profileData.data.candidate_profile,
        profile: profileData.data,
        user: profileData.data.user,
      };

      return NextResponse.json(mapApiResponseToCandidateProfile(responseData), {
        status: 200,
      });
    }

    // If no approved candidate profile, check for draft/pending candidate application
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
        "Error fetching candidate application:",
        await candidateRes.text()
      );
      return NextResponse.json(
        { message: "Candidate profile not found" },
        { status: 404 }
      );
    }

    const candidateData = await candidateRes.json();

    // If no candidate application found
    if (!candidateData.data || candidateData.data.length === 0) {
      return NextResponse.json(
        { message: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Structure the response with profile and candidate application data
    const candidateApplication = candidateData.data[0];
    const responseData = {
      ...candidateApplication,
      profile: profileData.data,
      user: profileData.data.user,
    };

    return NextResponse.json(mapApiResponseToCandidateProfile(responseData), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
