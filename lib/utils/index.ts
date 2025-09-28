import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
}

export function generateAvatar(name: string): string {
  // Use Unsplash for more realistic professional photos
  const seed = encodeURIComponent(name.replace(/\s+/g, ''));
  return `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80&auto=format&seed=${seed}`;
}

export function generateCandidateImage(name: string, index: number = 0): string {
  // Professional headshot images from Unsplash
  const imageIds = [
    'photo-1472099645785-5658abf4ff4e', // Professional male
    'photo-1494790108755-2616b612b47c', // Professional female  
    'photo-1507003211169-0a1dd7228f2d', // Professional male
    'photo-1438761681033-6461ffad8d80', // Professional female
    'photo-1500648767791-00dcc994a43e', // Professional male
    'photo-1544725176-7c40e5a71c5e', // Professional female
  ];
  
  const imageId = imageIds[index % imageIds.length];
  const seed = encodeURIComponent(name.replace(/\s+/g, ''));
  return `https://images.unsplash.com/${imageId}?w=400&h=400&fit=crop&crop=face&q=80&auto=format&seed=${seed}`;
}

export function generateQRCode(url: string): string {
  // Using QR Server API for QR code generation
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
}

export function generatePlaceholderImage(width: number = 400, height: number = 300, text?: string): string {
  const displayText = text || `${width}x${height}`;
  return `https://via.placeholder.com/${width}x${height}/4f46e5/ffffff?text=${encodeURIComponent(displayText)}`;
}