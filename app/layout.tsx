import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import "./globals.css";

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = "https://khaledsaeed.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khaled Saeed | Software Engineer",
    template: "%s | Khaled Saeed",
  },
  description:
    "Portfolio of Khaled Saeed, a software engineer specializing in web development and open-source projects. Explore my work, skills, and contact information.",
  keywords: [
    "Khaled Saeed",
    "Software Engineer",
    "Web Developer",
    "Portfolio",
    "Open Source",
    "Lebanon",
  ],
  authors: [{ name: "Khaled Saeed", url: siteUrl }],
  creator: "Khaled Saeed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Khaled Saeed",
    title: "Khaled Saeed | Software Engineer",
    description:
      "Portfolio of Khaled Saeed, a software engineer specializing in web development and open-source projects.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khaled Saeed | Software Engineer",
    description:
      "Portfolio of Khaled Saeed, a software engineer specializing in web development and open-source projects.",
  },
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
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "45tBLB11WW_yD3_JK4qoZ6S2ZOP3g4Do",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quantico.className}>
        {children}
      </body>
    </html>
  );
}
