const express = require("express");
const router = express.Router();
const db = require("../config/db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generar código aleatorio de 6 dígitos
function generateConfirmationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validar formato de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/auth/register - Enviar código de confirmación (SIN crear usuario aún)
router.post("/auth/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Nombre, email y contraseña son requeridos"
      });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Por favor ingresa un email válido (ejemplo: usuario@dominio.com)"
      });
    }

    // Chequear si el email ya existe en usuarios confirmados
    const [existingUser] = await db.execute(
      "SELECT id FROM usuarios WHERE email = ? AND confirmado = 1",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "El email ya está registrado"
      });
    }

    // Eliminar registros pendientes anteriores para este email
    await db.execute(
      "DELETE FROM email_confirmations WHERE email = ?",
      [email]
    );

    // Generar código de confirmación
    const confirmationCode = generateConfirmationCode();

    // Guardar request de registro pendiente (SIN crear usuario en usuarios tabla)
    await db.execute(
      "INSERT INTO email_confirmations (email, nombre, password, codigo, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
      [email, nombre, password, confirmationCode]
    );

    // Enviar email con código de confirmación
    try {
      await transporter.sendMail({
        from: '"GMH Soluciones" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: "Código de confirmación de registro",
        html: `
          <h2>¡Bienvenido a GMH Soluciones!</h2>
          <p>Tu código de confirmación es:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #0066cc;">${confirmationCode}</h1>
          <p>Este código expira en 1 hora.</p>
          <p>Si no solicitaste este registro, ignora este email.</p>
        `
      });
      console.log("Email de confirmación enviado a:", email);
    } catch (emailErr) {
      console.error("Error enviando email de confirmación:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "Código de confirmación enviado a tu email. Verifica tu bandeja de entrada.",
      requiresConfirmation: true
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/verify-code - Verificar código y CREAR usuario
router.post("/auth/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email y código son requeridos"
      });
    }

    // Buscar el código válido en registros pendientes
    const [confirmations] = await db.execute(
      "SELECT email, nombre, password FROM email_confirmations WHERE email = ? AND codigo = ? AND expires_at > NOW()",
      [email, code]
    );

    if (confirmations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Código inválido o expirado"
      });
    }

    const confirmation = confirmations[0];

    // AHORA CREAR EL USUARIO (solo si el código es válido)
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, password, rol, confirmado) VALUES (?, ?, ?, ?, ?)",
      [confirmation.nombre, confirmation.email, confirmation.password, "cliente", 1]
    );

    // Eliminar código usado e información temporal
    await db.execute(
      "DELETE FROM email_confirmations WHERE email = ? AND codigo = ?",
      [email, code]
    );

    // Obtener usuario creado
    const [user] = await db.execute(
      "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?",
      [result.insertId]
    );

    res.json({
      success: true,
      message: "¡Email verificado! Tu cuenta ha sido creada exitosamente",
      user: {
        id: user[0].id,
        name: user[0].nombre,
        email: user[0].email,
        role: user[0].rol
      }
    });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/auth/resend-code - Reenviar código en registro pendiente
router.post("/auth/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email es requerido"
      });
    }

    // Buscar registro pendiente (no verificado)
    const [pending] = await db.execute(
      "SELECT email FROM email_confirmations WHERE email = ? AND expires_at > NOW()",
      [email]
    );

    if (pending.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay un registro pendiente para este email. Regístrate nuevamente."
      });
    }

    // Generar nuevo código
    const confirmationCode = generateConfirmationCode();

    // Actualizar con nuevo código
    await db.execute(
      "UPDATE email_confirmations SET codigo = ?, expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
      [confirmationCode, email]
    );

    // Enviar nuevo código por email
    try {
      await transporter.sendMail({
        from: '"GMH Soluciones" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: "Nuevo código de confirmación",
        html: `
          <h2>Nuevo código de confirmación</h2>
          <p>Tu nuevo código es:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #0066cc;">${confirmationCode}</h1>
          <p>Este código expira en 1 hora.</p>
        `
      });
      console.log("Código reenviado a:", email);
    } catch (emailErr) {
      console.error("Error reenviando email:", emailErr);
    }

    res.json({
      success: true,
      message: "Código reenviado a tu email"
    });
  } catch (error) {
    console.error("Error reenviando código:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email y contraseña son requeridos"
      });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Por favor ingresa un email válido (ejemplo: usuario@dominio.com)"
      });
    }

    // Buscar usuario por email
    const [users] = await db.execute(
      "SELECT id, nombre, email, password, rol, confirmado FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Credenciales incorrectas"
      });
    }

    const user = users[0];

    // Validar que el email esté confirmado
    if (!user.confirmado) {
      return res.status(403).json({
        success: false,
        error: "Por favor confirma tu email antes de iniciar sesión"
      });
    }

    // Validar contraseña (en producción usar bcryptjs)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Credenciales incorrectas"
      });
    }

    res.json({
      success: true,
      message: "Sesión iniciada correctamente",
      user: {
        id: user.id,
        name: user.nombre,
        email: user.email,
        role: user.rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/delete-account - Eliminar cuenta de usuario
router.post("/auth/delete-account", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    // Buscar usuario por email
    const [users] = await db.execute(
      "SELECT id, password FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    const user = users[0];

    // Validar contraseña (en producción usar bcryptjs)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    const userId = user.id;

    // Eliminar datos asociados al usuario (cotizaciones, contactos, etc)
    await db.execute(
      "DELETE FROM cotizaciones WHERE correo = ?",
      [email]
    );

    await db.execute(
      "DELETE FROM contactos WHERE correo = ?",
      [email]
    );

    // Eliminar registros pendientes de confirmación
    await db.execute(
      "DELETE FROM email_confirmations WHERE email = ?",
      [email]
    );

    // Eliminar usuario
    await db.execute(
      "DELETE FROM usuarios WHERE id = ?",
      [userId]
    );

    res.json({
      success: true,
      message: "Tu cuenta ha sido eliminada permanentemente"
    });
  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
