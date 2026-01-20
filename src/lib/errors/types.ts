/**
 * Error type definitions for the application.
 *
 * Provides consistent error handling across components with
 * type-safe error classification and recovery actions.
 */

/**
 * Supported error types for the ErrorDisplay component.
 */
export type ErrorType =
  | "network"
  | "rate-limit"
  | "no-results"
  | "validation"
  | "auth"
  | "not-found"
  | "forbidden"
  | "generic";

/**
 * Error configuration for display.
 */
export interface AppError {
  type: ErrorType;
  title: string;
  message: string;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Optional time until retry is available (for rate limits) */
  retryAfter?: number;
}

/**
 * Get default error configuration for a given error type.
 */
export function getDefaultError(type: ErrorType): Omit<AppError, "onRetry" | "retryAfter"> {
  switch (type) {
    case "network":
      return {
        type: "network",
        title: "Connection Error",
        message: "Unable to connect to the server. Please check your internet connection and try again.",
      };

    case "rate-limit":
      return {
        type: "rate-limit",
        title: "Too Many Requests",
        message: "You've made too many requests. Please wait a moment before trying again.",
      };

    case "no-results":
      return {
        type: "no-results",
        title: "No Results Found",
        message: "No relevant information was found for your question. Try rephrasing or asking about a different topic.",
      };

    case "validation":
      return {
        type: "validation",
        title: "Invalid Input",
        message: "Please check your input and try again.",
      };

    case "auth":
      return {
        type: "auth",
        title: "Session Expired",
        message: "Your session has expired. Please sign in again to continue.",
      };

    case "not-found":
      return {
        type: "not-found",
        title: "Not Found",
        message: "The requested resource could not be found.",
      };

    case "forbidden":
      return {
        type: "forbidden",
        title: "Access Denied",
        message: "You don't have permission to access this resource.",
      };

    case "generic":
    default:
      return {
        type: "generic",
        title: "Something Went Wrong",
        message: "An unexpected error occurred. Please try again.",
      };
  }
}

/**
 * Detect error type from an Error object or HTTP status code.
 */
export function detectErrorType(error: Error | number): ErrorType {
  if (typeof error === "number") {
    switch (error) {
      case 401:
        return "auth";
      case 403:
        return "forbidden";
      case 404:
        return "not-found";
      case 429:
        return "rate-limit";
      default:
        return "generic";
    }
  }

  const message = error.message.toLowerCase();

  if (message.includes("network") || message.includes("fetch") || message.includes("offline")) {
    return "network";
  }

  if (message.includes("rate") || message.includes("429")) {
    return "rate-limit";
  }

  if (message.includes("unauthorized") || message.includes("401")) {
    return "auth";
  }

  if (message.includes("forbidden") || message.includes("403")) {
    return "forbidden";
  }

  if (message.includes("not found") || message.includes("404")) {
    return "not-found";
  }

  return "generic";
}

/**
 * Create an AppError from any error source.
 */
export function createAppError(
  error: Error | number | string,
  overrides?: Partial<AppError>
): AppError {
  const type = typeof error === "string"
    ? "generic"
    : detectErrorType(error);

  const defaultError = getDefaultError(type);

  return {
    ...defaultError,
    ...(typeof error === "string" ? { message: error } : {}),
    ...overrides,
  };
}
