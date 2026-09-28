-- Seed data for Torneo de Voleybol (12 Equipos)
-- Database: torneo_voley

-- Clear existing data if any
TRUNCATE TABLE playoff_matches CASCADE;
TRUNCATE TABLE matches CASCADE;
TRUNCATE TABLE players CASCADE;
TRUNCATE TABLE teams CASCADE;
TRUNCATE TABLE tournament_info CASCADE;

-- 1. Tournament Info
INSERT INTO tournament_info (name, edition, venue, dates, description, status, rules_summary)
VALUES (
    'COPA NOVA',
    'Torneo Oficial Clausura 12 Equipos',
    'Polideportivo Municipal - Pista Central y Cancha 1',
    '15 al 28 de Octubre, 2026',
    'Campeonato de voleibol de alto rendimiento con 12 equipos distribuidos en 3 grupos de 4. Clasifican a Cuartos de Final los 2 mejores de cada grupo y los 2 mejores terceros clasificados en la tabla general.',
    'in_progress',
    '• Partidos al mejor de 3 sets (25 pts, tie-break a 15 pts).\n• Victoria 2-0 otorga 3 puntos al ganador, 0 al perdedor.\n• Victoria 2-1 otorga 2 puntos al ganador, 1 al perdedor.\n• Criterio de desempate en fase de grupos: 1) Puntos totales, 2) Mayor número de partidos ganados, 3) Diferencia de sets (SF - SC), 4) Diferencia de puntos (PF - PC).\n• Cuartos de Final: 1º vs 8º, 2º vs 7º, 3º vs 6º, 4º vs 5º de la tabla general de 8 clasificados.'
);

-- 2. Equipos (12 equipos en 3 grupos de 4)
-- GRUPO A (IDs 1-4)
INSERT INTO teams (id, name, group_letter, coach, color_primary, color_secondary, city, logo_icon) VALUES
(1, 'Rayos del Norte', 'A', 'Carlos Méndez', '#38bdf8', '#0369a1', 'Distrito Norte', 'zap'),
(2, 'Águilas Doradas', 'A', 'Santiago Morales', '#f59e0b', '#78350f', 'Ciudad Real', 'award'),
(3, 'Fénix Voley Club', 'A', 'Matías Rossi', '#f97316', '#7c2d12', 'Valle Sur', 'flame'),
(4, 'Titanes del Sur', 'A', 'Esteban Silva', '#10b981', '#064e3b', 'Puerto Esperanza', 'shield');

-- GRUPO B (IDs 5-8)
INSERT INTO teams (id, name, group_letter, coach, color_primary, color_secondary, city, logo_icon) VALUES
(5, 'Huracán Voleibol', 'B', 'Lucas Gómez', '#06b6d4', '#164e63', 'Costa Azul', 'wind'),
(6, 'Toros Salvajes', 'B', 'Héctor Peralta', '#ef4444', '#7f1d1d', 'Sierra Brava', 'target'),
(7, 'Halcones de la Costa', 'B', 'Roberto Castro', '#eab308', '#1e3a8a', 'Playa Blanca', 'feather'),
(8, 'Espartanos VC', 'B', 'David Albornoz', '#64748b', '#0f172a', 'Metrópolis', 'crosshair');

-- GRUPO C (IDs 9-12)
INSERT INTO teams (id, name, group_letter, coach, color_primary, color_secondary, city, logo_icon) VALUES
(9, 'Jaguares del Valle', 'C', 'Fernando Ortega', '#fbbf24', '#1f2937', 'Valle Verde', 'star'),
(10, 'Dragones Voley', 'C', 'Andrés Benítez', '#a855f7', '#3b0764', 'Altos del Este', 'sparkles'),
(11, 'Vikingos VC', 'C', 'Gustavo Larrea', '#3b82f6', '#1e293b', 'Bahía Fría', 'anchor'),
(12, 'Panteras Negras', 'C', 'Martín Quintana', '#14b8a6', '#09090b', 'Cerro Negro', 'eye');

