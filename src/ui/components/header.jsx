"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/ui/components/theme-toggle";
import { SessionLock } from "@/ui/components/session-lock";

/**
 * Global Header component providing navigation and session controls.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary font-bold text-xl group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-primary/10 group-hover:scale-105 transition-transform">
            <Image 
              src="/OP IMG.png" 
              alt="Organic Precisions Logo" 
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <span className="font-black tracking-tight text-sm sm:text-xl">Organic Precisions</span>
        </Link>

        <div className="flex items-center gap-2">
          <SessionLock />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
