import { config } from "@/config";
import { NextResponse } from "next/server";

// Scoring weights
const SCORING_WEIGHTS = {
  profileVote: 3, // Profile votes have highest weight
  blogReaction: 1, // Blog reactions have moderate weight
  blogComment: 2, // Blog comments have higher weight
  profileComment: 1.5, // Profile comments have moderate weight
};

export interface TopCandidate {
  id: string;
  name: string;
  image: string | null;
  department: string | null;
  position: string | null;
  totalScore?: number;
  profileComments: number;
  profileVotes: number;
}

export async function GET() {
  try {
    const profileFields = [
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
      "blogs.id",
      "blogs.reactions.id",
      "blogs.comments.id",
    ];

    const profilesRes = await fetch(
      `${
        config.serverBaseUrl
      }/items/profile?filter[candidate_profile][_nnull]&filter[candidate_profile][isParticipating][_eq]=true&fields=${profileFields.join(
        ","
      )}`,
      {
        headers: {
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!profilesRes.ok) {
      throw new Error("Failed to fetch candidate profiles");
    }

    const { data: profiles } = await profilesRes.json();

    if (!profiles || profiles.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const CalculateScores = (res: {
      profileVotes: number;
      blogReactions: number;
      blogComments: number;
      profileComments: number;
    }): number => {
      const totalScore =
        res.profileVotes * SCORING_WEIGHTS.profileVote +
        res.blogReactions * SCORING_WEIGHTS.blogReaction +
        res.blogComments * SCORING_WEIGHTS.blogComment +
        res.profileComments * SCORING_WEIGHTS.profileComment;

      return totalScore;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = profiles.map((profile: any) => {
      const blogReactions = profile.blogs
        ? profile.blogs.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sum: number, blog: any) =>
              sum + (blog.reactions ? blog.reactions.length : 0),
            0
          )
        : 0;
      const blogComments = profile.blogs
        ? profile.blogs.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sum: number, blog: any) =>
              sum + (blog.comments ? blog.comments.length : 0),
            0
          )
        : 0;
      const profileComments = profile.comments ? profile.comments.length : 0;
      const profileVotes = profile.profile_votes
        ? profile.profile_votes.length
        : 0;

      const totalScore = CalculateScores({
        profileVotes,
        blogReactions,
        blogComments,
        profileComments,
      });

      return {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        department: profile.department ? profile.department.name : null,
        position: profile.candidate_profile
          ? profile.candidate_profile?.position.name
          : null,
        totalScore,
        profileComments,
        profileVotes,
      };
    });

    const topResults = results
      .sort(
        (a: { totalScore: number }, b: { totalScore: number }) =>
          b.totalScore - a.totalScore
      )
      .slice(0, 10);

    return NextResponse.json(topResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching top candidates:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch top candidates",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
