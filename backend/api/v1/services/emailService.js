import { sendEmail } from "../utils/nodemailer.js";

export const sendConfirmEmail = async (userEmail, doctorName, appointmentDate) => {
  console.log('inside send confirm email');
    if (!userEmail || !doctorName || !appointmentDate) {
        throw new Error("Missing required fields");
    }
      await sendEmail(
        userEmail,
        "Appointment Confirmation",
        `Your appointment with Dr. ${doctorName} is confirmed on ${appointmentDate}.`,
        `<p>Dear Patient,</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> is confirmed on <strong>${appointmentDate}</strong>.</p>`
      );
      console.log('confirm email sent');
  }

  export const sendRejectEmail = async (userEmail, doctor_name, appointmentDate) => {
    console.log('inside reject email');
  
    if (!userEmail || !doctor_name || !appointmentDate) {
        throw new Error("Missing required fields");
    }
  
      await sendEmail(
        userEmail,
        "Appointment Rejected",
      `We regret to inform you that your appointment with Dr. ${doctor_name} on ${appointmentDate} has been rejected.`,
      `<p>Dear Patient,</p>
       <p>We regret to inform you that your appointment with <strong>Dr. ${doctor_name}</strong> on <strong>${appointmentDate}</strong> has been <span style="color: red;"><strong>rejected</strong></span>.</p>
       <p>Please try booking another slot.</p>`
      );
      console.log('reject email sent');

  }