/**
 * Image error handling and fallback utilities
 */

export const IMAGE_FALLBACKS = {
  avatar: "/images/default-avatar.svg",
  placeholder: "/images/placeholder.svg",
  candidate: "/images/default-candidate.svg",
  blog: "/images/default-blog.svg",
};

/**
 * Handle image loading errors with appropriate fallbacks
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackType: keyof typeof IMAGE_FALLBACKS = "placeholder"
) {
  const target = e.target as HTMLImageElement;
  target.src = IMAGE_FALLBACKS[fallbackType];
}

/**
 * Get a safe image URL with proper fallback
 */
export function getSafeImageUrl(
  url?: string | null,
  fallbackType: keyof typeof IMAGE_FALLBACKS = "placeholder"
): string {
  if (!url || url.trim() === "" || url.includes("unsplash.com")) {
    return IMAGE_FALLBACKS[fallbackType];
  }
  return url;
}

/**
 * Preload critical images to prevent loading issues
 */
export function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  });
}
