import React, { useState } from "react";
import styles from "@/components/styles/slottable.module.css";

interface Slot {
  id: number;
  date: string;
  slot_time: string;
  appointment_type: string;
  status: string;
  doctor_id: number;
  doctor_name: string;
  patient_name: string;
}

interface SlotTableProps {
  slots: Slot[];
  onApprove: (slotId: number) => void;
  onReject: (slotId: number) => void;
}

const SlotTable: React.FC<SlotTableProps> = ({
  slots,
  onApprove,
  onReject,
}) => {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  const filteredSlots = slots.filter((slot) => {
    return doctorId ? slot.doctor_id === doctorId : true;
  });

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAction = async (slotId: number, action: "approve" | "reject") => {
    setLoading((prev) => ({ ...prev, [slotId]: true }));

    try {
      if (action === "approve") {
        await onApprove(slotId);
      } else {
        await onReject(slotId);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [slotId]: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div>
          <label>Doctor Name:</label>
          <select
          className={styles.selectval}
            value={doctorId ?? ""}
            onChange={(e) =>
              setDoctorId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">All</option>
            {Array.from(
  new Map(
    slots
      .filter((slot) => slot.doctor_id != null)
      .map((slot) => [slot.doctor_id, slot.doctor_name]) // Unique doctor_id -> doctor_name mapping
  ).entries()
)
  .sort((a, b) => a[1].localeCompare(b[1])) // Sort alphabetically by doctor name
  .map(([id, name]) => (
    <option key={id} value={Number(id)}>
      {name}
    </option>
  ))}

          </select>
        </div>
        <a href="/admin/all-slots">
          <div className={styles.history}> Get Appointment history</div>
        </a>
      </div>

      {/* Table for larger screens */}
      <table className={styles.slotTable}>
        <thead>
          <tr>
            <th>Slot ID</th>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Patient Name</th>
            <th>Date</th>
            <th>Slot Time</th>
            <th>Appointment Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSlots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.id}</td>
              <td>{slot.doctor_id}</td>
              <td>{slot.doctor_name}</td>
              <td>{slot.patient_name}</td>
              <td>{new Date(slot.date).toLocaleDateString()}</td>
              <td>{formatTime(slot.slot_time)}</td>
              <td>{slot.appointment_type}</td>
              <td>
              <button
                className={styles.approveBtn}
                onClick={() => handleAction(slot.id, "approve")}
                disabled={loading[slot.id]}
              >
                {loading[slot.id] ? <span className={styles.spinner}></span> : "Approve"}
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => handleAction(slot.id, "reject")}
                disabled={loading[slot.id]}
              >
                {loading[slot.id] ? <span className={styles.spinner}></span> : "Reject"}
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards for smaller screens */}
      <div className={styles.cardContainer}>
        {filteredSlots.map((slot) => (
          <div className={styles.card} key={slot.id}>
            <p>
              <strong>Slot ID:</strong> {slot.id}
            </p>
            <p>
              <strong>Doctor ID:</strong> {slot.doctor_id}
            </p>
            <p>
              <strong>Doctor Name:</strong> {slot.doctor_name}
            </p>
            <p>
              <strong>Patient Name:</strong> {slot.patient_name}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(slot.date)}
            </p>
            <p>
              <strong>Slot Time:</strong> {formatTime(slot.slot_time)}
            </p>
            <p>
              <strong>Type:</strong> {slot.appointment_type}
            </p>
            <div className={styles.cardActions}>
            <button
                className={styles.approveBtn}
                onClick={() => handleAction(slot.id, "approve")}
                disabled={loading[slot.id]}
              >
                {loading[slot.id] ? <span className={styles.spinner}></span> : "Approve"}
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => handleAction(slot.id, "reject")}
                disabled={loading[slot.id]}
              >
                {loading[slot.id] ? <span className={styles.spinner}></span> : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotTable;