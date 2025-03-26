import Image from "next/image";
import styles from "@/styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Admin portal</h1>
      </div>

      <div className={styles.heroImage}>
        <Image
          src="/Home.jpg"
          alt="Dentist with patient"
          fill
          className={styles.hero_img}
        />
      </div>
    </div>
  );
}
