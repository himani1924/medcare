import Image from "next/image";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import styles from "./styles/doctorprofile.module.css";
import { useRouter } from "next/navigation";

interface DoctorProfileProps {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  gender: string;
  profile_image: string;
  description: string;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({
  id,
  name,
  specialty,
  experience,
  rating,
  gender,
  profile_image,
  description,
}) => {
  const router = useRouter()

  const handleBookAppointment = () =>{
    router.push(`/appointments-booking?doctorId=${id}`)
  }
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.imageContainer}>
          <Image src={`/${profile_image}`} alt={name} width={120} height={120} className={styles.image} />
        </div>
        <div className={styles.details}>
          <p>{gender}</p>
          <span>
            <MdMedicalServices className={styles.icon} /> {specialty}
          </span>
          <span>
            <IoTimeOutline className={styles.icon} /> {experience} Years of Experience
          </span>
          
        </div>
        <div className={styles.rating}>
          Ratings:{" "}
          {[...Array(5)].map((_, index) =>
            index + 1 <= rating ? (
              <FaStar key={index} className={styles.star} />
            ) : rating > index && rating < index + 1 ? (
              <FaStarHalfAlt key={index} className={styles.star} />
            ) : (
              <FaStar key={index} className={styles.emptyStar} />
            )
          )}
        </div>
        <button className={styles.button} onClick={handleBookAppointment}>Book Appointment</button>
      </div>

      <div className={styles.aboutSection}>
        <h3>About {name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default DoctorProfile;
