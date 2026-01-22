import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastCustomProvider } from "@/context/ToastContext";
import { Navbar } from "@/components/Navbar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Yu-Gi-Oh! Deck Builder",
  description: "Create and visualize your Yu-Gi-Oh! decks with Geist aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geist.variable}`} style={{ fontFamily: 'var(--font-geist)' }}>
        <ThemeProvider>
          <ToastCustomProvider>
            <Navbar />
            {children}
          </ToastCustomProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
