'use client'
import React, { useState } from "react";
import styles from "@/styles/signup.module.css";
import { FcGoogle } from "react-icons/fc";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
const SignupPage = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setPending(false);
      toast.success('Signup successful')
      router.push("/login");
    } else if (res.status === 500 || res.status === 400) {
      setError(data.message);
      setPending(false);
      toast.error(error)
    }
  };

  const handleProvider = async (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault() 
    try {
      await signIn('google', {callbackUrl:'/'})
      toast.success('Signup successful')
    } catch (error) {
      if(error instanceof Error){
        if(error.message === 'User already exists'){
          toast.error(error.message)
        }
        else{
          toast.error(error.message)
        }
      }
      else{
        toast.error('Some unknown error occured.')
      }
      
    }
    
  }
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
                type="password"
                placeholder="••••••••"
                name="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div>
              <a>
                <Image src={"Eye.svg"} alt="lock" height={15} width={15} />
              </a>
            </div>
          </div>
          <button className={styles.submit_btn} disabled={pending}>Submit</button>
          <button className={styles.reset_btn} disabled={pending}>Reset</button>
          <hr style={{width: '100%'}}/>
          {/* sign in with google button */}
          <button className={styles.google_btn} onClick={handleProvider}><span><FcGoogle/></span><span>Sign up with google</span></button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
