import { ElectionCandidate } from "@/lib/types/candidate.profile.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatCandidateApiResponse(data: any): ElectionCandidate {
  const candidateInfo = data.candidate_profile || {};
  const blogComments = Array.isArray(data.blog_comments)
    ? data.blog_comments
    : [];
  const this_profileComments = Array.isArray(data.comments)
    ? data.comments
    : [];

  const allComments = [];
  for (const comment of blogComments) {
    allComments.push({
      id: comment.id,
      content: comment.content,
      date_created: comment.date_created,
      context: "blog" as const,
      contextId: comment.blogs?.id,
      contextTitle: comment.blogs?.title,
    });
  }

  return {
    id: data.id,
    name: data.name,
    title: candidateInfo.position?.name || "Candidate",
    description: candidateInfo.biography || data.about || "",
    avatar: data.image,
    university: "Jagannath University",
    department: data.department?.name || "",
    year: data.academic_year || "Not specified",
    studentId: data.student_id || "",
    futurePlans: candidateInfo.manifesto || "",
    workGallery: Array.isArray(data.gallery)
      ? data.gallery.map(
          (item: {
            id: string;
            title: string;
            description: string;
            url: string;
            directus_files_id?: { id: string };
          }) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
          })
        )
      : [],
    votes: 0,
    tags: [],
    createdAt: "",
    updatedAt: "",
    phone: data.phone || undefined,
    email: undefined,
    address: data.address || undefined,
    semester: data.semester || undefined,
    links: data.links || undefined,
    achievements: candidateInfo.achievements || "",
    candidateComments: [],
    blogs: Array.isArray(data.blogs)
      ? data.blogs
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((blog: any) => blog.status === "published")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((blog: any) => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.current_published_version?.excerpt || "",
            date_published: blog.current_published_version?.approved_at || "",
            tags: blog.current_published_version?.tags || [],
          }))
      : [],
    comments: allComments?.sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    ),
    commentProfile: this_profileComments.map(
      (comment: {
        id: string;
        content: string;
        date_created: string;
        user: {
          name: string;
          image: string;
          id: string;
        };
      }) => ({
        id: comment.id,
        content: comment.content,
        date_created: comment.date_created,
        name: comment.user.name,
        avatar: comment.user.image,
        userId: comment.user.id,
      })
    ),
  };
}
