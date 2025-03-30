import cron from 'node-cron';
import pool from '../../db/index.js';

cron.schedule('* * * * *', async () => {  
    await pool.query("DELETE FROM otps WHERE expires_at <= NOW()");
});
