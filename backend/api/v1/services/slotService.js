import pool from "../../db/index.js";

export const getSlots = async (req, res) =>{
    const {doctorId} = req.params;
    const date = req.query;

    if(!date) return res.status(400).json({
        error: 'Date is required'
    })


    try {
        console.log('date1 is : ', date.date);
        const bookedSlotsRes = await pool.query(`select slot_time from appointments where doctor_id = $1 and date = $2`,[doctorId, date.date])
        const bookedSlots = bookedSlotsRes.rows.map(row=> row.slot_time)
        const formattedSlots = bookedSlots.map((slot) => {
            const [hours, minutes] = slot.split(":").map(Number);
            return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          });
        const morningSlots= [ "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"]
        const eveningSlots= [ "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "12:30 AM"]
        const availableMorningSlots = morningSlots.filter(slot => !formattedSlots.includes(slot))
        const availableEveningSlots = eveningSlots.filter(slot => !formattedSlots.includes(slot))
        res.status(200).json({
            doctorId,
            date,
            morningSlots,
            eveningSlots,
            availableEveningSlots, 
            availableMorningSlots,
            bookedSlots
        })
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error.'
        })
    }
}

export const bookSlot = async (req, res) =>{
    const {doctorId, userId, date, slotTime, appointmentType} = req.body;

    if(!doctorId || !userId || !date || !slotTime || !appointmentType){
        return res.status(400).json({
            error: 'All fields are required!'
        })
    }
    // console.log(doctorId, userId, date, slotTime, appointmentType);

    try {
        const checkslot = await pool.query(`select * from appointments where doctor_id = $1 and date = $2 and slot_time = $3`,[doctorId, date, slotTime])
        if(checkslot.rows.length >0){
            return res.status(400).json({
                error: "Slot is already booked"
            })
        }
        await pool.query(`insert into slots(doctor_id, user_id, date, slot_time, appointment_type, status) VALUES ($1, $2, $3, $4, $5, 'pending')`, [doctorId, userId, date, slotTime, appointmentType])
        res.status(200).json({
            message: 'Slot booked successfully, pending approval'
        }) 
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export const slotsByUserId = async (req, res) =>{
    const { userId } = req.params;
    console.log(userId);
    console.log('inside slot');

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await pool.query(`SELECT * FROM slots WHERE user_id = $1 ORDER BY date ASC, slot_time ASC`, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No slots found for this user." });
        }
        console.log(result.rows);
        res.status(200).json({ slots: result.rows });
    } catch (error) {
        console.error("Error fetching user slots:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}