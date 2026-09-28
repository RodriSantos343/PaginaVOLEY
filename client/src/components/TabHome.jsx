import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Users, 
  Layers, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Flame, 
  Shield, 
  Activity,
  FileText,
  Sparkles
} from 'lucide-react';

export default function TabHome({ 
  tournament, 
  teams, 
  matches, 
  qualifiedData, 
  onSelectTab, 
  isAdmin, 
  onEditMatch 
}) {
  const totalTeams = teams.length || 12;
  const totalMatches = matches.length || 18;
  const finishedMatches = matches.filter(m => m.status === 'finished').length;
  const pendingMatches = matches.filter(m => m.status !== 'finished').length;

  // Recent 3 finished matches
  const recentFinished = [...matches]
    .filter(m => m.status === 'finished')
    .slice(-3)
    .reverse();

  // Next 3 scheduled matches (or in progress)
  const upcomingMatches = [...matches]
    .filter(m => m.status !== 'finished')
    .slice(0, 3);

  return (
    <section className="home-container animate-fade-in">
      {/* Hero Banner */}
      <div className="hero-card">
        <div className="hero-content">
          <div className="hero-tag-row">
            <span className="badge badge-info">
              <Sparkles size={12} /> Torneo Oficial 2026
            </span>
            <span className="badge badge-success">
              <Activity size={12} /> En Desarrollo
            </span>
          </div>

          <h1 className="hero-title">
            {tournament?.name || 'COPA NOVA 2026'}
          </h1>
          <p className="hero-subtitle">
            {tournament?.edition || 'Torneo Oficial de Primera División de Voleibol'}
          </p>

          <p className="hero-description">
            {tournament?.description || 
              'Campeonato de alto rendimiento para 12 equipos de vóley divididos en 3 grupos de 4. Clasifican a Cuartos de Final los 2 mejores de cada grupo y los 2 mejores terceros de la tabla general.'}
          </p>

          <div className="hero-meta-grid">
            <div className="meta-item">
              <div className="meta-icon-box">
                <MapPin size={18} />
              </div>
              <div>
                <span className="meta-label">Sede Oficial</span>
                <strong className="meta-val">{tournament?.venue || 'Polideportivo Municipal - Pista Central'}</strong>
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-icon-box">
                <Calendar size={18} />
              </div>
              <div>
                <span className="meta-label">Fechas de Competencia</span>
                <strong className="meta-val">{tournament?.dates || '15 al 28 de Octubre, 2026'}</strong>
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-icon-box">
                <Trophy size={18} />
              </div>
              <div>
                <span className="meta-label">Formato</span>
                <strong className="meta-val">3 Grupos • 8 Clasificados • Playoffs</strong>
              </div>
            </div>
          </div>

          <div className="hero-actions-row">
            <button onClick={() => onSelectTab('grupos')} className="btn btn-primary">
              <Layers size={17} /> Ver Grupos y Fixture <ChevronRight size={16} />
            </button>
            <button onClick={() => onSelectTab('clasificados')} className="btn btn-accent">
              <Award size={17} /> Ver 8 Clasificados
            </button>
            <button onClick={() => onSelectTab('playoffs')} className="btn btn-outline">
              <Trophy size={17} /> Llaves de Cuartos y Final
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="trophy-ambient-sphere">
            <div className="floating-trophy animate-float">
              🏆
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper cyan">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-number">{totalTeams}</div>
            <div className="stat-label">Equipos Participantes</div>
            <div className="stat-sub">12 planteles federados</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper amber">
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-number">3</div>
            <div className="stat-label">Grupos de 4 Equipos</div>
            <div className="stat-sub">Grupos A, B y C</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper emerald">
            <Award size={22} />
          </div>
          <div>
            <div className="stat-number">8</div>
            <div className="stat-label">Clasificados a Cuartos</div>
            <div className="stat-sub">6 directos + 2 mejores 3º</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper purple">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-number">{finishedMatches} / {totalMatches}</div>
            <div className="stat-label">Partidos de Grupo</div>
            <div className="stat-sub">{pendingMatches} pendientes</div>
          </div>
        </div>
      </div>

      {/* Grid: Tournament System & Match Highlights */}
      <div className="home-sections-grid">
        {/* Left Column: Formato & Reglamento */}
        <div className="home-col">
          <div className="glass-panel info-box">
            <div className="section-head">
              <div className="section-title-wrap">
                <FileText size={20} className="sec-icon text-cyan" />
                <h2>Sistema Oficial de Competencia</h2>
              </div>
              <span className="badge badge-info">FIVB Official</span>
            </div>

            <div className="format-steps">
              <div className="step-item">
                <div className="step-badge">1</div>
                <div className="step-info">
                  <h4>Fase de Grupos (3 Grupos de 4)</h4>
                  <p>
                    12 equipos divididos equitativamente en <strong>Grupo A, B y C</strong>. Sistema todos contra todos a 1 rueda (3 fechas por grupo, 18 partidos totales).
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-badge">2</div>
                <div className="step-info">
                  <h4>Criterio de Clasificación a Cuartos (8 Equipos)</h4>
                  <p>
                    Avanzan los <strong>2 mejores de cada grupo</strong> (1º y 2º de A, B y C = 6 equipos) más los <strong>2 mejores terceros</strong> de entre los 3 grupos (2 equipos). Total = <strong>8 clasificados</strong>.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-badge">3</div>
                <div className="step-info">
                  <h4>Siembra General (1º al 8º)</h4>
                  <p>
                    Los 8 equipos se ordenan en una <strong>tabla de mejor a menor</strong> por puntos, mayor cantidad de victorias, ratio de sets y puntos para determinar los cruces.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-badge">4</div>
                <div className="step-info">
                  <h4>Playoffs / Eliminación Directa</h4>
                  <p>
                    Cuartos de Final (<strong>1º vs 8º</strong>, <strong>4º vs 5º</strong>, <strong>2º vs 7º</strong>, <strong>3º vs 6º</strong>), Semifinales, Partido por el 3er Puesto y la Gran Final.
                  </p>
                </div>
              </div>
            </div>

            <div className="rules-highlight-banner">
              <div className="rules-tag">🏐 Sistema de Puntos en Sets</div>
              <p>
                • <strong>Victoria 2-0:</strong> 3 puntos al ganador, 0 al perdedor.<br />
                • <strong>Victoria 2-1:</strong> 2 puntos al ganador, 1 punto al perdedor (bonificación por set ganado).<br />
                • Sets a 25 puntos con diferencia de 2 (3er set tie-break a 15 puntos).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Results & Upcoming */}
        <div className="home-col">
          {/* Recent Results */}
          <div className="glass-panel info-box">
            <div className="section-head">
              <div className="section-title-wrap">
                <Flame size={20} className="sec-icon text-amber" />
                <h2>Resultados Recientes</h2>
              </div>
              <button onClick={() => onSelectTab('grupos')} className="btn btn-sm btn-outline">
                Ver todos
              </button>
            </div>

            {recentFinished.length === 0 ? (
              <p className="empty-text">Aún no hay resultados de partidos finalizados.</p>
            ) : (
              <div className="matches-mini-list">
                {recentFinished.map((m) => (
                  <div key={m.id} className="match-card-mini">
                    <div className="match-card-meta">
                      <span className="badge badge-muted">Grupo {m.group_letter} • {m.round_name}</span>
                      <span className="match-court-text">{m.court}</span>
                    </div>

                    <div className="match-teams-score">
                      <div className={`team-row ${m.winner_id === m.team1_id ? 'winner' : ''}`}>
                        <span className="team-dot" style={{ backgroundColor: m.team1_color || '#38bdf8' }} />
                        <span className="team-name">{m.team1_name}</span>
                        <span className="team-sets-badge">{m.sets_team1}</span>
                      </div>

                      <div className={`team-row ${m.winner_id === m.team2_id ? 'winner' : ''}`}>
                        <span className="team-dot" style={{ backgroundColor: m.team2_color || '#ef4444' }} />
                        <span className="team-name">{m.team2_name}</span>
                        <span className="team-sets-badge">{m.sets_team2}</span>
                      </div>
                    </div>

                    <div className="set-scores-pill">
                      <span>Parciales: </span>
                      <strong>{m.set1_team1}-{m.set1_team2}</strong>, 
                      <strong> {m.set2_team1}-{m.set2_team2}</strong>
                      {m.set3_team1 > 0 || m.set3_team2 > 0 ? (
                        <span>, tie-break <strong>{m.set3_team1}-{m.set3_team2}</strong></span>
                      ) : null}
                    </div>

                    {isAdmin && (
                      <button 
                        onClick={() => onEditMatch(m)} 
                        className="btn btn-sm btn-outline edit-match-quick"
                      >
                        Editar Marcador
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="glass-panel info-box" style={{ marginTop: '20px' }}>
            <div className="section-head">
              <div className="section-title-wrap">
                <Clock size={20} className="sec-icon text-cyan" />
                <h2>Próximos Partidos</h2>
              </div>
              <span className="badge badge-info">{upcomingMatches.length} Por Jugar</span>
            </div>

            {upcomingMatches.length === 0 ? (
              <p className="empty-text">¡Todos los partidos de fase de grupos ya fueron disputados!</p>
            ) : (
              <div className="matches-mini-list">
                {upcomingMatches.map((m) => (
                  <div key={m.id} className="match-card-mini match-upcoming">
                    <div className="match-card-meta">
                      <span className="badge badge-warning">Grupo {m.group_letter}</span>
                      <span className="match-court-text">{m.match_date} - {m.match_time} hs • {m.court}</span>
                    </div>

                    <div className="upcoming-duel">
                      <div className="duel-team">
                        <span className="team-dot" style={{ backgroundColor: m.team1_color || '#38bdf8' }} />
                        <span>{m.team1_name}</span>
                      </div>
                      <div className="duel-vs">VS</div>
                      <div className="duel-team">
                        <span className="team-dot" style={{ backgroundColor: m.team2_color || '#ef4444' }} />
                        <span>{m.team2_name}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <button 
                        onClick={() => onEditMatch(m)} 
                        className="btn btn-sm btn-primary edit-match-quick"
                      >
                        Cargar Marcador
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(12, 74, 110, 0.4) 100%);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: var(--radius-lg);
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-lg), 0 0 40px rgba(56, 189, 248, 0.15);
        }
        .hero-content {
          max-width: 780px;
          position: relative;
          z-index: 2;
        }
        .hero-tag-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 2.8rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-primary);
          font-weight: 600;
          margin-bottom: 16px;
        }
        .hero-description {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .hero-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
          padding: 16px 20px;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .meta-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.15);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .meta-label {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--text-dim);
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .meta-val {
          font-size: 0.92rem;
          color: #ffffff;
          font-weight: 600;
        }
        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .hero-visual {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .trophy-ambient-sphere {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.02) 70%, transparent 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(245, 158, 11, 0.3);
        }
        .floating-trophy {
          font-size: 96px;
          filter: drop-shadow(0 10px 25px rgba(245, 158, 11, 0.5));
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        .stat-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon-wrapper.cyan {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .stat-icon-wrapper.amber {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .stat-icon-wrapper.emerald {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .stat-icon-wrapper.purple {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-top: 4px;
        }
        .stat-sub {
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        /* Two Column Layout */
        .home-sections-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }
        .info-box {
          padding: 24px;
        }
        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title-wrap h2 {
          font-size: 1.25rem;
          color: #ffffff;
        }
        .text-cyan { color: var(--color-primary); }
        .text-amber { color: var(--color-accent); }

        /* Format steps */
        .format-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .step-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid var(--border-glow);
          color: var(--color-primary);
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .step-info h4 {
          font-size: 0.95rem;
          color: #ffffff;
          margin-bottom: 4px;
        }
        .step-info p {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .rules-highlight-banner {
          background: rgba(15, 23, 42, 0.8);
          border: 1px dashed rgba(56, 189, 248, 0.35);
          border-radius: var(--radius-md);
          padding: 16px;
        }
        .rules-tag {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .rules-highlight-banner p {
          font-size: 0.82rem;
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* Matches mini list */
        .matches-mini-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .match-card-mini {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          transition: all 0.2s;
        }
        .match-card-mini:hover {
          border-color: rgba(255, 255, 255, 0.16);
          background: rgba(20, 30, 52, 0.85);
        }
        .match-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.78rem;
        }
        .match-court-text {
          color: var(--text-dim);
          font-weight: 500;
        }
        .match-teams-score {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 8px;
        }
        .team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 6px;
          border-radius: var(--radius-sm);
        }
        .team-row.winner {
          background: rgba(56, 189, 248, 0.08);
          font-weight: 700;
          color: #ffffff;
        }
        .team-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }
        .team-name {
          flex: 1;
          font-size: 0.9rem;
        }
        .team-sets-badge {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1rem;
          color: #ffffff;
          padding: 0 6px;
        }
        .set-scores-pill {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(0, 0, 0, 0.25);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          display: inline-block;
        }
        .edit-match-quick {
          margin-top: 10px;
          width: 100%;
        }

        /* Upcoming duel style */
        .upcoming-duel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: var(--radius-sm);
          margin-bottom: 8px;
        }
        .duel-team {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 0.88rem;
        }
        .duel-vs {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.75rem;
          color: var(--color-accent);
          background: rgba(245, 158, 11, 0.15);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
        .empty-text {
          font-size: 0.85rem;
          color: var(--text-dim);
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 960px) {
          .hero-card {
            flex-direction: column;
            padding: 24px;
          }
          .hero-visual {
            display: none;
          }
          .home-sections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
