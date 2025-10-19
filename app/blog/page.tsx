import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CallToActionBanner from "@/components/ui/CallToActionBanner";
import BlogContentClient from "@/components/blog/BlogContentClient";
import { BlogPageApiResponse } from "@/lib/types/blogs.types";
import {
  generateMetadata,
  generateStructuredData,
  KEYWORDS,
  combineKeywords,
} from "@/lib/seo";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";
import { config } from "@/config";
import WriteBlogButton from "@/components/blog/write-blog";

export const metadata: Metadata = generateMetadata({
  title: "Blog & Articles - Student Insights and Leadership",
  description:
    "Read thought-provoking articles from Jagannath University student leaders. Explore insights on leadership, technology, community building, and campus life. Join the conversation on student democracy and empowerment.",
  keywords: combineKeywords(
    KEYWORDS.general,
    KEYWORDS.blog,
    KEYWORDS.leadership,
    [
      "student journalism",
      "campus articles",
      "university insights",
      "leadership blog",
      "student perspectives",
    ]
  ),
  type: "website",
  url: "/blog",
});

async function fetchBlogData(): Promise<{
  featuredPosts: BlogPageApiResponse[];
  regularPosts: BlogPageApiResponse[];
  allPosts: BlogPageApiResponse[];
}> {
  try {
    const response = await fetch(`${config.clientUrl}/api/blog`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache for 2 minutes to balance freshness and performance
      // next: { revalidate: 120 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    const blogs: BlogPageApiResponse[] = await response.json();

    // Filter featured and regular blogs
    const featuredPosts = blogs.filter((blog) => blog.is_featured === true);
    const regularPosts = blogs.filter((blog) => blog.is_featured !== true);

    return {
      featuredPosts,
      regularPosts,
      allPosts: blogs,
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);

    // Return empty arrays as fallback
    return {
      featuredPosts: [],
      regularPosts: [],
      allPosts: [],
    };
  }
}

export default async function BlogPage() {
  const { featuredPosts, regularPosts, allPosts } = await fetchBlogData();

  // Generate structured data for the blog collection
  const blogStructuredData = generateStructuredData({
    type: "WebSite",
    data: {
      name: "JnUCSU Blog",
      description:
        "Student insights, leadership articles, and campus news from Jagannath University",
      url: "/blog",
      author: {
        "@type": "Organization",
        name: "Jagannath University Central Students' Union",
      },
    },
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Call to Action Banner for Blog */}
          <CallToActionBanner type="blog" />

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
              </div>
              <WriteBlogButton />
            </div>
            <p className="text-gray-600 max-w-2xl">
              Discover insights, stories, and thoughts from our student leaders
              and community members.
            </p>
          </div>

          {/* Blog Content with Search and Filtering */}
          <BlogContentClient
            initialFeaturedPosts={featuredPosts}
            initialRegularPosts={regularPosts}
            initialAllPosts={allPosts}
          />
        </div>

        <Footer />
      </div>
    </>
  );
}
