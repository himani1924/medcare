import pool from "../../db/index.js";

export const getAllDoctors = async (req, res) => {
    try {
      console.log('inside doc route');
      let { searchTerm, rating, experience, gender, page = 1, limit = 6 } = req.query;
      console.log(searchTerm, rating, experience, gender, page , limit );
      // Convert to numbers where necessary
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;
  
      // Construct base query
      let query = "SELECT * FROM doctors WHERE 1=1";
      let countQuery = "SELECT COUNT(*) FROM doctors WHERE 1=1";
      const params = [];
  
      // 🔹 Search by name or specialty
      if (searchTerm) {
        query += " AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialty) LIKE LOWER($1))";
        countQuery += " AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialty) LIKE LOWER($1))";
        params.push(`%${searchTerm}%`);
      }
  
      // 🔹 Filter by rating (single value)
      if (rating) {
        query += ` AND rating = $${params.length + 1}`;
        countQuery += ` AND rating = $${params.length + 1}`;
        params.push(Number(rating));
      }
  
      // 🔹 Filter by experience
      if (experience) {
        query += ` AND experience >= $${params.length + 1}`;
        countQuery += ` AND experience >= $${params.length + 1}`;
        params.push(Number(experience));
      }
  
      // 🔹 Filter by gender
      if (gender) {
        query += ` AND gender = $${params.length + 1}`;
        countQuery += ` AND gender = $${params.length + 1}`;
        params.push(gender);
      }
  
      // 🔹 Sorting by experience (highest first) & apply pagination
      query += ` ORDER BY experience DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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