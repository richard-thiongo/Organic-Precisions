"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/domain/auth/auth-store";
import { PinModal } from "@/ui/components/pin-modal";

/**
 * Session Guard component that monitors the user's session status.
 * If the session expires or is missing, it prompts for a PIN when accessing protected routes.
 */
export function SessionGuard({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, checkSession } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  // Check session on mount and periodic interval
  React.useEffect(() => {
    setMounted(true);
    checkSession();
    
    const interval = setInterval(() => {
      checkSession();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkSession]);

  if (!mounted) return null;

  // Define protected routes (e.g., anything starting with /dashboard)
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  const showModal = isDashboardRoute && !isAuthenticated;

  return (
    <>
      {children}
      {showModal && <PinModal />}
    </>
  );
}
