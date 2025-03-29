import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./styles/reviewdoctor.module.css";

interface ReviewProps {
    doctorId: number;
    userId: number | undefined;
}

interface Review {
    user_name: string;
    review: string;
    created_at: string;
}

const ReviewDoctor = ({ doctorId, userId }: ReviewProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewText, setReviewText] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/reviews`);
                if (!res.ok) throw new Error("Failed to fetch reviews");
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [doctorId]);

    const handleSubmit = async () => {
        if (!reviewText.trim()) {
            toast.error("Review cannot be empty.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, review: reviewText }),
            });

            if (!res.ok) throw new Error("Failed to submit review");

            setReviewText("");
            toast.success("Review submitted!");

            // Fetch updated reviews
            const updatedReviews = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/reviews`);
            setReviews(await updatedReviews.json());

        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Error submitting review.");
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>User Reviews</h3>

            <textarea
                className={styles.reviewInput}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
            />
            <button className={styles.submitBtn} onClick={handleSubmit}>
                Submit Review
            </button>

            <div className={styles.reviewList}>
                {reviews.length === 0 ? (
                    <p className={styles.noReviews}>No reviews yet.</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className={styles.reviewItem}>
                            <p className={styles.userName}>{review.user_name}</p>
                            <p className={styles.reviewText}>{review.review}</p>
                            <p className={styles.date}>{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewDoctor;
