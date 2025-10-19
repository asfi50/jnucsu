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

// Updated interface for new API structure
interface ProfileApiResponse {
  id: string;
  name: string;
  image: string | null;
  department: CandidateDepartment | null;
  academic_year: string | null;
  student_id: string | null;
  candidate_profile: {
    id: string;
    position: CandidatePosition;
    biography: string;
    status: string;
    isParticipating: boolean;
  };
  comments:
    | {
        id: string;
        content: string;
        user?: { id: string; name: string };
      }[]
    | null;
  votes: { id: string }[] | null;
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
  image: string; // Add this field for compatibility
  position: string; // Add this field for compatibility
}

// New function for the updated API structure
export function formatCandidateData(
  profileData: ProfileApiResponse[]
): CandidateItem[] {
  if (!Array.isArray(profileData)) {
    console.error(
      "formatCandidateData: profileData is not an array",
      profileData
    );
    return [];
  }

  return profileData
    .map((profile: ProfileApiResponse) => {
      try {
        const comments = profile.comments || [];
        const votes = profile.votes || [];
        const academicYear = profile.academic_year || "1";
        const candidateProfile = profile.candidate_profile;

        if (!candidateProfile) {
          console.warn("Profile missing candidate_profile:", profile.id);
          throw new Error("Missing candidate_profile data");
        }

        const result: CandidateItem = {
          id: candidateProfile.id, // Use candidate_profile ID
          profile_id: profile.id, // Profile ID
          name: profile.name || "Unknown",
          image: profile.image || "/images/default-avatar.svg",
          department: profile.department?.name || "Unknown",
          position: candidateProfile.position?.name || "Candidate",
          comments: comments,
          avatar: profile.image || "/images/default-avatar.svg",
          title: candidateProfile.position?.name || "Candidate",
          description: candidateProfile.biography || "No biography available",
          year: academicYear,
          votes: votes.length || 0,
          tags: [], // Empty for now, can be populated later if needed
          university: "Jagannath University",
          studentId: profile.student_id || profile.id,
        };

        return result;
      } catch (error) {
        console.error("Error formatting candidate profile:", profile.id, error);
        // Return a fallback object
        return {
          id: profile.id,
          profile_id: profile.id,
          name: profile.name || "Unknown",
          image: profile.image || "/images/default-avatar.svg",
          department: "Unknown",
          position: "Candidate",
          biography: "",
          comments: [],
          avatar: profile.image || "/images/default-avatar.svg",
          title: "Candidate",
          description: "No biography available",
          year: "1",
          votes: 0,
          tags: [],
          university: "Jagannath University",
          studentId: profile.student_id || profile.id,
        };
      }
    })
    .filter(Boolean); // Remove any null/undefined results
}

// Keep the old function for backward compatibility
export function flattenCandidate(candidate: CandidateRaw[]): CandidateItem[] {
  return candidate.map((candidate: CandidateRaw) => {
    const comments = candidate.profile?.comments || [];
    const academicYear = candidate.profile?.academic_year || "1";

    return {
      id: candidate.id,
      profile_id: candidate.profile?.id || candidate.id,
      name: candidate.profile?.name || "Unknown",
      image: candidate.profile?.image || "/images/default-avatar.svg",
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
