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
