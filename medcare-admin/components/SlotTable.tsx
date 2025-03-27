import React from "react";
import styles from '@/components/styles/slottable.module.css';

interface Slot {
  id: number;
  doctor_id: number;
  user_id: number;
  date: string;
  slot_time: string;
  appointment_type: string;
  status: string;
}

interface SlotTableProps {
  slots: Slot[];
  onApprove: (slotId: number) => void;
  onReject: (slotId: number) => void;
}

const SlotTable: React.FC<SlotTableProps> = ({ slots, onApprove, onReject }) => {
    
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
      
    return (
        <div className={styles.container}>
        {/* Table for larger screens */}
        <table className={styles.slotTable}>
          <thead>
            <tr>
              <th>Slot ID</th>
              <th>Doctor ID</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Slot Time</th>
              <th>Appointment Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.id}</td>
                <td>{slot.doctor_id}</td>
                <td>{slot.user_id}</td>
                <td>{new Date(slot.date).toLocaleDateString()}</td>
                <td>{formatTime(slot.slot_time)}</td>
                <td>{slot.appointment_type}</td>
                <td>
                  <button className={styles.approveBtn} onClick={() => onApprove(slot.id)}>Approve</button>
                  <button className={styles.rejectBtn} onClick={() => onReject(slot.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Cards for smaller screens */}
        <div className={styles.cardContainer}>
          {slots.map((slot) => (
            <div className={styles.card} key={slot.id}>
              <p><strong>Slot ID:</strong> {slot.id}</p>
              <p><strong>Doctor ID:</strong> {slot.doctor_id}</p>
              <p><strong>User ID:</strong> {slot.user_id}</p>
              <p><strong>Date:</strong> {formatDate(slot.date)}</p>
              <p><strong>Slot Time:</strong> {formatTime(slot.slot_time)}</p>
              <p><strong>Type:</strong> {slot.appointment_type}</p>
              <div className={styles.cardActions}>
                <button className={styles.approveBtn} onClick={() => onApprove(slot.id)}>Approve</button>
                <button className={styles.rejectBtn} onClick={() => onReject(slot.id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default SlotTable;
