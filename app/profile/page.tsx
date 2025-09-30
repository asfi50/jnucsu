'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { 
  Camera, User, Mail, Phone, MapPin, Calendar, BookOpen, Target, X, Plus, Save, Edit3
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/api/placeholder/150/150');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@student.jnu.edu',
    phone: '+880 123 456 789',
    studentId: 'JNU2021001',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    role: 'Vice President (VP)',
    about: 'Passionate student leader committed to creating positive change in our university community. With experience in organizing events, advocating for student rights, and fostering academic excellence.',
    futurePlans: 'After graduation, I plan to pursue a career in technology while continuing to contribute to educational development initiatives. I aim to establish scholarship programs for underprivileged students.',
    address: 'Dhaka, Bangladesh'
  });

  const [gallery, setGallery] = useState([
    { id: 1, url: '/api/placeholder/300/200', title: 'Student Union Meeting', description: 'Leading weekly student council discussions' },
    { id: 2, url: '/api/placeholder/300/200', title: 'Campus Event Organization', description: 'Organizing annual cultural festival' },
    { id: 3, url: '/api/placeholder/300/200', title: 'Community Service', description: 'Blood donation drive coordination' },
    { id: 4, url: '/api/placeholder/300/200', title: 'Academic Workshop', description: 'Hosting skill development sessions' }
  ]);

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    url: ''
  });

  const [showAddGallery, setShowAddGallery] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleAddGalleryItem = () => {
    if (newGalleryItem.title && newGalleryItem.description) {
      const newItem = {
        id: gallery.length + 1,
        url: newGalleryItem.url || '/api/placeholder/300/200',
        title: newGalleryItem.title,
        description: newGalleryItem.description
      };
      setGallery([...gallery, newItem]);
      setNewGalleryItem({ title: '', description: '', url: '' });
      setShowAddGallery(false);
    }
  };

  const handleRemoveGalleryItem = (id: number) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  const roleOptions = [
    'President', 'Vice President (VP)', 'General Secretary (GS)', 'Assistant General Secretary (AGS)',
    'Treasurer', 'Sports Secretary', 'Cultural Secretary', 'Social Welfare Secretary'
  ];

  const departmentOptions = [
    'Computer Science & Engineering', 'Electrical & Electronic Engineering', 'Business Administration',
    'Economics', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History',
    'Political Science', 'Philosophy'
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Masters'];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your profile information and showcase your leadership journey</p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm sm:text-base">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    <Image src={profileImage} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{formData.name}</h3>
                  <p className="text-sm text-gray-600">{formData.role}</p>
                  <p className="text-sm text-gray-500">{formData.department}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />Full Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />Email Address
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />Phone Number
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-2" />Student ID
                  </label>
                  <input type="text" name="studentId" value={formData.studentId} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500">
                    {departmentOptions.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />Academic Year
                  </label>
                  <select name="year" value={formData.year} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500">
                    {yearOptions.map(year => (<option key={year} value={year}>{year}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leadership Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500">
                    {roleOptions.map(role => (<option key={role} value={role}>{role}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />Address
                  </label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About Me</h2>
              <textarea name="about" value={formData.about} onChange={handleInputChange} disabled={!isEditing} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" placeholder="Tell us about yourself, your leadership experience, and what drives your passion for student advocacy..." />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <Target className="w-5 h-5 inline mr-2" />Future Plans After Elections
              </h2>
              <textarea name="futurePlans" value={formData.futurePlans} onChange={handleInputChange} disabled={!isEditing} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500" placeholder="Share your vision and plans for after the elections. What do you hope to achieve? How will you contribute to the university community?" />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Work Gallery</h2>
                {isEditing && (
                  <button onClick={() => setShowAddGallery(true)} className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm">
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                )}
              </div>

              {showAddGallery && (
                <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Add New Gallery Item</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Title" value={newGalleryItem.title} onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    <textarea placeholder="Description" value={newGalleryItem.description} onChange={(e) => setNewGalleryItem({...newGalleryItem, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    <div className="flex space-x-2">
                      <button onClick={handleAddGalleryItem} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Add Item</button>
                      <button onClick={() => setShowAddGallery(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <Image src={item.url} alt={item.title} width={300} height={192} className="w-full h-48 object-cover" />
                    </div>
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    {isEditing && (
                      <button onClick={() => handleRemoveGalleryItem(item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
