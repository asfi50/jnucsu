import {
  PublicProfile,
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
    links: raw.links ?? {},
    blogs: Array.isArray(raw.blogs)
      ? raw.blogs
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((blog: any) => blog.status === "published")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((blog: any) => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.current_published_version?.excerpt || "",
            publishedAt: blog.current_published_version?.approved_at || "",
            tags: blog.current_published_version?.tags || [],
          }))
      : [],
  };
}
