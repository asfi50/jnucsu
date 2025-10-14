import { config } from "@/config";
import { NextResponse } from "next/server";
import { formatCandidateApiResponse } from "./format";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fields = [
      "id",
      "name",
      "image",
      "student_id",
      "department.name",
      "academic_year",
      "about",
      "gallery.id",
      "gallery.title",
      "gallery.description",
      "gallery.url",
      "candidate.biography",
      "candidate.manifesto",
      "candidate.experience",
      "candidate.achievements",
      "candidate.isParticipating",
      "candidate.position.name",
      "blogs.id",
      "blogs.status",
      "blogs.title",
      "blogs.excerpt",
      "blogs.date_published",
      "blogs.tags",
      "blog_comments.id",
      "blog_comments.content",
      "blog_comments.date_created",
      "blog_comments.blog.id",
      "blog_comments.blog.title",
      "profile_comments.id",
      "profile_comments.content",
      "profile_comments.date_created",
      "profile_comments.profile.id",
      "profile_comments.profile.name",
      "comments.id",
      "comments.content",
      "comments.date_created",
      "comments.user.id",
      "comments.user.name",
      "comments.user.image",
    ];
    const res = await fetch(
      `${config.serverBaseUrl}/items/profile/${id}?fields=${fields.join(",")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch application data" },
        { status: res.status }
      );
    }

    const { data } = await res.json();
    const formattedData = formatCandidateApiResponse(data);
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
