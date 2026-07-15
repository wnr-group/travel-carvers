import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { SITE, createMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Lets all child pages use relative image/canonical URLs that resolve to absolute.
  metadataBase: new URL(SITE.url),
  // Sensible site-wide defaults (OpenGraph, Twitter, canonical, robots); each page overrides.
  ...createMetadata({ path: "/" }),
  icons: {
    icon: [{ url: "/logo.png", sizes: "any", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-darkest focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-dark"
        >
          Skip to main content
        </a>
        <StoreProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
