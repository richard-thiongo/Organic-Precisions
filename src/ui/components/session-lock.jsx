"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/domain/auth/auth-store";

/**
 * A button component to manually lock the session.
 * Only appears when the user is authenticated.
 */
export function SessionLock() {
  const { isAuthenticated, lock } = useAuthStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthenticated) return null;

  return (
    <button
      onClick={lock}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white p-2 text-neutral-950 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
      aria-label="Lock session"
      title="Lock Session"
    >
      <Lock className="w-5 h-5" />
    </button>
  );
}
