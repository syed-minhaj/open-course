import type { Metadata } from "next";
import { Geist, Geist_Mono , Nunito } from "next/font/google";
import "./globals.css";
import Providers  from "./components/Providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/app/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenCourse",
  description: "Market place for open sourse course . Course made using online resourses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=" " suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <Providers>
          <NextTopLoader/>
            {children}
            <Toaster position="top-center"  />
        </Providers>
      </body>
    </html>
  );
}
