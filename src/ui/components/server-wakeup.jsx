"use client";

import * as React from "react";

/**
 * ServerWakeup
 * 
 * A silent, background utility that pings the backend API every 13 minutes.
 * This prevents free-tier hosting services (like Render) from putting the server
 * to sleep after 15 minutes of inactivity, ensuring the POS remains responsive.
 */
export function ServerWakeup() {
  React.useEffect(() => {
    // Ping interval: 13 minutes (in milliseconds)
    const PING_INTERVAL = 13 * 60 * 1000;
    
    // Fallback to the environment URL, otherwise assume standard API path
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://organic-precisions-api.onrender.com/api";
    // We ping the root of the API or a specific health endpoint.
    // Usually, the health check is at the root domain or `/health`. 
    // Assuming standard REST setup, let's just do a lightweight fetch to the base endpoint or health.
    const pingUrl = API_URL.replace(/\/api$/, '') + '/health'; 

    const pingServer = async () => {
      try {
        await fetch(pingUrl, { method: "GET", cache: "no-store" });
        console.log("Wake-up ping sent to server.");
      } catch (error) {
        // Silently ignore errors as this is just a wake-up ping
        console.error("Failed to ping server:", error);
      }
    };

    // Initial ping
    pingServer();

    // Set up the interval
    const intervalId = setInterval(pingServer, PING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // This component renders nothing to the UI
  return null;
}
