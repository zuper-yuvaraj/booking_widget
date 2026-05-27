import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contact IronHead Roofing",
  description: "Book your free consultation with IronHead Roofing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
