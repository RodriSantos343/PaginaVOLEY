import React, { useState } from 'react';
import { Layers, Calendar, Clock, MapPin, Edit3, CheckCircle, ShieldAlert, Award } from 'lucide-react';

export default function TabGroups({ standings, matches, isAdmin, onEditMatch }) {
  const [selectedGroup, setSelectedGroup] = useState('ALL'); // 'ALL', 'A', 'B', 'C'

  const groupKeys = ['A', 'B', 'C'];
  const activeGroups = selectedGroup === 'ALL' ? groupKeys : [selectedGroup];

  return (
    <section className="groups-container animate-fade-in">
      {/* Header and Filter */}
      <div className="groups-header-row">
        <div>
          <h2 className="section-title">Fase de Grupos y Resultados</h2>
          <p className="section-desc">
            3 grupos de 4 equipos (12 equipos totales). Pasan a Cuartos los 2 mejores de cada grupo y los 2 mejores terceros.
          </p>
        </div>

        <div className="group-filter-pills">
          <button 
            onClick={() => setSelectedGroup('ALL')}
            className={`filter-pill ${selectedGroup === 'ALL' ? 'active' : ''}`}
          >
            Todos los Grupos
          </button>
          {groupKeys.map(g => (
            <button 
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={`filter-pill ${selectedGroup === g ? 'active' : ''}`}
            >
              Grupo {g}
            </button>
          ))}
        </div>
      </div>

      {/* Group Sections */}
      <div className="groups-list">
        {activeGroups.map((groupLetter) => {
          const groupTeams = standings[groupLetter] || [];
          const groupMatches = matches.filter(m => m.group_letter === groupLetter);

          return (
            <div key={groupLetter} className="glass-panel group-panel">
              {/* Group Banner */}
              <div className="group-title-banner">
                <div className="group-badge-box">
                  <span className="group-letter">{groupLetter}</span>
                </div>
                <div className="group-banner-info">
                  <h3>GRUPO {groupLetter}</h3>
                  <div className="group-legend">
                    <span className="legend-tag direct">
                      <span className="dot dot-success"></span> 1º y 2º: Clasificación Directa a Cuartos
                    </span>
                    <span className="legend-tag candidate">
                      <span className="dot dot-warning"></span> 3º: Zona de Selección Mejor Tercero
                    </span>
                  </div>
                </div>
              </div>

              {/* Standings Table */}
              <div className="table-responsive">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th className="th-center">Pos</th>
                      <th>Equipo</th>
                      <th className="th-center" title="Partidos Jugados">PJ</th>
                      <th className="th-center" title="Partidos Ganados">PG</th>
                      <th className="th-center" title="Partidos Perdidos">PP</th>
                      <th className="th-center" title="Sets a Favor">SF</th>
                      <th className="th-center" title="Sets en Contra">SC</th>
                      <th className="th-center" title="Diferencia de Sets">DS</th>
                      <th className="th-center" title="Puntos a Favor">PF</th>
                      <th className="th-center" title="Puntos en Contra">PC</th>
                      <th className="th-center" title="Diferencia de Puntos">DP</th>
                      <th className="th-center th-pts" title="Puntos de Tabla">PTS</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupTeams.map((team, idx) => {
                      const pos = idx + 1;
                      let rowClass = '';
                      let statusBadge = null;

                      if (pos <= 2) {
                        rowClass = 'row-direct';
                        statusBadge = <span className="badge badge-success">Clasifica Directo</span>;
                      } else if (pos === 3) {
                        rowClass = 'row-third';
                        statusBadge = <span className="badge badge-warning">Zona 3º Puesto</span>;
                      } else {
                        rowClass = 'row-eliminated';
                        statusBadge = <span className="badge badge-muted">Eliminado</span>;
                      }

                      return (
                        <tr key={team.id} className={rowClass}>
                          <td className="td-center">
                            <span className={`pos-number pos-${pos}`}>{pos}º</span>
                          </td>
                          <td>
                            <div className="team-cell">
                              <span 
                                className="team-color-badge" 
                                style={{ backgroundColor: team.color_primary || '#38bdf8' }}
                              />
                              <div>
                                <strong className="team-title">{team.name}</strong>
                                <span className="team-city">{team.city}</span>
                              </div>
                            </div>
                          </td>
                          <td className="td-center">{team.pj}</td>
                          <td className="td-center font-bold text-emerald">{team.pg}</td>
                          <td className="td-center text-dim">{team.pp}</td>
                          <td className="td-center">{team.sf}</td>
                          <td className="td-center text-dim">{team.sc}</td>
                          <td className={`td-center font-bold ${team.ds > 0 ? 'text-emerald' : team.ds < 0 ? 'text-danger' : ''}`}>
                            {team.ds > 0 ? `+${team.ds}` : team.ds}
                          </td>
                          <td className="td-center">{team.pf}</td>
                          <td className="td-center text-dim">{team.pc}</td>
                          <td className={`td-center ${team.dp > 0 ? 'text-emerald' : team.dp < 0 ? 'text-danger' : ''}`}>
                            {team.dp > 0 ? `+${team.dp}` : team.dp}
                          </td>
                          <td className="td-center td-pts">
                            <span className="pts-pill">{team.pts}</span>
                          </td>
                          <td>{statusBadge}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Group Fixture & Matches */}
              <div className="group-matches-section">
                <div className="group-matches-head">
                  <h4>Partidos y Resultados del Grupo {groupLetter}</h4>
                  <span className="badge badge-info">{groupMatches.length} Partidos</span>
                </div>

                <div className="group-matches-grid">
                  {groupMatches.map((m) => {
                    const isFinished = m.status === 'finished';
                    const isLive = m.status === 'in_progress';

                    return (
                      <div key={m.id} className={`match-card-full ${isLive ? 'live-border' : ''}`}>
                        <div className="match-top-bar">
                          <span className="round-pill">{m.round_name}</span>
                          <span className="match-datetime">
                            <Calendar size={12} /> {m.match_date} • <Clock size={12} /> {m.match_time} hs
                          </span>
                          <span className="court-pill">
                            <MapPin size={11} /> {m.court}
                          </span>
                        </div>

                        <div className="match-scoreboard">
                          {/* Team 1 */}
                          <div className={`score-team-row ${m.winner_id === m.team1_id ? 'is-winner' : ''}`}>
                            <div className="team-info-left">
                              <span className="team-dot" style={{ backgroundColor: m.team1_color || '#38bdf8' }} />
                              <span className="team-display-name">{m.team1_name}</span>
                            </div>
                            <div className="team-sets-won">{m.sets_team1}</div>
                          </div>

                          {/* Team 2 */}
                          <div className={`score-team-row ${m.winner_id === m.team2_id ? 'is-winner' : ''}`}>
                            <div className="team-info-left">
                              <span className="team-dot" style={{ backgroundColor: m.team2_color || '#ef4444' }} />
                              <span className="team-display-name">{m.team2_name}</span>
                            </div>
                            <div className="team-sets-won">{m.sets_team2}</div>
                          </div>
                        </div>

                        {/* Sets breakdown */}
                        <div className="match-breakdown-row">
                          {isFinished || isLive ? (
                            <div className="breakdown-sets">
                              <span className="set-tag">S1: <strong>{m.set1_team1}-{m.set1_team2}</strong></span>
                              <span className="set-tag">S2: <strong>{m.set2_team1}-{m.set2_team2}</strong></span>
                              {(m.set3_team1 > 0 || m.set3_team2 > 0) && (
                                <span className="set-tag tiebreak">S3: <strong>{m.set3_team1}-{m.set3_team2}</strong></span>
                              )}
                            </div>
                          ) : (
                            <span className="match-status-tag pending">Por Disputar</span>
                          )}

                          {isLive && <span className="badge badge-warning">En Juego</span>}
                          {isFinished && <span className="badge badge-success">Finalizado</span>}

                          {isAdmin && (
                            <button 
                              onClick={() => onEditMatch(m)}
                              className="btn btn-sm btn-outline edit-btn"
                              title="Editar sets y resultado"
                            >
                              <Edit3 size={13} /> Editar Marcador
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .groups-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .groups-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .section-title {
          font-size: 1.8rem;
          color: #ffffff;
        }
        .section-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .group-filter-pills {
          display: flex;
          gap: 8px;
          background: rgba(15, 23, 42, 0.7);
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
        }
        .filter-pill {
          padding: 8px 18px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-pill:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .filter-pill.active {
          background: var(--color-primary);
          color: #04101e;
          box-shadow: 0 2px 10px rgba(56, 189, 248, 0.35);
        }

        .groups-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .group-panel {
          padding: 24px;
        }
        .group-title-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .group-badge-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.05));
          border: 1px solid rgba(56, 189, 248, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
        }
        .group-letter {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--color-primary);
        }
        .group-banner-info h3 {
          font-size: 1.3rem;
          color: #ffffff;
          line-height: 1.2;
        }
        .group-legend {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .legend-tag {
          font-size: 0.76rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-success { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .dot-warning { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

        /* Standings Table */
        .table-responsive {
          overflow-x: auto;
          margin-bottom: 28px;
        }
        .standings-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 4px;
          font-size: 0.9rem;
        }
        .standings-table th {
          padding: 10px 14px;
          background: rgba(15, 23, 42, 0.85);
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }
        .standings-table td {
          padding: 12px 14px;
          background: rgba(15, 23, 42, 0.55);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s;
        }
        .standings-table tr:hover td {
          background: rgba(30, 41, 59, 0.7);
        }
        .th-center, .td-center {
          text-align: center;
        }
        .th-pts, .td-pts {
          background: rgba(56, 189, 248, 0.08) !important;
          font-weight: 800;
        }
        .pts-pill {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        .pos-number {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.95rem;
        }
        .pos-1, .pos-2 { color: #34d399; }
        .pos-3 { color: #fbbf24; }
        .pos-4 { color: var(--text-dim); }

        .team-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .team-color-badge {
          width: 12px;
          height: 12px;
          border-radius: 4px;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
          flex-shrink: 0;
        }
        .team-title {
          display: block;
          color: #ffffff;
          font-size: 0.95rem;
        }
        .team-city {
          display: block;
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .text-emerald { color: #34d399; }
        .text-danger { color: #f87171; }
        .text-dim { color: var(--text-dim); }
        .font-bold { font-weight: 700; }

        /* Group matches */
        .group-matches-section {
          background: rgba(11, 17, 32, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 20px;
        }
        .group-matches-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .group-matches-head h4 {
          font-size: 1.05rem;
          color: #ffffff;
        }
        .group-matches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 14px;
        }
        .match-card-full {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s;
        }
        .match-card-full:hover {
          border-color: rgba(255, 255, 255, 0.16);
          transform: translateY(-1px);
        }
        .live-border {
          border-color: var(--color-accent);
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.2);
        }
        .match-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
          color: var(--text-muted);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 6px;
        }
        .round-pill {
          font-weight: 700;
          color: var(--color-primary);
        }
        .match-datetime, .court-pill {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .match-scoreboard {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .score-team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
        }
        .score-team-row.is-winner {
          background: rgba(56, 189, 248, 0.1);
          font-weight: 700;
        }
        .team-info-left {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }
        .team-display-name {
          font-size: 0.9rem;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .team-sets-won {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          padding: 0 6px;
        }
        .match-breakdown-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px dashed rgba(255, 255, 255, 0.06);
        }
        .breakdown-sets {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.74rem;
          color: var(--text-muted);
        }
        .set-tag {
          background: rgba(0, 0, 0, 0.35);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .set-tag.tiebreak {
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fbbf24;
        }
        .edit-btn {
          font-size: 0.75rem;
          padding: 4px 8px;
        }
        .match-status-tag.pending {
          font-size: 0.74rem;
          color: var(--text-dim);
          font-style: italic;
        }
      `}</style>
    </section>
  );
}
