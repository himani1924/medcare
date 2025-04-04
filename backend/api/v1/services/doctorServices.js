import pool from "../../db/index.js";

export const getAllDoctors = async (req, res) => {
  try {
    let {
      searchTerm,
      rating,
      experience,
      gender,
      page = 1,
      limit = 6,
    } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM doctors WHERE 1=1";
    let countQuery = "SELECT COUNT(*) FROM doctors WHERE 1=1";
    const params = [];

    if (searchTerm) {
      query +=
        " AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialty) LIKE LOWER($1) OR EXISTS (SELECT 1 FROM unnest(diseases) AS d WHERE d ILIKE $1))";
      countQuery +=
        " AND (LOWER(name) LIKE LOWER($1) OR LOWER(specialty) LIKE LOWER($1) OR EXISTS (SELECT 1 FROM unnest(diseases) AS d WHERE d ILIKE $1))";
      params.push(`%${searchTerm}%`);
    }

    if (rating) {
      query += ` AND rating >= $${params.length + 1} and rating < $${
        params.length + 2
      }`;
      countQuery += ` AND rating >= $${params.length + 1} and rating < $${
        params.length + 2
      }`;
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

    query += ` ORDER BY rating DESC, experience desc LIMIT $${
      params.length + 1
    } OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    // Fetch data
    const doctorsRes = await pool.query(query, params);
    const countRes = await pool.query(countQuery, params.slice(0, -2)); // Remove limit & offset for count query

    // Calculate total pages
    const totalDoctors = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(totalDoctors / limit);

    res.status(200).json({
      success: true,
      totalDoctors,
      totalPages,
      currentPage: page,
      doctors: doctorsRes.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `select * from doctors where id = $1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rateDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { userId, newrating } = req.body;

  if (!newrating || newrating < 1 || newrating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  try {
    const doc = await pool.query("select id from doctors where id = $1", [
      doctorId,
    ]);
    if (!doc.rows.length) {
      return res.status(400).json({ error: "Doctor not found" });
    }
    const existingRating = await pool.query(
      "select id from doctor_ratings where doctor_id = $1 and user_id = $2",
      [doctorId, userId]
    );

    if (existingRating.rows.length > 0) {
      await pool.query(
        "update doctor_ratings set rating = $1 where doctor_id = $2 and user_id = $3",
        [newrating, doctorId, userId]
      );
    } else {
      await pool.query(
        "insert into doctor_ratings (doctor_id, user_id, rating) values ($1, $2, $3)",
        [doctorId, userId, newrating]
      );
    }
    const avg = await pool.query(
      "select avg(rating) :: numeric(2,1) as avg_rating from doctor_ratings where doctor_id = $1",
      [doctorId]
    );
    const avgRating = avg?.rows[0].avg_rating || 0;
    await pool.query("update doctors set rating = $1 where id = $2", [
      avgRating,
      doctorId,
    ]);
    res
      .status(200)
      .json({
        message: "Rating submitted successfully",
        average_rating: avgRating,
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRating = async (req, res) => {
  const { doctorId } = req.params;
  const { userId } = req.query;

  try {
    const ratings = await pool.query(
      "SELECT rating FROM doctor_ratings WHERE doctor_id = $1 and user_id = $2",
      [doctorId, userId]
    );
    res.json(ratings.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addReview = async (req, res) => {
  const { doctorId } = req.params;
  const { userId, review } = req.body;

  if (!review || !userId) {
    return res.status(400).json({ error: "Review and User ID are required" });
  }
  try {
    await pool.query(
      "insert into doctorreviews (doctor_id, user_id, review) values ($1, $2, $3)",
      [doctorId, userId, review]
    );
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getReviews = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const result = await pool.query(
      "SELECT dr.review, u.name AS user_name, dr.created_at FROM doctorreviews dr JOIN users u ON dr.user_id = u.id WHERE doctor_id = $1 ORDER BY dr.created_at DESC limit 5",
      [doctorId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT dr.review, u.name AS user_name, d.name AS doctor_name, dr.created_at 
             FROM doctorreviews dr
             JOIN users u ON dr.user_id = u.id
             JOIN doctors d ON dr.doctor_id = d.id
             ORDER BY dr.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
