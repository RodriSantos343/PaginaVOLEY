-- PostgreSQL Database Schema for Torneo de Voleybol (12 Equipos)
-- Database: torneo_voley

CREATE TABLE IF NOT EXISTS tournament_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'COPA NOVA',
    edition VARCHAR(100) DEFAULT 'Edición Clausura',
    venue VARCHAR(255) DEFAULT 'Estadio Polideportivo Municipal - Pista Central',
    dates VARCHAR(150) DEFAULT '15 al 28 de Octubre, 2026',
    description TEXT DEFAULT 'Torneo oficial de voleibol de 12 equipos dividido en 3 grupos. Clasifican los 2 mejores de cada grupo y los 2 mejores terceros a los cuartos de final.',
    status VARCHAR(50) DEFAULT 'in_progress',
    rules_summary TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    group_letter CHAR(1) NOT NULL CHECK (group_letter IN ('A', 'B', 'C')),
    coach VARCHAR(150) DEFAULT 'Director Técnico',
    color_primary VARCHAR(20) DEFAULT '#0284c7',
    color_secondary VARCHAR(20) DEFAULT '#0f172a',
    city VARCHAR(100) DEFAULT 'Sede Central',
    logo_icon VARCHAR(50) DEFAULT 'shield',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    position VARCHAR(50) NOT NULL CHECK (position IN ('Armador', 'Opuesto', 'Punta Receptor', 'Central', 'Líbero')),
    is_captain BOOLEAN DEFAULT FALSE,
    height_cm INTEGER DEFAULT 185,
    age INTEGER DEFAULT 23,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    group_letter CHAR(1) NOT NULL CHECK (group_letter IN ('A', 'B', 'C')),
    round_name VARCHAR(100) NOT NULL,
    team1_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    team2_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    match_date VARCHAR(50) DEFAULT '2026-10-15',
    match_time VARCHAR(20) DEFAULT '18:00',
    court VARCHAR(50) DEFAULT 'Cancha 1',
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'finished')),
    set1_team1 INTEGER DEFAULT 0,
    set1_team2 INTEGER DEFAULT 0,
    set2_team1 INTEGER DEFAULT 0,
    set2_team2 INTEGER DEFAULT 0,
    set3_team1 INTEGER DEFAULT 0,
    set3_team2 INTEGER DEFAULT 0,
    sets_team1 INTEGER DEFAULT 0,
    sets_team2 INTEGER DEFAULT 0,
    winner_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playoff_matches (
    id SERIAL PRIMARY KEY,
    stage VARCHAR(30) NOT NULL CHECK (stage IN ('cuartos', 'semis', 'tercero', 'final')),
    match_code VARCHAR(20) NOT NULL UNIQUE, -- e.g. Q1, Q2, Q3, Q4, S1, S2, T1, F1
    match_title VARCHAR(100) NOT NULL,
    bracket_order INTEGER NOT NULL,
    team1_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    team2_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    placeholder_team1 VARCHAR(100),
    placeholder_team2 VARCHAR(100),
    match_date VARCHAR(50) DEFAULT '2026-10-25',
    match_time VARCHAR(20) DEFAULT '19:00',
    court VARCHAR(50) DEFAULT 'Pista Central',
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'finished')),
    set1_team1 INTEGER DEFAULT 0,
    set1_team2 INTEGER DEFAULT 0,
    set2_team1 INTEGER DEFAULT 0,
    set2_team2 INTEGER DEFAULT 0,
    set3_team1 INTEGER DEFAULT 0,
    set3_team2 INTEGER DEFAULT 0,
    sets_team1 INTEGER DEFAULT 0,
    sets_team2 INTEGER DEFAULT 0,
    winner_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    next_match_code VARCHAR(20),
    next_slot VARCHAR(10), -- 'team1' or 'team2'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
