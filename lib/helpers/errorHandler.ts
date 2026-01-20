import { AxiosError } from "axios";
import { toast } from "sonner";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export function handleApiError(error: AxiosError<ApiErrorResponse>) {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:unauthorized"));
        }
        toast.error(data?.message || "Unauthorized. Please login again.");
        break;

      case 403:
        toast.error(data?.message || "You don't have permission to perform this action.");
        break;

      case 404:
        toast.error(data?.message || "Resource not found.");
        break;

      case 422:
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0]?.[0];
          toast.error(firstError || data?.message || "Validation failed.");
        } else {
          toast.error(data?.message || "Validation failed.");
        }
        break;

      case 429:
        toast.error("Too many requests. Please try again later.");
        break;

      case 500:
      case 502:
      case 503:
        toast.error("Server error. Please try again later.");
        break;

      default:
        toast.error(data?.message || "An error occurred. Please try again.");
    }
  } else if (error.request) {
    toast.error("Network error. Please check your connection.");
  } else {
    toast.error("An unexpected error occurred.");
  }
}
