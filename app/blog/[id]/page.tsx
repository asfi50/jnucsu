import BlogPostClientWithFetch from "@/components/blog/blog-post";
import {
  generateMetadata as generateSEOMetadata,
  KEYWORDS,
  combineKeywords,
} from "@/lib/seo";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;

  // Provide basic metadata, detailed metadata will be set client-side
  return generateSEOMetadata({
    title: "Blog Post - JnUCSU",
    description: "Read our latest blog post from JnUCSU community.",
    keywords: combineKeywords(
      KEYWORDS.general,
      KEYWORDS.blog,
      KEYWORDS.leadership
    ),
    type: "article",
    url: `/blog/${id}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;

  return (
    <>
      <BlogPostClientWithFetch blogId={id} />
    </>
  );
}
