"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification, NotificationSettings } from "@/lib/types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    blogComments: true,
    candidateComments: true,
    messageReplies: true,
    mentions: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem("jnucsu_notification_settings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error("Error parsing notification settings:", error);
      }
    }

    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "blog_comment",
        title: "New comment on your blog",
        message: "Mahmuda Akter commented on 'The Future of Student Leadership'",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        link: "/blog/1",
        actor: {
          id: "1",
          name: "Mahmuda Akter",
          avatar: "",
          email: "mahmuda@jnu.ac.bd"
        }
      },
      {
        id: "2",
        type: "candidate_comment",
        title: "New comment on your profile",
        message: "Rafiqul Islam commented on your candidate profile",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        link: "/candidates/1",
        actor: {
          id: "2",
          name: "Rafiqul Islam",
          avatar: "",
          email: "rafiq@jnu.ac.bd"
        }
      },
      {
        id: "3",
        type: "message_reply",
        title: "Reply to your message",
        message: "Shahida Begum replied to your message",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        link: "/messages",
        actor: {
          id: "3",
          name: "Shahida Begum",
          avatar: "",
          email: "shahida@jnu.ac.bd"
        }
      },
      {
        id: "4",
        type: "blog_comment",
        title: "New comment on your blog",
        message: "Someone commented on 'Building Stronger Communities'",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        link: "/blog/2",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("jnucsu_notification_settings", JSON.stringify(updatedSettings));
  };

  const value = {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    updateSettings,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
