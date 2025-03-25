import type { Metadata } from "next";
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

import { QueryProvider } from './_components/providers';
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
