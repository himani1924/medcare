import React from "react";
import styles from "@/styles/appointmentsbooking.module.css";
import Content from "@/components/Content";
import ScheduleAppointment from "@/components/ScheduleAppointment";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div>
      <div className={styles.container}>
        {/* left side */}
        <div className={styles.left}>
          <Content
            contentheading={`Book Your Next Doctor Visit in Seconds`}
            para={`CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need.`}
          />
        </div>
        {/* right side */}
        <div className={styles.right}>
          <ScheduleAppointment />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
