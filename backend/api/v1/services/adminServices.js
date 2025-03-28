import pool from "../../db/index.js";

export const createDoctor = async (req, res) =>{
    try {
        const {name, specialty, experience, gender, description } = req.body;
        const profile_image = req.file ? req.file.path : '/blank-profile.png';
        if(!name || !specialty || !experience || !gender){
            return res.status(400).json({
                error: 'Please fill all required fields'
            })
        }
        await pool.query(`insert into doctors(name, specialty, experience, gender, description, profile_image) values($1, $2, $3, $4, $5, $6)`,[name, specialty, experience, gender, description, profile_image])
        res.status(200).json({
            message: 'Doctor added'
        })
    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
}

export const updateDoctor = async (req, res) =>{
    const {id} = req.params;
    const {name, specialty, experience, rating, gender, description} = req.body;
    try {
        const checkDoctor = await pool.query("SELECT * FROM doctors WHERE id = $1", [id]);

    if (checkDoctor.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const profile_image = req.file ? req.file.path : checkDoctor.rows[0].profile_image;
    await pool.query(
        `UPDATE doctors 
         SET 
          name = COALESCE($1, name), 
          specialty = COALESCE($2, specialty), 
          experience = COALESCE($3, experience), 
          rating = COALESCE($4, rating), 
          gender = COALESCE($5, gender), 
          description = COALESCE($6, description), 
          profile_image = COALESCE($7, profile_image) 
         WHERE id = $8`,
        [name, specialty, experience, rating, gender, description, profile_image, id]
      );
      res.status(200).json({
        message: "Doctor updated successfully",
      });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllDoctors = async (req, res) =>{
    try {
        const doctors = await pool.query (`select * from doctors`, [])
        if(doctors.rows.length ===0){
            return res.status(400).json({
                message: 'No doctors found.'
            })
        }
        res.status(200).json({
            doctors: doctors.rows
        })
    } catch (error) {
        
    }
}

export const getAllSlots = async (req, res) =>{
    try {
        'inside slots'
        const slots = await pool.query (`select * from slots where status = 'pending'`, [])
        if(slots.rows.length ===0){
            console.log('inside empty array');
            return res.status(400).json({
                error: 'No slots found.'
            })
        }
        console.log(slots.rows);
        res.status(200).json({
            slots: slots.rows
        })
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const deleteSlot = async (req, res) =>{
    try {
        const {slotId} = req.params;
        const getslot = await pool.query(`select * from slots where id = $1`, [slotId])
        if(getslot.rows.length === 0){
            return res.status(400).json({
                error: 'Slot does not exist'
            })
        }
        await pool.query(`UPDATE slots SET status = 'rejected' where id = $1`,[slotId])
        res.status(200).json({
            message: 'Slot deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong'
        })
    }
}

export const approveSlot = async (req, res) => {
    const { slotId } = req.params;
  
    try {
      const slotQuery = await pool.query(
        "SELECT * FROM slots WHERE id = $1",
        [slotId]
      );
      console.log('slotquery ===>>>>>>', slotQuery.rows);
  
      if (slotQuery.rowCount === 0) {
        return res.status(404).json({ error: "Slot not found" });
      }
  
      const { doctor_id, user_id, date, slot_time, appointment_type} = slotQuery.rows[0];
  
      const insertAppointment = pool.query(
        `INSERT INTO appointments (user_id, doctor_id, slot_id, date, slot_time, appointment_type, status) 
         VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')`,
        [user_id, doctor_id, slotId, date, slot_time, appointment_type]
      );
  
      const updateConfirmedSlot = pool.query(
        "UPDATE slots SET status = 'confirmed' WHERE id = $1",
        [slotId]
      );

      const rejectOtherSlots = pool.query(
        `UPDATE slots 
         SET status = 'rejected' 
         WHERE doctor_id = $1 AND date = $2 AND slot_time = $3 AND id != $4 returning user_id`,
        [doctor_id, date, slot_time, slotId]
      );
  
      await Promise.all([insertAppointment, updateConfirmedSlot, rejectOtherSlots]);
  
      res.status(200).json({ message: "Slot approved successfully!" });
  
    } catch (error) {
      console.error("Error approving slot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const deleteDoctor = async (req, res) =>{
    const {id} = req.params;
    try {
        const checkDoctor = await pool.query("SELECT * FROM doctors WHERE id = $1", [id]);

    if (checkDoctor.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    await pool.query(
        `delete from doctors where id = $1`,
        [id]
      );
      res.status(200).json({
        message: "Doctor deleted successfully",
      });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }   
}
  