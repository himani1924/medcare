import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from './styles/ratedoctor.module.css'

interface RateDocProps{
    doctorId: number;
    userId: number | undefined;
}
const RateDoctor = ({ doctorId, userId}: RateDocProps) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/getratings?userId=${userId}`);
                if (!res.ok) throw new Error("Failed to fetch rating");
                const data = await res.json();
                if (data.rating) setRating(data.rating);
            } catch (error) {
                console.error("Error fetching rating:", error);
            }
        };

        if (userId) fetchRating();
    }, [doctorId, userId]);


    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) {
            console.log('rating is ',rating);
            toast.error("Please select a rating between 1 and 5.");
            return;
        }

        try {
            console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/rate`);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/doctors/${doctorId}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newrating:rating }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Rating submitted!");
        } catch (error) {
            if(error instanceof Error){
                toast.error(error.message)
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.rate}>

      <h3 className={styles.heading}>Rate this Doctor</h3>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= rating ? styles.filled : ""}`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
            </div>
      <button className={styles.submitBtn} onClick={handleSubmit}>
        Submit Rating
      </button>
    </div>
    );
};

export default RateDoctor;
