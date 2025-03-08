import React from 'react'
import styles from './styles/navbar.module.css'
import Image from 'next/image'



const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_links}>
        <div className={styles.app_logo}>
        <Image
          src={'logo.svg'}
          alt='logo'
          height={40}
          width={40}
        />
        <div className={styles.logo}>MedCare</div>
        </div>
      
        <ul className={styles.navLinks}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Appointments</a></li>
          <li><a href="#">Health Blog</a></li>
          <li><a href="#">Reviews</a></li>
    </ul>
      </div>
      
      <div className={styles.authButtons}>
        <button className={styles.login}>Login</button>
        <button className={styles.register}>Register</button>
      </div>
    </nav>
  );
};

export default Navbar