import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
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
  title: "QualityReview — ISO/IEC 9126",
  description:
    "Website review kualitas aplikasi dan website berdasarkan standar ISO/IEC 9126. Dukung review manual dan AI (DeepSeek V4 Flash) dengan database Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col text-slate-900">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <footer className="relative z-10 border-t border-white/50 bg-white/50 py-6 text-center text-xs text-slate-500 backdrop-blur-md print:hidden">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            QualityReview · ISO/IEC 9126 · Manual & AI (DeepSeek V4 Flash) ·
            Supabase
          </span>
        </footer>
      </body>
    </html>
  );
}
