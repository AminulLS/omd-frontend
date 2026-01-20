import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthAPI } from "@/lib/services/auth.api";

export function useRouteProtection() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setUser, setAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth/");

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isDashboardRoute && !isAuthRoute) {
        setShouldRender(true);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      setShouldRender(false);

      if (isAuthenticated && isAuthRoute) {
        router.push("/dashboard");
        return;
      }

      if (isAuthenticated && isDashboardRoute) {
        setShouldRender(true);
        setIsChecking(false);
        return;
      }

      if (isDashboardRoute) {
        try {
          await AuthAPI.getCsrfCookie();
          const user = await AuthAPI.getUser();
          setUser(user);
          setShouldRender(true);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setAuthenticated(false);
          router.push("/auth/login");
        } finally {
          setIsChecking(false);
        }
      } else if (isAuthRoute) {
        setShouldRender(true);
        setIsChecking(false);
      }
    };

    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isAuthenticated, isDashboardRoute, isAuthRoute]);

  return { isChecking, shouldRender, isDashboardRoute };
}
