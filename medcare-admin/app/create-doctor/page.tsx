"use client";
import React, { useState } from "react";
import styles from "@/styles/createdoctor.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const [name, setName] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");
  const [experience, setExperience] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [pending, setPending] = useState(false);

  const router = useRouter()

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData();
    formData.append('name', name)
    formData.append('specialty', specialty)
    formData.append('experience', experience?.toString() ||'')
    formData.append('gender', gender)
    if (description) {
      formData.append("description", description);
    }
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-doctor`, formData, {
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })
      toast.success(response.data.message || "Doctor added successfully!");
      router.push('/doctors')
      
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
    }
    finally{
      setPending(false)
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Create doctor</h2>

        <form onSubmit={submitHandler} className={styles.form}>
          {/* Name */}
          <label>Name</label>
          <div className={styles.input_box}>
            <input
              type="text"
              placeholder="Enter your name"
              id="nameInp"
              autoComplete="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Specialty */}
          <label>Specialty</label>
          <div className={styles.input_box} id={styles.password_input}>
            <div className={styles.p}>
              <input
                type="text"
                placeholder="Enter specialty"
                id="specialtyInp"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />
            </div>
          </div>
          {/* experience  */}
          <label>Experience</label>
          <div className={styles.input_box}>
            <div className={styles.p}>
              <input
                type="number"
                placeholder="Enter experience"
                id="experienceInp"
                value={experience === null? '': experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                required
              />
            </div>
          </div>
          {/* gender  */}
          <label>Gender</label>
          <div className={styles.input_box}>
            <div className={styles.radio_group}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Female
              </label>
            </div>
          </div>
          {/* description  */}
          <label>Description</label>
          <div className={styles.input_box}>
            <div className={styles.p}>
              <textarea
                placeholder="Enter doctor's description"
                id="descriptionInp"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          {/* pfp  */}
          <label>Profile image</label>
          <div className={styles.input_box}>
            <input
              type="text"
              placeholder="Image url"
              id="imageInp"
              autoComplete="true"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            />
          </div>
          {/* buttons  */}
          <button className={styles.submit_btn} disabled={pending} type="submit">
            Submit
          </button>
          <button
            className={styles.reset_btn}
            disabled={pending}
            onClick={() => {
              setName("");
              setSpecialty("");
              setExperience(null);
              setGender("");
              setDescription("");
              setProfileImage("");
            }}
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