SELECT setval('teams_id_seq', 12, true);

-- 3. Jugadores (Planteles completos para cada equipo)
INSERT INTO players (team_id, number, name, position, is_captain, height_cm, age) VALUES
-- Rayos del Norte (1)
(1, 10, 'Facundo Conte (C)', 'Punta Receptor', true, 198, 26),
(1, 7, 'Mateo De Cecco', 'Armador', false, 193, 24),
(1, 12, 'Bruno Solé', 'Central', false, 204, 27),
(1, 9, 'Agustín Loser', 'Central', false, 200, 23),
(1, 1, 'Joaquín Danani', 'Líbero', false, 182, 25),
(1, 18, 'Nicolás Lima', 'Opuesto', false, 197, 28),

-- Águilas Doradas (2)
(2, 5, 'Javier Ramos (C)', 'Armador', true, 190, 29),
(2, 11, 'Leandro Martínez', 'Punta Receptor', false, 195, 25),
(2, 8, 'Pablo Urchegui', 'Central', false, 202, 24),
(2, 3, 'Sebastián Solís', 'Opuesto', false, 199, 26),
(2, 2, 'Federico Ruiz', 'Líbero', false, 180, 22),
(2, 14, 'Marcos Paz', 'Central', false, 201, 23),

-- Fénix Voley Club (3)
(3, 8, 'Diego Palacios (C)', 'Opuesto', true, 196, 27),
(3, 4, 'Emiliano Soria', 'Armador', false, 188, 23),
(3, 6, 'Guillermo Vaca', 'Central', false, 203, 25),
(3, 15, 'Cristian Ledesma', 'Punta Receptor', false, 194, 22),
(3, 1, 'Tomás Cáceres', 'Líbero', false, 178, 21),
(3, 9, 'Gonzalo Farías', 'Punta Receptor', false, 192, 24),

-- Titanes del Sur (4)
(4, 9, 'Rodrigo Godoy (C)', 'Central', true, 205, 28),
(4, 3, 'Alejandro Toro', 'Punta Receptor', false, 193, 26),
(4, 2, 'Ignacio Bernasconi', 'Armador', false, 189, 22),
(4, 16, 'Mauricio Vildoza', 'Opuesto', false, 198, 25),
(4, 5, 'Lucas Massimino', 'Líbero', false, 181, 24),
(4, 11, 'Enzo Zanotti', 'Central', false, 202, 23),

-- Huracán Voleibol (5)
(5, 7, 'Germán Johansen (C)', 'Opuesto', true, 200, 27),
(5, 4, 'Matías Sánchez', 'Armador', false, 186, 24),
(5, 13, 'Joaquín Gallego', 'Central', false, 204, 25),
(5, 17, 'Nicolás Lazo', 'Punta Receptor', false, 195, 26),
(5, 6, 'Santiago Arroyo', 'Líbero', false, 183, 23),
(5, 10, 'Franco Medina', 'Central', false, 201, 22),

-- Toros Salvajes (6)
(6, 12, 'Gastón Fernández (C)', 'Central', true, 203, 28),
(6, 8, 'Bautista Amieva', 'Punta Receptor', false, 194, 23),
(6, 5, 'Juan Cruz Arpajou', 'Armador', false, 187, 24),
(6, 14, 'Manuel Balagué', 'Opuesto', false, 197, 25),
(6, 1, 'Tobías Scarpa', 'Líbero', false, 179, 22),
(6, 9, 'Luciano Palonsky', 'Punta Receptor', false, 196, 24),

-- Halcones de la Costa (7)
(7, 10, 'Ezequiel Palacios (C)', 'Punta Receptor', true, 198, 29),
(7, 2, 'Demián González', 'Armador', false, 188, 30),
(7, 15, 'Maximiliano Scarpin', 'Central', false, 201, 26),
(7, 11, 'Renato Adornato', 'Opuesto', false, 196, 24),
(7, 4, 'Alexis González', 'Líbero', false, 184, 27),
(7, 8, 'Iván Quiroga', 'Central', false, 200, 23),

