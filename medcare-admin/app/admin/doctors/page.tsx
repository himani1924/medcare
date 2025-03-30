"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "@/styles/doctors.module.css";
import DoctorCard from "@/components/DoctorCard";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  gender: string;
  profile_image: string;
  description: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const Page = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data.doctors);
      } catch (error) {
        if (error instanceof Error) {
          setError("Something went wrong!");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  if (loading) return <p>Loading doctors...</p>;
  if (error) return toast.error(error);
  return (
    <div className={styles.doctors}>
      {doctors.length > 0 ? (
        doctors.map((doc) => <DoctorCard key={doc.id} {...doc} />)
      ) : (
        <p className={styles.noDoctors}>
          No doctors match the selected filters.
        </p>
      )}
    </div>
  );
};

export default Page;
