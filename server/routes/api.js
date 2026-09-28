const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { calculateGroupStandings, calculateQualified } = require('../standings');

// Middleware to check admin password
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Acceso no autorizado. Contraseña incorrecta.' });
  }
  next();
};

// 1. ADMIN AUTH VERIFICATION
router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPass) {
    return res.json({ success: true, token: adminPass });
  }
  return res.status(401).json({ success: false, message: 'Contraseña de administrador incorrecta' });
});

// 2. TOURNAMENT INFO
router.get('/tournament', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tournament_info ORDER BY id ASC LIMIT 1');
    const info = rows[0] || {
      name: 'COPA NOVA',
      venue: 'Polideportivo Municipal',
      dates: '15 al 28 de Octubre, 2026'
    };
    res.json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener información del torneo' });
  }
});

router.put('/tournament', verifyAdmin, async (req, res) => {
  try {
    const { name, edition, venue, dates, description, status, rules_summary } = req.body;
    const query = `
      UPDATE tournament_info 
      SET name = COALESCE($1, name),
          edition = COALESCE($2, edition),
          venue = COALESCE($3, venue),
          dates = COALESCE($4, dates),
          description = COALESCE($5, description),
          status = COALESCE($6, status),
          rules_summary = COALESCE($7, rules_summary),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [name, edition, venue, dates, description, status, rules_summary]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el torneo' });
  }
});

// 3. TEAMS & PLAYERS
router.get('/teams', async (req, res) => {
  try {
    const teamsResult = await db.query('SELECT * FROM teams ORDER BY group_letter ASC, name ASC');
    const playersResult = await db.query('SELECT * FROM players ORDER BY team_id ASC, number ASC');
    
    // Group players by team
    const teamsWithPlayers = teamsResult.rows.map(team => ({
      ...team,
      players: playersResult.rows.filter(p => p.team_id === team.id)
    }));

    res.json(teamsWithPlayers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
});

router.post('/teams', verifyAdmin, async (req, res) => {
  try {
    const { name, group_letter, coach, color_primary, color_secondary, city, logo_icon, players } = req.body;
    const teamInsert = await db.query(
      `INSERT INTO teams (name, group_letter, coach, color_primary, color_secondary, city, logo_icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, group_letter.toUpperCase(), coach || 'DT', color_primary || '#0284c7', color_secondary || '#0f172a', city || 'Sede', logo_icon || 'shield']
    );

    const newTeam = teamInsert.rows[0];

    if (players && Array.isArray(players) && players.length > 0) {
      for (const p of players) {
        await db.query(
          `INSERT INTO players (team_id, number, name, position, is_captain, height_cm, age)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [newTeam.id, p.number || 1, p.name, p.position || 'Punta Receptor', p.is_captain || false, p.height_cm || 185, p.age || 22]
        );
      }
    }

    res.status(201).json(newTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear equipo' });
  }
});

router.put('/teams/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, group_letter, coach, color_primary, color_secondary, city, logo_icon, players } = req.body;

  try {
    await db.query(
      `UPDATE teams 
       SET name = $1, group_letter = $2, coach = $3, color_primary = $4, color_secondary = $5, city = $6, logo_icon = $7
       WHERE id = $8`,
      [name, group_letter.toUpperCase(), coach, color_primary, color_secondary, city, logo_icon, id]
    );

    if (players && Array.isArray(players)) {
      // Replace players list
      await db.query('DELETE FROM players WHERE team_id = $1', [id]);
      for (const p of players) {
        await db.query(
          `INSERT INTO players (team_id, number, name, position, is_captain, height_cm, age)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, p.number || 1, p.name, p.position || 'Punta Receptor', p.is_captain || false, p.height_cm || 185, p.age || 22]
        );
      }
    }

    const updated = await db.query('SELECT * FROM teams WHERE id = $1', [id]);
    const updatedPlayers = await db.query('SELECT * FROM players WHERE team_id = $1 ORDER BY number ASC', [id]);
    res.json({ ...updated.rows[0], players: updatedPlayers.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar equipo y jugadores' });
  }
});

router.delete('/teams/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM teams WHERE id = $1', [id]);
    res.json({ success: true, message: 'Equipo eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar equipo' });
  }
});

// 4. MATCHES (FASE DE GRUPOS)
router.get('/matches', async (req, res) => {
  try {
    const query = `
      SELECT m.*,
             t1.name as team1_name, t1.color_primary as team1_color, t1.logo_icon as team1_icon,
             t2.name as team2_name, t2.color_primary as team2_color, t2.logo_icon as team2_icon,
             w.name as winner_name
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.id
      LEFT JOIN teams t2 ON m.team2_id = t2.id
      LEFT JOIN teams w ON m.winner_id = w.id
      ORDER BY m.group_letter ASC, m.id ASC;
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener partidos de fase de grupos' });
  }
});

router.post('/matches', verifyAdmin, async (req, res) => {
  try {
    const { group_letter, round_name, team1_id, team2_id, match_date, match_time, court } = req.body;
    const result = await db.query(
      `INSERT INTO matches (group_letter, round_name, team1_id, team2_id, match_date, match_time, court)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [group_letter, round_name, team1_id, team2_id, match_date, match_time, court]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear partido' });
  }
});

