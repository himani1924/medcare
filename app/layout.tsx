import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
