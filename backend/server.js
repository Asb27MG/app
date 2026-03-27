// servidor: iniciando (startup log removed for cleanliness)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("node:path");

const app = express();

// 🔥 PRIMERO los middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Luego las rutas
const authRoutes = require("./routers/auth.routes.js");
const productsRoutes = require("./routers/products.routes.js");
const contactoRoutes = require("./routers/contacto.routes.js");
const whatsappRoutes = require("./routers/whatsapp.routes.js");
const successCasesRoutes = require("./routers/success-cases.routes.js");

app.use('/api', authRoutes);
app.use('/api', productsRoutes);
app.use('/api', contactoRoutes);
app.use('/api', successCasesRoutes);
// endpoint for sending WhatsApp messages independently of the email logic
app.use('/api/whatsapp', whatsappRoutes);

const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Servir archivos estáticos del proyecto (frontend)
// después de compilar con `npm run build` en el frontend,
// el contenido queda en ../frontend/dist
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Servir la página principal desde /
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// IMPORTANTE: Catch-all para SPA (Single Page Application)
// Cualquier ruta que no sea /api y no sea un archivo estático,
// devuelve el index.html para que React Router maneje la navegación
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// allow overriding port via env while defaulting to 3001 (matches frontend proxy)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});