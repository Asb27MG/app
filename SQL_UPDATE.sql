-- ========== ACTUALIZAR ESTRUCTURA DE BASE DE DATOS ==========
-- Ejecuta estos comandos en tu MySQL para el nuevo sistema de seguridad

-- 1. Agregar columna confirmado a usuarios (si no existe)
ALTER TABLE usuarios ADD COLUMN confirmado TINYINT DEFAULT 0;

-- 2. Eliminar tabla email_confirmations anterior (si existe)
DROP TABLE IF EXISTS email_confirmations;

-- 3. Crear nueva tabla email_confirmations con estructura segura
CREATE TABLE email_confirmations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  codigo VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_codigo (codigo)
);

-- ========== INSTRUCCIONES DE SEGURIDAD ==========
-- IMPORTANTE: En producción deberías:
-- 1. Usar bcrypt para hashear contraseñas (npm install bcryptjs)
-- 2. No almacenar contraseñas en plain text en email_confirmations
-- 3. Implementar rate limiting en endpoints de auth
-- 4. Usar HTTPS
-- 5. Implementar CSRF protection

-- 4. MARCAR TODOS LOS USUARIOS EXISTENTES COMO CONFIRMADOS
UPDATE usuarios SET confirmado = 1 WHERE confirmado = 0 OR confirmado IS NULL;

-- 5. Crear tabla de casos de exito para administracion desde panel
CREATE TABLE IF NOT EXISTS casos_exito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  industria VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  imagen_url VARCHAR(500),
  descripcion_corta TEXT,
  desafio TEXT,
  solucion TEXT,
  productos JSON,
  resultados JSON,
  testimonio_texto TEXT,
  testimonio_autor VARCHAR(255),
  testimonio_rol VARCHAR(255),
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ejemplo de cómo hashear con bcryptjs:
-- const bcrypt = require('bcryptjs');
-- const hashedPassword = await bcrypt.hash(password, 10);
-- Y para verificar: const isValid = await bcrypt.compare(password, hashedPassword);
