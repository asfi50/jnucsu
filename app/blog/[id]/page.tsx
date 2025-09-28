import { notFound } from 'next/navigation';
import { dummyBlogPosts } from '@/lib/data';
import { generateMetadata as generateSEOMetadata, generateStructuredData, KEYWORDS, combineKeywords } from '@/lib/seo';
import { Metadata } from 'next';
import BlogPostClient from '@/components/blog/BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = dummyBlogPosts.find(p => p.id === id);

  if (!post) {
    return generateSEOMetadata({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
      noIndex: true,
    });
  }

  const postKeywords = [
    ...post.tags,
    post.author.name,
    'JnUCSU blog',
    'student article',
    'university blog',
  ];

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: combineKeywords(
      KEYWORDS.general,
      KEYWORDS.blog,
      KEYWORDS.leadership,
      postKeywords
    ),
    image: post.coverImage,
    type: 'article',
    url: `/blog/${id}`,
    publishedTime: post.publishedAt,
    author: post.author.name,
    section: post.tags[0],
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = dummyBlogPosts.find(p => p.id === id);

  if (!post) {
    notFound();
  }

  // Generate structured data for the blog post
  const articleStructuredData = generateStructuredData({
    type: 'Article',
    data: {
      title: post.title,
      description: post.excerpt,
      author: post.author,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      image: post.coverImage,
      url: `/blog/${post.id}`,
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      
      <BlogPostClient post={post} />
    </>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return dummyBlogPosts.map((post) => ({
    id: post.id,
  }));
}