"use client";

import ToastObserver from "@/components/ToastObserver";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <title>Grades Management System</title>
      </head>
      <body className={inter.className + " min-h-screen bg-background"}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
          <Suspense>
            <ToastObserver />
          </Suspense>
        </QueryClientProvider>
      </body>
    </html>
  );
}
