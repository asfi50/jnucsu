import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Only export image-compression (client-side safe)
export * from "./image-compression";
export * from "./blog-conversion";
export * from "./image-fallback";

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
  // Using DiceBear API for more reliable avatar generation
  const seed = encodeURIComponent(name.replace(/\s+/g, ""));
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=4f46e5&textColor=ffffff`;
}

export function generateCandidateImage(
  name: string,
  index: number = 0
): string {
  const displayText = name || `Candidate ${index + 1}`;
  const seed = encodeURIComponent(displayText.replace(/\s+/g, ""));
  // Using DiceBear API for consistent and reliable image generation
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=4f46e5`;
}

export function generateQRCode(url: string): string {
  // Using QR Server API for QR code generation
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    url
  )}`;
}

export function generatePlaceholderImage(
  width: number = 400,
  height: number = 300,
  text?: string
): string {
  const displayText = text || `${width}x${height}`;
  // Using Picsum for reliable placeholder images with fallback
  return `https://picsum.photos/${width}/${height}?random=${encodeURIComponent(
    displayText
  )}`;
}

// Utility function for highlighting search terms in text
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(
    regex,
    '<mark class="bg-orange-200 px-1 rounded">$1</mark>'
  );
}

// Create search result snippet with highlighted terms
export function createSearchSnippet(
  text: string,
  searchTerm: string,
  maxLength: number = 100
): string {
  if (!searchTerm.trim())
    return (
      text.substring(0, maxLength) + (text.length > maxLength ? "..." : "")
    );

  const lowerText = text.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);

  if (index === -1) {
    return (
      text.substring(0, maxLength) + (text.length > maxLength ? "..." : "")
    );
  }

  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, start + maxLength);
  const snippet = text.substring(start, end);

  return (
    (start > 0 ? "..." : "") +
    highlightSearchTerm(snippet, searchTerm) +
    (end < text.length ? "..." : "")
  );
}
