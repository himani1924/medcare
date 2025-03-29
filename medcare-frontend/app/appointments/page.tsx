import React from "react";
import DoctorAppointment from "@/components/DoctorAppointment";
import Footer from "@/components/Footer";
import styles from '@/styles/booking.module.css'

const page = () => {
    

  return (
    <>
        <DoctorAppointment/>
        <div className={styles.foot}>
        <Footer/>
        </div>
    </>
  );
};

export default page;
