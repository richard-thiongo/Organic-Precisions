"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

const ROUTES = [
  "/dashboard",
  "/dashboard/inventory",
  "/dashboard/sell",
  "/dashboard/stock",
];

export function SwipeNavigation({ children, className }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Touch state
  const touchStart = React.useRef(null);
  const touchEnd = React.useRef(null);

  // Minimum swipe distance (in px)
  const MIN_SWIPE_DISTANCE = 50;

  const onTouchStart = (e) => {
    touchEnd.current = null; // Reset touch end
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchMove = (e) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    // Only apply logic if we are within the dashboard pages
    const currentIndex = ROUTES.indexOf(pathname);
    if (currentIndex === -1) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isLeftSwipe = distanceX > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distanceX < -MIN_SWIPE_DISTANCE;
    
    // If it's more of a vertical scroll than horizontal swipe, ignore
    if (Math.abs(distanceY) > Math.abs(distanceX)) {
      return;
    }

    if (isLeftSwipe && currentIndex < ROUTES.length - 1) {
      // Swipe left -> go to next route
      router.push(ROUTES[currentIndex + 1]);
    } else if (isRightSwipe && currentIndex > 0) {
      // Swipe right -> go to previous route
      router.push(ROUTES[currentIndex - 1]);
    }
  };

  return (
    <main
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={className}
    >
      {children}
    </main>
  );
}
