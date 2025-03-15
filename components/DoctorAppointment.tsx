"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles/appointment.module.css";
import Link from "next/link";
import DoctorCard from "./DoctorCard";
import { useRouter, useSearchParams } from 'next/navigation';

// interface for doc 
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  gender: string;
  image: string;
}

const DoctorAppointment = () => {
  // use state 
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [experience, setExperience] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"rating" | "experience" | "gender" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();
const searchParams = useSearchParams();


  // use effect 

  // prevent redering until hydration completes 
  useEffect(() => setHydrated(true), []);

  // fetch docs data 
  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  // sync state from url 
  // when user refreshes page 
  useEffect(() => {
    const page = searchParams.get('page');
    const gender = searchParams.get('gender');
    const rating = searchParams.get('rating');
    const experience = searchParams.get('experience');
  
    if (page) setCurrentPage(Number(page));
    if (gender) setGender(gender);
    if (rating) setSelectedRatings(rating.split(',').map(Number));
    if (experience) setExperience(Number(experience));
  }, [searchParams]);

  // sync url from state 
  // when user clicks on a filter 
  useEffect(() => {
    updateURL(currentPage);
  }, [currentPage, selectedRatings, experience, gender]);


  // page change function 
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page);
  };
    
  
  // search bar function 
  const handleSearch = () => {
    setSearchTerm(searchTerm.trim().toLowerCase());
  };  

  // updating url 
  const updateURL = (page: number) => {
    const params = new URLSearchParams();
  
    if (gender) params.set('gender', gender);
    if (selectedRatings.length) params.set('rating', selectedRatings.join(','));
    if (experience) params.set('experience', experience.toString());
    params.set('page', page.toString());
  
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // filter docs function 
  const filteredDoctors = doctors.filter((doctor) => {
    return (
      (selectedRatings.length === 0 || selectedRatings.includes(doctor.rating)) &&
      (experience === null || doctor.experience >= experience) &&
      (gender === null || doctor.gender === gender) &&
      (doctor.name.toLowerCase().includes(searchTerm) || 
       doctor.specialty.toLowerCase().includes(searchTerm))
    );
  });

  // ratings change function 
const handleRatingChange = (rating: number) => {
  if (selectedRatings.includes(rating)) {
    setSelectedRatings(selectedRatings.filter((r) => r !== rating));
  } else {
    setSelectedRatings([...selectedRatings, rating]);
  }
};

// clear rating function 
const handleClearRatings = () => {
  setSelectedRatings([]);
};

// pagination 
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

// return jsx 
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchBtn}  onClick={handleSearch}>Search</button>
      </div>

      {/* header for doctors */}
      <div className={styles.headerContainer}>
        <h1 className={styles.doc_heading}>{filteredDoctors.length} Doctors Available</h1>
        <p className={styles.doc_para}>
          Book appointments with minimum wait-time & verified doctor details
        </p>
      <button
              className={styles.resetBtn}
              onClick={() => {
                setSelectedRatings([]);
                setExperience(null);
                setGender(null);
              }}
            >
              Reset filters
            </button>
      </div>

      <main className={styles.main}>
        {/* filters section  */}
        <div className={styles.sidebar}>
          <div className={styles.filter_header}>
            <h3 className={styles.h3}>Filter By:</h3>
            <button
              className={styles.reset_btn}
              onClick={() => {
                setSelectedRatings([]);
                setExperience(null);
                setGender(null);
                updateURL(1)
              }}
            >
              Reset
            </button>
          </div>
          {/* Rating Filter */}
          <div className={styles.filter_card}>
      <h4>Rating</h4>
      <label>
        <input
          className={styles.checkbox_input}
          type="checkbox"
          onChange={handleClearRatings}
          checked={selectedRatings.length === 0}
        />
        Show all
      </label>
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star}>
          <input
            className={styles.checkbox_input}
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
            <label>
            <input
                  className={styles.radio_inp}
                  type="radio"
                  name="gender"
                  // checked={gender === g}
                  onChange={() => setGender(null )}
                />
                Show all
                </label>
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
  {paginatedDoctors.length > 0 ? (
    paginatedDoctors.map((doc) => (
      <Link href={`/doctor/${doc.id}`} key={doc.id} className={styles.card}>
        <DoctorCard {...doc} />
      </Link>
    ))
  ) : (
    <p className={styles.noDoctors}>No doctors match the selected filters.</p>
  )}
</div>

      </main>

      {/* pagination  */}
      <div className={styles.pagination}>
  <button 
    className={styles.pageBtn} 
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    ❮ Prev
  </button>
  
  {Array.from({ length: Math.ceil(filteredDoctors.length / itemsPerPage) }, (_, i) => (
    <button 
      key={i} 
      className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.active : ''}`}
      onClick={() => handlePageChange(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button 
    className={styles.pageBtn} 
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === Math.ceil(filteredDoctors.length / itemsPerPage)}
  >
    Next ❯
  </button>
</div>


    {/* mobile view  */}
    <div className={styles.bottomBar}>
        <button onClick={() => setActiveFilter("rating")}>Rating</button>
        <button onClick={() => setActiveFilter("experience")}>Experience</button>
        <button onClick={() => setActiveFilter("gender")}>Gender</button>
      </div>
      {activeFilter && (
        <>
          <div className={styles.overlay} onClick={() => setActiveFilter(null)} />
          <div className={styles.bottomSheet}>
            <div className={styles.sheetHeader}>
              <h3>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</h3>
              <button onClick={() => setActiveFilter(null)}>✕</button>
            </div>

            <div className={styles.filter_card}>
              {activeFilter === "rating" &&
                [1, 2, 3, 4, 5].map((star) => (
                  <label key={star}>
                    <input
                      className={styles.checkbox_input}
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
                      className={styles.radio_input}
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
                      className={styles.radio_input}
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
  ):
  <p>Loading...</p>;
};

export default DoctorAppointment;