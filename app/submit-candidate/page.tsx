'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Phone, Mail, Calendar, FileText, Award, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/lib/contexts/AuthContext';

const SubmitCandidatePage = () => {
  const [formData, setFormData] = useState({
    position: '',
    biography: '',
    manifesto: '',
    experience: '',
    achievements: '',
    phone: '',
    address: '',
    studentId: '',
    department: '',
    semester: '',
    isParticipating: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const positions = [
    'President',
    'Vice President',
    'General Secretary',
    'Assistant General Secretary',
    'Treasurer',
    'Cultural Secretary',
    'Sports Secretary',
    'Publication Secretary',
    'Social Welfare Secretary',
    'Environment Secretary',
    'Religious Affairs Secretary'
  ];

  const departments = [
    'Computer Science and Engineering',
    'Electrical and Electronic Engineering',
    'Business Administration',
    'Economics',
    'English',
    'Bangla',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Psychology',
    'Sociology',
    'Political Science',
    'History',
    'Philosophy',
    'Islamic Studies',
    'Law'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.biography || formData.biography.length < 50) 
      newErrors.biography = 'Biography must be at least 50 characters';
    if (!formData.manifesto || formData.manifesto.length < 100) 
      newErrors.manifesto = 'Manifesto must be at least 100 characters';
    if (!formData.phone || !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) 
      newErrors.phone = 'Valid phone number is required';
    if (!formData.address || formData.address.length < 10) 
      newErrors.address = 'Complete address is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.semester) newErrors.semester = 'Current semester is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast({
        type: 'success',
        title: 'Candidate Profile Submitted!',
        message: 'Your profile has been submitted for review. You will be notified once it\'s approved.'
      });

      // Redirect to candidate profile page
      router.push('/my-candidate-profile');
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

  const handleInputChange = (field: string, value: string | boolean) => {
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">Submit Candidate Profile</h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Submit your candidacy for the upcoming student union elections. All information will be reviewed before publication.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Full Name"
                  value={user?.name || ''}
                  disabled
                  className="bg-gray-50"
                />
                
                <Input
                  type="email"
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                
                <Input
                  type="text"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                />
                
                <Input
                  type="text"
                  label="Student ID"
                  placeholder="Enter your student ID"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  error={errors.studentId}
                />
                
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    label="Address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={errors.address}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                Academic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                </div>
                
                <Input
                  type="text"
                  label="Current Semester"
                  placeholder="e.g., 7th Semester"
                  value={formData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  error={errors.semester}
                />
              </div>
            </div>

            {/* Election Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-500" />
                Election Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isParticipating"
                    checked={formData.isParticipating}
                    onChange={(e) => handleInputChange('isParticipating', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isParticipating" className="text-sm text-gray-700">
                    I am actively participating in the upcoming election
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-500" />
                Profile Content
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                  <textarea
                    value={formData.biography}
                    onChange={(e) => handleInputChange('biography', e.target.value)}
                    placeholder="Tell us about yourself, your background, and what drives you... (minimum 50 characters)"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.biography && <p className="text-sm text-red-600">{errors.biography}</p>}
                    <p className="text-sm text-gray-500">{formData.biography.length}/50 minimum</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Election Manifesto</label>
                  <textarea
                    value={formData.manifesto}
                    onChange={(e) => handleInputChange('manifesto', e.target.value)}
                    placeholder="Share your vision, goals, and plans for the position you're running for... (minimum 100 characters)"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.manifesto && <p className="text-sm text-red-600">{errors.manifesto}</p>}
                    <p className="text-sm text-gray-500">{formData.manifesto.length}/100 minimum</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience & Qualifications</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Describe your relevant experience, leadership roles, and qualifications..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Achievements & Recognition</label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => handleInputChange('achievements', e.target.value)}
                    placeholder="List your notable achievements, awards, and recognition..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          </form>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitCandidatePage;