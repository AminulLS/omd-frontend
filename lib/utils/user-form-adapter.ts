import type { UserFormData, ExtendedUserFormData, User, UserWithRoles } from "@/lib/types/users";
import { isUserWithRoles } from "@/lib/types/users";

/**
 * Adapts extended form data to API format
 * Only includes fields that the API currently supports
 * When API adds support for more fields, update this function
 */
export function adaptFormDataToApi(formData: ExtendedUserFormData): UserFormData {
  const apiData: UserFormData = {
    name: formData.name,
    email: formData.email,
    status: formData.status,
    type: formData.type,
    roles: formData.roles,
  };

  // Only include password if it's provided and not empty
  if (formData.password && formData.password.trim() !== "") {
    apiData.password = formData.password;
  }

  // ========================================
  // FUTURE: When API supports these fields, uncomment and adapt:
  // ========================================

  // if (formData.phone || formData.department || formData.location || formData.avatarUrl || formData.bio) {
  //   apiData.profile = {
  //     phone: formData.phone,
  //     department: formData.department,
  //     location: formData.location,
  //     avatarUrl: formData.avatarUrl,
  //     bio: formData.bio,
  //   };
  // }

  // if (formData.twoFactorEnabled !== undefined) {
  //   apiData.security = {
  //     twoFactorEnabled: formData.twoFactorEnabled,
  //   };
  // }

  // if (formData.emailNotifications !== undefined || formData.pushNotifications !== undefined || formData.theme) {
  //   apiData.preferences = {
  //     emailNotifications: formData.emailNotifications,
  //     pushNotifications: formData.pushNotifications,
  //     theme: formData.theme,
  //     language: "en",
  //   };
  // }

  return apiData;
}

/**
 * Adapts API user data to extended form format
 * Fills in all form fields from the user object
 */
export function adaptUserToFormData(user: User | UserWithRoles): ExtendedUserFormData {
  return {
    // Core fields
    name: user.name,
    email: user.email,
    password: "", // Never populate password from API
    status: user.status || "active",
    type: user.type || "partner",
    roles: isUserWithRoles(user) ? user.roles.map((r) => r.id) : [],

    // Extended fields from profile (if available)
    phone: user.profile?.phone || "",
    department: user.profile?.department || "",
    location: user.profile?.location || "",
    avatarUrl: user.profile?.avatarUrl || "",
    bio: user.profile?.bio || "",

    // Extended fields from security (if available)
    twoFactorEnabled: user.security?.twoFactorEnabled || false,

    // Extended fields from preferences (if available)
    emailNotifications: user.preferences?.emailNotifications ?? true,
    pushNotifications: user.preferences?.pushNotifications ?? false,
    theme: user.preferences?.theme || "system",
  };
}

/**
 * Validates form data
 * Returns object with field errors
 */
export function validateUserForm(formData: ExtendedUserFormData, isEditing: boolean): Record<string, string> {
  const errors: Record<string, string> = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (formData.name.length > 255) {
    errors.name = "Name is too long";
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email address";
  }

  // Password validation (only required for new users)
  if (!isEditing) {
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
  } else if (formData.password && formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Phone validation (optional, but if provided must be valid)
  if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
    errors.phone = "Invalid phone number format";
  }

  // Roles validation
  if (formData.roles.length === 0) {
    errors.roles = "At least one role is required";
  }

  return errors;
}
