import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";

export const metadata: Metadata = {
  title: "DealHub AI",
  description: "Deal workspace and first-pass acquisition analysis",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <AppHeader />
          <main className="page-main">{children}</main>
          <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground underline">Privacy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-foreground underline">Terms</Link>
          </footer>
        </div>
      </body>
    </html>
  );
}
