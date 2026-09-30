import type { Metadata } from "next";

import AppShell from "@/components/appshell";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Toyagama",
    template: "%s | Toyagama",
  },
  description: "Toyagama location finder and nearby location search.",
  icons: {
    icon: "/icuq.png",
    shortcut: "/favicon.ico",
    apple: "/icuq.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}