-- Espartanos VC (8)
(8, 1, 'Gonzalo Quiroga (C)', 'Punta Receptor', true, 193, 28),
(8, 9, 'Pablo Kukartsev', 'Opuesto', false, 203, 29),
(8, 6, 'Matías Giraudo', 'Armador', false, 196, 25),
(8, 14, 'Flavio Rajczakowski', 'Central', false, 202, 24),
(8, 13, 'Michele Fedrizzi', 'Líbero', false, 182, 23),
(8, 18, 'Lautaro Verde', 'Central', false, 199, 21),

-- Jaguares del Valle (9)
(9, 4, 'Maximiliano Cavanna (C)', 'Armador', true, 188, 29),
(9, 10, 'Nicolás Bruno', 'Punta Receptor', false, 191, 28),
(9, 11, 'Sebastián Solé', 'Central', false, 202, 27),
(9, 15, 'Federico Pereyra', 'Opuesto', false, 200, 30),
(9, 3, 'Franco López', 'Líbero', false, 181, 24),
(9, 7, 'Jan Martínez', 'Punta Receptor', false, 192, 24),

-- Dragones Voley (10)
(10, 8, 'Agustín Bruschini (C)', 'Opuesto', true, 199, 25),
(10, 2, 'Gaspar Bitar', 'Armador', false, 189, 26),
(10, 16, 'Ramiro Benítez', 'Central', false, 203, 23),
(10, 12, 'Manuel Armoa', 'Punta Receptor', false, 197, 22),
(10, 5, 'Luciano Massimino', 'Líbero', false, 180, 25),
(10, 9, 'Nahuel Camacho', 'Central', false, 200, 24),

-- Vikingos VC (11)
(11, 7, 'Luciano De Cecco (C)', 'Armador', true, 194, 30),
(11, 14, 'Pablo Crer', 'Central', false, 205, 31),
(11, 13, 'Lisandro Zanotti', 'Punta Receptor', false, 195, 27),
(11, 9, 'Bruno Lima', 'Opuesto', false, 198, 26),
(11, 1, 'Facundo Santucci', 'Líbero', false, 185, 28),
(11, 17, 'Martín Ramos', 'Central', false, 201, 27),

-- Panteras Negras (12)
(12, 10, 'Santiago Danani (C)', 'Líbero', true, 182, 27),
(12, 6, 'Ignacio Luengas', 'Punta Receptor', false, 194, 24),
(12, 3, 'Pablo Urchevich', 'Armador', false, 190, 23),
(12, 18, 'Sergio Soria', 'Central', false, 202, 26),
(12, 11, 'Jonás Ponzio', 'Opuesto', false, 198, 22),
(12, 15, 'Lucas Frontini', 'Central', false, 199, 23);

-- 4. Partidos Fase de Grupos
-- Cada grupo tiene 6 partidos (A vs B, C vs D, A vs C, B vs D, A vs D, B vs C)
-- GRUPO A: 1: Rayos, 2: Águilas, 3: Fénix, 4: Titanes
INSERT INTO matches (id, group_letter, round_name, team1_id, team2_id, match_date, match_time, court, status, set1_team1, set1_team2, set2_team1, set2_team2, set3_team1, set3_team2, sets_team1, sets_team2, winner_id) VALUES
(1, 'A', 'Fecha 1', 1, 2, '2026-10-15', '16:00', 'Cancha 1', 'finished', 25, 21, 25, 19, 0, 0, 2, 0, 1),
(2, 'A', 'Fecha 1', 3, 4, '2026-10-15', '18:00', 'Cancha 1', 'finished', 22, 25, 25, 20, 15, 12, 2, 1, 3),
(3, 'A', 'Fecha 2', 1, 3, '2026-10-17', '16:00', 'Pista Central', 'finished', 25, 18, 25, 22, 0, 0, 2, 0, 1),
(4, 'A', 'Fecha 2', 2, 4, '2026-10-17', '18:00', 'Cancha 1', 'finished', 25, 23, 21, 25, 15, 13, 2, 1, 2),
(5, 'A', 'Fecha 3', 1, 4, '2026-10-19', '17:00', 'Pista Central', 'finished', 25, 17, 25, 20, 0, 0, 2, 0, 1),
(6, 'A', 'Fecha 3', 2, 3, '2026-10-19', '19:30', 'Pista Central', 'finished', 25, 22, 23, 25, 15, 11, 2, 1, 2);

