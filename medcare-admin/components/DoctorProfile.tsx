import Image from "next/image";
// import { MdMedicalServices } from "react-icons/md";
// import { IoTimeOutline } from "react-icons/io5";
import styles from "./styles/doctorprofile.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

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
  const handleUpdate = () => {
    router.push(`/update-doctor/${id}`);
  };

  const handleDeleteDoctor = async () =>{
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-doctor/${id}`)
      if(response.status==200){
        toast.success(response.data.message)
        router.push('/doctors')
      }
      if(response.data.error){
        toast.error(response.data.error)
      }
    } catch (error) {
      if( error instanceof Error){
      toast.error(error.message)
    }
    }
  }
  return (
    <div className={styles.body}>
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.imageWrapper}>
          <Image
            src={profile_image}
            alt={name}
            width={120}
            height={120}
            className={styles.profileImage}
          />
        </div>

        <div className={styles.infoSection}>
          <h2 className={styles.doctorName}>{name}</h2>
          <p>ID : {id}</p>
          <p className={styles.specialty}>{specialty}</p>
          <p className={styles.details}>
            <strong>Experience:</strong> {experience} years
          </p>
          <p className={styles.details}>
            <strong>Rating:</strong> {rating} ⭐
          </p>
          <p className={styles.details}>
            <strong>Gender:</strong> {gender}
          </p>
        </div>
      </div>
      <p className={styles.description}>{description}</p>

      <div className={styles.actionButtons}>
        <button className={styles.updateBtn} onClick={handleUpdate}>Update Profile</button>
        <button className={styles.deleteBtn} onClick={handleDeleteDoctor}>Delete Profile</button>
      </div>
    </div>
    </div>
  );
};

export default DoctorProfile;
