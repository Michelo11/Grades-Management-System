import ToastObserver from "@/components/ToastObserver";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grades Management System",
  description: "Simple grades management system for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen bg-background"}>
        {children}
        <Toaster />
        <Suspense>
          <ToastObserver />
        </Suspense>
      </body>
    </html>
  );
}
