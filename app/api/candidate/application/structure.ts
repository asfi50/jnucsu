import { CandidateFormData } from "@/app/submit-candidate/page";

export function mapApiResponseToCandidateProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiResponse: any
): CandidateFormData {
  const profile = apiResponse.profile || {};
  const department = profile.department || {};
  const position = apiResponse.position || {};

  return {
    position: position.name || position.id || apiResponse.position || "",
    panel: apiResponse.panel?.id || apiResponse.panel || "",
    biography: apiResponse.biography || "",
    manifesto: apiResponse.manifesto || "",
    experience: apiResponse.experience || "",
    achievements: apiResponse.achievements || "",
    phone: profile.phone || "",
    address: profile.address || "",
    studentId: profile.student_id || "",
    department: department.name || "",
    did: department.id || profile.department || "",
    semester: profile.semester || profile.academic_year || "",
    isParticipating: apiResponse.isParticipating !== false,
  };
}
