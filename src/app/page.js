import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/ui/components/theme-toggle";
import { Clock } from "@/ui/components/clock";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      {/* Top Navigation / Controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <ThemeToggle />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        {/* Welcome Header */}
        <p className="mb-4 text-sm font-medium tracking-[0.2em] uppercase text-primary/80">
          Welcome
        </p>

        {/* Branding Section */}
        <div className="relative mb-8 flex flex-col items-center">
          <div className="absolute inset-0 -z-10 animate-pulse bg-primary/5 blur-3xl rounded-full" />
          <Image
            src="/OP IMG.png"
            alt="Organic Precisions Logo"
            width={120}
            height={120}
            className="rounded-2xl shadow-lg border border-primary/10 mb-6"
            priority
          />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2 bg-gradient-to-br from-primary to-green-600 bg-clip-text text-transparent">
            Organic Precisions
          </h1>
          <p className="text-xl md:text-2xl font-light text-neutral-600 dark:text-neutral-400 italic">
            Back to Eden
          </p>
        </div>

        {/* Dynamic Clock Section */}
        <div className="mt-8 p-6 rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-sm shadow-inner">
          <Clock />
        </div>

        {/* Navigation Section */}
        <div className="mt-12">
          <Link
            href="/dashboard/sell"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            Go to Shop
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Call to Action or Footer Info */}
        <div className="mt-16 max-w-lg mx-auto">
          <div className="h-px w-24 bg-primary/20 mx-auto mb-8" />
          <p className="text-sm text-neutral-500 dark:text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Professional shop management and organic product optimization.
          </p>
        </div>
      </main>

      {/* Subtle Bottom Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50" />
    </div>
  );
}
