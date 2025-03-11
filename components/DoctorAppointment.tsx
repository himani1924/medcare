"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles/appointment.module.css";
import Link from "next/link";
import DoctorCard from "./DoctorCard";

const allDoctors = [
  { name: "Dr Jane Doe, MBBS", specialty: "Dentist", experience: 9, rating: 5, gender: "Female", image: "/doc.png" },
  { name: "Dr Sam Wilson, BDS", specialty: "Dentist", experience: 5, rating: 5, gender: "Male", image: "/doc.png" },
  { name: "Dr Pepper Potts, BHMS", specialty: "Dentist", experience: 5, rating: 4, gender: "Female", image: "/doc.png" },
  { name: "Dr Tony Stark, MDS", specialty: "Dentist", experience: 4, rating: 4, gender: "Male", image: "/doc.png" },
  { name: "Dr Meghan, MD", specialty: "Dentist", experience: 3, rating: 5, gender: "Female", image: "/doc.png" },
  { name: "Dr Dev Patel, FNB", specialty: "Dentist", experience: 2, rating: 4, gender: "Male", image: "/doc.png" },
  { name: "Dr Dev Patel, FNB", specialty: "Dentist", experience: 2, rating: 4, gender: "Male", image: "/doc.png" },
  { name: "Dr Dev Patel, FNB", specialty: "Dentist", experience: 2, rating: 4, gender: "Male", image: "/doc.png" },
];

const DoctorAppointment = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [experience, setExperience] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);


useEffect(() => setHydrated(true), []);

const filteredDoctors = allDoctors.filter((doctor) => {
  return (
      (rating === null || doctor.rating === rating) &&
      (experience === null || doctor.experience >= experience) &&
      (gender === null || doctor.gender === gender)
  );
});

  return hydrated?(
    <div className={styles.container}>
      {/* heading  */}
      <h1 className={styles.heading}>Find a doctor at your own ease</h1>

      {/* search  */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search doctors"
          className={styles.search}
        />
        <button className={styles.searchBtn}>Search</button>
      </div>

      {/* header for doctors */}
      <div className={styles.headerContainer}>
        <h1 className={styles.doc_heading}>6 Doctors Available</h1>
        <p className={styles.doc_para}>
          Book appointments with minimum wait-time & verified doctor details
        </p>
      </div>

      <main className={styles.main}>
        {/* filters section  */}
        <div className={styles.sidebar}>
          <div className={styles.filter_header}>
            <h3 className={styles.h3}>Filter By:</h3>
            <button
              className={styles.reset_btn}
              onClick={() => {
                setRating(null);
                setExperience(null);
                setGender(null);
              }}
            >
              Reset
            </button>
          </div>
          {/* Rating Filter */}
          <div className={styles.filter_card}>
            <h4>Rating</h4>
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star}>
                <input
                  className={styles.radio_input}
                  type="radio"
                  name="rating"
                  checked={rating === star}
                  onChange={() => setRating(rating === star ? null : star)}
                />
                {star} star
              </label>
            ))}
          </div>
          {/* Experience Filter */}
          <div className={styles.filter_card}>
            <h4>Experience</h4>
            {[15, 10, 5, 3, 1].map((years) => (
              <label key={years}>
                <input
                  className={styles.radio_input}
                  type="radio"
                  name="experience"
                  checked={experience === years}
                  onChange={() =>
                    setExperience(experience === years ? null : years)
                  }
                />
                {years}+ years
              </label>
            ))}
          </div>
          {/* Gender filter  */}
          <div className={styles.filter_card}>
            <h4>Gender</h4>
            {["Male", "Female"].map((g) => (
              <label key={g}>
                <input
                  className={styles.radio_inp}
                  type="radio"
                  name="gender"
                  checked={gender === g}
                  onChange={() => setGender(gender === g ? null : g)}
                />
                {g}
              </label>
            ))}
          </div>
        </div>
        {/* docs list  */}
        <div className={styles.doctors}>
            {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc, index) => (
                    <Link href={`/doctor/${index}`} key={index} className={styles.card}>
                        <DoctorCard {...doc} />
                    </Link>
                ))
            ) : (
                <p className={styles.noDoctors}>No doctors match the selected filters.</p>
            )}
        </div>;
      </main>
      <div className={styles.pagination}>
        <button className={styles.pageBtn}>❮ Prev</button>
        <button className={styles.pageNumber}>1</button>
        <button className={`${styles.pageNumber} ${styles.active}`}>2</button>
        <button className={styles.pageNumber}>3</button>
        <span className={styles.span}>...</span>
        <button className={styles.pageNumber}>22</button>
        <button className={styles.pageNumber}>23</button>
        <button className={styles.pageNumber}>24</button>
        <button className={styles.pageBtn}>Next ❯</button>
    </div>
    </div>
  ):
  <p>Loading...</p>;
};

export default DoctorAppointment;
