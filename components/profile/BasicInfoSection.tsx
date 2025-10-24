"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface BasicInfoData {
  name: string;
  email: string;
  phone?: string;
  studentId?: string;
  did?: string;
  year?: string;
  address?: string;
}

interface BasicInfoSectionProps {
  data: BasicInfoData;
  departments: Array<{ id: string; name: string }>;
  onUpdate: (data: Partial<BasicInfoData>) => Promise<void>;
  isLoading?: boolean;
}

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Masters"];

export default function BasicInfoSection({
  data,
  departments,
  onUpdate,
  isLoading = false,
}: BasicInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);
  const { showToast } = useToast();

  // Update localData when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSave = async () => {
    try {
      await onUpdate(localData);
      setIsEditing(false);
      showToast({
        type: "success",
        title: "Information Updated",
        message: "Your basic information has been updated successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update basic information. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setLocalData(data);
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={localData.name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={localData.email || ""}
            disabled={true}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500"
          />
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={localData.phone || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isEditing ? "Enter your phone number" : "Not provided"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={localData.studentId || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isEditing ? "Enter your student ID" : "Not provided"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            name="did"
            value={localData.did || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="">Select Department</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Academic Year
          </label>
          <select
            name="year"
            value={localData.year || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="">Select Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={localData.address || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder={isEditing ? "Enter your address" : "Not provided"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
