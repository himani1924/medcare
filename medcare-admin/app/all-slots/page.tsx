'use client'
import React from 'react'
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import styles from '@/styles/allslots.module.css'

interface Slot {
    id: number;
    date: string;
    slot_time: string;
    appointment_type: string;
    status: string;
    doctor_id: number | null;
    doctor_name: string;
    patient_name: string;
    user_id: number;
  }
const Page = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState('')
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/all-slots`);
        setSlots(response.data.slots);
        console.log(response);
      } catch (error) {
        if(error instanceof AxiosError){
          if (error.response) {
            console.log('no slots');
            setSlots([]);
            return;
          }
        }
        else{
          console.error("Error fetching slots:", error);
        }
      }
    };

    fetchSlots();
  }, []);

  const filteredSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.date);
    const slotMonthYear = `${slotDate.toLocaleString('default', { month: 'long' })} ${slotDate.getFullYear()}`;
    return (
      (selectedMonthYear ? slotMonthYear === selectedMonthYear : true) &&
      (status ? slot.status === status : true) &&
      (doctorId ? slot.doctor_id === doctorId : true)
    );
  });

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
  
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  if(slots.length === 0){
    return(
      <p>No slots</p>
    )
  }
  else{
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.filters}>

<label>Month & Year:</label>
<select value={selectedMonthYear ?? ''} onChange={(e) => setSelectedMonthYear(e.target.value)}>
  <option value="">All</option>
  {Array.from(new Set(slots.map((slot) => {
      const date = new Date(slot.date);
      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    })))
    .sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      const dateA = new Date(`${monthA} 1, ${yearA}`).getTime();
      const dateB = new Date(`${monthB} 1, ${yearB}`).getTime();

      return dateA - dateB;
    })
    .map((monthYear) => (
      <option key={monthYear} value={monthYear}>
        {monthYear}
      </option>
    ))}
</select>


        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>

<label>Doctor ID:</label>
<select value={doctorId ?? ''} onChange={(e) => setDoctorId(e.target.value ? Number(e.target.value) : null)}>
  <option value="">All</option>
  {Array.from(new Set(slots.map((slot) => slot.doctor_id).filter((id)=> id != null))) // Extract unique doctor IDs
  .sort((a, b) => a - b)
    .map((id) => (
      <option key={id} value={Number(id)}>
        {id}
      </option>
    ))}
</select>
        </div>


    {filteredSlots.length ===0 ?(
      <p className={styles.noslots}>No slots available.</p>
    ):(
      <div>
            {/* Table for larger screens */}
    <table className={styles.slotTable}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Slot ID</th>
          <th>Doctor ID</th>
          <th>Doctor Name</th>
          <th>Patient Name</th>
          <th>Slot Time</th>
          <th>Appointment Type</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {filteredSlots.map((slot) => (
          <tr key={slot.id}>
            <td>{formatDate(slot.date)}</td>
            <td>{slot.id}</td>
            <td>{slot.doctor_id}</td>
            <td>{slot.doctor_name}</td>
            <td>{slot.patient_name}</td>
            <td>{formatTime(slot.slot_time)}</td>
            <td>{slot.appointment_type}</td>
            <td style={{ color: slot.status === "confirmed" ? "green" : slot.status === "rejected" ? "red" : "black" }}>
  {slot.status}
</td>

          </tr>
        ))}
      </tbody>
    </table>

    {/* Cards for smaller screens */}
    <div className={styles.cardContainer}>
      {filteredSlots.map((slot) => (
        <div className={styles.card} key={slot.id}>
          <p><strong>Date:</strong> {formatDate(slot.date)}</p>
          <p><strong>Slot ID:</strong> {slot.id}</p>
          <p><strong>Doctor ID:</strong> {slot.doctor_id}</p>
          <p><strong>Doctor Name:</strong> {slot.doctor_name}</p>
          <p><strong>Patient name:</strong> {slot.patient_name}</p>
          <p><strong>Slot Time:</strong> {formatTime(slot.slot_time)}</p>
          <p><strong>Type:</strong> {slot.appointment_type}</p>
          <p><strong>Status:</strong> <span style={{ color: slot.status === "confirmed" ? "green" : slot.status === "rejected" ? "red" : "black" }}>{slot.status}</span> </p>
        </div>
      ))}
    </div>
      </div>
    )}

      </div>

  </div>
  )
}
}

export default Page