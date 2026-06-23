import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScratchBridge",
  description: "Transition from block-based to text-based coding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}