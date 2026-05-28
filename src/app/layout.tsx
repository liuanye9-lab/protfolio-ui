import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lay — Portfolio",
  description: "AI Agent UI Designer — Designing interfaces for AI Agent products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
