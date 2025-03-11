import Image from "next/image";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { BiClinic } from "react-icons/bi";
import styles from "./styles/doctorprofile.module.css";

interface DoctorProfileProps {
  name: string;
  qualification: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  clinic: string;
  location: string;
  about: string;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({
  name,
  qualification,
  specialty,
  experience,
  rating,
  image,
  clinic,
  location,
  about,
}) => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.imageContainer}>
          <Image src={image} alt={name} width={120} height={120} className={styles.image} />
        </div>
        <h2 className={styles.name}>
          {name}, {qualification}
        </h2>
        <div className={styles.details}>
          <span>
            <MdMedicalServices className={styles.icon} /> {specialty}
          </span>
          <span>
            <IoTimeOutline className={styles.icon} /> {experience} Years of Experience
          </span>
          <span>
            <BiClinic className={styles.icon} /> {clinic}
          </span>
          <span>
            <IoLocationOutline className={styles.icon} /> {location}
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
        <button className={styles.button}>Book Appointment</button>
      </div>

      <div className={styles.aboutSection}>
        <h3>About {name}</h3>
        <p>{about}</p>
      </div>
    </div>
  );
};

export default DoctorProfile;
