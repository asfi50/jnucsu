import { CandidateProfile } from "@/lib/types/profile.types";

export function mapApiResponseToCandidateProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiResponse: any
): CandidateProfile {
  const profile = apiResponse.profile || {};
  const user = apiResponse.user || {};

  return {
    id: apiResponse.id,
    userId: profile.id,
    position: apiResponse.position.name,
    biography: apiResponse.biography,
    manifesto: apiResponse.manifesto,
    experience: apiResponse.experience,
    achievements: apiResponse.achievements,
    phone: profile.phone,
    email: user.email,
    address: profile.address,
    studentId: profile.student_id,
    department: profile.department.name,
    semester: profile.semester || profile.academic_year || "",
    isParticipating: apiResponse.isParticipating,
    status: apiResponse.status,
    createdAt: apiResponse.date_created,
    updatedAt: apiResponse.date_updated || apiResponse.date_created,
    approvedAt: apiResponse.approved_at || undefined,
    votes: 0, // need to setup api and map votes
    views: 0, // Set to 0 or map if available in your API
    rejectionReason: apiResponse.rejectionReason || undefined,
    moderatorNotes: apiResponse.moderatorNotes || undefined,
    facebook: profile.facebook || undefined,
    linkedin: profile.linkedin || undefined,
    twitter: profile.twitter || undefined,
    instagram: profile.instagram || undefined,
    website: profile.website || undefined,
  };
}
