import Image from "next/image";
import Link from 'next/link'
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import styles from "./styles/doctorcard.module.css";

interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  gender: string;
  experience: number;
  rating: number;
  profile_image: string;
  description: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  gender,
  specialty,
  experience,
  rating,
  profile_image,
}) => {

  return (
    <div className={styles.card}>
      <Link href={`/doctor/${id}`} className={styles.cardLink}>
      <div className={styles.imageContainer}>
        <Image src={profile_image} alt={name} width={100} height={100} className={styles.image} />
      </div>
      <h3 className={styles.name}>
        {name}, {gender}
      </h3>
      <div className={styles.details}>
        <span>
          <MdMedicalServices className={styles.icon} /> {specialty}
        </span>
        <span>
          <IoTimeOutline className={styles.icon} /> {experience} Years
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
      </Link>
    </div>
  );
};

export default DoctorCard;
