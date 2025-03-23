import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import util from "util";

dotenv.config({ path: "../.env" });
dotenv.config();

const sql_pool = new Pool({
    user: process.env.DB_USER || "",
    host: process.env.DB_HOST || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT) || 5432,
    idleTimeoutMillis: process.env.idleTimeoutMillis,
    connectionTimeoutMillis: process.env.connectionTimeoutMillis
})
console.log("Connected to PostgreSQL");
sql_pool.on("error", (err) => {
  console.error("Unexpected error on PostgreSQL client:", err);
  process.exit(-1);
});

const pool = {
    query: (sql, args) =>{
        return util.promisify(sql_pool.query).call(sql_pool, sql, args)
    }

}

export default pool;
