// import React, { useRef, useState, useEffect } from 'react';
import styles from './styles/datepicker.module.css';

interface DatePickerProps{
  setCurrentMonth: React.Dispatch<React.SetStateAction<string >>;
  dateContainerRef: React.RefObject<HTMLDivElement | null>;
  currentMonth: string;
  dates: string[]
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>
}
const DatePicker: React.FC<DatePickerProps> = ({currentMonth, setCurrentMonth, dateContainerRef, dates, selectedDate, setSelectedDate}) => {
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
  const prevMonth = () => {
    setCurrentMonth((prev) => getPreviousMonth(prev ?? "January"));
  };
  
  const nextMonth = () => {
    setCurrentMonth((prev) => getNextMonth(prev ?? "January"));
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
  );
};

export default DatePicker;
