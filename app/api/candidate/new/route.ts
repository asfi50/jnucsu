import { config } from "@/config";
import { NextResponse } from "next/server";

interface ResCandidateData {
  department: { name: string } | null;
  comments: Array<{ id: string }>;
  id: string;
  name: string;
  image: string | null;
  profile_comments: Array<{ id: string }>;
  profile_votes: Array<{ id: string }>;
  candidate_profile: {
    position: { name: string };
  };
}

export async function GET() {
  try {
    const fields = [
      "id",
      "name",
      "image",
      "department.name",
      "candidate_profile.id",
      "candidate_profile.status",
      "candidate_profile.isParticipating",
      "candidate_profile.position.name",
      "profile_votes.id",
      "comments.id",
    ];

    const res = await fetch(
      `${
        config.serverBaseUrl
      }/items/profile?filter[candidate_profile][_nnull]}&filter[candidate_profile][isParticipating][_eq]=true&sort=-date_created&limit=8&fields=${fields.join(
        ","
      )}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch new candidates");
    }

    const { data } = await res.json();
    const newCandidates = data.map((candidate: ResCandidateData) => {
      const profileComments = candidate.comments
        ? candidate.comments.length
        : 0;
      const profileVotes = candidate.profile_votes
        ? candidate.profile_votes.length
        : 0;

      return {
        id: candidate.id,
        name: candidate.name,
        image: candidate.image,
        department: candidate.department ? candidate.department.name : null,
        profileComments: profileComments,
        profileVotes: profileVotes,
        position: candidate.candidate_profile.position.name,
      };
    });

    return NextResponse.json(newCandidates, { status: 200 });
  } catch (error) {
    console.error("Error fetching new candidates:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch new candidates",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
