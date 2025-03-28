'use client'
import Image from "next/image";
import styles from "@/styles/page.module.css";
import Content from "@/components/Content";
import { useAuth } from "./api/auth/authContext";

export default function Home() {
  const {user} = useAuth()
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Content
          contentheading={`Health in Your Hands.`}
          para={`Take control of your healthcare with CareMate. Book appointments with ease, explore health blogs, and stay on top of your well-being, all in one place.`}
        />
        <a href={user ? '/appointments': '/login'}>
        <button className={styles.getStarted}>Get Started</button>
        </a>
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
