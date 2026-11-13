import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HUMANE \u2014 Connected Social-Impact Platform",
  description:
    "A unified, three-sided platform connecting Volunteers, NGOs, and CSR Partners with shared infrastructure, integrity, and trust.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Read server-only runtime environment variable (injected by Azure Container Apps)
  // Fall back to NEXT_PUBLIC_API_URL if defined, or empty string.
  const runtimeApiUrl =
    process.env.HUMANE_API_URL || process.env.NEXT_PUBLIC_API_URL || "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script
          id="humane-runtime-config"
          dangerouslySetInnerHTML={{
            __html: `window.__HUMANE_ENV__ = { apiUrl: ${JSON.stringify(runtimeApiUrl)}, NEXT_PUBLIC_API_URL: ${JSON.stringify(runtimeApiUrl)} };`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
