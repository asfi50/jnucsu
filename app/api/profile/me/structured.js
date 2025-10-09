/**
 * Maps the API response to the UserProfile type.
 * @param {any} data - The API response object.
 * @returns {import('../../../lib/types/profile.types').UserProfile}
 */
function mapApiResponseToUserProfile(data) {
  return {
    id: data.id,
    name: data.name || "",
    image: data.image || undefined,
    phone: data.phone || undefined,
    email: data.user?.email || undefined,
    address: data.address || undefined,
    studentId: data.student_id || undefined,
    department: data.department?.name || undefined,
    did: data.department?.id || undefined,
    year: data.academic_year || undefined,
    about: data.about || undefined,
    links: {
      facebook: data.facebook || undefined,
      twitter: data.twitter || undefined,
      linkedin: data.linkedin || undefined,
      instagram: data.instagram || undefined,
      website: data.website || undefined,
    },
    workGallery: data.workGallery || undefined,
    votes: data.votes || undefined,
    createdAt: data.date_created,
    updatedAt: data.date_updated,
  };
}

export { mapApiResponseToUserProfile };
