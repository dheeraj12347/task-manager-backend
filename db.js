import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

if (!DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error("❌ Missing DB credentials in .env. Set DB_USER/DB_PASSWORD/DB_NAME");
  process.exit(1);
}

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


