// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import DoctorCard from "../card/DoctorCard";
// import styles from "./AppointmentMain.module.css";
// import Toast from "../toast/Toast";
// import { useSearchParams, useRouter } from "next/navigation";

// type Doctor = {
//     id: string;
//     name: string;
//     specialty: string;
//     experience: number;
//     average_rating: number;
//     gender: string;
//     image: string;
//     qualifications: string[];
//     hospital: string[];
//     about: string;
//     availability: string[];
//     diseases: string[]; 
//     reviews: { name: string; review: string; }[];
// };

// const DoctorsPage: React.FC = () => {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);



//     const [searchTerm, setSearchTerm] = useState("");  
    
//     const initialPage = parseInt(searchParams.get("page") || "1", 10);
//     const initialRating = searchParams.get("rating") ? parseInt(searchParams.get("rating")!, 10) : null;
//     const initialExperience = searchParams.get("experience") ? parseInt(searchParams.get("experience")!, 10) : null;
//     const initialGender = searchParams.get("gender") || null;

//     const [ratingFilter, setRatingFilter] = useState<number | null>(initialRating);
//     const [experienceFilter, setExperienceFilter] = useState<number | null>(initialExperience);
//     const [genderFilter, setGenderFilter] = useState<string | null>(initialGender);
//     const [doctors, setDoctors] = useState<Doctor[]>([]);
//     const [currentPage, setCurrentPage] = useState(initialPage);
//     const [totalPages, setTotalPages] = useState<number>(1);
//     const [totalDoctors, setTotalDoctors] = useState<number>(0);
//     const [searchQuery, setSearchQuery] = useState(""); // Separate state to track the confirmed search term


//     const showToast = (message: string, type: "success" | "error" | "info") => {
//         setToast({ message, type });
//     };


//     const fetchDoctors = useCallback(async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 showToast("You need to log in first!", "error");
//                 setTimeout(() => {
//                     router.push("/login");
//                 }, 3000);
//                 return;
//             }
    
//             const params = new URLSearchParams();
//             if (ratingFilter !== null) params.append("rating", ratingFilter.toString());
//             if (experienceFilter !== null) params.append("experience", experienceFilter.toString());
//             if (genderFilter !== null) params.append("gender", genderFilter);
//             if (searchQuery) params.append("searchTerm", searchQuery); // ✅ Use confirmed searchQuery
//             params.append("page", currentPage.toString());
//             params.append("limit", "6");
    
//             const response = await fetch(`http://localhost:5000/api/doctors/?${params.toString()}`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//             });
    
//             if (response.status === 401) {
//                 showToast("You need to log in first!", "error");
//                 localStorage.removeItem("token");
//                 window.location.href = "/login";
//                 return;
//             }
//             if (!response.ok) throw new Error("❌ API Error: " + response.status);
    
//             const data = await response.json();
//             setDoctors(data.doctors);
//             setTotalPages(data.totalPages);
//             setCurrentPage(data.currentPage);
//             setTotalDoctors(data.totalDoctors);
//         } catch (error) {
//             console.error("Error fetching doctors:", error);
//             setDoctors([]);
//         }
//     }, [ratingFilter, experienceFilter, genderFilter, searchQuery, currentPage, router]); // ✅ Using searchQuery instead of searchTerm
    
//     useEffect(() => {
//         fetchDoctors();
//     }, [fetchDoctors]);
    

//     const updateFilters = (newFilters: { rating?: number | null; experience?: number | null; gender?: string | null }) => {
//         const params = new URLSearchParams();

//         if (newFilters.rating !== undefined) setRatingFilter(newFilters.rating);
//         if (newFilters.experience !== undefined) setExperienceFilter(newFilters.experience);
//         if (newFilters.gender !== undefined) setGenderFilter(newFilters.gender);

//         if (newFilters.rating !== null && newFilters.rating !== undefined) params.set("rating", newFilters.rating.toString());
//         if (newFilters.experience !== null && newFilters.experience !== undefined) params.set("experience", newFilters.experience.toString());
//         if (newFilters.gender !== null && newFilters.gender !== undefined) params.set("gender", newFilters.gender);

//         params.set("page", "1");

//         router.push(`?${params.toString()}`);
//         setCurrentPage(1);//for filter
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value); // ✅ Updates input field without triggering API calls
//     };
    
