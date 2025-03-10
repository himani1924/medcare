"use client";
import { useState } from "react";
import React from "react";
import styles from "./styles/scheduleappointments.module.css";
import DatePicker from "./DatePicker";
import Schedule from "./Schedule";

export default function ScheduleAppointment() {
  const [selectedOption, setSelectedOption] = useState("video");
  //   const [selectedDate, setSelectedDate] = useState<string>("Thu 22 Dec");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  //   const dates: string[] = [
  //     "Thu 22 Dec",
  //     "Fri 23 Dec",
  //     "Sat 24 Dec",
  //     "Sun 25 Dec",
  //     "Mon 26 Dec",
  //     "Tue 27 Dec",
  //     "Wed 28 Dec",
  //   ];

  const slots: { morning: string[]; afternoon: string[] } = {
    morning: [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 AM",
    ],
    afternoon: [
      "9:00 PM",
      "9:30 PM",
      "10:00 PM",
      "10:30 PM",
      "11:00 PM",
      "12:00 PM",
      "12:30 PM",
    ],
  };

  return (
    <div className={styles.container}>
      {/* Schedule and book appointment */}
      <div className={styles.appointment_head}>
        <h2>Schedule Appointment</h2>
        <button>Book Appointment</button>
      </div>
      {/* buttons - for booking type */}
      <div className={styles.buttonToggleContainer}>
        <button
          type="button"
          className={`${styles.button} ${
            selectedOption === "video" ? styles.active : ""
          }`}
          onClick={() => setSelectedOption("video")}
        >
          Book Video Consult
        </button>
        <button
          type="button"
          className={`${styles.button} ${
            selectedOption === "hospital" ? styles.active : ""
          }`}
          onClick={() => setSelectedOption("hospital")}
        >
          Book Hospital Visit
        </button>
      </div>
      {/* location */}
      <select className={styles.location}>
        <option value="">MedicareHeart Institute, Okhla Road</option>
      </select>
      {/* making dates slider */}
      <DatePicker />

      {/* morning schedule */}
      <Schedule
      head={`Morning`}
      availableSlots={2}
      imgsrc={"sun.svg"}
      times={slots.morning}
      selectedSlot={selectedSlot}
      setSelectedSlot={setSelectedSlot}

      />
      {/* afternoon slot  */}
      <Schedule
      head={`Afternoon`}
      availableSlots={2}
      imgsrc={"sunset.svg"}
      times={slots.afternoon}
      selectedSlot={selectedSlot}
      setSelectedSlot={setSelectedSlot}

      />
      {/* button  */}
      <button className={styles.next}>
        Next
      </button>
    </div>
  );
}
