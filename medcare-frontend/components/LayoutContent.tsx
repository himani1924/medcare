"use client"; // This must be a client component

import { useAuth } from "../app/api/auth/authContext";
import Navbar from "@/components/Navbar";
import Home from "@/app/page";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Prevents flickering

  return (
    <div>
      <Navbar />
      {user ? children : <Home />}
    </div>
  );
};

export default LayoutContent;
