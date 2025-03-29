"use client";
import React, { useState, useEffect } from "react";
import styles from '@/styles/DoctorEditForm.module.css'
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  gender: string;
  description: string;
  profile_image: string;
  diseases: string
}

const API_URL = 'http://localhost:5000/api/v1';

const DoctorEditForm = () => {
  const router = useRouter();
  const {id} = useParams()
  const doctorId = id 
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const response = await fetch(`${API_URL}/doctors/${doctorId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setDoctor((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) { 
        toast.error("File size exceeds 5MB. Please upload a smaller image.");
          return;
      }
      
      setNewImage(file);
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    const formData = new FormData();
    formData.append("name", doctor.name);
    formData.append("specialty", doctor.specialty);
    formData.append("experience", String(doctor.experience));
    formData.append("gender", doctor.gender);
    formData.append("description", doctor.description);
    formData.append('diseases', doctor.diseases)
    
    if (newImage) {
      formData.append("profile_image", newImage);
    }
    try {
      const response = await fetch(`${API_URL}/admin/update/${doctor.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update doctor");
      toast.success('Profile updated successfully')
      router.push("/doctors");
    } catch (err) {
      console.error("Error updating doctor:", err);
      setError("Failed to update doctor.");
    }
  };

  if (loading) return <p>Loading doctor data...</p>;
  if (error) {toast.error(error);return <p className={styles.error}>{error}</p>};
  if (!doctor) return <p className={styles.error}>Doctor not found</p>;

  return (
    <div className={styles.body}>
    <div className={styles.container}>
      <h2 className={styles.head}>Edit Doctor Details</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>ID</label>
          <input type="text" value={doctor.id} disabled />
        </div>

        {/* Name */}
        <div className={styles.formGroup}>
          <label>Name</label>
          <input type="text" name="name" value={doctor.name} onChange={handleChange} required />
        </div>

        {/* Specialty */}
        <div className={styles.formGroup}>
          <label>Specialty</label>
          <input type="text" name="specialty" value={doctor.specialty} onChange={handleChange} required />
        </div>

        {/* Experience */}
        <div className={styles.formGroup}>
          <label>Experience (Years)</label>
          <input type="number" name="experience" value={doctor.experience} onChange={handleChange} required />
        </div>

        {/* Rating (Read-only) */}
        <div className={styles.formGroup}>
          <label>Rating</label>
          <input type="number" value={doctor.rating} disabled />
        </div>

        {/* Gender */}
        <div className={styles.formGroup}>
          <label>Gender</label>
          <select name="gender" value={doctor.gender} onChange={handleChange} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea name="description" value={doctor.description ? doctor.description : ''} onChange={handleChange} />
        </div>

        {/* diseases  */}
        <div className={styles.formGroup}>
          <label>Diseases</label>
          <input type="text" name="diseases" value={doctor.diseases} onChange={handleChange} required />
        </div>

        {/* Profile Image */}
        <div className={styles.formGroup}>
        <label>Profile Image</label>
            <img src={doctor.profile_image} alt="Profile" className={styles.profileImage} />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          
        </div>

        <button type="submit" className={styles.submitBtn}>Update Doctor</button>
      </form>
    </div>
    </div>
  );
};

export default DoctorEditForm;
