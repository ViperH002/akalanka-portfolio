import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Bebas_Neue, Caveat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import { CursorGlow } from "@/components/effects/CursorGlow";
import { BackgroundEffects } from "@/components/effects/BackgroundEffects";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { PostHogProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@devcraft",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.author,
      alternateName: "Akalanka",
      jobTitle: "Senior Full Stack & FiveM Game Systems Developer",
      url: siteConfig.url,
      sameAs: [
        siteConfig.links.github,
        "https://github.com/ViperH002",
      ],
      description: siteConfig.description,
      knowsAbout: [
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "Tailwind CSS",
        "Lua",
        "FiveM Development",
        "Full Stack Development",
        "Distributed Systems",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        "@id": `${siteConfig.url}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="bg-background-primary text-content-primary antialiased selection:bg-brand-blue/30 selection:text-white relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          <CursorGlow />
          <BackgroundEffects />
          <AnalyticsTracker />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}