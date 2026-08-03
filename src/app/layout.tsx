import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Litmus - Food Testing Lab Services",
  description: "Book food testing services from certified NABL laboratories. Comprehensive food analysis, quality testing, and compliance reports.",
  openGraph: {
    title: "Litmus - Food Testing Lab Services",
    description: "Book food testing services from certified NABL laboratories.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Litmus",
    title: "Litmus - Food Testing Lab Services",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
