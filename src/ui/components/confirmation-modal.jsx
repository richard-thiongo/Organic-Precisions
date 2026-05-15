"use client";

import * as React from "react";
import { AlertCircle, X, Loader2 } from "lucide-react";

/**
 * Premium Confirmation Modal for destructive actions.
 * Adheres to global themes and provides clear feedback.
 */
export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`mb-6 p-4 rounded-full ${
            variant === "danger" 
              ? "bg-red-50 dark:bg-red-500/10 text-red-500" 
              : "bg-primary/10 text-primary"
          }`}>
            <AlertCircle className="w-10 h-10" />
          </div>
          
          <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl font-bold text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              variant === "danger" 
                ? "bg-red-500 shadow-red-500/20 hover:bg-red-600" 
                : "bg-primary shadow-primary/20 hover:bg-primary-dark"
            } disabled:opacity-50`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
