import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth Store to handle session management and PIN verification.
 * Tracks session expiry and authentication status globally.
 */
export const useAuthStore = create()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      sessionExpiry: null,

      // Verify the entered PIN against the expected one
      verifyPin: (pin) => {
        // In a real app, this would be a server-side check.
        // For this requirement, we use the provided PIN.
        const VALID_PIN = "1900"; 
        
        if (pin === VALID_PIN) {
          const expiry = Date.now() + 60 * 60 * 1000; // 1 hour from now
          set({ isAuthenticated: true, sessionExpiry: expiry });
          return true;
        }
        return false;
      },

      // Check if the current session is still valid
      checkSession: () => {
        const { sessionExpiry, isAuthenticated } = get();
        if (!isAuthenticated || !sessionExpiry) return false;

        const isValid = Date.now() < sessionExpiry;
        if (!isValid) {
          set({ isAuthenticated: false, sessionExpiry: null });
        }
        return isValid;
      },

      lock: () => {
        set({ isAuthenticated: false, sessionExpiry: null });
      },

      logout: () => {
        set({ isAuthenticated: false, sessionExpiry: null });
      },
    }),
    {
      name: "op-auth-storage", // Persistent storage name
    }
  )
);
