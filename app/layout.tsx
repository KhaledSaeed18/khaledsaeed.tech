import type { Metadata, Viewport } from "next"
import { Hanken_Grotesk, Geist, JetBrains_Mono } from "next/font/google"

import { ViewTransition } from "react"

import "./globals.css"
import { ConsoleProof } from "@/components/console-proof"
import { KeyboardLayer } from "@/components/keys/keyboard-layer"
import { PrintResume } from "@/components/print/print-resume"
import { PersonJsonLd } from "@/components/person-json-ld"
import { RevealObserver } from "@/components/print/reveal-observer"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteRoutes } from "@/lib/routes"
import { siteConfig, siteIdentity, socialLinks } from "@/lib/site"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontHeading = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteIdentity} | ${siteConfig.role}`,
    template: `%s | ${siteIdentity}`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    siteConfig.username,
    "full-stack engineer",
    "backend engineer",
    "open-source developer",
    "TypeScript",
    "Node.js",
    "NestJS",
    "system design",
    "multi-tenant architecture",
    "developer tools",
    "Swift",
    "macOS apps",
    "Lebanon software engineer",
    "software engineer portfolio",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/writing/rss.xml",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteIdentity} | ${siteConfig.role}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteIdentity} | ${siteConfig.role}`,
    description: siteConfig.description,
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
}

export const viewport: Viewport = {
  themeColor: "#1A1715",
  colorScheme: "dark",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "dark",
        "antialiased",
        fontSans.variable,
        fontHeading.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body>
        <a
          href="#content"
          className="sr-only z-[60] bg-background px-3 py-2 font-mono text-xs focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          skip to content
        </a>
        <TooltipProvider>
          <SiteHeader />
          <ViewTransition default="page">
            <main id="content">{children}</main>
          </ViewTransition>
          <SiteFooter />
        </TooltipProvider>
        {/* the frame rails, top to bottom */}
        <div aria-hidden="true" className="rails" />
        <ConsoleProof />
        <KeyboardLayer
          routes={await siteRoutes()}
          email={socialLinks.find((l) => l.key === "email")!.handle}
          bookingUrl={siteConfig.bookingUrl}
        />
        <PrintResume />
        <RevealObserver />
        <PersonJsonLd />
      </body>
    </html>
  )
}
