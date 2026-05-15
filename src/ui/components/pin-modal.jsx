"use client";

import * as React from "react";
import { useAuthStore } from "@/domain/auth/auth-store";
import { Lock } from "lucide-react";

/**
 * A modal component that prompts the user to enter a PIN to access the dashboard.
 * Enforces session management and provides visual feedback for incorrect entries.
 */
export function PinModal() {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState(false);
  const { verifyPin } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = verifyPin(pin);
    if (success) {
      setError(false);
      setPin("");
    } else {
      setError(true);
      setPin("");
      // Clear error after a short delay
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-950 rounded-3xl border border-primary/20 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-primary/10 mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Required</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-sm leading-relaxed">
            Please enter your 4-digit PIN to start a secure session.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className={`w-full text-center text-4xl tracking-[1em] py-4 rounded-2xl border bg-neutral-50 dark:bg-neutral-900 transition-all focus:outline-none focus:ring-2 ${
                  error 
                    ? "border-red-500 ring-red-500/20 animate-shake" 
                    : "border-neutral-200 dark:border-neutral-800 focus:ring-primary/20 focus:border-primary"
                }`}
                autoFocus
              />
              {error && (
                <p className="absolute -bottom-6 left-0 right-0 text-xs text-red-500 font-medium">
                  Invalid PIN. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              Verify & Enter
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
