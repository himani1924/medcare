export interface Appointment {
    id?: number;
    patientId: number;
    doctorId: number;
    slotId: number;
    status: "pending" | "approved" | "rejected"; 
  }
  