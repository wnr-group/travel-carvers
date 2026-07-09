import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/redux/StoreProvider";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Travel Carvers - Explore Your Next Adventure",
  description: "Discover amazing travel destinations and packages around the world with Travel Carvers",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any", type: "image/png" },
    ],
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
