"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingCart, TrendingUp, LayoutDashboard } from "lucide-react";

/**
 * Global Bottom Navigation for mobile-first user experience.
 * Highlighting the current active route and following project styling.
 */
export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", href: "/dashboard/inventory", icon: Package },
    { label: "Sell", href: "/dashboard/sell", icon: ShoppingCart },
    { label: "Stock", href: "/dashboard/stock", icon: TrendingUp },
  ];

  // Only show navigation on dashboard-related routes
  if (!pathname?.startsWith("/dashboard")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive 
                  ? "text-primary font-bold" 
                  : "text-neutral-500 dark:text-neutral-500"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : "scale-100"} transition-transform`} />
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
