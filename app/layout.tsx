import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
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
  title: "J. R. Claxton",
  description: "Chef, writer, father.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body className="bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
  <Navbar />
  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
  
  <div className="max-w-4xl mx-auto px-4">
    {children}
  </div>
</body>
    </html>
  );
}
