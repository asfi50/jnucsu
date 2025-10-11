import { NextResponse } from "next/server";
import { VerifyAuthToken } from "@/middleware/verify-token";
import { config } from "@/config";
import { mapApiResponseToBlogPost } from "./structure";
import { BlogApiResponse } from "@/lib/types/blogs.types";

export async function GET(request: Request) {
  const authResult = await VerifyAuthToken(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  const { userId } = authResult.info;
  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  try {
    const res = await fetch(
      `${config.serverBaseUrl}/items/blog?user=${userId}&fields=*.*&sort=-date_created`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.adminToken}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          message: "Failed to fetch blog posts",
          details: errorData,
        },
        { status: res.status }
      );
    }
    const { data } = await res.json();
    const blogs = data.map((blog: BlogApiResponse) => {
      return mapApiResponseToBlogPost(blog);
    });
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
