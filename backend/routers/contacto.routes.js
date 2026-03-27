const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const RESEND_FROM = process.env.RESEND_FROM || "onboarding@resend.dev";
const NOTIFICATION_EMAIL = process.env.EMAIL_USER;

if (!resend) {
  console.warn("RESEND_API_KEY no configurada. Se omite envio de emails.");
}

if (!NOTIFICATION_EMAIL) {
  console.warn("EMAIL_USER no configurado. Se omite envio de emails.");
}

async function sendResendEmail({ subject, html }) {
  if (!resend || !NOTIFICATION_EMAIL) {
    return { sent: false, id: null, error: "Email no configurado" };
  }

  const response = await resend.emails.send({
    from: RESEND_FROM,
    to: NOTIFICATION_EMAIL,
    subject,
    html
  });

  // Resend SDK often returns { data, error } instead of throwing.
  const apiError = response?.error || null;
  const data = response?.data || (response?.id ? response : null);

  if (apiError) {
    const status = apiError.statusCode || apiError.status || "unknown";
    const message = apiError.message || "Error desconocido de Resend";
    return { sent: false, id: null, error: `Resend ${status}: ${message}` };
  }

  return { sent: Boolean(data?.id), id: data?.id || null, error: null };
}

// optional WhatsApp notification via Twilio
const twilio = require('twilio');
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}
const WHATSAPP_FROM = process.env.WHATSAPP_FROM || 'whatsapp:+14155238886';
const WHATSAPP_TO = process.env.WHATSAPP_TO || 'whatsapp:+541120498272'; // default to your number

// POST /api/cotizacion - Guardar cotización
router.post("/cotizacion", async (req, res) => {
  try {
    const { 
      nombre, 
      correo, 
      telefono = null, 
      servicio = null, 
      descripcion = null,
      products = []
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo) {
      return res.status(400).json({
        success: false,
        error: "Nombre y correo son requeridos"
      });
    }

    // Guardar cotización
    const [result] = await db.execute(
      "INSERT INTO cotizaciones (nombre, correo, telefono, servicio, descripcion) VALUES (?, ?, ?, ?, ?)",
      [nombre, correo, telefono, servicio, descripcion]
    );

    // Construir HTML del email con los productos
    let productosHTML = "";
    if (products && products.length > 0) {
      productosHTML = `
        <h3>Productos solicitados:</h3>
        <ul>
          ${products.map(p => `<li>${p.productName} (Cantidad: ${p.quantity})</li>`).join("")}
        </ul>
      `;
    }

    // Enviar correo de notificación
    const emailResult = await sendResendEmail({
      subject: "Nueva cotización",
      html: `
        <h2>Nueva cotización</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Teléfono:</b> ${telefono || "No proporcionado"}</p>
        <p><b>Servicio:</b> ${servicio || "No especificado"}</p>
        <p><b>Descripción:</b> ${descripcion || "Sin descripción"}</p>
        ${productosHTML}
      `
    });

    if (emailResult.sent) {
      console.log("Email de cotización enviado. id:", emailResult.id);
    } else {
      console.error("No se pudo enviar email de cotización:", emailResult.error);
    }

    // enviar notificación por WhatsApp si está configurado
    if (twilioClient && WHATSAPP_TO) {
      try {
        const texto = `
Nueva cotización desde la web

Nombre: ${nombre}
Email: ${correo}
Teléfono: ${telefono || 'No proporcionado'}
Servicio: ${servicio || 'No especificado'}
Mensaje: ${descripcion || 'Sin descripción'}
`;
        await twilioClient.messages.create({
          from: WHATSAPP_FROM,
          to: WHATSAPP_TO,
          body: texto
        });
        console.log('WhatsApp cotización enviada a', WHATSAPP_TO);
      } catch (werr) {
        console.error('Error enviando WhatsApp cotización:', werr);
      }
    }

    res.json({
      success: true,
      message: emailResult.sent
        ? "Cotización guardada y email enviado correctamente"
        : "Cotización guardada, pero no se pudo enviar el email",
      cotizacionId: result.insertId,
      emailSent: emailResult.sent,
      emailError: emailResult.error
    });
  } catch (error) {
    console.error("Error en cotización:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta para mensajes de contacto (frontend sección Contacto)
router.post("/contacto", async (req, res) => {
  try {
    const { nombre, correo, descripcion } = req.body;

    // Validar que tenemos los datos requeridos
    if (!nombre || !correo || !descripcion) {
      return res.status(400).json({ success: false, error: "Faltan campos requeridos" });
    }

    // Insertar en la tabla `contactos`
    await db.execute(
      "INSERT INTO contactos (nombre, correo, descripcion) VALUES (?, ?, ?)",
      [nombre, correo, descripcion]
    );

    // Enviar correo de notificación
    const emailResult = await sendResendEmail({
      subject: "Nuevo mensaje de contacto",
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Correo:</b> ${correo}</p>
        <p><b>Descripción:</b> ${descripcion}</p>
      `
    });

    if (emailResult.sent) {
      console.log("Email de contacto enviado. id:", emailResult.id);
    } else {
      console.error("No se pudo enviar email de contacto:", emailResult.error);
    }

    res.json({
      success: true,
      message: emailResult.sent
        ? "Mensaje de contacto guardado y enviado correctamente"
        : "Mensaje guardado, pero no se pudo enviar el email",
      emailSent: emailResult.sent,
      emailError: emailResult.error
    });
  } catch (error) {
    console.error("Error en contacto:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;