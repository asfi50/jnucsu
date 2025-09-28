import Header from '@/components/layout/Header';
import BlogCard from '@/components/home/BlogCard';
import { dummyBlogPosts } from '@/lib/data';
import { BookOpen, Search, PenTool } from 'lucide-react';

export default function BlogPage() {
  const featuredPost = dummyBlogPosts[0];
  const regularPosts = dummyBlogPosts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            </div>
            <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
              <PenTool className="w-4 h-4" />
              <span>Write Article</span>
            </button>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Discover insights, stories, and thoughts from our student leaders and community members.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
              <option value="">All Categories</option>
              <option value="leadership">Leadership</option>
              <option value="technology">Technology</option>
              <option value="community">Community</option>
              <option value="environment">Environment</option>
            </select>

            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
              <BlogCard post={featuredPost} featured />
            </section>

            {/* Recent Articles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Tags */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Leadership', 'Technology', 'Community', 'Innovation',
                  'Student Life', 'Environment', 'Culture', 'Education'
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 text-sm rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest articles and updates delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </section>

            {/* Statistics */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Articles</span>
                  <span className="font-semibold">{dummyBlogPosts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Writers</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reads</span>
                  <span className="font-semibold">2.4k</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}