const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Middleware para verificar si es admin
const requireAdmin = (req, res, next) => {
  // Por ahora, asumimos que el rol viene en el header o body
  // En una implementación real, esto vendría de un JWT token
  const userRole = req.headers['x-user-role'] || req.body.userRole;
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: "Acceso denegado. Se requiere rol de administrador"
    });
  }
  next();
};

// DEBUG route: show columns (temporary)
router.get("/columns", async (req, res) => {
  try {
    const [cols] = await db.execute("SHOW COLUMNS FROM productos");
    res.json({ success: true, cols });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products - Obtener todos los productos
router.get("/products", async (req, res) => {
  try {
    const [products] = await db.execute(
      "SELECT id, nombre, descripcion, categoria, imagen_url, precio, specs, features FROM productos"
    );

    res.json({
      success: true,
      products: products.map(product => ({
        id: product.id.toString(),
        name: product.nombre,
        description: product.descripcion,
        price: product.precio || 0,
        image: product.imagen_url || '',
        category: product.categoria,
        specs: product.specs ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs) : [],
        features: product.features ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features) : []
      }))
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/products/:id - Obtener un producto específico
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.execute(
      "SELECT id, nombre, descripcion, categoria, imagen_url, precio, specs, features FROM productos WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado"
      });
    }

    const product = products[0];
    res.json({
      success: true,
      product: {
        id: product.id.toString(),
        name: product.nombre,
        description: product.descripcion,
        price: product.precio || 0,
        image: product.imagen_url || "",
        category: product.categoria,
        specs: product.specs ? (typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs) : [],
        features: product.features ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features) : []
      }
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/products - Crear nuevo producto (solo admin)
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, categoria, imagen_url, precio, specs, features } = req.body;

    // Validar campos requeridos
    if (!nombre || !descripcion || !categoria) {
      return res.status(400).json({
        success: false,
        error: "Nombre, descripción y categoría son requeridos"
      });
    }

    // Insertar nuevo producto
    const [result] = await db.execute(
      "INSERT INTO productos (nombre, descripcion, categoria, imagen_url, precio, specs, features) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, categoria, imagen_url || "", precio || 0, specs ? JSON.stringify(specs) : null, features ? JSON.stringify(features) : null]
    );

    // Obtener el producto creado
    const [rows] = await db.execute(
      "SELECT id, nombre, descripcion, categoria, imagen_url, precio, specs, features FROM productos WHERE id = ?",
      [result.insertId]
    );

    if (rows.length === 0) {
      return res.status(500).json({
        success: false,
        error: "Error al crear el producto"
      });
    }

    const p = rows[0];
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product: {
        id: p.id.toString(),
        name: p.nombre,
        description: p.descripcion,
        price: p.precio || 0,
        image: p.imagen_url || '',
        category: p.categoria,
        specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : [],
        features: p.features ? (typeof p.features === 'string' ? JSON.parse(p.features) : p.features) : []
      }
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, imagen_url, precio, specs, features } = req.body;

    // Verificar que el producto existe
    const [existingProduct] = await db.execute(
      "SELECT id FROM productos WHERE id = ?",
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado"
      });
    }

    // Actualizar producto
    await db.execute(
      "UPDATE productos SET nombre = ?, descripcion = ?, categoria = ?, imagen_url = ?, precio = ?, specs = ?, features = ? WHERE id = ?",
      [nombre, descripcion, categoria, imagen_url || "", precio || 0, specs ? JSON.stringify(specs) : null, features ? JSON.stringify(features) : null, id]
    );

    // Obtener el producto actualizado
    const [rows] = await db.execute(
      "SELECT id, nombre, descripcion, categoria, imagen_url, precio, specs, features FROM productos WHERE id = ?",
      [id]
    );

    const p = rows[0];
    res.json({
      success: true,
      message: "Producto actualizado exitosamente",
      product: {
        id: p.id.toString(),
        name: p.nombre,
        description: p.descripcion,
        price: p.precio || 0,
        image: p.imagen_url || '',
        category: p.categoria,
        specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : [],
        features: p.features ? (typeof p.features === 'string' ? JSON.parse(p.features) : p.features) : []
      }
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Eliminar producto (solo admin)
router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const [existingProduct] = await db.execute(
      "SELECT id FROM productos WHERE id = ?",
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado"
      });
    }

    // Eliminar producto
    await db.execute("DELETE FROM productos WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Producto eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
