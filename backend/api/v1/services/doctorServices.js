import pool from "../../db/index.js";

export const getAllDoctors = async () =>{
    try {
        const res = await pool.query("SELECT * FROM doctors");
        return {success: true, data: res.rows}
    } catch (error) {
        return {success: false, message: error.message};
    }
}