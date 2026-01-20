import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthAPI, type LoginCredentials } from "@/lib/services/auth.api";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await AuthAPI.login(credentials);
      const user = await AuthAPI.getUser();
      return user;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful!");
      router.push("/dashboard");
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await AuthAPI.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);

      logout();
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}

export function useAuthCheck() {
  const { checkAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      return await checkAuth();
    },
  });
}
