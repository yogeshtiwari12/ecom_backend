import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientWrapper from "./components/ClientWrapper";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "A modern e-commerce application",
};

export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 

{
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable}  antialiased bg-gradient-to-br from-slate-900 via-black to-slate-900`}
        suppressHydrationWarning
      >
        <ClientWrapper>
          <Navbar />
          <main className=" min-h-screen">
            <Toaster position="top-center" richColors />
            {children}
          </main>
        </ClientWrapper>
      </body>
    </html>
  );
}
