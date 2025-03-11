import React from 'react'
import styles from "@/styles/signup.module.css";
import Image from "next/image";

const SignupPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.signup_box}>
        <h2>Sign Up</h2>
        <p>
          Already a member? <a href="#">Login.</a>
        </p>
        <form className={styles.signup_form}>
            {/* name */}
            <label>Name</label>
          <div className={styles.input_box}>
            <span className="icon">
            <Image
                    src={'ID.svg'}
                    width={15}
                    height={15}
                    alt='customer'
                />
            </span>
            <input type="email" placeholder="Enter your name" />
          </div>
            {/* phone */}
            {/* <label>Phone</label>
          <div className={styles.input_box}>
            <span className="icon">
            <Image
                    src={'Phone.svg'}
                    width={15}
                    height={15}
                    alt='customer'
                />
            </span>
            <input type="email" placeholder="Enter your phone number" />
          </div> */}
            {/* email */}
            <label>Email</label>
          <div className={styles.input_box}>
            <span className="icon">
            <Image
                    src={'At.svg'}
                    width={15}
                    height={15}
                    alt='customer'
                />
            </span>
            <input type="email" placeholder="Enter your email address" />
          </div>
            {/* password */}
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
          <button className={styles.submit_btn}>Submit</button>
          <button className={styles.reset_btn}>Reset</button>
        </form>
        </div>
    </div>
  )
}

export default SignupPage