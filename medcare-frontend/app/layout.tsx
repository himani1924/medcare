import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ToastProvider from '@/components/ToastProvider';
import "./globals.css";
import { Session } from "next-auth";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ['300', "400", "500", "600", "700"] ,
  variable: "--font-mont"
})

export const metadata: Metadata = {
  title: "Medcare",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <SessionProviderWrapper session={session}>
      <ToastProvider />
        <Navbar/>
        {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
