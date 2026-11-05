-- =====================================================================
--  Aprende Jugando - Base de datos (MySQL 8.0+)
--  Proyecto de fin de curso - Desarrollo Web
-- =====================================================================
-- Si su hosting ya le creó una base de datos, omita las dos líneas
-- siguientes y ejecute el resto del script dentro de esa base.
CREATE DATABASE IF NOT EXISTS aprende_jugando
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aprende_jugando;

DROP TABLE IF EXISTS progresos;
DROP TABLE IF EXISTS actividades;
DROP TABLE IF EXISTS estudiantes;

-- ---------------------------------------------------------------------
-- Estudiantes (RF-01)
-- ---------------------------------------------------------------------
CREATE TABLE estudiantes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(80)  NOT NULL,
  edad       TINYINT UNSIGNED NOT NULL,
  creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_edad CHECK (edad BETWEEN 3 AND 15)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Catálogo de actividades / módulos de juego (RF-07)
-- ---------------------------------------------------------------------
CREATE TABLE actividades (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  codigo       VARCHAR(30)  NOT NULL UNIQUE,
  nombre       VARCHAR(80)  NOT NULL,
  nivel        ENUM('preprimaria','primaria') NOT NULL,
  area         VARCHAR(60)  NOT NULL,
  descripcion  VARCHAR(255) NOT NULL,
  icono        VARCHAR(16)  NOT NULL,
  color        VARCHAR(9)   NOT NULL,
  orden        TINYINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Historial de progreso (RF-05, RF-06, RF-08)
-- Integridad referencial con FOREIGN KEY (RNF-04)
-- ---------------------------------------------------------------------
CREATE TABLE progresos (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id      INT NOT NULL,
  actividad_id       INT NOT NULL,
  puntaje            INT NOT NULL DEFAULT 0,
  aciertos           INT NOT NULL DEFAULT 0,
  total_preguntas    INT NOT NULL DEFAULT 0,
  duracion_segundos  INT NOT NULL DEFAULT 0,
  fecha              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_progreso_estudiante FOREIGN KEY (estudiante_id)
    REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_progreso_actividad FOREIGN KEY (actividad_id)
    REFERENCES actividades(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_progreso_estudiante (estudiante_id),
  INDEX idx_progreso_fecha (fecha)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Datos iniciales del catálogo
-- ---------------------------------------------------------------------
INSERT INTO actividades (codigo, nombre, nivel, area, descripcion, icono, color, orden) VALUES
('espacial',   '¿Dónde está?',            'preprimaria', 'Conocimientos espaciales',
 'Adentro/Afuera, Arriba/Abajo, Cerca/Lejos y Encima/Debajo.', '🧭', '#FF8A3D', 1),
('figuras',    'Figuras geométricas',     'preprimaria', 'Figuras geométricas',
 'Reconoce el círculo, cuadrado, triángulo y rectángulo.',      '🔺', '#2EB872', 2),
('memoria',    'Juego de memoria',        'preprimaria', 'Memoria',
 'Voltea las tarjetas y encuentra los pares iguales.',          '🧠', '#8E6CEF', 3),
('tablas',     'Tablas de multiplicar',   'primaria',    'Matemáticas',
 'Practica las tablas del 1 al 10.',                            '✖️', '#2D9CDB', 4),
('quebrados',  'Suma de quebrados',       'primaria',    'Matemáticas',
 'Suma fracciones con igual y distinto denominador.',           '🍕', '#F2547D', 5),
('decimales',  'Multiplicación con decimales', 'primaria', 'Matemáticas',
 'Multiplica números con punto decimal.',                       '🔢', '#E5B700', 6);

-- Estudiantes de ejemplo (opcional, puede borrarlos)
INSERT INTO estudiantes (nombre, edad) VALUES ('Ana López', 5), ('Carlos Pérez', 8);
INSERT INTO progresos (estudiante_id, actividad_id, puntaje, aciertos, total_preguntas, duracion_segundos) VALUES
(1, 1, 80, 8, 10, 95), (1, 2, 100, 10, 10, 70), (2, 4, 90, 9, 10, 120), (2, 5, 60, 6, 10, 210);
