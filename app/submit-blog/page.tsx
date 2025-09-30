'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Image, Tag, Folder, Upload, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/lib/contexts/AuthContext';

const SubmitBlogPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    category: '',
    thumbnail: null as File | null,
    status: 'draft' as 'draft' | 'published'
  });
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const categories = [
    'Leadership',
    'Technology',
    'Community',
    'Education',
    'Environment',
    'Politics',
    'Culture',
    'Sports',
    'Innovation',
    'Career',
    'Social Issues',
    'Campus Life',
    'Student Rights',
    'Academic',
    'Events'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 10) 
      newErrors.title = 'Title must be at least 10 characters';
    if (!formData.content || formData.content.length < 200) 
      newErrors.content = 'Content must be at least 200 characters';
    if (!formData.excerpt || formData.excerpt.length < 50) 
      newErrors.excerpt = 'Excerpt must be at least 50 characters';
    if (!formData.category) 
      newErrors.category = 'Category is required';
    if (formData.tags.length === 0) 
      newErrors.tags = 'At least one tag is required';
    if (!formData.thumbnail) 
      newErrors.thumbnail = 'Thumbnail image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call with file upload
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const action = formData.status === 'published' ? 'published' : 'saved as draft';
      
      showToast({
        type: 'success',
        title: `Blog Post ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
        message: formData.status === 'published' 
          ? 'Your blog post has been submitted for review and will be published once approved.'
          : 'Your blog post has been saved as draft. You can publish it later from My Blogs.'
      });

      // Redirect to my blogs page
      router.push('/my-blogs');
    } catch (error) {
      console.error('Submission error:', error);
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, thumbnail: 'Image must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, thumbnail: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
      setErrors(prev => ({ ...prev, tags: '' }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Write New Blog Post</h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Share your thoughts, ideas, and insights with the JnUCSU community. All posts are reviewed before publication.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-500" />
                Blog Details
              </h2>
              
              <div className="space-y-6">
                <Input
                  type="text"
                  label="Blog Title"
                  placeholder="Enter an engaging title for your blog post"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Write a brief excerpt that summarizes your blog post... (minimum 50 characters)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
                    <p className="text-sm text-gray-500">{formData.excerpt.length}/50 minimum</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your blog content here... Share your thoughts, experiences, and insights. (minimum 200 characters)"
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                    <p className="text-sm text-gray-500">{formData.content.length}/200 minimum</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Categorization */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Image className="w-5 h-5 mr-2 text-orange-500" />
                Media & Category
              </h2>
              
              <div className="space-y-6">
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
                  <div className="space-y-4">
                    {thumbnailPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    {errors.thumbnail && <p className="text-sm text-red-600">{errors.thumbnail}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-orange-500" />
                Tags
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags (press Enter to add)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim() || formData.tags.length >= 10}
                    variant="outline"
                  >
                    Add Tag
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-orange-200 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  {errors.tags && <p className="text-red-600">{errors.tags}</p>}
                  <p>{formData.tags.length}/10 tags</p>
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, status: 'draft' }));
                    handleSubmit(new Event('submit') as any);
                  }}
                  disabled={loading}
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                >
                  {loading ? 'Publishing...' : 'Publish for Review'}
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitBlogPage;