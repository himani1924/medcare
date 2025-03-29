import pool from "../../db/index.js";

export const getAllDoctors = async (req, res) => {
    try {
      console.log('inside doc route');
      let { searchTerm, rating, experience, gender, page = 1, limit = 6 } = req.query;
      console.log(searchTerm, rating, experience, gender, page , limit );
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;
  
      let query = "SELECT * FROM doctors WHERE 1=1";
      let countQuery = "SELECT COUNT(*) FROM doctors WHERE 1=1";
      const params = [];
  
      if (searchTerm) {
        query += " AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialty) LIKE LOWER($1) OR EXISTS (SELECT 1 FROM unnest(diseases) AS d WHERE d ILIKE $1))";
        countQuery += " AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialty) LIKE LOWER($1) OR EXISTS (SELECT 1 FROM unnest(diseases) AS d WHERE d ILIKE $1))";
        params.push(`%${searchTerm}%`);
      }

      
  
      if (rating) {
        query += ` AND rating >= $${params.length + 1} and rating < $${params.length + 2}`;
        countQuery += ` AND rating >= $${params.length + 1} and rating < $${params.length + 2}`;
        params.push(Number(rating), Number(rating) + 1);
      }
  
      if (experience) {
        query += ` AND experience >= $${params.length + 1}`;
        countQuery += ` AND experience >= $${params.length + 1}`;
        params.push(Number(experience));
      }
  
      if (gender) {
        query += ` AND gender = $${params.length + 1}`;
        countQuery += ` AND gender = $${params.length + 1}`;
        params.push(gender);
      }
  
      query += ` ORDER BY rating DESC, experience desc LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
  
      // Fetch data
      const doctorsRes = await pool.query(query, params);
      const countRes = await pool.query(countQuery, params.slice(0, -2)); // Remove limit & offset for count query
  
      // Calculate total pages
      const totalDoctors = parseInt(countRes.rows[0].count, 10);
      const totalPages = Math.ceil(totalDoctors / limit);
      console.log( 'result is ',doctorsRes.rows);
  
      res.status(200).json({
        success: true,
        totalDoctors,
        totalPages,
        currentPage: page,
        doctors: doctorsRes.rows,
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  export const getDoctorById = async (req, res) =>{
    try {
        const {id} = req.params;
        const query =   `select * from doctors where id = $1`
        const result = await pool.query(query, [id])
        if(result.rows.length === 0){
            return res.status(404).json({error: "Doctor not found."})
        }
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.log('error fetching doctors', error);
        res.status(500).json({error: "Internal server error"})
    }
  }