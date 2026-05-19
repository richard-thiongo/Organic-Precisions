import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Organic Precisions | Professional Shop Management",
  description: "Efficient management platform for organic products and professional shop operations.",
};

import { ThemeProvider } from "@/ui/providers/theme-provider";
import { SessionGuard } from "@/ui/providers/session-guard";
import { Header } from "@/ui/components/header";
import { BottomNav } from "@/ui/components/bottom-nav";
import { Toaster } from "sonner";
import { ServerWakeup } from "@/ui/components/server-wakeup";
import { SwipeNavigation } from "@/ui/components/swipe-navigation";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ServerWakeup />
        <ThemeProvider>
          <Toaster position="top-center" expand={false} richColors />
          <SessionGuard>
            <Header />
            <SwipeNavigation className="flex-1 pb-20">
              {children}
            </SwipeNavigation>
            <BottomNav />
          </SessionGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
