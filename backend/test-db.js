require("dotenv").config();
const mysql = require("mysql2");

console.log("Environment variables loaded:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gmh_website",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

async function testConnection() {
  try {
    const [rows] = await promisePool.query("SELECT * FROM usuarios LIMIT 1");
    console.log("✓ Connection successful!");
    console.log("Query result:", rows);
  } catch (error) {
    console.error("✗ Connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
