import React, { useState, useEffect } from 'react';
import { X, Users, Plus, Trash2, Save, Shield, Star, Check } from 'lucide-react';

export default function TeamManagerModal({ isOpen, onClose, teams, onSaveTeam }) {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || 1);
  const [name, setName] = useState('');
  const [groupLetter, setGroupLetter] = useState('A');
  const [coach, setCoach] = useState('');
  const [city, setCity] = useState('');
  const [colorPrimary, setColorPrimary] = useState('#38bdf8');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update form fields when selected team changes
  useEffect(() => {
    if (teams && teams.length > 0) {
      const current = teams.find(t => t.id === Number(selectedTeamId)) || teams[0];
      if (current) {
        setName(current.name || '');
        setGroupLetter(current.group_letter || 'A');
        setCoach(current.coach || '');
        setCity(current.city || '');
        setColorPrimary(current.color_primary || '#38bdf8');
        setPlayers(current.players ? [...current.players] : []);
        setSuccessMsg('');
        setErrorMsg('');
      }
    }
  }, [selectedTeamId, teams]);

  if (!isOpen) return null;

  const handleAddPlayer = () => {
    const nextNumber = players.length > 0 ? Math.max(...players.map(p => Number(p.number) || 0)) + 1 : 1;
    setPlayers([
      ...players,
      {
        number: nextNumber,
        name: `Nuevo Jugador ${nextNumber}`,
        position: 'Punta Receptor',
        is_captain: false,
        height_cm: 190,
        age: 23
      }
    ]);
  };

  const handleUpdatePlayer = (index, field, value) => {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  };

  const handleRemovePlayer = (index) => {
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload = {
        name,
        group_letter: groupLetter,
        coach,
        city,
        color_primary: colorPrimary,
        players
      };

      await onSaveTeam(selectedTeamId, payload);
      setSuccessMsg('¡Datos del equipo y jugadores actualizados exitosamente en PostgreSQL!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content team-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon-badge">
              <Users size={18} />
            </div>
            <div>
              <h3>Gestión de Equipos y Jugadores</h3>
              <p className="modal-subtitle">Modifica datos oficiales del equipo, cuerpo técnico y nómina de voleibol</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Cerrar modal">
            <X size={18} />
          </button>
        </div>

        {/* Team selector pill row */}
        <div className="team-select-bar">
          <label className="select-label">Seleccionar Equipo:</label>
          <select 
            value={selectedTeamId} 
            onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            className="form-select team-dropdown"
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                Grupo {t.group_letter} - {t.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="team-form">
          {successMsg && (
            <div className="form-success-banner animate-fade-in">
              <Check size={16} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="form-error-banner animate-fade-in">
              {errorMsg}
            </div>
          )}

          {/* Team Basic Info Grid */}
          <div className="team-fields-grid">
            <div className="form-group">
              <label className="form-label">Nombre del Equipo</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Grupo (A, B o C)</label>
              <select
                className="form-select"
                value={groupLetter}
                onChange={(e) => setGroupLetter(e.target.value)}
              >
                <option value="A">Grupo A</option>
                <option value="B">Grupo B</option>
                <option value="C">Grupo C</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Director Técnico (Coach)</label>
              <input
                type="text"
                className="form-input"
                value={coach}
                onChange={(e) => setCoach(e.target.value)}
                placeholder="Nombre del DT"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ciudad / Localidad</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej. Córdoba"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color del Uniforme</label>
              <div className="color-picker-wrap">
                <input
                  type="color"
                  className="color-input"
                  value={colorPrimary}
                  onChange={(e) => setColorPrimary(e.target.value)}
                />
                <input
                  type="text"
                  className="form-input color-hex-input"
                  value={colorPrimary}
                  onChange={(e) => setColorPrimary(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Player Roster Section */}
          <div className="players-roster-section">
            <div className="roster-head">
              <div>
                <h4>Plantel de Jugadores ({players.length})</h4>
                <p className="roster-sub">Registra números, nombres y posiciones de juego</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddPlayer} 
                className="btn btn-sm btn-outline"
              >
                <Plus size={14} /> Agregar Jugador
              </button>
            </div>

            <div className="players-list-scroll">
              {players.map((player, idx) => (
                <div key={idx} className="player-row-item">
                  <div className="player-number-col">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="form-input player-num-input"
                      value={player.number}
                      onChange={(e) => handleUpdatePlayer(idx, 'number', e.target.value)}
                      title="Número de Camiseta"
                      required
                    />
                  </div>

                  <div className="player-name-col">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nombre y Apellido"
                      value={player.name}
                      onChange={(e) => handleUpdatePlayer(idx, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="player-pos-col">
                    <select
                      className="form-select"
                      value={player.position}
                      onChange={(e) => handleUpdatePlayer(idx, 'position', e.target.value)}
                    >
                      <option value="Armador">Armador</option>
                      <option value="Opuesto">Opuesto</option>
                      <option value="Punta Receptor">Punta Receptor</option>
                      <option value="Central">Central</option>
                      <option value="Líbero">Líbero</option>
                    </select>
                  </div>

                  <div className="player-captain-col">
                    <label className="captain-check-label" title="Capitán del equipo">
                      <input
                        type="checkbox"
                        checked={player.is_captain || false}
                        onChange={(e) => handleUpdatePlayer(idx, 'is_captain', e.target.checked)}
                      />
                      <Star size={14} className={player.is_captain ? 'captain-active' : ''} />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(idx)}
                    className="delete-player-btn"
                    title="Eliminar jugador"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cerrar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Cambios en PostgreSQL'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .team-modal-box {
          max-width: 760px;
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

        .team-select-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        .select-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-primary);
          white-space: nowrap;
        }
        .team-dropdown {
          flex: 1;
        }

        .team-fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .color-picker-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .color-input {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          background: transparent;
        }
        .color-hex-input {
          font-family: monospace;
          text-transform: uppercase;
        }

        /* Players roster */
        .players-roster-section {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 20px;
        }
        .roster-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .roster-head h4 {
          font-size: 0.98rem;
          color: #ffffff;
        }
        .roster-sub {
          font-size: 0.74rem;
          color: var(--text-dim);
        }
        .players-list-scroll {
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-right: 4px;
        }
        .player-row-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.7);
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .player-num-input {
          width: 54px;
          text-align: center;
          font-weight: 700;
          padding: 6px;
        }
        .player-name-col {
          flex: 1;
        }
        .player-pos-col {
          width: 160px;
        }
        .captain-check-label {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .captain-active {
          color: var(--color-accent);
          filter: drop-shadow(0 0 4px var(--color-accent));
        }
        .delete-player-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .delete-player-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .form-success-banner {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
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
        .modal-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
