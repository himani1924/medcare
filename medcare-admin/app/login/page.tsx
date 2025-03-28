"use client";
import React from "react";
import styles from "@/styles/login.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../api/auth/authContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setPending(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.error("something went wrong");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.login_box}>
        <h2>Login</h2>

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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                id="passwordInp"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <div onClick={togglePassword}>
                {showPassword ? (
                  <span>
                    <FaEyeSlash />
                  </span>
                ) : (
                  <span>
                    <FaEye></FaEye>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Login & Reset Buttons */}
          <button className={styles.login_btn} disabled={pending} type="submit">
            Login
          </button>
          <button className={styles.reset_btn} disabled={pending} onClick={() => {setEmail(''); setPassword('')}}>
            Reset
          </button>
          {/* Forgot Password */}
        </form>
        <p className={styles.forgot_password}>
        </p>
      </div>
    </div>
  );
}
