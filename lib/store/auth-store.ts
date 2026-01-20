import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthAPI, type User } from "@/lib/services/auth.api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  setUser: (user: User) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      },

      setAuthenticated: (isAuth: boolean) => {
        set({ isAuthenticated: isAuth, isLoading: false });
        if (!isAuth) {
          set({ user: null });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: async (): Promise<boolean> => {
        const currentState = get();

        if (currentState.isInitialized && currentState.isAuthenticated && currentState.user) {
          return true;
        }

        set({ isLoading: true });

        try {
          const user = await AuthAPI.getUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
          return true;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          try {
            await AuthAPI.getCsrfCookie();
          } catch (csrfError) {
            console.error("CSRF cookie fetch failed:", csrfError);
          }

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    useAuthStore.getState().logout();
  });
}
