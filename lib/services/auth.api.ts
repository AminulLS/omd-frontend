import api, { authApi } from "@/lib/config/axios";
import { API_ROUTES } from "@/lib/config/api";

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface Role {
  id: string;
  key: string;
  name: string;
  abilities: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface WhoAmIResponse {
  data: User;
}

export interface LoginResponse {
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export class AuthAPI {
  static async getCsrfCookie(): Promise<void> {
    await api.get(API_ROUTES.csrfCookie);
  }
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.getCsrfCookie();

    const response = await authApi.post(API_ROUTES.login, credentials);
    return response.data;
  }

  static async logout(): Promise<void> {
    await authApi.post(API_ROUTES.logout);
  }

  static async getUser(): Promise<User> {
    const response = await api.get<WhoAmIResponse>(API_ROUTES.whoami);
    return response.data.data;
  }

  static async register(userData: { name: string; email: string; password: string; password_confirmation: string }): Promise<LoginResponse> {
    await this.getCsrfCookie();
    const response = await authApi.post(API_ROUTES.register, userData);
    return response.data;
  }

  static async verifyAuth(): Promise<boolean> {
    try {
      await this.getUser();
      return true;
    } catch {
      return false;
    }
  }
}
