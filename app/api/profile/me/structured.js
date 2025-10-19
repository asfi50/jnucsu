function GalleryFormat(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter(
      (item) =>
        item &&
        item.id &&
        item.url &&
        typeof item.url === "string" &&
        item.url.trim() !== ""
    )
    .map((item) => ({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      url: item.url.trim(),
    }));
}

/**
 * Maps the API response to the UserProfile type.
 * @param {any} data - The API response object.
 * @returns {import('../../../lib/types/profile.types').UserProfile}
 */
function mapApiResponseToUserProfile(data) {
  const reacted = data.reacted ? data.reacted.map((item) => item.blogs) : [];
  // For voted, we need to find candidate_page ID using the profile ID from vote.candidate
  // This is complex, so for now we'll store the vote record and handle it in the component
  const voted = data.voted ? data.voted.map((item) => item.candidate) : [];

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
    links: data.links || {},
    workGallery: data.gallery ? GalleryFormat(data.gallery) : [],
    createdAt: data.date_created,
    updatedAt: data.date_updated,
    reacted,
    voted,
  };
}

export { mapApiResponseToUserProfile };
