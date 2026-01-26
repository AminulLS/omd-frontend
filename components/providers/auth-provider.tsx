"use client";

import { useRouteProtection } from "@/hooks/use-route-protection";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isChecking, shouldRender } = useRouteProtection();

  if (isChecking || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
