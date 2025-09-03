import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import { AppBar } from "../components/AppBar";
import { Toaster } from "../components/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ideogram Clone - AI Content Generator",
  description: "Generate posts, templates, and images with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AppBar />
          <main className="min-h-screen pt-16">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
