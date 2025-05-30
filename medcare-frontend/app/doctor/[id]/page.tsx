"use client";
import DoctorProfile from "@/components/DoctorProfile";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  gender: string;
  rating: number;
  description: string;
  profile_image: string;
  diseases: string[];
  morning_availability: string;
  evening_availability: string;
}
const Doctorpage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${API_URL}/doctors/${id}`);
        if (!res.ok) throw new Error("Failed to fetch doctor");
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) fetchDoctor();
  }, [id]);
  if (!doctor) return <p>Loading doctor details...</p>;
  return (
    <div>
      <DoctorProfile {...doctor} />
    </div>
  );
};

export default Doctorpage;
