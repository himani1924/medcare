"use client";

import { useAuth } from "../app/api/auth/authContext";
import Navbar from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const guestPages = ["/", "/admin/login", "/admin/signup"];
  const authRestrictedPages = ["/admin/login", "/admin/signup"];

  useEffect(() => {
    if (!loading) {
      if (!user && !guestPages.includes(pathname)) {
        toast.error("Login first");
        router.push("/");
      } else if (user && authRestrictedPages.includes(pathname)) {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) return <p>Loading...</p>;

  if (!user && !guestPages.includes(pathname)) return null;

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default LayoutContent;
