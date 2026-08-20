import { Alert } from "react-native";

/**
 * Clerk returns errors as objects rather than thrown exceptions, and the shape
 * differs slightly between the API errors and thrown runtime errors. This pulls
 * the most useful human-readable message out of either.
 */
type ClerkErrorLike = {
  message?: string;
  longMessage?: string;
  errors?: { message?: string; longMessage?: string }[];
};

const FALLBACK = "Something went wrong. Please try again.";

export function authErrorMessage(error: unknown): string {
  if (!error) return FALLBACK;

  const clerkError = error as ClerkErrorLike;
  const first = clerkError.errors?.[0];

  return (
    first?.longMessage ??
    first?.message ??
    clerkError.longMessage ??
    clerkError.message ??
    FALLBACK
  );
}

/** Shows a Clerk error in a native alert, so no screen layout has to change. */
export function showAuthError(error: unknown, title = "Something went wrong") {
  Alert.alert(title, authErrorMessage(error));
}
