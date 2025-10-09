import { CandidateFormData } from "@/app/submit-candidate/page";

export function mapApiResponseToCandidateProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiResponse: any
): CandidateFormData {
  const profile = apiResponse.profile || {};

  return {
    position: apiResponse.position,
    biography: apiResponse.biography,
    manifesto: apiResponse.manifesto,
    experience: apiResponse.experience,
    achievements: apiResponse.achievements,
    phone: profile.phone,
    address: profile.address,
    studentId: profile.student_id,
    department: profile.department.name,
    did: profile.department.id,
    semester: profile.semester || "",
    isParticipating: apiResponse.isParticipating,
  };
}
