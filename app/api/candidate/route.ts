import { config } from "@/config";
import { NextResponse } from "next/server";

export interface Candidate {
  id: string;
  image: string;
  name: string;
  about: string | null;
  position: string | null;
  department: string | null;
  year: string | null;
  comments: number;
  votes: number;
}

export async function GET() {
  try {
    const fields = [
      "id",
      "name",
      "image",
      "about",
      "department.name",
      "academic_year",
      "candidate_profile.id",
      "candidate_profile.status",
      "candidate_profile.isParticipating",
      "candidate_profile.position.name",
      "profile_votes.id",
      "comments.id",
    ];

    const url = `${
      config.serverBaseUrl
    }/items/profile?filter[candidate_profile][_nnull]&filter[candidate_profile][isParticipating][_eq]=true&sort=name&fields=${fields.join(
      ","
    )}&limit=-1`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.adminToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          error: `Failed to fetch candidates: ${res.status} ${res.statusText}`,
          details: errorText,
        },
        { status: res.status }
      );
    }

    const { data: responseData } = await res.json();

    if (!responseData || !Array.isArray(responseData)) {
      return NextResponse.json([], { status: 200 });
    }

    const formattedData = responseData.map((candidate) => ({
      id: candidate.id,
      image: candidate.image,
      name: candidate.name,
      about: candidate.about || null,
      department: candidate.department.name || null,
      position: candidate.candidate_profile.position.name || null,
      year: candidate.year || null,
      comments: candidate.comments.length || 0,
      votes: candidate.profile_votes.length || 0,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch candidates",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
