import React, { useState, useEffect } from 'react';
import { X, Check, Save, Activity, Trophy } from 'lucide-react';

export default function EditMatchModal({ isOpen, onClose, match, onSave, isPlayoff = false }) {
  const [status, setStatus] = useState('finished');
  const [set1T1, setSet1T1] = useState(0);
  const [set1T2, setSet1T2] = useState(0);
  const [set2T1, setSet2T1] = useState(0);
  const [set2T2, setSet2T2] = useState(0);
  const [set3T1, setSet3T1] = useState(0);
  const [set3T2, setSet3T2] = useState(0);
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [court, setCourt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (match) {
      setStatus(match.status || 'finished');
      setSet1T1(match.set1_team1 || 0);
      setSet1T2(match.set1_team2 || 0);
      setSet2T1(match.set2_team1 || 0);
      setSet2T2(match.set2_team2 || 0);
      setSet3T1(match.set3_team1 || 0);
      setSet3T2(match.set3_team2 || 0);
      setMatchDate(match.match_date || '');
      setMatchTime(match.match_time || '');
      setCourt(match.court || 'Pista Central');
    }
  }, [match]);

  if (!isOpen || !match) return null;

  // Calculate live sets won
  let calculatedSets1 = 0;
  let calculatedSets2 = 0;
  if (set1T1 > 0 || set1T2 > 0) {
    if (Number(set1T1) > Number(set1T2)) calculatedSets1++;
    else if (Number(set1T2) > Number(set1T1)) calculatedSets2++;
  }
  if (set2T1 > 0 || set2T2 > 0) {
    if (Number(set2T1) > Number(set2T2)) calculatedSets1++;
    else if (Number(set2T2) > Number(set2T1)) calculatedSets2++;
  }
  if (set3T1 > 0 || set3T2 > 0) {
    if (Number(set3T1) > Number(set3T2)) calculatedSets1++;
    else if (Number(set3T2) > Number(set3T1)) calculatedSets2++;
  }

  const team1Name = match.team1_name || match.placeholder_team1 || 'Equipo 1';
  const team2Name = match.team2_name || match.placeholder_team2 || 'Equipo 2';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        status,
        set1_team1: Number(set1T1) || 0,
        set1_team2: Number(set1T2) || 0,
        set2_team1: Number(set2T1) || 0,
        set2_team2: Number(set2T2) || 0,
        set3_team1: Number(set3T1) || 0,
        set3_team2: Number(set3T2) || 0,
        match_date: matchDate,
        match_time: matchTime,
        court: court
      };

      await onSave(match.id, payload, isPlayoff);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar los resultados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content score-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge">
              <Activity size={18} />
            </div>
            <div>
              <h3>Cargar / Modificar Marcador</h3>
              <p className="modal-subtitle">
                {isPlayoff ? `Playoffs • ${match.match_title || match.stage}` : `Fase de Grupos • Grupo ${match.group_letter} (${match.round_name})`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="score-form">
          {error && <div className="form-error-banner">{error}</div>}

          {/* Duel Display */}
          <div className="modal-duel-banner">
            <div className="modal-team-block">
              <span className="team-dot" style={{ backgroundColor: match.team1_color || '#38bdf8' }} />
              <strong className="team-duel-name">{team1Name}</strong>
            </div>

            <div className="live-sets-display">
              <span className="live-set-num">{calculatedSets1}</span>
              <span className="live-set-divider">:</span>
              <span className="live-set-num">{calculatedSets2}</span>
            </div>

            <div className="modal-team-block right">
              <span className="team-dot" style={{ backgroundColor: match.team2_color || '#ef4444' }} />
              <strong className="team-duel-name">{team2Name}</strong>
            </div>
          </div>

          {/* Status selector */}
          <div className="form-group">
            <label className="form-label">Estado del Partido</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="form-select"
            >
              <option value="finished">Finalizado (Calcula puntos y clasificación)</option>
              <option value="in_progress">En Juego (Marcador en vivo)</option>
              <option value="scheduled">Programado (Sin disputar aún)</option>
            </select>
          </div>

          {/* Sets Inputs */}
          <div className="sets-inputs-grid">
            <div className="set-input-row">
              <span className="set-row-label">Set 1 (25 pts)</span>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input set-num-input"
                value={set1T1}
                onChange={(e) => setSet1T1(e.target.value)}
                placeholder="0"
              />
              <span className="set-dash">-</span>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input set-num-input"
                value={set1T2}
                onChange={(e) => setSet1T2(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="set-input-row">
              <span className="set-row-label">Set 2 (25 pts)</span>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input set-num-input"
                value={set2T1}
                onChange={(e) => setSet2T1(e.target.value)}
                placeholder="0"
              />
              <span className="set-dash">-</span>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input set-num-input"
                value={set2T2}
                onChange={(e) => setSet2T2(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="set-input-row">
              <span className="set-row-label">Set 3 / Tiebreak (15 pts)</span>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input set-num-input"
                value={set3T1}
                onChange={(e) => setSet3T1(e.target.value)}
                placeholder="0"
              />
              <span className="set-dash">-</span>
              <input
                type="number"
                min="0"
                max="50"
                className="form-input set-num-input"
                value={set3T2}
                onChange={(e) => setSet3T2(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Date, Time & Court */}
          <div className="modal-meta-inputs">
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-input"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hora</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej. 18:00"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cancha</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej. Pista Central"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Marcador'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .score-modal-box {
          max-width: 580px;
        }
        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(56, 189, 248, 0.15);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .modal-title-row h3 {
          font-size: 1.15rem;
          color: #ffffff;
        }
        .modal-subtitle {
          font-size: 0.76rem;
          color: var(--text-dim);
        }

        .modal-duel-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 20px;
          gap: 12px;
        }
        .modal-team-block {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .modal-team-block.right {
          justify-content: flex-end;
          text-align: right;
        }
        .team-duel-name {
          color: #ffffff;
          font-size: 0.95rem;
        }
        .live-sets-display {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--color-primary);
          background: rgba(56, 189, 248, 0.15);
          padding: 4px 14px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .live-set-divider {
          color: var(--text-muted);
        }

        .sets-inputs-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 18px;
        }
        .set-input-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .set-row-label {
          flex: 1;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .set-num-input {
          width: 72px;
          text-align: center;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          padding: 6px;
        }
        .set-dash {
          font-weight: 800;
          color: var(--text-dim);
        }

        .modal-meta-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr 1.2fr;
          gap: 12px;
        }

        .modal-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }
        .form-error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
