import { CandidateProfile } from "@/lib/types/profile.types";

export function mapApiResponseToCandidateProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiResponse: any
): CandidateProfile {
  const profile = apiResponse.profile || {};
  const user = profile.user || {};
  const candidateData = apiResponse;

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
    votes: 0, // need to setup api and map votes
    views: 0, // Set to 0 or map if available in your API
    rejectionReason: candidateData.rejectionReason || undefined,
    moderatorNotes: candidateData.moderatorNotes || undefined,
    facebook: profile.links?.facebook || undefined,
    linkedin: profile.links?.linkedin || undefined,
    twitter: profile.links?.twitter || undefined,
    instagram: profile.links?.instagram || undefined,
    website: profile.links?.website || undefined,
  };
}
