import pool from "../../db/index.js";
import crypto from 'crypto'
import { sendEmail } from "../utils/nodemailer.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) =>{
    console.log('forgot password');
    const {email} = req.body;
    console.log(email);
    const user = await pool.query('select * from users where email = $1',[email])
    if(user.rows.length === 0){
        console.log('no user found');
        return res.status(404).json({error: 'User not found'})
    }

    const otp = crypto.randomInt(100000, 999999).toString()

    const expiresAt = new Date(Date.now() + 5*60*1000)

    await pool.query('insert into otps (user_id, otp, expires_at ) values ($1, $2, $3)',[user.rows[0].id, otp, expiresAt])

    await sendEmail(email, 'Reset Password OTP', `Your otp code is : ${otp}`)
    res.json({ message: "OTP sent to your email" });
}

export const verifyOtp = async (req, res) => {
    console.log('verify otp');
    const { email, otp } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    const result = await pool.query(
        "SELECT * FROM otps WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()",
        [user.rows[0].id, otp]
    );

    if (result.rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified. You can now reset your password." });
};

export const resetPassword = async (req, res) => {
    console.log('reset password');
    const { email, newPassword } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    await pool.query("DELETE FROM otps WHERE user_id = $1", [user.rows[0].id]);

    res.json({ message: "Password reset successful" });
};