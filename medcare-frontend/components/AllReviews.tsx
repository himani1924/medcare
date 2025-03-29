'use client'
import { useState, useEffect } from "react";
import styles from "./styles/allreviews.module.css";



interface Review {
    user_name: string;
    review: string;
    created_at: string;
    doctor_name: string;
}

const AllReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/allreviews`);
                if (!res.ok) throw new Error("Failed to fetch reviews");
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, []);
  return (
    <div className={styles.container}>
            <div className={styles.reviewList}>
                {reviews.length === 0 ? (
                    <p className={styles.noReviews}>No reviews yet.</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className={styles.reviewItem}>
                            <p className={styles.doctorName}>{review.doctor_name}</p>
                            <p className={styles.userName}>{review.user_name}</p>
                            <p className={styles.reviewText}>{review.review}</p>
                            <p className={styles.date}>{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
  )
}

export default AllReviews