-- GRUPO B: 5: Huracán, 6: Toros, 7: Halcones, 8: Espartanos
INSERT INTO matches (id, group_letter, round_name, team1_id, team2_id, match_date, match_time, court, status, set1_team1, set1_team2, set2_team1, set2_team2, set3_team1, set3_team2, sets_team1, sets_team2, winner_id) VALUES
(7, 'B', 'Fecha 1', 5, 6, '2026-10-16', '16:00', 'Cancha 1', 'finished', 25, 20, 25, 22, 0, 0, 2, 0, 5),
(8, 'B', 'Fecha 1', 7, 8, '2026-10-16', '18:00', 'Cancha 1', 'finished', 19, 25, 25, 21, 12, 15, 1, 2, 8),
(9, 'B', 'Fecha 2', 5, 7, '2026-10-18', '16:00', 'Pista Central', 'finished', 25, 21, 25, 18, 0, 0, 2, 0, 5),
(10, 'B', 'Fecha 2', 6, 8, '2026-10-18', '18:00', 'Cancha 1', 'finished', 25, 23, 20, 25, 15, 10, 2, 1, 6),
(11, 'B', 'Fecha 3', 5, 8, '2026-10-20', '16:00', 'Pista Central', 'finished', 25, 23, 22, 25, 15, 13, 2, 1, 5),
(12, 'B', 'Fecha 3', 6, 7, '2026-10-20', '18:30', 'Cancha 1', 'finished', 25, 19, 25, 21, 0, 0, 2, 0, 6);

-- GRUPO C: 9: Jaguares, 10: Dragones, 11: Vikingos, 12: Panteras
INSERT INTO matches (id, group_letter, round_name, team1_id, team2_id, match_date, match_time, court, status, set1_team1, set1_team2, set2_team1, set2_team2, set3_team1, set3_team2, sets_team1, sets_team2, winner_id) VALUES
(13, 'C', 'Fecha 1', 9, 10, '2026-10-16', '17:00', 'Pista Central', 'finished', 25, 23, 25, 21, 0, 0, 2, 0, 9),
(14, 'C', 'Fecha 1', 11, 12, '2026-10-16', '19:00', 'Pista Central', 'finished', 25, 18, 25, 19, 0, 0, 2, 0, 11),
(15, 'C', 'Fecha 2', 9, 11, '2026-10-18', '17:00', 'Cancha 1', 'finished', 21, 25, 25, 20, 13, 15, 1, 2, 11),
(16, 'C', 'Fecha 2', 10, 12, '2026-10-18', '19:00', 'Pista Central', 'finished', 25, 20, 25, 17, 0, 0, 2, 0, 10),
(17, 'C', 'Fecha 3', 9, 12, '2026-10-21', '16:00', 'Pista Central', 'finished', 25, 16, 25, 21, 0, 0, 2, 0, 9),
(18, 'C', 'Fecha 3', 10, 11, '2026-10-21', '18:30', 'Pista Central', 'finished', 22, 25, 25, 23, 11, 15, 1, 2, 11);

SELECT setval('matches_id_seq', 18, true);

