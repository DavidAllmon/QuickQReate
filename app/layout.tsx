import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickQReate",
  description: "Create customizable QR codes for URLs, contact information, Wi-Fi networks, and more with ease.",
  openGraph: {
    title: "QuickQReate - QR Code Generator",
    description: "Create customizable QR codes for URLs, contact information, Wi-Fi networks, and more with ease.",
    images: [
      {
        url: "/qricon.png",
        width: 1200,
        height: 630,
        alt: "QuickQReate - QR Code Generator",
      },
    ],
    url: "/",
    siteName: "QuickQReate",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickQReate - QR Code Generator",
    description: "Create customizable QR codes for URLs, contact information, Wi-Fi networks, and more with ease.",
    images: ["/qricon.png"],
    creator: "@YourTwitterHandle",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/qricon.png", type: "image/png" },
    ],
    apple: "/qricon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900`}
      >
        {children}
      </body>
    </html>
  );
}
