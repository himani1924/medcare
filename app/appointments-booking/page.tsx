import React from "react";
import styles from "@/styles/appointmentsbooking.module.css";
import Content from "@/components/Content";

const page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Content
          contentheading={`Book Your Next Doctor Visit in Seconds`}
          para={`CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need.`}
        />
      </div>
      <div className={styles.right}></div>
    </div>
  );
};

export default page;
