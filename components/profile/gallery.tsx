import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { GalleryItem } from "@/lib/types/profile.types";
import useAxios from "@/hooks/use-axios";
import { useToast } from "@/components/ui/ToastProvider";

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
    url: "",
  });
  const [editGalleryItem, setEditGalleryItem] = useState({
    title: "",
    description: "",
    url: "",
  });
  const [items, setItems] = useState<GalleryItem[]>(gallery);
  const [submitLoading, setSubmitLoading] = useState(false);
  const axios = useAxios();
  const { showToast } = useToast();

  // Update items when gallery props change
  useEffect(() => {
    setItems(gallery);
  }, [gallery]);

  const handleAddGalleryItem = async () => {
    if (!newGalleryItem.title.trim() || !newGalleryItem.url.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Title and URL are required",
      });
      return;
    }

    try {
      setSubmitLoading(true);
      await axios.post("/api/profile/gallery", {
        title: newGalleryItem.title.trim(),
        description: newGalleryItem.description.trim(),
        url: newGalleryItem.url.trim(),
      });

      // Reset form and close modal
      setNewGalleryItem({ title: "", description: "", url: "" });
      setShowAddGallery(false);

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
        message:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to add gallery item",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!submitLoading) {
      setNewGalleryItem({ title: "", description: "", url: "" });
      setShowAddGallery(false);
    }
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingItem(item.id);
    setEditGalleryItem({
      title: item.title,
      description: item.description,
      url: item.url,
    });
    setShowEditGallery(true);
  };

  const handleUpdateGalleryItem = async (id: string) => {
    if (!editGalleryItem.title || !editGalleryItem.url) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Title and URL are required",
      });
      return;
    }

    try {
      setSubmitLoading(true);
      await axios.patch(`/api/profile/gallery?itemId=${id}`, {
        title: editGalleryItem.title.trim(),
        description: editGalleryItem.description.trim(),
        url: editGalleryItem.url.trim(),
      });

      // Reset form and close modal
      setEditingItem(null);
      setEditGalleryItem({ title: "", description: "", url: "" });
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
        message:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to update gallery item",
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
      setEditGalleryItem({ title: "", description: "", url: "" });
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
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter item title"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={newGalleryItem.url}
              onChange={(e) =>
                setNewGalleryItem({ ...newGalleryItem, url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleAddGalleryItem}
              disabled={submitLoading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>Add Item</span>
            </button>
            <button
              onClick={handleModalClose}
              disabled={submitLoading}
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
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter item title"
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
              Image URL *
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={editGalleryItem.url}
              onChange={(e) =>
                setEditGalleryItem({ ...editGalleryItem, url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() =>
                editingItem && handleUpdateGalleryItem(editingItem)
              }
              disabled={submitLoading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>Update Item</span>
            </button>
            <button
              onClick={handleEditModalClose}
              disabled={submitLoading}
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
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={300}
                    height={192}
                    className="w-full h-48 object-cover"
                    priority
                  />
                </div>

                <div className="mt-3">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
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
