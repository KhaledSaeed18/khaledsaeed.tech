import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khaled Saeed",
  description: "Khaled Saeed's personal website.",
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
