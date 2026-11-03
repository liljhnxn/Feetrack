import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FeeTrack - School Fee Records Made Simple",
  description: "Lightweight and transparent on-chain school fee payment record management application powered by Botchain Testnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-charcoal-950 text-charcoal-200 antialiased selection:bg-purpleAcc-600 selection:text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

