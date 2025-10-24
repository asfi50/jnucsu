import { CandidateProfile } from "@/lib/types/profile.types";

export function mapApiResponseToCandidateProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiResponse: any
): CandidateProfile {
  const profile = apiResponse.profile || {};
  const user = profile.user || {};
  const candidateData = apiResponse;
  const today = new Date();

  // Ensure approved_at is a Date object; if missing, set to today
  if (candidateData.approved_at) {
    if (!(candidateData.approved_at instanceof Date)) {
      candidateData.approved_at = new Date(candidateData.approved_at);
    }
  } else {
    candidateData.approved_at = today;
  }

  return {
    id: candidateData.id,
    userId: profile.id,
    position: candidateData.position?.name || "Unknown",
    panel: candidateData.panel?.name || undefined,
    biography: candidateData.biography || "",
    manifesto: candidateData.manifesto || "",
    experience: candidateData.experience || "",
    achievements: candidateData.achievements || "",
    phone: profile.phone || "",
    email: user.email || "",
    address: profile.address || "",
    studentId: profile.student_id || "",
    department: profile.department?.name || "Unknown",
    semester: profile.semester || profile.academic_year || "",
    isParticipating: candidateData.isParticipating || false,
    status: candidateData.status || "draft",
    createdAt: candidateData.date_created,
    updatedAt: candidateData.date_updated || candidateData.date_created,
    approvedAt: candidateData.approved_at || undefined,
    votes: profile.profile_votes.length || 0,
    views: 0,
    rejectionReason: candidateData.rejectionReason || undefined,
    moderatorNotes: candidateData.moderatorNotes || undefined,
    facebook: profile.links?.facebook || undefined,
    linkedin: profile.links?.linkedin || undefined,
    twitter: profile.links?.twitter || undefined,
    instagram: profile.links?.instagram || undefined,
    website: profile.links?.website || undefined,
  };
}
