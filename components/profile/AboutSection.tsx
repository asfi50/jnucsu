"use client";

import { useState } from "react";
import { FileText, Edit3, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface AboutSectionProps {
  about?: string;
  onUpdate: (about: string) => Promise<void>;
  isLoading?: boolean;
}

export default function AboutSection({
  about = "",
  onUpdate,
  isLoading = false,
}: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localAbout, setLocalAbout] = useState(about);
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await onUpdate(localAbout);
      setIsEditing(false);
      showToast({
        type: "success",
        title: "About Updated",
        message: "Your about section has been updated successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update about section. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setLocalAbout(about);
    setIsEditing(false);
  };

  const characterCount = localAbout?.length || 0;
  const maxLength = 500;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          About Me
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
              disabled={isLoading || characterCount > maxLength}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={localAbout}
            onChange={(e) => setLocalAbout(e.target.value)}
            rows={6}
            maxLength={maxLength}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Tell us about yourself, your interests, and what you're passionate about..."
          />
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">
              Share your background, interests, and goals
            </p>
            <p
              className={`${
                characterCount > maxLength ? "text-red-600" : "text-gray-500"
              }`}
            >
              {characterCount}/{maxLength}
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-[120px]">
          {about && about.trim() ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {about}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[120px] text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No about information added yet</p>
                <p className="text-sm">Share something about yourself!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
