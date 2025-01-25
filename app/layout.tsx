import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MyBlog based on next.js",
  description: "technical blog developed with next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
