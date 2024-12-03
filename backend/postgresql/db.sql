CREATE DATABASE gymapp;

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255) DEFAULT NULL,
    confirmado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido_paterno VARCHAR(255) NOT NULL,
    apellido_materno VARCHAR(255) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    nacimiento DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    img_public_id VARCHAR(255),
    img_secure_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    categoria_id INT NOT NULL, -- Relación con la tabla categorias_productos
    stock INTEGER NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    descuento NUMERIC(5, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    img_public_id VARCHAR(255),
    img_secure_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_productos (id) ON DELETE CASCADE
);

CREATE TABLE categorias_productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL
);


// CONSULTAS
