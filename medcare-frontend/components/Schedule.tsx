'use client'
import React from 'react'
import styles from './styles/schedule.module.css'
import Image from "next/image";

interface ScheduleProps{
    head: string;
    availableSlots: number;
    imgsrc : string;
    times: string[];
    selectedSlot: string | null;
    setSelectedSlot: React.Dispatch<React.SetStateAction<string | null>>;
    

}
const Schedule: React.FC<ScheduleProps> = ({head, availableSlots, imgsrc, times, selectedSlot, setSelectedSlot}) => {
  return (
    <div className={styles.container}>
        {/* schedule header  */}
        <div className={styles.schedule_header}>
          <span>
            <Image src={imgsrc} width={20} height={20} alt={imgsrc} />
            <h3>{head}</h3>
          </span>
          <div>{availableSlots} Slots</div>
        </div>
        <hr />
        {/* schedule time slot  */}
        <div className={styles.timeslot}>
        {times.map((time) => (
            <button
              key={time}
              className={`${styles.schedule_time} ${
                selectedSlot === time
                  ? styles.active
                  : ""
              }`}
              onClick={() => setSelectedSlot(time)}
            >
              {time}
            </button>
          ))}
        </div>
    </div>
  )
}

export default Schedule