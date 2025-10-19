/**
 * Utility function to handle avatar fallback
 * @param avatarUrl - The avatar URL that might be empty or null
 * @returns A valid avatar URL with fallback
 */
export function getAvatarUrl(avatarUrl?: string | null): string {
  if (!avatarUrl || avatarUrl.trim() === "") {
    return "/images/default-avatar.svg";
  }
  return avatarUrl;
}

/**
 * Error handler for Image onError events
 * Sets the src to the default avatar when image fails to load
 */
export function handleAvatarError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.target as HTMLImageElement;
  target.src = "/images/default-avatar.svg";
}
