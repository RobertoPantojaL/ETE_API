-- Examen Técnico de Evaluación
-- Parte 1: Diseño y Creación de Base de Datos

-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS bdd_examen;
USE bdd_examen;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de tareas
CREATE TABLE tareas (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    estado ENUM('pendiente', 'en progreso', 'completado') DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario BIGINT(20) UNSIGNED,
    PRIMARY KEY (id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserción de usuarios ficticios
INSERT INTO usuarios (nombre, correo, contraseña) VALUES
('Juan Pérez', 'juan@example.com', 'contraseña123'),
('María García', 'maria@example.com', 'securepass456'),
('Carlos Rodríguez', 'carlos@example.com', 'clave789');

-- Inserción de tareas asociadas a los usuarios
INSERT INTO tareas (titulo, descripcion, estado, fecha_creacion, id_usuario) VALUES
('Llamar al cliente', 'Contactar al cliente para la reunión del próximo mes', 'en progreso', CURRENT_TIMESTAMP, 1),
('Preparar presentación', 'Crear diapositivas para la presentación del nuevo producto', 'completado', CURRENT_TIMESTAMP, 2),
('Testeo de apps', 'Realizar reporte del funcionamiento de aplicaciones móviles', 'pendiente', CURRENT_TIMESTAMP, 3),
('Actualizar documentación', 'Revisar y actualizar la documentación del proyecto', 'pendiente', CURRENT_TIMESTAMP, 1),
('Revisión de contratos', 'Revisar términos y condiciones de nuevos contratos', 'en progreso', CURRENT_TIMESTAMP, 2);
