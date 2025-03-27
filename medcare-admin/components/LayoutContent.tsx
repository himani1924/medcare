"use client"; 

import { useAuth } from "../app/api/auth/authContext";
import Navbar from "@/components/Navbar";
import Home from "@/app/page";
import { usePathname } from "next/navigation";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname()

  const publicPages = ['/login']

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      {user || publicPages.includes(pathname) ? children : (
        <Home />
        )}
      {/* {children} */}
    </div>
  );
};

export default LayoutContent;
