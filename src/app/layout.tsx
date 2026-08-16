import type { Metadata, Viewport } from "next";
import { Manrope, Nunito, Inter } from "next/font/google";
import Providers from "./providers";
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
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://litmustest.in"),
  title: {
    default: "Litmus | Certified Food Testing & NABL Laboratory Services",
    template: "%s | Litmus Food Testing",
  },
  description:
    "Book certified food testing services from accredited NABL laboratories. Fast turnaround, comprehensive nutritional analysis, safety certifications, and expert consultations.",
  keywords: [
    "food testing",
    "NABL accredited lab",
    "nutritional analysis",
    "FSSAI compliance",
    "food safety testing",
    "microbiology testing",
    "chemical food analysis",
    "shelf life study",
  ],
  authors: [{ name: "Litmus Food Analytics" }],
  creator: "Litmus Food Analytics",
  publisher: "Litmus",
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
  openGraph: {
    title: "Litmus - NABL Certified Food Testing Labs",
    description:
      "Find certified laboratories for food quality testing, nutritional profiling, pesticide residue analysis, and FSSAI compliance.",
    type: "website",
    locale: "en_IN",
    siteName: "Litmus",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Litmus Food Testing Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Litmus - NABL Certified Food Testing Labs",
    description:
      "Certified laboratory food testing, quick turnaround, and regulatory compliance reports.",
    creator: "@LitmusTest",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
      <body
        className="font-sans antialiased bg-background text-foreground selection:bg-brand-primary selection:text-white"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
