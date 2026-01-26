export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export const API_PREFIX = "/api/v1";
export const BASE_URL = API_BASE_URL + API_PREFIX;

export const API_ROUTES = {
  csrfCookie: "/csrf-cookie",
  login: "/auth/login",
  logout: "/auth/logout",
  whoami: "/auth/whoami",
  register: "/auth/register",
} as const;
