import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "60 Second Brain",
  description: "A fast 60-second focus challenge. Can you beat the score?",
  metadataBase: new URL("https://60secondbrain.com"),
  openGraph: {
    title: "60 Second Brain",
    description: "Can you beat my focus score in 60 seconds?",
    url: "https://60secondbrain.com",
    siteName: "60 Second Brain",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "60 Second Brain focus challenge",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "60 Second Brain",
    description: "Can you beat my focus score in 60 seconds?",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}