"use client";
import React, { useState } from "react";
import styles from "@/styles/signup.module.css";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const SignupPage = () => {
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful! Redirecting...");
        router.push("/");
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setPending(false);
    }
  };

  const handleProvider = async () => {
    try {
      window.location.href = "http://localhost:5000/api/v1/auth/google";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Google Signup Failed");
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.signup_box}>
        <h2>Sign Up</h2>
        <p>
          Already a member? <a href="#">Login.</a>
        </p>
        <form className={styles.signup_form} onSubmit={handleSubmit}>
          {/* name */}
          <label>Name</label>
          <div className={styles.input_box}>
            <span className="icon">
              <Image src={"ID.svg"} width={15} height={15} alt="customer" />
            </span>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          {/* email */}
          <label>Email</label>
          <div className={styles.input_box}>
            <span className="icon">
              <Image src={"At.svg"} width={15} height={15} alt="customer" />
            </span>
            <input
              type="email"
              placeholder="Enter your email address"
              name="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          {/* password */}
          <label>Password</label>
          <div className={styles.input_box} id={styles.password_input}>
            <div className={styles.p}>
              <span className="icon">
                <Image src={"Lock.svg"} alt="lock" height={15} width={15} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          <button className={styles.submit_btn} disabled={pending}>
            Submit
          </button>
          <button
            className={styles.reset_btn}
            disabled={pending}
            onClick={() => setForm({ name: "", email: "", password: "" })}
          >
            Reset
          </button>
          <hr style={{ width: "100%" }} />
          {/* sign in with google button */}
          <button className={styles.google_btn} onClick={handleProvider}>
            <span>
              <FcGoogle />
            </span>
            <span>Sign up with google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
