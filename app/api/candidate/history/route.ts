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

  try {
    const url = new URL(req.url);
    const profileId = url.searchParams.get("profileId") || info.profileId;

    if (!profileId) {
      return NextResponse.json(
        { message: "Profile ID required" },
        { status: 400 }
      );
    }

    // Only allow users to access their own profile (admin check would need separate middleware)
    if (profileId !== info.profileId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get profile with latest approved candidate
    const profileRes = await fetch(
      `${config.serverBaseUrl}/items/profile/${profileId}?fields=*,candidate_profile.*,candidate_profile.position.*,candidate_profile.panel.*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!profileRes.ok) {
      return NextResponse.json(
        { message: "Failed to fetch profile" },
        { status: profileRes.status }
      );
    }

    const profileData = await profileRes.json();

    // Get current draft/pending application if exists
    const currentRes = await fetch(
      `${config.serverBaseUrl}/items/candidate_page?filter[profile][_eq]=${profileId}&fields=*,position.name,panel.name&sort=-date_updated&limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    const currentData = await currentRes.json();

    return NextResponse.json(
      {
        versions: profileData.data?.candidate_profile
          ? [
              {
                id: profileData.data.candidate_profile.id,
                version_number: 1,
                biography: profileData.data.candidate_profile.biography,
                manifesto: profileData.data.candidate_profile.manifesto,
                experience: profileData.data.candidate_profile.experience,
                achievements: profileData.data.candidate_profile.achievements,
                position: profileData.data.candidate_profile.position?.name,
                panel: profileData.data.candidate_profile.panel?.name,
                approved_at: profileData.data.candidate_profile.approved_at,
                approved_by: null,
                status: "approved",
              },
            ]
          : [],
        currentDraft:
          currentData.data.length > 0
            ? {
                id: currentData.data[0].id,
                biography: currentData.data[0].biography,
                manifesto: currentData.data[0].manifesto,
                experience: currentData.data[0].experience,
                achievements: currentData.data[0].achievements,
                position: currentData.data[0].position?.name,
                panel: currentData.data[0].panel?.name,
                status: currentData.data[0].status,
                updated_at: currentData.data[0].date_updated,
                isParticipating: currentData.data[0].isParticipating,
              }
            : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidate profile history:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
