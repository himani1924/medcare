"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/profile.module.css";
import { useAuth } from "../api/auth/authContext";

interface Slot {
  id: number;
  doctor_id: number;
  user_id: number;
  date: string;
  slot_time: string;
  appointment_type: "video" | "in-person";
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);


  useEffect(() => {
    const fetchSlots = async () => {
      try {
        if (!user) return;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/slots/getslot/${user.id}`
        );
        setSlots(response.data.slots);
      } catch (error) {
        console.error("Error fetching user slots:", error);
      }
    };

    fetchSlots();
  }, [user]);

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <h2 className={styles.profilehead}>User Profile</h2>
        <div className={styles.userDetails}>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
        <h2 className={styles.title}>My Appointments</h2>
        {slots.length > 0 ? (
          <div className={styles.slotContainer}>
            <div className={styles.tableWrapper}>
              <table className={styles.slotTable}>
                <thead>
                  <tr>
                    <th>Slot ID </th>
                    <th>Doctor ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot.id}>
                      <td>{slot.id}</td>
                      <td>{slot.doctor_id}</td>
                      <td>{new Date(slot.date).toLocaleDateString()}</td>
                      <td>
                        {new Date(
                          `1970-01-01T${slot.slot_time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td>{slot.appointment_type}</td>
                      <td className={styles[slot.status]}>{slot.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.cardWrapper}>
              {slots.map((slot) => (
                <div key={slot.id} className={styles.slotCard}>
                  <p>
                    <strong>Slot ID:</strong> {slot.id}
                  </p>
                  <p>
                    <strong>Doctor ID:</strong> {slot.doctor_id}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(slot.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(
                      `1970-01-01T${slot.slot_time}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p>
                    <strong>Type:</strong> {slot.appointment_type}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={styles[slot.status]}>{slot.status}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className={styles.noAppointments}>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
