import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("Conectado a la base:", result.rows[0]);
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err.message);
  });

export default pool;
