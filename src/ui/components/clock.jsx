"use client";

import * as React from "react";

/**
 * A real-time clock component that displays the current time.
 * Styled to match the Organic Precisions theme.
 */
export function Clock() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center font-mono text-2xl font-bold tracking-widest text-primary">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}
