'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/lib/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  category: string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  likes: number;
  rejectionReason?: string;
}

const MyBlogsPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'published' | 'rejected'>('all');
  const { showToast } = useToast();
  const { user } = useAuth();

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBlogs: BlogPost[] = [
        {
          id: '1',
          title: 'The Future of Student Leadership in Digital Age',
          excerpt: 'Exploring how technology is reshaping student leadership and engagement in universities.',
          content: 'Lorem ipsum dolor sit amet...',
          status: 'published',
          category: 'Leadership',
          tags: ['leadership', 'technology', 'digital'],
          thumbnail: '/api/placeholder/400/200',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
          publishedAt: '2024-01-10T12:00:00Z',
          views: 156,
          likes: 23
        },
        {
          id: '2',
          title: 'Building Stronger University Communities',
          excerpt: 'Strategies for creating inclusive and supportive university environments.',
          content: 'Lorem ipsum dolor sit amet...',
          status: 'pending',
          category: 'Community',
          tags: ['community', 'inclusion', 'university'],
          thumbnail: '/api/placeholder/400/200',
          createdAt: '2024-01-08T14:00:00Z',
          updatedAt: '2024-01-08T14:00:00Z',
          views: 0,
          likes: 0
        },
        {
          id: '3',
          title: 'My Experience as a Student Representative',
          excerpt: 'Lessons learned from serving as a student representative.',
          content: 'Lorem ipsum dolor sit amet...',
          status: 'draft',
          category: 'Experience',
          tags: ['experience', 'representation'],
          createdAt: '2024-01-05T09:00:00Z',
          updatedAt: '2024-01-07T16:00:00Z',
          views: 0,
          likes: 0
        },
        {
          id: '4',
          title: 'Environmental Initiatives on Campus',
          excerpt: 'How we can make our campus more sustainable.',
          content: 'Lorem ipsum dolor sit amet...',
          status: 'rejected',
          category: 'Environment',
          tags: ['environment', 'sustainability'],
          createdAt: '2024-01-03T11:00:00Z',
          updatedAt: '2024-01-03T11:00:00Z',
          views: 0,
          likes: 0,
          rejectionReason: 'Content needs more specific examples and citations to support the claims.'
        }
      ];
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBlogs = filter === 'all' ? blogs : blogs.filter(blog => blog.status === filter);

  const getStatusIcon = (status: BlogPost['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      showToast({
        type: 'success',
        title: 'Blog Deleted',
        message: 'The blog post has been deleted successfully.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: 'Failed to delete the blog post. Please try again.'
      });
    }
  };

  const handlePublish = async (blogId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBlogs(prev => prev.map(blog => 
        blog.id === blogId 
          ? { ...blog, status: 'pending' as const, updatedAt: new Date().toISOString() }
          : blog
      ));
      
      showToast({
        type: 'success',
        title: 'Blog Submitted',
        message: 'Your blog post has been submitted for review.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to submit the blog post. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading your blogs...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Blog Posts</h1>
              <p className="text-gray-600">
                Manage your blog posts, track their status, and create new content.
              </p>
            </div>
            <Link href="/submit-blog">
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Write New Post</span>
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">
                    {blogs.filter(b => b.status === 'published').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {blogs.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {blogs.reduce((sum, blog) => sum + blog.views, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'All Posts', count: blogs.length },
                  { key: 'published', label: 'Published', count: blogs.filter(b => b.status === 'published').length },
                  { key: 'pending', label: 'Pending', count: blogs.filter(b => b.status === 'pending').length },
                  { key: 'draft', label: 'Drafts', count: blogs.filter(b => b.status === 'draft').length },
                  { key: 'rejected', label: 'Rejected', count: blogs.filter(b => b.status === 'rejected').length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      filter === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Blog Posts List */}
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No blog posts yet' : `No ${filter} posts`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start sharing your thoughts and ideas with the community.'
                  : `You don't have any ${filter} posts at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Link href="/submit-blog">
                  <Button>Write Your First Post</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{blog.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                          {getStatusIcon(blog.status)}
                          <span className="ml-1 capitalize">{blog.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Category: {blog.category}</span>
                        <span>•</span>
                        <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                        {blog.status === 'published' && (
                          <>
                            <span>•</span>
                            <span>{blog.views} views</span>
                            <span>•</span>
                            <span>{blog.likes} likes</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {blog.status === 'rejected' && blog.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-red-800">
                            <strong>Rejection Reason:</strong> {blog.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      {blog.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublish(blog.id)}
                        >
                          Submit for Review
                        </Button>
                      )}
                      
                      {(blog.status === 'draft' || blog.status === 'rejected') && (
                        <Link href={`/submit-blog?edit=${blog.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      
                      {blog.status === 'published' && (
                        <Link href={`/blog/${blog.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default MyBlogsPage;