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

export interface PanelMember {
  id: string;
  name: string;
  image: string | null;
  department: string | null;
  position: string;
  totalScore: number;
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
      return [];
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

    // Group candidates by position
    const candidatesByPosition = new Map<string, TopCandidate[]>();

    results.forEach((candidate: TopCandidate) => {
      if (candidate.position) {
        if (!candidatesByPosition.has(candidate.position)) {
          candidatesByPosition.set(candidate.position, []);
        }
        candidatesByPosition.get(candidate.position)?.push(candidate);
      }
    });

    // Select the highest scoring candidate from each position
    const panelMembers: PanelMember[] = [];

    candidatesByPosition.forEach((candidates, position) => {
      // Sort candidates by score in descending order
      candidates.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

      // Take the highest scoring candidate from this position
      const topCandidate = candidates[0];
      if (topCandidate && topCandidate.totalScore !== undefined) {
        panelMembers.push({
          id: topCandidate.id,
          name: topCandidate.name,
          image: topCandidate.image,
          department: topCandidate.department,
          position: position,
          totalScore: topCandidate.totalScore,
          profileComments: topCandidate.profileComments,
          profileVotes: topCandidate.profileVotes,
        });
      }
    });

    // Sort panel members by total score (highest to lowest)
    panelMembers.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json(panelMembers, { status: 200 });
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
