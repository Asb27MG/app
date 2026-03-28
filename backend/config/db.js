require("dotenv").config();

const mysql = require("mysql2");
const { execSync } = require("child_process");

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = Number(process.env.DB_PORT || 3306);
const dbUser = process.env.DB_USER || "root";
const dbName = process.env.DB_NAME || "gmh_website";
let dbPassword = process.env.DB_PASSWORD ?? "";

console.log(`[DEBUG] MySQL Config - Host: ${dbHost}, Port: ${dbPort}, User: "${dbUser}", DB: ${dbName}, Password: ${process.env.DB_PASSWORD ? "CONFIGURED" : "EMPTY"}`);

// Fallback macOS: intenta leer la clave de MySQL Workbench desde el llavero
// cuando no hay DB_PASSWORD configurada.
if (!process.env.DB_PASSWORD && process.platform === "darwin" && dbHost === "localhost" && dbUser === "root") {
  try {
    const keychainPassword = execSync(
      'security find-generic-password -a root -s "Mysql@localhost:3306" -w',
      { stdio: ["ignore", "pipe", "ignore"] }
    )
      .toString()
      .trim();

    if (keychainPassword) {
      dbPassword = keychainPassword;
      console.log("Password MySQL cargada desde Llavero de macOS");
    }
  } catch {
    // Si no se puede leer del llavero, se usa el valor vacío / env existente.
  }
}

const requiredDbEnv = ["DB_NAME"];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);

if (missingDbEnv.length > 0) {
  console.warn(
    `Faltan variables de entorno para MySQL: ${missingDbEnv.join(", ")}. Se usaran defaults locales (host=${dbHost}, user=${dbUser}, db=${dbName}).`
  );
}

const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de conexión inicial para detectar errores de credenciales al arrancar.
pool.getConnection((err, connection) => {
  if (err) {
    console.error("No se pudo conectar a MySQL:", err.message);
    return;
  }
  connection.release();
  console.log("Conexion MySQL OK");
});

module.exports = pool.promise();