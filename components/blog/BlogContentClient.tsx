"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import Fuse from "fuse.js";
import { BlogPageApiResponse } from "@/lib/types/blogs.types";
import { transformApiBlogToBlogPost } from "@/lib/utils/blog-transform";
import BlogCard from "@/components/home/BlogCard";
import { useServerData } from "@/hooks/use-server-data";
import { BookOpen } from "lucide-react";
import NewsletterSubscription from "../shared/NewsletterSubscription";

interface BlogContentClientProps {
  initialFeaturedPosts: BlogPageApiResponse[];
  initialRegularPosts: BlogPageApiResponse[];
  initialAllPosts: BlogPageApiResponse[];
}

// Debounced search hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function BlogContentClient({
  initialFeaturedPosts,
  initialAllPosts,
}: BlogContentClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const { categories } = useServerData();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Configure Fuse.js for fuzzy search
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: "title", weight: 0.4 },
        { name: "excerpt", weight: 0.3 },
        { name: "category", weight: 0.2 },
        { name: "author.name", weight: 0.1 },
      ],
      threshold: 0.4, // Balance between strict and fuzzy matching
      distance: 100,
      minMatchCharLength: 1,
      includeScore: true,
      ignoreLocation: true,
      ignoreFieldNorm: true,
    }),
    []
  );

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(initialAllPosts, fuseOptions);
  }, [initialAllPosts, fuseOptions]);

  // Filter and search logic
  const filteredAndSearchedPosts = useMemo(() => {
    let posts = [...initialAllPosts];

    // Apply search
    if (debouncedSearchQuery.trim()) {
      const searchResults = fuse.search(debouncedSearchQuery);
      posts = searchResults.map((result) => result.item);
    }

    // Apply category filter
    if (selectedCategory) {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "latest":
        posts.sort(
          (a, b) =>
            new Date(b.date_published).getTime() -
            new Date(a.date_published).getTime()
        );
        break;
      case "popular":
        posts.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "trending":
        posts.sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
        break;
      default:
        break;
    }

    return posts;
  }, [initialAllPosts, debouncedSearchQuery, selectedCategory, sortBy, fuse]);

  // Separate filtered posts into featured and regular
  const filteredFeaturedPosts = useMemo(() => {
    return filteredAndSearchedPosts.filter((post) => post.is_featured === true);
  }, [filteredAndSearchedPosts]);

  const filteredRegularPosts = useMemo(() => {
    return filteredAndSearchedPosts.filter((post) => post.is_featured !== true);
  }, [filteredAndSearchedPosts]);

  // Transform posts for BlogCard component
  const featuredBlogPosts = useMemo(
    () => filteredFeaturedPosts.map(transformApiBlogToBlogPost),
    [filteredFeaturedPosts]
  );

  const regularBlogPosts = useMemo(
    () => filteredRegularPosts.map(transformApiBlogToBlogPost),
    [filteredRegularPosts]
  );

  // Get main featured post
  const featuredPost = featuredBlogPosts[0] || regularBlogPosts[0];
  const displayRegularPosts = featuredBlogPosts[0]
    ? regularBlogPosts
    : regularBlogPosts.slice(1);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("latest");
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery.trim() || selectedCategory || sortBy !== "latest";

  return (
    <>
      {/* Community Stats - Mobile Only (Top) */}
      <div className="block lg:hidden mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {initialAllPosts.length}
              </div>
              <div className="text-xs text-gray-600">Articles</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {initialFeaturedPosts.length}
              </div>
              <div className="text-xs text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {initialAllPosts.reduce(
                  (total, post) => total + (post.views || 0),
                  0
                )}
              </div>
              <div className="text-xs text-gray-600">Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 lg:mb-8 bg-white rounded-lg border border-gray-200 p-3 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            {debouncedSearchQuery.trim() && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  Smart search
                </span>
              </div>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm lg:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.text}>
                {category.text}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm lg:text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Filter Status and Clear Button */}
        {hasActiveFilters && (
          <div className="mt-3 lg:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 lg:pt-4 border-t border-gray-200 gap-2">
            <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-600">
              <span>
                {filteredAndSearchedPosts.length} article
                {filteredAndSearchedPosts.length !== 1 ? "s" : ""} found
              </span>
              {debouncedSearchQuery.trim() && (
                <span className="text-orange-600">
                  for &ldquo;{debouncedSearchQuery}&rdquo;
                </span>
              )}
              {selectedCategory && (
                <span className="text-orange-600">in {selectedCategory}</span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-xs lg:text-sm text-gray-500 hover:text-gray-700 underline self-start sm:self-auto"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 order-1 lg:order-1">
          {/* Featured Article */}
          {featuredPost && (
            <section className="mb-4 lg:mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-6">
                Featured Article
              </h2>
              <BlogCard post={featuredPost} featured />
            </section>
          )}

          {/* Recent Articles */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-6">
              {hasActiveFilters ? "Search Results" : "Recent Articles"}
            </h2>
            {displayRegularPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 sm:gap-6">
                {displayRegularPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 lg:py-12">
                <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                  {hasActiveFilters
                    ? "No articles match your search"
                    : "No articles found"}
                </h3>
                <p className="text-sm lg:text-base text-gray-600">
                  {hasActiveFilters
                    ? "Try adjusting your search terms or filters"
                    : "Be the first to write an article!"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 lg:mt-4 text-sm lg:text-base text-orange-600 hover:text-orange-700 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Load More */}
          {displayRegularPosts.length > 0 && !hasActiveFilters && (
            <div className="text-center mt-6 lg:mt-8">
              <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 lg:px-6 py-2 text-sm lg:text-base rounded-lg transition-colors">
                Load More Articles
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-8 order-2 lg:order-2">
          {/* Popular Tags - Mobile: Horizontal scroll, Desktop: Grid */}
          <section className="bg-white rounded-lg border border-gray-200 p-3 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
              Popular Tags
            </h3>
            <div className="lg:flex lg:flex-wrap lg:gap-2">
              {/* Mobile: Horizontal scrollable */}
              <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {[
                  "Leadership",
                  "Technology",
                  "Community",
                  "Innovation",
                  "Student Life",
                  "Environment",
                  "Culture",
                  "Education",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex-shrink-0 px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 text-xs rounded-full transition-colors whitespace-nowrap"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {/* Desktop: Flex wrap */}
              <div className="hidden lg:flex lg:flex-wrap lg:gap-2">
                {[
                  "Leadership",
                  "Technology",
                  "Community",
                  "Innovation",
                  "Student Life",
                  "Environment",
                  "Culture",
                  "Education",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Statistics - Hidden on mobile (shown at top) */}
          <section className="hidden lg:block bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Community Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Articles</span>
                <span className="font-semibold">{initialAllPosts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Featured Articles</span>
                <span className="font-semibold">
                  {initialFeaturedPosts.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views</span>
                <span className="font-semibold">
                  {initialAllPosts.reduce(
                    (total, post) => total + (post.views || 0),
                    0
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* Categories - Mobile: Horizontal scroll, Desktop: List */}
          {categories && categories.length > 0 && (
            <section className="bg-white rounded-lg border border-gray-200 p-3 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                Categories
              </h3>
              {/* Mobile: Horizontal scrollable pills */}
              <div className="lg:hidden">
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  {categories.map((category) => {
                    const categoryCount = initialAllPosts.filter(
                      (post) => post.category === category.text
                    ).length;
                    return (
                      <button
                        key={category.id}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.text
                              ? ""
                              : category.text
                          )
                        }
                        className={`flex-shrink-0 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                          selectedCategory === category.text
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {category.text} ({categoryCount})
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Desktop: List format */}
              <div className="hidden lg:block space-y-2">
                {categories.map((category) => {
                  const categoryCount = initialAllPosts.filter(
                    (post) => post.category === category.text
                  ).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.text
                            ? ""
                            : category.text
                        )
                      }
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.text
                          ? "bg-orange-100 text-orange-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span>{category.text}</span>
                      <span className="text-gray-500">{categoryCount}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Newsletter Signup - Hidden on mobile */}
          <div className="hidden lg:block mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <NewsletterSubscription
              title="Stay Updated"
              titleColor="text-yellow-800"
              description="Get the latest articles and updates delivered to your inbox."
              placeholder="Enter your email"
              className="[&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-4 [&>p]:text-gray-600 [&>p]:text-sm [&>p]:mb-4"
            />
          </div>
        </div>
      </div>
    </>
  );
}
