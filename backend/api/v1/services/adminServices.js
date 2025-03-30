import pool from "../../db/index.js";
import { sendConfirmEmail, sendRejectEmail } from "./emailService.js";

export const createDoctor = async (req, res) => {
  try {
    const { name, specialty, experience, gender, description, diseases } =
      req.body;
    const profile_image = req.file ? req.file.path : "/blank-profile.png";
    if (
      !name ||
      !specialty ||
      !experience ||
      !gender ||
      !description ||
      !diseases
    ) {
      return res.status(400).json({
        error: "Please fill all required fields",
      });
    }
    const diseasesArray = diseases.split(",").map((d) => d.trim());
    await pool.query(
      `insert into doctors(name, specialty, experience, gender, description, profile_image, diseases) values($1, $2, $3, $4, $5, $6, $7)`,
      [
        name,
        specialty,
        experience,
        gender,
        description,
        profile_image,
        diseasesArray,
      ]
    );
    res.status(200).json({
      message: "Doctor added",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, specialty, experience, gender, description, diseases } =
    req.body;
  try {
    const checkDoctor = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [id]
    );

    if (checkDoctor.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const diseasesArray = `{${diseases
      .split(",")
      .map((d) => d.trim())
      .join(",")}}`;
    const profile_image = req.file
      ? req.file.path
      : checkDoctor.rows[0].profile_image;
    await pool.query(
      `UPDATE doctors 
         SET 
          name = COALESCE($1, name), 
          specialty = COALESCE($2, specialty), 
          experience = COALESCE($3, experience), 
          gender = COALESCE($4, gender), 
          description = COALESCE($5, description), 
          profile_image = COALESCE($6, profile_image) ,
          diseases = COALESCE($7, diseases)
         WHERE id = $8`,
      [
        name,
        specialty,
        experience,
        gender,
        description,
        profile_image,
        diseasesArray,
        id,
      ]
    );
    res.status(200).json({
      message: "Doctor updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await pool.query(`select * from doctors`, []);
    if (doctors.rows.length === 0) {
      return res.status(400).json({
        message: "No doctors found.",
      });
    }
    res.status(200).json({
      doctors: doctors.rows,
    });
  } catch (error) {}
};

export const getAllPendingSlots = async (req, res) => {
  try {
    const slots = await pool.query(
      `SELECT 
    s.id AS id, 
    s.date, 
    s.slot_time, 
    s.appointment_type, 
    s.status, 
    d.id AS doctor_id, 
    d.name AS doctor_name, 
    u.name AS patient_name
FROM slots s
JOIN doctors d ON s.doctor_id = d.id
JOIN users u ON s.user_id = u.id
where status = 'pending';
`,
      []
    );
    if (slots.rows.length === 0) {
      return res.status(400).json({
        error: "No slots found.",
      });
    }
    res.status(200).json({
      slots: slots.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllSlots = async (req, res) => {
  try {
    const slots = await pool.query(
      `SELECT 
    s.id AS id, 
    s.date, 
    s.slot_time, 
    s.appointment_type, 
    s.status, 
    d.id AS doctor_id, 
    d.name AS doctor_name, 
    u.name AS patient_name
FROM slots s
JOIN doctors d ON s.doctor_id = d.id
JOIN users u ON s.user_id = u.id
ORDER BY s.date desc;
`,
      []
    );
    if (slots.rows.length === 0) {
      return res.status(400).json({
        error: "No slots found.",
      });
    }
    res.status(200).json({
      slots: slots.rows,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const getslot = await pool.query(
      `SELECT s.*, u.email AS user_email, d.name AS doctor_name
             FROM slots s
             JOIN users u ON s.user_id = u.id
             JOIN doctors d ON s.doctor_id = d.id
             WHERE s.id = $1`,
      [slotId]
    );
    if (getslot.rows.length === 0) {
      return res.status(400).json({
        error: "Slot does not exist",
      });
    }
    const { user_email, doctor_name, date } = getslot.rows[0];
    await pool.query(`UPDATE slots SET status = 'rejected' where id = $1`, [
      slotId,
    ]);
    await sendRejectEmail(user_email, doctor_name, date);
    res.status(200).json({
      message: "Slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const approveSlot = async (req, res) => {
  const { slotId } = req.params;
  let client;

  try {
    client = await pool.getClient();
    await client.query("BEGIN");
    const slotQuery = await client.query(
      `SELECT s.*, u.email as user_email 
             FROM slots s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.id = $1 FOR UPDATE`,
      [slotId]
    );

    if (slotQuery.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Slot not found" });
    }

    const { doctor_id, user_id, date, slot_time, appointment_type } =
      slotQuery.rows[0];

    await client.query(
      `INSERT INTO appointments (user_id, doctor_id, slot_id, date, slot_time, appointment_type, status) 
         VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')`,
      [user_id, doctor_id, slotId, date, slot_time, appointment_type]
    );

    await client.query("UPDATE slots SET status = 'confirmed' WHERE id = $1", [
      slotId,
    ]);

    const rejectedSlotsQuery = await client.query(
      `UPDATE slots 
         SET status = 'rejected' 
         WHERE doctor_id = $1 AND date = $2 AND slot_time = $3 AND id != $4 
         RETURNING user_id`,
      [doctor_id, date, slot_time, slotId]
    );
    const slotDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const slotTime = new Date(`1970-01-01T${slot_time}`).toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit", hour12: true }
    );

    const rejectedUserIds = rejectedSlotsQuery.rows.map((row) => row.user_id);
    let rejectedUsersEmails = [];

    if (rejectedUserIds.length > 0) {
      const rejectedUsersQuery = await client.query(
        `SELECT email FROM users WHERE id = ANY($1)`,
        [rejectedUserIds]
      );
      rejectedUsersEmails = rejectedUsersQuery.rows.map((row) => row.email);
    }

    await client.query("COMMIT");

    const doctorQuery = await pool.query(
      "SELECT name FROM doctors WHERE id = $1",
      [doctor_id]
    );
    if (doctorQuery.rowCount === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const doctorName = doctorQuery.rows[0].name;

    const userQuery = await pool.query(
      "SELECT email FROM users WHERE id = $1",
      [user_id]
    );
    if (userQuery.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userEmail = userQuery.rows[0].email;
    await sendConfirmEmail(
      userEmail,
      doctorName,
      slotDate,
      slotTime,
      appointment_type
    );
    await Promise.all(
      rejectedUsersEmails.map((email) =>
        sendRejectEmail(email, doctorName, date)
      )
    );

    res.status(200).json({ message: "Slot approved successfully!" });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Error approving slot:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) client.release();
  }
};

export const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const checkDoctor = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [id]
    );

    if (checkDoctor.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    await pool.query(`delete from doctors where id = $1`, [id]);
    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
