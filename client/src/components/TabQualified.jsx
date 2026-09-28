import React from 'react';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  GitBranch, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function TabQualified({ 
  qualifiedData, 
  isAdmin, 
  onGeneratePlayoffs, 
  onSelectTab,
  isGenerating 
}) {
  const top8 = qualifiedData?.top8 || [];
  const thirdPlaces = qualifiedData?.thirdPlacesRanking || [];
  const eliminated = qualifiedData?.eliminated || [];

  return (
    <section className="qualified-container animate-fade-in">
      {/* Title & Explanation */}
      <div className="qualified-header-box">
        <div className="header-info-left">
          <div className="trophy-badge-icon">
            <Award size={26} />
          </div>
          <div>
            <h2 className="section-title">Tabla General de los 8 Clasificados</h2>
            <p className="section-desc">
              Clasifican los <strong>2 mejores de cada grupo</strong> (6 equipos) y los <strong>2 mejores terceros</strong> (2 equipos). Ordenados de mejor a menor (Sembrados #1 al #8) para definir los cruces de Cuartos de Final.
            </p>
          </div>
        </div>

        <div className="qualified-header-actions">
          {isAdmin && (
            <button 
              onClick={onGeneratePlayoffs} 
              disabled={isGenerating || top8.length < 8}
              className="btn btn-primary"
              title="Genera las llaves oficiales de Cuartos con este orden del 1 al 8"
            >
              <GitBranch size={16} /> {isGenerating ? 'Generando...' : 'Sembrar en Playoffs (1º al 8º)'}
            </button>
          )}
          <button 
            onClick={() => onSelectTab('playoffs')} 
            className="btn btn-accent"
          >
            <Trophy size={16} /> Ver Llaves de Cuartos <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Table: The 8 Qualified Teams */}
      <div className="glass-panel table-panel">
        <div className="panel-subhead">
          <div className="panel-title-with-pill">
            <h3 className="panel-title">Los 8 Mejores del Torneo (Ronda Final)</h3>
            <span className="badge badge-success">
              <ShieldCheck size={13} /> Cuartos de Final
            </span>
          </div>
          <span className="panel-hint">
            Orden oficial de mejor a menor según rendimiento en fase de grupos
          </span>
        </div>

        <div className="table-responsive">
          <table className="qualified-table">
            <thead>
              <tr>
                <th className="th-center">Siembra</th>
                <th>Equipo</th>
                <th>Grupo & Vía de Clasificación</th>
                <th className="th-center" title="Partidos Jugados">PJ</th>
                <th className="th-center" title="Partidos Ganados">PG</th>
                <th className="th-center" title="Partidos Perdidos">PP</th>
                <th className="th-center" title="Sets a Favor">SF</th>
                <th className="th-center" title="Sets en Contra">SC</th>
                <th className="th-center" title="Diferencia de Sets">DS</th>
                <th className="th-center" title="Puntos a Favor">PF</th>
                <th className="th-center" title="Puntos en Contra">PC</th>
                <th className="th-center" title="Diferencia de Puntos">DP</th>
                <th className="th-center th-pts" title="Puntos en Fase de Grupos">PTS</th>
                <th>Cruce Proyectado en Cuartos</th>
              </tr>
            </thead>
            <tbody>
              {top8.length === 0 ? (
                <tr>
                  <td colSpan="14" className="empty-td">
                    Cargando o calculando clasificación de grupos...
                  </td>
                </tr>
              ) : (
                top8.map((team, idx) => {
                  const seed = idx + 1;
                  const isThirdPlace = team.qualification_type === 'best_3rd';

                  // Matchup projection
                  let matchupText = '';
                  if (seed === 1) matchupText = 'vs #8 (Cuartos 1)';
                  else if (seed === 8) matchupText = 'vs #1 (Cuartos 1)';
                  else if (seed === 2) matchupText = 'vs #7 (Cuartos 3)';
                  else if (seed === 7) matchupText = 'vs #2 (Cuartos 3)';
                  else if (seed === 3) matchupText = 'vs #6 (Cuartos 4)';
                  else if (seed === 6) matchupText = 'vs #3 (Cuartos 4)';
                  else if (seed === 4) matchupText = 'vs #5 (Cuartos 2)';
                  else if (seed === 5) matchupText = 'vs #4 (Cuartos 2)';

                  return (
                    <tr key={team.id} className={`seed-row seed-${seed}`}>
                      <td className="td-center">
                        <div className={`seed-pill seed-pill-${seed}`}>
                          #{seed}
                        </div>
                      </td>
                      <td>
                        <div className="team-cell">
                          <span 
                            className="team-color-badge" 
                            style={{ backgroundColor: team.color_primary || '#38bdf8' }}
                          />
                          <div>
                            <strong className="team-name-text">{team.name}</strong>
                            <span className="team-sub-text">{team.city}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isThirdPlace ? (
                          <span className="badge badge-warning">
                            <Sparkles size={11} /> {team.qualification_label}
                          </span>
                        ) : (
                          <span className="badge badge-success">
                            <CheckCircle2 size={11} /> {team.qualification_label}
                          </span>
                        )}
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
                      <td>
                        <span className="matchup-tag">
                          {matchupText}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two cards: Comparison of Third Places & Eliminated Teams */}
      <div className="qualified-bottom-grid">
        {/* Comparison of 3rd Places */}
        <div className="glass-panel bottom-box">
          <div className="panel-subhead">
            <div className="panel-title-with-pill">
              <h3 className="panel-title">Batalla de los Terceros Puestos</h3>
              <span className="badge badge-warning">Criterio 2 Mejores</span>
            </div>
            <span className="panel-hint">
              Comparación entre los 3 equipos que terminaron 3º en sus grupos. Los 2 primeros avanzan, el 3º queda eliminado.
            </span>
          </div>

          <div className="third-places-list">
            {thirdPlaces.map((team, idx) => {
              const qualifies = team.is_qualified;

              return (
                <div 
                  key={team.id} 
                  className={`third-place-card ${qualifies ? 'card-qualified' : 'card-eliminated'}`}
                >
                  <div className="third-rank-badge">
                    {idx + 1}º
                  </div>

                  <div className="third-team-info">
                    <div className="third-team-head">
                      <span className="team-dot" style={{ backgroundColor: team.color_primary || '#38bdf8' }} />
                      <strong className="third-team-name">{team.name}</strong>
                      <span className="badge badge-muted">Grupo {team.group_letter}</span>
                    </div>

                    <div className="third-stats-strip">
                      <span><strong>{team.pts}</strong> PTS</span>
                      <span><strong>{team.pg}</strong> PG</span>
                      <span>DS: <strong>{team.ds > 0 ? `+${team.ds}` : team.ds}</strong></span>
                      <span>DP: <strong>{team.dp > 0 ? `+${team.dp}` : team.dp}</strong></span>
                      <span>PF: {team.pf}</span>
                    </div>
                  </div>

                  <div className="third-decision-badge">
                    {qualifies ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={13} /> CLASIFICADO (#{(top8.findIndex(t => t.id === team.id) + 1) || 7})
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <XCircle size={13} /> ELIMINADO
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="tiebreak-note">
            <HelpCircle size={14} className="tiebreak-icon" />
            <span>
              <strong>Criterios de desempate entre terceros:</strong> 1) Mayor cantidad de Puntos (PTS), 2) Partidos Ganados (PG), 3) Diferencia de Sets (DS), 4) Diferencia de Puntos (DP), 5) Puntos a Favor (PF).
            </span>
          </div>
        </div>

        {/* Eliminated Teams Summary */}
        <div className="glass-panel bottom-box">
          <div className="panel-subhead">
            <div className="panel-title-with-pill">
              <h3 className="panel-title">Equipos Fuera de Competencia</h3>
              <span className="badge badge-muted">4 Equipos Eliminados</span>
            </div>
            <span className="panel-hint">
              Equipos que no lograron acceder a la ronda eliminatoria de Cuartos de Final
            </span>
          </div>

          <div className="eliminated-list">
            {eliminated.map((team) => (
              <div key={team.id} className="eliminated-card">
                <div className="eliminated-left">
                  <span className="team-dot" style={{ backgroundColor: team.color_primary || '#64748b' }} />
                  <div>
                    <strong className="eliminated-name">{team.name}</strong>
                    <span className="eliminated-sub">{team.status_label || `4º Grupo ${team.group_letter}`}</span>
                  </div>
                </div>

                <div className="eliminated-stats">
                  <span>{team.pts} pts</span>
                  <span>{team.pg}G - {team.pp}P</span>
                  <span>DS {team.ds}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .qualified-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .qualified-header-box {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 30, 52, 0.8) 100%);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 25px rgba(245, 158, 11, 0.1);
        }
        .header-info-left {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 800px;
        }
        .trophy-badge-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.1));
          border: 1px solid rgba(245, 158, 11, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent);
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
        }
        .qualified-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .table-panel {
          padding: 24px;
        }
        .panel-subhead {
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .panel-title-with-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        .panel-title {
          font-size: 1.25rem;
          color: #ffffff;
        }
        .panel-hint {
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        /* Qualified table */
        .table-responsive {
          overflow-x: auto;
        }
        .qualified-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 5px;
          font-size: 0.88rem;
        }
        .qualified-table th {
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
        .qualified-table td {
          padding: 12px 14px;
          background: rgba(15, 23, 42, 0.55);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s;
        }
        .qualified-table tr:hover td {
          background: rgba(30, 41, 59, 0.7);
        }
        .seed-row td {
          border-left: 3px solid transparent;
        }
        .seed-row:hover td {
          border-left-color: var(--color-primary);
        }
        .th-center, .td-center {
          text-align: center;
        }
        .seed-pill {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.9rem;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: var(--color-primary);
        }
        .seed-pill-1 {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.2));
          border-color: rgba(245, 158, 11, 0.6);
          color: #fbbf24;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
        }
        .seed-pill-2, .seed-pill-3 {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
          color: #34d399;
        }
        .team-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .team-color-badge {
          width: 12px;
          height: 12px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .team-name-text {
          display: block;
          color: #ffffff;
          font-size: 0.95rem;
        }
        .team-sub-text {
          display: block;
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .td-pts {
          background: rgba(56, 189, 248, 0.08) !important;
          font-weight: 800;
        }
        .pts-pill {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .matchup-tag {
          font-size: 0.8rem;
          font-weight: 600;
          color: #93c5fd;
          background: rgba(30, 58, 138, 0.4);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(59, 130, 246, 0.25);
          white-space: nowrap;
        }
        .empty-td {
          text-align: center;
          padding: 30px;
          color: var(--text-dim);
        }

        /* Bottom Grid */
        .qualified-bottom-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }
        .bottom-box {
          padding: 24px;
        }
        .third-places-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        .third-place-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid var(--border-subtle);
          gap: 12px;
          transition: all 0.2s;
        }
        .third-place-card.card-qualified {
          border-left: 4px solid #10b981;
        }
        .third-place-card.card-eliminated {
          border-left: 4px solid #ef4444;
          opacity: 0.8;
        }
        .third-rank-badge {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-muted);
          width: 28px;
        }
        .third-team-info {
          flex: 1;
        }
        .third-team-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .third-team-name {
          color: #ffffff;
          font-size: 0.95rem;
        }
        .third-stats-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.76rem;
          color: var(--text-muted);
        }
        .tiebreak-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.74rem;
          color: var(--text-dim);
          background: rgba(0, 0, 0, 0.25);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          line-height: 1.5;
        }
        .tiebreak-icon {
          color: var(--color-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Eliminated list */
        .eliminated-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .eliminated-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .eliminated-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .eliminated-name {
          display: block;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .eliminated-sub {
          display: block;
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .eliminated-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        @media (max-width: 960px) {
          .qualified-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
