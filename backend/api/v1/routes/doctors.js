import express from 'express'
import pool from '../../db/index.js'

const router = express.Router()

router.get('/', async (req, res)=>{
    try {
        const {specialty, gender, rating, experience, search, page=1, limit=6}=req.query;
        let query = 'select * from doctors where 1=1'
        let values =[]
        let index=1;

        if(specialty){
            query += ` and specialty ilike $${index}`
            values.push(`%${specialty}%`);
            index++;
        }
        if (gender) {
            query += ` AND gender = $${index}`;
            values.push(gender);
            index++;
          }
          if (rating) {
            query += ` AND rating >= $${index}`;
            values.push(parseFloat(rating));
            index++;
          }
          if (experience) {
            query += ` AND experience >= $${index}`;
            values.push(parseInt(experience));
            index++;
          }
          if (search) {
            query += ` AND name ILIKE $${index}`;
            values.push(`%${search}%`);
            index++;
          }

        //   pagination 
        query += ` ORDER BY rating DESC LIMIT $${index} OFFSET $${index + 1}`;
        values.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        console.log("Executing Query:", query, values); 

        const doctors = await pool.query(query, values);
        res.status(200).json({ success: true, data: doctors.rows });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

export default router