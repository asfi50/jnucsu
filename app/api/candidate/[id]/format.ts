import { ElectionCandidate } from "@/lib/types/candidate.profile.types";

export function formatCandidateApiResponse(data: {
  candidate?: {
    position?: { name: string };
    biography?: string;
    manifesto?: string;
    achievements?: string;
  }[];
  blog_comments?: {
    id: string;
    content: string;
    date_created: string;
    blog?: { id: string; title: string };
  }[];
  profile_comments?: {
    id: string;
    content: string;
    date_created: string;
    profile?: { id: string; name: string };
  }[];
  id: string;
  name: string;
  image: string;
  department?: { name: string };
  academic_year?: string;
  student_id?: string;
  about?: string;
  gallery?: {
    id: string;
    title: string;
    description: string;
    url: string;
    directus_files_id?: { id: string };
  }[];
  blogs?: {
    id: string;
    title: string;
    excerpt: string;
    date_published?: string;
    tags?: string[];
    status: string;
  }[];
  comments?: {
    id: string;
    content: string;
    date_created: string;
    user: { name: string; image: string; id: string };
  }[];
}): ElectionCandidate {
  const candidateInfo =
    Array.isArray(data.candidate) && data.candidate.length > 0
      ? data.candidate[0]
      : {};
  const blogComments = Array.isArray(data.blog_comments)
    ? data.blog_comments
    : [];
  const profileComments = Array.isArray(data.profile_comments)
    ? data.profile_comments
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
      contextId: comment.blog?.id,
      contextTitle: comment.blog?.title,
    });
  }
  for (const comment of profileComments) {
    allComments.push({
      id: comment.id,
      content: comment.content,
      date_created: comment.date_created,
      context: "profile" as const,
      contextId: comment.profile?.id,
      contextTitle: comment.profile?.name,
    });
  }

  return {
    id: data.id,
    name: data.name,
    title: candidateInfo.position?.name || "",
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
    votes: 0, // Not present in response
    tags: [], // Not present in response
    createdAt: "", // Not present in response
    updatedAt: "", // Not present in response
    phone: undefined, // Not present in response
    email: undefined, // Not present in response
    address: undefined, // Not present in response
    achievements: candidateInfo.achievements || "",
    candidateComments: [], // Skipped as requested
    blogs: Array.isArray(data.blogs)
      ? data.blogs
          .filter((blog: { status: string }) => blog.status === "published")
          .map(
            (blog: {
              id: string;
              title: string;
              excerpt: string;
              date_published?: string;
              tags?: string[];
            }) => ({
              id: blog.id,
              title: blog.title,
              excerpt: blog.excerpt,
              date_published: blog.date_published || "",
              tags: blog.tags || [],
            })
          )
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
