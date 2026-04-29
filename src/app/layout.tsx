import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EduFlow — AI-Powered Learning Platform",
    template: "%s | EduFlow",
  },
  description:
    "Master new skills with AI-powered courses. EduFlow provides personalized learning paths, AI quiz generation, and an intelligent study assistant.",
  keywords: ["online learning", "AI education", "courses", "edtech", "e-learning"],
  authors: [{ name: "EduFlow Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://eduflow.vercel.app",
    title: "EduFlow — AI-Powered Learning Platform",
    description: "Master new skills with AI-powered courses",
    siteName: "EduFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduFlow — AI-Powered Learning Platform",
    description: "Master new skills with AI-powered courses",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
