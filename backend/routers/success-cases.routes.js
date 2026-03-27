const express = require("express");
const path = require("node:path");
const fs = require("node:fs");
const multer = require("multer");
const db = require("../config/db");

const router = express.Router();

const requireAdmin = (req, res, next) => {
  const userRole = req.headers["x-user-role"] || req.body.userRole;
  if (userRole !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. Se requiere rol de administrador",
    });
  }
  next();
};

const uploadsDir = path.join(__dirname, "..", "uploads", "success-cases");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `case-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten archivos de imagen"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const safeParseJSON = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeCase = (row) => ({
  id: row.id.toString(),
  title: row.titulo,
  client: row.cliente,
  industry: row.industria,
  location: row.ubicacion,
  image: row.imagen_url || "",
  shortDesc: row.descripcion_corta || "",
  challenge: row.desafio || "",
  solution: row.solucion || "",
  products: safeParseJSON(row.productos, []),
  results: safeParseJSON(row.resultados, []),
  testimonial: {
    text: row.testimonio_texto || "",
    author: row.testimonio_autor || "",
    role: row.testimonio_rol || "",
  },
  tags: safeParseJSON(row.tags, []),
});

router.get("/success-cases", async (_req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM casos_exito ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      cases: rows.map(normalizeCase),
    });
  } catch (error) {
    console.error("Error al obtener casos de exito:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post(
  "/success-cases",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        client,
        industry,
        location,
        shortDesc,
        challenge,
        solution,
        products,
        results,
        tags,
        testimonialText,
        testimonialAuthor,
        testimonialRole,
        imageUrl,
      } = req.body;

      if (!title || !client || !industry || !location || !shortDesc || !challenge || !solution) {
        return res.status(400).json({
          success: false,
          error: "Faltan campos requeridos para crear el caso de exito",
        });
      }

      const finalImageUrl = req.file
        ? `/uploads/success-cases/${req.file.filename}`
        : imageUrl || "";

      const [insertResult] = await db.execute(
        `INSERT INTO casos_exito
        (titulo, cliente, industria, ubicacion, imagen_url, descripcion_corta, desafio, solucion, productos, resultados, testimonio_texto, testimonio_autor, testimonio_rol, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          client,
          industry,
          location,
          finalImageUrl,
          shortDesc,
          challenge,
          solution,
          JSON.stringify(safeParseJSON(products, [])),
          JSON.stringify(safeParseJSON(results, [])),
          testimonialText || "",
          testimonialAuthor || "",
          testimonialRole || "",
          JSON.stringify(safeParseJSON(tags, [])),
        ]
      );

      const [rows] = await db.execute("SELECT * FROM casos_exito WHERE id = ?", [
        insertResult.insertId,
      ]);

      res.status(201).json({
        success: true,
        message: "Caso de exito creado exitosamente",
        caseStudy: normalizeCase(rows[0]),
      });
    } catch (error) {
      console.error("Error al crear caso de exito:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

router.put(
  "/success-cases/:id",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        client,
        industry,
        location,
        shortDesc,
        challenge,
        solution,
        products,
        results,
        tags,
        testimonialText,
        testimonialAuthor,
        testimonialRole,
        imageUrl,
      } = req.body;

      const [existingRows] = await db.execute(
        "SELECT id, imagen_url FROM casos_exito WHERE id = ?",
        [id]
      );

      if (existingRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Caso de exito no encontrado",
        });
      }

      const previousImageUrl = existingRows[0].imagen_url || "";
      let finalImageUrl = previousImageUrl;

      if (req.file) {
        finalImageUrl = `/uploads/success-cases/${req.file.filename}`;
      } else if (imageUrl !== undefined) {
        finalImageUrl = imageUrl;
      }

      await db.execute(
        `UPDATE casos_exito
         SET titulo = ?, cliente = ?, industria = ?, ubicacion = ?, imagen_url = ?,
             descripcion_corta = ?, desafio = ?, solucion = ?, productos = ?, resultados = ?,
             testimonio_texto = ?, testimonio_autor = ?, testimonio_rol = ?, tags = ?
         WHERE id = ?`,
        [
          title,
          client,
          industry,
          location,
          finalImageUrl,
          shortDesc,
          challenge,
          solution,
          JSON.stringify(safeParseJSON(products, [])),
          JSON.stringify(safeParseJSON(results, [])),
          testimonialText || "",
          testimonialAuthor || "",
          testimonialRole || "",
          JSON.stringify(safeParseJSON(tags, [])),
          id,
        ]
      );

      if (
        req.file &&
        previousImageUrl.startsWith("/uploads/success-cases/") &&
        previousImageUrl !== finalImageUrl
      ) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          previousImageUrl.replace(/^\//, "")
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const [rows] = await db.execute("SELECT * FROM casos_exito WHERE id = ?", [id]);

      res.json({
        success: true,
        message: "Caso de exito actualizado exitosamente",
        caseStudy: normalizeCase(rows[0]),
      });
    } catch (error) {
      console.error("Error al actualizar caso de exito:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

router.delete("/success-cases/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT imagen_url FROM casos_exito WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Caso de exito no encontrado",
      });
    }

    await db.execute("DELETE FROM casos_exito WHERE id = ?", [id]);

    const imageUrl = rows[0].imagen_url || "";
    if (imageUrl.startsWith("/uploads/success-cases/")) {
      const imagePath = path.join(__dirname, "..", imageUrl.replace(/^\//, ""));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: "Caso de exito eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar caso de exito:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;