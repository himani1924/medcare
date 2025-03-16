"use client";
// import React, { useState } from "react";
import styles from "@/styles/login.module.css";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("login successful");
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
    if (error) {
      toast.error(error);
    }
  };
  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    signIn('google', { callbackUrl: "/" });
  };
  return (
    <div className={styles.container}>
      <div className={styles.login_box}>
        <h2>Login</h2>
        <p>
          Are you a new member? <a href="#">Sign up here.</a>
        </p>

        <form onSubmit={submitHandler} className={styles.login_form}>
          {/* Email */}
          <label>Email</label>
          <div className={styles.input_box}>
            <span className="icon">
              <Image src={"ID.svg"} width={15} height={15} alt="customer" />
            </span>
            <input
              type="email"
              placeholder="john@gmail.com"
              id="emailInp"
              autoComplete="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <label>Password</label>
          <div className={styles.input_box} id={styles.password_input}>
            <div className={styles.p}>
              <span className="icon">
                <Image src={"Lock.svg"} alt="lock" height={15} width={15} />
              </span>
              <input 
              type="password" 
              placeholder="••••••••" 
              id="passwordInp" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
            </div>
            <div>
              <a>
                <Image src={"Eye.svg"} alt="lock" height={15} width={15} />
              </a>
            </div>
          </div>

          {/* Login & Reset Buttons */}
          <button className={styles.login_btn} disabled={pending}>Login</button>
          <button className={styles.reset_btn} disabled={pending}>Reset</button>
          {/* sign in with google  */}
          <hr style={{width: '100%'}}/>
          <button className={styles.google_btn} onClick={handleProvider}>
            <span>
              <FcGoogle />
            </span>
            <span>Sign in with google</span>
          </button>

          {/* Forgot Password */}
        </form>
        <p className={styles.forgot_password}>
          <a href="#">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}
