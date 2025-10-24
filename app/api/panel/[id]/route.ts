import { config } from "@/config";
import { NextResponse } from "next/server";
import {
  DirectusPanelData,
  DirectusMember,
  Panel,
  PanelMember,
} from "@/lib/types/panel";

// Function to format panel response
function formatPanelResponse(data: DirectusPanelData): Panel | null {
  if (!data) return null;

  return {
    // Panel basic info
    id: data.id,
    name: data.name,
    status: data.status,
    logo: data.logo,
    banner: data.banner,
    mission: data.mission,
    vision: data.vision,
    createdAt: data.date_created,
    updatedAt: data.date_updated,

    // Simplified members array - use profile.id as id for candidate reference
    members:
      data.members?.map(
        (member: DirectusMember): PanelMember => ({
          id: member.profile?.id || member.id, // Use profile.id for candidate reference
          name: member.profile?.name,
          studentId: member.profile?.student_id,
          image: member.profile?.image,
          department: member.profile?.department?.name,
          positionName: member.position?.name,
          biography: member.biography,
          manifesto: member.manifesto,
          experience: member.experience,
          achievements: member.achievements,
          status: member.status,
          isParticipating: member.isParticipating,
          approvedAt: member.approved_at,
        })
      ) || [],
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(
      `${config.serverBaseUrl}/items/panel/${id}?fields=*,members.id,members.status,members.isParticipating,members.biography,members.manifesto,members.experience,members.achievements,members.approved_at,members.profile.id,members.profile.name,members.profile.student_id,members.profile.image,members.profile.department.name,members.position.name&deep[members][_filter][_and][0][status][_eq]=approved&deep[members][_filter][_and][1][isParticipating][_eq]=true`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch panel details: ${res.statusText}`,
        },
        { status: res.status }
      );
    }

    const { data } = await res.json();

    // Format the response for better client-side usage
    const formattedData = formatPanelResponse(data);

    return NextResponse.json(formattedData, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching panel details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch panel details",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
