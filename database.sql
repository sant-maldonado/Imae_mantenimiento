-- ============================================
-- Base de datos para Sistema de Mantenimiento Imae-Upkeep
-- ============================================

-- Crear base de datos (ejecutar en pgAdmin o PSQL)
-- CREATE DATABASE imaedb;

-- Conectar a la base de datos
-- \c imaedb;

-- ============================================
-- TABLA USUARIOS
-- ============================================
DROP TABLE IF EXISTS usuarios CASCADE;
CREATE TABLE usuarios (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol VARCHAR(20) DEFAULT 'tecnico',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP
);

-- ============================================
-- TABLA LABORATORIOS
-- ============================================
DROP TABLE IF EXISTS laboratorios CASCADE;
CREATE TABLE laboratorios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    ubicacion VARCHAR(100),
    responsable VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA EQUIPOS
-- ============================================
DROP TABLE IF EXISTS equipos CASCADE;
CREATE TABLE equipos (
    id VARCHAR(50) PRIMARY KEY,
    id_laboratorio VARCHAR(50) REFERENCES laboratorios(id) ON DELETE SET NULL,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50),
    tipo VARCHAR(50),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    numero_serie VARCHAR(50),
    fecha_adquisicion DATE,
    fecha_instalacion DATE,
    estado VARCHAR(30) DEFAULT 'operativo',
    prioridad_mantenimiento INTEGER DEFAULT 1,
    especificaciones TEXT,
    ultimo_mantenimiento DATE,
    proximo_mantenimiento DATE,
    observaciones TEXT,
    activo BOOLEAN DEFAULT true
);

-- ============================================
-- TABLA COMPONENTES
-- ============================================
DROP TABLE IF EXISTS componentes CASCADE;
CREATE TABLE componentes (
    id VARCHAR(50) PRIMARY KEY,
    id_equipo VARCHAR(50) REFERENCES equipos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50),
    tipo VARCHAR(50),
    numero_serie VARCHAR(50),
    estado VARCHAR(30) DEFAULT 'funcional',
    fecha_instalacion DATE,
    vida_util_meses INTEGER DEFAULT 12,
    especificaciones TEXT,
    observaciones TEXT,
    activo BOOLEAN DEFAULT true
);

-- ============================================
-- TABLA TÉCNICOS
-- ============================================
DROP TABLE IF EXISTS tecnicos CASCADE;
CREATE TABLE tecnicos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    legajo VARCHAR(50) UNIQUE,
    email VARCHAR(100),
    telefono VARCHAR(20),
    especialidad VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_contratacion DATE,
    horas_trabajadas_mes INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true
);

-- ============================================
-- TABLA TAREAS
-- ============================================
DROP TABLE IF EXISTS tareas CASCADE;
CREATE TABLE tareas (
    id VARCHAR(50) PRIMARY KEY,
    id_equipo VARCHAR(50) REFERENCES equipos(id) ON DELETE SET NULL,
    id_componente VARCHAR(50) REFERENCES componentes(id) ON DELETE SET NULL,
    tipo_tarea VARCHAR(30) DEFAULT 'preventivo',
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) DEFAULT 'media',
    estado VARCHAR(30) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada DATE,
    fecha_inicio_real TIMESTAMP,
    fecha_fin_real TIMESTAMP,
    duracion_estimada_horas INTEGER DEFAULT 1,
    duracion_real_horas INTEGER DEFAULT 0,
    materiales_requeridos TEXT,
    herramientas_requeridas TEXT,
    procedimiento TEXT,
    resultado TEXT,
    observaciones TEXT
);

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================
CREATE INDEX idx_equipos_laboratorio ON equipos(id_laboratorio);
CREATE INDEX idx_equipos_estado ON equipos(estado);
CREATE INDEX idx_componentes_equipo ON componentes(id_equipo);
CREATE INDEX idx_componentes_estado ON componentes(estado);
CREATE INDEX idx_tareas_equipo ON tareas(id_equipo);
CREATE INDEX idx_tareas_estado ON tareas(estado);
CREATE INDEX idx_tareas_prioridad ON tareas(prioridad);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- ============================================
-- USUARIO ADMINISTRADOR POR DEFECTO
-- ============================================
INSERT INTO usuarios (id, email, password, nombre, apellido, rol, activo)
VALUES ('USR-ADMIN', 'admin@imae.go.cr', 'admin123', 'Administrador', 'Sistema', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================
-- Laboratorios
INSERT INTO laboratorios (id, nombre, codigo, ubicacion, responsable) VALUES
('LAB-001', 'Laboratorio de Electrónica', 'LAB-ELEC', 'Edificio A - Piso 1', 'Ing. Carlos Mendoza'),
('LAB-002', 'Laboratorio de Mecánica', 'LAB-MEC', 'Edificio A - Piso 2', 'Ing. Ana Rodríguez'),
('LAB-003', 'Laboratorio de Quimica', 'LAB-QUI', 'Edificio B - Piso 1', 'Ing. Roberto Sánchez');

-- Equipos
INSERT INTO equipos (id, id_laboratorio, nombre, codigo, tipo, marca, modelo, estado) VALUES
('EQ-001', 'LAB-001', 'Osciloscopio Digital', 'OSC-001', 'Medición', 'Tektronix', 'TBS1104', 'operativo'),
('EQ-002', 'LAB-001', 'Multímetro', 'MULT-001', 'Medición', 'Fluke', '87V', 'operativo'),
('EQ-003', 'LAB-002', 'Torno CNC', 'TORNO-001', 'Mecánico', 'Haas', 'ST-20', 'mantenimiento'),
('EQ-004', 'LAB-003', 'Centrífuga', 'CENT-001', 'Laboratorio', 'Thermo', 'Sorvall X1', 'operativo');

-- Técnicos
INSERT INTO tecnicos (id, nombre, apellido, legajo, email, especialidad, estado) VALUES
('TEC-001', 'Juan', 'Pérez', 'LEG-001', 'juan.perez@imae.go.cr', 'Electrónica', 'activo'),
('TEC-002', 'María', 'González', 'LEG-002', 'maria.gonzalez@imae.go.cr', 'Mecánica', 'activo'),
('TEC-003', 'Carlos', 'López', 'LEG-003', 'carlos.lopez@imae.go.cr', 'Química', 'activo');

-- Tareas
INSERT INTO tareas (id, id_equipo, titulo, tipo_tarea, prioridad, estado) VALUES
('TAR-001', 'EQ-001', 'Calibración de osciloscopio', 'preventivo', 'media', 'pendiente'),
('TAR-002', 'EQ-003', 'Cambio de rodamientos', 'correctivo', 'alta', 'en_progreso');

-- Componentes
INSERT INTO componentes (id, id_equipo, nombre, tipo, estado) VALUES
('COMP-001', 'EQ-001', 'Pantalla LCD', 'Display', 'funcional'),
('COMP-002', 'EQ-001', 'Fuente de poder', 'Electrónico', 'funcional'),
('COMP-003', 'EQ-003', 'Motor principal', 'Mecánico', 'desgastado');