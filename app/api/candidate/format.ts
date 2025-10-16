interface CandidateDepartment {
  name: string;
}

interface CandidateProfile {
  id: string;
  name: string;
  image: string;
  academic_year: string;
  department: CandidateDepartment;
  comments: {
    id: string;
    content: string;
    user?: { id: string; name: string };
  }[];
}

interface CandidatePosition {
  name: string;
}

interface CandidateRaw {
  id: string;
  biography: string;
  profile: CandidateProfile;
  position: CandidatePosition;
}

export interface CandidateItem {
  id: string;
  profile_id: string;
  name: string;
  department: string;
  comments: {
    id: string;
    content: string;
    user?: { id: string; name: string };
  }[];
  avatar: string;
  title: string;
  description: string;
  year: string;
  votes: number;
  tags: string[];
  university: string;
  studentId: string;
}

export function flattenCandidate(candidate: CandidateRaw[]): CandidateItem[] {
  return candidate.map((candidate: CandidateRaw) => {
    const comments = candidate.profile?.comments || [];
    const academicYear = candidate.profile?.academic_year || "1";

    return {
      id: candidate.id,
      profile_id: candidate.profile?.id || candidate.id,
      name: candidate.profile?.name || "Unknown",
      image: candidate.profile?.image || "",
      department: candidate.profile?.department?.name || "Unknown",
      position: candidate.position?.name || "Candidate",
      biography: candidate.biography || "",
      comments: comments,
      avatar: candidate.profile?.image || "/images/default-avatar.svg",
      title: candidate.position?.name || "Candidate",
      description: candidate.biography || "No biography available",
      year: academicYear,
      votes: comments.length || 0,
      tags: [], // Empty for now, can be populated later if needed
      university: "Jagannath University",
      studentId: candidate.profile?.id || candidate.id,
    };
  });
}
