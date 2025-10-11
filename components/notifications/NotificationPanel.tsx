"use client";

import { useNotifications } from "@/context/NotificationContext";
import { Bell, CheckCheck, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  isOpen,
  onClose,
}: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "blog_comment":
        return "💬";
      case "candidate_comment":
        return "👤";
      case "message_reply":
        return "✉️";
      case "mention":
        return "@";
      default:
        return "📢";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Mobile: Full-screen overlay */}
      <div
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="fixed md:absolute inset-x-0 bottom-0 md:inset-auto md:right-0 md:top-auto md:mt-2 md:w-80 lg:w-96 bg-white md:rounded-lg shadow-lg border-t md:border border-gray-200 z-50 max-h-[85vh] md:max-h-[600px] flex flex-col rounded-t-2xl md:rounded-t-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || "#"}
                  onClick={() => {
                    markAsRead(notification.id);
                    onClose();
                  }}
                  className={`block p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="flex-shrink-0 ml-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 text-center flex-shrink-0">
            <Link
              href="/notifications"
              onClick={onClose}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
