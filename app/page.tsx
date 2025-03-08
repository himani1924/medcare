import Image from "next/image";
import styles from "./page.module.css";


export default function Home() {
  return (
    <div className={styles.container}>
      <ul className={styles.section_navLinks}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Appointments</a></li>
          <li><a href="#">Health Blog</a></li>
          <li><a href="#">Reviews</a></li>
    </ul>
      <div className={styles.heroText}>
        <h1>Health in Your Hands.</h1>
        <p>Take control of your healthcare with CareMate. Book appointments with ease, explore health blogs, and stay on top of your well-being, all in one place.</p>
        <button className={styles.getStarted}>Get Started</button>
      </div>
      
      <div className={styles.heroImage}>
        <Image 
          src="/HeroImage.png" 
          alt="Dentist with patient"
          fill
          className={styles.hero_img}
        />
      </div>
    </div>
  );
}
