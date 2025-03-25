"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles/appointment.module.css";
import DoctorCard from "./DoctorCard";
import { useRouter, useSearchParams } from "next/navigation";

// Interface for doctor data
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

const DoctorAppointment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialRating = searchParams.get("rating")
    ? parseInt(searchParams.get("rating")!, 10)
    : null;
  const initialExperience = searchParams.get("experience")
    ? parseInt(searchParams.get("experience")!, 10)
    : null;
  const initialGender = searchParams.get("gender") || null;

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(
    initialRating
  );
  const [experienceFilter, setExperienceFilter] = useState<number | null>(
    initialExperience
  );
  const [genderFilter, setGenderFilter] = useState<string | null>(
    initialGender
  );
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch doctors from backend
  const fetchDoctors = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (ratingFilter !== null)
        params.append("rating", ratingFilter.toString());
      if (experienceFilter !== null)
        params.append("experience", experienceFilter.toString());
      if (genderFilter !== null) params.append("gender", genderFilter);
      if (searchQuery) params.append("searchTerm", searchQuery);
      params.append("page", currentPage.toString());
      params.append("limit", "6");
      router.push(`?${params.toString()}`, { scroll: false });

      console.log(
        `Fetching doctors from: ${API_URL}/doctors/?${params.toString()}`
      );

      const resp = await fetch(`${API_URL}/doctors/?${params.toString()}`);
      if (!resp.ok) throw new Error(`API error ${resp.status}`);

      const data = await resp.json();
      setDoctors(data.doctors || []); 
      setTotalPages(data.totalPages);
      setTotalDoctors(data.totalDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]); 
    }
  }, [ratingFilter, experienceFilter, genderFilter, searchQuery, currentPage]);

  // Fetch doctors when filters change
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Update filters
  const updateFilters = (newFilters: {
    rating?: number | null;
    experience?: number | null;
    gender?: string | null;
  }) => {
    const params = new URLSearchParams();

    if (newFilters.rating !== undefined) setRatingFilter(newFilters.rating);
    if (newFilters.experience !== undefined)
      setExperienceFilter(newFilters.experience);
    if (newFilters.gender !== undefined) setGenderFilter(newFilters.gender);

    if (newFilters.rating !== null && newFilters.rating !== undefined)
      params.set("rating", newFilters.rating.toString());
    if (newFilters.experience !== null && newFilters.experience !== undefined)
      params.set("experience", newFilters.experience.toString());
    if (newFilters.gender !== null && newFilters.gender !== undefined)
      params.set("gender", newFilters.gender);

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // return jsx 
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Find a doctor at your own ease</h1>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search doctors"
          className={styles.search}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className={styles.searchBtn} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Header Section */}
      <div className={styles.headerContainer}>
        <h1 className={styles.doc_heading}>{totalDoctors} Doctors Available</h1>
        <p className={styles.doc_para}>
          Book appointments with minimum wait-time & verified doctor details
        </p>
        <button
          className={styles.resetBtn}
          onClick={() =>
            updateFilters({ rating: null, experience: null, gender: null })
          }
        >
          Reset filters
        </button>
      </div>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.filter_header}>
            <h3 className={styles.h3}>Filter By:</h3>
            <button
              className={styles.reset_btn}
              onClick={() =>{
                updateFilters({ rating: null, experience: null, gender: null , })
                setSearchQuery('')
              }
              }
            >
              Reset
            </button>
          </div>

          <div className={styles.filter_card}>
            <h4>Rating</h4>
            <label>
              <input
                className={styles.radio_inp}
                type="radio"
                name="rating"
                checked={ratingFilter === null}
                onChange={() => updateFilters({ rating: null })}
              />
              Show All
            </label>
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star}>
                <input
                  className={styles.radio_inp}
                  type="radio"
                  name="rating"
                  checked={ratingFilter === star}
                  onChange={() =>
                    updateFilters({
                      rating: ratingFilter === star ? null : star,
                    })
                  }
                />
                {star} Star
              </label>
            ))}
          </div>

          <div className={styles.filter_card}>
            <h4>Experience</h4>
            {[15, 10, 5, 3, 1].map((years) => (
              <label key={years}>
                <input
                  className={styles.radio_inp}
                  type="radio"
                  name="experience"
                  checked={experienceFilter === years}
                  onChange={() =>
                    updateFilters({
                      experience: experienceFilter === years ? null : years,
                    })
                  }
                />
                {years}+ years
              </label>
            ))}
          </div>

          <div className={styles.filter_card}>
            <h4>Gender</h4>
            <label>
              <input
                className={styles.radio_inp}
                type="radio"
                name="gender"
                checked={genderFilter === null}
                onChange={() => updateFilters({ gender: null })}
              />
              Show All
            </label>
            {["Male", "Female"].map((gender) => (
              <label key={gender}>
                <input
                  className={styles.radio_inp}
                  type="radio"
                  name="gender"
                  checked={genderFilter === gender}
                  onChange={() =>
                    updateFilters({
                      gender: genderFilter === gender ? null : gender,
                    })
                  }
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        {/* Doctor List */}
        <div className={styles.doctors}>
          {doctors.length > 0 ? (
            doctors.map((doc) => <DoctorCard key={doc.id} {...doc} />)
          ) : (
            <p className={styles.noDoctors}>
              No doctors match the selected filters.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ❮ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`${styles.pageNumber} ${
                currentPage === i + 1 ? styles.active : ""
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ❯
          </button>
        </div>
      )}
      {/* mobile view  */}
      <div className={styles.bottomBar}>
        <button onClick={() => setActiveFilter("rating")}>Rating</button>
        <button onClick={() => setActiveFilter("experience")}>
          Experience
        </button>
        <button onClick={() => setActiveFilter("gender")}>Gender</button>
      </div>
      {activeFilter && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setActiveFilter(null)}
          />
          <div className={styles.bottomSheet}>
            <div className={styles.sheetHeader}>
              <h3>
                {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </h3>
              <button onClick={() => setActiveFilter(null)}>✕</button>
            </div>

            <div className={styles.filter_card}>
              {activeFilter === "rating" &&
                [1, 2, 3, 4, 5].map((star) => (
                  <label key={star}>
                    <input
                      className={styles.checkbox_input}
                      type="radio"
                      name="rating"
                      checked={ratingFilter === star}
                      onChange={() =>
                        updateFilters({
                          rating: ratingFilter === star ? null : star,
                        })
                      }
                    />
                    {star} star
                  </label>
                ))}

              {activeFilter === "experience" &&
                [15, 10, 5, 3, 1].map((years) => (
                  <label key={years}>
                    <input
                      className={styles.radio_input}
                      type="radio"
                      name="experience"
                      checked={experienceFilter === years}
                      onChange={() =>
                        updateFilters({
                          experience: experienceFilter === years ? null : years,
                        })
                      }
                    />
                    {years}+ years
                  </label>
                ))}

              {activeFilter === "gender" &&
                ["Male", "Female"].map((g) => (
                  <label key={g}>
                    <input
                      className={styles.radio_input}
                      type="radio"
                      name="gender"
                      checked={genderFilter === g}
                      onChange={() =>
                        updateFilters({ gender: genderFilter === g ? null : g })
                      }
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
