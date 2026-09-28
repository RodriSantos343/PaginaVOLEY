import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  GitFork, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit3, 
  Crown, 
  Medal, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function TabPlayoffs({ 
  playoffs, 
  isAdmin, 
  onEditPlayoffMatch, 
  onGeneratePlayoffs, 
  isGenerating 
}) {
  const cuartos = playoffs?.cuartos || [];
  const semis = playoffs?.semis || [];
  const finalMatch = playoffs?.final?.[0] || null;
  const tercerPuestoMatch = playoffs?.tercero?.[0] || null;

  // Find champion
  const championTeamName = finalMatch?.winner_name;
  const championColor = finalMatch?.winner_id === finalMatch?.team1_id ? finalMatch?.team1_color : finalMatch?.team2_color;

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const renderBracketMatch = (m, label) => {
    if (!m) return null;
    const isFinished = m.status === 'finished';
    const isLive = m.status === 'in_progress';

    const t1Name = m.team1_name || m.placeholder_team1 || 'Por definir';
    const t2Name = m.team2_name || m.placeholder_team2 || 'Por definir';
    const t1Winner = isFinished && m.winner_id && m.winner_id === m.team1_id;
    const t2Winner = isFinished && m.winner_id && m.winner_id === m.team2_id;

    return (
      <div key={m.id || m.match_code} className={`bracket-match-card ${isFinished ? 'match-done' : ''} ${isLive ? 'match-live' : ''}`}>
        <div className="match-card-header">
          <span className="match-code-tag">{label || m.match_code}</span>
          <span className="match-time-tag">
            <Clock size={11} /> {m.match_date ? `${m.match_date.slice(5)} ${m.match_time}` : 'Horario por confirmar'}
          </span>
        </div>

        {/* Team 1 */}
        <div className={`bracket-team-row ${t1Winner ? 'is-winner' : ''}`}>
          <div className="team-left-info">
            <span 
              className="team-dot" 
              style={{ backgroundColor: m.team1_color || '#38bdf8' }} 
            />
            <span className="team-title-span">{t1Name}</span>
          </div>
          <span className="team-score-span">
            {isFinished || isLive ? m.sets_team1 : '-'}
          </span>
        </div>

        {/* Team 2 */}
        <div className={`bracket-team-row ${t2Winner ? 'is-winner' : ''}`}>
          <div className="team-left-info">
            <span 
              className="team-dot" 
              style={{ backgroundColor: m.team2_color || '#ef4444' }} 
            />
            <span className="team-title-span">{t2Name}</span>
          </div>
          <span className="team-score-span">
            {isFinished || isLive ? m.sets_team2 : '-'}
          </span>
        </div>

        {/* Partial sets breakdown */}
        {(isFinished || isLive) && (
          <div className="bracket-partials">
            <span>S1: {m.set1_team1}-{m.set1_team2}</span>
            <span>S2: {m.set2_team1}-{m.set2_team2}</span>
            {(m.set3_team1 > 0 || m.set3_team2 > 0) && (
              <span className="tiebreak">S3: {m.set3_team1}-{m.set3_team2}</span>
            )}
          </div>
        )}

        {isAdmin && (
          <button 
            onClick={() => onEditPlayoffMatch(m)} 
            className="btn btn-sm btn-outline edit-playoff-btn"
          >
            <Edit3 size={12} /> Cargar Marcador
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="playoffs-container animate-fade-in">
      {/* Title & Stage Status */}
      <div className="playoffs-header-box">
        <div>
          <h2 className="section-title">Ronda Clasificadora (Playoffs)</h2>
          <p className="section-desc">
            Cuartos de Final, Semifinales, 3er Puesto y Gran Final. Partidos al mejor de 3 sets (25-25-15).
          </p>
        </div>

        <div className="playoffs-header-actions">
          {isAdmin && (
            <button 
              onClick={onGeneratePlayoffs}
              disabled={isGenerating}
              className="btn btn-outline"
            >
              <RefreshCw size={15} className={isGenerating ? 'spin' : ''} /> Sincronizar Cuartos
            </button>
          )}

          {championTeamName && (
            <button onClick={triggerConfetti} className="btn btn-accent celebrate-btn">
              <Sparkles size={16} /> ¡Celebrar Campeón! 🎉
            </button>
          )}
        </div>
      </div>

      {/* Champion Banner if final is finished */}
      {championTeamName && (
        <div className="champion-banner-card animate-fade-in">
          <div className="trophy-sparkle-box">
            <Crown size={36} className="crown-icon animate-float" />
          </div>
          <div className="champion-details">
            <span className="badge badge-warning champ-pill">🏆 CAMPEÓN DEL TORNEO 2026</span>
            <h2 className="champion-name" style={{ color: '#ffffff' }}>
              {championTeamName}
            </h2>
            <p className="champion-sub">
              ¡Felicitaciones al equipo campeón de la COPA NOVA 2026!
            </p>
          </div>
          <button onClick={triggerConfetti} className="btn btn-accent btn-sm">
            Lanzar Confetti 🎊
          </button>
        </div>
      )}

      {/* Visual Tournament Bracket Tree */}
      <div className="bracket-wrapper glass-panel">
        <div className="bracket-scroll-canvas">
          {/* Round 1: Cuartos de Final */}
          <div className="bracket-column">
            <div className="stage-header">
              <span className="stage-badge">FASE 1</span>
              <h4>Cuartos de Final</h4>
              <span className="stage-sub">4 Partidos (Top 8)</span>
            </div>

            <div className="bracket-matches-col">
              <div className="bracket-match-pair">
                {renderBracketMatch(cuartos[0], 'Cuartos 1: 1º vs 8º')}
                {renderBracketMatch(cuartos[1], 'Cuartos 2: 4º vs 5º')}
              </div>

              <div className="bracket-match-pair">
                {renderBracketMatch(cuartos[2], 'Cuartos 3: 2º vs 7º')}
                {renderBracketMatch(cuartos[3], 'Cuartos 4: 3º vs 6º')}
              </div>
            </div>
          </div>

          {/* Round 2: Semifinales */}
          <div className="bracket-column">
            <div className="stage-header">
              <span className="stage-badge">FASE 2</span>
              <h4>Semifinales</h4>
              <span className="stage-sub">Ganadores de Cuartos</span>
            </div>

            <div className="bracket-matches-col semis-col">
              <div className="bracket-single-match">
                {renderBracketMatch(semis[0], 'Semifinal 1 (Q1 vs Q2)')}
              </div>

              <div className="bracket-single-match">
                {renderBracketMatch(semis[1], 'Semifinal 2 (Q3 vs Q4)')}
              </div>
            </div>
          </div>

          {/* Round 3: Gran Final & Tercer Puesto */}
          <div className="bracket-column final-col">
            <div className="stage-header">
              <span className="stage-badge gold">GRAN FINAL</span>
              <h4 className="text-gold">Por el Campeonato</h4>
              <span className="stage-sub">Copa de Oro</span>
            </div>

            <div className="bracket-matches-col final-matches-col">
              {/* Grand Final */}
              <div className="final-match-highlight">
                <div className="final-crown-header">
                  <Trophy size={20} className="gold-trophy" />
                  <span>Partido por el Título</span>
                </div>
                {renderBracketMatch(finalMatch, 'Gran Final')}
              </div>

              {/* 3rd Place */}
              <div className="tercero-match-box">
                <div className="stage-header tercero-header">
                  <span className="stage-badge bronze">PODIO</span>
                  <h4>Tercer Puesto</h4>
                  <span className="stage-sub">Medalla de Bronce</span>
                </div>
                {renderBracketMatch(tercerPuestoMatch, 'Partido 3º Puesto')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .playoffs-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .playoffs-header-box {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 30, 52, 0.8) 100%);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: var(--radius-lg);
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .playoffs-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Champion Banner */
        .champion-banner-card {
          background: radial-gradient(circle at 10% 50%, rgba(245, 158, 11, 0.3) 0%, rgba(15, 23, 42, 0.95) 60%);
          border: 2px solid rgba(245, 158, 11, 0.6);
          border-radius: var(--radius-lg);
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 0 35px rgba(245, 158, 11, 0.35);
          gap: 20px;
          flex-wrap: wrap;
        }
        .trophy-sparkle-box {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(217, 119, 6, 0.2));
          border: 1px solid rgba(245, 158, 11, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fbbf24;
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.5);
          flex-shrink: 0;
        }
        .crown-icon {
          color: #fbbf24;
        }
        .champion-details {
          flex: 1;
        }
        .champ-pill {
          font-size: 0.75rem;
          margin-bottom: 6px;
        }
        .champion-name {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 10px rgba(245, 158, 11, 0.4);
        }
        .champion-sub {
          font-size: 0.88rem;
          color: #cbd5e1;
        }

        /* Bracket layout */
        .bracket-wrapper {
          padding: 30px;
          overflow-x: auto;
        }
        .bracket-scroll-canvas {
          display: grid;
          grid-template-columns: 1fr 1fr 1.15fr;
          gap: 36px;
          min-width: 980px;
          position: relative;
        }
        .bracket-column {
          display: flex;
          flex-direction: column;
        }
        .stage-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .stage-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-primary);
          background: rgba(56, 189, 248, 0.15);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 6px;
        }
        .stage-badge.gold {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .stage-badge.bronze {
          color: #f97316;
          background: rgba(249, 115, 22, 0.15);
        }
        .stage-header h4 {
          font-size: 1.15rem;
          color: #ffffff;
        }
        .text-gold {
          color: #fbbf24 !important;
        }
        .stage-sub {
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .bracket-matches-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
          justify-content: space-around;
          flex: 1;
        }
        .bracket-match-pair {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .semis-col {
          justify-content: space-around;
        }
        .final-matches-col {
          gap: 32px;
          justify-content: flex-start;
        }

        /* Bracket Match Card */
        .bracket-match-card {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
          transition: all 0.2s;
        }
        .bracket-match-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        .bracket-match-card.match-done {
          border-color: rgba(56, 189, 248, 0.25);
        }
        .bracket-match-card.match-live {
          border-color: var(--color-accent);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
        }
        .match-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-dim);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 5px;
          margin-bottom: 2px;
        }
        .match-code-tag {
          font-weight: 700;
          color: var(--color-primary);
        }
        .match-time-tag {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .bracket-team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
        }
        .bracket-team-row.is-winner {
          background: rgba(56, 189, 248, 0.12);
          border-left: 3px solid var(--color-primary);
        }
        .team-left-info {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }
        .team-title-span {
          font-size: 0.88rem;
          color: #ffffff;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .is-winner .team-title-span {
          font-weight: 700;
        }
        .team-score-span {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: #ffffff;
          padding: 0 6px;
        }

        .bracket-partials {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: var(--text-dim);
          padding-top: 4px;
        }
        .bracket-partials .tiebreak {
          color: var(--color-accent);
          font-weight: 700;
        }

        .edit-playoff-btn {
          margin-top: 6px;
          width: 100%;
        }

        /* Final highlight styles */
        .final-match-highlight {
          background: rgba(245, 158, 11, 0.04);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-lg);
          padding: 16px;
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.12);
        }
        .final-crown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 0.84rem;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 12px;
        }
        .gold-trophy {
          color: #fbbf24;
        }

        .tercero-match-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px;
        }
        .tercero-header {
          margin-bottom: 12px;
          padding-bottom: 8px;
        }
      `}</style>
    </section>
  );
}
