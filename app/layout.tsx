import type { Metadata } from "next";
import { Inter, Pacifico } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickQReate",
  description: "QR Code Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/qricon.png" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900`}>
        {children}
      </body>
    </html>
  );
}
