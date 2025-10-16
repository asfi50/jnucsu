import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, X, Edit2, Trash2, Upload } from "lucide-react";
import { GalleryItem } from "@/lib/types/profile.types";
import useAxios from "@/hooks/use-axios";
import { useToast } from "@/components/ui/ToastProvider";
import imageCompression from "browser-image-compression";

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0  bg-opacity-10 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

interface GalleryProps {
  gallery?: GalleryItem[];
  onGalleryUpdate?: () => void; // Callback to refresh profile data
}

const Gallery: React.FC<GalleryProps> = ({ gallery = [], onGalleryUpdate }) => {
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [showEditGallery, setShowEditGallery] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    description: "",
    file: null as File | null,
    previewUrl: "",
  });
  const [editGalleryItem, setEditGalleryItem] = useState({
    title: "",
    description: "",
    file: null as File | null,
    previewUrl: "",
    currentImageUrl: "",
  });
  const items = React.useMemo(
    () =>
      (gallery || []).filter(
        (item) =>
          item &&
          item.id &&
          item.url &&
          item.url.trim() !== "" &&
          item.title &&
          item.title.trim() !== ""
      ),
    [gallery]
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const axios = useAxios();
  const { showToast } = useToast();

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (newGalleryItem.previewUrl) {
        URL.revokeObjectURL(newGalleryItem.previewUrl);
      }
      if (editGalleryItem.previewUrl) {
        URL.revokeObjectURL(editGalleryItem.previewUrl);
      }
    };
  }, [newGalleryItem.previewUrl, editGalleryItem.previewUrl]);

  // Image compression function
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // 1MB max size
      maxWidthOrHeight: 1920, // Max width or height
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Image compression failed:", error);
      // Return original file if compression fails
      return file;
    }
  };

  // Handle file selection for new gallery item
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: "Please select an image file",
      });
      return;
    }

    // Validate file size (10MB limit before compression)
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "Image must be less than 10MB",
      });
      return;
    }

    setImageUploading(true);

    try {
      // Compress the image
      const compressedFile = await compressImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile);

      setNewGalleryItem((prev) => ({
        ...prev,
        file: compressedFile,
        previewUrl,
      }));
    } catch (error) {
      console.error("Failed to process image:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to process image",
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Handle file selection for editing gallery item
  const handleEditFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: "Please select an image file",
      });
      return;
    }

    // Validate file size (10MB limit before compression)
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "Image must be less than 10MB",
      });
      return;
    }

    setImageUploading(true);

    try {
      // Compress the image
      const compressedFile = await compressImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile);

      setEditGalleryItem((prev) => ({
        ...prev,
        file: compressedFile,
        previewUrl,
      }));
    } catch (error) {
      console.error("Failed to process image:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to process image",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddGalleryItem = async () => {
    if (!newGalleryItem.file) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please select an image",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", newGalleryItem.title.trim() || "Untitled");
      formData.append("description", newGalleryItem.description.trim());
      formData.append("image", newGalleryItem.file);

      const response = await axios.post(
        "/api/profile/gallery/upload",
        formData
      );

      if (response.status !== 201) {
        throw new Error(
          response.data?.message ||
            `Upload failed with status ${response.status}`
        );
      }

      // Reset form and close modal
      setNewGalleryItem({
        title: "",
        description: "",
        file: null,
        previewUrl: "",
      });
      setShowAddGallery(false);

      // Reset form and close modal
      setNewGalleryItem({
        title: "",
        description: "",
        file: null,
        previewUrl: "",
      });
      setShowAddGallery(false);

      // Clean up preview URL
      if (newGalleryItem.previewUrl) {
        URL.revokeObjectURL(newGalleryItem.previewUrl);
      }

      showToast({
        type: "success",
        title: "Success",
        message: "Gallery item added successfully",
      });

      // Refresh profile data
      if (onGalleryUpdate) {
        onGalleryUpdate();
      }
    } catch (error: unknown) {
      console.error("Failed to add gallery item:", error);
      showToast({
        type: "error",
        title: "Error",
        message: (error as Error).message || "Failed to add gallery item",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!submitLoading) {
      // Clean up preview URL
      if (newGalleryItem.previewUrl) {
        URL.revokeObjectURL(newGalleryItem.previewUrl);
      }
      setNewGalleryItem({
        title: "",
        description: "",
        file: null,
        previewUrl: "",
      });
      setShowAddGallery(false);
    }
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingItem(item.id);
    setEditGalleryItem({
      title: item.title,
      description: item.description,
      file: null,
      previewUrl: "",
      currentImageUrl: item.url,
    });
    setShowEditGallery(true);
  };

  const handleUpdateGalleryItem = async (id: string) => {
    try {
      setSubmitLoading(true);

      if (editGalleryItem.file) {
        // Upload new image
        const formData = new FormData();
        formData.append("title", editGalleryItem.title.trim() || "Untitled");
        formData.append("description", editGalleryItem.description.trim());
        formData.append("image", editGalleryItem.file);

        // const response = await fetch(
        //   `/api/profile/gallery/update?itemId=${id}`,
        //   {
        //     method: "PATCH",
        //     body: formData,
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     },
        //   }
        // );
        const response = await axios.patch(
          `/api/profile/gallery/update?itemId=${id}`,
          formData
        );
        if (response.status !== 200) {
          throw new Error(
            response.data?.message ||
              `Update failed with status ${response.status}`
          );
        }
      } else {
        // Update only title and description
        await axios.patch(`/api/profile/gallery/update?itemId=${id}`, {
          title: editGalleryItem.title.trim() || "Untitled",
          description: editGalleryItem.description.trim(),
        });
      }

      // Reset form and close modal
      setEditingItem(null);
      // Clean up preview URL
      if (editGalleryItem.previewUrl) {
        URL.revokeObjectURL(editGalleryItem.previewUrl);
      }
      setEditGalleryItem({
        title: "",
        description: "",
        file: null,
        previewUrl: "",
        currentImageUrl: "",
      });
      setShowEditGallery(false);

      showToast({
        type: "success",
        title: "Success",
        message: "Gallery item updated successfully",
      });

      // Refresh profile data
      if (onGalleryUpdate) {
        onGalleryUpdate();
      }
    } catch (error: unknown) {
      console.error("Failed to update gallery item:", error);
      showToast({
        type: "error",
        title: "Error",
        message: (error as Error).message || "Failed to update gallery item",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRemoveGalleryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) {
      return;
    }

    try {
      setSubmitLoading(true);
      await axios.delete(`/api/profile/gallery?itemId=${id}`);
      showToast({
        type: "success",
        title: "Success",
        message: "Gallery item deleted successfully",
      });
      // Refresh profile data
      if (onGalleryUpdate) {
        onGalleryUpdate();
      }
    } catch (error: unknown) {
      console.error("Failed to delete gallery item:", error);
      showToast({
        type: "error",
        title: "Error",
        message:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to delete gallery item",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditModalClose = () => {
    if (!submitLoading) {
      setEditingItem(null);
      // Clean up preview URL
      if (editGalleryItem.previewUrl) {
        URL.revokeObjectURL(editGalleryItem.previewUrl);
      }
      setEditGalleryItem({
        title: "",
        description: "",
        file: null,
        previewUrl: "",
        currentImageUrl: "",
      });
      setShowEditGallery(false);
    }
  };

  return (
    <>
      {/* Add Gallery Modal */}
      <Modal
        isOpen={showAddGallery}
        onClose={handleModalClose}
        title="Add New Gallery Item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *
            </label>
            <div className="space-y-4">
              {/* File input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload area */}
              {!newGalleryItem.previewUrl ? (
                <div
                  onClick={() =>
                    !imageUploading && fileInputRef.current?.click()
                  }
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
                    imageUploading
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-orange-500"
                  }`}
                >
                  {imageUploading ? (
                    <div className="w-12 h-12 mx-auto mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-gray-600 mb-2">
                    {imageUploading
                      ? "Processing image..."
                      : "Click to upload an image"}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={newGalleryItem.previewUrl}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(newGalleryItem.previewUrl);
                      setNewGalleryItem((prev) => ({
                        ...prev,
                        file: null,
                        previewUrl: "",
                      }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-2 left-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="Enter item title (optional)"
              value={newGalleryItem.title}
              onChange={(e) =>
                setNewGalleryItem({ ...newGalleryItem, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={newGalleryItem.description}
              onChange={(e) =>
                setNewGalleryItem({
                  ...newGalleryItem,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleAddGalleryItem}
              disabled={submitLoading || imageUploading || !newGalleryItem.file}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>Add Item</span>
            </button>
            <button
              onClick={handleModalClose}
              disabled={submitLoading || imageUploading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Gallery Modal */}
      <Modal
        isOpen={showEditGallery}
        onClose={handleEditModalClose}
        title="Edit Gallery Item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              placeholder="Enter item title (optional)"
              value={editGalleryItem.title}
              onChange={(e) =>
                setEditGalleryItem({
                  ...editGalleryItem,
                  title: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={editGalleryItem.description}
              onChange={(e) =>
                setEditGalleryItem({
                  ...editGalleryItem,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="space-y-4">
              {/* File input */}
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleEditFileSelect}
                className="hidden"
              />

              {/* Current or preview image */}
              {editGalleryItem.previewUrl || editGalleryItem.currentImageUrl ? (
                <div className="relative">
                  <Image
                    src={
                      editGalleryItem.previewUrl ||
                      editGalleryItem.currentImageUrl
                    }
                    alt="Current image"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {editGalleryItem.previewUrl && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      New Image
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  {editGalleryItem.previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(editGalleryItem.previewUrl);
                        setEditGalleryItem((prev) => ({
                          ...prev,
                          file: null,
                          previewUrl: "",
                        }));
                      }}
                      className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onClick={() =>
                    !imageUploading && editFileInputRef.current?.click()
                  }
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
                    imageUploading
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-orange-500"
                  }`}
                >
                  {imageUploading ? (
                    <div className="w-12 h-12 mx-auto mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-gray-600 mb-2">
                    {imageUploading
                      ? "Processing image..."
                      : "Click to upload a new image"}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() =>
                editingItem && handleUpdateGalleryItem(editingItem)
              }
              disabled={submitLoading || imageUploading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>Update Item</span>
            </button>
            <button
              onClick={handleEditModalClose}
              disabled={submitLoading || imageUploading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Work Gallery</h2>
          <button
            onClick={() => setShowAddGallery(true)}
            disabled={submitLoading}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No gallery items yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start building your work gallery by adding your first item.
            </p>
            <button
              onClick={() => setShowAddGallery(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items
              .filter(
                (item) => item && item.id && item.url && item.url.trim() !== ""
              )
              .map((item) => (
                <div key={item.id} className="relative group">
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.url}
                      alt={item.title || "Gallery item"}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.warn("Image failed to load:", item.url);
                        // Hide the broken image container
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                      {item.description || ""}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditGalleryItem(item)}
                      disabled={submitLoading}
                      className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveGalleryItem(item.id)}
                      disabled={submitLoading}
                      className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
