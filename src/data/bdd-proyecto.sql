-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-11-2026 a las 03:46:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdd-proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos_financieros`
--

CREATE TABLE `cargos_financieros` (
  `id` int(11) NOT NULL,
  `inscripcion_id` int(11) NOT NULL,
  `tipo` enum('INICIAL','CUOTA') NOT NULL,
  `numero_cuota` int(11) DEFAULT 0,
  `monto_esperado` decimal(10,2) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado` enum('PENDIENTE','PAGADO','VENCIDO') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `monto_inicial` decimal(10,2) NOT NULL,
  `monto_cuota` decimal(10,2) NOT NULL,
  `cantidad_cuotas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombre`, `monto_inicial`, `monto_cuota`, `cantidad_cuotas`) VALUES
(1, 'Programación Web Fullstack', 80.00, 45.00, 10),
(2, 'Técnico en Refrigeración', 50.00, 30.00, 6),
(3, 'Diseño Gráfico Integral', 60.00, 35.00, 8),
(4, 'Inglés Básico', 40.00, 20.00, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `cedula`, `nombre`, `apellidos`, `creado_en`) VALUES
(1, 'V-31791490', 'Juan', 'Matute', '2026-11-09 23:28:10'),
(2, 'V-3098122', 'Ronald', 'Reyes', '2026-11-09 23:28:10'),
(3, 'V-12345678', 'Carlos', 'Arzola', '2026-11-09 23:28:10'),
(4, 'V-87654321', 'Pablo', 'Arranz', '2026-11-09 23:28:10'),
(5, 'V-11223344', 'María', 'González', '2026-11-10 02:22:24'),
(6, 'V-55667788', 'Luis', 'Pérez', '2026-11-10 02:22:24'),
(7, 'V-99887766', 'Ana', 'Martínez', '2026-11-10 02:22:24'),
(8, 'V-44556677', 'Pedro', 'Gómez', '2026-11-10 02:22:24'),
(9, 'V-33221100', 'Sofía', 'López', '2026-11-10 02:22:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `curso_id` int(11) NOT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `estudiante_id`, `curso_id`, `fecha_inscripcion`) VALUES
(1, 2, 4, '2026-11-10 02:26:10'),
(2, 1, 1, '2026-11-10 02:27:18');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cargos_financieros`
--
ALTER TABLE `cargos_financieros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inscripcion_id` (`inscripcion_id`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estudiante_id` (`estudiante_id`),
  ADD KEY `curso_id` (`curso_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cargos_financieros`
--
ALTER TABLE `cargos_financieros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cargos_financieros`
--
ALTER TABLE `cargos_financieros`
  ADD CONSTRAINT `cargos_financieros_ibfk_1` FOREIGN KEY (`inscripcion_id`) REFERENCES `inscripciones` (`id`);

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`),
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `cursos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
