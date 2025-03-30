import styles from "./styles/datepicker.module.css";
import dayjs from "dayjs";

interface DatePickerProps {
  dateContainerRef: React.RefObject<HTMLDivElement | null>;
  currentMonth: number;
  dates: { date: string; isDisabled: boolean }[];
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  changeMonth: (direction: "prev" | "next") => void;
  startMonth: number;
  endMonth: number;
  currentYear: number;
}
const DatePicker: React.FC<DatePickerProps> = ({
  currentMonth,
  dateContainerRef,
  dates,
  selectedDate,
  setSelectedDate,
  changeMonth,
  startMonth,
  endMonth,
  currentYear,
}) => {
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
        <button
          onClick={() => changeMonth("prev")}
          disabled={currentMonth === startMonth}
        >
          ◀
        </button>
        <span>
          {dayjs().year(currentYear).month(currentMonth).format("MMMM YYYY")}
        </span>
        <button
          onClick={() => changeMonth("next")}
          disabled={currentMonth === endMonth}
        >
          ▶
        </button>
      </div>

      {/* Scrollable Date Picker with Arrows */}
      <div className={styles.datePickerContainer}>
        <button className={styles.arrow} onClick={scrollLeft}>
          ◀
        </button>
        <div className={styles.datePicker} ref={dateContainerRef}>
          {dates.map(({ date, isDisabled }, index) => (
            <button
              key={index}
              className={selectedDate === date ? styles.selected : ""}
              onClick={() => !isDisabled && setSelectedDate(date)}
              disabled={isDisabled}
            >
              {date}
            </button>
          ))}
        </div>
        <button className={styles.arrow} onClick={scrollRight}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
