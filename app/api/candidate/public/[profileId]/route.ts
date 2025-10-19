import { config } from "@/config";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const { profileId } = await params;

    if (!profileId) {
      return NextResponse.json(
        { message: "Profile ID is required" },
        { status: 400 }
      );
    }

    // Get the profile with latest approved candidate version
    const profileRes = await fetch(
      `${config.serverBaseUrl}/items/profile/${profileId}?fields=*,department.*,candidate_profile.*,candidate_profile.position.*,candidate_profile.panel.*`,
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
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    const profileData = await profileRes.json();
    const profile = profileData.data;

    // If no approved candidate profile exists, return basic profile info
    if (!profile.candidate_profile) {
      return NextResponse.json(
        {
          profile: {
            id: profile.id,
            name: profile.name,
            image: profile.image,
            phone: profile.phone,
            student_id: profile.student_id,
            department: profile.department?.name,
            academic_year: profile.academic_year,
            semester: profile.semester,
            address: profile.address,
            about: profile.about,
            facebook: profile.facebook,
            linkedin: profile.linkedin,
            instagram: profile.instagram,
            website: profile.website,
          },
          candidateProfile: null,
          isCandidate: false,
        },
        { status: 200 }
      );
    }

    const candidateProfile = profile.candidate_profile;

    return NextResponse.json(
      {
        profile: {
          id: profile.id,
          name: profile.name,
          image: profile.image,
          phone: profile.phone,
          student_id: profile.student_id,
          department: profile.department?.name,
          academic_year: profile.academic_year,
          semester: profile.semester,
          address: profile.address,
          about: profile.about,
          facebook: profile.facebook,
          linkedin: profile.linkedin,
          instagram: profile.instagram,
          website: profile.website,
        },
        candidateProfile: {
          id: candidateProfile.id,
          biography: candidateProfile.biography,
          manifesto: candidateProfile.manifesto,
          experience: candidateProfile.experience,
          achievements: candidateProfile.achievements,
          position: candidateProfile.position?.name,
          panel: candidateProfile.panel?.name,
          approved_at: candidateProfile.approved_at,
          status: candidateProfile.status,
        },
        isCandidate: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
