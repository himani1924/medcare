"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./appointment.module.css"; 

const Appointment: React.FC = () => {
  const router = useRouter();;
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("Thu 22 Dec");
  const [currentMonth, setCurrentMonth] = useState<string>("December");
  const dateContainerRef = useRef<HTMLDivElement>(null); 

  const dates = ["Thu 22 Dec", "Fri 23 Dec", "Sat 24 Dec", "Sun 25 Dec", "Mon 26 Dec", "Tue 27 Dec", "Wed 28 Dec"];
  const slots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 AM", "12:30 PM"];

  const handleNext = () => {
    if (selectedSlot) {
      alert(`Appointment booked for ${selectedDate} at ${selectedSlot}`);
      router.push("/confirmation");
    } else {
      alert("Please select a slot.");
    }
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => getPreviousMonth(prev));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => getNextMonth(prev));
  };

  // Helper Functions to Get Previous/Next Month
  const getPreviousMonth = (month: string): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const index = months.indexOf(month);
    return index > 0 ? months[index - 1] : months[11]; // Loop back to December if at January
  };

  const getNextMonth = (month: string): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const index = months.indexOf(month);
    return index < 11 ? months[index + 1] : months[0]; // Loop back to January if at December
  };

  const scrollLeft = () => {
    if (dateContainerRef.current) {
      dateContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (dateContainerRef.current) {
      dateContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  return (
  
    <div className={styles.container}>
      {/* Left Side - Text Section */}
      <div className={styles.leftSection}>
        <h1>Book Your Next <br /> Doctor Visit in <br /> Seconds.</h1>
        <p>
          CareMate helps you find the best healthcare provider <br /> by specialty,
          location, and more, ensuring you get the <br />care you need.
        </p>
      </div>

      {/* Right Side - Appointment Booking Component */}
      <div className={styles.rightSection}>
        <div className={styles.card}>

          <div className={styles.cardHeader}>
            <h2>Schedule Appointment</h2>
            <button className={styles.bookBtn}>Book Appointment</button>
          </div>


          <div className={styles.toggleButtons}>
            <button className={styles.active}>Book Video Consult</button>
            <button>Book Hospital Visit</button>
          </div>

          <select className={styles.dropdown}>
            <option>MedicareHeart Institute, Okhla Road</option>
          </select>

          {/* Date Picker */}
          <div className={styles.dateContainer}>

            {/* Month Selector */}
            <div className={styles.monthSelector}>
              <button onClick={prevMonth}>◀</button>
              <span>{currentMonth}</span>
              <button onClick={nextMonth}>▶</button>
            </div>


            {/* Scrollable Date Picker with Arrows */}
            <div className={styles.datePickerContainer}>
              <button className={styles.arrow} onClick={scrollLeft}>◀</button>
              <div className={styles.datePicker} ref={dateContainerRef}>
                {dates.map((date) => (
                  <button
                    key={date}
                    className={selectedDate === date ? styles.selected : ""}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
              <button className={styles.arrow} onClick={scrollRight}>▶</button>
            </div>


          </div>



          {/* Slots Section */}

            <div className={styles.slotCard}>
              {/* Title and First 4 Slots in One Line */}
              <div className={styles.slotHeader}>
              <h3> <Image src="/sun.png" alt="sun" width={12} height={12} /> Morning</h3>
              <div className={styles.firstRowSlots}>
                  2 slots
                </div>
              </div>

              {/* Divider Line */}
              <hr className={styles.divider} />

              {/* Remaining 8 Slots in 2 Rows */}
              <div className={styles.slotGrid}>
                {slots.slice(0, 8).map((slot) => (
                  <button
                    key={slot}
                    className={selectedSlot === slot ? styles.active : ""}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>





            {/* evening */}
            <div className={styles.slotCard}>
              {/* Title and First 4 Slots in One Line */}
              <div className={styles.slotHeader}>
               
                <h3> <Image src="/sunset.png" alt="sunset" width={12} height={12} /> Evening</h3>
                <div className={styles.firstRowSlots}>
                  8 slots
                </div>
              </div>

              {/* Divider Line */}
              <hr className={styles.divider} />

              {/* Remaining 8 Slots in 2 Rows */}
              <div className={styles.slotGrid}>
                {slots.slice(0, 8).map((slot) => (
                  <button
                    key={slot}
                    className={selectedSlot === slot ? styles.active : ""}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          

          {/* Next Button */}
          <button className={styles.nextBtn} onClick={handleNext}>Next</button>
        </div>
      </div>
    </div >


  );
};

export default Appointment;
