'use client'
import React, { useState } from 'react'
import styles from "@/styles/createdoctor.module.css";

const Page = () => {
  const [name, setName] = useState<string>('')
  const [specialty, setSpecialty] = useState<string>('')
  const [experience, setExperience] = useState<number>()
  const [gender, setGender] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [profileImage, setProfileImage] = useState<string>('')
  const [pending, setPending] = useState(false);

  const submitHandler = async (e: React.FormEvent) =>{

    e.preventDefault();
    setPending(true);
    console.log(name, specialty, experience, gender, description, profileImage, pending);
  }

  return (
    <div className={styles.container}>
      <div className={styles.login_box}>
        <h2>Create doctor</h2>

        <form onSubmit={submitHandler} className={styles.login_form}>
          {/* Name */}
          <label>Name</label>
          <div className={styles.input_box}>
            <input
              type="text"
              placeholder="Enter your name"
              id="nameInp"
              autoComplete="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Specialty */}
          <label>Specialty</label>
          <div className={styles.input_box} id={styles.password_input}>
            <div className={styles.p}>
              <input
                type="text" 
                placeholder="Enter specialty"
                id="specialtyInp"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />
            </div>
          </div>

          <label>Experience</label>
          <div className={styles.input_box}>
            <div className={styles.p}>
              <input
                type="number" 
                placeholder="Enter experience"
                id="experienceInp"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <label>Gender</label>
<div className={styles.input_box}>
  <div className={styles.radio_group}>
    <label>
      <input
        type="radio"
        name="gender"
        value="Male"
        checked={gender === "Male"}
        onChange={(e) => setGender(e.target.value)}
        required
      />
      Male
    </label>
    <label>
      <input
        type="radio"
        name="gender"
        value="Female"
        checked={gender === "Female"}
        onChange={(e) => setGender(e.target.value)}
        required
      />
      Female
    </label>
  </div>
</div>
<label>Description</label>
<div className={styles.input_box}>
  <div className={styles.p}>
    <textarea
      placeholder="Enter doctor's description"
      id="descriptionInp"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4} 
      required
    />
  </div>
</div>
<label>Profile image</label>
          <div className={styles.input_box}>
            <input
              type="text"
              placeholder="Image url"
              id="imageInp"
              autoComplete="true"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              required
            />
          </div>


          {/* Login & Reset Buttons */}
          <button className={styles.login_btn} disabled={pending} type="submit">
            Login
          </button>
          <button className={styles.reset_btn} disabled={pending} onClick={() => {
            setName('');
            setSpecialty('')
            setExperience(0)
            setGender('')
            setDescription('')
            setProfileImage('')
          }}>
            Reset
          </button>
          {/* Forgot Password */}
        </form>
        <p className={styles.forgot_password}>
        </p>
      </div>
    </div>
  )
}

export default Page