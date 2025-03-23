"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles/test.module.css";
import Link from "next/link";
import DoctorCard from "./DoctorCard";

const allDoctors = [
  { name: "Dr Jane Doe, MBBS", specialty: "Dentist", experience: 9, rating: 5, gender: "Female", image: "/doc.png" },
  { name: "Dr Sam Wilson, BDS", specialty: "Dentist", experience: 5, rating: 5, gender: "Male", image: "/doc.png" },
  { name: "Dr Pepper, BHMS", specialty: "Dentist", experience: 5, rating: 4, gender: "Female", image: "/doc.png" },
  { name: "Dr Tony Stark, MDS", specialty: "Dentist", experience: 4, rating: 4, gender: "Male", image: "/doc.png" },
];

const DoctorAppointment = () => {
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [experience, setExperience] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"rating" | "experience" | "gender" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeFilter ? "hidden" : "auto";
  }, [activeFilter]);

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const filteredDoctors = allDoctors.filter((doctor) => {
    return (
      (selectedRatings.length === 0 || selectedRatings.includes(doctor.rating)) &&
      (experience === null || doctor.experience >= experience) &&
      (gender === null || doctor.gender === gender) &&
      (doctor.name.toLowerCase().includes(searchTerm) || 
        doctor.specialty.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className={styles.container}>
      {/* Heading */}
      <h1 className={styles.heading}>Find a doctor at your own ease</h1>

      {/* Search */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search doctors"
          className={styles.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchBtn}>Search</button>
      </div>

      {/* Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.doc_heading}>{filteredDoctors.length} Doctors Available</h1>
        <p className={styles.doc_para}>
          Book appointments with minimum wait-time & verified doctor details
        </p>
      </div>

      {/* Desktop View: Sidebar */}
      <main className={styles.main}>
        {!isMobile && (
          <div className={styles.sidebar}>
            {/* Rating Filter */}
            <div className={styles.filter_card}>
              <h4>Rating</h4>
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star}>
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(star)}
                    onChange={() => handleRatingChange(star)}
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
                    type="radio"
                    checked={experience === years}
                    onChange={() =>
                      setExperience(experience === years ? null : years)
                    }
                  />
                  {years}+ years
                </label>
              ))}
            </div>

            {/* Gender Filter */}
            <div className={styles.filter_card}>
              <h4>Gender</h4>
              {["Male", "Female"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    checked={gender === g}
                    onChange={() => setGender(gender === g ? null : g)}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Doctor List */}
        <div className={styles.doctors}>
          {filteredDoctors.map((doc, index) => (
            <Link href={`/doctor/${index}`} key={index} className={styles.card}>
              <DoctorCard {...doc} />
            </Link>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Filter Bar */}
      {isMobile && (
        <div className={styles.bottomBar}>
          <button onClick={() => setActiveFilter("rating")}>Rating</button>
          <button onClick={() => setActiveFilter("experience")}>Experience</button>
          <button onClick={() => setActiveFilter("gender")}>Gender</button>
        </div>
      )}

      {/* Bottom Sheet for Filters */}
      {activeFilter && (
        <>
          <div className={styles.overlay} onClick={() => setActiveFilter(null)} />
          <div className={styles.bottomSheet}>
            <div className={styles.sheetHeader}>
              <h3>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</h3>
              <button onClick={() => setActiveFilter(null)}>✕</button>
            </div>

            {/* Filter Options */}
            <div className={styles.filterOptions}>
              {activeFilter === "rating" &&
                [1, 2, 3, 4, 5].map((star) => (
                  <label key={star}>
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(star)}
                      onChange={() => handleRatingChange(star)}
                    />
                    {star} star
                  </label>
                ))}

              {activeFilter === "experience" &&
                [15, 10, 5, 3, 1].map((years) => (
                  <label key={years}>
                    <input
                      type="radio"
                      checked={experience === years}
                      onChange={() =>
                        setExperience(experience === years ? null : years)
                      }
                    />
                    {years}+ years
                  </label>
                ))}

              {activeFilter === "gender" &&
                ["Male", "Female"].map((g) => (
                  <label key={g}>
                    <input
                      type="radio"
                      checked={gender === g}
                      onChange={() => setGender(gender === g ? null : g)}
                    />
                    {g}
                  </label>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorAppointment;