router.put('/matches/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    status,
    set1_team1, set1_team2,
    set2_team1, set2_team2,
    set3_team1, set3_team2,
    match_date, match_time, court
  } = req.body;

  try {
    // Calculate sets won
    let sets1 = 0;
    let sets2 = 0;

    const s1_t1 = Number(set1_team1) || 0;
    const s1_t2 = Number(set1_team2) || 0;
    const s2_t1 = Number(set2_team1) || 0;
    const s2_t2 = Number(set2_team2) || 0;
    const s3_t1 = Number(set3_team1) || 0;
    const s3_t2 = Number(set3_team2) || 0;

    if (s1_t1 > 0 || s1_t2 > 0) {
      if (s1_t1 > s1_t2) sets1++; else if (s1_t2 > s1_t1) sets2++;
    }
    if (s2_t1 > 0 || s2_t2 > 0) {
      if (s2_t1 > s2_t2) sets1++; else if (s2_t2 > s2_t1) sets2++;
    }
    if (s3_t1 > 0 || s3_t2 > 0) {
      if (s3_t1 > s3_t2) sets1++; else if (s3_t2 > s3_t1) sets2++;
    }

    // Get current match to find team IDs
    const curMatch = await db.query('SELECT team1_id, team2_id FROM matches WHERE id = $1', [id]);
    if (curMatch.rows.length === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    const { team1_id, team2_id } = curMatch.rows[0];
    let winner_id = null;
    let computedStatus = status || 'finished';

    if (sets1 >= 2) {
      winner_id = team1_id;
      computedStatus = 'finished';
    } else if (sets2 >= 2) {
      winner_id = team2_id;
      computedStatus = 'finished';
    } else if (sets1 > 0 || sets2 > 0) {
      computedStatus = 'in_progress';
    }

    const updateQuery = `
      UPDATE matches
      SET status = $1,
          set1_team1 = $2, set1_team2 = $3,
          set2_team1 = $4, set2_team2 = $5,
          set3_team1 = $6, set3_team2 = $7,
          sets_team1 = $8, sets_team2 = $9,
          winner_id = $10,
          match_date = COALESCE($11, match_date),
          match_time = COALESCE($12, match_time),
          court = COALESCE($13, court)
      WHERE id = $14
      RETURNING *;
    `;

    const { rows } = await db.query(updateQuery, [
      computedStatus,
      s1_t1, s1_t2,
      s2_t1, s2_t2,
      s3_t1, s3_t2,
      sets1, sets2,
      winner_id,
      match_date, match_time, court,
      id
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar resultado del partido' });
  }
});

// 5. STANDINGS & QUALIFICATION LOGIC
router.get('/standings', async (req, res) => {
  try {
    const teams = await db.query('SELECT * FROM teams');
    const matches = await db.query('SELECT * FROM matches');
    const groups = calculateGroupStandings(teams.rows, matches.rows);
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al calcular tabla de grupos' });
  }
});

router.get('/qualified', async (req, res) => {
  try {
    const teams = await db.query('SELECT * FROM teams');
    const matches = await db.query('SELECT * FROM matches');
    const groups = calculateGroupStandings(teams.rows, matches.rows);
    const qualifiedData = calculateQualified(groups);
    res.json(qualifiedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al calcular clasificados' });
  }
});

// 6. PLAYOFF BRACKET (CUARTOS, SEMIS, FINAL)
router.get('/playoffs', async (req, res) => {
  try {
    const query = `
      SELECT p.*,
             t1.name as team1_name, t1.color_primary as team1_color, t1.logo_icon as team1_icon,
             t2.name as team2_name, t2.color_primary as team2_color, t2.logo_icon as team2_icon,
             w.name as winner_name
      FROM playoff_matches p
      LEFT JOIN teams t1 ON p.team1_id = t1.id
      LEFT JOIN teams t2 ON p.team2_id = t2.id
      LEFT JOIN teams w ON p.winner_id = w.id
      ORDER BY p.bracket_order ASC;
    `;
    const { rows } = await db.query(query);

    const stages = {
      cuartos: rows.filter(m => m.stage === 'cuartos'),
      semis: rows.filter(m => m.stage === 'semis'),
      tercero: rows.filter(m => m.stage === 'tercero'),
      final: rows.filter(m => m.stage === 'final'),
      all: rows
    };

    res.json(stages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener llaves de playoffs' });
  }
});

// Update playoff match score & advance winners
router.put('/playoffs/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    status,
    set1_team1, set1_team2,
    set2_team1, set2_team2,
    set3_team1, set3_team2,
    match_date, match_time, court
  } = req.body;

  try {
    const curMatch = await db.query('SELECT * FROM playoff_matches WHERE id = $1', [id]);
    if (curMatch.rows.length === 0) {
      return res.status(404).json({ error: 'Partido de playoff no encontrado' });
    }

    const match = curMatch.rows[0];
    const s1_t1 = Number(set1_team1) || 0;
    const s1_t2 = Number(set1_team2) || 0;
    const s2_t1 = Number(set2_team1) || 0;
    const s2_t2 = Number(set2_team2) || 0;
    const s3_t1 = Number(set3_team1) || 0;
    const s3_t2 = Number(set3_team2) || 0;

    let sets1 = 0;
    let sets2 = 0;
    if (s1_t1 > 0 || s1_t2 > 0) {
      if (s1_t1 > s1_t2) sets1++; else if (s1_t2 > s1_t1) sets2++;
    }
    if (s2_t1 > 0 || s2_t2 > 0) {
      if (s2_t1 > s2_t2) sets1++; else if (s2_t2 > s2_t1) sets2++;
    }
    if (s3_t1 > 0 || s3_t2 > 0) {
      if (s3_t1 > s3_t2) sets1++; else if (s3_t2 > s3_t1) sets2++;
    }

    let winner_id = null;
    let loser_id = null;
    let computedStatus = status || 'finished';

    if (sets1 >= 2) {
      winner_id = match.team1_id;
      loser_id = match.team2_id;
      computedStatus = 'finished';
    } else if (sets2 >= 2) {
      winner_id = match.team2_id;
      loser_id = match.team1_id;
      computedStatus = 'finished';
    } else if (sets1 > 0 || sets2 > 0) {
      computedStatus = 'in_progress';
    }

    await db.query(
      `UPDATE playoff_matches
       SET status = $1,
           set1_team1 = $2, set1_team2 = $3,
           set2_team1 = $4, set2_team2 = $5,
           set3_team1 = $6, set3_team2 = $7,
           sets_team1 = $8, sets_team2 = $9,
           winner_id = $10,
           match_date = COALESCE($11, match_date),
           match_time = COALESCE($12, match_time),
           court = COALESCE($13, court)
       WHERE id = $14`,
      [
        computedStatus,
        s1_t1, s1_t2,
        s2_t1, s2_t2,
        s3_t1, s3_t2,
        sets1, sets2,
        winner_id,
        match_date, match_time, court,
        id
      ]
    );

    // If match finished, automatically propagate winner to the next bracket match!
    if (winner_id && match.next_match_code && match.next_slot) {
      const fieldToUpdate = match.next_slot === 'team1' ? 'team1_id' : 'team2_id';
      await db.query(
        `UPDATE playoff_matches SET ${fieldToUpdate} = $1 WHERE match_code = $2`,
        [winner_id, match.next_match_code]
      );
    }

    // If it was a semifinal, also propagate loser to 3rd place match!
    if (loser_id && match.stage === 'semis') {
      const slot = match.match_code === 'S1' ? 'team1_id' : 'team2_id';
      await db.query(
        `UPDATE playoff_matches SET ${slot} = $1 WHERE match_code = 'T1'`,
        [loser_id]
      );
    }

    const updated = await db.query('SELECT * FROM playoff_matches WHERE id = $1', [id]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar partido de playoff' });
  }
});

// Auto-generate Quarterfinals from the 8 qualified teams
router.post('/playoffs/generate', verifyAdmin, async (req, res) => {
  try {
    const teams = await db.query('SELECT * FROM teams');
    const matches = await db.query('SELECT * FROM matches');
    const groups = calculateGroupStandings(teams.rows, matches.rows);
    const { top8 } = calculateQualified(groups);

    if (top8.length < 8) {
      return res.status(400).json({ error: 'Aún no hay 8 clasificados suficientes en los grupos.' });
    }

    // Classic seeding:
    // Q1: Seed 1 vs Seed 8
    // Q2: Seed 4 vs Seed 5
    // Q3: Seed 2 vs Seed 7
    // Q4: Seed 3 vs Seed 6
    const pairs = [
      { code: 'Q1', t1: top8[0], t2: top8[7] },
      { code: 'Q2', t1: top8[3], t2: top8[4] },
      { code: 'Q3', t1: top8[1], t2: top8[6] },
      { code: 'Q4', t1: top8[2], t2: top8[5] }
    ];

    for (const p of pairs) {
      await db.query(
        `UPDATE playoff_matches 
         SET team1_id = $1, 
             team2_id = $2, 
             placeholder_team1 = $3, 
             placeholder_team2 = $4
         WHERE match_code = $5`,
        [
          p.t1.id,
          p.t2.id,
          `#${p.t1.overall_rank} ${p.t1.name} (${p.t1.qualification_label})`,
          `#${p.t2.overall_rank} ${p.t2.name} (${p.t2.qualification_label})`,
          p.code
        ]
      );
    }

    res.json({ success: true, message: 'Llaves de Cuartos de Final generadas con los 8 clasificados' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar llaves de playoffs' });
  }
});

// 7. RESTORE / RESET SEED DATA
router.post('/reset', verifyAdmin, async (req, res) => {
  try {
    const seedPath = path.join(__dirname, '../seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');
    await db.query(seedSql);
    res.json({ success: true, message: 'Base de datos restaurada con datos oficiales de prueba' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al resetear la base de datos' });
  }
});

module.exports = router;
