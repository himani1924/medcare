import React from "react";
import styles from "@/styles/login.module.css";
import Image from "next/image";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.login_box}>
        <h2>Login</h2>
        <p>
          Are you a new member? <a href="#">Sign up here.</a>
        </p>

        <form className={styles.login_form}>
          {/* Email */}
          <label>Email</label>
          <div className={styles.input_box}>
            <span className="icon">
                        <Image
                                src={'ID.svg'}
                                width={15}
                                height={15}
                                alt='customer'
                            />
                        </span>
            <input type="email" placeholder="john@gmail.com" />
          </div>

          {/* Password */}
          <label>Password</label>
          <div className={styles.input_box} id={styles.password_input}>
            <div className={styles.p}>
              <span className="icon">
                <Image src={"Lock.svg"} alt="lock" height={15} width={15} />
              </span>
              <input type="password" placeholder="••••••••" />
            </div>
            <div>
              <a>
                <Image src={"Eye.svg"} alt="lock" height={15} width={15} />
              </a>
            </div>
          </div>

          {/* Login & Reset Buttons */}
          <button className={styles.login_btn}>Login</button>
          <button className={styles.reset_btn}>Reset</button>

          {/* Forgot Password */}
        </form>
        <p className={styles.forgot_password}>
          <a href="#">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}
