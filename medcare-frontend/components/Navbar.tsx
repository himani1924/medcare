"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import styles from "./styles/navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/api/auth/authContext";

const Navbar = () => {
  const {user, logout} = useAuth()
  const pathname = usePathname();
  const router = useRouter();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_links}>
        {/* app logo  */}
        <div className={styles.app_logo}>
        <Image src="/logo.svg" alt="logo" height={40} width={40} />
          <div className={styles.logo}>MedCare</div>
        </div>
        {/* mobile navigation */}
        <div className={styles.menu}>
          <div className={styles.nav_menu}>
            <Image
              src="/hamburgerMenu.svg"
              height={30}
              width={30}
              alt="menu"
              onClick={() => {
                setToggleDropdown((prev) => !prev);
                console.log(toggleDropdown);
              }}
            ></Image>
            {toggleDropdown && (
              <div className={styles.down}>
                <Link
                  href={"/"}
                  className={styles.down_link}
                  onClick={() => setToggleDropdown(false)}
                >
                  Home
                </Link>
                <Link
                  href={"/appointments"}
                  className={styles.down_link}
                  onClick={() => setToggleDropdown(false)}
                >
                  Appointments
                </Link>
                <Link
                  href={"/health-blog"}
                  className={styles.down_link}
                  onClick={() => setToggleDropdown(false)}
                >
                  Health Blog
                </Link>
                <Link
                  href={"/reviews"}
                  className={styles.down_link}
                  onClick={() => setToggleDropdown(false)}
                >
                  Reviews
                </Link>
                {user ? (
                  <>
                    <Link href="/profile" className={styles.down_link} onClick={() => setToggleDropdown(false)}>My Profile</Link>
                    <Link href='#' onClick={logout} className={styles.down_link}>Logout</Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={styles.down_link} onClick={() => setToggleDropdown(false)}>Login</Link>
                    <Link href="/signup" className={styles.down_link} onClick={() => setToggleDropdown(false)}>Signup</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* nav links */}
        <ul className={styles.navLinks}>
      <li>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
      </li>
      <li>
        <Link href="/appointments" className={pathname === '/appointments' ? styles.active : ''}>Appointments</Link>
      </li>
      <li>
        <Link href="/health-blog" className={pathname === '/health-blog' ? styles.active : ''}>Health Blog</Link>
      </li>
      <li>
        <Link href="/reviews" className={pathname === '/reviews' ? styles.active : ''}>Reviews</Link>
      </li>
    </ul>
      </div>
      {/* auth buttons */}
      <div className={styles.authButtons}>
      {user ? (
          <>
            <button className={styles.profile} onClick={() => router.push("/profile")}>My profile</button>
            <button className={styles.logout} onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button className={styles.login} onClick={() => router.push("/login")}>Login</button>
            <button className={styles.register} onClick={() => router.push("/signup")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
