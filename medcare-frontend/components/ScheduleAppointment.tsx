"use client";
import { useEffect, useState } from "react";
import React from "react";
import styles from "./styles/scheduleappointments.module.css";
import DatePicker from "./DatePicker";
import { useRef } from 'react';
import dayjs from "dayjs";
import Schedule from "./Schedule";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/api/auth/authContext";

export default function ScheduleAppointment() {

  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const {user} = useAuth()
  
  const today = dayjs()
  const currentYear = dayjs().year();
  const startMonth = today.month()
  const endMonth = today.month() === 0 ? 11 : today.month()-1

  const [selectedOption, setSelectedOption] = useState("video");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ morningSlots: string[]; eveningSlots: string[]; availableMorningSlots: string[]; availableEveningSlots: string[]; }>({morningSlots: [], eveningSlots: [], availableMorningSlots: [], availableEveningSlots: []});
  const [selectedMonth, setSelectedMonth] = useState(today.month())
  const [dates, setDates] = useState<{date: string; isDisabled: boolean}[]>([])
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(()=>{generateDatesForMonth(selectedMonth)},[selectedMonth])
  useEffect(()=>{ if(selectedDate){ fetchSlots() }},[selectedDate])

  const fetchSlots = async ()=>{
    try {
      console.log('triggered');
      const rawDate = selectedDate + " " + selectedYear
      const formattedDate = dayjs(rawDate, "ddd DD MMM YYYY").format("DD-MMM-YYYY").toUpperCase()
      console.log(formattedDate);
      const res = await axios.get(`${API_URL}/slots/${doctorId}?date=${formattedDate}`);
      const data = res.data;
      console.log('data====>>>>>',data);

      setSlots({
        morningSlots: data.morningSlots,
        eveningSlots: data.eveningSlots,
        availableMorningSlots: data.availableMorningSlots,
        availableEveningSlots: data.availableEveningSlots,
      });
    } catch (error) {
      console.log('Error fetching slots', error);
    }
  }

  const handleBooking = async () => {
    if(!selectedDate || !selectedMonth || !selectedSlot || !doctorId){
      toast.error('Please select all fields.')
      return;
    }
    try {
      const rawDate = selectedDate + " " + selectedYear
      const formattedDate = dayjs(rawDate, "ddd DD MMM YYYY").format("DD-MMM-YYYY").toUpperCase()
      const response = await axios.post(`${API_URL}/slots/book`,{
        doctorId: doctorId,
        userId: user?.id,
        date: formattedDate, 
        slotTime: selectedSlot,
        appointmentType: selectedOption
      })

      if(response.status === 200){
        toast.success(response.data.message)
        router.push('/profile')
      }
      if(response.data.error){
        toast.error(response.data.error)
      }
    } catch (err) {
      if(err instanceof Error){
        toast.error(err.message)   
      }
    }
  };

  const generateDatesForMonth =(month: number)=>{
    const year = today.year() + (month < today.month() ? 1 : 0)
    const startDate = dayjs(`${year}-${month + 1}-01`)
    const daysInMonth = startDate.daysInMonth();

    const newDates = Array.from({length: daysInMonth}, (_, i)=>{
      const date = startDate.add(i, "day")
      return {
        date: date.format('ddd DD MMM'),
        isDisabled : date.isBefore(today, 'day')
      }
    })
    setDates(newDates)
  }

  const changeMonth = (direction: "prev" | "next") => {
    setSelectedMonth((prevMonth) => {
      let newMonth = prevMonth + (direction === "next" ? 1 : -1);
      let newYear = selectedYear;
  
      // Handle year transitions
      if (newMonth > 11) { // Exceeds December
        newMonth = 0; // Move to January
        newYear += 1;
      } else if (newMonth < 0) { // Before January
        newMonth = 11; // Move to December
        newYear -= 1;
      }
  
      // Prevent going before March 2025 or after Feb 2026
      if (newYear === 2025 && newMonth < startMonth) return prevMonth;
      if (newYear === 2026 && newMonth > endMonth) return prevMonth;
  
      setSelectedYear(newYear); // Update year only if month is valid
      return newMonth;
    });
  };
  if (!doctorId) {
    return <p>Error: Doctor ID is missing</p>;
  }
  return (
    <div className={styles.container}>
      {/* Schedule and book appointment */}
      <div className={styles.appointment_head}>
        <h2>Schedule Appointment</h2>
        <button onClick={handleBooking}>Book Appointment</button>
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
      <DatePicker 
      currentMonth={selectedMonth}
      currentYear = {selectedYear}
      dateContainerRef={dateContainerRef}
      dates={dates}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      changeMonth={changeMonth}
      startMonth={startMonth}
      endMonth={endMonth}
      />

      {/* morning schedule */}
      <Schedule
      head={`Morning`}
      availableSlots={slots.availableMorningSlots.length}
      imgsrc={"sun.svg"}
      times={slots.morningSlots}
      selectedSlot={selectedSlot}
      setSelectedSlot={setSelectedSlot}
      disabledSlots={slots.morningSlots.filter(slot => !slots.availableMorningSlots.includes(slot))}

      />
      {/* afternoon slot  */}
      <Schedule
      head={`Afternoon`}
      availableSlots={slots.availableEveningSlots.length}
      imgsrc={"sunset.svg"}
      times={slots.eveningSlots}
      selectedSlot={selectedSlot}
      setSelectedSlot={setSelectedSlot}
      disabledSlots={slots.eveningSlots.filter(slot => !slots.availableEveningSlots.includes(slot))}

      />
      {/* button  */}
      <button className={styles.next} onClick={handleBooking}>
        Next
      </button>
    </div>
  );
}
