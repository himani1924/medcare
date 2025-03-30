import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";
import { AuthProvider } from "./api/auth/authContext";
import LayoutContent from "@/components/LayoutContent";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mont",
});

export const metadata: Metadata = {
  title: "Medcare",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <AuthProvider>
          <ToastProvider />
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
