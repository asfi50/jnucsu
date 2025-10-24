"use client";

import { useState, useEffect } from "react";
import {
  Facebook,
  Linkedin,
  Instagram,
  Globe,
  Plus,
  Edit3,
  X,
  Save,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface SocialLink {
  type: "facebook" | "linkedin" | "instagram" | "website";
  url: string;
  label: string;
  icon: React.ReactNode;
}

interface SocialMediaManagerProps {
  links: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  onUpdate: (links: SocialMediaManagerProps["links"]) => Promise<void>;
  isLoading?: boolean;
}

const socialMediaTypes = [
  {
    type: "facebook" as const,
    label: "Facebook",
    icon: <Facebook className="w-4 h-4" />,
    placeholder: "Enter your Facebook username",
    color: "bg-blue-600 hover:bg-blue-700",
    baseUrl: "https://facebook.com/",
  },
  {
    type: "linkedin" as const,
    label: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    placeholder: "Enter your LinkedIn username",
    color: "bg-blue-700 hover:bg-blue-800",
    baseUrl: "https://linkedin.com/in/",
  },
  {
    type: "instagram" as const,
    label: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    placeholder: "Enter your Instagram username",
    color: "bg-pink-600 hover:bg-pink-700",
    baseUrl: "https://instagram.com/",
  },
  {
    type: "website" as const,
    label: "Personal Website",
    icon: <Globe className="w-4 h-4" />,
    placeholder: "Enter your website URL",
    color: "bg-gray-600 hover:bg-gray-700",
    baseUrl: null,
  },
];

export default function SocialMediaManager({
  links,
  onUpdate,
  isLoading = false,
}: SocialMediaManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDesktopForm, setShowDesktopForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [localLinks, setLocalLinks] = useState(links);
  const [isMobile, setIsMobile] = useState(false);
  const { showToast } = useToast();

  // Update localLinks when props change
  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get existing social links as array
  const existingSocialLinks: SocialLink[] = Object.entries(localLinks)
    .filter(([, url]) => url && url.trim() !== "")
    .map(([type, url]) => {
      const socialType = socialMediaTypes.find((s) => s.type === type);
      return {
        type: type as SocialLink["type"],
        url: url!,
        label: socialType?.label || type,
        icon: socialType?.icon || <Globe className="w-4 h-4" />,
      };
    });

  // Get available social media types that aren't added yet
  const availableTypes = socialMediaTypes.filter(
    (type) => !localLinks[type.type] || localLinks[type.type]?.trim() === ""
  );

  const handleSave = async () => {
    try {
      await onUpdate(localLinks);
      setIsEditing(false);
      setEditingItem(null);
      showToast({
        type: "success",
        title: "Social Links Updated",
        message: "Your social media links have been updated successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Failed to update social media links. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setLocalLinks(links);
    setIsEditing(false);
    setEditingItem(null);
    setShowAddModal(false);
  };

  const extractUsernameFromUrl = (url: string, type: string): string => {
    const trimmedUrl = url.trim();
    const socialType = socialMediaTypes.find((s) => s.type === type);

    // If it's a website or already looks like a username, return as is
    if (
      type === "website" ||
      !socialType?.baseUrl ||
      !trimmedUrl.includes("://")
    ) {
      return trimmedUrl;
    }

    try {
      const urlObj = new URL(trimmedUrl);
      const pathname = urlObj.pathname;

      // Extract username based on platform
      switch (type) {
        case "facebook":
          return pathname.replace(/^\/+|\/+$/g, "") || trimmedUrl;
        case "linkedin":
          return pathname.replace(/^\/in\/+|\/+$/g, "") || trimmedUrl;
        case "twitter":
        case "instagram":
          return pathname.replace(/^\/+|\/+$/g, "") || trimmedUrl;
        default:
          return trimmedUrl;
      }
    } catch {
      // If URL parsing fails, assume it's already a username
      return trimmedUrl;
    }
  };

  const handleAddSocialLink = async (type: string, url: string) => {
    if (!url.trim()) return;

    try {
      const username = extractUsernameFromUrl(url, type);
      const updatedLinks = {
        ...localLinks,
        [type]: username,
      };

      setLocalLinks(updatedLinks);
      await onUpdate(updatedLinks);
      setShowAddModal(false);
      setShowDesktopForm(false);

      showToast({
        type: "success",
        title: "Social Link Added",
        message: `Your ${type} profile has been added successfully.`,
      });
    } catch {
      showToast({
        type: "error",
        title: "Add Failed",
        message: `Failed to add ${type} profile. Please try again.`,
      });
    }
  };

  const handleRemoveSocialLink = async (type: string) => {
    try {
      const updatedLinks = {
        ...localLinks,
        [type]: "",
      };

      setLocalLinks(updatedLinks);
      await onUpdate(updatedLinks);

      showToast({
        type: "success",
        title: "Social Link Removed",
        message: `Your ${type} profile has been removed successfully.`,
      });
    } catch {
      showToast({
        type: "error",
        title: "Remove Failed",
        message: `Failed to remove ${type} profile. Please try again.`,
      });
    }
  };

  const handleEditInline = (type: string, currentUrl: string) => {
    setEditingItem(type);
    setEditValue(currentUrl);
  };

  const handleSaveInline = async (type: string) => {
    try {
      if (!editValue.trim()) {
        await handleRemoveSocialLink(type);
      } else {
        const username = extractUsernameFromUrl(editValue, type);
        const updatedLinks = {
          ...localLinks,
          [type]: username,
        };

        setLocalLinks(updatedLinks);
        await onUpdate(updatedLinks);

        showToast({
          type: "success",
          title: "Social Link Updated",
          message: `Your ${type} profile has been updated successfully.`,
        });
      }
      setEditingItem(null);
      setEditValue("");
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: `Failed to update ${type} profile. Please try again.`,
      });
    }
  };

  const handleCancelInline = () => {
    setEditingItem(null);
    setEditValue("");
  };

  const getFullUrl = (username: string, type: string): string => {
    const socialType = socialMediaTypes.find((s) => s.type === type);

    if (type === "website" || !socialType?.baseUrl) {
      // For website, check if it already has protocol
      if (username.includes("://")) {
        return username;
      }
      return `https://${username}`;
    }

    // For social media, if it already looks like a full URL, return as is
    if (username.includes("://")) {
      return username;
    }

    // Otherwise, construct full URL
    return `${socialType.baseUrl}${username}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
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
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
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

      {/* Display existing social links */}
      <div className="space-y-3">
        {existingSocialLinks.length === 0 && !isEditing && (
          <div className="text-gray-500 text-center py-8">
            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No social media links added yet</p>
          </div>
        )}

        {existingSocialLinks.map((social) => {
          const socialTypeInfo = socialMediaTypes.find(
            (s) => s.type === social.type
          );
          const isEditingThis = editingItem === social.type;

          return (
            <div
              key={social.type}
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div
                  className={`p-2 rounded-full text-white flex-shrink-0 ${
                    socialTypeInfo?.color || "bg-gray-600"
                  }`}
                >
                  {social.icon}
                </div>

                <div className="flex-1 min-w-0">
                  {isEditingThis ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder={socialTypeInfo?.placeholder}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveInline(social.type);
                          } else if (e.key === "Escape") {
                            handleCancelInline();
                          }
                        }}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveInline(social.type)}
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelInline}
                          className="flex items-center space-x-1 px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {social.label}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">
                        {social.url}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!isEditingThis && (
                <div className="flex items-center space-x-1 self-start sm:self-center flex-shrink-0">
                  <a
                    href={getFullUrl(social.url, social.type)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    title="Visit profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {isEditing && (
                    <>
                      <button
                        onClick={() =>
                          handleEditInline(social.type, social.url)
                        }
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveSocialLink(social.type)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add new social link button */}
        {isEditing && availableTypes.length > 0 && (
          <>
            <button
              onClick={() => {
                if (isMobile) {
                  setShowAddModal(true);
                } else {
                  setShowDesktopForm(true);
                }
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Social Media Link</span>
            </button>

            {/* Desktop inline form */}
            {!isMobile && showDesktopForm && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <SocialLinkFormNew
                  availableTypes={availableTypes}
                  onAdd={handleAddSocialLink}
                  onClose={() => setShowDesktopForm(false)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Modal for Add Social Media */}
      {isMobile && showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-amber-300 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Social Media Links
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SocialLinkFormNew
              availableTypes={availableTypes}
              onAdd={handleAddSocialLink}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SocialLinkFormNew({
  availableTypes,
  onAdd,
  onClose,
}: {
  availableTypes: (typeof socialMediaTypes)[0][];
  onAdd: (type: string, username: string) => Promise<void>;
  onClose: () => void;
}) {
  const [selectedType, setSelectedType] = useState(
    availableTypes[0]?.type || ""
  );
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedLinks, setAddedLinks] = useState<
    { type: string; username: string }[]
  >([]);

  const handleAdd = async () => {
    if (!selectedType || !username.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(selectedType, username.trim());

      // Add to locally added links for UI feedback
      setAddedLinks((prev) => [
        ...prev,
        { type: selectedType, username: username.trim() },
      ]);

      // Reset form
      setUsername("");

      // Update available types (remove the one just added)
      const remainingTypes = availableTypes.filter(
        (type) =>
          type.type !== selectedType &&
          !addedLinks.some((added) => added.type === type.type)
      );

      if (remainingTypes.length > 0) {
        setSelectedType(remainingTypes[0].type);
      }
    } catch (error) {
      console.error("Error adding social link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingTypes = availableTypes.filter(
    (type) => !addedLinks.some((added) => added.type === type.type)
  );

  return (
    <div className="space-y-4">
      {/* Show added links */}
      {addedLinks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Added Links:</h4>
          {addedLinks.map((link, index) => {
            const linkType = socialMediaTypes.find((t) => t.type === link.type);
            return (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg"
              >
                <div className={`p-1 rounded text-white ${linkType?.color}`}>
                  {linkType?.icon}
                </div>
                <span className="text-sm font-medium">{linkType?.label}</span>
                <span className="text-sm text-gray-600">@{link.username}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new link form */}
      {remainingTypes.length > 0 && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            {/* Dropdown for social media type */}
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value as
                    | "facebook"
                    | "linkedin"
                    | "instagram"
                    | "website"
                )
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              disabled={isLoading}
            >
              {remainingTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Username input */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd();
                }
              }}
            />
          </div>

          {/* Add Another button */}
          <button
            onClick={handleAdd}
            disabled={!selectedType || !username.trim() || isLoading}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isLoading ? "Adding..." : "Add Another"}
          </button>
        </div>
      )}

      {/* Close button */}
      <div className="flex space-x-2 pt-2 border-t">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
}
