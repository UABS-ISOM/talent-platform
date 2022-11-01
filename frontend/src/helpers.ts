/**
 * Rules to validate form values.
 */
export const RULES = {
  required: (v: string) => (v && v.length > 0) || "This is required.",
};

export const GENERIC_ERROR =
  "An error occurred. Please check your connection and try again later.";

export const APP_NAME = import.meta.env.VITE_APP_NAME;
