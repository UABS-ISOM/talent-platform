/**
 * Rules to validate form values.
 */
export const RULES = {
  required: (v: string) => (v && v.length > 0) || "This is required.",
};

/**
 * Sets the web page title.
 * @param title The title to set.
 */
export const setTitle = (title: string) => {
  document.title = `${title} - ${import.meta.env.VITE_APP_NAME}`;
};

export const GENERIC_ERROR =
  "An error occurred. Please check your connection and try again later.";

export const APP_NAME = import.meta.env.VITE_APP_NAME;

/**
 * Returns a user-friendly error message.
 * @param error The error to check.
 * @returns The error message to display.
 */
export const getErrorMessage = (error: any) => {
  if (error.message && error.message !== "Failed to fetch")
    return error.message;

  return GENERIC_ERROR;
};

/**
 * Formats a time difference ms to a human-readable string.
 * @param timeDiff The time difference in milliseconds.
 * @returns The formatted time difference.
 */
export const formatTimeDiff = (timeDiff: number) => {
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  if (months < 12) return `${months}mo`;
  return `${years}y`;
};
