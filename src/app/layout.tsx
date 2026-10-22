import type { Metadata, Viewport } from "next";
import { Manrope, Nunito, Inter } from "next/font/google";
import Providers from "./providers";
import { AnalyticsHead, AnalyticsNoScript, AnalyticsRouteTracking } from "@/components/seo/Analytics";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#00751F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Litmus Labs | Food Testing Lab in India | NABL & FSSAI",
    // Page titles already end with their own "| Litmus Labs" suffix.
    template: "%s",
  },
  description:
    "Litmus Labs offers NABL accredited food, water & agri testing across India, including Chennai & Kochi. FSSAI-approved reports & up to 15% off.",
  keywords: [
    "food testing lab in India",
    "NABL accredited lab",
    "FSSAI food testing",
    "food testing Chennai",
    "food testing Kochi",
    "water testing",
    "pesticide residue testing",
    "heavy metal testing",
    "microbiology testing",
    "shelf life study",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "QU0PyDjeVxtTQXn7F6sfkvXF00Wb6ov9EHyxtjw55K0",
  },
  openGraph: {
    title: "Litmus Labs | Food Testing Lab in India | NABL & FSSAI",
    description:
      "NABL accredited food, water & agri testing across India, including Chennai & Kochi. FSSAI-approved reports.",
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Litmus Labs | Food Testing Lab in India | NABL & FSSAI",
    description:
      "NABL accredited food, water & agri testing across India, including Chennai & Kochi. FSSAI-approved reports.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon_io/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon_io/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon_io/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon_io/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon_io/favicon-32x32.png",
  },
  manifest: "/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${nunito.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <AnalyticsHead />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground selection:bg-brand-primary selection:text-white"
        suppressHydrationWarning
      >
        <AnalyticsNoScript />
        <Providers>{children}</Providers>
        <AnalyticsRouteTracking />
      </body>
    </html>
  );
}