-- 5. Playoff Matches (Ronda Clasificatoria: Cuartos, Semis, Tercer Puesto, Final)
-- Conectamos las llaves con los 8 clasificados:
-- Q1: 1º vs 8º
-- Q2: 4º vs 5º -> Ganador Q1 vs Ganador Q2 = S1
-- Q3: 2º vs 7º
-- Q4: 3º vs 6º -> Ganador Q3 vs Ganador Q4 = S2
-- Semifinales: S1 vs S2
-- Tercer Puesto: Perdedor S1 vs Perdedor S2
-- Gran Final: Ganador S1 vs Ganador S2

INSERT INTO playoff_matches (id, stage, match_code, match_title, bracket_order, team1_id, team2_id, placeholder_team1, placeholder_team2, match_date, match_time, court, status, set1_team1, set1_team2, set2_team1, set2_team2, set3_team1, set3_team2, sets_team1, sets_team2, winner_id, next_match_code, next_slot) VALUES
-- CUARTOS DE FINAL
(1, 'cuartos', 'Q1', 'Cuartos 1: 1º vs 8º', 1, 1, 8, '1º Clasificado General (Rayos)', '8º Clasificado General (Espartanos)', '2026-10-24', '15:00', 'Pista Central', 'finished', 25, 20, 25, 22, 0, 0, 2, 0, 1, 'S1', 'team1'),
(2, 'cuartos', 'Q2', 'Cuartos 2: 4º vs 5º', 2, 9, 2, '4º Clasificado General (Jaguares)', '5º Clasificado General (Águilas)', '2026-10-24', '17:00', 'Pista Central', 'finished', 21, 25, 25, 23, 15, 12, 2, 1, 9, 'S1', 'team2'),
(3, 'cuartos', 'Q3', 'Cuartos 3: 2º vs 7º', 3, 11, 3, '2º Clasificado General (Vikingos)', '7º Clasificado General (Fénix)', '2026-10-24', '19:00', 'Pista Central', 'finished', 25, 19, 25, 18, 0, 0, 2, 0, 11, 'S2', 'team1'),
(4, 'cuartos', 'Q4', 'Cuartos 4: 3º vs 6º', 4, 5, 6, '3º Clasificado General (Huracán)', '6º Clasificado General (Toros)', '2026-10-24', '21:00', 'Pista Central', 'finished', 25, 22, 22, 25, 15, 13, 2, 1, 5, 'S2', 'team2'),

-- SEMIFINALES
(5, 'semis', 'S1', 'Semifinal 1: Ganador Q1 vs Ganador Q2', 5, 1, 9, 'Ganador Cuartos 1 (Rayos)', 'Ganador Cuartos 2 (Jaguares)', '2026-10-26', '17:00', 'Pista Central', 'finished', 25, 23, 20, 25, 15, 11, 2, 1, 1, 'F1', 'team1'),
(6, 'semis', 'S2', 'Semifinal 2: Ganador Q3 vs Ganador Q4', 6, 11, 5, 'Ganador Cuartos 3 (Vikingos)', 'Ganador Cuartos 4 (Huracán)', '2026-10-26', '19:30', 'Pista Central', 'finished', 25, 21, 25, 20, 0, 0, 2, 0, 11, 'F1', 'team2'),

-- TERCER PUESTO
(7, 'tercero', 'T1', 'Tercer Puesto: Perdedor S1 vs Perdedor S2', 7, 9, 5, 'Perdedor S1 (Jaguares)', 'Perdedor S2 (Huracán)', '2026-10-28', '16:00', 'Pista Central', 'finished', 25, 22, 25, 23, 0, 0, 2, 0, 9, NULL, NULL),

-- GRAN FINAL
(8, 'final', 'F1', 'Gran Final: Rayos del Norte vs Vikingos VC', 8, 1, 11, 'Ganador Semifinal 1 (Rayos)', 'Ganador Semifinal 2 (Vikingos)', '2026-10-28', '19:00', 'Pista Central', 'finished', 25, 23, 22, 25, 16, 14, 2, 1, 1, NULL, NULL);

SELECT setval('playoff_matches_id_seq', 8, true);
