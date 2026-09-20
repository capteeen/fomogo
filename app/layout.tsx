import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "fomogo — where launches become paydays",
  description:
    "Pump.fun launchpad that routes creator fees to @handles. Not affiliated with FOMO Labs.",
  icons: {
    icon: "/brand/logo-icon.png",
    apple: "/brand/logo-icon.png",
  },
  openGraph: {
    title: "fomogo",
    description: "where launches become paydays.",
    images: ["/brand/logo-wordmark.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#060510",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-void text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
