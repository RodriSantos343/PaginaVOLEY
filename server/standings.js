// Helper logic to compute volleyball standings and tournament qualifications

function calculateGroupStandings(teams, matches) {
  const standingsMap = {};

  teams.forEach(team => {
    standingsMap[team.id] = {
      id: team.id,
      name: team.name,
      group_letter: team.group_letter,
      color_primary: team.color_primary,
      color_secondary: team.color_secondary,
      city: team.city,
      logo_icon: team.logo_icon,
      pj: 0, // Partidos Jugados
      pg: 0, // Partidos Ganados
      pp: 0, // Partidos Perdidos
      sf: 0, // Sets a Favor
      sc: 0, // Sets en Contra
      ds: 0, // Diferencia de Sets
      pf: 0, // Puntos a Favor
      pc: 0, // Puntos en Contra
      dp: 0, // Diferencia de Puntos
      pts: 0 // Puntos en la tabla
    };
  });

  matches.forEach(match => {
    if (match.status !== 'finished') return;

    const t1 = standingsMap[match.team1_id];
    const t2 = standingsMap[match.team2_id];
    if (!t1 || !t2) return;

    t1.pj += 1;
    t2.pj += 1;

    // Sets won
    const s1 = Number(match.sets_team1) || 0;
    const s2 = Number(match.sets_team2) || 0;
    t1.sf += s1;
    t1.sc += s2;
    t2.sf += s2;
    t2.sc += s1;

    // Points in sets
    const p1 = (Number(match.set1_team1) || 0) + (Number(match.set2_team1) || 0) + (Number(match.set3_team1) || 0);
    const p2 = (Number(match.set1_team2) || 0) + (Number(match.set2_team2) || 0) + (Number(match.set3_team2) || 0);
    t1.pf += p1;
    t1.pc += p2;
    t2.pf += p2;
    t2.pc += p1;

    // Volleyball points distribution (Best of 3 sets)
    // 2-0: 3 pts winner, 0 pts loser
    // 2-1: 2 pts winner, 1 pt loser
    if (s1 > s2) {
      t1.pg += 1;
      t2.pp += 1;
      if (s2 === 0) {
        t1.pts += 3;
      } else {
        t1.pts += 2;
        t2.pts += 1;
      }
    } else if (s2 > s1) {
      t2.pg += 1;
      t1.pp += 1;
      if (s1 === 0) {
        t2.pts += 3;
      } else {
        t2.pts += 2;
        t1.pts += 1;
      }
    }
  });

  // Calculate differences
  Object.values(standingsMap).forEach(team => {
    team.ds = team.sf - team.sc;
    team.dp = team.pf - team.pc;
  });

  // Sort function for volleyball table
  const sortFn = (a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.pg !== a.pg) return b.pg - a.pg;
    if (b.ds !== a.ds) return b.ds - a.ds;
    if (b.dp !== a.dp) return b.dp - a.dp;
    return b.pf - a.pf;
  };

  const groups = {
    A: Object.values(standingsMap).filter(t => t.group_letter === 'A').sort(sortFn),
    B: Object.values(standingsMap).filter(t => t.group_letter === 'B').sort(sortFn),
    C: Object.values(standingsMap).filter(t => t.group_letter === 'C').sort(sortFn),
  };

  // Add position in group
  ['A', 'B', 'C'].forEach(g => {
    groups[g].forEach((team, idx) => {
      team.group_position = idx + 1;
    });
  });

  return groups;
}

function calculateQualified(groupStandings) {
  const directQualified = []; // 1º y 2º de cada grupo (6 equipos)
  const thirdPlaces = [];     // 3º de cada grupo (3 equipos)
  const eliminatedDirect = []; // 4º de cada grupo (3 equipos)

  ['A', 'B', 'C'].forEach(g => {
    const groupTeams = groupStandings[g] || [];
    if (groupTeams[0]) {
      directQualified.push({
        ...groupTeams[0],
        qualification_type: 'direct_1st',
        qualification_label: `1º Puesto Grupo ${g}`,
        seed_priority: 1
      });
    }
    if (groupTeams[1]) {
      directQualified.push({
        ...groupTeams[1],
        qualification_type: 'direct_2nd',
        qualification_label: `2º Puesto Grupo ${g}`,
        seed_priority: 2
      });
    }
    if (groupTeams[2]) {
      thirdPlaces.push({
        ...groupTeams[2],
        qualification_type: 'candidate_3rd',
        qualification_label: `3º Puesto Grupo ${g}`,
        seed_priority: 3
      });
    }
    if (groupTeams[3]) {
      eliminatedDirect.push({
        ...groupTeams[3],
        status_label: `Eliminado (4º Grupo ${g})`
      });
    }
  });

  // Ranking criterion for best third places
  const sortStats = (a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.pg !== a.pg) return b.pg - a.pg;
    if (b.ds !== a.ds) return b.ds - a.ds;
    if (b.dp !== a.dp) return b.dp - a.dp;
    return b.pf - a.pf;
  };

  thirdPlaces.sort(sortStats);

  // Top 2 third places qualify!
  const bestThirdPlaces = thirdPlaces.slice(0, 2).map((team, idx) => ({
    ...team,
    qualification_type: 'best_3rd',
    qualification_label: `Mejor 3º (${idx + 1}º / Grupo ${team.group_letter})`,
    seed_priority: 3
  }));

  const eliminatedThird = thirdPlaces.slice(2).map(team => ({
    ...team,
    status_label: `Eliminado como 3º Tercero (Grupo ${team.group_letter})`
  }));

  // Total 8 clasificados: 6 directos + 2 mejores terceros
  // We sort the 8 teams from best to worst!
  // Typically sorted by:
  // 1) Group champions (Seeds 1, 2, 3 ordered by stats)
  // 2) Group runners-up (Seeds 4, 5, 6 ordered by stats)
  // 3) Best 3rd places (Seeds 7, 8 ordered by stats)
  // Or purely by overall stats. Let's do standard tournament seeding:
  const firsts = directQualified.filter(t => t.seed_priority === 1).sort(sortStats);
  const seconds = directQualified.filter(t => t.seed_priority === 2).sort(sortStats);
  const thirds = bestThirdPlaces.sort(sortStats);

  const top8Sorted = [...firsts, ...seconds, ...thirds].map((team, index) => ({
    ...team,
    overall_rank: index + 1,
    seed_number: index + 1
  }));

  return {
    top8: top8Sorted,
    thirdPlacesRanking: thirdPlaces.map((team, idx) => ({
      ...team,
      third_rank: idx + 1,
      is_qualified: idx < 2
    })),
    eliminated: [...eliminatedDirect, ...eliminatedThird]
  };
}

module.exports = {
  calculateGroupStandings,
  calculateQualified
};
