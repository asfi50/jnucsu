import {
  PublicProfile,
  PublicProfileBlog,
  PublicProfileApiResponse,
} from "@/lib/types/profile.types";

export function formatPublicProfile(
  raw: PublicProfileApiResponse
): PublicProfile {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.user?.email ?? undefined,
    phone: raw.phone ?? undefined,
    studentId: raw.student_id ?? undefined,
    department: raw.department?.name ?? undefined,
    year: raw.academic_year ?? undefined,
    about: raw.about ?? undefined,
    address: raw.address ?? undefined,
    avatar: raw.image ?? undefined,
    links: {
      facebook: raw.facebook ?? raw.links?.facebook ?? undefined,
      twitter: raw.links?.twitter ?? undefined,
      linkedin: raw.linkedin ?? raw.links?.linkedin ?? undefined,
      instagram: raw.instagram ?? raw.links?.instagram ?? undefined,
      website: raw.website ?? raw.links?.website ?? undefined,
    },
    blogs: Array.isArray(raw.blogs)
      ? raw.blogs
          .filter((blog) => blog.status === "published" && blog.date_published)
          .map(
            (blog): PublicProfileBlog => ({
              id: blog.id,
              title: blog.title,
              excerpt: blog.excerpt,
              publishedAt: blog.date_published!,
              tags: blog.tags ?? [],
            })
          )
      : [],
  };
}