//     const handleSearch = () => {
//         if (!searchTerm.trim()) return; // Prevents empty or space-only searches
//         setSearchQuery(searchTerm); // triggers API call only when search button is clicked
//         setCurrentPage(1);
//     };

//     const handlePageChange = (newPage: number) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     return (
//         <div className={styles.Appointmentcontainer}>
//             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//             <div className={styles.searchParent}>
//                 <h1 className={styles.h1}>Find a doctor at your own ease</h1>
//                 <div className={styles.searchContainer}>
//                     <input
//                         type="text"
//                         placeholder="Search Doctors by Name or Specialty or Disease"
//                         className={styles.searchInput}
//                         value={searchTerm}
//                         onChange={handleSearchChange}
//                     />
//                     <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
//                 </div>
//             </div>
//             <div className={styles.headerContainer}>
//                 <h1 className={styles.headerh1}>{totalDoctors} Doctors Available</h1>
//                 <p className={styles.headerP}>Book appointments with minimum wait-time & verified doctor details</p>
//             </div>

//             <div className={styles.mainContent}>
//                 <div className={styles.sidebar}>
//                     <div className={styles.filterHeader}>
//                         <h3 className={styles.h3}>Filter By:</h3>
//                         <button className={styles.resetBtn} onClick={() => updateFilters({ rating: null, experience: null, gender: null })}>
//                             Reset
//                         </button>
//                     </div>

//                     <div className={styles.filterCard}>
//                         <h4>Rating</h4>
//                         <label>
//                             <input
//                                 className={styles.radioInp}
//                                 type="radio"
//                                 name="rating"
//                                 checked={ratingFilter === null}
//                                 onChange={() => updateFilters({ rating: null })}
//                             />
//                             Show All
//                         </label>
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <label key={star}>
//                                 <input
//                                     className={styles.radioInp}
//                                     type="radio"
//                                     name="rating"
//                                     checked={ratingFilter === star}
//                                     onChange={() => updateFilters({ rating: ratingFilter === star ? null : star })}
//                                 />
//                                 {star} Star
//                             </label>
//                         ))}
//                     </div>


//                     <div className={styles.filterCard}>
//                         <h4>Experience</h4>
//                         {[15, 10, 5, 3, 1].map((years) => (
//                             <label key={years}>
//                                 <input
//                                     className={styles.radioInp}
//                                     type="radio"
//                                     name="experience"
//                                     checked={experienceFilter === years}
//                                     onChange={() => updateFilters({ experience: experienceFilter === years ? null : years })}
//                                 />
//                                 {years}+ years
//                             </label>
//                         ))}
//                     </div>

//                     <div className={styles.filterCard}>
//                         <h4>Gender</h4>
//                         <label>
//                             <input
//                                 className={styles.radioInp}
//                                 type="radio"
//                                 name="gender"
//                                 checked={genderFilter === null}
//                                 onChange={() => updateFilters({ gender: null })}
//                             />
//                             Show All
//                         </label>
//                         {["Male", "Female"].map((gender) => (
//                             <label key={gender}>
//                                 <input
//                                     className={styles.radioInp}
//                                     type="radio"
//                                     name="gender"
//                                     checked={genderFilter === gender}
//                                     onChange={() => updateFilters({ gender: genderFilter === gender ? null : gender })}
//                                 />
//                                 {gender}
//                             </label>
//                         ))}
//                     </div>

//                 </div>

//                 <div className={styles.doctorList}>
//                     {doctors.length > 0 ? (
//                         doctors.map((doc) => <DoctorCard key={doc.id} {...doc} average_rating={doc.average_rating} />)
//                     ) : (
//                         <p className={styles.noDoctors}>No doctors match the selected filters.</p>
//                     )}
//                 </div>
//             </div>

//             {totalPages > 1 && (
//                 <div className={styles.pagination}>
//                     <button className={styles.pageBtn} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//                         ❮ Prev
//                     </button>
//                     {Array.from({ length: totalPages }, (_, i) => (
//                         <button
//                             key={i + 1}
//                             className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.active : ""}`}
//                             onClick={() => handlePageChange(i + 1)}
//                         >
//                             {i + 1}
//                         </button>
//                     ))}
//                     <button className={styles.pageBtn} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//                         Next ❯
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DoctorsPage;
