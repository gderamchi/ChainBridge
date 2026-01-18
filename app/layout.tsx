import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainBridge - Elite Slate & Gold Landing",
  description: "ChainBridge - Elite Slate & Gold Landing",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans selection:bg-gold-primary selection:text-slate-dark bg-slate-dark text-[#F0F2F5] overflow-x-hidden`}
      >
        <div className="relative flex min-h-screen w-full flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}