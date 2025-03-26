"use client"; // This must be a client component

import { useAuth } from "../app/api/auth/authContext";
import Navbar from "@/components/Navbar";
import Home from "@/app/page";
import { usePathname } from "next/navigation";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname()

  const publicPages = ['/login', '/signup']

  if (loading) return <p>Loading...</p>; // Prevents flickering

  return (
    <div>
      <Navbar />
      {user || publicPages.includes(pathname) ? children : <Home />}
    </div>
  );
};

export default LayoutContent;
