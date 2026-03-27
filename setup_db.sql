-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gmh_website;
USE gmh_website;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'user',
  confirmado TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla email_confirmations
CREATE TABLE IF NOT EXISTS email_confirmations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  codigo VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  imagen_url VARCHAR(500),
  precio DECIMAL(10, 2),
  specs JSON,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  servicio VARCHAR(255),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla contactos
CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla casos de exito
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
